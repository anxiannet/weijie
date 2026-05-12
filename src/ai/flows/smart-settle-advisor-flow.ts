'use server';
/**
 * @fileOverview An AI advisor for Chinese international students settling in Singapore.
 *
 * - smartSettleAdvisor - A function that provides personalized advice for settling in Singapore.
 * - SmartSettleAdvisorInput - The input type for the smartSettleAdvisor function.
 * - SmartSettleAdvisorOutput - The return type for the smartSettleAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSettleAdvisorInputSchema = z.object({
  question: z.string().describe("The student's specific question about settling in Singapore."),
});
export type SmartSettleAdvisorInput = z.infer<typeof SmartSettleAdvisorInputSchema>;

const SmartSettleAdvisorOutputSchema = z.object({
  advice: z.string().describe("The AI's personalized and culturally relevant advice."),
});
export type SmartSettleAdvisorOutput = z.infer<typeof SmartSettleAdvisorOutputSchema>;

export async function smartSettleAdvisor(input: SmartSettleAdvisorInput): Promise<SmartSettleAdvisorOutput> {
  return smartSettleAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSettleAdvisorPrompt',
  input: {schema: SmartSettleAdvisorInputSchema},
  output: {schema: SmartSettleAdvisorOutputSchema},
  prompt: `You are an expert AI advisor specifically designed for new Chinese international students settling in Singapore. Your goal is to provide instant, personalized, and culturally relevant advice to help them smoothly transition into life here.

When responding, keep in mind potential cultural nuances and practical considerations for Chinese students. Be helpful, clear, and reassuring.

The student has the following question:
Question: {{{question}}}

Please provide comprehensive advice on this topic, covering practical steps and useful tips.`,
});

const smartSettleAdvisorFlow = ai.defineFlow(
  {
    name: 'smartSettleAdvisorFlow',
    inputSchema: SmartSettleAdvisorInputSchema,
    outputSchema: SmartSettleAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
