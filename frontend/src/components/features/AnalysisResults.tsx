import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Copy, Check, Maximize2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisResultsProps {
  results: Record<string, any>;
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  return (
    <div className="space-y-6 mt-8">
      {Object.entries(results).map(([question, answer], index) => (
        <ResultCard key={index} question={question} answer={answer} index={index} />
      ))}
    </div>
  );
}

function ResultCard({ question, answer, index }: { question: string, answer: any, index: number }) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to check and extract image data
  const getImageData = (ans: any): string | null => {
    let s = null;
    if (typeof ans === 'string') { s = ans.trim(); }
    else if (ans && typeof ans === 'object') {
      s = ans.image || ans.base64 || ans.plot || ans.data || null;
      if (typeof s === 'string') s = s.trim();
    }
    if (!s) return null;

    s = s.replace(/^data:aimage\//i, 'data:image/');
    if (/^data:image\//i.test(s)) return s;
    const base64Like = /^[A-Za-z0-9+/=\r\n]+$/.test(s) && s.length > 200 && !/\s{2,}/.test(s);
    if (base64Like) return 'data:image/png;base64,' + s;
    
    return null;
  };

  const imageSrc = getImageData(answer);
  const isError = question === 'error' || question.toLowerCase().includes('error');

  const downloadImage = () => {
    if (imageSrc) {
      const a = document.createElement('a');
      a.href = imageSrc;
      a.download = `visualization-${index}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={isError ? 'border-red-500/50 bg-red-900/10' : ''}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-lg font-medium leading-relaxed">
            {question}
          </CardTitle>
          <div className="flex space-x-2 shrink-0 ml-4">
            {imageSrc && (
              <>
                <button
                  onClick={downloadImage}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Copy answer"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 text-slate-300">
            {imageSrc ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50 p-2">
                <img 
                  src={imageSrc} 
                  alt="Visualization result" 
                  className="w-full h-auto max-h-[500px] object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setIsFullscreen(true)}
                />
              </div>
            ) : typeof answer === 'object' ? (
              <pre className="bg-slate-900/80 p-4 rounded-xl overflow-x-auto text-sm border border-slate-700/50">
                <code>{JSON.stringify(answer, null, 2)}</code>
              </pre>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {String(answer)}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreen && imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={imageSrc}
              alt="Fullscreen visualization"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Ensure X icon is imported
import { X } from 'lucide-react';
