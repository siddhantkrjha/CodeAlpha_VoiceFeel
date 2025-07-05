'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically extracting audio features from speech recordings.
 *
 * - extractAudioFeatures - A function that initiates the audio feature extraction process.
 * - ExtractAudioFeaturesInput - The input type for the extractAudioFeatures function.
 * - ExtractAudioFeaturesOutput - The return type for the extractAudioFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractAudioFeaturesInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A speech audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' for WAV or other audio formats."
    ),
});
export type ExtractAudioFeaturesInput = z.infer<typeof ExtractAudioFeaturesInputSchema>;

const ExtractAudioFeaturesOutputSchema = z.object({
  mfccs: z.array(z.array(z.number())).describe('Mel-Frequency Cepstral Coefficients extracted from the audio.'),
  spectralCentroid: z.array(z.number()).describe('Spectral centroid values extracted from the audio.'),
  spectralFlux: z.array(z.number()).describe('Spectral flux values extracted from the audio.'),
  zcr: z.array(z.number()).describe('Zero crossing rate values extracted from the audio.'),
});
export type ExtractAudioFeaturesOutput = z.infer<typeof ExtractAudioFeaturesOutputSchema>;

export async function extractAudioFeatures(input: ExtractAudioFeaturesInput): Promise<ExtractAudioFeaturesOutput> {
  return extractAudioFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractAudioFeaturesPrompt',
  input: {schema: ExtractAudioFeaturesInputSchema},
  output: {schema: ExtractAudioFeaturesOutputSchema},
  prompt: `You are an expert in digital signal processing. Your task is to extract audio features from the given speech audio recording.

You will be provided with a base64 encoded audio data URI. Extract the following features:
- MFCCs (Mel-Frequency Cepstral Coefficients):
- Spectral Centroid
- Spectral Flux
- Zero Crossing Rate (ZCR)

Return the extracted features in JSON format.

Audio data URI: {{media url=audioDataUri}}
`,
});

const extractAudioFeaturesFlow = ai.defineFlow(
  {
    name: 'extractAudioFeaturesFlow',
    inputSchema: ExtractAudioFeaturesInputSchema,
    outputSchema: ExtractAudioFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
