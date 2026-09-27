/**
 * LLM Storyboard Generator for Vox Reels SaaS.
 *
 * Calls native Google Gemini 2.5 REST API (or OpenRouter API) to generate
 * 100% unique 6-scene documentary storyboards with viewer psychology, selective visual focus,
 * and dynamic visual element entrance/exit timelines.
 */

export interface SceneEventPayload {
  id: string;
  type: "typewriter_memo" | "news_article" | "graph_sketch" | "sticker_cutout" | "quote_card";
  headline?: string;
  content?: string;
  imagePrompt?: string;
  imageUrl?: string;
  removeBg?: boolean;
  startFrameOffset: number;
  durationFrames: number;
  exitAnimation: "shrink_out" | "slide_left" | "paper_tear_out" | "fade_scale";
}

export interface StoryboardSceneOutput {
  sceneId: number;
  headline: string;
  subtitle: string;
  narration: string;
  narrationTts?: string;
  imagePrompt: string;
  bRollQuery?: string;
  isSingleSubject: boolean;
  removeBg?: boolean;
  visualType: string;
  gsapType?: string;
  entranceType?: string;
  sfxCue?: string;
  events?: SceneEventPayload[];
}

export async function generateLLMStoryboard(topic: string, language: string = "en"): Promise<StoryboardSceneOutput[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  const openRouterApiKey = process.env.OPENROUTER_API_KEY || "";

  const LANGUAGE_NAMES: Record<string, string> = {
    hi: "Hindi (Hinglish - Roman Script Subtitles & Audio)",
    es: "Spanish (Español)",
    fr: "French (Français)",
    de: "German (Deutsch)",
    en: "English",
  };

  const targetLanguage = LANGUAGE_NAMES[language.toLowerCase()] || "English";
  const isHindi = language.toLowerCase() === "hi";

  const languagePromptDirective = isHindi
    ? `CRITICAL DUAL-SCRIPT DIRECTIVE FOR HINDI (ON-SCREEN HINGLISH + SPOKEN DEVANAGARI):
1. ON-SCREEN TEXT ('headline', 'subtitle', 'narration', and event 'content/headline'):
   - MUST be written in high-retention, viral HINGLISH (Romanized Hindi using standard English/Latin A-Z alphabet).
   - This ensures captions and typography on mobile screens look ultra-clean, modern, and viral.
   - Example Hinglish Headline: "50M KI SABSE BADI GALTI"
   - Example Hinglish Subtitle: "EK DECISION NE BADAL DI PURI DUNIYA"
   - Example Hinglish Narration: "Is fifty million dollar ki galti ne raato-raat 9000 stores ke empire ko khatam kar diya... aur kisi ko iski bhanak tak nahi lagi!"

2. SPOKEN AUDIO VOICEOVER ('narrationTts'):
   - MUST be written in natural, fluent DEVANAGARI HINDI (हिंदी लिपि) matching the exact same meaning and phrasing as the narration.
   - The multilingual TTS voiceover engine requires authentic Devanagari script for flawless, native Indian accent, correct grammar, and emotional cadence.
   - Example narrationTts (Devanagari): "इस पचास मिलियन डॉलर की गलती ने रातों-रात नौ हज़ार स्टोर्स के साम्राज्य को ख़त्म कर दिया... और किसी को इसकी भनक तक नहीं लगी!"

3. IMAGE PROMPTS:
   - All 'imagePrompt' fields MUST STILL BE WRITTEN IN DETAILED ENGLISH so image generation models (Gemini Flash / Flux) render accurate visual assets!`
    : `CRITICAL MULTI-LANGUAGE DIRECTIVE FOR ${targetLanguage.toUpperCase()}:
- The target language requested by the user is ${targetLanguage}.
- Every 'headline', 'subtitle', 'narration', and 'narrationTts' MUST be written in natural, fluent ${targetLanguage}.
- IMPORTANT: All 'imagePrompt' fields MUST STILL BE WRITTEN IN DETAILED ENGLISH so image generation models (Gemini Flash / Flux) render accurate visual assets!`;

  const systemInstruction = `You are an elite Vox Video Creative Director & Viral Script Engineer (Vox / Alex Hormozi / MagnatesMedia style). Generate a 6-scene 30-second documentary reel JSON for the topic: "${topic}".

${languagePromptDirective}

VIRAL SCRIPT ENGINEERING & NARRATION CONTINUITY DIRECTIVES:
1. 0-3s PATTERN INTERRUPT HOOK (Scene 1 Narration):
   - Scene 1 narration MUST immediately hook the viewer within 2 seconds using a high-stakes curiosity gap, shocking dollar figure, or dramatic paradox.
   - NEVER start with generic intro phrases like "In this video", "Today we discuss", or "Have you ever wondered".

2. COUNTER-INTUITIVE TWIST & OPEN LOOPS (Scenes 2 to 4 Narration):
   - Scene 2 MUST introduce a hidden mechanism, secret strategy, or unexpected rivalry.
   - Scenes 3 & 4 MUST escalate tension and open a curiosity loop.

3. CLIMAX & SEAMLESS REWATCH LOOP (Scene 6 Narration):
   - Scene 6 narration MUST end with a high-impact punchline and a closing phrase structured to transition SEAMLESSLY back into Scene 1's hook.
   - This causes short-form algorithms (TikTok / Reels / Shorts) to loop the video seamlessly, doubling viewer watch-time retention!

4. CONTINUOUS VOICEOVER FLOW & ACOUSTIC PACING:
   - Write all 6 scene narrations as one fluid, interconnected documentary story stream.
   - Keep each scene narration between 12 to 20 words max for punchy, high-retention pacing.
   - Use ellipses (...) for dramatic 250ms suspense pauses before revelations (e.g. "And then... it collapsed.").
   - For English scripts, you may strategically inject one paralinguistic emotion tag ([chuckle], [sigh], [gasp], [whisper]) right before a twist or ironical punchline (e.g. "Blockbuster laughed. [chuckle] Big mistake.") to produce ultra-realistic human vocal inflection!

5. PUNCHY 2-4 WORD UPPERCASE HEADLINES:
   - Every scene "headline" MUST be 2 to 4 punchy uppercase words max.

6. MAXIMUM READABILITY & LARGE FONT SIZING DIRECTIVE:
   - All on-screen text (headlines, subtitles, memo text, quotes, badges) MUST be short, concise, and ultra-punchy.
   - Headlines MUST be 2 to 4 words MAX (e.g. "50M KI GALTI", "THE $50M MISTAKE").
   - Subtitles MUST be 4 to 6 words MAX (e.g. "EK DECISION NE BADLA EMPIRE").
   - Event content (memos, news headlines, quote cards) MUST be under 10-12 words MAX so text is rendered in massive, bold, crystal-clear typography on mobile screens.
   - NEVER write long paragraphs or tiny verbose sentences for on-screen elements!

7. STRICT IMAGE & CUTOUT PLACEMENT RULE:
   - Every scene MUST have a primary single-subject cutout prompt ("imagePrompt" on the scene object) featuring the main figure, product, or logo for that beat.
   - Set "isSingleSubject": true, "removeBg": true for isolated subjects.

8. TACTILE SOUND DESIGN & FOLEY DIRECTIVE:
   - Our 2.5D Motion Graphic Engine features a 39-sound Tactile Foley Library that plays frame-accurate sound effects.
   - For each scene, specify an "sfxCue" field that matches the emotional weight of that scene:
     • "cinematic_sub_boom": Shocking Scene 1 hook paradox or dramatic Scene 6 climax revelation.
     • "rubber_stamp": Executive rejection, corporate approval, confidential seal, or final verdict.
     • "cash_register": Massive dollar valuation ($50M, $100B), revenue surge, or financial peak.
     • "coin_clink": Rapid stat increase, growth percentage, or financial comparison.
     • "camera_shutter": Polaroid snapshot, executive quote spotlight, or archival evidence.
     • "record_scratch": Counter-intuitive twist, sudden mistake, or unexpected turn of events.
     • "typewriter_key": Leaked memo, confidential email, or newspaper article.
     • "keyboard_typing": Cyber matrix, hacker algorithm, or technical telemetry.
     • "paper_rip": Contract torn, division, or sharp transition.
     • "bell_ding": Milestone achievement or checklist step completion.
     • "glass_shatter": Bankruptcy, failure, or catastrophic collapse.

Output ONLY a valid JSON array of 6 scene objects matching this exact structure:
[
  {
    "sceneId": 1,
    "headline": "${isHindi ? "50M KI SABSE BADI GALTI" : "THE $50M MISTAKE"}",
    "subtitle": "${isHindi ? "EK DECISION NE TABAH KIYA EMPIRE" : "HOW A SINGLE DECISION DESTROYED AN EMPIRE"}",
    "narration": "${isHindi ? "Is fifty million dollar ki galti ne raato-raat 9000 stores ke empire ko khatam kar diya... aur kisi ko iski bhanak tak nahi lagi." : "This fifty million dollar mistake wiped out a nine thousand store empire overnight... and nobody saw it coming."}",
    "narrationTts": "${isHindi ? "इस पचास मिलियन डॉलर की गलती ने रातों-रात नौ हज़ार स्टोर्स के साम्राज्य को ख़त्म कर दिया... और किसी को इसकी भनक तक नहीं लगी।" : "This fifty million dollar mistake wiped out a nine thousand store empire overnight... and nobody saw it coming."}",
    "imagePrompt": "Portrait cutout of main subject related to ${topic}, isolated single subject on solid white background, clean sticker",
    "bRollQuery": "Cinematic 4k B-roll footage related to ${topic}, e.g. corporate boardroom meeting or stock exchange floor",
    "isSingleSubject": true,
    "removeBg": true,
    "visualType": "center_cutout_hero",
    "gsapType": "grid_lines",
    "entranceType": "slide_corner_bottom_left",
    "sfxCue": "cinematic_sub_boom",
    "events": [
      {
        "id": "ev_1_1",
        "type": "sticker_cutout",
        "headline": "PRIMARY SUBJECT",
        "imagePrompt": "Detailed cutout sticker related to ${topic}, isolated single subject on solid white background",
        "removeBg": true,
        "startFrameOffset": 6,
        "durationFrames": 45,
        "exitAnimation": "slide_left"
      }
    ]
  }
]

Rules:
- Exactly 6 scenes.
- headline: Uppercase 2-4 words max.
- narration: Punchy, viral 1-2 sentence documentary script per scene in ${targetLanguage}.
- sfxCue: Choose one of ("cinematic_sub_boom", "rubber_stamp", "cash_register", "coin_clink", "camera_shutter", "record_scratch", "typewriter_key", "keyboard_typing", "paper_rip", "bell_ding", "glass_shatter").
- visualType MUST be intelligently chosen from the full 17-template suite to visually PROVE what is being spoken (DO NOT use the same visualType more than once in the 6 scenes):
  1. "center_hero_cutout": Iconic hero hook, key subject or product introduction.
  2. "split_left_cutout_right_memo": Confidential internal memo, leaked email, corporate record.
  3. "split_left_newspaper_right_cutout": Breaking news headline, newspaper clipping, media scandal.
  4. "revenue_stat_trend": Huge revenue growth, metric surge (+340%), upward trend arrow.
  5. "punchline_quote_spotlight": Dramatic executive quote, confession, or statement.
  6. "infographic_bar_chart": Financial bar chart comparison, growth vs competition.
  7. "dual_cutout_versus": Rivalry showdown, competitor battle, David vs Goliath.
  8. "list_bullets_left_cutout_right": 3 key strategic takeaways or core principles.
  9. "timeline_milestone_road": Chronology, evolution over years, multi-phase history.
  10. "spotlight_magnifier_document": Forensic audit, magnifying hidden fine print or leaked contract.
  11. "circular_orbit_infographic": Circular ecosystem, interconnected network.
  12. "breaking_news_alert_ticker": Urgent breaking alert, market crash or emergency bulletin.
  13. "matrix_scramble_hacker": Cyber attack, algorithmic secret, hacker code decryption, tech breakthrough.
  14. "bento_grid_showcase": Multi-card bento grid, feature highlights.
  15. "ecosystem_integration_hub": Connected ecosystem constellation, technology hub.
  16. "handwritten_roadmap_checklist": Step-by-step masterplan, verified checklist audit with checkmarks.
  17. "editorial_strikethrough_swap": Myth vs reality, striking through misconceptions, counter-intuitive truth.
- gsapType must be one of: "grid_lines", "bar_chart", "pulse_nodes", "stamp_seal", "trend_arrow", "confetti_burst".
- Output ONLY raw JSON array of 6 scene objects. No markdown formatting, no code blocks.`;

  // ─── 1. Call Native Google Gemini 2.5 REST API if GEMINI_API_KEY is present ───
  if (geminiApiKey) {
    try {
      console.log(`[LLM Storyboard] Calling native Google Gemini 2.5 API (${targetLanguage}) for topic: "${topic}"...`);

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemInstruction }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      });

      if (res.ok) {
        const geminiData = await res.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 6) {
            console.log(`[LLM Storyboard] ✅ Gemini 2.5 generated ${parsed.length} scenes in ${targetLanguage}!`);
            return parsed.slice(0, 6);
          }
        }
      } else {
        const errText = await res.text();
        console.warn(`[Gemini API Warning ${res.status}]`, errText);
      }
    } catch (geminiErr: any) {
      console.error(`[Gemini API Error]`, geminiErr.message);
    }
  }

  // ─── 2. Call OpenRouter API if OPENROUTER_API_KEY is present ───
  if (openRouterApiKey) {
    try {
      console.log(`[LLM Storyboard] Calling OpenRouter API (${targetLanguage}) for topic: "${topic}"...`);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: systemInstruction }],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        const jsonMatch = content.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 6) {
            console.log(`[LLM Storyboard] ✅ OpenRouter generated ${parsed.length} scenes in ${targetLanguage}!`);
            return parsed.slice(0, 6);
          }
        }
      }
    } catch (openRouterErr: any) {
      console.error(`[OpenRouter API Error]`, openRouterErr.message);
    }
  }

  // Fallback to topic-tailored Vox storyboard if API keys fail
  console.warn(`[LLM Storyboard] Using topic-tailored Vox storyboard template in ${targetLanguage}.`);
  return generateDefaultVoxStoryboard(topic, language);
}

