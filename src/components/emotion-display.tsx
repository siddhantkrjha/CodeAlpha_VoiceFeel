'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EMOTION_STYLES, type AnalysisResult } from '@/lib/types';

interface EmotionDisplayProps {
  isLoading: boolean;
  result: AnalysisResult | null;
}

export function EmotionDisplay({ isLoading, result }: EmotionDisplayProps) {
  if (isLoading) {
    return <EmotionDisplaySkeleton />;
  }

  const emotionKey = result?.emotion?.toLowerCase() || 'default';
  const emotionStyle = EMOTION_STYLES[emotionKey] || EMOTION_STYLES.unknown;
  const EmotionIcon = emotionStyle.icon;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px] text-center p-4 rounded-lg bg-accent/50 border-2 border-dashed border-border">
      <div className="flex flex-col items-center gap-4">
        <EmotionIcon className={`w-16 h-16 transition-colors duration-300 ${emotionStyle.color}`} />
        <p className={`text-2xl font-bold font-headline transition-colors duration-300 ${emotionStyle.color}`}>
          {emotionStyle.label}
        </p>
      </div>

      {result?.explanation && (
        <div className="w-full max-w-md mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation">
              <AccordionTrigger className="text-muted-foreground hover:no-underline">
                Why was this emotion detected?
              </AccordionTrigger>
              <AccordionContent className="text-left text-muted-foreground">
                {result.explanation}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}

function EmotionDisplaySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px] text-center p-4 rounded-lg bg-accent/50 border-2 border-dashed border-border">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="w-full max-w-md mt-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
