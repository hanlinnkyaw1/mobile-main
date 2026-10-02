/**
 * Copy study data from the companion website project into this app.
 *
 * Usage:
 *   npm run sync-data -- /path/to/jlptburmese.com
 *   WEB_ROOT=/path/to/jlptburmese.com npm run sync-data
 *
 * If no source is supplied, the script keeps the historical sibling-folder
 * convention: ../<website project>.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(process.env.WEB_ROOT || process.argv[2] || path.join(mobileRoot, '..'));
const destBase = path.join(mobileRoot, 'assets', 'data');

function fail(message) {
  console.error(`\nData sync failed: ${message}`);
  console.error('Pass the website project path: npm run sync-data -- /path/to/jlptburmese.com');
  process.exit(1);
}

function assertDirectory(dir, label) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    fail(`Could not find ${label} at ${dir}`);
  }
}

function copyDir(src, dest) {
  assertDirectory(src, 'source directory');
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const stat = fs.statSync(from);
    if (stat.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

assertDirectory(sourceRoot, 'website project');
fs.mkdirSync(destBase, { recursive: true });

for (const file of ['grammarMetadata.json', 'preview.json']) {
  const source = path.join(sourceRoot, file);
  if (!fs.existsSync(source)) fail(`Missing required file ${source}`);
  fs.copyFileSync(source, path.join(destBase, file));
}

copyDir(path.join(sourceRoot, 'reading'), path.join(destBase, 'reading'));
copyDir(path.join(sourceRoot, 'oldQVoca', 'vocab'), path.join(destBase, 'vocab'));
const kanjiSource = path.join(sourceRoot, 'kanjiFlashCard');
assertDirectory(kanjiSource, 'Kanji data');
const kanjiDest = path.join(destBase, 'kanji');
fs.mkdirSync(kanjiDest, { recursive: true });
for (const name of fs.readdirSync(kanjiSource)) {
  if (name.endsWith('.json')) fs.copyFileSync(path.join(kanjiSource, name), path.join(kanjiDest, name));
}

console.log(`Copied website study data into ${destBase}`);
