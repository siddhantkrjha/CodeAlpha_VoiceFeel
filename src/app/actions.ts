
'use server';

import { z } from 'zod';
import { classifyEmotion } from '@/ai/flows/classify-emotion';
import { generateEmotionExplanation } from '@/ai/flows/generate-emotion-explanation';
import type { AnalysisResult } from '@/lib/types';

const actionSchema = z.string().startsWith('data:audio/');

export async function analyzeAudioAction(audioDataUri: string): Promise<AnalysisResult> {
  const validation = actionSchema.safeParse(audioDataUri);
  if (!validation.success) {
    return { error: 'Invalid audio data format.' };
  }

  try {
    const emotionResult = await classifyEmotion({ audioDataUri });
    const emotion = emotionResult?.emotion?.toLowerCase();

    if (!emotion) {
      return { error: 'Could not classify emotion.' };
    }

    const explanationResult = await generateEmotionExplanation({ audioDataUri, emotion });

    return {
      emotion,
      explanation: explanationResult.explanation,
    };
  } catch (error) {
    console.error('Error during audio analysis:', error);
    return { error: 'Failed to analyze audio due to a server error.' };
  }
}
