import React, { useState } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { UploadZone } from '../components/features/UploadZone';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { AnalysisResults } from '../components/features/AnalysisResults';
import { analyzeData, type AnalysisResponse } from '../services/api';
import { Sparkles, FileText, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Home() {
  const [questions, setQuestions] = useState('');
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleQuestions = [
    "What is the overall trend in the dataset?",
    "Can you create a bar chart of sales by region?",
    "Are there any outliers in the data?"
  ];

  const handleExampleClick = (q: string) => {
    setQuestions(prev => prev ? `${prev}\n- ${q}` : `- ${q}`);
  };

  const handleSubmit = async () => {
    if (!questions.trim()) {
      setError('Please provide at least one question.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Create a Blob from the textarea content to simulate a .txt file upload
      const questionsBlob = new Blob([questions], { type: 'text/plain' });
      const questionsFile = new File([questionsBlob], 'questions.txt', { type: 'text/plain' });

      const data = await analyzeData(questionsFile, dataFile);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Hero Section */}
        <section className="text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini AI</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"
          >
            Analyze Your Data Instantly
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Upload your dataset and ask questions in plain English. Get back insights, visualizations, and clean data within seconds.
          </motion.p>
        </section>

        {/* Upload & Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center mb-4">
                    <Upload className="w-5 h-5 mr-2 text-indigo-400" />
                    Data Source
                  </h3>
                  <UploadZone 
                    label="Upload Dataset"
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
                  <p className="text-xs text-slate-500 mt-3">
                    Supported: CSV, Excel, JSON, Parquet. Leave empty to query external data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-400" />
                    Your Questions
                  </h3>
                  <span className="text-xs text-slate-500">{questions.length}/2000</span>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask questions about your data...&#10;e.g. - What is the total revenue?&#10;- Plot the sales distribution over time."
                    className="flex-1 w-full min-h-[160px] bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                    maxLength={2000}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {exampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd> to submit
                  </p>
                  <Button 
                    onClick={handleSubmit} 
                    isLoading={isLoading}
                    className="w-full sm:w-auto px-8"
                  >
                    {isLoading ? 'Analyzing...' : 'Start Analyzing'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 flex items-start text-red-200">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <h4 className="font-medium text-red-400 mb-1">Analysis Failed</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-white">Analyzing Data</p>
                <p className="text-sm text-slate-400">Sending to Gemini AI and generating insights...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {results && (
          <div className="pt-8 border-t border-slate-800/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-indigo-400" />
              Analysis Results
            </h2>
            <AnalysisResults results={results} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
