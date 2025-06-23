'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating context-aware responses based on user-provided context.
 *
 * - contextAwareResponse - A function that generates responses tailored to user context.
 * - ContextAwareResponseInput - The input type for the contextAwareResponse function.
 * - ContextAwareResponseOutput - The return type for the contextAwareResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextAwareResponseInputSchema = z.object({
  question: z.string().describe('The user question.'),
  age: z.number().describe('The age of the user.'),
  expertiseLevel: z.enum(['beginner', 'intermediate', 'expert']).describe('The expertise level of the user.'),
  tone: z.enum(['formal', 'friendly']).describe('The preferred tone of the response.'),
  ragContent: z.string().optional().describe('Content retrieved from RAG.'),
  kagFact: z.string().optional().describe('A specific fact provided by the user.'),
});
export type ContextAwareResponseInput = z.infer<typeof ContextAwareResponseInputSchema>;

const ContextAwareResponseOutputSchema = z.object({
  response: z.string().describe('The generated response tailored to the user context.'),
});
export type ContextAwareResponseOutput = z.infer<typeof ContextAwareResponseOutputSchema>;

export async function contextAwareResponse(input: ContextAwareResponseInput): Promise<ContextAwareResponseOutput> {
  return contextAwareResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextAwareResponsePrompt',
  input: {schema: ContextAwareResponseInputSchema},
  output: {schema: ContextAwareResponseOutputSchema},
  prompt: `You are an AI assistant that provides answers tailored to the user's context.

  The user's age is: {{{age}}}
  The user's expertise level is: {{{expertiseLevel}}}
  The preferred tone is: {{{tone}}}

  {{#if ragContent}}
  According to the uploaded document:
  {{ragContent}}
  {{/if}}

  {{#if kagFact}}
  Fact: {{{kagFact}}}
  {{/if}}

  Question: {{{question}}}

  Instructions:
  - If the user is a child (age < 13), simplify the language and use examples.
  - If the user is an expert, use technical terms.
  - If the tone is "friendly," make the answer casual and conversational.
  - Incorporate the fact, if provided, into your answer to increase factual accuracy. You can cite it inline.

  Answer:
  `,
});

const contextAwareResponseFlow = ai.defineFlow(
  {
    name: 'contextAwareResponseFlow',
    inputSchema: ContextAwareResponseInputSchema,
    outputSchema: ContextAwareResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
