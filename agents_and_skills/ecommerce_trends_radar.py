#!/usr/bin/env python
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional

from pathlib import Path
import re
from typing import Any, Tuple
from pydantic import BaseModel, Field
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.flow.flow import Flow, listen, start
from crewai_tools import FileReadTool, SerperDevTool, ScrapeWebsiteTool, SeleniumScrapingTool


RADAR_OUTPUT_DIR = Path("reports/ecommerce-trends-radar")


def _callback_log_research_task(_: Any) -> None:
    print(f"\n[DONE] research_task -> {RADAR_OUTPUT_DIR / 'research.md'}")


def _callback_log_fact_check_task(_: Any) -> None:
    print("\n[DONE] fact_check_task")


def _callback_log_sources_task(_: Any) -> None:
    print(f"[DONE] sources_task -> {RADAR_OUTPUT_DIR / 'sources.md'}")


def _callback_log_trend_analysis_task(_: Any) -> None:
    print(f"[DONE] trend_analysis_task -> {RADAR_OUTPUT_DIR / 'trends.md'}")


def _callback_log_trends_json_task(_: Any) -> None:
    print(f"\n[DONE] trends_json_task -> {RADAR_OUTPUT_DIR / 'trends.json'}")


def _callback_log_trend_radar_task(_: Any) -> None:
    print(f"\n[DONE] trend_radar_task -> {RADAR_OUTPUT_DIR / 'trend-radar.html'}")


def _callback_log_blog_writing_task(_: Any) -> None:
    print(f"\n[DONE] blog_writing_task -> {RADAR_OUTPUT_DIR / 'report.md'}")


def _callback_log_seo_task(_: Any) -> None:
    print(f"\n[DONE] seo_task -> {RADAR_OUTPUT_DIR / 'seo.md'}")


def _callback_log_html_transform_task(_: Any) -> None:
    print(f"\n[DONE] html_transform_task -> {RADAR_OUTPUT_DIR / 'report.html'}")


def _raw_result_text(result: Any) -> str:
    if hasattr(result, "raw"):
        return str(result.raw or "")
    return str(result or "")


def _guardrail_validate_research_sources(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)
    urls = re.findall(r"https?://[^\s)>\]]+", text)
    unique_urls = set(urls)
    min_sources = 50

    if len(unique_urls) < min_sources:
        return (False, f"Research must include at least {min_sources} unique sources. Found: {len(unique_urls)}")

    return (True, result)


def _guardrail_validate_fact_check_output(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)
    required_statuses = ["Verified", "Partially verified", "Not verified", "Contradicted"]
    has_status = any(status in text for status in required_statuses)
    has_source = ("http://" in text) or ("https://" in text)

    if not has_status:
        return (False, "Fact-check output must include verification statuses.")
    if not has_source:
        return (False, "Fact-check output must include supporting source URLs.")
    return (True, result)


def _guardrail_validate_trend_output(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)

    stages = ["Innovators", "Early Adopters", "Early Majority", "Late Majority"]
    categories = [
        "Data & AI",
        "Advertising & Promotion",
        "Content & Experience",
        "CRM & Analytics",
        "Commerce & Sales",
        "Software Architecture",
    ]

    if "# Trend Hype Cycle Overview" not in text:
        return (False, "Trend output must include a Trend Hype Cycle Overview heading.")

    trend_blocks = re.split(r"^#{2,3}\s+Trend(?:\s+\d+)?\s*:", text, flags=re.MULTILINE)

    if len(trend_blocks) <= 1:
        return (False, "Trend output must contain trend entries.")

    category_counts = {category: 0 for category in categories}
    stage_counts = {stage: 0 for stage in stages}

    for block in trend_blocks[1:]:
        matched_category = None
        matched_stage = None

        for category in categories:
            if re.search(
                rf"(?im)^[\-\*\s]*\**Category\**\s*:\s*{re.escape(category)}\s*$",
                block,
            ):
                category_counts[category] += 1
                matched_category = category
                break

        for stage in stages:
            if re.search(
                rf"(?im)^[\-\*\s]*\**Stage\**\s*:\s*{re.escape(stage)}\s*$",
                block,
            ):
                stage_counts[stage] += 1
                matched_stage = stage
                break

        if not matched_category:
            snippet = block.strip().splitlines()[:6]
            return (
                False,
                "Every trend must include a valid category. "
                f"Failed block starts with: {' | '.join(snippet)}"
            )

        if not matched_stage:
            snippet = block.strip().splitlines()[:6]
            return (
                False,
                "Every trend must include a valid stage. "
                f"Failed block starts with: {' | '.join(snippet)}"
            )

    underfilled_categories = [
        f"{category} ({count})"
        for category, count in category_counts.items()
        if count < 10
    ]
    if underfilled_categories:
        return (
            False,
            f"Each category must contain at least 10 trends. Underfilled: {', '.join(underfilled_categories)}",
        )

    underfilled_stages = [
        f"{stage} ({count})"
        for stage, count in stage_counts.items()
        if count < 2
    ]
    if underfilled_stages:
        return (
            False,
            f"Each stage must contain at least 2 trends. Underfilled: {', '.join(underfilled_stages)}",
        )

    return (True, result)


