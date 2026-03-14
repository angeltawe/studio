'use server';
/**
 * @fileOverview This file implements a Genkit flow for extracting school timetable information from an image or document.
 *
 * - extractSchoolTimetable - A function that handles the extraction of timetable data.
 * - ExtractSchoolTimetableInput - The input type for the extractSchoolTimetable function.
 * - ExtractSchoolTimetableOutput - The return type for the extractSchoolTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSchoolTimetableInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The school timetable, as a data URI that must include a MIME type (e.g., image/jpeg, application/pdf) and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalContext: z.string().optional().describe('Any additional text context or instructions provided by the user about the timetable.'),
});
export type ExtractSchoolTimetableInput = z.infer<typeof ExtractSchoolTimetableInputSchema>;

const ExtractSchoolTimetableOutputSchema = z.object({
  timetable: z.array(
    z.object({
      dayOfWeek: z.enum([
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ]).describe('The day of the week.'),
      classes: z.array(
        z.object({
          subject: z.string().describe('The name of the subject or class.'),
          startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('The start time of the class in HH:MM (24-hour) format.'),
          endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).describe('The end time of the class in HH:MM (24-hour) format.'),
          room: z.string().optional().describe('The room or location of the class.'),
          teacher: z.string().optional().describe('The name of the teacher for the class.'),
        })
      ).describe('A list of classes for the day, ordered by start time.'),
    })
  ).describe('The extracted school timetable, structured by day of the week.'),
});
export type ExtractSchoolTimetableOutput = z.infer<typeof ExtractSchoolTimetableOutputSchema>;

export async function extractSchoolTimetable(input: ExtractSchoolTimetableInput): Promise<ExtractSchoolTimetableOutput> {
  return extractSchoolTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSchoolTimetablePrompt',
  input: {schema: ExtractSchoolTimetableInputSchema},
  output: {schema: ExtractSchoolTimetableOutputSchema},
  prompt: `You are an expert assistant for parsing and digitizing school timetables. Your task is to accurately extract all subjects, their start and end times, the days they occur on, and any available room or teacher information from the provided school timetable.

The timetable can be an image or a document. Analyze the content carefully.

If the timetable does not specify a room or teacher for a class, omit that field from the output for that specific class.
If a class spans multiple days or has recurring times, represent each instance as a separate entry on its respective day.
Ensure that the start and end times are in HH:MM (24-hour) format.
If you cannot identify a specific time, make a reasonable estimate based on surrounding entries or mark it as null if absolutely impossible to infer.
Output the extracted information as a JSON object strictly following the provided schema.

Input Document/Image: {{media url=documentDataUri}}

{{#if additionalContext}}
Additional Context/Instructions from user:
{{{additionalContext}}}
{{/if}}`,
});

const extractSchoolTimetableFlow = ai.defineFlow(
  {
    name: 'extractSchoolTimetableFlow',
    inputSchema: ExtractSchoolTimetableInputSchema,
    outputSchema: ExtractSchoolTimetableOutputSchema,
    // Use a multimodal model capable of processing images/documents
    model: 'googleai/gemini-1.5-flash',
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
