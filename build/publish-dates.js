#!/usr/bin/env node
/*
  Update itemprop="datePublished" in HTML files to the file's creation date.
  - Uses `git log --diff-filter=A` to get the first commit date (ISO).
  - Falls back to fs.stat.birthtime if available; then to mtime.
  - Updates the element's content attribute and visible text (e.g., "October 25, 2022").
*/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function gitCreatedISO(filePath) {
  try {
    const cmd = `git log --diff-filter=A --follow --format=%aI -1 -- ${JSON.stringify(filePath)}`;
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function fsBirthISO(filePath) {
  try {
    const st = fs.statSync(filePath);
    const d = st.birthtime && st.birthtime.getTime() ? st.birthtime : st.mtime;
    return d.toISOString();
  } catch {
    return null;
  }
}

function gitModifiedISO(filePath) {
  try {
    const cmd = `git log --format=%aI -1 -- ${JSON.stringify(filePath)}`;
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function fsMtimeISO(filePath) {
  try {
    const st = fs.statSync(filePath);
    return st.mtime.toISOString();
  } catch {
    return null;
  }
}

function hasUncommittedGitChanges(filePath) {
  try {
    const out = execSync(`git status --porcelain -- ${JSON.stringify(filePath)}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out.length > 0;
  } catch {
    return false;
  }
}

function extractExistingDateModified(html) {
  const m = html.match(/itemprop=["']dateModified["'][^>]*content=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function humanDate(iso) {
  const d = new Date(iso);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function updateFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // datePublished → file creation date
  if (/itemprop=["']datePublished["']/i.test(html)) {
    const iso = gitCreatedISO(filePath) || fsBirthISO(filePath);
    if (iso) {
      const human = humanDate(iso);
      const newHtml = html
        // Replace or insert content attribute
        .replace(/(itemprop=["']datePublished["'][^>]*content=["'])[^"]*(["'])/i, `$1${iso}$2`)
        // Replace visible text immediately after the tag
        .replace(/(itemprop=["']datePublished["'][^>]*>)([^<]*)/i, (_, pre) => `${pre}${human}`);
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    }
  }

  // dateModified → update only when the last committed change is newer
  if (/itemprop=["']dateModified["']/i.test(html)) {
    const existing = extractExistingDateModified(html);
    const lastGit = gitModifiedISO(filePath);
    const hasUncommittedGitChangesFlag = hasUncommittedGitChanges(filePath);

    // Only update when there are uncommitted changes; use filesystem mtime for display
    if (hasUncommittedGitChangesFlag) {
      const isoMod = fsMtimeISO(filePath) || lastGit || new Date().toISOString();
      if (isoMod) {
        const humanMod = humanDate(isoMod);
        const newHtml = html
          .replace(/(itemprop=["']dateModified["'][^>]*content=["'])[^"]*(["'])/i, `$1${isoMod}$2`)
          .replace(/(itemprop=["']dateModified["'][^>]*>)([^<]*)/i, (_, pre) => `${pre}Updated: ${humanMod}`);
        if (newHtml !== html) {
          html = newHtml;
          changed = true;
        }
      }
    }
  }

  if (changed) fs.writeFileSync(filePath, html);
  return changed;
}

const targets = walk(path.join(ROOT, 'content'));
let updated = 0;
for (const f of targets) {
  if (updateFile(f)) updated++;
}

// Also check top-level files like index.html, cv.html, etc.
for (const name of ['index.html', 'cv.html', 'content.html']) {
  const f = path.join(ROOT, name);
  if (fs.existsSync(f)) if (updateFile(f)) updated++;
}

console.log(`publish-dates: updated ${updated} file(s).`);
