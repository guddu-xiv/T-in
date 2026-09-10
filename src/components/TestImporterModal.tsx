import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Tag,
  Hash,
  Clock,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Folder,
  FolderPlus,
  FileSpreadsheet,
  CheckSquare,
  Split,
  PlusCircle,
  ArrowRight
} from "lucide-react";
import { ParsedQuestion, CategoryNode, SubCategoryNode, TopicNode, TestMeta } from "../types";
import { parseTestTextWithMeta, ParsedTestMeta } from "../utils/parser";
import { 
  SAMPLE_SSC_TEST_TEXT, 
  SAMPLE_BILINGUAL_PROFIT_TEST_TEXT, 
  SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT,
  SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT,
  SAMPLE_FORMAT1_AND_2_COMBINED_TEXT
} from "./TestFormatGuideModal";
import { FormattedText } from "./FormattedText";

export interface BulkSetCreationPayload {
  targetCategoryId: string;
  targetSubCategoryId?: string;
  targetTopicId?: string;
  newSubCategoryName?: string;
  newTopicName?: string;
  createLevel: "topic_in_sub" | "sub_in_cat" | "subtopic_in_topic";
  bulkAction?: "append" | "replace";
  sets: Array<{
    title: string;
    questions: ParsedQuestion[];
    duration: number;
    posMarks: number;
    negMarks: number;
    isPaid: boolean;
    instructions: string;
  }>;
}

interface TestImporterModalProps {
  isOpen: boolean;
  nodeId: string;
  nodeTitle?: string;
  type: "category" | "subcategory" | "topic";
  lang: string;
  treeType: "test" | "pdf";
  categories: CategoryNode[];
  initialQuestions?: ParsedQuestion[];
  initialFileName?: string;
  initialMeta?: ParsedTestMeta;
  existingQuestionsCount?: number;
  onClose: () => void;
  onConfirm: (payload: {
    questions: ParsedQuestion[];
    meta?: ParsedTestMeta;
    applyMetaTitleAndId: boolean;
    action?: "replace" | "append";
  }) => void;
  onBulkCreateSets?: (payload: BulkSetCreationPayload) => void;
  onOpenFormatGuide: () => void;
}

