import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Edit3, MessageCircle, Sun, Info } from "lucide-react";
import { AtmosphericBackground } from "./components/AtmosphericBackground";
import { DailyLesson } from "./components/DailyLesson";
import { MiracleJournal } from "./components/MiracleJournal";
import { MiracleAdvisor } from "./components/MiracleAdvisor";
import { cn } from "./lib/utils";

type Tab = "lesson" | "journal" | "advisor";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("lesson");

  const tabs = [
    { id: "lesson", label: "今日练习", icon: Book },
    { id: "journal", label: "奇迹日志", icon: Edit3 },
    { id: "advisor", label: "奇迹顾问", icon: MessageCircle },
  ] as const;

  return (
    <div className="relative min-h-screen text-gray-100 flex flex-col font-sans">
      <AtmosphericBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-miracle-gold flex items-center justify-center shadow-lg shadow-miracle-gold/20">
              <Sun className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="font-serif italic text-xl tracking-tight">奇迹之路</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1 font-mono">Miracle Path</p>
            </div>
          </div>

          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2",
                  activeTab === tab.id ? "text-miracle-gold" : "text-gray-400 hover:text-gray-200"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-miracle-gold/10 rounded-full -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === "lesson" && <DailyLesson />}
            {activeTab === "journal" && <MiracleJournal />}
            {activeTab === "advisor" && <MiracleAdvisor />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center opacity-30">
        <div className="flex items-center justify-center gap-2 text-xs">
          <Info className="w-3 h-3" />
          <span>除此以外，并无其他目的。</span>
        </div>
      </footer>
    </div>
  );
}

