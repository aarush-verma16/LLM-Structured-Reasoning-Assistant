import { AssistantForm } from '@/components/assistant-form';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <header className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          AI Assistant Demo
        </h1>
        <p className="text-muted-foreground mt-2 font-headline text-lg md:text-xl">
          An interactive demonstration of Transformers, RAG, CAG, & KAG
        </p>
      </header>
      <AssistantForm />
    </main>
  );
}