def _guardrail_validate_trends_json_output(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)

    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        return (False, f"Trends JSON output must be valid JSON: {exc}")

    if not isinstance(payload, dict):
        return (False, "Trends JSON output must be a JSON object.")

    trends = payload.get("trends")
    if not isinstance(trends, list) or not trends:
        return (False, 'Trends JSON output must include a non-empty "trends" array.')

    required_fields = {"name", "category", "stage", "summary", "sources"}
    for index, trend in enumerate(trends, start=1):
        if not isinstance(trend, dict):
            return (False, f"Trend #{index} must be a JSON object.")

        missing = sorted(required_fields - set(trend))
        if missing:
            return (False, f"Trend #{index} is missing required fields: {', '.join(missing)}")

        if not isinstance(trend["sources"], list):
            return (False, f'Trend #{index} field "sources" must be an array.')

    return (True, result)


def _guardrail_validate_trend_radar_output(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)

    required_bits = [
        "<html",
        "<svg",
        "Trend Overview",
        "Data & AI",
        "Advertising & Promotion",
        "Content & Experience",
        "CRM & Analytics",
        "Commerce & Sales",
        "Software Architecture",
        "Innovators",
        "Early Adopters",
        "Early Majority",
        "Late Majority",
    ]

    missing = [item for item in required_bits if item not in text]
    if missing:
        return (False, f"Trend radar output is missing required elements: {', '.join(missing)}")

    return (True, result)


def _guardrail_validate_blog_output(result: Any) -> Tuple[bool, Any]:
    text = _raw_result_text(result)

    if "## Sources" not in text and "# Sources" not in text:
        return (False, "Blog output must include a Sources section.")

    sources_split = re.split(r"^##\s+Sources|^#\s+Sources", text, maxsplit=1, flags=re.MULTILINE)
    body_text = sources_split[0]

    sections = re.split(r"^##\s+", body_text, flags=re.MULTILINE)
    for section in sections[1:]:
        quote_count = section.count("> ")
        if quote_count > 1:
            return (False, "Each section may contain at most 1 quote.")

    body_urls = re.findall(r"https?://[^\s)>\]]+", body_text)
    if len(body_urls) != len(set(body_urls)):
        return (False, "Each source may be used at most once in the article body.")

    return (True, result)


