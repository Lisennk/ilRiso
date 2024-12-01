import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DynamicComponent from './components/DynamicComponent';
import { AppState, APIResponse } from './types';
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const [risoState, setRisoState] = useState<AppState>({
    prompt: '',
    details: []
  });
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<APIResponse | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [showProofOfConcept, setShowProofOfConcept] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    
    console.log(risoState);

    try {
      const sanitizedState = {
        prompt: risoState.prompt,
        details: (risoState.details || []).map(detail => ({
          question: detail.question,
          response: detail.response
        }))
      };

      const response = await fetch(`http://0.0.0.0:7116/state/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedState),
      });
      const data: APIResponse = await response.json();
      setCurrentResponse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentResponse) return;
    
    const newState = {
      ...risoState,
      details: [...risoState.details, {
        question: currentResponse.content,
        response: currentAnswer
      }]
    };
    
    setRisoState(newState);
    setCurrentAnswer('');
  };

  useEffect(() => {
    if (risoState.details.length > 0 && !loading) {
      const lastDetail = risoState.details[risoState.details.length - 1];
      if (lastDetail.response) {
        handleSubmit();
      }
    }
  }, [risoState.details]);

  if (showIntro) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen flex flex-col">
          <header className="top-0 left-0 right-0 bg-background border-b z-10">
            <div className="container py-4">
              <h1 className="text-2xl font-bold text-center mb-2">il Riso 🍚</h1>
            </div>
          </header>

          <main className="flex-1 container p-4 mt-14 mb-24">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Issue to intervention model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>il Riso is an "issue to intervention" AI, based on Llama 3.1. Here's how it works:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Start by describing any issue or challenge you're facing</li>
                  <li>The AI will ask clarifying questions to better understand your situation</li>
                  <li>Based on your responses, it will generate a personalized intervention strategy</li>
                  <li>Unlike similar apps, il Riso doesn't have a predefined interface—everything is generated from scratch and then rendered using React.</li>
                </ul>
              </CardContent>
            </Card>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="container">
              <Button 
                onClick={() => setShowIntro(false)} 
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    );
  }

  if (showProofOfConcept) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen flex flex-col">
          <header className="top-0 left-0 right-0 bg-background border-b z-10">
            <div className="container py-4">
              <h1 className="text-2xl font-bold text-center mb-2">il Riso 🍚</h1>
            </div>
          </header>

          <main className="flex-1 container p-4 mt-14 mb-24">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Proof of Concept</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Please note that this is currently a proof of concept application.</p>
                <p>While Llama 3.1 is already capable of generating interactive mental health interventions, some additional fine-tuning will be required to get consistent results.</p>
                <p>The current version demonstrates the core functionality and interaction patterns that will be present in the final product.</p>
              </CardContent>
            </Card>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="container">
              <Button 
                onClick={() => setShowProofOfConcept(false)} 
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-background border-b z-10">
          <div className="container py-4">
            <h1 className="text-lg font-semibold text-center">Processing...</h1>
          </div>
        </header>
        <main className="flex-1 container flex items-center justify-center p-4 mt-14">
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">Processing your response...</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (currentResponse?.type === 'code') {
    return (
      <div className="min-h-screen">
        <header className="top-0 left-0 right-0 bg-background border-b z-10">
          <div className="container py-4">
            <h1 className="text-2xl font-bold text-center mb-2">Generated Riso app 🍚</h1>
          </div>
        </header>
        <DynamicComponent code={currentResponse.content} />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <header className="top-0 left-0 right-0 bg-background border-b z-10">
          <div className="container py-4">
            <h1 className="text-2xl font-bold text-center mb-2">il Riso 🍚</h1>
          </div>
        </header>

        <main className="flex-1 container p-4 mt-14 mb-24">
          {currentResponse ? (
            <div className="space-y-4">
      
              <p className="text-sm">{currentResponse.content}</p>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Your answer..."
                className="min-h-[120px]"
              />
            </div>
          ) : (
            <Textarea
              value={risoState.prompt}
              onChange={(e) => setRisoState(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Please describe what's troubling you..."
              className="min-h-[200px]"
            />
          )}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container">
            <Button 
              onClick={currentResponse ? handleAnswerSubmit : handleSubmit} 
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App; 