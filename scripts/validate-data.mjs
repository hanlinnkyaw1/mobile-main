import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'assets', 'data');
const jsonFiles = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (name.endsWith('.json')) jsonFiles.push(file);
  }
}

walk(dataRoot);
const failures = [];
for (const file of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    failures.push(`${path.relative(root, file)}: ${error.message}`);
  }
}

const required = [
  'grammarMetadata.json',
  'preview.json',
  'reading/N1Reading.json',
  'reading/N5Reading.json',
  'kanji/n5kanji.json',
  'vocab/n5_2024_7.json',
];
for (const relative of required) {
  if (!fs.existsSync(path.join(dataRoot, relative))) failures.push(`Missing required asset: assets/data/${relative}`);
}

if (failures.length) {
  console.error('Data validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${jsonFiles.length} JSON assets successfully.`);
