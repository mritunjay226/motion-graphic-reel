const fs = require('fs');
const path = require('path');

const sfxDir = path.join(process.cwd(), 'SFX Pack');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({
        path: fullPath,
        relPath: path.relative(sfxDir, fullPath).replace(/\\/g, '/'),
        name: file,
        sizeKb: Math.round(stat.size / 1024 * 10) / 10,
        folder: path.dirname(path.relative(sfxDir, fullPath)).replace(/\\/g, '/')
      });
    }
  });
  return results;
}

const allFiles = walk(sfxDir);
console.log(`Total files found: ${allFiles.length}`);

// Group by top-level folder
const folderGroups = {};
allFiles.forEach(f => {
  const topFolder = f.folder.split('/')[0] || 'root';
  if (!folderGroups[topFolder]) folderGroups[topFolder] = [];
  folderGroups[topFolder].push(f);
});

console.log("\nFolders and counts:");
Object.keys(folderGroups).sort().forEach(f => {
  console.log(`- ${f}: ${folderGroups[f].length} files`);
});

// Search for key tactile categories
const keywords = [
  'camera', 'shutter', 'typewriter', 'type', 'key', 'keyboard', 'mouse', 'click',
  'whoosh', 'swoosh', 'whip', 'riser', 'sweep', 'money', 'cash', 'coin',
  'paper', 'tear', 'rip', 'page', 'pop', 'bubble', 'switch', 'stamp', 'thud',
  'impact', 'boom', 'hit', 'bell', 'ding', 'chime', 'positive', 'negative', 'scratch',
  'marker', 'pen', 'draw', 'glitch', 'rewind', 'tape', 'tick', 'clock', 'shatter', 'glass'
];

const categoryMatches = {};
keywords.forEach(kw => {
  const matches = allFiles.filter(f => f.name.toLowerCase().includes(kw) || f.folder.toLowerCase().includes(kw));
  if (matches.length > 0) {
    categoryMatches[kw] = matches.slice(0, 8).map(m => `${m.relPath} (${m.sizeKb} KB)`);
  }
});

fs.writeFileSync(
  path.join(process.cwd(), 'sfx_inventory.json'),
  JSON.stringify({ total: allFiles.length, folderCounts: Object.fromEntries(Object.entries(folderGroups).map(([k, v]) => [k, v.length])), allFiles }, null, 2)
);

console.log("\nSample keyword matches:");
Object.keys(categoryMatches).forEach(kw => {
  console.log(`\n=== Keyword: ${kw} (${allFiles.filter(f => f.name.toLowerCase().includes(kw) || f.folder.toLowerCase().includes(kw)).length} total) ===`);
  categoryMatches[kw].slice(0, 5).forEach(m => console.log(`  - ${m}`));
});