@CrewBase
class EcommerceTrendsRadarCrew:
    """Content writing crew"""

    agents_config = "config/ecommerce_trends_radar_agents.yaml"
    tasks_config = "config/ecommerce_trends_radar_tasks.yaml"
    inputs_config = "config/ecommerce_trends_radar_inputs.yaml"

    agents: List[BaseAgent]
    tasks: List[Task]


    # -----------------------------
    # Helpers
    # -----------------------------

    def _inputs(self) -> dict[str, Any]:
        return getattr(self, "inputs", {}) or {}

    def _get_output_dir(self) -> Path:
        output_dir = RADAR_OUTPUT_DIR
        output_dir.mkdir(parents=True, exist_ok=True)
        return output_dir

    def _get_output_path(self, filename: str) -> str:
        return str(self._get_output_dir() / filename)

    def _file_is_recent(self, filename: str, max_days: int = 30) -> bool:
        print(f"[INFO] check if exist and recent: {filename} ")
        
        file_path = Path(filename)

        if not file_path.exists() and not file_path.is_absolute():
            file_path = self._get_output_dir() / filename

        if not file_path.exists():
            print(f"[INFO] {file_path.name} does not exist.")
            return False

        cutoff = datetime.now() - timedelta(days=max_days)
        modified_at = datetime.fromtimestamp(file_path.stat().st_mtime)
        is_recent = modified_at >= cutoff
        if not is_recent:
            print(f"[INFO] {file_path.name} exists but is not recent and more then {max_days} days old.")
            return False
        else:
            print(f"[INFO] {file_path.name} exists and is recent.")
        return True

    def _get_sources_file_path(self) -> str:
        return str(self._get_output_dir() / "sources.md")

    def _sources_file_exists(self) -> bool:
        file = Path(self._get_sources_file_path())
        file_exists = file.exists()
        print(f"[INFO] sources.md exists: {file_exists} -> {file}")
        return file_exists

    def _get_validation_urls(self) -> list[str]:
        urls = self._inputs().get("validation_urls", [])

        print(f"[DEBUG] validation_urls count: {len(urls) if isinstance(urls, list) else 0}")
        if isinstance(urls, list):
            return [str(url).strip() for url in urls if str(url).strip()]
        return []

    def _count_sources(self, file_path: str) -> int:
        try:
            text = Path(file_path).read_text(encoding="utf-8")
            # count URLs
            return len(set(re.findall(r"https?://[^\s)>\]]+", text)))
        except Exception:
            return 0


    def _count_trends(self, file_path: str) -> int:
        try:
            text = Path(file_path).read_text(encoding="utf-8")
            # each trend starts with "## Trend:"
            return len(re.findall(r"^##\s+Trend:", text, flags=re.MULTILINE))
        except Exception:
            return 0

    def _scraping_strategy_instructions(self) -> str:
        return """
Scraping strategy:
1. Always try the standard website scraper first.
2. Evaluate the result before trusting it.

Skip URLs immediately if:
- the page returns a 404 or "not found"
- the page is clearly broken or empty
- the page contains error messages instead of real content

Do NOT attempt to scrape or retry these URLs.

3. If the result contains signs of blocked or incomplete content, retry the same URL with the Selenium scraper.
4. Work efficiently and avoid unnecessary retries. If a page cannot be scraped after one retry with Selenium, move on.

Treat the scrape as failed or incomplete when you see signals like:
- "Please enable JS"
- "Please enable JavaScript"
- "disable any ad blocker"
- "Access denied"
- "Are you human"
- "Please login"
- CAPTCHA or anti-bot language
- very little text
- generic placeholder content
- clearly truncated or incomplete page content

Use Selenium as the fallback for:
- JavaScript-rendered pages
- bot-protected pages
- pages where the normal scraper returns incomplete or misleading content

Do not rely on blocked/fallback pages as source content.
"""

    def _scraping_tools(self, include_selenium: bool = False) -> list[Any]:
        tools: list[Any] = [ScrapeWebsiteTool()]
        if not include_selenium:
            return tools

        try:
            tools.append(SeleniumScrapingTool())
        except Exception as exc:
            print(f"[WARN] SeleniumScrapingTool unavailable, skipping fallback scraper: {exc}")

        return tools

    def _raw_text(self, result: Any) -> str:
        if hasattr(result, "raw"):
            return str(result.raw or "")
        return str(result or "")

    def _validate_research_sources(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)
        urls = re.findall(r"https?://[^\s)>\]]+", text)
        unique_urls = set(urls)

        min_sources = int(self._inputs().get("min_sources", 50))
        if len(unique_urls) < min_sources:
            return (False, f"Research must include at least {min_sources} unique sources. Found: {len(unique_urls)}")

        return (True, result)

    def _validate_fact_check_output(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)
        required_statuses = ["Verified", "Partially verified", "Not verified", "Contradicted"]
        has_status = any(status in text for status in required_statuses)
        has_source = ("http://" in text) or ("https://" in text)

        if not has_status:
            return (False, "Fact-check output must include verification statuses.")
        if not has_source:
            return (False, "Fact-check output must include supporting source URLs.")
        return (True, result)

    def _validate_trend_output(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)

        stages = ["Innovators", "Early Adopters", "Early Majority", "Late Majority"]
        categories = [
            "Data & AI",
            "Advertising & Promotion",
            "Content & Experience",
            "CRM & Analytics",
            "Commerce & Sales",
            "Software Architecture",
        ]

        if "# Trend Hype Cycle Overview" not in text:
            return (False, "Trend output must include a Trend Hype Cycle Overview heading.")

        # More tolerant split: allow ## Trend:, ### Trend:, ## Trend 1:, etc.
        trend_blocks = re.split(r"^#{2,3}\s+Trend(?:\s+\d+)?\s*:", text, flags=re.MULTILINE)

        if len(trend_blocks) <= 1:
            return (False, "Trend output must contain trend entries.")

        category_counts = {category: 0 for category in categories}
        stage_counts = {stage: 0 for stage in stages}

        for block in trend_blocks[1:]:
            matched_category = None
            matched_stage = None

            # tolerate -, *, bold labels, extra whitespace
            for category in categories:
                if re.search(
                    rf"(?im)^[\-\*\s]*\**Category\**\s*:\s*{re.escape(category)}\s*$",
                    block,
                ):
                    category_counts[category] += 1
                    matched_category = category
                    break

            for stage in stages:
                if re.search(
                    rf"(?im)^[\-\*\s]*\**Stage\**\s*:\s*{re.escape(stage)}\s*$",
                    block,
                ):
                    stage_counts[stage] += 1
                    matched_stage = stage
                    break

            if not matched_category:
                snippet = block.strip().splitlines()[:6]
                return (
                    False,
                    "Every trend must include a valid category. "
                    f"Failed block starts with: {' | '.join(snippet)}"
                )

            if not matched_stage:
                snippet = block.strip().splitlines()[:6]
                return (
                    False,
                    "Every trend must include a valid stage. "
                    f"Failed block starts with: {' | '.join(snippet)}"
                )

        underfilled_categories = [
            f"{category} ({count})"
            for category, count in category_counts.items()
            if count < 10
        ]
        if underfilled_categories:
            return (
                False,
                f"Each category must contain at least 10 trends. Underfilled: {', '.join(underfilled_categories)}",
            )

        underfilled_stages = [
            f"{stage} ({count})"
            for stage, count in stage_counts.items()
            if count < 2
        ]
        if underfilled_stages:
            return (
                False,
                f"Each stage must contain at least 2 trends. Underfilled: {', '.join(underfilled_stages)}",
            )

        return (True, result)

    def _get_trend_radar_file_path(self) -> str:
        return str(self._get_output_dir() / "trend-radar.html")

    def _trend_radar_file_exists(self) -> bool:
        return Path(self._get_trend_radar_file_path()).exists()

    def _validate_trend_radar_output(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)

        required_bits = [
            "<html",
            "<svg",
            "Trend Overview",
            "Data & AI",
            "Advertising & Promotion",
            "Content & Experience",
            "CRM & Analytics",
            "Commerce & Sales",
            "Software Architecture",
            "Innovators",
            "Early Adopters",
            "Early Majority",
            "Late Majority",
        ]

        missing = [item for item in required_bits if item not in text]
        if missing:
            return (False, f"Trend radar output is missing required elements: {', '.join(missing)}")

        return (True, result)

    def _validate_trends_json_output(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)

        try:
            payload = json.loads(text)
        except json.JSONDecodeError as exc:
            return (False, f"Trends JSON output must be valid JSON: {exc}")

        if not isinstance(payload, dict):
            return (False, "Trends JSON output must be a JSON object.")

        trends = payload.get("trends")
        if not isinstance(trends, list) or not trends:
            return (False, 'Trends JSON output must include a non-empty "trends" array.')

        required_fields = {"name", "category", "stage", "summary", "sources"}
        for index, trend in enumerate(trends, start=1):
            if not isinstance(trend, dict):
                return (False, f"Trend #{index} must be a JSON object.")

            missing = sorted(required_fields - set(trend))
            if missing:
                return (False, f"Trend #{index} is missing required fields: {', '.join(missing)}")

            if not isinstance(trend["sources"], list):
                return (False, f'Trend #{index} field "sources" must be an array.')

        return (True, result)


    def _validate_blog_output(self, result: Any) -> Tuple[bool, Any]:
        text = self._raw_text(result)

        if "## Sources" not in text and "# Sources" not in text:
            return (False, "Blog output must include a Sources section.")

        # Split body from Sources section
        sources_split = re.split(r"^##\s+Sources|^#\s+Sources", text, maxsplit=1, flags=re.MULTILINE)
        body_text = sources_split[0]

        # Check quote count per section in body only
        sections = re.split(r"^##\s+", body_text, flags=re.MULTILINE)
        for section in sections[1:]:
            quote_count = section.count("> ")
            if quote_count > 1:
                return (False, "Each section may contain at most 1 quote.")

        # Check duplicate URLs only in body, not in Sources section
        body_urls = re.findall(r"https?://[^\s)>\]]+", body_text)
        if len(body_urls) != len(set(body_urls)):
            return (False, "Each source may be used at most once in the article body.")

        return (True, result)

    def _log_task_complete(self, task_name: str, output_file: str | None = None):
        if output_file and Path(output_file).exists():
            print(f"\n[DONE] {task_name} -> {output_file}")
        elif output_file:
            print(f"\n[DONE] {task_name} -> output expected at {output_file}")
        else:
            print(f"\n[DONE] {task_name}")

    def _log_sources(self, file_path: str):
        count = self._count_sources(file_path)
        print(f"[DONE] sources_task -> {file_path} ({count} sources)")

    def _log_trends(self, file_path: str):
        count = self._count_trends(file_path)
        print(f"[DONE] trend_analysis_task -> {file_path} ({count} trends)")

    def _cli_gate(self, task_name: str, output_file: str | None = None):
        print(f"\n[REVIEW] {task_name}")
        if output_file:
            print(f"Output file: {output_file}")

        while True:
            print("\nChoose an action:")
            print("  1) Approve and continue")
            print("  2) Retry task")
            print("  3) Stop pipeline")
            choice = input("> ").strip()

            if choice == "1":
                print(f"\n[APPROVED] {task_name}")
                if output_file:
                    print(f"\n[DONE] {task_name} -> {output_file}")
                else:
                    print(f"\n[DONE] {task_name}")
                return

            if choice == "2":
                raise Exception(f"RETRY_TASK::{task_name}")

            if choice == "3":
                raise Exception(f"STOP_PIPELINE::{task_name}")

            print("Invalid choice. Please enter 1, 2, or 3.")




    # -----------------------------
    # Agents
    # -----------------------------

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],  # type: ignore[index]
            tools=[
                FileReadTool(n_results=100),
                SerperDevTool(),
                ScrapeWebsiteTool(),
            ],
            verbose=False,
            max_iter=2,
            max_rpm=20,
        )

    @agent
    def sources_curator(self) -> Agent:
        return Agent(
            config=self.agents_config["sources_curator"],  # type: ignore[index]
            verbose=False,
        )

    @agent
    def fact_checker(self) -> Agent:
        return Agent(
            config=self.agents_config["fact_checker"],  # type: ignore[index]
            tools=self._scraping_tools(include_selenium=True),
            max_iter=1,
            max_rpm=10,
            verbose=False,
        )

    @agent
    def trend_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["trend_analyst"],  # type: ignore[index]
            verbose=False,
        )

    @agent
    def trend_radar_designer(self) -> Agent:
        return Agent(
            config=self.agents_config["trend_radar_designer"],  # type: ignore[index]
            tools=[FileReadTool(n_results=200)],
            verbose=False,
        )

    @agent
    def blog_writer(self) -> Agent:
        return Agent(
            config=self.agents_config["blog_writer"],  # type: ignore[index]
            verbose=False,
        )

    @agent
    def seo_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["seo_specialist"],  # type: ignore[index]
            verbose=False,
        )

    @agent
    def html_formatter(self) -> Agent:
        return Agent(
            config=self.agents_config["html_formatter"],  # type: ignore[index]
            verbose=False,
        )
    
    # -----------------------------
    # Tasks
    # -----------------------------

    @task
    def research_task(self) -> Task:
        base_task = self.tasks_config["research_task"]  # type: ignore[index]
        validation_urls = self._get_validation_urls()
        sources_file_path = self._get_sources_file_path()
        sources_file_exists = self._sources_file_exists()
        output_file = self._get_output_path("research.md")

        if self._file_is_recent(output_file):
            print(f"[SKIP] Skipping research task.")
            return Task(
                config={
                    **base_task,
                    "description": f'{base_task["description"]}\n\n[SKIP] {Path(output_file).name} exists and is recent.',
                },
                agent=self.researcher(),
                callback=_callback_log_research_task,
            )


        if validation_urls:
            trusted_urls_block = "\n".join(f"- {url}" for url in validation_urls)
            trusted_sources_instruction = f"""
Use the following trusted webpages as part of the research phase as well:

{trusted_urls_block}
"""
        else:
            trusted_sources_instruction = """
No trusted validation URLs were provided in inputs.
"""

        if sources_file_exists:
            source_discovery_instruction = f"""
A sources file already exists at:

{sources_file_path}

Research instructions:
1. Read and use the URLs from that existing sources.md file first.
2. Count the valid sources from that file.
3. If there are already at least 50 valid sources, do not use SerperDevTool.
4. If there are fewer than 50 valid sources, use SerperDevTool only to fill the gap.
5. Use focused searches to add only as many new sources as needed.
6. Prefer sources that add diversity, stronger evidence, or a missing perspective.
"""
        else:
            source_discovery_instruction = """
No sources.md file exists yet.

Research instructions:
1. Use the trusted URLs first, if provided.
2. Then use SerperDevTool to discover candidate sources in batches.
3. Use SerperDevTool in focused batches. Search with 4 to 6 distinct query angles, for example:
    - trends
    - market report
    - analyst perspective
    - case study
    - statistics
    - vendor perspective
    - software architecture perspective
    Prefer source diversity over repeated searches with similar wording.
4. Aim to collect at least 50 valid unique sources in total, including trusted sources.
5. Use no more than 6 Serper searches unless the guardrail says more are needed.
6. Use multiple queries and perspectives (e.g. trends, reports, case studies, statistics, software architecture).
7. Do not scrape every discovered source. Use SerperDevTool to discover sources first. Only scrape a smaller subset of the most relevant and promising sources for deeper content extraction.
8. Select only relevant, working, non-404 URLs.
9. Skip broken, empty, blocked, or unusable pages.
10. Do not retry the same action more than once.
11. Return a clean list of all sources used so they can be written to sources.md.
"""

        extra_instructions = f"""
{self._scraping_strategy_instructions()}

{trusted_sources_instruction}

{source_discovery_instruction}

Focus on:
1. Collecting useful background information
2. Identifying major claims, findings, trends, and insights
3. Highlighting which claims appear most important to verify later
4. Listing all sources used, split into:
   - Trusted sources
   - Additional sources
5. Ensure diversity across:
   - vendors (commercetools, salesforce, Shopify, Adobe, SAP, etc.)
   - analysts (Gartner, McKinsey, Forrester)
   - blogs and practitioner content
   - recent reports (last 1–2 years)

Do not fully validate every claim yet.
The next agent will fact-check the important claims.

MANDATORY OUTPUT REQUIREMENTS:
- Include a section exactly titled: "## Trusted sources"
- Include a section exactly titled: "## Additional sources"
- Under each section, list one full URL per bullet
- Do not summarize sources without listing the full URLs
- The "## Additional sources" section must contain at least 50 unique URLs in total when no existing sources.md file is available

"""

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.researcher(),
            guardrail=_guardrail_validate_research_sources,
            output_file=output_file,
            callback=_callback_log_research_task,
        )

    @task
    def fact_check_task(self) -> Task:
        base_task = self.tasks_config["fact_check_task"]  # type: ignore[index]

        validation_urls = self._get_validation_urls()
        if validation_urls:
            urls_block = "\n".join(f"- {url}" for url in validation_urls)
            source_instruction = f"""
Fact-check the research findings against the following trusted webpages:

{urls_block}

Instructions:
1. Review the important claims from the previous task.
2. Inspect the trusted URLs above.
3. Do not re-check the same URL multiple times.
4. For each important claim, classify it as:
   - Verified
   - Partially verified
   - Not verified
   - Contradicted
5. Always include:
   - the supporting URL
   - a short exact quote from that page
6. Add the full list of sources used at the end.
7. If no evidence is found in the trusted URLs, mark the claim as Not verified.
8. Do not fabricate quotes or citations.
9. Do not introduce major new claims unless they come directly from the trusted URLs.
"""
        else:
            source_instruction = """
No trusted validation URLs were provided in inputs.

Instructions:
1. Review the important claims from the previous task.
2. Do not re-check the same URL multiple times.
3. Clearly state that no trusted validation URLs were supplied.
4. Mark claims as Unverified unless they can be directly supported by provided source material.
5. Do not fabricate quotes or citations.
6. Add the full list of sources used at the end.

MANDATORY OUTPUT REQUIREMENTS:
- At the end of the output, include a section exactly titled: "## Fact-check sources"
- Under that section, list one full URL per bullet for every source used in fact-checking
"""

        extra_instructions = self._scraping_strategy_instructions()

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{source_instruction}\n{extra_instructions}',
            },
            agent=self.fact_checker(),
            guardrail=_guardrail_validate_fact_check_output,
            callback=_callback_log_fact_check_task,
        )

    @task
    def sources_task(self) -> Task:
        base_task = self.tasks_config["sources_task"]  # type: ignore[index]
        output_file = self._get_output_path("sources.md")

        if self._file_is_recent(output_file):
            print(f"[SKIP] Skipping sources task.")
            return Task(
                config={
                    **base_task,
                    "description": f'{base_task["description"]}\n\n[SKIP] {Path(output_file).name} exists and is recent.',
                },
                agent=self.sources_curator(),
                callback=_callback_log_sources_task,
            )

        research = self.research_task()
        fact_check = self.fact_check_task()

        extra_instructions = """
    Create a clean list of all sources used.

    Rules:
    1. Read the outputs of research_task and fact_check_task.
    2. Extract all URLs mentioned in these sections when present:
       - ## Trusted sources
       - ## Additional sources
       - ## Fact-check sources
    3. Remove duplicates.
    4. Exclude broken, invalid, unauthorized, empty, or unusable URLs.
    5. Separate:
       - Trusted sources (from input)
       - Additional sources (discovered during research)
    6. If no additional sources were used, explain why.
    7. Output clean markdown.
    """

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.sources_curator(),
            context=[research, fact_check],
            output_file=output_file,
            callback=_callback_log_sources_task,
        )
    
    @task
    def trend_analysis_task(self) -> Task:
        base_task = self.tasks_config["trend_analysis_task"]  # type: ignore[index]
        output_file = self._get_output_path("trends.md")

        if self._file_is_recent(output_file):
            print(f"[SKIP] Skipping trend analysis task.")
            return Task(
                config={
                    **base_task,
                    "description": f'{base_task["description"]}\n\n[SKIP] {Path(output_file).name} exists and is recent.',
                },
                agent=self.trend_analyst(),
                callback=_callback_log_trend_analysis_task,
            )

        extra_instructions = """
    Create a clear trend overview based on the validated material.
    If the validated material does not explicitly provide enough trends, infer closely related, clearly supportable trend variants from the same evidence base. Do not invent unrelated trends.

    Instructions:
    1. Extract the most relevant trends from the research and fact-check results.
    2. Include only trends that are meaningfully supported by the validated material.
    3. For each trend, assign exactly one stage:
       - Innovators
       - Early Adopters
       - Early Majority
       - Late Majority
    4. For each trend, assign exactly one category:
       - Data & AI
       - Advertising & Promotion
       - Content & Experience
       - CRM & Analytics
       - Commerce & Sales
       - Software Architecture
    5. You must include at least 10 trends per category.
    6. You must include at least 2 trends per stage.
    7. Use the exact field labels "Category:" and "Stage:" exactly as written.
    8. If the validated material does not explicitly provide enough trends, infer closely related,
       clearly supportable trend variants from the same evidence base.
    9. Do not invent unrelated trends.
    10. Add a short explanation for each classification.
       - Do not include vendor names in the explanation. Analyst names are allowed.
    11. Keep the wording practical and easy to understand.
    12. Output valid markdown.

    Trend name optimization rules:
    13. Trend names must be short, clear, and radar-friendly.
    14. Prefer 1 to 4 words per trend name.
    15. Avoid long sentence-like trend names.
    16. Avoid unnecessary qualifiers like "supporting buying workflows", "at scale", or "by default" unless essential.
    17. Prefer naming the core trend, not the full use case description.
    18. Avoid overlapping trend names that describe nearly the same thing.
    19. If two candidate trends are very similar, make the distinction explicit by giving each a different angle
        such as internal operations, customer experience, analytics, architecture, or process automation.
    20. Trend names should be easy to read on a radar and in a grouped list below the radar.
    21. Use title-style naming, concise and professional.
    22. Prefer names like:
        - Semantic product discovery
        - Agentic catalog onboarding
        - Hybrid sales attribution
        - Composable commerce adoption
    23. Avoid names like:
        - Semantic/vector search for technical product discovery
        - Procurement concierge agents supporting buying workflows
        - Multi-ship-to, PO checkout, and tax exemptions by default
    24. For declining or legacy practices, name them as a directional trend, for example:
        - Decline of manual quoting
        - Decline of static PDF catalogs
        - Decline of generic batch email
    25. Categorize each trend by its primary business value, not just by the underlying technology.

    Suggested format (use this exact structure for every trend):

    # Trend Hype Cycle Overview

    ## Trend: <name>
    - Category: <category>
    - Stage: <stage>
    - Why it fits here: <short explanation>
    - Sources: <source 1>; <source 2>

    ## Trend: <name>
    - Category: <category>
    - Stage: <stage>
    - Why it fits here: <short explanation>
    - Sources: <source 1>; <source 2>
    """

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
                "markdown": True,
            },
            agent=self.trend_analyst(),
            guardrail=_guardrail_validate_trend_output,
            output_file=output_file,
            callback=_callback_log_trend_analysis_task,
        )

    @task
    def trends_json_task(self) -> Task:
        base_task = self.tasks_config["trends_json_task"]  # type: ignore[index]
        trends_file = self._get_output_path("trends.md")
        output_file = self._get_output_path("trends.json")

        if self._file_is_recent(output_file):
            print(f"[SKIP] Skipping trends JSON task.")
            return Task(
                config={
                    **base_task,
                    "description": f'{base_task["description"]}\n\n[SKIP] {Path(output_file).name} exists and is recent.',
                },
                agent=self.trend_radar_designer(),
                callback=_callback_log_trends_json_task,
            )

        extra_instructions = f"""
    Read this markdown file first:
    {trends_file}

    Convert the markdown trend list into strict JSON.

    Output requirements:
    1. Output valid JSON only.
    2. Use a top-level object with one key: "trends".
    3. "trends" must be an array of objects.
    4. Each trend object must include exactly these keys:
       - name
       - category
       - stage
       - summary
       - sources
    5. "summary" should be based on the "Why it fits here" text.
    6. "sources" must be an array of source URLs or source strings extracted from the markdown.
    7. Do not invent trends that are not present in the markdown.
    8. Preserve all trend entries from the markdown.
    """

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.trend_radar_designer(),
            context=[self.trend_analysis_task()],
            guardrail=_guardrail_validate_trends_json_output,
            output_file=output_file,
            callback=_callback_log_trends_json_task,
        )

    @task
    def trend_radar_task(self) -> Task:
        base_task = self.tasks_config["trend_radar_task"]  # type: ignore[index]
        output_file = self._get_output_path("trend-radar.html")
        trends_file = self._get_output_path("trends.md")
        trends_json_file = self._get_output_path("trends.json")
        existing_radar_file = self._get_trend_radar_file_path()
        existing_radar_exists = self._trend_radar_file_exists()

        if existing_radar_exists:
            reference_instruction = f"""
    An existing trend radar HTML file already exists at:
    {existing_radar_file}

    Use that file as the primary reference for look and feel.

    Instructions:
    1. Read the existing trend-radar.html file first.
    2. Preserve the current structure, styling, layout, SVG setup, interactions, and overall visual design.
    3. Only update the underlying trend data and any related rendering logic needed to reflect the latest trends.md content.
    4. Keep the same Future CX styling and visual behavior unless a small change is necessary for correctness.
    5. Do not redesign the radar from scratch.
    6. Treat the existing HTML as the template to update.
    """
        else:
            reference_instruction = """
    No existing trend-radar.html file exists yet.

    Create a new standalone HTML trend radar from scratch.
    """

        extra_instructions = f"""
    Read the trend list from this file first:
    {trends_file}

    If available, also use this JSON file as the structured source of truth:
    {trends_json_file}

    {reference_instruction}

    Visualization requirements:
    1. Use a circular radar layout.
    2. Divide the radar into 6 category slices:
       - Data & AI
       - Advertising & Promotion
       - Content & Experience
       - CRM & Analytics
       - Commerce & Sales
       - Software Architecture
    3. Use concentric rings from inside to outside for:
       - Late Majority
       - Early Majority
       - Early Adopters
       - Innovators
    4. Place one dot for each trend in the correct slice and ring.
    5. Spread dots within each slice/ring so they do not overlap too much.
    6. Show the trend name in a tooltip, hover state.
    7. The tooltip should include the trend summary.
    8. When click on the dot, or tooltip, create a small card on the top right, over the radar, including the trend name, trend summary and list of sources including links.
    9. The legend should be below the radar.
    10. Output a complete standalone HTML file.
    11. Use semantic, readable HTML/CSS/JS.
    12. Use SVG for the radar itself.

    Below the radar, add a full trend list:
    13. Add a section titled "Trend Overview".
    14. List all trends below the radar, grouped first by category and then by stage.
    15. The categories in column horizontally
    16. Under each category, show the stages in this order:
        - Innovators
        - Early Adopters
        - Early Majority
        - Late Majority
    17. Under each stage, list all trend names that belong there.
    18. Make the list easy to scan and visually aligned with the radar categories.

    Future CX styling:
    - Use a white background mode
    - Use subtle neutral grays for grid/rings/text
    - Use distinct but harmonious colors per category
    - Keep the design clean, modern, and readable
    - No external dependencies required
    - When creating dots, prevent position transformations. Only size transformations are allowed.

    Output requirements:
    - Include all CSS and JS inline in the HTML
    - Make the radar usable without extra build steps
    - Title the page clearly
    - Include a small legend for categories and stages
    - Keep the file publishable and editor-friendly
    """

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.trend_radar_designer(),
            context=[self.trends_json_task()],
            guardrail=_guardrail_validate_trend_radar_output,
            output_file=output_file,
            callback=_callback_log_trend_radar_task,
        )

    @task
    def blog_writing_task(self) -> Task:
        base_task = self.tasks_config["blog_writing_task"]  # type: ignore[index]
        output_file = self._get_output_path("report.md")

        extra_instructions = """
Write the article in a natural, engaging blog style suitable for Future CX.

CRITICAL RULES (STRICT):
1. Use MAXIMUM 1 quote per section
2. Use each source MAXIMUM once in the entire article
3. Do NOT include multiple quotes from the same source
4. Quotes are optional — only include them when they add real value

Quote usage:
- A quote must support a key point
- After each quote, provide a clear explanation in your own words
- The explanation MUST be longer than the quote
- Never stack quotes back-to-back

Writing style:
- Write like an experienced practitioner sharing perspective
- Use simple, direct language
- Prefer clear, flowing paragraphs
- Vary sentence length, but avoid long dense paragraphs
- Avoid jargon-heavy or report-like phrasing
- Avoid sounding like a consultant memo, analyst note, or whitepaper summary
- Avoid stacking statistics

Readability rules:
- Each section should communicate one main idea
- Each section should have 4-8 paragraphs
- Keep most paragraphs to 2-4 sentences
- Use transitions between sections so the article flows naturally
- Prefer explanation and interpretation over stacking statistics
- Do not overload a paragraph with multiple statistics, percentages or quotes
- Use at most one statistic or quoted source per paragraph
- After any quoted fact, explain in plain language why it matters
- Break up dense sections into shorter paragraphs
- Write for a busy reader: make the article easy to scan, but pleasant to read from top to bottom

Structure:
- Start with a strong introduction that feels relevant and easy to read
- Each section should:
  1. introduce one key idea
  2. explain what is changing
  3. explain why it matters in practice
- End with a practical conclusion

Content rules:
- Use verified facts as the foundation
- Do not present unverified claims as facts
- Do not mirror the fact-check structure
- Rewrite source material into a natural narrative

Formatting:
- Prefer paragraphs over bullet points
- Use bullet points only when they genuinely improve readability
- Maximum one short bullet list per section
- Output valid markdown
- Include the full list of sources at the end

Tone:
- Practical
- Warm but professional
- Insightful, not academic
- Credible, not overly technical
"""

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
                "markdown": True,
            },
            agent=self.blog_writer(),
            guardrail=_guardrail_validate_blog_output,
            output_file=output_file,
            callback=_callback_log_blog_writing_task,
        )

    @task
    def seo_task(self) -> Task:
        base_task = self.tasks_config["seo_task"]  # type: ignore[index]
        output_file = self._get_output_path("seo.md")

        extra_instructions = """
Create an SEO layer for the blog article.

Focus on:
1. A strong SEO title
2. A compelling meta description
3. A clear focus keyword
4. Relevant secondary keywords
5. A suggested URL slug
6. Internal linking suggestions
7. Limited heading refinements where useful

Rules:
- Preserve readability
- Do not over-optimize
- Do not introduce unsupported claims
- Do not make the article more technical or more keyword-heavy than necessary
- Protect readability over perfect keyword density
- Keep suggestions aligned with Future CX style
"""

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.seo_specialist(),
            output_file=output_file,
            callback=_callback_log_seo_task,
        )

    @task
    def html_transform_task(self) -> Task:
        base_task = self.tasks_config["html_transform_task"]  # type: ignore[index]
        output_file = self._get_output_path("report.html")

        extra_instructions = """
Transform the previous markdown blog into Future CX article HTML.

Required Future CX article structure:
1. Article title as <h1>
2. Metadata block near the top:
   - SEO meta description
   - SEO meta keywords
3. Lead introduction paragraph or short intro section
4. Main body with:
   - <h2 class="h2 mt-4"> for major sections
   - <h3 class="h3 mt-4"> only for sub-sections when useful
   - <p class="mb-2 pb-2"> for normal paragraphs
   - <ul class="mt-1 mb-2 pb-2 ps-4"> for unordered lists
   - <ol class="mt-1 mb-2 pb-2 ps-4"> for ordered lists
   - <li> for list items
   - <a> for links
   - <blockquote> for quotes
5. Final "Sources" section with all the sources

Output rules:
- Output ONLY the article body HTML
- Do NOT output <html>, <head>, <body>, <style>, or <script>
- Do NOT invent new content
- Do NOT remove nuance from verified vs unverified claims
- Preserve source references in a readable section at the bottom
- Keep the HTML clean and ready for CMS paste
"""

        return Task(
            config={
                **base_task,
                "description": f'{base_task["description"]}\n{extra_instructions}',
            },
            agent=self.html_formatter(),
            output_file=output_file,
            callback=_callback_log_html_transform_task,
        )

    # -----------------------------
    # Starting point
    # -----------------------------
    
    @crew
    def crew(self) -> Crew:
        """Creates the crew"""

        tasks = [
            self.research_task(),
            self.fact_check_task(),
        ]

        if not self._sources_file_exists():
            tasks.append(self.sources_task())
        else:
            existing_file = self._get_sources_file_path()
            existing_count = self._count_sources(existing_file)
            print(f"\n[SKIP] sources_task -> existing file kept: {existing_file} ({existing_count} sources)")

        tasks.extend([
            self.trend_analysis_task(),
            self.trends_json_task(),
            #self.trend_radar_task(),
            #self.blog_writing_task(),
            #self.seo_task(),
            #self.html_transform_task(),
        ])

        return Crew(
            agents=self.agents,
            tasks=tasks,
            process=Process.sequential,
            verbose=False,
        )
