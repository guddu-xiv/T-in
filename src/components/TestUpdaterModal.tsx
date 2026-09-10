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
  Layers,
  HelpCircle,
  Copy,
  Check,
  Folder,
  FolderPlus,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Edit3,
  Search,
  Split,
  ArrowRight,
  Eye,
  Sliders,
  CheckSquare,
  ListOrdered,
  Save,
  Files,
  ArrowUpDown,
  ChevronDown,
  Smartphone,
  Tag,
  FileCheck
} from "lucide-react";
import { ParsedQuestion, CategoryNode, SubCategoryNode, TopicNode, TestMeta } from "../types";
import { parseTestTextWithMeta, ParsedTestMeta, formatQuestionsToTxt } from "../utils/parser";
import { TestQuestionCardEditor } from "./TestQuestionCardEditor";

export interface BulkTestUpdateEntry {
  targetNodeId: string;
  targetType: "category" | "subcategory" | "topic";
  lang: string;
  questions: ParsedQuestion[];
  meta?: ParsedTestMeta;
  action: "replace" | "append";
  applyMetaTitle: boolean;
  fileName?: string;
}

export interface TestCatalogItem {
  id: string;
  name: string;
  type: "category" | "subcategory" | "topic";
  path: string;
  test: TestMeta;
  questionsEnCount: number;
  questionsHiCount: number;
  totalQuestionsCount: number;
}

interface TestUpdaterModalProps {
  isOpen: boolean;
  categories: CategoryNode[];
  initialNodeId?: string;
  initialNodeType?: "category" | "subcategory" | "topic";
  initialLang?: string;
  onClose: () => void;
  onSaveIndividualTest: (payload: {
    nodeId: string;
    type: "category" | "subcategory" | "topic";
    lang: string;
    questions: ParsedQuestion[];
    meta?: ParsedTestMeta;
    action: "replace" | "append";
    applyMetaTitle: boolean;
  }) => void;
  onSaveBulkTests: (entries: BulkTestUpdateEntry[]) => void;
  onOpenFormatGuide?: () => void;
}

