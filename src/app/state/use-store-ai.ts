import { create } from "zustand";

interface Assistant {
    role: 'user' | 'assistant';
    content: string;
}

interface OllamaState {
    isGenerating: boolean
    messages: Assistant[],
    generateResponse: (prompt: string) => Promise<void>
}

export const UseAiStore = create<OllamaState>((set, get) => ({
    isGenerating: false,
    messages: [],

    generateResponse: async (prompt: string) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        set((state) => ({
            isGenerating: true,
            messages: [...state.messages, { role: 'user', content: trimmedPrompt }]
        }))

        try {
            const res = await fetch("https://dome-throwing-tin-conclusions.trycloudflare.com/api/ollama", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })

            const generatedResponse = await res.json();

            set((state) => ({
                isGenerating: false,
                messages: [...state.messages, { role: 'assistant', content: generatedResponse.response }]
            }));
        } catch (error) {
            console.log(error)
            set((state) => ({
                isGenerating: false,
                messages: [...state.messages, { role: 'assistant', content: "Something went wrong. Please try again later." }]
            }));
        } finally {
            set({ isGenerating: false });
        }
    }
}));