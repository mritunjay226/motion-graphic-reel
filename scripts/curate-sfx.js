const fs = require('fs');
const path = require('path');

const sfxDir = path.join(process.cwd(), 'SFX Pack');
const destDir = path.join(process.cwd(), 'public', 'sfx');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map clean semantic names to exact paths in SFX Pack
const sfxManifest = {
  // ── 1. Paper & Texture Foley ──
  "paper_rip.mp3": "z_Other/Paper & book/PaperRip_AP1.1258.mp3",
  "paper_tear_heavy.mp3": "z_Other/_Unorganised/EaselTearSheet_S08OF.188.mp3",
  "paper_slide.mp3": "z_Other/Paper & book/Page Flip.mp3",
  "paper_turn.mp3": "z_Other/Paper & book/ManualTurnPage_AP1.1244.mp3",
  "paper_rustle.mp3": "z_Other/Paper & book/NewspaperRustle_AP1.1103.mp3",
  "paper_tape.mp3": "z_Other/_Unorganised/MaskingTape_AP1.1253.mp3",
  "paper_staple.wav": "z_Other/Paper & book/Stapling Paper.wav",

  // ── 2. Mechanical & Physical Foley ──
  "rubber_stamp.mp3": "z_Other/_Unorganised/stamp.mp3",
  "camera_shutter.mp3": "Camera/CameraShutter_BWU.454.mp3",
  "camera_flash.mp3": "Camera/CameraFlash_AP1.1315.mp3",
  "film_slate.mp3": "Camera/FilmSlateClick_S08FO.963.mp3",
  "typewriter_key.mp3": "Keyboard & Mouse/ElectricTypewriter_S011TE.145.mp3",
  "typewriter_bell.mp3": "Bell/BellTypewriter_S011TE.74.mp3",
  "keyboard_typing.mp3": "Keyboard & Mouse/PcKeyboard_S08TE.964.mp3",
  "mechanical_click.wav": "Keyboard & Mouse/Mechanical_Keyboard_Click_03.wav",
  "mouse_click.mp3": "Keyboard & Mouse/Mouse_Click_sfx.mp3",
  "switch_click.mp3": "Switch/SwitchToggle_S08FO.2526.mp3",
  "lamp_switch.mp3": "Switch/SwitchLampKnob_S08FO.2507.mp3",

  // ── 3. Motion, Whips & Cinematics ──
  "whip_whoosh.mp3": "Whoosh/ES_Whip_Whoosh_1_-_SFX_Producer.mp3",
  "whip_fast.mp3": "Whoosh/fast_woosh_1.mp3",
  "cinematic_whoosh.mp3": "Whoosh/Cinematic Whoosh.mp3",
  "light_swoosh.mp3": "Whoosh/clean-fast-swooshaiff-14784.mp3",
  "cinematic_sub_boom.mp3": "z_Other/_Unorganised/Bass_Boom.mp3",
  "cinematic_boom_heavy.mp3": "z_Other/_Unorganised/Cinematic Boom 1.mp3",
  "tension_riser.mp3": "Risers/Buildup Sound Effect By Techno Mania.mp3",

  // ── 4. Accents & Dopamine Micro-Hits ──
  "marker_highlighter.mp3": "z_Other/Marker/MarkerWrite_AP1.1251.mp3",
  "marker_stroke_long.mp3": "z_Other/Marker/MarkerWrite_AP1.1247.mp3",
  "tactile_pop.mp3": "z_Other/Cartoon/CARTOON POP.mp3",
  "bubble_pop.mp3": "z_Other/Pop/MouthPop_AP1.1188.mp3",
  "cash_register.mp3": "z_Other/Register/CashRegisterOpen_S011IN.119.mp3",
  "coin_clink.mp3": "Money/CoinCupInsert_S011FO.169.mp3",
  "bell_ding.mp3": "Bell/ElevatorBellDing_S08OF.189.mp3",
  "bell_desk.mp3": "Bell/BellDeskHand_S08FO.121.mp3",
  "success_chime.mp3": "Notifications/MultimediaPositive_S011TE.709.mp3",
  "record_scratch.mp3": "z_Other/_Unorganised/Record Scratch 1.mp3",
  "tape_rewind.mp3": "z_Other/_Unorganised/Rewind.mp3",
  "clock_ticking.mp3": "z_Other/_Unorganised/CLOCK TICKING.mp3",
  "digital_glitch.mp3": "Digital/CommunicationGlitch_S011SF.179.mp3",
  "glass_shatter.mp3": "z_Other/Crash/CrashGlassPane_S08IM.96.mp3",
};

console.log("=== Copying and Verifying Selected SFX Files ===");
let copied = 0;
let missing = 0;

for (const [targetName, relSrc] of Object.entries(sfxManifest)) {
  const fullSrc = path.join(sfxDir, relSrc);
  const fullDest = path.join(destDir, targetName);

  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, fullDest);
    const stat = fs.statSync(fullDest);
    console.log(`✅ [${targetName}] <- ${relSrc} (${Math.round(stat.size / 1024 * 10) / 10} KB)`);
    copied++;
  } else {
    console.error(`❌ Missing file: ${relSrc}`);
    missing++;
  }
}

console.log(`\nSummary: ${copied} copied successfully, ${missing} missing.`);
