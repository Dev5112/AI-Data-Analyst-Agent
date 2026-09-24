import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { UploadZone } from '../components/features/UploadZone';
import { Button } from '../components/ui/Button';
import { analyzeData, type AnalysisResponse } from '../services/api';
import { Sparkles, Upload, Send, Image as ImageIcon, Maximize2, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fake Data for mock charts
const mockBars = [40, 70, 45, 90, 60, 85, 55, 95, 75, 80, 65, 85];
const mockLines = "M 0 50 Q 20 40, 40 45 T 80 30 T 120 10";

export function Home() {
  const [questions, setQuestions] = useState('');
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Hello! I'm your AI Data Analyst. Ask me about your datasets or insights." }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = async () => {
    if (!questions.trim()) {
      setError('Please provide at least one question.');
      return;
    }

    const currentQuestion = questions;
    setQuestions('');
    setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);
    setIsLoading(true);
    setError(null);

    try {
      const questionsBlob = new Blob([currentQuestion], { type: 'text/plain' });
      const questionsFile = new File([questionsBlob], 'questions.txt', { type: 'text/plain' });
      const data = await analyzeData(questionsFile, dataFile);
      setResults(data);
      
      // Add AI text responses to chat
      const textResponses = Object.entries(data)
        .filter(([_, val]) => typeof val === 'string' && !val.startsWith('data:image'))
        .map(([q, a]) => `**${q}**\n${a}`)
        .join('\n\n');
        
      if (textResponses) {
         setChatHistory(prev => [...prev, { role: 'ai', text: textResponses }]);
      } else if (Object.keys(data).length > 0) {
         setChatHistory(prev => [...prev, { role: 'ai', text: "I've generated the visualizations for you! Check the DataViz Command Center." }]);
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, an error occurred during analysis." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const plotResults = results 
    ? Object.entries(results).filter(([_, val]) => typeof val === 'string' && val.startsWith('data:image'))
    : [];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 p-2 lg:p-4">
        
        {/* Left Column: Chat Interface */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl relative shadow-indigo-900/10">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-slate-800/20 backdrop-blur-md">
            <h2 className="text-white font-semibold flex items-center tracking-wide">
              AI ANALYST CHAT
            </h2>
            <div className="flex space-x-3 text-slate-400">
              <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
              <X className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800/50">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm' : 'bg-slate-800 border border-slate-700/50 text-slate-300 rounded-tl-sm'}`}>
                  {msg.text.split('\n').map((line, j) => (
                     <span key={j}>{line}<br/></span>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-2xl rounded-tl-sm text-slate-400 text-sm flex items-center space-x-2">
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                 </div>
               </div>
            )}
            {error && (
              <div className="flex justify-center">
                 <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs">
                   {error}
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full p-1.5 px-4">
              <ImageIcon className="w-5 h-5 text-slate-400 hover:text-indigo-400 cursor-pointer" />
              <Plus className="w-5 h-5 text-slate-400 hover:text-indigo-400 cursor-pointer" />
              <input 
                type="text"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 text-sm px-2 py-2"
              />
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: DataViz Command Center */}
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-white font-bold text-xl tracking-tight">DATAVIZ COMMAND CENTER</h2>
            <div className="text-slate-400 text-xs font-medium">
               {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {!results || plotResults.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fake Revenue Overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-1">Revenue Overview</h3>
                <p className="text-slate-400 text-xs mb-4">Line Graph</p>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl font-bold text-white">$425.8K</span>
                </div>
                <div className="h-24 w-full relative">
                   <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible preserve-aspect-ratio-none">
                     <path d="M 0 45 Q 20 30, 40 35 T 60 15 T 100 5" fill="none" stroke="#3b82f6" strokeWidth="3" />
                     <path d="M 0 50 Q 20 40, 40 45 T 60 25 T 100 15" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                     <path d="M 0 48 Q 20 45, 40 40 T 60 35 T 100 20" fill="none" stroke="#10b981" strokeWidth="2" />
                   </svg>
                </div>
              </div>

              {/* Fake Sales Distribution */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
                <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-1">Sales Distribution</h3>
                <p className="text-slate-400 text-xs mb-4">Bar Chart</p>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl font-bold text-white">$92K</span>
                </div>
                <div className="h-24 flex items-end justify-between space-x-1">
                   {mockBars.map((h, i) => (
                     <div key={i} className="w-full bg-gradient-to-t from-indigo-500 to-teal-400 rounded-t-sm" style={{height: `${h}%`}} />
                   ))}
                </div>
              </div>

              {/* Fake Regional Performance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />
                <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-1">Regional Performance</h3>
                <p className="text-slate-400 text-xs mb-4">Donut Chart</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="w-24 h-24 rounded-full border-[12px] border-slate-700 border-t-blue-500 border-r-teal-400 border-b-orange-400 border-l-emerald-500 relative">
                     <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-full"></div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-blue-500"/><span>38% North</span></div>
                    <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-teal-400"/><span>29% South</span></div>
                    <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-orange-400"/><span>12% West</span></div>
                  </div>
                </div>
              </div>
              
              {/* Upload Zone */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-center">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-500" />
                 <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-4">Upload Dataset</h3>
                 <UploadZone 
                    label="Drag & Drop files here"
                    selectedFile={dataFile}
                    onFileSelect={setDataFile}
                    accept={{
                      'text/csv': ['.csv'],
                      'application/vnd.ms-excel': ['.xls', '.xlsx'],
                      'application/json': ['.json'],
                      'text/plain': ['.txt'],
                      'application/parquet': ['.parquet']
                    }}
                  />
                  {dataFile && (
                    <div className="mt-4 text-xs text-indigo-400 bg-indigo-500/10 p-2 rounded truncate">
                       Selected: {dataFile.name}
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Real Plots from backend */}
               {plotResults.map(([question, base64], idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-4 truncate" title={question}>{question}</h3>
                    <img src={base64} alt={question} className="w-full h-auto rounded-lg" />
                  </div>
               ))}
               
               {/* Upload Zone (always show so they can change dataset) */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center">
                 <h3 className="text-slate-100 font-bold uppercase tracking-wider text-xs mb-4">Upload New Dataset</h3>
                 <UploadZone 
                    label="Drag & Drop files here"
                    selectedFile={dataFile}
                    onFileSelect={setDataFile}
                    accept={{
                      'text/csv': ['.csv'],
                      'application/vnd.ms-excel': ['.xls', '.xlsx'],
                      'application/json': ['.json'],
                      'text/plain': ['.txt'],
                      'application/parquet': ['.parquet']
                    }}
                  />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
