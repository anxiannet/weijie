
'use server';
/**
 * @fileOverview 新加坡中国留学生落户咨询 AI 助手。
 *
 * - smartSettleAdvisor - 提供个性化新加坡定居建议的函数。
 * - SmartSettleAdvisorInput - 输入类型。
 * - SmartSettleAdvisorOutput - 输出类型。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSettleAdvisorInputSchema = z.object({
  question: z.string().describe("学生关于在新加坡生活的具体问题。"),
});
export type SmartSettleAdvisorInput = z.infer<typeof SmartSettleAdvisorInputSchema>;

const SmartSettleAdvisorOutputSchema = z.object({
  advice: z.string().describe("AI 提供的个性化且符合文化背景的建议。"),
});
export type SmartSettleAdvisorOutput = z.infer<typeof SmartSettleAdvisorOutputSchema>;

export async function smartSettleAdvisor(input: SmartSettleAdvisorInput): Promise<SmartSettleAdvisorOutput> {
  return smartSettleAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSettleAdvisorPrompt',
  input: {schema: SmartSettleAdvisorInputSchema},
  output: {schema: SmartSettleAdvisorOutputSchema},
  prompt: `你是一位专门为初到新加坡的中国留学生设计的专家级 AI 顾问。你的目标是提供即时、个性化且符合文化背景的建议，帮助他们平稳过渡到本地生活。

在回复时，请务必考虑到中国学生的文化背景、支付习惯（如支付宝/微信 vs PayNow）以及实操需求（如学生证 STP 换取、银行开户选哪家、DBS/OCBC 差异、Singpass 注册等）。

语气要专业、亲切且令人安心。请使用中文回答。

学生的问题如下：
问题：{{{question}}}

请针对该话题提供全面的建议，包括具体的操作步骤和实用的小贴士。`,
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
