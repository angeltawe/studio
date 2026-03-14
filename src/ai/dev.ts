import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-quiz-flow.ts';
import '@/ai/flows/extract-school-timetable.ts';
import '@/ai/flows/generate-personalized-study-plan.ts';