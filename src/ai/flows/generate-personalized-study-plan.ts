'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized study plan.
 *
 * - generatePersonalizedStudyPlan - A function that handles the personalized study plan generation process.
 * - GeneratePersonalizedStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - GeneratePersonalizedStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchoolTimetableEntrySchema = z.object({
  day: z.string().describe('Day of the week, e.g., "Monday"'),
  subject: z.string().describe('Name of the subject or class, e.g., "Mathematics"'),
  startTime: z.string().describe('Start time in HH:MM 24-hour format, e.g., "09:00"'),
  endTime: z.string().describe('End time in HH:MM 24-hour format, e.g., "10:00"'),
});

const GeneratePersonalizedStudyPlanInputSchema = z.object({
  schoolTimetable: z.array(SchoolTimetableEntrySchema).describe('The extracted school timetable, as a list of entries including subjects, days, and times.'),
  preferredStudyTimes: z.array(
    z.object({
      day: z.string().describe('Day of the week, e.g., "Monday"'),
      startTime: z.string().describe('Start time in HH:MM 24-hour format, e.g., "17:00"'),
      endTime: z.string().describe('End time in HH:MM 24-hour format, e.g., "19:00"'),
    })
  ).describe('User-defined blocks of time available for studying.'),
  subjectDifficultyRankings: z.array(
    z.object({
      subject: z.string().describe('Name of the subject, e.g., "Mathematics"'),
      difficulty: z.enum(['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']).describe('Difficulty level of the subject.'),
    })
  ).describe('User-ranked difficulty levels for subjects, from "Very Easy" to "Very Hard".'),
});
export type GeneratePersonalizedStudyPlanInput = z.infer<typeof GeneratePersonalizedStudyPlanInputSchema>;

const GeneratePersonalizedStudyPlanOutputSchema = z.array(
  z.object({
    subject: z.string().describe('The subject to be studied.'),
    day: z.string().describe('Day of the week for the study session.'),
    startTime: z.string().describe('Start time of the study session in HH:MM 24-hour format.'),
    endTime: z.string().describe('End time of the study session in HH:MM 24-hour format.'),
    durationMinutes: z.number().describe('Duration of the study session in minutes.'),
    notes: z.string().optional().describe('Any specific notes for this study session.'),
  })
).describe('A personalized study plan, as an array of study sessions.');
export type GeneratePersonalizedStudyPlanOutput = z.infer<typeof GeneratePersonalizedStudyPlanOutputSchema>;

export async function generatePersonalizedStudyPlan(input: GeneratePersonalizedStudyPlanInput): Promise<GeneratePersonalizedStudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}

const generatePersonalizedStudyPlanPrompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: { schema: GeneratePersonalizedStudyPlanInputSchema },
  output: { schema: GeneratePersonalizedStudyPlanOutputSchema },
  prompt: `You are an expert study planner AI. Your task is to create a personalized study schedule for a student based on their school timetable, preferred study availability, and subject difficulty rankings.

**Instructions:**
1.  **Integrate School Timetable:** Do NOT schedule any study sessions that overlap with the student's school timetable. The school timetable is provided as an array of entries.
2.  **Utilize Preferred Study Times:** ONLY schedule study sessions within the specified 'preferredStudyTimes' provided by the student.
3.  **Prioritize Subjects:** Allocate more study time or more frequent sessions to subjects ranked 'Hard' or 'Very Hard'. Distribute study time for 'Medium' subjects, and less time for 'Easy' or 'Very Easy' subjects.
4.  **Balance and Coverage:** Aim to provide a balanced schedule that covers all subjects listed in the difficulty rankings, ensuring adequate preparation for each.
5.  **Session Lengths:** Create study sessions that are generally between 30 to 90 minutes long. You can combine or split preferred study slots as needed to create optimal session lengths.
6.  **Output Format:** Your output MUST be a JSON array of study sessions, strictly adhering to the GeneratePersonalizedStudyPlanOutputSchema. Each session should include the subject, day, start time, end time, and duration in minutes. If you cannot create a plan, return an empty array.

**Student's School Timetable:**
{{{json schoolTimetable}}}

**Student's Preferred Study Times:**
{{{json preferredStudyTimes}}}

**Student's Subject Difficulty Rankings:**
{{{json subjectDifficultyRankings}}}

Please generate the personalized study plan:`,
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GeneratePersonalizedStudyPlanInputSchema,
    outputSchema: GeneratePersonalizedStudyPlanOutputSchema,
  },
  async (input) => {
    const {output} = await generatePersonalizedStudyPlanPrompt(input);
    return output!;
  }
);
