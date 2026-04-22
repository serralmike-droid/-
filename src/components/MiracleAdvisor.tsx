import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, User, Loader2 } from "lucide-react";
import { ai, MODELS } from "../lib/gemini";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
}

export function MiracleAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "你好，平安。我是你的奇迹顾问。今天有什么关于《奇迹课程》的问题，或者生活中的挑战想要一起看破的吗？" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: MODELS.DEFAULT,
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "你是一个《奇迹课程》(A Course in Miracles) 的资深导师和灵性顾问。你的语气柔和、平安、坚定且具有穿透力。你的目标是帮助用户从“小我”的反常思维中解脱出来，回归“圣灵”的真知。无论用户提出什么问题，你最终都要引导他们看到“宽恕”的深意，并意识到除了上主的平安外，没有任何东西是真实存在的。使用非二元的视角，强调真假之辨。尽量使用中文回复。",
        }
      });

      const reply = response.text || "我正处于静默中，请稍后再试。";
      setMessages(prev => [...prev, { role: "model", text: reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "我暂时无法连接到更深层的洞见，请深呼吸，稍后再试。" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
        <Sparkles className="w-5 h-5 text-miracle-gold" />
        <h2 className="font-serif italic text-lg text-miracle-gold">奇迹顾问</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === "model" ? "bg-miracle-gold/20" : "bg-white/10"
            )}>
              {m.role === "model" ? <Sparkles className="w-4 h-4 text-miracle-gold" /> : <User className="w-4 h-4 text-gray-400" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              m.role === "model" ? "bg-white/5 text-gray-200" : "bg-miracle-gold/20 text-miracle-gold"
            )}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-xs text-gray-500 italic">
            <Loader2 className="w-3 h-3 animate-spin" />
            顾问正在冥想中...
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="问问圣灵..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-miracle-gold/50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2 rounded-xl bg-miracle-gold/80 text-white disabled:opacity-50 hover:bg-miracle-gold transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
