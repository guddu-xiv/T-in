import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Search,
  CheckCircle,
  AlertCircle,
  Hash,
  HelpCircle,
  Eye,
  Check,
  ArrowUpDown,
  Tag,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  LayoutList,
  SlidersHorizontal,
  X,
  FileQuestion,
  Lightbulb,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Layers,
  RefreshCw,
  Clipboard,
  ClipboardCheck,
  Edit3,
  Grid,
  FileText
} from "lucide-react";
import { ParsedQuestion } from "../types";
import { FormattedText } from "./FormattedText";
import { extractOptionAnalysesFromText } from "../utils/parser";

interface TestQuestionCardEditorProps {
  questions: ParsedQuestion[];
  onChange: (updated: ParsedQuestion[]) => void;
  lang?: string;
  readOnly?: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const TestQuestionCardEditor: React.FC<TestQuestionCardEditorProps> = ({
  questions,
  onChange,
  lang = "en",
  readOnly = false
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<"all" | "warnings" | "has_oa" | "missing_oa">("all");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [findReplaceMsg, setFindReplaceMsg] = useState<string>("");

  // Option Analysis (OA) Manager Modal & Actions
  const [showOaManager, setShowOaManager] = useState<boolean>(false);
  const [oaActionToast, setOaActionToast] = useState<string>("");
  const [oaTab, setOaTab] = useState<"bulk" | "modify" | "delete" | "merge">("bulk");
  const [oaFindText, setOaFindText] = useState<string>("");
  const [oaReplaceText, setOaReplaceText] = useState<string>("");
  const [oaTargetOption, setOaTargetOption] = useState<"all" | number>("all");
  const [oaPrefixText, setOaPrefixText] = useState<string>("");
  const [copiedOa, setCopiedOa] = useState<string[] | null>(null);

  // Mobile & Tablet Question Picker Drawer / Sheet
  const [showQuestionPickerSheet, setShowQuestionPickerSheet] = useState<boolean>(false);

  // Layout mode: "focus" (1-by-1 mobile card app) vs "list" (all cards feed)
  // Auto-detect mobile screen initially
  const [layoutMode, setLayoutMode] = useState<"focus" | "list">(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return "focus";
    }
    return "list";
  });

  // Expandable sections in Focus Mode
  const [expandOptionAnalysis, setExpandOptionAnalysis] = useState<boolean>(true);
  const [expandExplanation, setExpandExplanation] = useState<boolean>(true);
  const [expandMeta, setExpandMeta] = useState<boolean>(false);

  // Per-option inline OA expansion in Focus Mode: { [optIdx]: boolean }
  const [expandedOptionOa, setExpandedOptionOa] = useState<Record<number, boolean>>({});

  // Horizontal scroll container ref for questions carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  // Validation warnings detection
  const questionWarnings = useMemo(() => {
    const map: Record<number, string[]> = {};
    questions.forEach((q, idx) => {
      const warns: string[] = [];
      if (!q.q || !q.q.trim()) {
        warns.push("Question stem text is empty");
      }
      if (!q.o || q.o.length < 2) {
        warns.push("Needs at least 2 answer options");
      } else {
        const hasEmptyOpt = q.o.some(opt => !opt || !opt.trim());
        if (hasEmptyOpt) warns.push("Contains empty option text");
      }
      if (!q.c || q.c < 1 || q.c > (q.o?.length || 0)) {
        warns.push("No valid correct answer selected");
      }
      if (warns.length > 0) {
        map[idx] = warns;
      }
    });
    return map;
  }, [questions]);

  // Overall Option Analysis Statistics
  const oaStats = useMemo(() => {
    let withOa = 0;
    questions.forEach(q => {
      if (q.oa && q.oa.some(a => a && a.trim().length > 0)) {
        withOa++;
      }
    });
    return {
      withOa,
      withoutOa: questions.length - withOa,
      total: questions.length
    };
  }, [questions]);

  // Filtered indices based on search query, warnings, and OA status
  const filteredIndices = useMemo(() => {
    const qLower = searchQuery.toLowerCase().trim();
    const indices: number[] = [];

    questions.forEach((q, idx) => {
      if (filterMode === "warnings" && !questionWarnings[idx]) {
        return;
      }
      const hasAnyOa = Boolean(q.oa && q.oa.some(a => a && a.trim().length > 0));
      if (filterMode === "has_oa" && !hasAnyOa) {
        return;
      }
      if (filterMode === "missing_oa" && hasAnyOa) {
        return;
      }

      if (!qLower) {
        indices.push(idx);
        return;
      }

      const matchQ = (q.q || "").toLowerCase().includes(qLower);
      const matchOpt = (q.o || []).some(opt => (opt || "").toLowerCase().includes(qLower));
      const matchSol = (q.s || "").toLowerCase().includes(qLower);
      const matchSource = (q.source || "").toLowerCase().includes(qLower);
      const matchOa = (q.oa || []).some(a => (a || "").toLowerCase().includes(qLower));
      const matchIdx = (idx + 1).toString() === qLower;

      if (matchQ || matchOpt || matchSol || matchSource || matchOa || matchIdx) {
        indices.push(idx);
      }
    });

    return indices;
  }, [questions, searchQuery, filterMode, questionWarnings]);

  // Ensure activeQuestionIdx is in bounds
  useEffect(() => {
    if (activeQuestionIdx >= questions.length && questions.length > 0) {
      setActiveQuestionIdx(questions.length - 1);
    }
  }, [questions.length, activeQuestionIdx]);

