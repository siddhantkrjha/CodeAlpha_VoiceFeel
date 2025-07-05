'use server';

/**
 * @fileOverview Classifies the emotion present in speech audio.
 *
 * - classifyEmotion - A function that classifies the emotion present in speech audio.
 * - ClassifyEmotionInput - The input type for the classifyEmotion function.
 * - ClassifyEmotionOutput - The return type for the classifyEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ClassifyEmotionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type ClassifyEmotionInput = z.infer<typeof ClassifyEmotionInputSchema>;

const ClassifyEmotionOutputSchema = z.object({
  emotion: z.string().describe('The classified emotion from the audio.'),
});

export type ClassifyEmotionOutput = z.infer<typeof ClassifyEmotionOutputSchema>;

export async function classifyEmotion(input: ClassifyEmotionInput): Promise<ClassifyEmotionOutput> {
  return classifyEmotionFlow(input);
}

const classifyEmotionPrompt = ai.definePrompt({
  name: 'classifyEmotionPrompt',
  input: {schema: ClassifyEmotionInputSchema},
  output: {schema: ClassifyEmotionOutputSchema},
  prompt: `Analyze the emotion conveyed in the following audio data. Classify the predominant emotion from the audio sample. The emotion should be a single word.

Audio: {{media url=audioDataUri}}`,
});


const classifyEmotionFlow = ai.defineFlow(
  {
    name: 'classifyEmotionFlow',
    inputSchema: ClassifyEmotionInputSchema,
    outputSchema: ClassifyEmotionOutputSchema,
  },
  async input => {
    const {output} = await classifyEmotionPrompt(input);
    return output!;
  }
);
