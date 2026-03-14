'use server';
/**
 * @fileOverview A Genkit flow for generating study quizzes based on a given subject or topic.
 *
 * - generateStudyQuiz - A function that handles the quiz generation process.
 * - GenerateStudyQuizInput - The input type for the generateStudyQuiz function.
 * - GenerateStudyQuizOutput - The return type for the generateStudyQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyQuizInputSchema = z.object({
  topic: z
    .string()
    .describe('The subject or topic for which to generate a quiz.'),
  numQuestions: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('The desired number of quiz questions. Defaults to 5 if not provided.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .optional()
    .describe('The desired difficulty level of the quiz questions. Defaults to medium.'),
});
export type GenerateStudyQuizInput = z.infer<typeof GenerateStudyQuizInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe('An array of possible answer options for the question.'),
  correctAnswer: z
    .string()
    .describe('The correct answer option for the question. Must be one of the provided options.'),
});

const GenerateStudyQuizOutputSchema = z
  .array(QuestionSchema)
  .describe('An array of quiz questions.');
export type GenerateStudyQuizOutput = z.infer<typeof GenerateStudyQuizOutputSchema>;

export async function generateStudyQuiz(
  input: GenerateStudyQuizInput
): Promise<GenerateStudyQuizOutput> {
  return generateStudyQuizFlow(input);
}

const quizPrompt = ai.definePrompt({
  name: 'quizPrompt',
  input: {schema: GenerateStudyQuizInputSchema},
  output: {schema: GenerateStudyQuizOutputSchema},
  prompt: `You are an AI quiz generator. Your task is to create a multiple-choice quiz on the given subject or topic.
Ensure all generated questions are relevant and accurate.

The quiz should have {{numQuestions}} questions and be of '{{difficulty}}' difficulty.
Each question should have between 2 and 5 answer options, and exactly one correct answer.
It is critical that the correct answer is always one of the provided options for that question.

Generate the quiz in JSON format according to the following output schema, without any additional text or formatting outside the JSON array.

Subject/Topic: {{{topic}}}`,
});

const generateStudyQuizFlow = ai.defineFlow(
  {
    name: 'generateStudyQuizFlow',
    inputSchema: GenerateStudyQuizInputSchema,
    outputSchema: GenerateStudyQuizOutputSchema,
  },
  async input => {
    const numQuestions = input.numQuestions ?? 5;
    const difficulty = input.difficulty ?? 'medium';

    const {output} = await quizPrompt({
      topic: input.topic,
      numQuestions,
      difficulty,
    });
    return output!;
  }
);
