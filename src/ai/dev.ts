import { config } from 'dotenv';
config();

import '@/ai/flows/extract-audio-features.ts';
import '@/ai/flows/classify-emotion.ts';
import '@/ai/flows/generate-emotion-explanation.ts';