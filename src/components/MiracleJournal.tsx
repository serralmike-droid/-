import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Calendar, Bird } from "lucide-react";
import { Miracle } from "../types";
import { cn } from "../lib/utils";

export function MiracleJournal() {
  const [miracles, setMiracles] = useState<Miracle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("miracle-journal");
    if (saved) {
      setMiracles(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("miracle-journal", JSON.stringify(miracles));
  }, [miracles]);

  function addMiracle() {
    if (!newContent.trim()) return;
    const miracle: Miracle = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      content: newContent,
      tags: []
    };
    setMiracles([miracle, ...miracles]);
    setNewContent("");
    setIsAdding(false);
  }

  function deleteMiracle(id: string) {
    setMiracles(miracles.filter(m => m.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-serif italic text-2xl text-miracle-blue">奇迹日志</h2>
          <p className="text-xs text-gray-500 mt-1">记录感知的转变，见证心中的平安。</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-full bg-miracle-blue/20 text-miracle-blue hover:bg-miracle-blue/30 transition-colors"
        >
          <Plus className={cn("w-6 h-6 transition-transform", isAdding && "rotate-45")} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-4">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="这一刻，我感受到了什么样的转变？"
                className="w-full h-32 bg-transparent border-none text-gray-200 placeholder:text-gray-600 focus:ring-0 text-sm resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={addMiracle}
                  className="px-4 py-2 bg-miracle-blue/80 text-white rounded-xl text-sm font-medium hover:bg-miracle-blue transition-colors"
                >
                  见证奇迹
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {miracles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Bird className="w-16 h-16 mb-4" />
            <p className="font-serif italic">尚无奇迹记载</p>
          </div>
        ) : (
          miracles.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 group relative"
            >
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
                <Calendar className="w-3 h-3" />
                {new Date(m.timestamp).toLocaleDateString('zh-CN')}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{m.content}</p>
              
              <button
                onClick={() => deleteMiracle(m.id)}
                className="absolute top-4 right-4 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
