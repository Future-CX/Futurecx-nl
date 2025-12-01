#!/usr/bin/env node
/*
  Update itemprop="datePublished" in HTML files to the file's creation date.
  - Uses `git log --diff-filter=A` to get the first commit date (ISO).
  - Falls back to fs.stat.birthtime if available; then to mtime.
  - Updates the element's content attribute and visible text (e.g., "October 25, 2022").
*/
const fs = require('fs');
const configureLogger = require('./logger');
const log = configureLogger('Dates');
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

// function extractExistingDateModified(html) {
//   const m = html.match(/itemprop=["']dateModified["'][^>]*content=["']([^"']+)["']/i);
//   return m ? m[1] : null;
// }

function humanDate(iso) {
  const d = new Date(iso);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function toLocalOffsetISOString(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const pad = (n) => String(Math.abs(Math.trunc(n))).padStart(2, '0');

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  const offsetMinutes = -d.getTimezoneOffset(); // e.g. +120 for +02:00
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad(Math.abs(offsetMinutes) % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}

function updateFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // datePublished → file creation date
  if (/itemprop=["']datePublished["']/i.test(html)) {
    const isoCreated = gitCreatedISO(filePath) || fsBirthISO(filePath);

    //log.info('filename ', filePath);
    //log.info(' - isoCreated ', isoCreated);

    if (isoCreated) {
      const human = humanDate(isoCreated);
      const newHtml = html
        // Replace or insert content attribute
        .replace(/(itemprop=["']datePublished["'][^>]*content=["'])[^"]*(["'])/i, `$1${isoCreated}$2`)
        // Replace visible text immediately after the tag
        .replace(/(itemprop=["']datePublished["'][^>]*>)([^<]*)/i, (_, pre) => `${pre}${human}`)
        // Also update the Open Graph article modified time meta tag, if present
        .replace(/(property=["']article:published_time["'][^>]*content=["'])[^"']*(["'])/i, `$1${isoCreated}$2`);
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    }
  }

  // dateModified → update only when the last committed change is newer
  if (/itemprop=["']dateModified["']/i.test(html)) {
    //const existing = extractExistingDateModified(html);
    const lastGit = gitModifiedISO(filePath);
    const hasUncommittedGitChangesFlag = hasUncommittedGitChanges(filePath);

    // Only update when there are uncommitted changes; use filesystem mtime for display
    if (hasUncommittedGitChangesFlag) {
      const isoMod = fsMtimeISO(filePath) || lastGit || new Date().toISOString();

      log.info('filename ', filePath);
      log.info(' - lastGit ', lastGit);
      log.info(' - hasUncommittedGitChangesFlag ', hasUncommittedGitChangesFlag);

      //log.info(' - isoMod ', isoMod);
      if (isoMod) {
        const isoModLocal = toLocalOffsetISOString(isoMod);
        const humanMod = humanDate(isoMod);
        log.info(' - humanMod ', humanMod);
        const newHtml = html
          .replace(/(itemprop=["']dateModified["'][^>]*content=["'])[^"]*(["'])/i, `$1${isoModLocal}$2`)
          .replace(/(itemprop=["']dateModified["'][^>]*>)([^<]*)/i, (_, pre) => `${pre}Updated: ${humanMod}`)
          // Also update the Open Graph article modified time meta tag, if present
          .replace(/(property=["']article:modified_time["'][^>]*content=["'])[^"']*(["'])/i, `$1${isoModLocal}$2`);
        if (newHtml !== html) {
          html = newHtml;
          changed = true;
        }
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    log.info(' - updated ', filePath);
  }
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

log.info(`publish-dates: updated ${updated} file(s).`);
