declare module "lucide-react" {
  import * as React from "react";

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Zap: LucideIcon;
  export const Folder: LucideIcon;
  export const Dices: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Loader2: LucideIcon;
  export const Mic: LucideIcon;
  export const Play: LucideIcon;
  export const Pause: LucideIcon;
  export const Square: LucideIcon;
  export const Pin: LucideIcon;
  export const Flame: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Cpu: LucideIcon;
  export const Palette: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Share2: LucideIcon;
  export const Download: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Film: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Search: LucideIcon;
  export const X: LucideIcon;
  export const Video: LucideIcon;
  export const Camera: LucideIcon;
  export const FileText: LucideIcon;
  export const Clock: LucideIcon;
  export const ScanEye: LucideIcon;
  export const Layers: LucideIcon;
  export const Rocket: LucideIcon;
  export const Hash: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Send: LucideIcon;
  export const Globe: LucideIcon;
  export const Scissors: LucideIcon;
  export const PenTool: LucideIcon;
  export const Music: LucideIcon;
  export const Disc: LucideIcon;
  export const Volume2: LucideIcon;
  export const Plus: LucideIcon;
  export const Eye: LucideIcon;
  export const Trash2: LucideIcon;
  export const Box: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const XCircle: LucideIcon;
  export const VolumeX: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sliders: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Maximize2: LucideIcon;
  export const SkipBack: LucideIcon;
  export const SkipForward: LucideIcon;

  export const icons: Record<string, LucideIcon>;
  const Lucide: Record<string, LucideIcon>;
  export default Lucide;
}
