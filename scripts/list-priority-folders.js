const fs = require('fs');
const path = require('path');
const sfxDir = path.join(process.cwd(), 'SFX Pack');

const folders = [
  'Camera',
  'Keyboard & Mouse',
  'Whoosh',
  'Risers',
  'Money',
  'Bell',
  'z_Other/Paper & book',
  'z_Other/Marker',
  'z_Other/Register',
  'z_Other/Pop'
];

folders.forEach(f => {
  const full = path.join(sfxDir, f);
  if (fs.existsSync(full)) {
    const files = fs.readdirSync(full).filter(x => !fs.statSync(path.join(full, x)).isDirectory());
    console.log(`\n=== FOLDER: ${f} (${files.length} items) ===`);
    files.forEach(x => {
      const s = fs.statSync(path.join(full, x));
      console.log(`  ${x} (${Math.round(s.size/1024*10)/10} KB)`);
    });
  }
});
