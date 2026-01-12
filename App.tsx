
import React, { useState, useEffect, useCallback } from 'react';
import { generateScenario } from './services/geminiService';
import { Scenario, AppState, Option, ChallengeStage } from './types';
import DataDashboard from './components/DataDashboard';
import FeedbackModal from './components/FeedbackModal';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>({
    currentStageIndex: 0,
    completed: false,
    score: 0,
    mistakes: 0,
    history: []
  });
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const initScenario = useCallback(async () => {
    try {
      setLoading(true);
      const data = await generateScenario();
      setScenario(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load scenario. Please check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initScenario();
  }, [initScenario]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    if (selectedOption?.isCorrect) {
      if (scenario && appState.currentStageIndex < scenario.stages.length - 1) {
        setAppState(prev => ({
          ...prev,
          currentStageIndex: prev.currentStageIndex + 1,
          score: prev.score + 100
        }));
      } else {
        setAppState(prev => ({ ...prev, completed: true, score: prev.score + 100 }));
      }
    } else {
      setAppState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    }
    setShowFeedback(false);
    setSelectedOption(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-light animate-pulse">Initializing Virtual Workspace...</h2>
        <p className="mt-4 text-slate-400 text-center max-w-md italic">
          Fetching dataset from corporate servers, setting up analytics environment, and awaiting boss briefing.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">System Overload</h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 font-bold">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full">Mentored Minds</div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">Internship Simulator <span className="text-blue-600">8.0</span></h1>
            <p className="text-lg text-slate-600">
              Step into the shoes of a Data Analytics Intern. You've just been handed a messy dataset and a high-stakes business problem. Your decisions will either lead to growth or costly mistakes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">1</span>
                Observe the noisy business data
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">2</span>
                Clean and process under pressure
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">3</span>
                Validate insights for the boardroom
              </div>
            </div>
            <button 
              onClick={() => setGameStarted(true)}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-blue-600 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-200"
            >
              <span className="relative">Start My Internship</span>
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800" 
              alt="Data Analytics" 
              className="relative rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    );
  }

  if (appState.completed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-10 shadow-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto text-4xl">🎓</div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900">Internship Completed!</h2>
            <p className="text-slate-500">You've successfully navigated the complexities of corporate data.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Score</span>
              <span className="text-3xl font-black text-blue-600">{appState.score}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Mistakes Avoided</span>
              <span className="text-3xl font-black text-slate-900">{appState.mistakes === 0 ? 'Flawless' : appState.mistakes}</span>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            Your manager, {scenario?.bossName}, is impressed with your attention to detail. These skills are the foundation of a great Data Analyst.
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
          >
            Start New Assignment
          </button>
        </div>
      </div>
    );
  }

  const currentStage = scenario?.stages[appState.currentStageIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">MM</div>
          <div>
            <h2 className="text-lg font-bold leading-none">{scenario?.title}</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">{scenario?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Progress</div>
            <div className="h-2 w-32 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${((appState.currentStageIndex + 1) / (scenario?.stages.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-mono text-sm">
            {appState.score} pts
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Briefing & Dataset */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/seed/${scenario?.bossName}/100/100`} alt="Manager" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{scenario?.bossName} <span className="text-slate-400 font-normal">· Your Manager</span></h3>
                <p className="text-slate-600 mt-1 italic">"{scenario?.brief}"</p>
              </div>
            </div>
          </section>

          {scenario && <DataDashboard data={scenario.dataset} />}
        </div>

        {/* Right Column: Active Challenge */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden sticky top-24">
            <div className="bg-blue-600 px-6 py-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Stage {appState.currentStageIndex + 1} of {scenario?.stages.length}</span>
              <h3 className="text-lg font-bold mt-1">{currentStage?.type}</h3>
            </div>
            
            <div className="p-6">
              <p className="text-slate-800 font-medium text-lg leading-relaxed mb-8">
                {currentStage?.question}
              </p>

              <div className="space-y-4">
                {currentStage?.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all group flex gap-4 items-start"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center flex-shrink-0 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform"></div>
                    </div>
                    <span className="text-slate-600 font-medium group-hover:text-blue-900">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
              <span>Time on Task: ~10m</span>
              <span>Mistakes: {appState.mistakes}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal Overlay */}
      <FeedbackModal 
        option={selectedOption} 
        onClose={handleFeedbackClose} 
        isCorrect={selectedOption?.isCorrect || false}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 text-center text-slate-400 text-xs">
        &copy; 2024 Mentored Minds · High-Fidelity Data Analytics Simulator v8.2.4
      </footer>
    </div>
  );
};

export default App;
