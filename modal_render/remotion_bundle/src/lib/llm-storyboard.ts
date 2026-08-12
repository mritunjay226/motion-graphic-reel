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
  imagePrompt: string;
  isSingleSubject: boolean;
  removeBg?: boolean;
  visualType: "side_by_side_infographic" | "center_cutout_hero" | "side_by_side_list" | "revenue_stat_trend" | "punchline_quote_hero";
  gsapType: "grid_lines" | "bar_chart" | "pulse_nodes" | "stamp_seal" | "trend_arrow" | "confetti_burst";
  entranceType: "slide_corner_top_left" | "slide_corner_top_right" | "slide_corner_bottom_left" | "slide_corner_bottom_right";
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
    ? `CRITICAL MULTI-LANGUAGE DIRECTIVE FOR HINDI (HINGLISH / ROMAN ALPHABET):
- The target language requested by the user is HINDI (spoken voiceover), BUT ALL ON-SCREEN TEXT MUST BE WRITTEN IN HINGLISH (Romanized Hindi using standard English/Latin A-Z alphabet).
- Every 'headline', 'subtitle', 'narration', and event 'content/headline' MUST be written in natural, viral, suspenseful HINGLISH (Roman script).
- DO NOT USE Devanagari script (like हिंदी). Use English/Roman letters (A-Z) to spell out spoken Hindi words!
- Example Hinglish Headline: "50M KI SABSE BADI GALTI"
- Example Hinglish Subtitle: "EK DECISION NE BADAL DI PURI DUNIYA"
- Example Hinglish Narration: "Is fifty million dollar ki galti ne raato-raat 9000 stores ke empire ko khatam kar diya... aur kisi ko iski bhanak tak nahi lagi!"
- IMPORTANT: All 'imagePrompt' fields MUST STILL BE WRITTEN IN DETAILED ENGLISH so image generation models (Gemini Flash / Flux) render accurate visual assets!`
    : `CRITICAL MULTI-LANGUAGE DIRECTIVE FOR ${targetLanguage.toUpperCase()}:
- The target language requested by the user is ${targetLanguage}.
- Every 'headline', 'subtitle', and 'narration' MUST be written in natural, fluent ${targetLanguage}.
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

4. CONTINUOUS VOICEOVER FLOW:
   - Write all 6 scene narrations as one fluid, interconnected documentary story stream.
   - Each narration sentence should connect smoothly to the next beat without abrupt standalone drops.

5. PUNCHY 2-4 WORD UPPERCASE HEADLINES:
   - Every scene "headline" MUST be 2 to 4 punchy uppercase words max.

6. STRICT IMAGE PLACEMENT RULE:
   - Every scene MUST have a primary single-subject cutout prompt ("imagePrompt" on the scene object) featuring the main figure, product, or logo for that beat.
   - Set "isSingleSubject": true, "removeBg": true for isolated subjects.

Output ONLY a valid JSON array of 6 scene objects matching this exact structure:
[
  {
    "sceneId": 1,
    "headline": "${isHindi ? "50M KI SABSE BADI GALTI" : "THE $50M MISTAKE"}",
    "subtitle": "${isHindi ? "EK DECISION NE TABAH KIYA EMPIRE" : "HOW A SINGLE DECISION DESTROYED AN EMPIRE"}",
    "narration": "${isHindi ? "Is fifty million dollar ki galti ne raato-raat 9000 stores ke empire ko khatam kar diya... aur kisi ko iski bhanak tak nahi lagi." : "This fifty million dollar mistake wiped out a nine thousand store empire overnight... and nobody saw it coming."}",
    "imagePrompt": "Portrait cutout of main subject related to ${topic}, isolated single subject on solid white background, clean sticker",
    "isSingleSubject": true,
    "removeBg": true,
    "visualType": "center_cutout_hero",
    "gsapType": "grid_lines",
    "entranceType": "slide_corner_bottom_left",
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
- visualType must be one of: "center_cutout_hero", "split_left_cutout_right_memo", "revenue_stat_trend", "punchline_quote_hero", "handwritten_roadmap_checklist", "editorial_strikethrough_swap". Vary this across scenes.
- gsapType must be one of: "grid_lines", "bar_chart", "pulse_nodes", "stamp_seal", "trend_arrow", "confetti_burst". Vary this across scenes.
- Output ONLY raw JSON array. No markdown formatting, no code blocks.`;

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
        imagePrompt: `Founder or key figure behind ${topic}, portrait cutout, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "center_cutout_hero",
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
        imagePrompt: `Stack of investment cash money for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "side_by_side_infographic",
        gsapType: "bar_chart",
        entranceType: "slide_corner_top_left",
        events: [],
      },
      {
        sceneId: 3,
        headline: "KRANTIKARI RULES",
        subtitle: "PURANE NIYAMO KO TODNA",
        narration: "Fizul kharcho ko khatam karke aur customer experience ko priority dekar, unhone record growth hasil ki.",
        imagePrompt: `Modern tech server glowing network for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "side_by_side_list",
        gsapType: "pulse_nodes",
        entranceType: "slide_corner_top_right",
        events: [],
      },
      {
        sceneId: 4,
        headline: "COMPETITORS KA PATAN",
        subtitle: "BADI COMPANIES HUI TABAH",
        narration: "Paramparik companies ne samay ke sath badalne se inkar kar diya, jiske parinam swarup unka patan ho gaya.",
        imagePrompt: `Abandoned traditional store front representing competitors of ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "center_cutout_hero",
        gsapType: "stamp_seal",
        entranceType: "slide_corner_bottom_right",
        events: [],
      },
      {
        sceneId: 5,
        headline: "BILLIONS KA REVENUE",
        subtitle: "GLOBAL MARKET PAR RAJ",
        narration: "Aaj yahi strategy international markets me billions of dollars ka revenue generate karti hai.",
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
        imagePrompt: `Royal gold crown symbol of business victory for ${topic}, isolated PNG sticker on white background`,
        isSingleSubject: true,
        visualType: "punchline_quote_hero",
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
      visualType: "center_cutout_hero",
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
      visualType: "side_by_side_infographic",
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
      headline: `REVOLUTIONARY RULES`,
      subtitle: `BREAKING INDUSTRY CONVENTIONS`,
      narration: `By eliminating unnecessary overhead and putting customer experience first, they scaled exponentially.`,
      imagePrompt: `Modern tech server glowing network for ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "side_by_side_list",
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
      headline: `COMPETITORS SHUTDOWN`,
      subtitle: `LEGACY COMPANIES FILED BANKRUPTCY`,
      narration: `Traditional competitors refused to adapt, resulting in massive market shift and closures.`,
      imagePrompt: `Abandoned traditional store front representing legacy competitors of ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "center_cutout_hero",
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
      headline: `THE GREATEST PIVOT IN HISTORY`,
      subtitle: `FROM A BOLD IDEA TO A GLOBAL EMPIRE`,
      narration: `It stands as one of the most remarkable growth stories in modern business history.`,
      imagePrompt: `Royal gold crown symbol of business victory for ${topic}, isolated PNG sticker on white background`,
      isSingleSubject: true,
      visualType: "punchline_quote_hero",
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
