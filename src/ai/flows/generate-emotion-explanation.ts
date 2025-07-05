'use server';

/**
 * @fileOverview A flow for generating an explanation of why a particular emotion was recognized in speech.
 *
 * - generateEmotionExplanation - A function that generates the explanation.
 * - GenerateEmotionExplanationInput - The input type for the generateEmotionExplanation function.
 * - GenerateEmotionExplanationOutput - The return type for the generateEmotionExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmotionExplanationInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  emotion: z.string().describe('The recognized emotion.'),
});
export type GenerateEmotionExplanationInput = z.infer<
  typeof GenerateEmotionExplanationInputSchema
>;

const GenerateEmotionExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation of why the emotion was recognized.'),
});
export type GenerateEmotionExplanationOutput = z.infer<
  typeof GenerateEmotionExplanationOutputSchema
>;

export async function generateEmotionExplanation(
  input: GenerateEmotionExplanationInput
): Promise<GenerateEmotionExplanationOutput> {
  return generateEmotionExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmotionExplanationPrompt',
  input: {schema: GenerateEmotionExplanationInputSchema},
  output: {schema: GenerateEmotionExplanationOutputSchema},
  prompt: `You are an AI expert in recognizing emotions from speech.
  Given an audio input and the recognized emotion, explain why that emotion was recognized.

  Audio: {{media url=audioDataUri}}
  Emotion: {{{emotion}}}

  Explanation: `,
});

const generateEmotionExplanationFlow = ai.defineFlow(
  {
    name: 'generateEmotionExplanationFlow',
    inputSchema: GenerateEmotionExplanationInputSchema,
    outputSchema: GenerateEmotionExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
