// RagQuestionAnswering.ts
'use server';

/**
 * @fileOverview Implements Retrieval-Augmented Generation (RAG) to answer questions based on uploaded documents.
 *
 * - ragQuestionAnswering - A function that takes a question and optional document content, then returns an AI-generated answer augmented with retrieved content from the document.
 * - RagQuestionAnsweringInput - The input type for the ragQuestionAnswering function, including the question and document content.
 * - RagQuestionAnsweringOutput - The return type for the ragQuestionAnswering function, containing the AI-generated answer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RagQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  documentContent: z.string().optional().describe('The content of the document to use for answering the question.'),
  userAge: z.number().optional().describe('The age of the user.'),
  userExpertise: z.string().optional().describe('The expertise level of the user (beginner, intermediate, expert).'),
  preferredTone: z.string().optional().describe('The preferred tone of the response (formal, friendly).'),
  providedFact: z.string().optional().describe('A fact to incorporate into the answer.'),
});
export type RagQuestionAnsweringInput = z.infer<typeof RagQuestionAnsweringInputSchema>;

const RagQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question, incorporating retrieved content from the document and the provided fact.'),
});
export type RagQuestionAnsweringOutput = z.infer<typeof RagQuestionAnsweringOutputSchema>;

export async function ragQuestionAnswering(input: RagQuestionAnsweringInput): Promise<RagQuestionAnsweringOutput> {
  return ragQuestionAnsweringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ragQuestionAnsweringPrompt',
  input: {schema: RagQuestionAnsweringInputSchema},
  output: {schema: RagQuestionAnsweringOutputSchema},
  prompt: `You are a helpful Q&A assistant that answers questions based on provided documents, user context, and optional facts.

Context-Aware Generation (CAG):
- The user's age is: {{userAge}}
- The user's expertise level is: {{userExpertise}}
- The preferred tone is: {{preferredTone}}

Based on this context, adjust your response accordingly:
  - If the user is a child, simplify language and use examples.
  - If the user is an expert, use technical terms.
  - If the tone is friendly, make the answer casual and conversational.

Retrieval-Augmented Generation (RAG):
{{#if documentContent}}
  According to the uploaded document:
  {{documentContent}}
{{/if}}

Knowledge-Augmented Generation (KAG):
{{#if providedFact}}
  Fact: {{providedFact}}
{{/if}}

Question: {{{question}}}

Answer the question using the document content (if available), user context, and provided fact (if available). Mention when content is being used from uploaded files or if the injected fact is being used.`, 
});

const ragQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'ragQuestionAnsweringFlow',
    inputSchema: RagQuestionAnsweringInputSchema,
    outputSchema: RagQuestionAnsweringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