export const TestImporterModal: React.FC<TestImporterModalProps> = ({
  isOpen,
  nodeId,
  nodeTitle,
  type,
  lang,
  treeType,
  categories = [],
  initialQuestions = [],
  initialFileName,
  initialMeta,
  existingQuestionsCount = 0,
  onClose,
  onConfirm,
  onBulkCreateSets,
  onOpenFormatGuide
}) => {
  // Main mode: single test import vs bulk set splitter
  const [modalMode, setModalMode] = useState<"single" | "bulk">("single");
  const [inputMethod, setInputMethod] = useState<"file" | "paste">("file");
  const [rawText, setRawText] = useState<string>("");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>(initialQuestions);
  const [detectedMeta, setDetectedMeta] = useState<ParsedTestMeta>(initialMeta || {});
  const [fileName, setFileName] = useState<string>(initialFileName || "");
  const [sourceMode, setSourceMode] = useState<"keep" | "override">("keep");
  const [customSource, setCustomSource] = useState<string>("");
  const [applyMetaTitleAndId, setApplyMetaTitleAndId] = useState<boolean>(true);
  const [previewIdx, setPreviewIdx] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [copiedSample, setCopiedSample] = useState<boolean>(false);

  // Import Action Mode (Append vs Replace)
  const [singleImportAction, setSingleImportAction] = useState<"append" | "replace">("append");
  const [bulkAction, setBulkAction] = useState<"append" | "replace">("append");
  const [pendingIncomingImport, setPendingIncomingImport] = useState<{
    questions: ParsedQuestion[];
    meta?: ParsedTestMeta;
    nameOfFile?: string;
  } | null>(null);

  // Bulk Splitting State
  const [splitMode, setSplitMode] = useState<"byQuestionsPerSet" | "byTotalSets">("byQuestionsPerSet");
  const [questionsPerSet, setQuestionsPerSet] = useState<number>(50);
  const [totalSetsCount, setTotalSetsCount] = useState<number>(5);
  const [setBaseTitle, setSetBaseTitle] = useState<string>("");
  const [startSetNumber, setStartSetNumber] = useState<number>(1);
  const [setDuration, setSetDuration] = useState<number>(30);
  const [setPosMarks, setSetPosMarks] = useState<number>(1);
  const [setNegMarks, setSetNegMarks] = useState<number>(0.25);
  const [setIsPaid, setSetIsPaid] = useState<boolean>(false);
  const [renumberInSets, setRenumberInSets] = useState<boolean>(true);
  const [previewSetIdx, setPreviewSetIdx] = useState<number>(0);
  const [previewSetQIdx, setPreviewSetQIdx] = useState<number>(0);

  // Hierarchy Selection for Bulk Placement
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [isCreatingNewSub, setIsCreatingNewSub] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState<string>("");
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState<boolean>(false);
  const [newTopicName, setNewTopicName] = useState<string>("");

  // Determine initial hierarchy from props
  useEffect(() => {
    if (isOpen) {
      if (initialQuestions && initialQuestions.length > 0) {
        setParsedQuestions(initialQuestions);
        setPreviewIdx(0);
        const firstSource = initialQuestions.find(q => q.source)?.source || "";
        if (firstSource) setCustomSource(firstSource);
        if (initialQuestions.length >= 60) {
          setModalMode("bulk");
        }
      } else {
        setParsedQuestions([]);
      }
      setFileName(initialFileName || "");
      setDetectedMeta(initialMeta || {});

      // Derive base title
      const baseName = detectedMeta?.title || nodeTitle || "Practice Test Set";
      setSetBaseTitle(baseName.replace(/\s*Set\s*\d+/i, "").trim() || "Practice Test Set");

      // Auto-locate current node in categories
      let matchedCatId = "";
      let matchedSubId = "";
      let matchedTopId = "";

      for (const cat of categories) {
        if (type === "category" && cat.id === nodeId) {
          matchedCatId = cat.id;
          break;
        }
        for (const sub of cat.subCategories) {
          if (type === "subcategory" && sub.id === nodeId) {
            matchedCatId = cat.id;
            matchedSubId = sub.id;
            break;
          }
          const findTopic = (tops: TopicNode[]): boolean => {
            for (const top of tops) {
              if (top.id === nodeId) {
                matchedCatId = cat.id;
                matchedSubId = sub.id;
                matchedTopId = top.id;
                return true;
              }
              if (top.topics && findTopic(top.topics)) return true;
            }
            return false;
          };
          if (type === "topic" && findTopic(sub.topics || [])) break;
        }
        if (matchedCatId) break;
      }

      if (matchedCatId) {
        setSelectedCatId(matchedCatId);
        setSelectedSubId(matchedSubId || (categories.find(c => c.id === matchedCatId)?.subCategories[0]?.id || ""));
        setSelectedTopicId(matchedTopId);
      } else if (categories.length > 0) {
        setSelectedCatId(categories[0].id);
        if (categories[0].subCategories.length > 0) {
          setSelectedSubId(categories[0].subCategories[0].id);
        }
      }
    }
  }, [isOpen, nodeId, type, categories, initialQuestions, initialFileName, initialMeta, nodeTitle]);

  // Typeset MathJax equations in modal previews
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (typeof (window as any).MathJax?.typesetPromise === "function") {
          (window as any).MathJax.typesetPromise().catch(() => {});
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, previewIdx, previewSetIdx, previewSetQIdx, modalMode, parsedQuestions]);

  // Handle Category Change
  const handleCatChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categories.find(c => c.id === catId);
    if (cat && cat.subCategories.length > 0) {
      setSelectedSubId(cat.subCategories[0].id);
      setSelectedTopicId("");
    } else {
      setSelectedSubId("");
      setSelectedTopicId("");
    }
  };

  // Selected Category & Subcategory Objects
  const activeCategory = useMemo(() => categories.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  const activeSubcategory = useMemo(
    () => activeCategory?.subCategories.find(s => s.id === selectedSubId),
    [activeCategory, selectedSubId]
  );

  // Flattened topics with visual indentation
  const flattenedTopics = useMemo(() => {
    if (!activeSubcategory) return [];
    const list: Array<{ id: string; name: string; level: number }> = [];

    const traverse = (topics: TopicNode[], level: number) => {
      for (const t of topics) {
        list.push({ id: t.id, name: t.name, level });
        if (t.topics && t.topics.length > 0) {
          traverse(t.topics, level + 1);
        }
      }
    };

    traverse(activeSubcategory.topics || [], 0);
    return list;
  }, [activeSubcategory]);

  // Calculate existing sets inside chosen hierarchy target
  const existingSetsInTarget = useMemo(() => {
    if (!selectedCatId) return [];
    const cat = categories.find(c => c.id === selectedCatId);
    if (!cat) return [];
    if (isCreatingNewSub) return [];
    const sub = cat.subCategories?.find(s => s.id === selectedSubId);
    if (!sub) return [];
    if (selectedTopicId) {
      const findTopicRecursive = (topics: TopicNode[]): TopicNode | null => {
        for (const top of topics) {
          if (top.id === selectedTopicId) return top;
          if (top.topics && top.topics.length > 0) {
            const found = findTopicRecursive(top.topics);
            if (found) return found;
          }
        }
        return null;
      };
      const topic = findTopicRecursive(sub.topics || []);
      return (topic?.topics || []).filter(t => t.test !== null);
    }
    return (sub.topics || []).filter(t => t.test !== null);
  }, [categories, selectedCatId, selectedSubId, selectedTopicId, isCreatingNewSub]);

  // When target changes or existing sets are found, auto-suggest startSetNumber
  useEffect(() => {
    if (existingSetsInTarget.length > 0) {
      setStartSetNumber(existingSetsInTarget.length + 1);
    } else {
      setStartSetNumber(1);
    }
  }, [existingSetsInTarget.length, selectedCatId, selectedSubId, selectedTopicId]);

  // Handler functions
  const processText = (text: string, nameOfFile?: string) => {
    if (!text.trim()) {
      alert("Text is empty. Please upload or paste valid test questions.");
      return;
    }
    const result = parseTestTextWithMeta(text);
    if (result.questions.length === 0) {
      alert(
        "No questions could be detected! Please ensure questions start with 'Q1.' or '1.' and options start with '(A)' or 'A)'."
      );
      return;
    }

    // If questions are already loaded in importer, ask: Overlap or Append Below!
    if (parsedQuestions.length > 0) {
      setPendingIncomingImport({
        questions: result.questions,
        meta: result.meta || {},
        nameOfFile
      });
      return;
    }

    setParsedQuestions(result.questions);
    setDetectedMeta(result.meta || {});
    if (nameOfFile) setFileName(nameOfFile);
    setPreviewIdx(0);

    const firstSource = result.questions.find(q => q.source)?.source || "";
    if (firstSource) {
      setCustomSource(firstSource);
    }

    const titleCandidate = result.meta?.title || nameOfFile?.replace(/\.txt$/i, "") || nodeTitle || "Test Set";
    setSetBaseTitle(titleCandidate.replace(/\s*Set\s*\d+/i, "").trim() || "Test Set");

    // Automatically switch to Bulk Mode if more than 50 questions
    if (result.questions.length >= 60) {
      setModalMode("bulk");
    }
  };

  const handleAcceptAppend = () => {
    if (!pendingIncomingImport) return;
    const combined = [...parsedQuestions, ...pendingIncomingImport.questions];
    setParsedQuestions(combined);
    if (pendingIncomingImport.nameOfFile) {
      setFileName(prev => prev ? `${prev} + ${pendingIncomingImport.nameOfFile}` : pendingIncomingImport.nameOfFile!);
    }
    if (combined.length >= 60) {
      setModalMode("bulk");
    }
    setPendingIncomingImport(null);
  };

  const handleAcceptOverlap = () => {
    if (!pendingIncomingImport) return;
    setParsedQuestions(pendingIncomingImport.questions);
    setDetectedMeta(pendingIncomingImport.meta || {});
    if (pendingIncomingImport.nameOfFile) setFileName(pendingIncomingImport.nameOfFile);
    setPreviewIdx(0);

    const firstSource = pendingIncomingImport.questions.find(q => q.source)?.source || "";
    if (firstSource) {
      setCustomSource(firstSource);
    }

    const titleCandidate = pendingIncomingImport.meta?.title || pendingIncomingImport.nameOfFile?.replace(/\.txt$/i, "") || nodeTitle || "Test Set";
    setSetBaseTitle(titleCandidate.replace(/\s*Set\s*\d+/i, "").trim() || "Test Set");

    if (pendingIncomingImport.questions.length >= 60) {
      setModalMode("bulk");
    }
    setPendingIncomingImport(null);
  };

  const handleCancelIncoming = () => {
    setPendingIncomingImport(null);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processText(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Generate split sets based on questions
  const generatedSets = useMemo(() => {
    if (parsedQuestions.length === 0) return [];

    let effectiveSource = sourceMode === "override" && customSource.trim() ? customSource.trim() : "";
    const preparedQuestions = parsedQuestions.map(q => ({
      ...q,
      source: effectiveSource || q.source
    }));

    const sets: Array<{
      title: string;
      questions: ParsedQuestion[];
      duration: number;
      posMarks: number;
      negMarks: number;
      isPaid: boolean;
      instructions: string;
      rangeText: string;
    }> = [];

    const totalQ = preparedQuestions.length;

    let chunkSize = 50;
    let totalSets = 1;

    if (splitMode === "byQuestionsPerSet") {
      chunkSize = Math.max(1, questionsPerSet);
      totalSets = Math.ceil(totalQ / chunkSize);
    } else {
      totalSets = Math.max(1, totalSetsCount);
      chunkSize = Math.ceil(totalQ / totalSets);
    }

    for (let i = 0; i < totalSets; i++) {
      const startIdx = i * chunkSize;
      const endIdx = Math.min(startIdx + chunkSize, totalQ);
      if (startIdx >= totalQ) break;

      const chunk = preparedQuestions.slice(startIdx, endIdx);
      const setNum = startSetNumber + i;
      const title = `${setBaseTitle.trim()} ${setNum}`;

      // Clean renumbered questions
      const finalChunk = chunk.map((q, qIndex) => {
        if (!renumberInSets) return q;
        // Optionally re-number
        return {
          ...q
        };
      });

      sets.push({
        title,
        questions: finalChunk,
        duration: setDuration,
        posMarks: setPosMarks,
        negMarks: setNegMarks,
        isPaid: setIsPaid,
        instructions: `Standard CBT Pattern Exam. Positive Marks: +${setPosMarks}, Negative Marks: -${setNegMarks}. Total Questions: ${finalChunk.length}.`,
        rangeText: `Q${startIdx + 1} - Q${endIdx} (${finalChunk.length} Qs)`
      });
    }

    return sets;
  }, [
    parsedQuestions,
    splitMode,
    questionsPerSet,
    totalSetsCount,
    setBaseTitle,
    startSetNumber,
    setDuration,
    setPosMarks,
    setNegMarks,
    setIsPaid,
    renumberInSets,
    sourceMode,
    customSource
  ]);

  // Handle Final Submission
  const handleFinalSubmit = () => {
    if (parsedQuestions.length === 0) {
      alert("No questions to import. Please attach a .txt file or paste question text first.");
      return;
    }

    if (modalMode === "single") {
      let finalQuestions = parsedQuestions;
      if (sourceMode === "override" && customSource.trim()) {
        const trimmed = customSource.trim();
        finalQuestions = parsedQuestions.map(q => ({
          ...q,
          source: trimmed
        }));
      }

      onConfirm({
        questions: finalQuestions,
        meta: detectedMeta,
        applyMetaTitleAndId: applyMetaTitleAndId && !!(detectedMeta.title || detectedMeta.id),
        action: singleImportAction
      });
    } else {
      // Bulk creation
      if (!selectedCatId) {
        alert("Please select a target Category.");
        return;
      }

      if (isCreatingNewSub && !newSubName.trim()) {
        alert("Please enter a name for the new Subcategory.");
        return;
      }

      if (!isCreatingNewSub && !selectedSubId) {
        alert("Please select a Subcategory or choose to create a new one.");
        return;
      }

      if (isCreatingNewTopic && !newTopicName.trim()) {
        alert("Please enter a name for the new Topic / Sub-Topic.");
        return;
      }

      if (generatedSets.length === 0) {
        alert("No sets were generated. Please check your split settings.");
        return;
      }

      let createLevel: "topic_in_sub" | "sub_in_cat" | "subtopic_in_topic" = "topic_in_sub";
      if (selectedTopicId || isCreatingNewTopic) {
        createLevel = "subtopic_in_topic";
      } else if (isCreatingNewSub) {
        createLevel = "topic_in_sub";
      }

      if (onBulkCreateSets) {
        onBulkCreateSets({
          targetCategoryId: selectedCatId,
          targetSubCategoryId: isCreatingNewSub ? undefined : selectedSubId,
          targetTopicId: selectedTopicId || undefined,
          newSubCategoryName: isCreatingNewSub ? newSubName.trim() : undefined,
          newTopicName: isCreatingNewTopic ? newTopicName.trim() : undefined,
          createLevel,
          bulkAction,
          sets: generatedSets
        });
      } else {
        alert("Bulk creation handler not connected.");
      }
    }
  };

  if (!isOpen) return null;

  const currentPreviewQ = parsedQuestions[previewIdx];
  const activePreviewSet = generatedSets[previewSetIdx] || generatedSets[0];
  const currentSetPreviewQ = activePreviewSet?.questions[previewSetQIdx];

  return (
    <div
      id="test-importer-modal"
      className="fixed inset-0 z-[999998] flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white border border-gray-200 rounded-3xl max-w-5xl w-full max-h-[94vh] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg">
                  {modalMode === "bulk" ? "⚡ Bulk Test & Set Splitter" : "Import Test Questions (.txt)"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {lang.toUpperCase()}
                </span>
                {parsedQuestions.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {parsedQuestions.length} Questions Detected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {modalMode === "bulk"
                  ? "Upload a bulk .txt file (e.g. 395 questions) and auto-split into sets (e.g. 5 sets of 50 questions) into your selected hierarchy."
                  : `Attach .txt file or paste questions to instantly load into "${nodeTitle || "Selected Test"}"`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFormatGuide}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              title="View format syntax and examples"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Format Guide
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-200/80 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode("single")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                modalMode === "single"
                  ? "bg-white text-blue-700 shadow-sm border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Single Test Mode
            </button>
            <button
              onClick={() => setModalMode("bulk")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                modalMode === "bulk"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              ⚡ Bulk Split & Auto-Create Sets
              {parsedQuestions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-md bg-white/25 text-[10px] font-black">
                  {parsedQuestions.length} Qs
                </span>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hindi (क,ख / अ,ब), Alpha (A,B,C,D) & Numeric (1,2,3,4) supported
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Ingest .txt File / Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                Step 1: Upload or Paste .TXT Questions
              </label>

              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setInputMethod("file")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    inputMethod === "file" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  File Upload (.txt)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod("paste")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    inputMethod === "paste" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMethod === "file" ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-blue-500 bg-blue-50/50"
                    : fileName
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50/50"
                }`}
                onClick={() => document.getElementById("file-importer-input")?.click()}
              >
                <input
                  id="file-importer-input"
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      fileName ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {fileName ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    {fileName ? (
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{fileName}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                          ✅ Successfully parsed {parsedQuestions.length} questions
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          Click to browse or drag & drop your <span className="text-blue-600">.txt file</span> here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Supports massive test files with 50 to 500+ questions</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste question text here...&#10;&#10;Q1. What is the standard SI unit of force?&#10;(A) Joule&#10;(B) Pascal&#10;(C) Newton&#10;(D) Watt&#10;Ans: (C)&#10;Ex: Force = Mass x Acceleration (Newtons).&#10;Source: SSC CGL 2024&#10;&#10;--- Or Antonyms & Synonyms Vocab Format ---&#10;1. Select the word opposite in meaning to: Puissant&#10;A) Feeble ✅ /// Direct opposite of powerful...&#10;Synonyms: Weak, Fragile&#10;Antonyms: Robust, Powerful&#10;B) Robust /// Refers to strong and healthy..."
                  className="w-full h-36 p-3 text-xs font-mono bg-slate-900 text-slate-100 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                />
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRawText(SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT);
                        processText(SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT, "Format1_Hindi_GS_Analysis.txt");
                      }}
                      className="text-xs bg-rose-50 border border-rose-200 text-rose-900 hover:bg-rose-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Format 1: Hindi GS with /// option analysis and multi-paragraph explanation"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      <span>🏛️ Format 1: Hindi GS (///)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRawText(SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT);
                        processText(SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT, "Format2_Antonyms_Vocab_Analysis.txt");
                      }}
                      className="text-xs bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Format 2: Antonyms & Synonyms Vocab Sample with /// option analysis"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>📖 Format 2: Vocab (///)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRawText(SAMPLE_FORMAT1_AND_2_COMBINED_TEXT);
                        processText(SAMPLE_FORMAT1_AND_2_COMBINED_TEXT, "Format1_and_Format2_Combined.txt");
                      }}
                      className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-950 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Both Format 1 (Hindi GS) and Format 2 (Vocab Antonyms) in a single text"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>⚡ Both 1 & 2 Combined</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRawText(SAMPLE_BILINGUAL_PROFIT_TEST_TEXT);
                        processText(SAMPLE_BILINGUAL_PROFIT_TEST_TEXT, "Sample_Bilingual_CGL_Test.txt");
                      }}
                      className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>🌐 Bilingual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRawText(SAMPLE_SSC_TEST_TEXT);
                        processText(SAMPLE_SSC_TEST_TEXT, "Sample_SSC_CGL_Test.txt");
                      }}
                      className="text-xs bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>General</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => processText(rawText, "Pasted_Questions.txt")}
                    disabled={!rawText.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    Parse Pasted Text ({rawText.split(/\n/).length} lines)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BULK MODE: Set Splitter Configuration & Hierarchy Selector */}
          {modalMode === "bulk" && (
            <div className="space-y-6 pt-2 border-t border-gray-100">
              {/* Step 2: Target Location Hierarchy Selector */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 rounded-2xl border border-blue-100/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-600" />
                    Step 2: Choose Where to Insert Test Sets (Category & Subcategory)
                  </label>
                  <span className="text-[11px] text-blue-700 font-semibold bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                    Pre-created Hierarchy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Select Main Category:</label>
                    <select
                      value={selectedCatId}
                      onChange={(e) => handleCatChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          📁 {c.name} ({c.subCategories.length} subs)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Selection or Create New */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-600">Select Sub-Category:</label>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewSub(!isCreatingNewSub)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
                      >
                        <FolderPlus className="w-3 h-3" />
                        {isCreatingNewSub ? "Select Existing" : "+ New Sub"}
                      </button>
                    </div>

                    {isCreatingNewSub ? (
                      <input
                        type="text"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        placeholder="e.g. English Mock Tests"
                        className="w-full bg-white border border-blue-400 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    ) : (
                      <select
                        value={selectedSubId}
                        onChange={(e) => setSelectedSubId(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        disabled={!activeCategory || activeCategory.subCategories.length === 0}
                      >
                        {activeCategory?.subCategories.map((s) => (
                          <option key={s.id} value={s.id}>
                            📂 {s.name} ({s.topics?.length || 0} topics)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Topic / Subtopic Selection (Optional nesting) */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Target Topic / Sub-Topic:
                    </label>
                    <select
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      disabled={isCreatingNewSub || flattenedTopics.length === 0}
                    >
                      <option value="">-- Direct in Subcategory (Root Topics) --</option>
                      {flattenedTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {"— ".repeat(t.level)} {t.level === 0 ? "📁 Topic: " : "↳ 📄 Sub-Topic: "} {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Create New Topic / Sub-Topic Checkbox & Input */}
                <div className="pt-2 border-t border-blue-100/60">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-800">
                    <input
                      type="checkbox"
                      checked={isCreatingNewTopic}
                      onChange={(e) => setIsCreatingNewTopic(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>➕ Create a New {selectedTopicId ? "Sub-Topic inside this Topic" : "Topic inside this Subcategory"}</span>
                  </label>
                  {isCreatingNewTopic && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        placeholder={selectedTopicId ? "Enter Sub-Topic Name (e.g. Noun Rules)" : "Enter Topic Name (e.g. English Grammar)"}
                        className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Target Breadcrumb Summary */}
                <div className="px-3 py-2 rounded-xl bg-white/80 border border-blue-100 text-xs text-gray-700 flex items-center gap-2">
                  <span className="font-bold text-blue-700 shrink-0">📍 Target Destination:</span>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 overflow-x-auto">
                    <span>{activeCategory?.name || "Category"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-semibold text-indigo-700">
                      {isCreatingNewSub ? newSubName || "[New Subcategory]" : activeSubcategory?.name || "Subcategory"}
                    </span>
                    {selectedTopicId && (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-semibold text-blue-800">
                          {flattenedTopics.find(t => t.id === selectedTopicId)?.name || "Topic"}
                        </span>
                      </>
                    )}
                    {isCreatingNewTopic && (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-semibold text-emerald-700">
                          {newTopicName || (selectedTopicId ? "[New Sub-Topic]" : "[New Topic]")}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Existing Sets Detection & Append vs Replace Selector */}
                {existingSetsInTarget.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          !
                        </span>
                        <span className="text-xs font-black text-amber-950">
                          {existingSetsInTarget.length} Existing Test Sets Found in this location!
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                        Existing Data Protected
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                      इस लोकेशन में पहले से <strong>{existingSetsInTarget.length} टेस्ट सेट्स</strong> मौजूद हैं (जैसे "{existingSetsInTarget[0]?.name}", "{existingSetsInTarget[existingSetsInTarget.length - 1]?.name}")। क्या आप नए सेट्स को इनके नीचे जोड़ना चाहते हैं ताकि पुराना कुछ न हटे?
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkAction("append");
                          setStartSetNumber(existingSetsInTarget.length + 1);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          bulkAction === "append"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>⬇️ Append Below (नीचे जोड़ें)</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                          bulkAction === "append" ? "bg-emerald-700 text-emerald-100" : "bg-gray-100 text-gray-600"
                        }`}>
                          Set #{existingSetsInTarget.length + 1}+
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBulkAction("replace")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          bulkAction === "replace"
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Split className="w-3.5 h-3.5" />
                          <span>🔄 Overlap / Replace (पहला हटाएं)</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                          bulkAction === "replace" ? "bg-rose-700 text-rose-100" : "bg-gray-100 text-gray-600"
                        }`}>
                          Overwrite
                        </span>
                      </button>
                    </div>

                    <div className="text-[11px] font-medium pt-0.5">
                      {bulkAction === "append" ? (
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          ✅ पहले वाले {existingSetsInTarget.length} सेट्स सुरक्षित रहेंगे। नए सेट्स उनके नीचे Set {startSetNumber} से शुरू होकर जुड़ेंगे।
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          ⚠️ चेतावनी: पहले वाले {existingSetsInTarget.length} सेट्स को हटाकर केवल ये नए सेट्स रखे जाएंगे।
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Split Parameters (How many sets / questions) */}
              <div className="bg-gradient-to-br from-indigo-50/40 to-purple-50/40 p-5 rounded-2xl border border-indigo-100/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <Split className="w-4 h-4 text-indigo-600" />
                    Step 3: Define How to Split Questions into Sets
                  </label>
                  <div className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    Total: {parsedQuestions.length} Questions
                  </div>
                </div>

                {/* Split Mode Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setSplitMode("byQuestionsPerSet")}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      splitMode === "byQuestionsPerSet"
                        ? "bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                        : "bg-white/60 border-gray-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          splitMode === "byQuestionsPerSet" ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                        }`}
                      >
                        {splitMode === "byQuestionsPerSet" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">By Questions per Set</p>
                        <p className="text-[11px] text-gray-500">e.g. 50 questions in each set</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max={Math.max(parsedQuestions.length, 500)}
                        value={questionsPerSet}
                        onChange={(e) => setQuestionsPerSet(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 text-xs font-bold text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-gray-600 font-medium">Qs</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setSplitMode("byTotalSets")}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      splitMode === "byTotalSets"
                        ? "bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                        : "bg-white/60 border-gray-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          splitMode === "byTotalSets" ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                        }`}
                      >
                        {splitMode === "byTotalSets" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">By Total Number of Sets</p>
                        <p className="text-[11px] text-gray-500">e.g. divide into 5 equal sets</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={totalSetsCount}
                        onChange={(e) => setTotalSetsCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 text-xs font-bold text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-gray-600 font-medium">Sets</span>
                    </div>
                  </label>
                </div>

                {/* Calculation outcome banner */}
                <div className="bg-white p-3 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-gray-900">
                      ⚡ Creates <span className="text-indigo-600 font-extrabold">{generatedSets.length} Test Sets</span>:
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      {generatedSets.map(s => s.rangeText).slice(0, 3).join(", ")}
                      {generatedSets.length > 3 && ` ... and ${generatedSets.length - 3} more sets`}
                    </span>
                  </div>
                </div>

                {/* Set Names & Defaults */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Set Title Prefix:</label>
                    <input
                      type="text"
                      value={setBaseTitle}
                      onChange={(e) => setSetBaseTitle(e.target.value)}
                      placeholder="e.g. Practice Mock Set"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Preview: "{setBaseTitle || "Set"} 1", "{setBaseTitle || "Set"} 2"
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Starting Number:</label>
                    <input
                      type="number"
                      min="1"
                      value={startSetNumber}
                      onChange={(e) => setStartSetNumber(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Duration (mins):</label>
                    <input
                      type="number"
                      min="1"
                      value={setDuration}
                      onChange={(e) => setSetDuration(Math.max(1, parseInt(e.target.value) || 30))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Marking (+ / -):</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.25"
                        value={setPosMarks}
                        onChange={(e) => setSetPosMarks(parseFloat(e.target.value) || 1)}
                        className="w-1/2 bg-white border border-gray-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-emerald-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        title="Positive Marks"
                      />
                      <input
                        type="number"
                        step="0.05"
                        value={setNegMarks}
                        onChange={(e) => setSetNegMarks(parseFloat(e.target.value) || 0)}
                        className="w-1/2 bg-white border border-gray-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-rose-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        title="Negative Marks"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl">
                    <input
                      type="checkbox"
                      checked={setIsPaid}
                      onChange={(e) => setSetIsPaid(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-gray-800">
                      {setIsPaid ? "🔒 Paid Membership (Restricted Access)" : "🔓 Free Tier (Unlimited Practice Attempts for all students)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 4: Interactive Live Sets Tabs & Question Preview */}
              {generatedSets.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Step 4: Preview Generated Sets & Questions
                  </label>

                  {/* Set Selection Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {generatedSets.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPreviewSetIdx(idx);
                          setPreviewSetQIdx(0);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          previewSetIdx === idx
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                        }`}
                      >
                        <span>{s.title}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                            previewSetIdx === idx ? "bg-purple-800 text-purple-100" : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {s.questions.length} Qs
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Question inside selected set preview */}
                  {currentSetPreviewQ && (
                    <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-xs">
                            {activePreviewSet.title} — Question {previewSetQIdx + 1} of {activePreviewSet.questions.length}
                          </span>
                          {currentSetPreviewQ.source && (
                            <span className="text-[11px] font-semibold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-md">
                              Source: {currentSetPreviewQ.source}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewSetQIdx(Math.max(0, previewSetQIdx - 1))}
                            disabled={previewSetQIdx === 0}
                            className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-40 text-gray-700"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-semibold text-gray-600 px-1">
                            {previewSetQIdx + 1}/{activePreviewSet.questions.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewSetQIdx(Math.min(activePreviewSet.questions.length - 1, previewSetQIdx + 1))}
                            disabled={previewSetQIdx === activePreviewSet.questions.length - 1}
                            className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-40 text-gray-700"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="font-semibold text-gray-900 text-xs whitespace-pre-line leading-relaxed">
                        <FormattedText text={currentSetPreviewQ.q} />
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {currentSetPreviewQ.o.map((opt, oIdx) => {
                          const isCorrect = currentSetPreviewQ.c === oIdx + 1;
                          const optLetters = ["A", "B", "C", "D", "E", "F"];
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                                  : "border-gray-200 bg-white text-gray-800"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isCorrect ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {optLetters[oIdx] || oIdx + 1}
                              </span>
                              <span className="flex-1 whitespace-pre-line">
                                <FormattedText text={opt} />
                              </span>
                              {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {currentSetPreviewQ.s && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950">
                          <span className="font-bold text-amber-900">Explanation: </span>
                          <span className="whitespace-pre-line">
                            <FormattedText text={currentSetPreviewQ.s} />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SINGLE TEST MODE: Source and Question Preview */}
          {modalMode === "single" && parsedQuestions.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {/* Import Action Mode Selector (Append vs Replace) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Target Test Import Mode ({nodeTitle || "Current Test"}):
                  </span>
                  {existingQuestionsCount > 0 && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {existingQuestionsCount} Already Present
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSingleImportAction("append")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      singleImportAction === "append"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>⬇️ Append Below / नीचे जोड़ें</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      singleImportAction === "append" ? "bg-emerald-700 text-emerald-100" : "bg-gray-100 text-gray-600"
                    }`}>
                      Safe & Retain
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSingleImportAction("replace")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      singleImportAction === "replace"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5" />
                      <span>🔄 Overlap / Replace (पहला हटाएं)</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      singleImportAction === "replace" ? "bg-rose-700 text-rose-100" : "bg-gray-100 text-gray-600"
                    }`}>
                      Overwrite
                    </span>
                  </button>
                </div>

                <div className="text-[11px] font-medium pt-0.5">
                  {singleImportAction === "append" ? (
                    <span className="text-emerald-800 font-bold">
                      ✅ पहले वाले प्रश्न सुरक्षित रहेंगे, और ये {parsedQuestions.length} नए प्रश्न उनके नीचे जुड़ जाएंगे (Pehle wala hate nahi, new wala uske neeche aa jaye)।
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold">
                      ⚠️ चेतावनी: पहले वाले सभी प्रश्न हटा दिए जाएंगे और केवल ये {parsedQuestions.length} प्रश्न टेस्ट में रहेंगे।
                    </span>
                  )}
                </div>
              </div>

              {/* Question Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Question Preview ({previewIdx + 1} of {parsedQuestions.length})
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))}
                      disabled={previewIdx === 0}
                      className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-gray-600 px-1">
                      {previewIdx + 1}/{parsedQuestions.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewIdx(Math.min(parsedQuestions.length - 1, previewIdx + 1))}
                      disabled={previewIdx === parsedQuestions.length - 1}
                      className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {currentPreviewQ && (
                  <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="font-semibold text-gray-900 text-xs whitespace-pre-line leading-relaxed">
                      <FormattedText text={currentPreviewQ.q} />
                    </div>

                    {currentPreviewQ.source && (
                      <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border-l-4 border-amber-500 rounded-md px-3 py-1.5 flex items-center gap-1.5">
                        <span>📖 :</span>
                        <span><FormattedText text={currentPreviewQ.source.replace(/^:\s*/, "")} /></span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentPreviewQ.o.map((opt, oIdx) => {
                        const isCorrect = currentPreviewQ.c === oIdx + 1;
                        const optLetters = ["A", "B", "C", "D", "E", "F"];
                        const optAnalysis = currentPreviewQ.oa && currentPreviewQ.oa[oIdx];
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1.5 ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                                : "border-gray-200 bg-white text-gray-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isCorrect ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {optLetters[oIdx] || oIdx + 1}
                              </span>
                              <span className="flex-1 whitespace-pre-line font-medium">
                                <FormattedText text={opt} />
                              </span>
                              {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </div>
                            {optAnalysis && (
                              <div className="text-[11px] text-gray-600 bg-black/5 rounded-lg p-2 font-normal whitespace-pre-line border border-black/5 mt-0.5">
                                <span className="font-bold text-gray-700">Option Analysis: </span>
                                <FormattedText text={optAnalysis} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {currentPreviewQ.s && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950">
                        <span className="font-bold text-amber-900">Explanation: </span>
                        <span className="whitespace-pre-line">
                          <FormattedText text={currentPreviewQ.s} />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200/80 rounded-xl transition-all"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {modalMode === "single" ? (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={parsedQuestions.length === 0}
                className={`px-6 py-2.5 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                  singleImportAction === "append"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                <Check className="w-4 h-4" />
                {singleImportAction === "append"
                  ? `⬇️ Append ${parsedQuestions.length} Questions Below Existing`
                  : `🔄 Replace Test with ${parsedQuestions.length} Questions`}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={generatedSets.length === 0}
                className={`px-7 py-2.5 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  bulkAction === "append"
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 shadow-emerald-500/25"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-indigo-500/25"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {bulkAction === "append"
                  ? `⚡ Auto-Create & Append ${generatedSets.length} Test Sets Below`
                  : `⚡ Overwrite & Create ${generatedSets.length} Test Sets`}
              </button>
            )}
          </div>
        </div>

        {/* Incoming File/Batch Conflict Dialog: Overlap or Append Below */}
        {pendingIncomingImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Existing Questions Detected / पहले से प्रश्न मौजूद हैं
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Choose whether to append new questions below or replace previous ones
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Currently Loaded (पहले से लोड प्रश्न):</span>
                  <span className="text-blue-600 font-black">{parsedQuestions.length} Questions</span>
                </div>
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Newly Attached ({pendingIncomingImport.nameOfFile || "New .txt"}):</span>
                  <span className="text-emerald-600 font-black">{pendingIncomingImport.questions.length} Questions</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total if Appended Below:</span>
                  <span className="text-indigo-600 font-black">
                    {parsedQuestions.length + pendingIncomingImport.questions.length} Questions
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                आप क्या करना चाहते हैं? क्या नए प्रश्न पहले वाले प्रश्नों के नीचे जोड़ें (Append Below) ताकि पुराना कुछ न हटे, या पहले वाले को हटाकर ओवरलैप/बदलें (Overlap / Replace)?
              </p>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAcceptAppend}
                  className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-left transition-all active:scale-[0.99] flex items-start gap-3 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black flex items-center justify-between">
                      <span>⬇️ Append Below / नीचे जोड़ें (Recommended)</span>
                      <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded-md font-bold">Safe & Retains All</span>
                    </div>
                    <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                      पहले वाले {parsedQuestions.length} प्रश्न सुरक्षित रहेंगे, और नए {pendingIncomingImport.questions.length} प्रश्न उनके नीचे जुड़ जाएंगे। कुल {parsedQuestions.length + pendingIncomingImport.questions.length} प्रश्न होंगे।
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleAcceptOverlap}
                  className="w-full p-3.5 bg-slate-100 hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-slate-800 hover:text-rose-900 rounded-2xl text-left transition-all active:scale-[0.99] flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Split className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black flex items-center justify-between">
                      <span>🔄 Overlap / Replace (पहला हटाएं / बदलें)</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">Overwrite</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      पहले वाले {parsedQuestions.length} प्रश्न हटा दिए जाएंगे और केवल नए {pendingIncomingImport.questions.length} प्रश्न रहेंगे।
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleCancelIncoming}
                  className="w-full py-2 text-center text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cancel / कुछ न करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
