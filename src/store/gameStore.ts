import { create } from 'zustand';

export type GameMode = 'manipulation' | 'dark_manipulation' | null;

export interface GameState {
  mode: GameMode;
  isGenerating: boolean;
  generatedContent: string | null;
  sceneContent: string;
  revealContent: string;
  userGuessed: boolean;
  selectedSuspect: string | null;
  setMode: (mode: GameMode) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setContent: (content: string) => void;
  setUserGuessed: (guessed: boolean, suspect: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  mode: null,
  isGenerating: false,
  generatedContent: null,
  sceneContent: '',
  revealContent: '',
  userGuessed: false,
  selectedSuspect: null,
  
  setMode: (mode) => set({ mode }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setContent: (content) => {
    // Split the content to hide the reveal until the user guesses
    // Standardizing the split marker
    const normalizedContent = content.replace(/\*\*REVEAL/gi, 'REVEAL').replace(/## REVEAL/gi, 'REVEAL');
    const revealIndex = normalizedContent.indexOf('REVEAL & PSYCHOLOGICAL BREAKDOWN');
    
    if (revealIndex !== -1) {
      set({ 
        generatedContent: content,
        sceneContent: content.substring(0, revealIndex).trim(),
        revealContent: content.substring(revealIndex).trim()
      });
    } else {
      // Fallback if the strict header is not found
      set({ 
        generatedContent: content,
        sceneContent: content,
        revealContent: "Reveal unavailable. (Error formatting response)"
      });
    }
  },
  setUserGuessed: (guessed, suspect) => set({ userGuessed: guessed, selectedSuspect: suspect }),
  resetGame: () => set({ 
    mode: null, 
    isGenerating: false, 
    generatedContent: null, 
    sceneContent: '', 
    revealContent: '', 
    userGuessed: false, 
    selectedSuspect: null 
  }),
}));
