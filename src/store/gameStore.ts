import { create } from 'zustand';

export type GameMode = 'manipulation' | 'dark_manipulation' | null;

export interface GameState {
    mode: GameMode;
    isGenerating: boolean;
    generatedContent: string | null;
    sceneContent: string;
    revealContent: string;
    cluesContent: string | null;
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
    cluesContent: null,
    userGuessed: false,
    selectedSuspect: null,

    setMode: (mode) => set({ mode }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setContent: (content) => {
        // Split the content to hide the reveal until the user guesses
        // Standardizing the split marker
        const normalizedContent = content.replace(/\*\*REVEAL/gi, 'REVEAL').replace(/## REVEAL/gi, 'REVEAL');
        const revealIndex = normalizedContent.indexOf('REVEAL & PSYCHOLOGICAL BREAKDOWN');

        let sceneText = normalizedContent;
        let revealText = "Reveal unavailable. (Error formatting response)";
        if (revealIndex !== -1) {
            sceneText = normalizedContent.substring(0, revealIndex).trim();
            revealText = normalizedContent.substring(revealIndex).trim();
        }

        // Try to extract CLUES and remove it from main text so it can be revealed on demand
        let cluesText = null;

        let cluesIndex = sceneText.indexOf('\nCLUES');
        if (cluesIndex === -1) cluesIndex = sceneText.indexOf('CLUES\n');
        if (cluesIndex === -1) cluesIndex = sceneText.indexOf('## CLUES');
        if (cluesIndex === -1) cluesIndex = sceneText.indexOf('**CLUES**');

        let decisionIndex = sceneText.indexOf('\nDECISION');
        if (decisionIndex === -1) decisionIndex = sceneText.indexOf('DECISION\n');
        if (decisionIndex === -1) decisionIndex = sceneText.indexOf('## DECISION');
        if (decisionIndex === -1) decisionIndex = sceneText.indexOf('**DECISION**');

        if (cluesIndex !== -1 && decisionIndex !== -1 && decisionIndex > cluesIndex) {
            cluesText = sceneText.substring(cluesIndex, decisionIndex).trim();
            // rebuild sceneText without the clues section
            sceneText = sceneText.substring(0, cluesIndex).trim() + '\n\n' + sceneText.substring(decisionIndex).trim();
        }

        set({
            generatedContent: content,
            sceneContent: sceneText,
            revealContent: revealText,
            cluesContent: cluesText
        });
    },
    setUserGuessed: (guessed, suspect) => set({ userGuessed: guessed, selectedSuspect: suspect }),
    resetGame: () => set({
        mode: null,
        isGenerating: false,
        generatedContent: null,
        sceneContent: '',
        revealContent: '',
        cluesContent: null,
        userGuessed: false,
        selectedSuspect: null
    }),
}));
