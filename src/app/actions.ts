// src/app/actions.ts
'use server';

import { ragQuestionAnswering, RagQuestionAnsweringInput } from '@/ai/flows/rag-question-answering';
import { z } from 'zod';

const formSchema = z.object({
  question: z.string().min(1, 'Question is required.'),
  documentContent: z.string().optional(),
  userAge: z.coerce.number().optional(),
  userExpertise: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  preferredTone: z.enum(['formal', 'friendly']).optional(),
  providedFact: z.string().optional(),
});

export async function submitQuestion(values: z.infer<typeof formSchema>) {
  try {
    const validatedInput = formSchema.parse(values);

    const result = await ragQuestionAnswering(validatedInput as RagQuestionAnsweringInput);
    
    return { success: true, answer: result.answer };
  } catch (error) {
    console.error('Error in submitQuestion action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}
