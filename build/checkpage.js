const log = configureLogger('CheckPage');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function checkPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;


  return changed;
}


const targets = walk(path.join(ROOT, 'content'));
let updated = 0;
for (const f of targets) {
  if (checkPage(f)) updated++;
}



log.info(`checking pages DONE: updated ${updated} file(s).`);