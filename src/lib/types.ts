import { Smile, Frown, Angry, Meh, PartyPopper, ShieldAlert, Mic, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AnalysisResult {
  emotion?: string;
  explanation?: string;
  error?: string;
}

export interface EmotionStyle {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const EMOTION_STYLES: Record<string, EmotionStyle> = {
  happy: { icon: Smile, color: 'text-chart-2', label: 'Happy' },
  sad: { icon: Frown, color: 'text-chart-1', label: 'Sad' },
  angry: { icon: Angry, color: 'text-destructive', label: 'Angry' },
  neutral: { icon: Meh, color: 'text-muted-foreground', label: 'Neutral' },
  surprised: { icon: PartyPopper, color: 'text-chart-4', label: 'Surprised' },
  fear: { icon: ShieldAlert, color: 'text-chart-5', label: 'Fearful' },
  fearful: { icon: ShieldAlert, color: 'text-chart-5', label: 'Fearful' },
  calm: { icon: Meh, color: 'text-blue-400', label: 'Calm'}, // Using Meh for calm as an example
  disgust: { icon: Angry, color: 'text-green-700', label: 'Disgust'}, // Using Angry for disgust as an example
  default: { icon: Mic, color: 'text-foreground', label: 'Ready to Analyze' },
  unknown: { icon: HelpCircle, color: 'text-muted-foreground', label: 'Unknown' },
};
