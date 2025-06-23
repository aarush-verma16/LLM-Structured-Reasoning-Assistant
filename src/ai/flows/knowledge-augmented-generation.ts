'use server';

/**
 * @fileOverview Knowledge Augmented Generation (KAG) flow.
 *
 * This flow allows users to input a specific fact or piece of knowledge that the AI assistant
 * can incorporate into its responses to increase factual accuracy.
 *
 * @param {KnowledgeAugmentedGenerationInput} input - The input to the KAG flow.
 * @returns {Promise<KnowledgeAugmentedGenerationOutput>} - The output of the KAG flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KnowledgeAugmentedGenerationInputSchema = z.object({
  question: z.string().describe('The user question.'),
  providedFact: z.string().optional().describe('An optional fact provided by the user.'),
  modelKnowledge: z.string().describe('Base knowledge from the model.'),
});
export type KnowledgeAugmentedGenerationInput = z.infer<typeof KnowledgeAugmentedGenerationInputSchema>;

const KnowledgeAugmentedGenerationOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer incorporating the fact, if provided.'),
});
export type KnowledgeAugmentedGenerationOutput = z.infer<typeof KnowledgeAugmentedGenerationOutputSchema>;

export async function knowledgeAugmentedGeneration(input: KnowledgeAugmentedGenerationInput): Promise<KnowledgeAugmentedGenerationOutput> {
  return knowledgeAugmentedGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeAugmentedGenerationPrompt',
  input: {schema: KnowledgeAugmentedGenerationInputSchema},
  output: {schema: KnowledgeAugmentedGenerationOutputSchema},
  prompt: `You are an AI assistant. Answer the user's question using your own knowledge and any provided facts.

  Question: {{{question}}}

  {{#if providedFact}}
  Fact provided by the user: {{{providedFact}}}
  Incorporate this fact directly into your answer and cite it appropriately, if needed.
  {{else}}
  No fact was provided. Use your own model knowledge to answer the question.
  {{/if}}

  Here is some additional knowledge that you can use to answer the question:
  {{modelKnowledge}}

  Answer:
`,
});

const knowledgeAugmentedGenerationFlow = ai.defineFlow(
  {
    name: 'knowledgeAugmentedGenerationFlow',
    inputSchema: KnowledgeAugmentedGenerationInputSchema,
    outputSchema: KnowledgeAugmentedGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
