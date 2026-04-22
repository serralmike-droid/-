import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Clock, BookOpen, Quote, Info } from "lucide-react";
import { cn, getLessonOfDay } from "../lib/utils";
import { LESSON_TITLES_CN } from "../data/lessons_titles";
import { ai, MODELS } from "../lib/gemini";
import ReactMarkdown from "react-markdown";

export function DailyLesson() {
  const lessonNumber = getLessonOfDay(new Date());
  const [title, setTitle] = useState(LESSON_TITLES_CN[lessonNumber] || "正在聆听圣灵的教导...");
  
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    async function fetchLessonData() {
      setLoading(true);
      try {
        let currentTitle = LESSON_TITLES_CN[lessonNumber];
        
        if (!currentTitle) {
          const titleResponse = await ai.models.generateContent({
            model: MODELS.DEFAULT,
            contents: `请告诉我《奇迹课程》学员练习手册第 ${lessonNumber} 课的官方中文标题。只返回标题文本。`,
          });
          currentTitle = titleResponse.text?.trim() || "我们一起学习。";
          setTitle(currentTitle);
        }

        const response = await ai.models.generateContent({
          model: MODELS.DEFAULT,
          contents: `请针对《奇迹课程》学员练习手册第 ${lessonNumber} 课：“${currentTitle}”，提供一个简短、优美且深刻的今日冥想提示。字数在150字以内。`,
          config: {
            systemInstruction: "你是一个充满智慧和慈悲的《奇迹课程》导师。你对课程的每一个教导都有极深的领悟。你的语言应该是诗意的、平和的，能够直接触及灵魂。",
          }
        });
        setInsight(response.text || "愿平安与你同在。");
      } catch (e) {
        setInsight("今天，让我们在静默中体验上主的平安。");
      } finally {
        setLoading(false);
      }
    }
    fetchLessonData();
  }, [lessonNumber]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 rounded-full bg-miracle-gold/20 text-miracle-gold text-[10px] font-mono tracking-widest uppercase"
        >
          Lesson {lessonNumber}
        </motion.div>
        <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-2xl mx-auto px-4 italic">
          「{title}」
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insight Card */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-2 text-miracle-gold/80 mb-4">
            <Quote className="w-5 h-5" />
            <h3 className="font-serif italic text-lg">圣灵的叮咛</h3>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-5/6"></div>
                <div className="h-4 bg-white/5 rounded w-4/6"></div>
              </div>
            ) : (
              <div className="markdown-body space-y-4">
                <ReactMarkdown>{insight || ""}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Practice/Timer Card */}
        <div className="glass-card p-6 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-2 text-miracle-blue/80 self-start">
            <Clock className="w-5 h-5" />
            <h3 className="font-serif italic text-lg">练习时间</h3>
          </div>

          <div className="text-6xl font-light font-mono text-white tracking-widest">
            {formatTime(timer)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button
              onClick={() => { setTimer(0); setIsActive(false); }}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-gray-400"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <p className="text-[10px] text-gray-500 text-center max-w-[200px]">
            课程建议：在一天中分多次进行短时间的练习。
          </p>
        </div>
      </div>

      {/* Reminder Card */}
      <div className="glass-card p-4 flex items-start gap-4 bg-miracle-gold/5 border-miracle-gold/20">
        <Info className="w-5 h-5 text-miracle-gold shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <span className="text-miracle-gold font-medium">切记：</span>
          这一练习并不需要很长时间，也不必刻意追求某种特殊的感觉。只需在心中复诵今日的观念，并观察它如何改变你眼前的世界。
        </div>
      </div>
    </div>
  );
}