/**
 * Topic-Tailored Vox Storyboard Orchestrator Template with Event Timelines.
 */
function generateDefaultVoxStoryboard(topic: string, language: string = "en"): StoryboardSceneOutput[] {
  const sanitizedTopic = topic.toUpperCase();
  const isHindi = language.toLowerCase() === "hi";

  if (isHindi) {
    return [
      {
        sceneId: 1,
        headline: `${sanitizedTopic.slice(0, 14)} KI SHURUAT`,
        subtitle: "EK IDEA JISNE BADAL DI PURI DUNIYA",
        narration: `${topic} ke shuruati dino me, ek chhoti si team ne ek aisa khatarnak risk liya jisne puri industry ko hilakar rakh diya.`,
        narrationTts: `${topic} के शुरुआती दिनों में, एक छोटी सी टीम ने एक ऐसा ख़तरनाक रिस्क लिया जिसने पूरी इंडस्ट्री को हिलाकर रख दिया।`,
        imagePrompt: `Founder or key figure behind ${topic}, portrait cutout, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "center_hero_cutout",
        gsapType: "grid_lines",
        entranceType: "slide_corner_bottom_left",
        events: [
          {
            id: "ev_1_1",
            type: "sticker_cutout",
            headline: "FOUNDER PORTRAIT",
            imagePrompt: `Founder portrait cutout for ${topic}, isolated PNG sticker on white background`,
            startFrameOffset: 6,
            durationFrames: 45,
            exitAnimation: "slide_left",
          },
        ],
      },
      {
        sceneId: 2,
        headline: "CRORE KA DAAV",
        subtitle: "EK AISA OFFER JISNE SAB BADAL DIYA",
        narration: "Unhone ek aisi krantikari strategy pesh ki jis par shuruat me investors ne sawal uthaye the.",
        narrationTts: "उन्होंने एक ऐसी क्रांतिकारी रणनीति पेश की जिस पर शुरुआत में निवेशकों ने सवाल उठाए थे।",
        imagePrompt: `Stack of investment cash money for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "split_left_newspaper_right_cutout",
        gsapType: "bar_chart",
        entranceType: "slide_corner_top_left",
        events: [],
      },
      {
        sceneId: 3,
        headline: "MARKET KI JUNG",
        subtitle: "PURANE NIYAMO KO TODNA",
        narration: "Fizul kharcho ko khatam karke aur customer experience ko priority dekar, unhone record growth hasil ki.",
        narrationTts: "फ़िज़ूल खर्चों को ख़त्म करके और कस्टमर एक्सपीरियंस को प्राथमिकता देकर, उन्होंने रिकॉर्ड ग्रोथ हासिल की।",
        imagePrompt: `Modern tech server glowing network for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "dual_cutout_versus",
        gsapType: "pulse_nodes",
        entranceType: "slide_corner_top_right",
        events: [],
      },
      {
        sceneId: 4,
        headline: "SECRET EVIDENCE",
        subtitle: "LEAKED AUDIT REPORT",
        narration: "Paramparik companies ne samay ke sath badalne se inkar kar diya, jiske parinam swarup unka patan ho gaya.",
        narrationTts: "पारंपरिक कंपनियों ने समय के साथ बदलने से इनकार कर दिया, जिसके परिणामस्वरूप उनका पतन हो गया।",
        imagePrompt: `Abandoned traditional store front representing competitors of ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "spotlight_magnifier_document",
        gsapType: "stamp_seal",
        entranceType: "slide_corner_bottom_right",
        events: [],
      },
      {
        sceneId: 5,
        headline: "BILLIONS KA REVENUE",
        subtitle: "GLOBAL MARKET PAR RAJ",
        narration: "Aaj yahi strategy international markets me billions of dollars ka revenue generate karti hai.",
        narrationTts: "आज यही रणनीति इंटरनेशनल मार्केट्स में अरबों डॉलर का रेवेन्यू जनरेट करती है।",
        imagePrompt: `Golden trophy award for digital dominance in ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "revenue_stat_trend",
        gsapType: "trend_arrow",
        entranceType: "slide_corner_bottom_left",
        events: [],
      },
      {
        sceneId: 6,
        headline: "ITHIHAS KA BADA MOD",
        subtitle: "EK IDEA SE GLOBAL EMPIRE TAK",
        narration: "Yeh aadhunik business itihas ki sabse shandar aur prernadayak growth stories me se ek hai.",
        narrationTts: "यह आधुनिक बिज़नेस इतिहास की सबसे शानदार और प्रेरणादायक ग्रोथ कहानियों में से एक है।",
        imagePrompt: `Royal gold crown symbol of business victory for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "editorial_strikethrough_swap",
        gsapType: "confetti_burst",
        entranceType: "slide_corner_top_right",
        events: [],
      },
    ];
  }

  return [
    {
      sceneId: 1,
      headline: `THE ORIGIN OF ${sanitizedTopic.slice(0, 18)}`,
      subtitle: "HOW AN EMPIRE STARTED WITH A SINGLE IDEA",
      narration: `In the early days of ${topic}, a small team took a massive risk that changed the business landscape forever.`,
      imagePrompt: `Founder or key figure behind ${topic}, portrait cutout, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "center_hero_cutout",
      gsapType: "grid_lines",
      entranceType: "slide_corner_bottom_left",
      events: [
        {
          id: "ev_1_1",
          type: "sticker_cutout",
          headline: "FOUNDER PORTRAIT",
          imagePrompt: `Founder portrait cutout for ${topic}, isolated PNG sticker on white background`,
          startFrameOffset: 6,
          durationFrames: 45,
          exitAnimation: "slide_left",
        },
        {
          id: "ev_1_2",
          type: "typewriter_memo",
          headline: "CONFIDENTIAL MEMO",
          content: `INITIAL STRATEGY REPORT FOR ${sanitizedTopic}`,
          startFrameOffset: 35,
          durationFrames: 50,
          exitAnimation: "shrink_out",
        },
      ],
    },
    {
      sceneId: 2,
      headline: `THE MULTI-MILLION BET`,
      subtitle: `THE OFFER THAT CHANGED EVERYTHING`,
      narration: `They pitched a revolutionary business model that investors initially questioned.`,
      imagePrompt: `Stack of investment cash money for ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "split_left_newspaper_right_cutout",
      gsapType: "bar_chart",
      entranceType: "slide_corner_top_left",
      events: [
        {
          id: "ev_2_1",
          type: "news_article",
          headline: "THE WALL STREET JOURNAL",
          content: `REVOLUTIONARY ${sanitizedTopic} DEALS SHAKE INDUSTRY`,
          imagePrompt: `Vintage newspaper headline clipping about ${topic}, isolated PNG sticker on white background`,
          startFrameOffset: 4,
          durationFrames: 50,
          exitAnimation: "paper_tear_out",
        },
      ],
    },
    {
      sceneId: 3,
      headline: `MARKET RIVALRY`,
      subtitle: `DAVID VS GOLIATH SHOWDOWN`,
      narration: `By eliminating unnecessary overhead and putting customer experience first, they scaled exponentially.`,
      imagePrompt: `Modern tech server glowing network for ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "dual_cutout_versus",
      gsapType: "pulse_nodes",
      entranceType: "slide_corner_top_right",
      events: [
        {
          id: "ev_3_1",
          type: "graph_sketch",
          headline: "EXPONENTIAL CURVE",
          content: "CUSTOMER RETENTION RATE: +340%",
          startFrameOffset: 6,
          durationFrames: 55,
          exitAnimation: "fade_scale",
        },
      ],
    },
    {
      sceneId: 4,
      headline: `AUDIT REVEALED`,
      subtitle: `THE HIDDEN SPREADSHEET LEAK`,
      narration: `Traditional competitors refused to adapt, resulting in massive market shift and closures.`,
      imagePrompt: `Abandoned traditional store front representing legacy competitors of ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "spotlight_magnifier_document",
      gsapType: "stamp_seal",
      entranceType: "slide_corner_bottom_right",
      events: [
        {
          id: "ev_4_1",
          type: "sticker_cutout",
          headline: "LEGACY STORE FRONT",
          imagePrompt: `Abandoned store front representing competitors of ${topic}, isolated PNG sticker on white background`,
          startFrameOffset: 6,
          durationFrames: 50,
          exitAnimation: "shrink_out",
        },
      ],
    },
    {
      sceneId: 5,
      headline: `MULTI-BILLION REVENUE`,
      subtitle: `DOMINATING THE GLOBAL MARKET TODAY`,
      narration: `Today, this strategy generates multi-billion dollar annual returns across international markets.`,
      imagePrompt: `Golden trophy award for digital dominance in ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "revenue_stat_trend",
      gsapType: "trend_arrow",
      entranceType: "slide_corner_bottom_left",
      events: [
        {
          id: "ev_5_1",
          type: "quote_card",
          headline: "ANNUAL RETURNS",
          content: "OVER $4.2 BILLION GENERATED ANNUALLY",
          startFrameOffset: 6,
          durationFrames: 50,
          exitAnimation: "slide_left",
        },
      ],
    },
    {
      sceneId: 6,
      headline: `THE GREATEST PIVOT`,
      subtitle: `FROM A BOLD IDEA TO A GLOBAL EMPIRE`,
      narration: `It stands as one of the most remarkable growth stories in modern business history.`,
      imagePrompt: `Royal gold crown symbol of business victory for ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "editorial_strikethrough_swap",
      gsapType: "confetti_burst",
      entranceType: "slide_corner_top_right",
      events: [
        {
          id: "ev_6_1",
          type: "sticker_cutout",
          headline: "VICTORY CROWN",
          imagePrompt: `Royal gold crown for business victory in ${topic}, isolated PNG sticker on white background`,
          startFrameOffset: 4,
          durationFrames: 55,
          exitAnimation: "fade_scale",
        },
      ],
    },
  ];
}