export const TestUpdaterModal: React.FC<TestUpdaterModalProps> = ({
  isOpen,
  categories = [],
  initialNodeId,
  initialNodeType = "category",
  initialLang = "en",
  onClose,
  onSaveIndividualTest,
  onSaveBulkTests,
  onOpenFormatGuide
}) => {
  // Main Modal Tab: "individual" | "bulk"
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");

  // Flattened test catalog from categories
  const testCatalog: TestCatalogItem[] = useMemo(() => {
    const list: TestCatalogItem[] = [];

    const traverse = (
      node: CategoryNode | SubCategoryNode | TopicNode,
      nodeType: "category" | "subcategory" | "topic",
      currentPath: string
    ) => {
      const nodeName = node.name || "Untitled";
      const fullPath = currentPath ? `${currentPath} > ${nodeName}` : nodeName;

      if (node.test && node.test.id) {
        const enCount = node.test.questionsEn?.length || 0;
        const hiCount = node.test.questionsHi?.length || 0;
        const othersCount = Object.values(node.test.questionsOther || {}).reduce(
          (sum, arr) => sum + (arr ? arr.length : 0),
          0
        );

        list.push({
          id: node.id,
          name: nodeName,
          type: nodeType,
          path: fullPath,
          test: node.test,
          questionsEnCount: enCount,
          questionsHiCount: hiCount,
          totalQuestionsCount: enCount + hiCount + othersCount
        });
      }

      if ("subCategories" in node && Array.isArray(node.subCategories)) {
        node.subCategories.forEach(sub => traverse(sub, "subcategory", fullPath));
      }

      if ("topics" in node && Array.isArray(node.topics)) {
        node.topics.forEach(top => traverse(top, "topic", fullPath));
      }
    };

    categories.forEach(cat => traverse(cat, "category", ""));
    return list;
  }, [categories]);

  // ==========================================
  // INDIVIDUAL TEST STATE
  // ==========================================
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>(initialLang || "en");
  const [individualEditMode, setIndividualEditMode] = useState<"visual" | "raw" | "upload">("visual");
  const [individualQuestions, setIndividualQuestions] = useState<ParsedQuestion[]>([]);
  const [rawText, setRawText] = useState<string>("");
  const [rawTextError, setRawTextError] = useState<string>("");
  const [individualAction, setIndividualAction] = useState<"replace" | "append">("replace");
  const [applyMetaTitle, setApplyMetaTitle] = useState<boolean>(true);
  const [testSearchFilter, setTestSearchFilter] = useState<string>("");
  const [activeMeta, setActiveMeta] = useState<ParsedTestMeta>({});
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState<boolean>(false);

  // ==========================================
  // BULK TEST STATE
  // ==========================================
  const [bulkMode, setBulkMode] = useState<"multifile" | "mastersplit" | "catalog_stepper">("multifile");

  // Bulk Multi-File Upload
  interface MultiFileItem {
    id: string;
    file: File;
    fileName: string;
    questions: ParsedQuestion[];
    meta: ParsedTestMeta;
    targetNodeId: string;
    targetType: "category" | "subcategory" | "topic";
    action: "replace" | "append";
  }
  const [multiFiles, setMultiFiles] = useState<MultiFileItem[]>([]);
  const [editingFileItem, setEditingFileItem] = useState<MultiFileItem | null>(null);

  // Bulk Master Split
  const [masterRawText, setMasterRawText] = useState<string>("");
  const [masterSplitCount, setMasterSplitCount] = useState<number>(50);
  const [masterBaseTitle, setMasterBaseTitle] = useState<string>("Set");
  const [masterParsedSets, setMasterParsedSets] = useState<Array<{
    title: string;
    questions: ParsedQuestion[];
    targetNodeId?: string;
  }>>([]);
  const [editingMasterSetIdx, setEditingMasterSetIdx] = useState<number | null>(null);

  // Bulk Catalog Stepper
  const [catalogStepperIdx, setCatalogStepperIdx] = useState<number>(0);

  // Initialize selected test when modal opens
  useEffect(() => {
    if (isOpen) {
      setSaveSuccessMsg("");
      let initialTarget = testCatalog.find(t => t.id === initialNodeId);
      if (!initialTarget && testCatalog.length > 0) {
        initialTarget = testCatalog[0];
      }

      if (initialTarget) {
        setSelectedCatalogId(initialTarget.id);
        loadTestQuestions(initialTarget, initialLang || "en");
      }
    }
  }, [isOpen, initialNodeId, initialLang, testCatalog]);

  // Load questions for a target test into individual state
  const loadTestQuestions = (item: TestCatalogItem, lang: string) => {
    let qs: ParsedQuestion[] = [];
    if (lang === "en") {
      qs = [...(item.test.questionsEn || [])];
    } else if (lang === "hi") {
      qs = [...(item.test.questionsHi || [])];
    } else {
      qs = [...((item.test.questionsOther && item.test.questionsOther[lang]) || [])];
    }

    setIndividualQuestions(qs);
    const metaObj: ParsedTestMeta = {
      title: item.test.title || item.name,
      id: item.test.id,
      duration: item.test.duration,
      posMarks: item.test.posMarks,
      negMarks: item.test.negMarks,
      positiveMarks: item.test.posMarks,
      negativeMarks: item.test.negMarks
    };
    setActiveMeta(metaObj);

    // Format to raw text
    const formatted = formatQuestionsToTxt(qs, {
      title: item.test.title || item.name,
      duration: item.test.duration,
      positiveMarks: item.test.posMarks,
      negativeMarks: item.test.negMarks,
      instructions: item.test.instructions
    });
    setRawText(formatted);
    setRawTextError("");
  };

  // When selected catalog item or language changes
  const handleSelectCatalogItem = (id: string, lang = selectedLang) => {
    setSelectedCatalogId(id);
    setMobileCatalogOpen(false); // Auto-close bottom sheet on mobile
    const found = testCatalog.find(t => t.id === id);
    if (found) {
      loadTestQuestions(found, lang);
    }
  };

  const handleSelectLang = (lang: string) => {
    setSelectedLang(lang);
    const found = testCatalog.find(t => t.id === selectedCatalogId);
    if (found) {
      loadTestQuestions(found, lang);
    }
  };

  // Sync questions from visual editor
  const handleVisualQuestionsChange = (updated: ParsedQuestion[]) => {
    setIndividualQuestions(updated);
    // Keep raw text in sync
    const currentTarget = testCatalog.find(t => t.id === selectedCatalogId);
    const formatted = formatQuestionsToTxt(updated, {
      title: activeMeta.title || currentTarget?.name,
      duration: currentTarget?.test.duration,
      positiveMarks: currentTarget?.test.posMarks,
      negativeMarks: currentTarget?.test.negMarks
    });
    setRawText(formatted);
  };

  // Sync questions from raw text editor
  const handleParseRawText = () => {
    if (!rawText.trim()) {
      setIndividualQuestions([]);
      setRawTextError("");
      return;
    }
    const res = parseTestTextWithMeta(rawText);
    if (res.questions.length === 0) {
      setRawTextError("Could not detect any valid questions in this text. Please check format.");
      return;
    }
    setRawTextError("");
    setIndividualQuestions(res.questions);
    if (res.meta && Object.keys(res.meta).length > 0) {
      setActiveMeta(prev => ({ ...prev, ...res.meta }));
    }
  };

  // Quick keyboard snippet helper for Raw .txt mode on mobile
  const handleInsertRawSnippet = (snippet: string) => {
    setRawText(prev => {
      if (!prev) return snippet + "\n";
      return prev + (prev.endsWith("\n") ? "" : "\n") + snippet;
    });
  };

  // Handle uploaded file for individual mode
  const handleIndividualFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || "";
      const parsed = parseTestTextWithMeta(content);
      if (parsed.questions.length > 0) {
        if (individualAction === "append") {
          setIndividualQuestions(prev => [...prev, ...parsed.questions]);
        } else {
          setIndividualQuestions(parsed.questions);
        }
        if (parsed.meta && Object.keys(parsed.meta).length > 0) {
          setActiveMeta(parsed.meta);
        }
        setRawText(content);
        setIndividualEditMode("visual");
      } else {
        alert("Failed to parse questions from uploaded .txt file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Save Individual Test
  const handleSaveIndividualTest = () => {
    const target = testCatalog.find(t => t.id === selectedCatalogId);
    if (!target) {
      alert("No target test selected to update.");
      return;
    }

    onSaveIndividualTest({
      nodeId: target.id,
      type: target.type,
      lang: selectedLang,
      questions: individualQuestions,
      meta: activeMeta,
      action: individualAction,
      applyMetaTitle
    });

    setSaveSuccessMsg(`Saved! Updated ${individualQuestions.length} Qs in "${target.name}".`);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  // Download current questions as clean .txt
  const handleDownloadTxt = () => {
    const currentTarget = testCatalog.find(t => t.id === selectedCatalogId);
    const content = formatQuestionsToTxt(individualQuestions, {
      title: activeMeta.title || currentTarget?.name || "Mock Test",
      duration: currentTarget?.test.duration,
      positiveMarks: currentTarget?.test.posMarks,
      negativeMarks: currentTarget?.test.negMarks,
      instructions: currentTarget?.test.instructions
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentTarget?.name || "Test").replace(/[^a-zA-Z0-9_-]/g, "_")}_${selectedLang.toUpperCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // BULK MULTI-FILE HANDLERS
  // ==========================================
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MultiFileItem[] = [];
    let processed = 0;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || "";
        const parsed = parseTestTextWithMeta(text);

        const cleanName = file.name.replace(/\.txt$/i, "").toLowerCase();
        let matchedTarget = testCatalog.find(t => t.name.toLowerCase() === cleanName);
        if (!matchedTarget) {
          const numMatch = cleanName.match(/\b(?:set|test|part|mock)?\s*(\d+)\b/i);
          if (numMatch) {
            const num = numMatch[1];
            matchedTarget = testCatalog.find(t => {
              const tNum = t.name.match(/\b(?:set|test|part|mock)?\s*(\d+)\b/i);
              return tNum && tNum[1] === num;
            });
          }
        }

        const target = matchedTarget || testCatalog[newItems.length % (testCatalog.length || 1)];

        newItems.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          fileName: file.name,
          questions: parsed.questions,
          meta: parsed.meta || {},
          targetNodeId: target ? target.id : "",
          targetType: target ? target.type : "category",
          action: "replace"
        });

        processed++;
        if (processed === files.length) {
          setMultiFiles(prev => [...prev, ...newItems]);
        }
      };
      reader.readAsText(file);
    });

    e.target.value = "";
  };

  const removeMultiFileItem = (id: string) => {
    setMultiFiles(prev => prev.filter(item => item.id !== id));
  };

  const updateMultiFileItemTarget = (id: string, targetId: string) => {
    const target = testCatalog.find(t => t.id === targetId);
    if (!target) return;
    setMultiFiles(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, targetNodeId: target.id, targetType: target.type }
          : item
      )
    );
  };

  const updateMultiFileItemAction = (id: string, action: "replace" | "append") => {
    setMultiFiles(prev =>
      prev.map(item => (item.id === id ? { ...item, action } : item))
    );
  };

  const handleSaveFileItemEdits = (updatedQuestions: ParsedQuestion[]) => {
    if (!editingFileItem) return;
    setMultiFiles(prev =>
      prev.map(item =>
        item.id === editingFileItem.id
          ? { ...item, questions: updatedQuestions }
          : item
      )
    );
    setEditingFileItem(null);
  };

  const handleCommitBulkMultiFiles = () => {
    const validEntries: BulkTestUpdateEntry[] = [];
    multiFiles.forEach(item => {
      if (item.targetNodeId && item.questions.length > 0) {
        validEntries.push({
          targetNodeId: item.targetNodeId,
          targetType: item.targetType,
          lang: selectedLang,
          questions: item.questions,
          meta: item.meta,
          action: item.action,
          applyMetaTitle: true,
          fileName: item.fileName
        });
      }
    });

    if (validEntries.length === 0) {
      alert("No valid files with assigned target tests to commit.");
      return;
    }

    onSaveBulkTests(validEntries);
    setMultiFiles([]);
    setSaveSuccessMsg(`Bulk Update Complete! Successfully updated ${validEntries.length} tests.`);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  // ==========================================
  // BULK MASTER SPLIT HANDLERS
  // ==========================================
  const handleParseMasterSplit = () => {
    if (!masterRawText.trim()) {
      alert("Please paste master .txt content.");
      return;
    }
    const parsed = parseTestTextWithMeta(masterRawText);
    if (parsed.questions.length === 0) {
      alert("No valid questions detected in master text.");
      return;
    }

    const chunkCount = Math.max(1, masterSplitCount);
    const sets: Array<{
      title: string;
      questions: ParsedQuestion[];
      targetNodeId?: string;
    }> = [];

    for (let i = 0; i < parsed.questions.length; i += chunkCount) {
      const chunk = parsed.questions.slice(i, i + chunkCount);
      const setIdx = Math.floor(i / chunkCount) + 1;
      const setQ = chunk.map(q => ({
        ...q,
        q: q.q.replace(/^(?:Q\s*)?\d+[\.\)\-:]\s*/i, "")
      }));

      sets.push({
        title: `${masterBaseTitle} ${setIdx}`,
        questions: setQ
      });
    }

    setMasterParsedSets(sets);
  };

  const handleCommitMasterSplit = () => {
    if (masterParsedSets.length === 0) {
      alert("No split sets generated.");
      return;
    }

    const entries: BulkTestUpdateEntry[] = [];
    masterParsedSets.forEach((s, idx) => {
      const target = s.targetNodeId
        ? testCatalog.find(t => t.id === s.targetNodeId)
        : testCatalog[idx % (testCatalog.length || 1)];

      if (target) {
        entries.push({
          targetNodeId: target.id,
          targetType: target.type,
          lang: selectedLang,
          questions: s.questions,
          meta: { title: s.title },
          action: "replace",
          applyMetaTitle: true
        });
      }
    });

    if (entries.length === 0) {
      alert("Please map sets to target tests.");
      return;
    }

    onSaveBulkTests(entries);
    setMasterParsedSets([]);
    setMasterRawText("");
    setSaveSuccessMsg(`Master Split Complete! Distributed ${entries.length} sets.`);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  // Filter catalog list for search
  const filteredCatalog = useMemo(() => {
    if (!testSearchFilter) return testCatalog;
    const q = testSearchFilter.toLowerCase();
    return testCatalog.filter(
      t => t.name.toLowerCase().includes(q) || t.path.toLowerCase().includes(q)
    );
  }, [testCatalog, testSearchFilter]);

  const activeTargetItem = useMemo(() => {
    return testCatalog.find(t => t.id === selectedCatalogId);
  }, [testCatalog, selectedCatalogId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden animate-fade-in touch-pan-y">
      {/* Mobile Fullscreen App Window */}
      <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-gray-200 w-full max-w-7xl h-[100dvh] sm:h-[94vh] max-h-[100dvh] sm:max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* ========================================================================= */}
        {/* NATIVE-LIKE MOBILE APP HEADER */}
        {/* ========================================================================= */}
        <div className="bg-white border-b border-gray-200 shrink-0 z-20">
          {/* Top Bar */}
          <div className="px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-base font-black text-gray-900 tracking-tight truncate">
                    Update Test .txt Studio
                  </h2>
                  <span className="hidden xs:inline px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase">
                    v2 Mobile
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium truncate hidden sm:block">
                  Edit, preview, and update test series with zero friction
                </p>
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center gap-1.5">
              {/* Language Selector in Header */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-gray-200">
                {["en", "hi"].map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleSelectLang(l)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      selectedLang === l
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {onOpenFormatGuide && (
                <button
                  type="button"
                  onClick={onOpenFormatGuide}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                  <span>Guide</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
                title="Close Studio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tab Bar (Individual vs Bulk) */}
          <div className="px-3 sm:px-6 pb-2 sm:pb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl sm:rounded-2xl border border-gray-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("individual")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "individual"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                <span>Individual Test</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "bulk"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Files className="w-3.5 h-3.5 shrink-0" />
                <span>Bulk Updater</span>
              </button>
            </div>

            {/* Mobile Active Target Chip (Tap to open Test Picker Drawer) */}
            {activeTab === "individual" && (
              <button
                type="button"
                onClick={() => setMobileCatalogOpen(true)}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer active:scale-95 max-w-[170px]"
              >
                <span className="truncate">{activeTargetItem?.name || "Pick Test"}</span>
                <ChevronDown className="w-3 h-3 shrink-0 text-blue-500" />
              </button>
            )}
          </div>
        </div>

        {/* Global Save Alert Toast */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-3 sm:px-6 py-2 text-xs font-bold flex items-center justify-between shrink-0 shadow-md animate-slide-down">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg("")} className="hover:opacity-80 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: INDIVIDUAL TEST UPDATER */}
        {/* ========================================================================= */}
        {activeTab === "individual" && (
          <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Desktop Left Sidebar: Catalog Test Selector (Hidden on mobile) */}
            <div className="hidden md:flex w-72 lg:w-80 bg-slate-50 border-r border-gray-200 flex-col shrink-0 overflow-hidden">
              <div className="p-3 border-b border-gray-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                    Tests Catalog ({testCatalog.length})
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search test name..."
                    value={testSearchFilter}
                    onChange={(e) => setTestSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none"
                  />
                  {testSearchFilter && (
                    <button
                      type="button"
                      onClick={() => setTestSearchFilter("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Tests List */}
              <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-2 space-y-1.5"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {filteredCatalog.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs font-medium">
                    No tests found matching search.
                  </div>
                ) : (
                  filteredCatalog.map(item => {
                    const isSelected = item.id === selectedCatalogId;
                    const count = selectedLang === "hi" ? item.questionsHiCount : item.questionsEnCount;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectCatalogItem(item.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/90 border-blue-400 shadow-xs ring-1 ring-blue-400/40"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                            count > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500"
                          }`}>
                            {count} Qs
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                          {item.path}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {activeTargetItem && (
                <div className="p-2.5 bg-white border-t border-gray-200 text-xs space-y-0.5 shrink-0">
                  <div className="flex justify-between font-bold text-gray-800 text-[11px]">
                    <span>Duration:</span>
                    <span>{activeTargetItem.test.duration || 30} mins</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[10px]">
                    <span>Marks Scheme:</span>
                    <span>+{activeTargetItem.test.posMarks || 1} / -{activeTargetItem.test.negMarks || 0}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom-Sheet Drawer for Test Selection */}
            {mobileCatalogOpen && (
              <div className="md:hidden absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
                <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[85%] flex flex-col overflow-hidden animate-slide-up">
                  {/* Drawer Header */}
                  <div className="p-3.5 border-b border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                          Select Test to Update ({testCatalog.length})
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileCatalogOpen(false)}
                        className="p-1 rounded-lg bg-gray-100 text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search test name or topic..."
                        value={testSearchFilter}
                        onChange={(e) => setTestSearchFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none"
                      />
                      {testSearchFilter && (
                        <button
                          type="button"
                          onClick={() => setTestSearchFilter("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drawer Test List */}
                  <div
                    className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-2 space-y-1.5 touch-pan-y"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {filteredCatalog.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs font-medium">
                        No tests match search.
                      </div>
                    ) : (
                      filteredCatalog.map(item => {
                        const isSelected = item.id === selectedCatalogId;
                        const count = selectedLang === "hi" ? item.questionsHiCount : item.questionsEnCount;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectCatalogItem(item.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? "bg-blue-50 border-blue-400 shadow-xs ring-1 ring-blue-400"
                                : "bg-white border-gray-200 active:bg-slate-50"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                {item.path}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                count > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500"
                              }`}>
                                {count} Qs
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Editor Center Section */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
              
              {/* Active Test Subheader & Sub-view Controls */}
              <div className="px-2.5 sm:px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70 shrink-0">
                <div className="min-w-0 flex items-center gap-1.5 sm:gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 truncate">
                        {activeTargetItem?.name || "Select a Test"}
                      </h3>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded text-[9px] font-black uppercase shrink-0">
                        {selectedLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate hidden xs:block">
                      {activeTargetItem?.path}
                    </p>
                  </div>
                </div>

                {/* Sub-view segmented switcher: Visual Cards vs Raw .txt vs Upload */}
                <div className="flex items-center gap-1 flex-wrap">
                  <div className="flex items-center p-0.5 bg-white rounded-xl border border-gray-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setIndividualEditMode("visual")}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                        individualEditMode === "visual"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Visual Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndividualEditMode("raw")}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                        individualEditMode === "raw"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Raw .txt
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndividualEditMode("upload")}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                        individualEditMode === "upload"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Upload .txt
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-gray-200 bg-white transition-all cursor-pointer shadow-xs"
                    title="Export as .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeTargetItem) {
                        loadTestQuestions(activeTargetItem, selectedLang);
                      }
                    }}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-gray-200 bg-white transition-all cursor-pointer shadow-xs"
                    title="Reload original test questions"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-view Content Area */}
              <div className="flex-1 min-h-0 overflow-hidden p-1.5 sm:p-3">
                {/* 1. VISUAL CARDS VIEW */}
                {individualEditMode === "visual" && (
                  <TestQuestionCardEditor
                    questions={individualQuestions}
                    onChange={handleVisualQuestionsChange}
                    lang={selectedLang}
                  />
                )}

                {/* 2. RAW .TXT MONOSPACE EDITOR */}
                {individualEditMode === "raw" && (
                  <div className="flex flex-col h-full min-h-0 space-y-2">
                    <div className="flex items-center justify-between text-xs shrink-0 flex-wrap gap-1">
                      <span className="font-bold text-gray-700 text-[11px] sm:text-xs">
                        Raw .txt Editor ({individualQuestions.length} Qs detected):
                      </span>
                      <button
                        type="button"
                        onClick={handleParseRawText}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer text-xs active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Parse & Validate</span>
                      </button>
                    </div>

                    {/* Mobile Quick-Insert Keyboard Ribbon */}
                    <div className="bg-slate-100 p-1.5 rounded-xl border border-gray-200 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                      <span className="text-[10px] font-black uppercase text-gray-400 pl-1 shrink-0">Insert:</span>
                      {[
                        { label: "(A)", val: "(A) " },
                        { label: "(B)", val: "(B) " },
                        { label: "(C)", val: "(C) " },
                        { label: "(D)", val: "(D) " },
                        { label: "Ans: (A)", val: "Answer: (A)" },
                        { label: "OA Block", val: "\nOption Analysis:\n(A) \n(B) \n(C) \n(D) \n" },
                        { label: "Explanation:", val: "Explanation: " },
                        { label: "Title:", val: "Title: Test Title" },
                        { label: "Duration:", val: "Duration: 30" }
                      ].map((chip, chipIdx) => (
                        <button
                          key={chipIdx}
                          type="button"
                          onClick={() => handleInsertRawSnippet(chip.val)}
                          className="px-2 py-1 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    {rawTextError && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-2 text-xs font-bold text-rose-800 flex items-center gap-2 shrink-0">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{rawTextError}</span>
                      </div>
                    )}

                    <textarea
                      value={rawText}
                      onChange={(e) => {
                        setRawText(e.target.value);
                        setRawTextError("");
                      }}
                      placeholder="Title: Practice Set 1&#10;&#10;1. Question text here...&#10;(A) Option 1&#10;(B) Option 2&#10;(C) Option 3&#10;(D) Option 4&#10;Answer: (A)&#10;Explanation: Solution here..."
                      className="flex-1 min-h-0 w-full bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-3 rounded-2xl border border-slate-800 focus:border-blue-500 outline-none resize-none leading-relaxed overflow-y-auto overscroll-y-contain touch-pan-y"
                      style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                    />
                  </div>
                )}

                {/* 3. UPLOAD / REPLACE FROM FILE */}
                {individualEditMode === "upload" && (
                  <div
                    className="flex-1 min-h-0 h-full overflow-y-auto overscroll-y-contain touch-pan-y p-3 sm:p-6"
                    style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                  >
                    <div className="flex flex-col items-center justify-center min-h-full max-w-xl mx-auto space-y-4 text-center py-2">
                      <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-3xl p-5 sm:p-8 w-full transition-all bg-slate-50/50 flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-gray-900">
                          Upload .txt for "{activeTargetItem?.name}"
                        </h4>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-xs">
                          Select a prepared .txt file to load questions instantly into the editor.
                        </p>

                        <label className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95">
                          <Upload className="w-4 h-4" />
                          <span>Browse .txt File</span>
                          <input
                            type="file"
                            accept=".txt"
                            onChange={handleIndividualFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Mode Choice: Replace vs Append */}
                      <div className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-left space-y-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          Upload Strategy
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setIndividualAction("replace")}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                              individualAction === "replace"
                                ? "bg-white border-blue-500 ring-2 ring-blue-500/20 text-blue-900 shadow-xs"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>Replace Existing</span>
                              {individualAction === "replace" && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                            <p className="text-[10px] font-normal text-gray-500 mt-0.5">
                              Overwrites all current questions in this test.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIndividualAction("append")}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                              individualAction === "append"
                                ? "bg-white border-blue-500 ring-2 ring-blue-500/20 text-blue-900 shadow-xs"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>Append to Existing</span>
                              {individualAction === "append" && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                            <p className="text-[10px] font-normal text-gray-500 mt-0.5">
                              Adds uploaded questions at the end of current ones.
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="bg-slate-50 px-3 sm:px-5 py-2.5 border-t border-gray-200 flex items-center justify-between gap-2 shrink-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-xs font-black text-gray-800 shadow-xs">
                    {individualQuestions.length} Qs
                  </div>
                  <label className="flex items-center gap-1 text-[11px] text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyMetaTitle}
                      onChange={(e) => setApplyMetaTitle(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="hidden xs:inline">Sync Title</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveIndividualTest}
                    className="px-4 sm:px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save ({individualQuestions.length} Qs)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BULK TESTS UPDATER */}
        {/* ========================================================================= */}
        {activeTab === "bulk" && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-50/50">
            {/* Bulk Sub-Method Switcher */}
            <div className="bg-white px-3 sm:px-6 py-2 border-b border-gray-200 flex items-center justify-between gap-2 shrink-0 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setBulkMode("multifile")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bulkMode === "multifile"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <Files className="w-3.5 h-3.5" />
                  <span>1. Multi-Files</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkMode("mastersplit")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bulkMode === "mastersplit"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>2. Splitter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkMode("catalog_stepper")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    bulkMode === "catalog_stepper"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>3. Rapid Stepper</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-gray-400 uppercase hidden sm:block">
                Target Lang: {selectedLang.toUpperCase()}
              </span>
            </div>

            {/* BULK METHOD 1: MULTI-FILE BATCH */}
            {bulkMode === "multifile" && (
              <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-3 sm:p-6 space-y-4 touch-pan-y"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Upload Zone */}
                <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-3xl p-5 text-center bg-white transition-all shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Files className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-gray-900">
                    Upload Multiple .txt Files
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 max-w-sm mx-auto">
                    Select files (Set 1.txt, Set 2.txt). Auto-mapped to catalog tests with review.
                  </p>

                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Select Multiple .txt Files</span>
                    <input
                      type="file"
                      accept=".txt"
                      multiple
                      onChange={handleMultiFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Queue of uploaded files */}
                {multiFiles.length > 0 && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-xs space-y-3 p-3 sm:p-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs sm:text-sm font-black text-gray-900">
                        Batch Queue ({multiFiles.length} files)
                      </span>

                      <button
                        type="button"
                        onClick={() => setMultiFiles([])}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {multiFiles.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-slate-50 border border-gray-200 rounded-2xl"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-gray-900 truncate">
                                {item.fileName}
                              </h5>
                              <span className="text-[10px] font-bold text-emerald-600">
                                {item.questions.length} Questions
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <select
                              value={item.targetNodeId}
                              onChange={(e) => updateMultiFileItemTarget(item.id, e.target.value)}
                              className="flex-1 sm:flex-initial px-2 py-1 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none max-w-full sm:max-w-xs focus:border-blue-500"
                            >
                              <option value="">-- Target Test --</option>
                              {testCatalog.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>

                            <select
                              value={item.action}
                              onChange={(e) => updateMultiFileItemAction(item.id, e.target.value as any)}
                              className="px-2 py-1 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
                            >
                              <option value="replace">Replace</option>
                              <option value="append">Append</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setEditingFileItem(item)}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeMultiFileItem(item.id)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCommitBulkMultiFiles}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Commit Bulk Updates ({multiFiles.length} Tests)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BULK METHOD 2: MASTER .TXT SPLITTER */}
            {bulkMode === "mastersplit" && (
              <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-3 sm:p-6 space-y-4 touch-pan-y"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-3 sm:p-5 space-y-3 shadow-xs">
                  <h4 className="text-xs sm:text-sm font-black text-gray-900">
                    Master .txt Question Splitter
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Paste master text containing hundreds of questions. It will be divided evenly into sets.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                        Qs Per Set
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="200"
                        value={masterSplitCount}
                        onChange={(e) => setMasterSplitCount(parseInt(e.target.value) || 50)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">
                        Title Prefix
                      </label>
                      <input
                        type="text"
                        value={masterBaseTitle}
                        onChange={(e) => setMasterBaseTitle(e.target.value)}
                        placeholder="e.g. Set"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleParseMasterSplit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                      >
                        <Split className="w-3.5 h-3.5" />
                        <span>Generate Split Sets</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={masterRawText}
                    onChange={(e) => setMasterRawText(e.target.value)}
                    rows={6}
                    placeholder="Paste master .txt content with questions..."
                    className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-2xl border border-slate-800 focus:border-blue-500 outline-none resize-y leading-relaxed"
                  />
                </div>

                {masterParsedSets.length > 0 && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-3 sm:p-5 space-y-3 shadow-xs">
                    <span className="text-xs sm:text-sm font-black text-gray-900">
                      Generated Sets ({masterParsedSets.length} Sets)
                    </span>

                    <div className="space-y-2">
                      {masterParsedSets.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 border border-gray-200 rounded-2xl"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <h5 className="text-xs font-bold text-gray-900">{s.title}</h5>
                              <span className="text-[10px] text-emerald-600 font-bold">
                                {s.questions.length} Questions
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={s.targetNodeId || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMasterParsedSets(prev =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, targetNodeId: val } : item
                                  )
                                );
                              }}
                              className="px-2 py-1 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
                            >
                              <option value="">Auto Sequential Test</option>
                              {testCatalog.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => setEditingMasterSetIdx(idx)}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCommitMasterSplit}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Commit All {masterParsedSets.length} Sets</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BULK METHOD 3: LIVE CATALOG STEPPER */}
            {bulkMode === "catalog_stepper" && (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
                {/* Stepper Navigation Bar */}
                <div className="bg-slate-50 px-3 sm:px-5 py-2 border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = Math.max(0, catalogStepperIdx - 1);
                        setCatalogStepperIdx(nextIdx);
                        const target = testCatalog[nextIdx];
                        if (target) loadTestQuestions(target, selectedLang);
                      }}
                      disabled={catalogStepperIdx === 0}
                      className="p-1 sm:px-2.5 sm:py-1 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold disabled:opacity-30 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <span className="text-xs font-black text-gray-800">
                      Test {catalogStepperIdx + 1} of {testCatalog.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = Math.min(testCatalog.length - 1, catalogStepperIdx + 1);
                        setCatalogStepperIdx(nextIdx);
                        const target = testCatalog[nextIdx];
                        if (target) loadTestQuestions(target, selectedLang);
                      }}
                      disabled={catalogStepperIdx >= testCatalog.length - 1}
                      className="p-1 sm:px-2.5 sm:py-1 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold disabled:opacity-30 flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right truncate">
                    <span className="text-xs font-black text-blue-700 truncate block">
                      {testCatalog[catalogStepperIdx]?.name}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden p-1.5 sm:p-3">
                  <TestQuestionCardEditor
                    questions={individualQuestions}
                    onChange={handleVisualQuestionsChange}
                    lang={selectedLang}
                  />
                </div>

                <div className="bg-slate-50 px-3 sm:px-5 py-2.5 border-t border-gray-200 flex items-center justify-between shrink-0">
                  <span className="text-xs text-gray-500 font-bold truncate">
                    {testCatalog[catalogStepperIdx]?.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const target = testCatalog[catalogStepperIdx];
                      if (!target) return;
                      onSaveIndividualTest({
                        nodeId: target.id,
                        type: target.type,
                        lang: selectedLang,
                        questions: individualQuestions,
                        meta: activeMeta,
                        action: "replace",
                        applyMetaTitle: true
                      });
                      setSaveSuccessMsg(`Saved "${target.name}"!`);
                      if (catalogStepperIdx < testCatalog.length - 1) {
                        const nextIdx = catalogStepperIdx + 1;
                        setCatalogStepperIdx(nextIdx);
                        const nextTarget = testCatalog[nextIdx];
                        if (nextTarget) loadTestQuestions(nextTarget, selectedLang);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Next</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay to inspect/edit questions of a single file in Multi-file batch mode */}
        {editingFileItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl h-[100dvh] sm:h-[88vh] flex flex-col overflow-hidden">
              <div className="px-3 sm:px-5 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 truncate">
                    Editing: {editingFileItem.fileName}
                  </h3>
                  <p className="text-[10px] text-gray-400 truncate">
                    Modify stem, options, or explanation before bulk save.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingFileItem(null)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden p-1.5 sm:p-3">
                <TestQuestionCardEditor
                  questions={editingFileItem.questions}
                  onChange={(updated) => setEditingFileItem({ ...editingFileItem, questions: updated })}
                  lang={selectedLang}
                />
              </div>

              <div className="px-3 sm:px-5 py-2.5 bg-slate-50 border-t border-gray-200 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-700">
                  {editingFileItem.questions.length} questions
                </span>

                <button
                  type="button"
                  onClick={() => handleSaveFileItemEdits(editingFileItem.questions)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Done & Keep Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay to inspect/edit questions of a master set chunk */}
        {editingMasterSetIdx !== null && masterParsedSets[editingMasterSetIdx] && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl h-[100dvh] sm:h-[88vh] flex flex-col overflow-hidden">
              <div className="px-3 sm:px-5 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 truncate">
                    Editing: {masterParsedSets[editingMasterSetIdx].title}
                  </h3>
                  <p className="text-[10px] text-gray-400 truncate">
                    Modify questions before committing split sets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingMasterSetIdx(null)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden p-1.5 sm:p-3">
                <TestQuestionCardEditor
                  questions={masterParsedSets[editingMasterSetIdx].questions}
                  onChange={(updated) => {
                    const idx = editingMasterSetIdx;
                    setMasterParsedSets(prev =>
                      prev.map((item, i) => (i === idx ? { ...item, questions: updated } : item))
                    );
                  }}
                  lang={selectedLang}
                />
              </div>

              <div className="px-3 sm:px-5 py-2.5 bg-slate-50 border-t border-gray-200 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-700">
                  {masterParsedSets[editingMasterSetIdx].questions.length} questions
                </span>

                <button
                  type="button"
                  onClick={() => setEditingMasterSetIdx(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Done & Keep Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
