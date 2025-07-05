'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VoiceRecorder } from '@/components/voice-recorder';
import { EmotionDisplay } from '@/components/emotion-display';
import { analyzeAudioAction } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAudioSubmit = async (audioDataUri: string) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeAudioAction(audioDataUri);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        })
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
        description: "Please check the console for more details.",
      })
      console.error(e);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8 font-body">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline">
            VoiceFeel
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Uncover the emotions hidden in your voice.
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Emotion Analysis</CardTitle>
            <CardDescription>Record your voice to see the magic.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <EmotionDisplay isLoading={isLoading} result={analysisResult} />
          </CardContent>
          <CardFooter className="flex-col items-center gap-4">
            <VoiceRecorder onAudioSubmit={handleAudioSubmit} disabled={isLoading} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