  // Center active pill in horizontal carousel
  useEffect(() => {
    if (carouselRef.current) {
      const activeEl = carouselRef.current.querySelector(`[data-idx="${activeQuestionIdx}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeQuestionIdx]);

  // Update a single question
  const updateQuestion = (index: number, partial: Partial<ParsedQuestion>) => {
    if (readOnly) return;
    const next = [...questions];
    next[index] = { ...next[index], ...partial };
    onChange(next);
  };

  // Update a specific option text
  const updateOptionText = (qIdx: number, optIdx: number, text: string) => {
    if (readOnly) return;
    const next = [...questions];
    const currentOpts = [...(next[qIdx].o || [])];
    currentOpts[optIdx] = text;
    next[qIdx] = { ...next[qIdx], o: currentOpts };
    onChange(next);
  };

  // Update or modify analysis for a single option
  const updateOptionAnalysis = (qIdx: number, optIdx: number, text: string) => {
    if (readOnly) return;
    const next = [...questions];
    const targetQ = next[qIdx];
    const optCount = targetQ.o?.length || 4;
    const currentOa = targetQ.oa ? [...targetQ.oa] : new Array(optCount).fill("");
    while (currentOa.length < optCount) {
      currentOa.push("");
    }
    currentOa[optIdx] = text;

    const hasAny = currentOa.some(a => a && a.trim().length > 0);
    next[qIdx] = {
      ...targetQ,
      oa: hasAny ? currentOa : undefined
    };
    onChange(next);
  };

  // Delete analysis for a single option
  const deleteOptionAnalysis = (qIdx: number, optIdx: number) => {
    updateOptionAnalysis(qIdx, optIdx, "");
  };

  // Clear all option analyses for question qIdx
  const clearQuestionOptionAnalysis = (qIdx: number) => {
    if (readOnly) return;
    const next = [...questions];
    next[qIdx] = { ...next[qIdx], oa: undefined };
    onChange(next);
    setOaActionToast(`Cleared Option Analysis for Question #${qIdx + 1}!`);
    setTimeout(() => setOaActionToast(""), 3000);
  };

  // Copy OA from question qIdx
  const copyQuestionOa = (qIdx: number) => {
    const target = questions[qIdx];
    if (target && target.oa && target.oa.some(a => a && a.trim())) {
      setCopiedOa([...target.oa]);
      setOaActionToast(`Copied Option Analysis from Q#${qIdx + 1}!`);
    } else {
      setOaActionToast("No Option Analysis on this question to copy.");
    }
    setTimeout(() => setOaActionToast(""), 3000);
  };

  // Paste copied OA to question qIdx
  const pasteQuestionOa = (qIdx: number) => {
    if (readOnly || !copiedOa) return;
    updateQuestion(qIdx, { oa: [...copiedOa] });
    setOaActionToast(`Pasted Option Analysis to Q#${qIdx + 1}!`);
    setTimeout(() => setOaActionToast(""), 3000);
  };

  // Merge this question's OA into its explanation
  const mergeQuestionOaToExplanation = (qIdx: number, clearOa: boolean = false) => {
    if (readOnly) return;
    const target = questions[qIdx];
    if (!target || !target.oa || !target.oa.some(a => a && a.trim())) {
      setOaActionToast("No Option Analysis to merge.");
      setTimeout(() => setOaActionToast(""), 3000);
      return;
    }
    const oaLines: string[] = ["\nOption Analysis:"];
    target.oa.forEach((analysis, i) => {
      if (analysis && analysis.trim()) {
        const letter = OPTION_LETTERS[i] || String.fromCharCode(65 + i);
        oaLines.push(`(${letter}) ${analysis.trim()}`);
      }
    });
    const appendStr = oaLines.join("\n");
    const currentExp = (target.s || "").trim();
    const newExp = currentExp ? `${currentExp}\n${appendStr}` : appendStr.trim();
    updateQuestion(qIdx, {
      s: newExp,
      oa: clearOa ? undefined : target.oa
    });
    setOaActionToast(clearOa ? `Merged & moved OA into Explanation for Q#${qIdx + 1}!` : `Copied OA into Explanation for Q#${qIdx + 1}!`);
    setTimeout(() => setOaActionToast(""), 3000);
  };

  // Auto-extract option analysis from explanation for a single question
  const autoExtractQuestionOa = (qIdx: number) => {
    if (readOnly) return;
    const targetQ = questions[qIdx];
    if (!targetQ || !targetQ.s) {
      setOaActionToast("Explanation is empty for this question.");
      setTimeout(() => setOaActionToast(""), 3000);
      return;
    }
    const optCount = targetQ.o?.length || 4;
    const res = extractOptionAnalysesFromText(targetQ.s, optCount);
    if (res.hasExtracted && res.extractedOa) {
      const next = [...questions];
      next[qIdx] = {
        ...targetQ,
        oa: res.extractedOa,
        s: res.remainingExplanation !== undefined ? res.remainingExplanation : targetQ.s
      };
      onChange(next);
      setOaActionToast(`Extracted Option Analysis for Question #${qIdx + 1}!`);
      setTimeout(() => setOaActionToast(""), 3500);
    } else {
      setOaActionToast(`No (A)... (B)... option breakdown found in Q#${qIdx + 1} explanation.`);
      setTimeout(() => setOaActionToast(""), 3500);
    }
  };

  // Generate starter blank templates for a single question
  const applyQuestionOaTemplate = (qIdx: number) => {
    if (readOnly) return;
    const targetQ = questions[qIdx];
    if (!targetQ) return;
    const optCount = targetQ.o?.length || 4;
    const nextOa: string[] = [];
    for (let i = 0; i < optCount; i++) {
      const letter = OPTION_LETTERS[i] || String.fromCharCode(65 + i);
      const isCorrect = targetQ.c === i + 1;
      nextOa.push(isCorrect ? `Option (${letter}) is correct because ` : `Option (${letter}) is incorrect because `);
    }
    updateQuestion(qIdx, { oa: nextOa });
    setOaActionToast(`Starter templates applied to Q#${qIdx + 1}!`);
    setTimeout(() => setOaActionToast(""), 3000);
  };

  // BULK: Delete all option analyses across all questions
  const handleBulkDeleteAllOa = () => {
    if (readOnly) return;
    if (!confirm(`Are you sure you want to delete Option Analysis from all ${questions.length} questions in this test?`)) {
      return;
    }
    const next = questions.map(q => ({
      ...q,
      oa: undefined
    }));
    onChange(next);
    setShowOaManager(false);
    setOaActionToast(`Cleared Option Analysis from all ${questions.length} questions.`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Auto-extract OA from explanations across all questions where OA is missing
  const handleBulkExtractOa = () => {
    if (readOnly) return;
    let extractedCount = 0;
    const next = questions.map(q => {
      if (q.oa && q.oa.some(a => a && a.trim().length > 0)) {
        return q;
      }
      if (!q.s || !q.s.trim()) return q;
      const res = extractOptionAnalysesFromText(q.s, q.o?.length || 4);
      if (res.hasExtracted && res.extractedOa) {
        extractedCount++;
        return {
          ...q,
          oa: res.extractedOa,
          s: res.remainingExplanation !== undefined ? res.remainingExplanation : q.s
        };
      }
      return q;
    });

    if (extractedCount > 0) {
      onChange(next);
      setOaActionToast(`Extracted Option Analysis for ${extractedCount} questions!`);
    } else {
      setOaActionToast("No eligible questions with (A)... (B)... pattern found in explanation.");
    }
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Add blank OA slots to all questions
  const handleBulkGenerateBlankOa = () => {
    if (readOnly) return;
    let addedCount = 0;
    const next = questions.map(q => {
      const optCount = q.o?.length || 4;
      if (!q.oa || q.oa.length === 0) {
        addedCount++;
        const blankOa = new Array(optCount).fill("");
        return { ...q, oa: blankOa };
      }
      return q;
    });
    onChange(next);
    setOaActionToast(`Generated blank OA slots for ${addedCount} questions.`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Trim & remove empty OA entries
  const handleBulkCleanOa = () => {
    if (readOnly) return;
    let cleaned = 0;
    const next = questions.map(q => {
      if (!q.oa) return q;
      const trimmed = q.oa.map(a => (a || "").trim());
      const hasAny = trimmed.some(a => a.length > 0);
      if (!hasAny) {
        cleaned++;
        return { ...q, oa: undefined };
      }
      return { ...q, oa: trimmed };
    });
    onChange(next);
    setOaActionToast(`Cleaned Option Analysis slots (${cleaned} questions emptied).`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Apply starter templates to all questions missing OA
  const handleBulkApplyTemplates = (overwriteExisting: boolean = false) => {
    if (readOnly) return;
    let applied = 0;
    const next = questions.map((q) => {
      const optCount = q.o?.length || 4;
      const hasOa = q.oa && q.oa.some(a => a && a.trim().length > 0);
      if (hasOa && !overwriteExisting) return q;
      applied++;
      const nextOa: string[] = [];
      for (let i = 0; i < optCount; i++) {
        const letter = OPTION_LETTERS[i] || String.fromCharCode(65 + i);
        const isCorrect = q.c === i + 1;
        nextOa.push(isCorrect ? `Option (${letter}) is correct because ` : `Option (${letter}) is incorrect because `);
      }
      return { ...q, oa: nextOa };
    });
    onChange(next);
    setOaActionToast(`Applied starter OA templates to ${applied} questions!`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Delete OA for only incorrect options across all questions
  const handleBulkDeleteIncorrectOa = () => {
    if (readOnly) return;
    if (!confirm("Keep Option Analysis for the correct answer only, and delete analysis for all incorrect options?")) return;
    let modified = 0;
    const next = questions.map(q => {
      if (!q.oa || q.oa.length === 0) return q;
      const correctIdx = (q.c || 1) - 1;
      const nextOa = q.oa.map((a, i) => (i === correctIdx ? a : ""));
      const hasAny = nextOa.some(a => a && a.trim().length > 0);
      modified++;
      return { ...q, oa: hasAny ? nextOa : undefined };
    });
    onChange(next);
    setOaActionToast(`Deleted incorrect option analyses across ${modified} questions.`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Delete OA for a specific option letter (e.g. Option D)
  const handleBulkDeleteSpecificOptionOa = (optLetterIdx: number) => {
    if (readOnly) return;
    const letter = OPTION_LETTERS[optLetterIdx] || String.fromCharCode(65 + optLetterIdx);
    if (!confirm(`Delete Option Analysis for Option (${letter}) across all questions?`)) return;
    let modified = 0;
    const next = questions.map(q => {
      if (!q.oa || !q.oa[optLetterIdx]) return q;
      const nextOa = [...q.oa];
      nextOa[optLetterIdx] = "";
      const hasAny = nextOa.some(a => a && a.trim().length > 0);
      modified++;
      return { ...q, oa: hasAny ? nextOa : undefined };
    });
    onChange(next);
    setOaActionToast(`Deleted Option (${letter}) analysis from ${modified} question(s).`);
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Merge OA into Explanations across all questions
  const handleBulkMergeOaToExplanation = (clearOaAfterMerge: boolean) => {
    if (readOnly) return;
    let mergedCount = 0;
    const next = questions.map(q => {
      if (!q.oa || !q.oa.some(a => a && a.trim().length > 0)) return q;
      mergedCount++;
      const oaLines: string[] = ["\nOption Analysis:"];
      q.oa.forEach((analysis, i) => {
        if (analysis && analysis.trim()) {
          const letter = OPTION_LETTERS[i] || String.fromCharCode(65 + i);
          oaLines.push(`(${letter}) ${analysis.trim()}`);
        }
      });
      const appendStr = oaLines.join("\n");
      const currentExplanation = (q.s || "").trim();
      const newExplanation = currentExplanation ? `${currentExplanation}\n${appendStr}` : appendStr.trim();
      return {
        ...q,
        s: newExplanation,
        oa: clearOaAfterMerge ? undefined : q.oa
      };
    });

    if (mergedCount > 0) {
      onChange(next);
      setOaActionToast(`Merged Option Analysis into explanations for ${mergedCount} question(s)!`);
    } else {
      setOaActionToast("No questions had Option Analysis to merge.");
    }
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Find & Replace specifically inside Option Analysis
  const handleOaFindReplace = () => {
    if (readOnly || !oaFindText) return;
    let replacementCount = 0;
    let affectedQuestions = 0;
    const next = questions.map(q => {
      if (!q.oa || q.oa.length === 0) return q;
      let qModified = false;
      const nextOa = q.oa.map((analysis, optIdx) => {
        if (!analysis) return "";
        if (oaTargetOption !== "all" && optIdx !== oaTargetOption) return analysis;
        if (analysis.includes(oaFindText)) {
          qModified = true;
          const regex = new RegExp(oaFindText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
          const matches = analysis.match(regex);
          if (matches) replacementCount += matches.length;
          return analysis.replaceAll(oaFindText, oaReplaceText);
        }
        return analysis;
      });
      if (qModified) {
        affectedQuestions++;
        return { ...q, oa: nextOa };
      }
      return q;
    });

    if (replacementCount > 0) {
      onChange(next);
      setOaActionToast(`Replaced ${replacementCount} occurrence(s) across ${affectedQuestions} question(s) in Option Analysis!`);
    } else {
      setOaActionToast(`"${oaFindText}" was not found in Option Analysis text.`);
    }
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // BULK: Add Prefix / Standardize text to all existing Option Analyses
  const handleBulkPrefixOa = () => {
    if (readOnly || !oaPrefixText.trim()) return;
    let modified = 0;
    const next = questions.map(q => {
      if (!q.oa || q.oa.length === 0) return q;
      let qModified = false;
      const nextOa = q.oa.map((analysis, optIdx) => {
        if (!analysis || !analysis.trim()) return "";
        if (oaTargetOption !== "all" && optIdx !== oaTargetOption) return analysis;
        qModified = true;
        return `${oaPrefixText.trim()} ${analysis.trim()}`;
      });
      if (qModified) {
        modified++;
        return { ...q, oa: nextOa };
      }
      return q;
    });
    if (modified > 0) {
      onChange(next);
      setOaActionToast(`Added prefix to Option Analysis across ${modified} question(s)!`);
    } else {
      setOaActionToast("No eligible Option Analysis text found.");
    }
    setTimeout(() => setOaActionToast(""), 4000);
  };

  // Add an option to a question
  const addOption = (qIdx: number) => {
    if (readOnly) return;
    const next = [...questions];
    const currentOpts = [...(next[qIdx].o || [])];
    if (currentOpts.length >= 8) return;
    currentOpts.push("");

    let currentOa = next[qIdx].oa ? [...next[qIdx].oa!] : undefined;
    if (currentOa) {
      currentOa.push("");
    }

    next[qIdx] = { ...next[qIdx], o: currentOpts, oa: currentOa };
    onChange(next);
  };

  // Remove an option
  const removeOption = (qIdx: number, optIdx: number) => {
    if (readOnly) return;
    const next = [...questions];
    const currentOpts = [...(next[qIdx].o || [])];
    if (currentOpts.length <= 2) return;
    currentOpts.splice(optIdx, 1);

    let currentOa = next[qIdx].oa ? [...next[qIdx].oa!] : undefined;
    if (currentOa && currentOa.length > optIdx) {
      currentOa.splice(optIdx, 1);
    }

    let correct = next[qIdx].c;
    if (correct === optIdx + 1) {
      correct = 1;
    } else if (correct > optIdx + 1) {
      correct = correct - 1;
    }

    next[qIdx] = { ...next[qIdx], o: currentOpts, c: correct, oa: currentOa };
    onChange(next);
  };

  // Set correct answer
  const setCorrectOption = (qIdx: number, optOneIndexed: number) => {
    if (readOnly) return;
    updateQuestion(qIdx, { c: optOneIndexed });
  };

  // Add a brand new question
  const addNewQuestion = (insertAfterIdx?: number) => {
    if (readOnly) return;
    const newQ: ParsedQuestion = {
      q: "",
      o: ["", "", "", ""],
      c: 1,
      s: "",
      source: ""
    };
    const next = [...questions];
    const insertAt = insertAfterIdx !== undefined ? insertAfterIdx + 1 : next.length;
    next.splice(insertAt, 0, newQ);
    onChange(next);
    setActiveQuestionIdx(insertAt);
  };

  // Duplicate a question
  const duplicateQuestion = (idx: number) => {
    if (readOnly) return;
    const target = questions[idx];
    if (!target) return;
    const cloned: ParsedQuestion = {
      ...target,
      o: [...(target.o || [])],
      oa: target.oa ? [...target.oa] : undefined
    };
    const next = [...questions];
    next.splice(idx + 1, 0, cloned);
    onChange(next);
    setActiveQuestionIdx(idx + 1);
  };

  // Delete a question
  const deleteQuestion = (idx: number) => {
    if (readOnly) return;
    if (questions.length <= 1) {
      if (confirm("Reset this question to blank template?")) {
        onChange([{ q: "", o: ["", "", "", ""], c: 1, s: "" }]);
      }
      return;
    }
    const next = questions.filter((_, i) => i !== idx);
    onChange(next);
    if (activeQuestionIdx >= next.length) {
      setActiveQuestionIdx(Math.max(0, next.length - 1));
    }
  };

  // Move Question Up/Down
  const moveQuestion = (idx: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const next = [...questions];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next);
    setActiveQuestionIdx(targetIdx);
  };

  // Find & Replace across all questions
  const handleFindReplaceAll = () => {
    if (!findText) {
      setFindReplaceMsg("Please enter text to find.");
      return;
    }
    let count = 0;
    const next = questions.map(q => {
      let qStr = q.q || "";
      let sStr = q.s || "";
      let srcStr = q.source || "";
      let opts = [...(q.o || [])];

      if (qStr.includes(findText)) {
        const matches = (qStr.match(new RegExp(escapeRegex(findText), "g")) || []).length;
        count += matches;
        qStr = qStr.split(findText).join(replaceText);
      }
      if (sStr.includes(findText)) {
        const matches = (sStr.match(new RegExp(escapeRegex(findText), "g")) || []).length;
        count += matches;
        sStr = sStr.split(findText).join(replaceText);
      }
      if (srcStr.includes(findText)) {
        const matches = (srcStr.match(new RegExp(escapeRegex(findText), "g")) || []).length;
        count += matches;
        srcStr = srcStr.split(findText).join(replaceText);
      }
      opts = opts.map(opt => {
        if (opt.includes(findText)) {
          const matches = (opt.match(new RegExp(escapeRegex(findText), "g")) || []).length;
          count += matches;
          return opt.split(findText).join(replaceText);
        }
        return opt;
      });

      let oaList = q.oa ? [...q.oa] : undefined;
      if (oaList && oaList.length > 0) {
        oaList = oaList.map(a => {
          if (a && a.includes(findText)) {
            const matches = (a.match(new RegExp(escapeRegex(findText), "g")) || []).length;
            count += matches;
            return a.split(findText).join(replaceText);
          }
          return a;
        });
      }

      return {
        ...q,
        q: qStr,
        s: sStr,
        source: srcStr,
        o: opts,
        oa: oaList
      };
    });

    onChange(next);
    setFindReplaceMsg(`Replaced ${count} occurrence(s) across questions.`);
    setTimeout(() => setFindReplaceMsg(""), 4000);
  };

  const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const warningsCount = Object.keys(questionWarnings).length;
  const currentFocusQuestion = questions[activeQuestionIdx] || {
    q: "",
    o: ["", "", "", ""],
    c: 1
  };
  const currentFocusWarnings = questionWarnings[activeQuestionIdx] || [];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-gray-200 overflow-hidden">
      {/* Top Mobile-Ready Toolbar */}
      <div className="bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Left Stats & Filters */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-blue-800 shrink-0">
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            <span>{questions.length} Qs</span>
          </div>

          <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-[10px] sm:text-[11px] font-bold text-gray-700 uppercase tracking-wide shrink-0">
            {lang.toUpperCase()}
          </div>

          {/* Option Analysis (OA) Manager Trigger */}
          <button
            type="button"
            onClick={() => setShowOaManager(true)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
              filterMode === "has_oa" || filterMode === "missing_oa"
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : oaStats.withOa > 0
                ? "bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            title="Option Analysis (OA) Management & Bulk Actions"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>OA: {oaStats.withOa}/{oaStats.total}</span>
          </button>

          {/* Active Filter Clear Pill */}
          {filterMode !== "all" && (
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-white text-[10px] font-bold cursor-pointer"
              title="Clear filter"
            >
              <span>{filterMode === "warnings" ? "Issues" : filterMode === "has_oa" ? "With OA" : "Missing OA"}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {warningsCount > 0 && (
            <button
              onClick={() => setFilterMode(filterMode === "warnings" ? "all" : "warnings")}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
                filterMode === "warnings"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title="Filter questions with warnings"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{warningsCount} Issue{warningsCount !== 1 ? "s" : ""}</span>
            </button>
          )}
        </div>

        {/* Right Switchers: Focus vs List & Tools */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto flex-wrap">
          {/* Mode Switcher: Focus (App-like 1-by-1) vs List */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setLayoutMode("focus")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === "focus"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Mobile Single Question Focus Mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Focus (1-by-1)</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode("list")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === "list"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="All Questions List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>All List</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Q# or word..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none w-24 sm:w-36 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Find & Replace Trigger */}
          <button
            type="button"
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all cursor-pointer ${
              showFindReplace
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            title="Find & Replace text across all questions"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Replace</span>
          </button>

          {/* Formatted Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all cursor-pointer ${
              previewMode
                ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            title="Toggle preview of rendered text & math"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{previewMode ? "Edit" : "Preview"}</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={() => addNewQuestion()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Add Question"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Q</span>
            </button>
          )}
        </div>
      </div>

      {/* Find & Replace Bar (Collapsible) */}
      {showFindReplace && (
        <div className="bg-indigo-50/90 border-b border-indigo-100 px-3 py-2 flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-bold text-indigo-900 text-[11px]">Find:</span>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Search..."
              className="px-2 py-0.5 bg-white border border-indigo-200 rounded-lg text-xs outline-none w-28 sm:w-36 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-indigo-900 text-[11px]">Replace:</span>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="With..."
              className="px-2 py-0.5 bg-white border border-indigo-200 rounded-lg text-xs outline-none w-28 sm:w-36 focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleFindReplaceAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer shadow-xs"
          >
            Replace All
          </button>
          {findReplaceMsg && (
            <span className="text-[11px] font-semibold text-indigo-800 ml-1">
              {findReplaceMsg}
            </span>
          )}
        </div>
      )}

      {/* Option Analysis Action Notification Toast */}
      {oaActionToast && (
        <div className="bg-purple-700 text-white px-3.5 py-2 text-xs font-semibold flex items-center justify-between shadow-xs shrink-0 transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-200 shrink-0" />
            <span>{oaActionToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setOaActionToast("")}
            className="text-purple-200 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Option Analysis (OA) Manager Modal / Drawer */}
      {showOaManager && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-3.5 py-3 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-200 shrink-0" />
                <div>
                  <h3 className="font-black text-sm">Option Analysis (OA) Studio</h3>
                  <p className="text-[10px] sm:text-[11px] text-purple-200">
                    विकल्प विश्लेषण - Update, Modify, Delete & Bulk Tools
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOaManager(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Tab Navigation Ribbon */}
            <div className="bg-purple-50/70 border-b border-purple-100 p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setOaTab("bulk")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  oaTab === "bulk"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-800 hover:bg-purple-100"
                }`}
              >
                ⚡ Bulk Tools
              </button>
              <button
                type="button"
                onClick={() => setOaTab("modify")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  oaTab === "modify"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-800 hover:bg-purple-100"
                }`}
              >
                ✏️ Modify & Replace
              </button>
              <button
                type="button"
                onClick={() => setOaTab("delete")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  oaTab === "delete"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-800 hover:bg-rose-50"
                }`}
              >
                🗑️ Delete & Clear
              </button>
              <button
                type="button"
                onClick={() => setOaTab("merge")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  oaTab === "merge"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-indigo-800 hover:bg-indigo-50"
                }`}
              >
                🔄 Merge & Convert
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 sm:p-4 space-y-3.5 overflow-y-auto flex-1">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Qs</span>
                  <span className="text-base sm:text-lg font-black text-gray-900">{oaStats.total}</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-2 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">With OA</span>
                  <span className="text-base sm:text-lg font-black text-purple-900">{oaStats.withOa}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Missing OA</span>
                  <span className="text-base sm:text-lg font-black text-amber-900">{oaStats.withoutOa}</span>
                </div>
              </div>

              {/* View / Filter Shortcuts */}
              <div className="space-y-1">
                <span className="text-[11px] font-black text-gray-700 block">Filter Questions View:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setFilterMode("all"); setShowOaManager(false); }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      filterMode === "all" ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All ({oaStats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterMode("has_oa"); setShowOaManager(false); }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      filterMode === "has_oa" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Has OA ({oaStats.withOa})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterMode("missing_oa"); setShowOaManager(false); }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      filterMode === "missing_oa" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Missing ({oaStats.withoutOa})
                  </button>
                </div>
              </div>

              {/* TAB 1: BULK TOOLS */}
              {oaTab === "bulk" && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-black text-gray-800 block">Bulk Generation & Formatting:</span>

                  {/* Auto Extract from Explanations */}
                  <button
                    type="button"
                    onClick={handleBulkExtractOa}
                    disabled={readOnly}
                    className="w-full p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 flex items-start gap-2.5 transition-all text-left cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Auto-Extract OA from Explanations (Bulk)</span>
                      <span className="text-[11px] text-indigo-700 leading-tight block">
                        Detects (A)... (B)... (C)... inside existing explanations and splits them into dedicated option analyses.
                      </span>
                    </div>
                  </button>

                  {/* Apply Starter Templates to Missing */}
                  <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Plus className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-purple-950 block">Apply Starter Templates</span>
                        <span className="text-[11px] text-purple-700 leading-tight block">
                          Generates `Option (A) is correct/incorrect because...` starter prompts.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleBulkApplyTemplates(false)}
                        disabled={readOnly}
                        className="flex-1 py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Apply to Missing Only
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkApplyTemplates(true)}
                        disabled={readOnly}
                        className="py-1.5 px-2 bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Overwrite All
                      </button>
                    </div>
                  </div>

                  {/* Generate Blank Starter OA */}
                  <button
                    type="button"
                    onClick={handleBulkGenerateBlankOa}
                    disabled={readOnly}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 flex items-start gap-2.5 transition-all text-left cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Generate Blank OA Slots</span>
                      <span className="text-[11px] text-slate-600 leading-tight block">
                        Prepares empty input fields for all questions without OA.
                      </span>
                    </div>
                  </button>

                  {/* Clean Empty OA Slots */}
                  <button
                    type="button"
                    onClick={handleBulkCleanOa}
                    disabled={readOnly}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-start gap-2.5 transition-all text-left cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Clean Empty Option Analysis</span>
                      <span className="text-[11px] text-slate-600 leading-tight block">
                        Trims whitespace and cleans empty OA arrays from questions.
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* TAB 2: MODIFY & REPLACE */}
              {oaTab === "modify" && (
                <div className="space-y-3 pt-1">
                  {/* Find & Replace in OA */}
                  <div className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2.5">
                    <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Find & Replace in Option Analysis</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase block mb-0.5">Find Text</label>
                        <input
                          type="text"
                          value={oaFindText}
                          onChange={(e) => setOaFindText(e.target.value)}
                          placeholder="e.g. Option (A) is correct"
                          className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase block mb-0.5">Replace With</label>
                        <input
                          type="text"
                          value={oaReplaceText}
                          onChange={(e) => setOaReplaceText(e.target.value)}
                          placeholder="e.g. विकल्प (A) सही है क्योंकि"
                          className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-gray-600">Scope:</span>
                        <select
                          value={oaTargetOption}
                          onChange={(e) => setOaTargetOption(e.target.value === "all" ? "all" : Number(e.target.value))}
                          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 outline-none"
                        >
                          <option value="all">All Options (A, B, C, D)</option>
                          <option value={0}>Option (A) only</option>
                          <option value={1}>Option (B) only</option>
                          <option value={2}>Option (C) only</option>
                          <option value={3}>Option (D) only</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleOaFindReplace}
                        disabled={readOnly || !oaFindText}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Replace in OA
                      </button>
                    </div>
                  </div>

                  {/* Add Prefix to All OA */}
                  <div className="p-3 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
                    <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Add Prefix to Existing Option Analyses</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={oaPrefixText}
                        onChange={(e) => setOaPrefixText(e.target.value)}
                        placeholder="e.g. [विश्लेषण] or [Detailed Note]"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleBulkPrefixOa}
                        disabled={readOnly || !oaPrefixText.trim()}
                        className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        Add Prefix
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DELETE & CLEAR */}
              {oaTab === "delete" && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-black text-rose-950 block">Option Analysis Deletion Tools:</span>

                  {/* Delete All OA */}
                  <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50/70 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-rose-950 block">Delete ALL Option Analyses in Test</span>
                        <span className="text-[11px] text-rose-700 leading-tight block">
                          Completely wipes out option analysis arrays from all {questions.length} questions.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBulkDeleteAllOa}
                        disabled={readOnly}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ml-2"
                      >
                        Delete All OA
                      </button>
                    </div>
                  </div>

                  {/* Delete Incorrect Options OA */}
                  <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-950 block">Keep Correct Only (Delete Incorrect OA)</span>
                        <span className="text-[11px] text-amber-800 leading-tight block">
                          Retains the explanation for the correct answer and deletes all wrong option analyses.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBulkDeleteIncorrectOa}
                        disabled={readOnly}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ml-2"
                      >
                        Keep Correct Only
                      </button>
                    </div>
                  </div>

                  {/* Delete Specific Option Letter OA */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-gray-800 block">Delete Specific Option Analysis:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 1, 2, 3].map((optIdx) => {
                        const letter = OPTION_LETTERS[optIdx];
                        return (
                          <button
                            key={`del-opt-${letter}`}
                            type="button"
                            onClick={() => handleBulkDeleteSpecificOptionOa(optIdx)}
                            disabled={readOnly}
                            className="py-1.5 px-2 bg-white hover:bg-rose-50 hover:text-rose-700 border border-gray-200 hover:border-rose-300 rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3 text-rose-500" />
                            <span>({letter}) OA</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MERGE & CONVERT */}
              {oaTab === "merge" && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-black text-indigo-950 block">Merge OA with Explanations:</span>

                  {/* Merge OA to Explanations and Clear OA */}
                  <div className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-950 block">Merge OA into Explanation</span>
                    <span className="text-[11px] text-indigo-700 leading-tight block">
                      Appends all option analysis text directly into the main question explanation block with (A)... (B)... headers.
                    </span>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleBulkMergeOaToExplanation(false)}
                        disabled={readOnly}
                        className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Merge & Keep OA Slots
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkMergeOaToExplanation(true)}
                        disabled={readOnly}
                        className="flex-1 py-1.5 px-2.5 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Merge & Delete OA Slots
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowOaManager(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Close Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: MOBILE FOCUS VIEW (1-by-1 Touch Screen Experience) */}
      {/* ========================================================================= */}
      {layoutMode === "focus" && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-100/60">
          {/* Horizontal Question Jumper Carousel */}
          <div className="bg-white px-2 py-1.5 border-b border-gray-200 shrink-0">
            <div
              ref={carouselRef}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 overscroll-x-contain touch-pan-x"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {questions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIdx;
                const hasWarn = Boolean(questionWarnings[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    data-idx={idx}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40"
                        : hasWarn
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {hasWarn && !isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    )}
                  </button>
                );
              })}

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => addNewQuestion()}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 shrink-0 flex items-center gap-1 cursor-pointer transition-all"
                  title="Add Question at end"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Question Focus Header Bar */}
          <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
            {/* Prev / Next & Q Number */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))}
                disabled={activeQuestionIdx === 0}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Previous Question"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowQuestionPickerSheet(true)}
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all cursor-pointer"
                title="Open Question Grid Selector (Sheet)"
              >
                <Grid className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-gray-900">
                  Q{activeQuestionIdx + 1}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold">
                  /{questions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveQuestionIdx(Math.min(questions.length - 1, activeQuestionIdx + 1))}
                disabled={activeQuestionIdx >= questions.length - 1}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next Question"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Card Controls */}
            {!readOnly && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveQuestion(activeQuestionIdx, "up")}
                  disabled={activeQuestionIdx === 0}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-all cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => moveQuestion(activeQuestionIdx, "down")}
                  disabled={activeQuestionIdx === questions.length - 1}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-all cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => duplicateQuestion(activeQuestionIdx)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                  title="Duplicate Question"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteQuestion(activeQuestionIdx)}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Focus Question Scrollable Body */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y p-2.5 sm:p-4 space-y-3 touch-scroll-y"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            {/* Warning Message if any */}
            {currentFocusWarnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-xs text-amber-900 space-y-0.5 shadow-xs">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Needs Attention:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-800 pl-1">
                  {currentFocusWarnings.map((w, wIdx) => (
                    <li key={wIdx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Question Stem Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>Question Statement #{activeQuestionIdx + 1}</span>
                </label>
                <span className="text-[10px] text-gray-400 font-bold">
                  Tap to edit
                </span>
              </div>

              {previewMode ? (
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 min-h-[50px] leading-relaxed">
                  <FormattedText text={currentFocusQuestion.q || "(Empty question text)"} />
                </div>
              ) : (
                <textarea
                  value={currentFocusQuestion.q || ""}
                  onChange={(e) => updateQuestion(activeQuestionIdx, { q: e.target.value })}
                  disabled={readOnly}
                  rows={3}
                  placeholder="Type question stem here (Unicode, Hindi, Math, Symbols supported)..."
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all resize-y leading-relaxed"
                />
              )}
            </div>

            {/* Answer Options Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black uppercase text-gray-700 tracking-wider">
                    Answer Options
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Tap circle to set correct
                  </span>
                </div>

                {!readOnly && (currentFocusQuestion.o?.length || 0) < 8 && (
                  <button
                    type="button"
                    onClick={() => addOption(activeQuestionIdx)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(currentFocusQuestion.o || []).map((opt, optIdx) => {
                  const letter = OPTION_LETTERS[optIdx] || String.fromCharCode(65 + optIdx);
                  const isCorrect = currentFocusQuestion.c === optIdx + 1;
                  const hasOa = Boolean(currentFocusQuestion.oa?.[optIdx] && currentFocusQuestion.oa[optIdx].trim().length > 0);
                  const isOaExpanded = Boolean(expandedOptionOa[optIdx]);

                  return (
                    <div
                      key={`focus-opt-${activeQuestionIdx}-${optIdx}`}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isCorrect
                          ? "bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-400/40"
                          : "bg-slate-50/60 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Option Row */}
                      <div className="flex items-center gap-2 p-2 sm:p-2.5">
                        {/* Big Touch-Friendly Option Letter Button */}
                        <button
                          type="button"
                          onClick={() => setCorrectOption(activeQuestionIdx, optIdx + 1)}
                          disabled={readOnly}
                          title={`Mark (${letter}) as Correct Answer`}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                            isCorrect
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                          }`}
                        >
                          {isCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : letter}
                        </button>

                        {/* Option Input Field */}
                        {previewMode ? (
                          <div className="flex-1 text-xs font-semibold text-gray-800 py-1.5 px-2">
                            <FormattedText text={opt || `(Option ${letter} empty)`} />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={opt || ""}
                            onChange={(e) => updateOptionText(activeQuestionIdx, optIdx, e.target.value)}
                            disabled={readOnly}
                            placeholder={`Enter text for Option (${letter})...`}
                            className="flex-1 bg-transparent border-0 text-xs sm:text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 py-1"
                          />
                        )}

                        {/* Correct Answer Badge */}
                        {isCorrect && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0">
                            Answer
                          </span>
                        )}

                        {/* Quick Option Analysis Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedOptionOa(prev => ({ ...prev, [optIdx]: !prev[optIdx] }))}
                          title={hasOa ? `Option (${letter}) has analysis. Click to edit/delete.` : `Add Option Analysis for (${letter})`}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                            hasOa
                              ? "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200"
                              : "bg-white/80 text-gray-500 hover:text-purple-700 hover:bg-purple-50 border border-gray-200"
                          }`}
                        >
                          <BookOpen className="w-3 h-3 text-purple-600" />
                          <span className="hidden xs:inline">{hasOa ? "OA ✓" : "+ OA"}</span>
                        </button>

                        {/* Remove Option Button */}
                        {!readOnly && (currentFocusQuestion.o?.length || 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(activeQuestionIdx, optIdx)}
                            title="Remove option"
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Inline Option Analysis Accordion */}
                      {isOaExpanded && (
                        <div className="bg-purple-50/70 border-t border-purple-200/80 p-2.5 space-y-1.5 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center">
                                {letter}
                              </span>
                              <span className="text-[11px] font-bold text-purple-900">
                                Option ({letter}) Analysis:
                              </span>
                              <span className="text-[10px] text-purple-600 font-medium">
                                ({isCorrect ? "Why Correct" : "Why Incorrect"})
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {hasOa && !readOnly && (
                                <button
                                  type="button"
                                  onClick={() => deleteOptionAnalysis(activeQuestionIdx, optIdx)}
                                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
                                  title="Delete this analysis"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete OA</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setExpandedOptionOa(prev => ({ ...prev, [optIdx]: false }))}
                                className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {previewMode ? (
                            <div className="text-xs text-gray-900 bg-white p-2 rounded-lg border border-purple-100 min-h-[36px]">
                              <FormattedText text={currentFocusQuestion.oa?.[optIdx] || "(Empty analysis)"} />
                            </div>
                          ) : (
                            <textarea
                              rows={2}
                              value={currentFocusQuestion.oa?.[optIdx] || ""}
                              onChange={(e) => updateOptionAnalysis(activeQuestionIdx, optIdx, e.target.value)}
                              disabled={readOnly}
                              placeholder={`Explain why Option (${letter}) is ${isCorrect ? "correct" : "incorrect"}...`}
                              className="w-full bg-white border border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 rounded-lg p-2 text-xs font-medium text-gray-900 outline-none transition-all resize-y"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Option Analysis (विकल्प विश्लेषण) Studio Card */}
            <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-xs">
              <div className="w-full px-3.5 py-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between border-b border-purple-100">
                <button
                  type="button"
                  onClick={() => setExpandOptionAnalysis(!expandOptionAnalysis)}
                  className="flex items-center gap-2 text-left cursor-pointer flex-1"
                >
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-purple-950">
                    Option Analysis (OA) - विकल्प विश्लेषण
                  </span>
                  {currentFocusQuestion.oa && currentFocusQuestion.oa.some(a => a && a.trim().length > 0) ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                      {currentFocusQuestion.oa.filter(a => a && a.trim().length > 0).length}/{(currentFocusQuestion.o || []).length} Analyzed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-gray-600 text-[9px] font-bold">
                      None Set
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-purple-500 transition-transform duration-200 ml-auto mr-2 ${
                      expandOptionAnalysis ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {!readOnly && (
                  <div className="flex items-center gap-1 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => autoExtractQuestionOa(activeQuestionIdx)}
                      title="Auto-extract (A), (B)... breakdown from this question's explanation"
                      className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Extract</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyQuestionOaTemplate(activeQuestionIdx)}
                      title="Apply starter templates for all options"
                      className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-purple-600" />
                      <span className="hidden xs:inline">Template</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyQuestionOa(activeQuestionIdx)}
                      title="Copy this question's Option Analysis"
                      className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Clipboard className="w-3 h-3 text-purple-600" />
                      <span className="hidden xs:inline">Copy</span>
                    </button>

                    {copiedOa && (
                      <button
                        type="button"
                        onClick={() => pasteQuestionOa(activeQuestionIdx)}
                        title="Paste copied Option Analysis to this question"
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      >
                        <Clipboard className="w-3 h-3 text-white" />
                        <span>Paste</span>
                      </button>
                    )}

                    {currentFocusQuestion.oa && currentFocusQuestion.oa.some(a => a && a.trim().length > 0) && (
                      <>
                        <button
                          type="button"
                          onClick={() => mergeQuestionOaToExplanation(activeQuestionIdx, false)}
                          title="Merge Option Analysis into Explanation"
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span className="hidden sm:inline">Merge</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => clearQuestionOptionAnalysis(activeQuestionIdx)}
                          title="Delete all option analyses for this question"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Clear OA</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {expandOptionAnalysis && (
                <div className="p-3 space-y-2.5">
                  {(currentFocusQuestion.o || []).map((opt, optIdx) => {
                    const letter = OPTION_LETTERS[optIdx] || String.fromCharCode(65 + optIdx);
                    const isCorrect = currentFocusQuestion.c === optIdx + 1;
                    const analysisText = currentFocusQuestion.oa?.[optIdx] || "";

                    return (
                      <div
                        key={`focus-oa-block-${activeQuestionIdx}-${optIdx}`}
                        className="bg-slate-50/80 border border-gray-200 rounded-xl p-2.5 space-y-1.5 hover:border-purple-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] ${
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-gray-700"
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="text-xs font-bold text-gray-800 truncate max-w-[180px] sm:max-w-xs">
                              {opt || `(Option ${letter})`}
                            </span>
                            {isCorrect && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                                Correct
                              </span>
                            )}
                          </div>

                          {!readOnly && analysisText && (
                            <button
                              type="button"
                              onClick={() => deleteOptionAnalysis(activeQuestionIdx, optIdx)}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
                              title={`Delete analysis for Option (${letter})`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>

                        {previewMode ? (
                          <div className="text-xs text-gray-900 bg-white p-2 rounded-lg border border-purple-100 min-h-[36px]">
                            <FormattedText text={analysisText || `No analysis written for Option (${letter}).`} />
                          </div>
                        ) : (
                          <textarea
                            rows={2}
                            value={analysisText}
                            onChange={(e) => updateOptionAnalysis(activeQuestionIdx, optIdx, e.target.value)}
                            disabled={readOnly}
                            placeholder={`Option (${letter}) analysis: Why is this option ${isCorrect ? "correct" : "incorrect"}?`}
                            className="w-full bg-white border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 rounded-lg p-2 text-xs font-medium text-gray-900 outline-none transition-all resize-y"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Explanation & Solution */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setExpandExplanation(!expandExplanation)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-gray-800">
                    Explanation & Solution Notes
                  </span>
                  {currentFocusQuestion.s && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                      Added
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    expandExplanation ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandExplanation && (
                <div className="p-3 border-t border-gray-100">
                  {previewMode ? (
                    <div className="p-2.5 bg-amber-50/40 border border-amber-200/70 rounded-xl text-xs font-medium text-gray-800 min-h-[40px]">
                      <FormattedText text={currentFocusQuestion.s || "No explanation provided."} />
                    </div>
                  ) : (
                    <textarea
                      value={currentFocusQuestion.s || ""}
                      onChange={(e) => updateQuestion(activeQuestionIdx, { s: e.target.value })}
                      disabled={readOnly}
                      rows={2}
                      placeholder="Add step-by-step reasoning, solution, or background knowledge..."
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-xs font-medium text-gray-800 outline-none transition-all resize-y"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Collapsible: Source Reference & Image URL */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setExpandMeta(!expandMeta)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-gray-800">
                    Source Tag & Image Diagram (Optional)
                  </span>
                  {(currentFocusQuestion.source || currentFocusQuestion.image) && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">
                      Configured
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    expandMeta ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandMeta && (
                <div className="p-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                      Exam / Source Tag
                    </label>
                    <input
                      type="text"
                      value={currentFocusQuestion.source || ""}
                      onChange={(e) => updateQuestion(activeQuestionIdx, { source: e.target.value })}
                      disabled={readOnly}
                      placeholder="e.g. SSC CGL 2024, NCERT"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-800 focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                      Image / Diagram URL
                    </label>
                    <input
                      type="text"
                      value={currentFocusQuestion.image || ""}
                      onChange={(e) => updateQuestion(activeQuestionIdx, { image: e.target.value })}
                      disabled={readOnly}
                      placeholder="https://... image link"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-800 focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Quick Navigation Bar in Focus Mode */}
            <div className="pt-2 pb-6 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))}
                disabled={activeQuestionIdx === 0}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Q</span>
              </button>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => addNewQuestion(activeQuestionIdx)}
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  title="Insert new question after this"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Insert Next</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveQuestionIdx(Math.min(questions.length - 1, activeQuestionIdx + 1))}
                disabled={activeQuestionIdx >= questions.length - 1}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs disabled:opacity-30 cursor-pointer"
              >
                <span>Next Q</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ALL QUESTIONS LIST VIEW (Compact & Mobile-Optimized) */}
      {/* ========================================================================= */}
      {layoutMode === "list" && (
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y p-2.5 sm:p-4 space-y-3 touch-scroll-y"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          {filteredIndices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300 p-6">
              <HelpCircle className="w-10 h-10 text-gray-300 mb-2" />
              <p className="font-bold text-gray-700 text-sm">No questions matched your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterMode("all");
                }}
                className="mt-3 px-3.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            filteredIndices.map((realIdx) => {
              const q = questions[realIdx];
              if (!q) return null;
              const warnings = questionWarnings[realIdx] || [];
              const isWarning = warnings.length > 0;

              return (
                <div
                  key={`list-q-${realIdx}`}
                  id={`q-card-${realIdx}`}
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
                    isWarning
                      ? "border-amber-300 hover:border-amber-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className="bg-slate-50/90 px-3 py-2 border-b border-gray-100 rounded-t-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] shadow-xs">
                        #{realIdx + 1}
                      </span>

                      {/* Quick jump to focus mode button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveQuestionIdx(realIdx);
                          setLayoutMode("focus");
                        }}
                        className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[10px] font-bold cursor-pointer"
                        title="Open in mobile focus mode"
                      >
                        Focus
                      </button>

                      {q.source && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                          <Tag className="w-3 h-3" />
                          {q.source}
                        </span>
                      )}

                      {isWarning && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3" />
                          {warnings.length} issue
                        </span>
                      )}
                    </div>

                    {!readOnly && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveQuestion(realIdx, "up")}
                          disabled={realIdx === 0}
                          className="p-1 text-gray-500 hover:text-gray-900 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(realIdx, "down")}
                          disabled={realIdx === questions.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-900 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateQuestion(realIdx)}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => addNewQuestion(realIdx)}
                          className="p-1 text-gray-500 hover:text-emerald-600 rounded cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(realIdx)}
                          className="p-1 text-gray-500 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4 space-y-3">
                    {/* Question Stem */}
                    <div>
                      {previewMode ? (
                        <div className="p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 min-h-[40px]">
                          <FormattedText text={q.q || "(Empty question text)"} />
                        </div>
                      ) : (
                        <textarea
                          value={q.q || ""}
                          onChange={(e) => updateQuestion(realIdx, { q: e.target.value })}
                          disabled={readOnly}
                          rows={2}
                          placeholder="Type question stem..."
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-xs font-medium text-gray-900 outline-none transition-all resize-y"
                        />
                      )}
                    </div>

                    {/* Options List */}
                    <div className="space-y-1.5">
                      {(q.o || []).map((opt, optIdx) => {
                        const letter = OPTION_LETTERS[optIdx] || String.fromCharCode(65 + optIdx);
                        const isCorrect = q.c === optIdx + 1;
                        const hasOa = Boolean(q.oa?.[optIdx] && q.oa[optIdx].trim().length > 0);

                        return (
                          <div
                            key={`list-opt-${realIdx}-${optIdx}`}
                            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                              isCorrect
                                ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300/40"
                                : "bg-slate-50/40 border-gray-200"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setCorrectOption(realIdx, optIdx + 1)}
                              disabled={readOnly}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs transition-all shrink-0 cursor-pointer ${
                                isCorrect
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                            </button>

                            {previewMode ? (
                              <div className="flex-1 text-xs font-semibold text-gray-800 py-0.5">
                                <FormattedText text={opt || `(Option ${letter} empty)`} />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={opt || ""}
                                onChange={(e) => updateOptionText(realIdx, optIdx, e.target.value)}
                                disabled={readOnly}
                                placeholder={`Option (${letter}) text...`}
                                className="flex-1 bg-transparent border-0 text-xs font-medium text-gray-900 outline-none py-0.5"
                              />
                            )}

                            {/* Option Analysis indicator pill */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                                hasOa
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : "text-gray-400"
                              }`}
                              title={hasOa ? `OA: ${q.oa?.[optIdx]}` : "No Option Analysis"}
                            >
                              {hasOa ? "OA ✓" : ""}
                            </span>

                            {!readOnly && (q.o?.length || 0) > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(realIdx, optIdx)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Option Analysis (विकल्प विश्लेषण) Section in List Mode */}
                    <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-2.5 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-[11px] font-black text-purple-900">
                            Option Analysis (विकल्प विश्लेषण)
                          </span>
                          {q.oa && q.oa.some(a => a && a.trim().length > 0) ? (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                              {q.oa.filter(a => a && a.trim().length > 0).length}/{(q.o || []).length}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium">None</span>
                          )}
                        </div>

                        {!readOnly && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <button
                              type="button"
                              onClick={() => autoExtractQuestionOa(realIdx)}
                              title="Auto extract from explanation"
                              className="px-1.5 py-0.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Extract</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => applyQuestionOaTemplate(realIdx)}
                              title="Apply starter template"
                              className="px-1.5 py-0.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-purple-600" />
                              <span className="hidden xs:inline">Template</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => copyQuestionOa(realIdx)}
                              title="Copy this question's Option Analysis"
                              className="px-1.5 py-0.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Clipboard className="w-3 h-3 text-purple-600" />
                              <span className="hidden xs:inline">Copy</span>
                            </button>
                            {copiedOa && (
                              <button
                                type="button"
                                onClick={() => pasteQuestionOa(realIdx)}
                                title="Paste copied Option Analysis to this question"
                                className="px-1.5 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Clipboard className="w-3 h-3 text-white" />
                                <span>Paste</span>
                              </button>
                            )}
                            {q.oa && q.oa.some(a => a && a.trim().length > 0) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => mergeQuestionOaToExplanation(realIdx, false)}
                                  title="Merge Option Analysis into Explanation"
                                  className="px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-indigo-600" />
                                  <span className="hidden sm:inline">Merge</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => clearQuestionOptionAnalysis(realIdx)}
                                  title="Clear all Option Analyses for this question"
                                  className="px-1.5 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                  <span>Clear OA</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Analysis Inputs for Each Option */}
                      <div className="space-y-1.5">
                        {(q.o || []).map((opt, optIdx) => {
                          const letter = OPTION_LETTERS[optIdx] || String.fromCharCode(65 + optIdx);
                          const isCorrect = q.c === optIdx + 1;
                          const analysisText = q.oa?.[optIdx] || "";

                          return (
                            <div
                              key={`list-oa-${realIdx}-${optIdx}`}
                              className="bg-white border border-purple-100 rounded-lg p-1.5 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                                      isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-gray-700"
                                    }`}
                                  >
                                    {letter}
                                  </span>
                                  <span className="text-[10px] font-semibold text-gray-700 truncate max-w-[140px] sm:max-w-xs">
                                    {opt || `Option ${letter}`}
                                  </span>
                                  {isCorrect && (
                                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                      Correct
                                    </span>
                                  )}
                                </div>

                                {!readOnly && analysisText && (
                                  <button
                                    type="button"
                                    onClick={() => deleteOptionAnalysis(realIdx, optIdx)}
                                    className="text-[9px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
                                    title="Delete this analysis"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>

                              {previewMode ? (
                                <div className="text-[11px] text-gray-800 bg-slate-50 p-1.5 rounded border border-gray-100">
                                  <FormattedText text={analysisText || "(No analysis)"} />
                                </div>
                              ) : (
                                <textarea
                                  rows={1}
                                  value={analysisText}
                                  onChange={(e) => updateOptionAnalysis(realIdx, optIdx, e.target.value)}
                                  disabled={readOnly}
                                  placeholder={`Analysis for Option (${letter}): Why ${isCorrect ? "correct" : "incorrect"}?`}
                                  className="w-full bg-slate-50 focus:bg-white border border-gray-200 focus:border-purple-400 rounded p-1 text-[11px] font-medium text-gray-900 outline-none resize-y"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation & Solution in List Mode */}
                    <div className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[11px] font-black text-amber-900">
                          Explanation / Solution
                        </span>
                      </div>
                      {previewMode ? (
                        <div className="text-xs text-gray-800 bg-white p-2 rounded-lg border border-amber-200">
                          <FormattedText text={q.s || "No explanation"} />
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          value={q.s || ""}
                          onChange={(e) => updateQuestion(realIdx, { s: e.target.value })}
                          disabled={readOnly}
                          placeholder="Add explanation or solution notes..."
                          className="w-full bg-white border border-amber-200 focus:border-amber-400 rounded-lg p-2 text-xs font-medium text-gray-900 outline-none resize-y"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {!readOnly && filteredIndices.length > 0 && (
            <div className="pt-2 pb-6 flex justify-center">
              <button
                type="button"
                onClick={() => addNewQuestion()}
                className="bg-white hover:bg-slate-50 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Question #{questions.length + 1}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile & Tablet Question Grid Jump Drawer / Sheet */}
      {showQuestionPickerSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] animate-slideUp sm:animate-none">
            {/* Sheet Header */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="font-black text-sm">Jump to Question</h3>
                  <p className="text-[10px] text-slate-400">Total {questions.length} questions in this test</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionPickerSheet(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Legend */}
            <div className="px-4 py-2 bg-slate-100/80 border-b border-gray-200 flex items-center justify-between text-[10px] font-bold text-gray-600 overflow-x-auto no-scrollbar gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-blue-600"></span>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Has OA</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Ans Set</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Warning</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="p-3.5 overflow-y-auto flex-1 overscroll-contain">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === activeQuestionIdx;
                  const hasWarn = Boolean(questionWarnings[idx]);
                  const hasOa = Boolean(q.oa && q.oa.some(a => a && a.trim().length > 0));
                  const hasAns = Boolean(q.c && q.c > 0 && q.c <= (q.o?.length || 4));

                  return (
                    <button
                      key={`grid-jump-q-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveQuestionIdx(idx);
                        setShowQuestionPickerSheet(false);
                      }}
                      className={`relative h-11 rounded-xl font-black text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500"
                          : hasWarn
                          ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                          : "bg-slate-100 text-gray-800 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      <span>Q{idx + 1}</span>

                      {/* Status Badges Row */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {hasAns && !isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Answer Set" />
                        )}
                        {hasOa && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-purple-300" : "bg-purple-600"}`} title="Has Option Analysis" />
                        )}
                        {hasWarn && !isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" title="Warning" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 border-t border-gray-200 flex items-center justify-between shrink-0">
              {!readOnly ? (
                <button
                  type="button"
                  onClick={() => {
                    addNewQuestion();
                    setShowQuestionPickerSheet(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Question</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setShowQuestionPickerSheet(false)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
