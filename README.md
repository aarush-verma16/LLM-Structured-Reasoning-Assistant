# AI Assistant Demo: RAG, KAG, and Context-Aware Generation

This project is an interactive Next.js application designed to demonstrate several powerful AI concepts in a hands-on way. It features a smart Q&A assistant that utilizes various techniques to provide nuanced and accurate responses.

## Key Features

- **Interactive Form:** A user-friendly interface to ask questions and configure the AI's behavior.
- **Transformer Model:** See the base text generation capabilities of a foundational AI model.
- **Retrieval-Augmented Generation (RAG):** Enhance the AI's knowledge by providing it with content from a document. The AI will use this document to answer your questions.
- **Knowledge-Augmented Generation (KAG):** Inject specific, factual information into the AI's prompt to ensure factual accuracy in its response.
- **Context-Aware Generation (CAG):** Tailor the AI's response style by adjusting parameters like user age, expertise level, and desired tone (e.g., formal or friendly).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI Toolkit:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    # .env.local
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development servers:**
    This project requires two processes to run concurrently: the Next.js development server and the Genkit developer UI.

    - **Terminal 1: Start the Next.js app:**
      ```bash
      npm run dev
      ```
      Your application will be available at [http://localhost:9002](http://localhost:9002).

    - **Terminal 2: Start the Genkit developer UI:**
      ```bash
      npm run genkit:watch
      ```
      The Genkit UI will be available at [http://localhost:4000](http://localhost:4000). This tool allows you to inspect, run, and debug your Genkit flows.

## Available Scripts

- `npm run dev`: Starts the Next.js application in development mode with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run genkit:dev`: Starts the Genkit developer UI.
- `npm run genkit:watch`: Starts the Genkit developer UI in watch mode, automatically reloading on file changes.
