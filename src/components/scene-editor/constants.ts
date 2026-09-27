export interface TemplateOption {
  id: string;
  name: string;
  badge: string;
  desc: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "center_hero_cutout", name: "1. Center Hero Cutout", badge: "Hero Hook", desc: "Iconic single subject cutout with radial paper drop-shadow & technical grid." },
  { id: "split_left_cutout_right_memo", name: "2. Split Memo Report", badge: "Confidential", desc: "Left cutout + right typewriter report with stamp seal." },
  { id: "split_left_newspaper_right_cutout", name: "3. Newspaper Clipping", badge: "Editorial", desc: "Left vintage news headline clipping + right cutout." },
  { id: "revenue_stat_trend", name: "4. Revenue Stat Trend", badge: "Finance", desc: "Big bold metric (+340%) + animated upward trend arrow." },
  { id: "punchline_quote_spotlight", name: "5. Quote Spotlight", badge: "Drama", desc: "Dark spotlight quote card + confetti burst climax." },
  { id: "infographic_bar_chart", name: "6. Bar Chart Infographic", badge: "Comparison", desc: "Animated 3-bar comparison chart with leader callout." },
  { id: "dual_cutout_versus", name: "7. Dual Versus Matchup", badge: "Rivalry", desc: "Two competing cutouts facing off side-by-side." },
  { id: "list_bullets_left_cutout_right", name: "8. 3-Bullet List", badge: "Takeaways", desc: "Left 3-bullet core takeaways + right subject cutout." },
  { id: "timeline_milestone_road", name: "9. Timeline Chronology", badge: "History", desc: "Multi-phase historical progression path with road nodes." },
  { id: "spotlight_magnifier_document", name: "10. Magnifier Spotlight", badge: "Forensics", desc: "Document with animated glass magnifier inspecting fine print." },
  { id: "circular_orbit_infographic", name: "11. Orbit Infographic", badge: "Ecosystem", desc: "Circular interconnected constellation orbit around center node." },
  { id: "breaking_news_alert_ticker", name: "12. Breaking Ticker Alert", badge: "Urgent", desc: "Emergency alert banner + scrolling broadcast ticker tape." },
  { id: "matrix_scramble_hacker", name: "13. Hacker Matrix Decrypt", badge: "Tech", desc: "Cyber terminal matrix characters decrypting into clear text." },
  { id: "bento_grid_showcase", name: "14. Bento Grid Showcase", badge: "Modern UI", desc: "Multi-card bento grid showing varied metrics & badges." },
  { id: "ecosystem_integration_hub", name: "15. Integration Hub", badge: "Network", desc: "Connected constellation network linking external tools." },
  { id: "handwritten_roadmap_checklist", name: "16. Roadmap Checklist", badge: "Action", desc: "Stop-motion handwritten checklist with dynamic checkmarks." },
  { id: "editorial_strikethrough_swap", name: "17. Editorial Strikethrough", badge: "Myth-Buster", desc: "Striking through misconceptions and revealing hard truth." },
];
