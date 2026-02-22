'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameMode } from '@/store/gameStore';
import { ArrowLeft, Loader2, Brain, Skull, Fingerprint, Eye, Search, AlertTriangle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PodiumApp() {
  const {
    mode, isGenerating, sceneContent, revealContent, userGuessed,
    setMode, setIsGenerating, setContent, setUserGuessed, resetGame
  } = useGameStore();

  return (
    <main className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-fuchsia-900 selection:text-white flex flex-col">
      {/* Background ambient light */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col px-6 py-12 md:py-24 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!mode && !sceneContent && <ModeSelection key="mode" />}
          {isGenerating && <GeneratingScreen key="generating" mode={mode} />}
          {sceneContent && !userGuessed && !isGenerating && <StoryScreen key="story" />}
          {userGuessed && <RevealScreen key="reveal" />}
        </AnimatePresence>
      </div>
    </main>
  );
}

function ModeSelection() {
  const { setMode, setIsGenerating, setContent } = useGameStore();

  const handleSelectMode = async (selectedMode: GameMode) => {
    setMode(selectedMode);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode })
      });
      const data = await res.json();

      if (res.ok) {
        setContent(data.content);
      } else {
        alert("Failed to generate: " + data.error);
      }
    } catch (e) {
      alert("Error generating story");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center flex-grow space-y-16"
    >
      <div className="text-center space-y-6 max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Fingerprint className="w-16 h-16 mx-auto mb-6 text-zinc-600 opacity-50" />
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase text-glow font-mono">
            Podium
          </h1>
        </motion.div>
        <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-wide">
          An immersive psychological detective platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Mode 1 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectMode('manipulation')}
          className="group relative flex flex-col items-start text-left p-8 rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-fuchsia-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-fuchsia-500/20 transition-colors duration-500" />
          <Brain className="w-8 h-8 text-fuchsia-500 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 relative z-10" />
          <h2 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight relative z-10">SHERLOCK</h2>
          <p className="text-zinc-500 leading-relaxed text-sm mb-6 flex-grow relative z-10">
            Identify subtle, everyday psychological influence. Emotional framing, mirroring, misdirection, and authority bias masked within dialogue.
          </p>
          <div className="flex items-center text-xs font-semibold text-fuchsia-500 tracking-widest uppercase relative z-10">
            Start Investigation <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>

        {/* Mode 2 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectMode('dark_manipulation')}
          className="group relative flex flex-col items-start text-left p-8 rounded-2xl border border-zinc-900 bg-[#070707] hover:bg-[#0a0a0a] transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(153,27,27,0)] hover:shadow-[0_0_40px_rgba(153,27,27,0.15)] hover:border-red-900/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-red-600/20 transition-colors duration-500" />
          <Skull className="w-8 h-8 text-red-600 mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 relative z-10" />
          <h2 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight relative z-10">MORIARTY</h2>
          <p className="text-zinc-500 leading-relaxed text-sm mb-6 flex-grow relative z-10">
            Navigate high-intensity psychological pressure. Uncover coercive control, emotional destabilization, and strategic intimidation.
          </p>
          <div className="flex items-center text-xs font-semibold text-red-600 tracking-widest uppercase relative z-10">
            Enter The Abyss <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

function GeneratingScreen({ mode }: { mode: GameMode }) {
  const isDark = mode === 'dark_manipulation';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-grow h-full space-y-8"
    >
      <div className="relative">
        <div className={`absolute inset-0 blur-2xl rounded-full opacity-20 ${isDark ? 'bg-red-600' : 'bg-fuchsia-600'} animate-pulse`} />
        <Loader2 className={`w-12 h-12 animate-spin relative ${isDark ? 'text-red-500' : 'text-fuchsia-500'}`} />
      </div>
      <div className="text-center space-y-2">
        <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          Interfacing with psychological engine...
        </p>
        <p className="text-zinc-600 text-xs">
          {isDark ? "Establishing pressure environment." : "Weaving dialogue patterns."}
        </p>
      </div>
    </motion.div>
  );
}

function StoryScreen() {
  const { sceneContent, setUserGuessed, resetGame, mode } = useGameStore();
  const [guess, setGuess] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim().length > 0) {
      setUserGuessed(true, guess.trim());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isScanning) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isDark = mode === 'dark_manipulation';

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1 }}
      className="w-full space-y-12 pb-24"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/50 pb-6">
        <button
          onClick={resetGame}
          className="group flex items-center text-zinc-500 hover:text-white transition-colors font-mono text-xs tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Abort Investigation
        </button>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`flex items-center px-5 py-2.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all shadow-lg ${isScanning
              ? isDark
                ? 'bg-red-900/20 text-red-400 border border-red-900/50 shadow-red-900/20'
                : 'bg-fuchsia-900/20 text-fuchsia-400 border border-fuchsia-900/50 shadow-fuchsia-900/20'
              : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800/50'
            }`}
        >
          <Search className="w-4 h-4 mr-2" />
          {isScanning ? 'Disable UV Scanner' : 'Activate UV Scanner'}
        </button>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative rounded-2xl transition-colors duration-500"
      >
        {isScanning && (
          <div
            className="pointer-events-none absolute inset-0 z-10 hidden sm:block mix-blend-screen"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${isDark ? 'rgba(153, 27, 27, 0.15)' : 'rgba(192, 38, 211, 0.15)'}, transparent 60%)`
            }}
          />
        )}
        <div className={`prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:tracking-tight prose-h1:text-white prose-p:leading-relaxed prose-p:text-zinc-300 relative z-0 ${isScanning ? 'sm:cursor-crosshair selection:bg-black selection:text-white' : ''} ${isScanning && isDark ? 'prose-strong:text-red-400' : ''} ${isScanning && !isDark ? 'prose-strong:text-fuchsia-400' : ''}`}>
          <ReactMarkdown>{sceneContent}</ReactMarkdown>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 pt-12 border-t border-zinc-800/50"
      >
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 to-transparent" />
          <h3 className="flex items-center text-xl font-bold text-white mb-6 font-mono">
            <Search className="w-5 h-5 mr-3 text-fuchsia-500" />
            IDENTIFY THE MASTERMIND
          </h3>
          <p className="text-zinc-400 mb-8 text-sm">
            Based on the psychological patterns embedded in the dialogue, who is employing the manipulation tactics?
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter suspect name..."
              className="flex-grow bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono"
            />
            <button
              type="submit"
              disabled={guess.trim().length === 0}
              className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Analyze
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RevealScreen() {
  const { revealContent, selectedSuspect, resetGame } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full space-y-12 pb-24"
    >
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Your Analysis</div>
          <div className="text-2xl font-bold text-white">{selectedSuspect}</div>
        </div>
        <div className="flex items-center text-fuchsia-400 font-mono text-sm border border-fuchsia-900/30 bg-fuchsia-950/20 px-4 py-2 rounded-full">
          <Eye className="w-4 h-4 mr-2" />
          Psychological Reveal Unlocked
        </div>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:text-fuchsia-400 prose-p:leading-relaxed prose-strong:text-white pb-12 border-b border-zinc-800/50">
        <ReactMarkdown>{revealContent}</ReactMarkdown>
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={resetGame}
          className="group flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 px-8 py-4 rounded-full transition-all text-sm font-mono tracking-widest uppercase"
        >
          New Investigation
          <AlertTriangle className="w-4 h-4 ml-3 text-zinc-500 group-hover:text-yellow-500 transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
