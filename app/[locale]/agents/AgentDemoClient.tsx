"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Mail,
  Bot,
  FileText,
  Search,
  PenLine,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  MessageSquare,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

// Types
interface Email {
  id: number;
  subject: string;
  fromName: string;
  company: string;
  receivedAt: string;
  status: "pending" | "processing" | "done";
}

interface KnowledgeDoc {
  id: string;
  title: string;
  icon: string;
  active: boolean;
  relevance?: number;
}

interface Draft {
  emailId: number;
  subject: string;
  content: string;
  isTyping: boolean;
}

interface AgentState {
  status: "idle" | "reading" | "analyzing" | "searching" | "writing";
  message: string;
  currentEmailId: number | null;
  intent?: string;
  priority?: string;
  sentiment?: string;
}

export default function AgentDemoClient() {
  const [demoState, setDemoState] = useState<"landing" | "running" | "complete">("landing");
  const [sessionId] = useState(() => `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes
  const [emails, setEmails] = useState<Email[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [agent, setAgent] = useState<AgentState>({
    status: "idle",
    message: "Wacht op emails...",
    currentEmailId: null,
  });
  const [stats, setStats] = useState({ processed: 0, avgTime: 0 });
  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<number>(0);

  // Timer countdown
  useEffect(() => {
    if (demoState !== "running") return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setDemoState("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [demoState]);

  // Start the demo
  const startDemo = useCallback(() => {
    setDemoState("running");
    startTimeRef.current = Date.now();

    const eventSource = new EventSource(`/api/v1/agent/demo/stream?sessionId=${sessionId}`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("init", (e) => {
      const data = JSON.parse(e.data);
      setEmails(data.emails.map((email: any) => ({ ...email, status: "pending" })));
      setKnowledgeDocs(data.knowledgeBase.map((doc: any) => ({ ...doc, active: false })));
    });

    eventSource.addEventListener("email_arrive", (e) => {
      const { emailId } = JSON.parse(e.data);
      setEmails(prev => prev.map(email =>
        email.id === emailId ? { ...email, status: "processing" } : email
      ));
    });

    eventSource.addEventListener("agent_status", (e) => {
      const data = JSON.parse(e.data);
      setAgent(prev => ({
        ...prev,
        status: data.status,
        message: data.message,
        currentEmailId: data.emailId,
      }));
    });

    eventSource.addEventListener("agent_analysis", (e) => {
      const data = JSON.parse(e.data);
      setAgent(prev => ({
        ...prev,
        intent: data.intent,
        priority: data.priority,
        sentiment: data.sentiment,
      }));
    });

    eventSource.addEventListener("knowledge_hit", (e) => {
      const data = JSON.parse(e.data);
      setKnowledgeDocs(prev => prev.map(doc =>
        doc.id === data.documentId
          ? { ...doc, active: true, relevance: data.relevance }
          : doc
      ));
      // Reset after a moment
      setTimeout(() => {
        setKnowledgeDocs(prev => prev.map(doc =>
          doc.id === data.documentId ? { ...doc, active: false } : doc
        ));
      }, 2000);
    });

    eventSource.addEventListener("draft_start", (e) => {
      const data = JSON.parse(e.data);
      setDrafts(prev => [...prev, {
        emailId: data.emailId,
        subject: data.subject,
        content: "",
        isTyping: true,
      }]);
    });

    eventSource.addEventListener("draft_chunk", (e) => {
      const data = JSON.parse(e.data);
      setDrafts(prev => prev.map(draft =>
        draft.emailId === data.emailId
          ? { ...draft, content: draft.content + data.chunk }
          : draft
      ));
    });

    eventSource.addEventListener("draft_complete", (e) => {
      const data = JSON.parse(e.data);
      setDrafts(prev => prev.map(draft =>
        draft.emailId === data.emailId
          ? { ...draft, content: data.fullDraft, isTyping: false }
          : draft
      ));
      setEmails(prev => prev.map(email =>
        email.id === data.emailId ? { ...email, status: "done" } : email
      ));
      setStats(prev => ({
        processed: prev.processed + 1,
        avgTime: Math.round((Date.now() - startTimeRef.current) / (prev.processed + 1) / 1000),
      }));
      setAgent({ status: "idle", message: "Volgende email...", currentEmailId: null });
    });

    eventSource.addEventListener("demo_complete", () => {
      setDemoState("complete");
      eventSource.close();
    });

    eventSource.addEventListener("error", () => {
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  // Reset demo
  const resetDemo = () => {
    eventSourceRef.current?.close();
    setDemoState("landing");
    setTimeRemaining(5 * 60);
    setEmails([]);
    setKnowledgeDocs([]);
    setDrafts([]);
    setAgent({ status: "idle", message: "Wacht op emails...", currentEmailId: null });
    setStats({ processed: 0, avgTime: 0 });
  };

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Landing page
  if (demoState === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#3066be] text-white mb-6"
            >
              <Bot className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Agent Demo
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Bekijk hoe een AI-agent een inbox verwerkt.
            </p>
            <p className="text-gray-500">
              Volledig autonoom. Zonder jouw input. Real-time AI.
            </p>
          </div>

          {/* Visual flow */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Inbox</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-300" />
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
                  <Bot className="w-7 h-7 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Agent</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-300" />
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-2">
                  <FileText className="w-7 h-7 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Concepten</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              5 emails • ~4 minuten • Echte AI-gegenereerde antwoorden
            </p>
          </div>

          <button
            onClick={startDemo}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#3066be] text-white rounded-xl font-semibold text-lg hover:bg-[#254d94] transition-colors shadow-lg shadow-blue-200"
          >
            <Play className="w-6 h-6" />
            Start Demo
          </button>

          <p className="mt-6 text-sm text-gray-400">
            Gratis • Geen account nodig • Bekijk het gewoon
          </p>
        </motion.div>
      </div>
    );
  }

  // Complete screen
  if (demoState === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demo voltooid!
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900">{stats.processed}</div>
                <div className="text-sm text-gray-500">Emails verwerkt</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900">{stats.avgTime}s</div>
                <div className="text-sm text-gray-500">Gem. per email</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">Escalaties</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Wat als dit jouw inbox was?
              </h3>
              <p className="text-gray-600 mb-4">
                Een medewerker doet hier 30+ minuten over.
                <br />
                Deze agent doet het in onder de 4 minuten.
                <br />
                <strong>Elke dag. 24/7. Zonder fouten.</strong>
              </p>
              <p className="text-sm text-gray-500">
                Wij bouwen dit op maat voor jouw bedrijf, met jouw kennisbank, in jouw tone-of-voice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3066be] text-white rounded-xl font-semibold hover:bg-[#254d94] transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Plan een gesprek
              </Link>
              <button
                onClick={resetDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Demo opnieuw bekijken
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Running demo
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3066be] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">AIFAIS Inbox Agent</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Actief
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {stats.processed}/{emails.length} verwerkt
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Inbox Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Inbox</span>
              <span className="ml-auto text-sm text-gray-500">{emails.length} emails</span>
            </div>
            <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {emails.map((email) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border transition-all ${
                      email.status === "processing"
                        ? "border-blue-300 bg-blue-50"
                        : email.status === "done"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        email.status === "done" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {email.status === "done" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : email.status === "processing" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          email.fromName[0]
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {email.fromName}
                          </span>
                          <span className="text-xs text-gray-400">{email.receivedAt}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{email.subject}</p>
                        <p className="text-xs text-gray-400">{email.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Agent Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Agent</span>
            </div>
            <div className="p-4">
              {/* Agent Status */}
              <div className="mb-6">
                <motion.div
                  animate={{
                    scale: agent.status !== "idle" ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`p-4 rounded-xl ${
                    agent.status === "idle" ? "bg-gray-50" :
                    agent.status === "reading" ? "bg-blue-50" :
                    agent.status === "analyzing" ? "bg-yellow-50" :
                    agent.status === "searching" ? "bg-purple-50" :
                    "bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {agent.status === "idle" && <Clock className="w-5 h-5 text-gray-400" />}
                    {agent.status === "reading" && <Mail className="w-5 h-5 text-blue-600" />}
                    {agent.status === "analyzing" && <Search className="w-5 h-5 text-yellow-600" />}
                    {agent.status === "searching" && <Database className="w-5 h-5 text-purple-600" />}
                    {agent.status === "writing" && <PenLine className="w-5 h-5 text-green-600" />}
                    <span className="font-medium text-gray-900">{agent.message}</span>
                  </div>

                  {/* Progress indicator */}
                  {agent.status !== "idle" && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          agent.status === "writing" ? "bg-green-500" : "bg-blue-500"
                        }`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: agent.status === "writing" ? 8 : 2,
                          ease: "linear"
                        }}
                        key={`${agent.currentEmailId}-${agent.status}`}
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Analysis results */}
              {agent.intent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 mb-6"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Intent:</span>
                    <span className="font-medium text-gray-900">{agent.intent}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prioriteit:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      agent.priority === "hoog" ? "bg-red-100 text-red-700" :
                      agent.priority === "normaal" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {agent.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sentiment:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      agent.sentiment === "positief" ? "bg-green-100 text-green-700" :
                      agent.sentiment === "negatief" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {agent.sentiment}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Knowledge Base */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Kennisbank</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {knowledgeDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      animate={{
                        scale: doc.active ? 1.05 : 1,
                        borderColor: doc.active ? "#3066be" : "#e5e7eb",
                      }}
                      className={`p-2 rounded-lg border text-center transition-colors ${
                        doc.active ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{doc.icon}</span>
                      <p className="text-xs text-gray-600 truncate">{doc.title}</p>
                      {doc.active && doc.relevance && (
                        <p className="text-xs text-blue-600 font-medium">{doc.relevance}%</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Drafts Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Concepten</span>
              <span className="ml-auto text-sm text-gray-500">{drafts.length} klaar</span>
            </div>
            <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {drafts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Concepten verschijnen hier</p>
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <motion.div
                      key={draft.emailId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-xl border border-gray-100 bg-white"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {draft.isTyping ? (
                          <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {draft.subject}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4 font-mono bg-gray-50 p-2 rounded-lg">
                        {draft.content}
                        {draft.isTyping && (
                          <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse ml-0.5" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">{stats.processed} emails verwerkt</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Gem. {stats.avgTime || "—"}s per email</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">0 escalaties</span>
              </div>
            </div>
            <button
              onClick={resetDemo}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Stop demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
