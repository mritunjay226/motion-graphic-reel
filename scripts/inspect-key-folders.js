const fs = require('fs');
const path = require('path');
const sfxDir = path.join(process.cwd(), 'SFX Pack');

const specificFolders = [
  'Camera',
  'Keyboard & Mouse',
  'Whoosh',
  'Risers',
  'Money',
  'Bell',
  'z_Other/Paper & book',
  'z_Other/Marker',
  'z_Other/Register',
  'z_Other/Pop',
  'Button',
  'Switch'
];

specificFolders.forEach(folderRel => {
  const fullFolder = path.join(sfxDir, folderRel);
  if (fs.existsSync(fullFolder)) {
    const files = fs.readdirSync(fullFolder).filter(f => !fs.statSync(path.join(fullFolder, f)).isDirectory());
    console.log(`\n=================== ${folderRel} (${files.length} files) ===================`);
    files.forEach(f => {
      const stat = fs.statSync(path.join(fullFolder, f));
      console.log(`  ${f} (${Math.round(stat.size / 1024 * 10) / 10} KB)`);
    });
  }
});
