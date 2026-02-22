import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export const maxDuration = 60; // Max execution time for serverless functions

export async function POST(req: Request) {
    try {
        const { mode } = await req.json();

        if (!mode || (mode !== 'manipulation' && mode !== 'dark_manipulation')) {
            return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: 'Groq API Key not found. Please add it to your .env.local file.' }, { status: 500 });
        }

        const systemPrompt = `You are the narrative and psychological engine for a web application called "Podium".

PROJECT OVERVIEW:
Podium is an immersive psychological detective platform where the user plays as a highly intelligent detective solving crimes driven by psychological manipulation. Through interactive storylines, the user must identify hidden manipulation tactics embedded in dialogue and correctly guess the killer or mastermind.

CORE EXPERIENCE:
The storytelling must be cinematic, immersive, tense, and psychologically layered.
The user experiences the story in second-person perspective.
Do NOT reveal the manipulation tactic during the story.

MODE REQUIREMENTS:
${mode === 'manipulation'
                ? `MODE 1: Manipulation
Focus on subtle, everyday psychological influence tactics.
Embed natural examples of:
- Emotional framing
- Social pressure
- Ego triggers
- Authority bias
- Scarcity signals
- Guilt dynamics
- Mirroring
- Misdirection
These tactics must be hidden inside character dialogue.`
                : `MODE 2: Dark Manipulation
Focus on high-intensity psychological pressure environments.
Include:
- Coercive control patterns
- Emotional destabilization
- Isolation tactics
- Power imbalance dynamics
- Psychological intimidation
- Strategic pressure
Keep tone darker, more strategic, more intense.`}

STORY STRUCTURE:
1. SCENE – Crime introduction (immersive noir tone).
2. SUSPECTS – 3 to 5 distinct personalities.
3. INTERROGATION – Dialogue-heavy psychological exchanges.
4. DECISION – End with a prompt for the user's decision "Who is the killer?".
5. REVEAL & PSYCHOLOGICAL BREAKDOWN – The mastermind revealed and analytical explanation section with 5 key points.

OUTPUT REQUIREMENTS:
- Write in second-person perspective.
- Maintain tension and ambiguity.
- Avoid directly labeling tactics during narrative.
- Make clues subtle.
- The killer must always use psychological manipulation as part of their strategy.
- Tone must be intelligent, strategic, and analytical.
- Never glorify harmful behavior. Focus on awareness and understanding.
- YOU MUST USE EXACTLY THESE SECTION HEADERS: SCENE, SUSPECTS, INTERROGATION, DECISION, REVEAL & PSYCHOLOGICAL BREAKDOWN (capitalized as such).
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: 'Generate a new psychological detective scenario using the provided guidelines. Output only the requested story sections with exact headers.'
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 3000,
        });

        const outputContent = chatCompletion.choices[0]?.message?.content || '';

        return NextResponse.json({ content: outputContent });
    } catch (error) {
        console.error('Error generating narrative:', error);
        return NextResponse.json({ error: 'Failed to generate narrative' }, { status: 500 });
    }
}
