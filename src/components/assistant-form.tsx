'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState, useRef } from 'react';
import { FileUp, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitQuestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  question: z.string().min(1, {
    message: 'Please enter a question to ask the assistant.',
  }),
  documentContent: z.string().optional(),
  userAge: z.string().optional(),
  userExpertise: z.enum(['beginner', 'intermediate', 'expert']).default('beginner'),
  preferredTone: z.enum(['formal', 'friendly']).default('friendly'),
  providedFact: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AssistantForm() {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      documentContent: '',
      userAge: '25',
      userExpertise: 'beginner',
      preferredTone: 'friendly',
      providedFact: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type && !file.type.startsWith('text/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a plain text file (.txt, .md, etc.).',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue('documentContent', text);
        toast({
          title: 'File Loaded',
          description: `Successfully loaded ${file.name}.`,
        });
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'There was an error reading the file.',
        });
      }
      reader.readAsText(file);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResponse('');
    
    const mappedValues = {
        ...values,
        userAge: values.userAge ? Number(values.userAge) : undefined
    }

    try {
      const result = await submitQuestion(mappedValues);
      if (result.success) {
        setResponse(result.answer!);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'An unexpected error occurred',
            description: 'Please try again later.',
        });
    } finally {
      setIsLoading(false);
    }
  }

  const renderResponse = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-4 whitespace-pre-wrap font-body">
        {parts.map((part, index) => {
          if (part.startsWith('```')) {
            const code = part.replace(/```/g, '');
            return (
              <pre key={index} className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="font-code text-sm">{code.trim()}</code>
              </pre>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">1. The Transformer Model</CardTitle>
              <CardDescription>
                This is the core of the AI. Ask a question to see its base text generation capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Your Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Can you explain what Transformers are in the context of AI?"
                        className="min-h-[120px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="pt-2" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">2. Augmentations (Optional)</CardTitle>
              <CardDescription>
                Enhance the AI's response by providing additional context. Expand a section to configure it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="cag">
                  <AccordionTrigger className="text-base font-headline border px-4 rounded-md [&[data-state=open]]:bg-muted">
                    Context-Aware Generation (CAG)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4 border border-t-0 px-4 pb-4 rounded-b-md">
                    <p className="text-sm text-muted-foreground -mt-2 mb-4">Tailor the AI's personality and expertise.</p>
                     <FormField
                      control={form.control}
                      name="userAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userExpertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expertise Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select expertise level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="kag">
                  <AccordionTrigger className="text-base font-headline border px-4 rounded-md [&[data-state=open]]:bg-muted">
                    Knowledge-Augmented Generation (KAG)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4 border border-t-0 px-4 pb-4 rounded-b-md">
                    <p className="text-sm text-muted-foreground -mt-2 mb-4">Inject a specific fact for the AI to use.</p>
                     <FormField
                      control={form.control}
                      name="providedFact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Optional Fact</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., Transformers were introduced in 2017 by Vaswani et al." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rag">
                  <AccordionTrigger className="text-base font-headline border px-4 rounded-md [&[data-state=open]]:bg-muted">
                    Retrieval-Augmented Generation (RAG)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4 border border-t-0 px-4 pb-4 rounded-b-md">
                    <p className="text-sm text-muted-foreground -mt-2 mb-4">Provide document context by uploading a text file or pasting content.</p>
                    <FormField
                        control={form.control}
                        name="documentContent"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Document Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Paste text here or upload a file below."
                                    className="min-h-[150px] resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload Text File
                    </Button>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".txt,.md,.text"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={isLoading} className="w-full font-headline text-lg py-6">
              {isLoading ? (
                  <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                  </>
              ) : (
                  <>
                  <Wand2 className="mr-2 h-5 w-5" />
                    Generate Response
                  </>
              )}
          </Button>

          <Card className="min-h-[200px]">
            <CardHeader>
              <CardTitle className="font-headline">Generated Response</CardTitle>
              <CardDescription>The AI's answer will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              ) : response ? (
                renderResponse(response)
              ) : (
                <p className="text-muted-foreground italic">Your generated response will be displayed here.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
