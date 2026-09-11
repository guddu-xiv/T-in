import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Globe,
  Smartphone,
  Monitor,
  Check,
  Copy,
  Sparkles,
  Star,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Layers,
  FileText,
  RotateCcw,
  Sliders,
  ExternalLink,
  Info,
  Clock,
  HelpCircle,
  Zap,
  CheckCircle
} from "lucide-react";
import { AppConfig, CategoryNode, TestMeta } from "../types";

export interface FlattenedTestInfo {
  id: string;
  title: string;
  categoryName: string;
  subCategoryName?: string;
  topicName?: string;
  duration: number;
  questionsCount: number;
  isPaid?: boolean;
  fullPath: string;
  slug: string;
  posMarks?: number;
  negMarks?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
  rawTest?: TestMeta;
}

export interface SeoGooglePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appConfig: AppConfig;
  onSaveSeo: (
    updatedSeo: NonNullable<AppConfig["seo"]>,
    updatedTestMeta?: { testId: string; seoTitle?: string; seoDescription?: string; seoSlug?: string }
  ) => void;
  initialSelectedTestId?: string;
}

export function extractAllTests(categories: CategoryNode[] = []): FlattenedTestInfo[] {
  const list: FlattenedTestInfo[] = [];

  function toSlug(str: string): string {
    return (str || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  categories.forEach((cat) => {
    if (cat.test) {
      const qCount = cat.test.questionsCount || cat.test.questionsEn?.length || 0;
      list.push({
        id: cat.test.id,
        title: cat.test.title || cat.name,
        categoryName: cat.name,
        duration: cat.test.duration || 60,
        questionsCount: qCount,
        isPaid: cat.test.isPaid,
        fullPath: `${cat.name} › ${cat.test.title || cat.name}`,
        slug: `${toSlug(cat.name)}/${toSlug(cat.test.title || cat.name)}`,
        posMarks: cat.test.posMarks,
        negMarks: cat.test.negMarks,
        seoTitle: cat.test.seoTitle,
        seoDescription: cat.test.seoDescription,
        seoSlug: cat.test.seoSlug,
        rawTest: cat.test,
      });
    }

    (cat.subCategories || []).forEach((sub) => {
      if (sub.test) {
        const qCount = sub.test.questionsCount || sub.test.questionsEn?.length || 0;
        list.push({
          id: sub.test.id,
          title: sub.test.title || sub.name,
          categoryName: cat.name,
          subCategoryName: sub.name,
          duration: sub.test.duration || 60,
          questionsCount: qCount,
          isPaid: sub.test.isPaid,
          fullPath: `${cat.name} › ${sub.name} › ${sub.test.title || sub.name}`,
          slug: `${toSlug(cat.name)}/${toSlug(sub.name)}/${toSlug(sub.test.title || sub.name)}`,
          posMarks: sub.test.posMarks,
          negMarks: sub.test.negMarks,
          seoTitle: sub.test.seoTitle,
          seoDescription: sub.test.seoDescription,
          seoSlug: sub.test.seoSlug,
          rawTest: sub.test,
        });
      }

      (sub.topics || []).forEach((topic) => {
        if (topic.test) {
          const qCount = topic.test.questionsCount || topic.test.questionsEn?.length || 0;
          list.push({
            id: topic.test.id,
            title: topic.test.title || topic.name,
            categoryName: cat.name,
            subCategoryName: sub.name,
            topicName: topic.name,
            duration: topic.test.duration || 60,
            questionsCount: qCount,
            isPaid: topic.test.isPaid,
            fullPath: `${cat.name} › ${sub.name} › ${topic.name} › ${topic.test.title || topic.name}`,
            slug: `${toSlug(cat.name)}/${toSlug(sub.name)}/${toSlug(topic.name)}/${toSlug(topic.test.title || topic.name)}`,
            posMarks: topic.test.posMarks,
            negMarks: topic.test.negMarks,
            seoTitle: topic.test.seoTitle,
            seoDescription: topic.test.seoDescription,
            seoSlug: topic.test.seoSlug,
            rawTest: topic.test,
          });
        }
      });
    });
  });

  return list;
}

export const SeoGooglePreviewModal: React.FC<SeoGooglePreviewModalProps> = ({
  isOpen,
  onClose,
  appConfig,
  onSaveSeo,
  initialSelectedTestId,
}) => {
  if (!isOpen) return null;

  // Flatten all tests from the config
  const allTests = useMemo(() => {
    const list = extractAllTests(appConfig.testCategories || []);
    if (list.length === 0) {
      // Provide an illustrative test if database has no active tests yet
      return [
        {
          id: "sample_test_cgl",
          title: "SSC CGL 2025 Tier 1 Full Mock Test 1",
          categoryName: "SSC ( Staff Selection Commission )",
          subCategoryName: "SSC CGL",
          topicName: "Tier-1 Full Length Series",
          duration: 60,
          questionsCount: 100,
          isPaid: false,
          fullPath: "SSC ( Staff Selection Commission ) › SSC CGL › Full Mock Test 1",
          slug: "ssc/ssc-cgl/tier-1-full-mock-test-1",
          posMarks: 2,
          negMarks: 0.5,
        },
      ];
    }
    return list;
  }, [appConfig.testCategories]);

  // Active selected test
  const [selectedTestId, setSelectedTestId] = useState<string>(() => {
    if (initialSelectedTestId && allTests.some((t) => t.id === initialSelectedTestId)) {
      return initialSelectedTestId;
    }
    return allTests[0]?.id || "homepage";
  });

  // Selected test metadata object
  const currentTest = useMemo(() => {
    return allTests.find((t) => t.id === selectedTestId) || allTests[0];
  }, [allTests, selectedTestId]);

  // Preview Mode: "test" (specific test page) vs "homepage" (portal root)
  const [previewTarget, setPreviewTarget] = useState<"test" | "homepage">("test");

  // Device view mode: Desktop vs Mobile SERP
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  // Mock search query for SERP header simulation
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Editor input states (initialized from current SEO config & test)
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [ratingValue, setRatingValue] = useState<string>("");
  const [reviewCount, setReviewCount] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [testCustomSlug, setTestCustomSlug] = useState<string>("");

  // Toast / Status notification
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<boolean>(false);

  // Sync state when test or target changes
  useEffect(() => {
    const rawSeo = appConfig.seo || {};
    const baseUrl = (rawSeo.canonicalUrl || "https://taiyariya.in").replace(/\/$/, "");
    setCanonicalUrl(baseUrl);
    setRatingValue(rawSeo.schemaRatingValue || "4.9");
    setReviewCount(rawSeo.schemaReviewCount || "1,840");
    setAuthorName(rawSeo.author || appConfig.appName || "Taiyariya");

    if (previewTarget === "homepage") {
      setMetaTitle(rawSeo.metaTitle || `${appConfig.appName} - Elite MCQ Practice & Mock Test Portal`);
      setMetaDescription(
        rawSeo.metaDescription ||
          `Welcome to ${appConfig.appName}. India's leading digital education center for bilingual MCQ practice, simulated online CBT exam portals, offline Blackbooks, and deep analytics.`
      );
      setSearchQuery(`${appConfig.appName} online mock test portal`);
    } else if (currentTest) {
      // Test page preview
      const testTitle =
        currentTest.seoTitle ||
        `${currentTest.title} Online Mock Test - Free Practice Set | ${appConfig.appName}`;
      setMetaTitle(testTitle);

      const testDesc =
        currentTest.seoDescription ||
        `Attempt ${currentTest.title} online CBT exam on ${appConfig.appName}. Features ${currentTest.questionsCount} bilingual MCQs, ${currentTest.duration} mins time limit, instant rank analysis & detailed solutions.`;
      setMetaDescription(testDesc);

      setTestCustomSlug(currentTest.seoSlug || currentTest.slug);
      setSearchQuery(`${currentTest.title} mock test practice`);
    }
  }, [previewTarget, currentTest, appConfig]);

  // Character lengths
  const titleCharCount = metaTitle.length;
  const descCharCount = metaDescription.length;

  // Title validation status
  const titleStatus = useMemo(() => {
    if (titleCharCount === 0) return { label: "Empty", color: "text-rose-500", bar: "bg-rose-500", pct: 0 };
    if (titleCharCount < 30) return { label: "Short (Add keywords)", color: "text-amber-500", bar: "bg-amber-500", pct: (titleCharCount / 60) * 100 };
    if (titleCharCount <= 60) return { label: "Optimal (50-60 chars)", color: "text-emerald-500", bar: "bg-emerald-500", pct: (titleCharCount / 60) * 100 };
    return { label: "Truncated on Google (>60 chars)", color: "text-rose-500", bar: "bg-rose-500", pct: 100 };
  }, [titleCharCount]);

  // Description validation status
  const descStatus = useMemo(() => {
    if (descCharCount === 0) return { label: "Empty", color: "text-rose-500", bar: "bg-rose-500", pct: 0 };
    if (descCharCount < 100) return { label: "A bit short", color: "text-amber-500", bar: "bg-amber-500", pct: (descCharCount / 160) * 100 };
    if (descCharCount <= 160) return { label: "Optimal (120-160 chars)", color: "text-emerald-500", bar: "bg-emerald-500", pct: (descCharCount / 160) * 100 };
    return { label: "Truncated on Google (>160 chars)", color: "text-rose-500", bar: "bg-rose-500", pct: 100 };
  }, [descCharCount]);

  // Calculated displayed URL
  const displayedUrl = useMemo(() => {
    const base = (canonicalUrl || "https://taiyariya.in").replace(/\/$/, "");
    if (previewTarget === "homepage") {
      return base;
    }
    const slug = testCustomSlug || (currentTest ? currentTest.slug : "mock-test");
    return `${base}/tests/${slug}`;
  }, [canonicalUrl, previewTarget, testCustomSlug, currentTest]);

  // Breadcrumbs representation
  const breadcrumbString = useMemo(() => {
    try {
      const urlObj = new URL(displayedUrl);
      const host = urlObj.hostname;
      if (previewTarget === "homepage") {
        return host;
      }
      const parts = urlObj.pathname.split("/").filter(Boolean);
      return `${host} › ${parts.join(" › ")}`;
    } catch {
      return displayedUrl.replace(/^https?:\/\//, "");
    }
  }, [displayedUrl, previewTarget]);

  // Quick Preset Helper for titles
  const applyTitlePreset = (presetType: "exam" | "high_ctr" | "bilingual") => {
    if (!currentTest && previewTarget === "test") return;
    const testName = currentTest?.title || "Mock Test";
    const brand = appConfig.appName || "Taiyariya";

    if (presetType === "exam") {
      setMetaTitle(`${testName} Online Mock Test - Official Exam Pattern | ${brand}`);
    } else if (presetType === "high_ctr") {
      setMetaTitle(`Free ${testName} with Instant Rank, Solutions & PDF - ${brand}`);
    } else if (presetType === "bilingual") {
      setMetaTitle(`${testName} (Hindi & English Bilingual) - CBT Test Series | ${brand}`);
    }
  };

  // Quick Description Generator
  const generateRichDescription = () => {
    if (previewTarget === "test" && currentTest) {
      const brand = appConfig.appName || "Taiyariya";
      const qCount = currentTest.questionsCount || 100;
      const duration = currentTest.duration || 60;
      const pathCategory = currentTest.categoryName || "Competitive Exams";
      setMetaDescription(
        `Practice free ${currentTest.title} for ${pathCategory} on ${brand}. Includes ${qCount} bilingual questions, ${duration} mins timer, instant rank & percentile analytics.`
      );
    } else {
      const brand = appConfig.appName || "Taiyariya";
      setMetaDescription(
        `Join ${brand}, India's premier online preparation portal for SSC, Railways, Banking and State exams with simulated CBT tests, bilingual questions, and verified solutions.`
      );
    }
  };

  // Insert Variable Token into Title or Description
  const insertToken = (field: "title" | "desc", token: string) => {
    if (field === "title") {
      setMetaTitle((prev) => `${prev} ${token}`.trim());
    } else {
      setMetaDescription((prev) => `${prev} ${token}`.trim());
    }
  };

  // Save changes handler
  const handleSave = () => {
    const updatedSeo: NonNullable<AppConfig["seo"]> = {
      ...(appConfig.seo || {}),
      canonicalUrl: canonicalUrl.trim(),
      schemaRatingValue: ratingValue.trim() || "4.9",
      schemaReviewCount: reviewCount.trim() || "1,840",
      author: authorName.trim() || appConfig.appName,
    };

    if (previewTarget === "homepage") {
      updatedSeo.metaTitle = metaTitle.trim();
      updatedSeo.metaDescription = metaDescription.trim();
      onSaveSeo(updatedSeo);
    } else if (currentTest) {
      // Also update test-specific meta
      onSaveSeo(updatedSeo, {
        testId: currentTest.id,
        seoTitle: metaTitle.trim(),
        seoDescription: metaDescription.trim(),
        seoSlug: testCustomSlug.trim() || currentTest.slug,
      });
    }

    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  // Copy Preview snippet to clipboard
  const handleCopySnippet = () => {
    const snippetText = `=== Google Search Snippet Preview ===\nTitle: ${metaTitle}\nURL: ${displayedUrl}\nRating: ★★★★★ ${ratingValue} (${reviewCount} votes)\nDescription: ${metaDescription}\nPublisher: ${authorName}`;
    navigator.clipboard.writeText(snippetText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 md:p-5 overflow-y-auto font-sans animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[94vh] my-auto">
        {/* MODAL HEADER */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-150 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#009CFC]/20 border border-[#009CFC]/40 flex items-center justify-center text-[#009CFC] shadow-sm shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg font-black tracking-tight text-white truncate">
                  Google Search SERP Preview
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> SERP Optimizer
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate sm:whitespace-normal">
                Live interactive simulation of your test page ranking snippet on Google search
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySnippet}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Copy snippet details"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? "Copied!" : "Copy Snippet"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: Target Page Selector & Device Toggle */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Target Page Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#009CFC]" /> Previewing:
            </span>

            <div className="flex items-center bg-white border border-slate-250 rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setPreviewTarget("test")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewTarget === "test"
                    ? "bg-[#009CFC] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Specific Test Page</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTarget("homepage")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewTarget === "homepage"
                    ? "bg-[#009CFC] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portal Homepage</span>
              </button>
            </div>

            {/* Test Dropdown (Only visible when previewTarget is 'test') */}
            {previewTarget === "test" && (
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="bg-white border border-slate-250 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs outline-none focus:border-[#009CFC] max-w-[240px] sm:max-w-xs truncate cursor-pointer"
                >
                  {allTests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.questionsCount} Qs)
                    </option>
                  ))}
                </select>

                <span className="hidden md:inline-flex text-[11px] font-bold text-slate-400">
                  {allTests.length} tests available
                </span>
              </div>
            )}
          </div>

          {/* Desktop vs Mobile Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              SERP View:
            </span>
            <div className="flex items-center bg-white border border-slate-250 rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setDeviceMode("desktop")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  deviceMode === "desktop"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Desktop Google Search View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  deviceMode === "mobile"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Mobile Google Search View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN BODY: 2-Column Split (Left: Quick Editor, Right: Live Google SERP Mockup) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* LEFT COLUMN: QUICK SEO EDITOR (5 Cols) */}
          <div className="lg:col-span-5 p-3.5 sm:p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 space-y-4 sm:space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#009CFC]" /> Quick SEO Snippet Editor
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Updates SERP live</span>
            </div>

            {/* Quick Presets for Test Mode */}
            {previewTarget === "test" && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Quick Title Templates (1-Click)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTitlePreset("exam")}
                    className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-[#009CFC] transition-colors cursor-pointer"
                  >
                    Official Exam Pattern
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTitlePreset("high_ctr")}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    High CTR & Free
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTitlePreset("bilingual")}
                    className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    Bilingual Series
                  </button>
                </div>
              </div>
            )}

            {/* Meta Title Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <span>Google Result Title</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className={`font-bold ${titleStatus.color}`}>{titleCharCount}/60 chars</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Enter title that appears in Google search results"
                  className="w-full bg-white border border-slate-300 focus:border-[#009CFC] focus:ring-2 focus:ring-[#009CFC]/20 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all shadow-xs"
                />
              </div>

              {/* Title Meter Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${titleStatus.bar}`}
                  style={{ width: `${Math.min(titleStatus.pct, 100)}%` }}
                ></div>
              </div>
              <p className={`text-[10px] font-semibold ${titleStatus.color} flex items-center gap-1`}>
                <Info className="w-3 h-3" />
                <span>{titleStatus.label}</span>
              </p>
            </div>

            {/* Meta Description Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <span>Google Snippet Description</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={generateRichDescription}
                    className="text-[10px] font-bold text-[#009CFC] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-generate
                  </button>
                  <span className={`font-mono text-[11px] font-bold ${descStatus.color}`}>
                    {descCharCount}/160 chars
                  </span>
                </div>
              </div>

              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter rich summary displayed under the link in Google"
                className="w-full bg-white border border-slate-300 focus:border-[#009CFC] focus:ring-2 focus:ring-[#009CFC]/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none transition-all shadow-xs resize-none"
              />

              {/* Description Meter Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${descStatus.bar}`}
                  style={{ width: `${Math.min(descStatus.pct, 100)}%` }}
                ></div>
              </div>
              <p className={`text-[10px] font-semibold ${descStatus.color} flex items-center gap-1`}>
                <Info className="w-3 h-3" />
                <span>{descStatus.label}</span>
              </p>
            </div>

            {/* URL Path Segment / Canonical Base */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 block">
                {previewTarget === "test" ? "Test Page URL Slug" : "Canonical Base Domain"}
              </label>
              <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-[#009CFC] focus-within:ring-2 focus-within:ring-[#009CFC]/20 shadow-xs">
                <span className="bg-slate-100 text-slate-500 px-3 py-2 text-[11px] font-mono border-r border-slate-200 select-none">
                  {previewTarget === "test" ? "/tests/" : "https://"}
                </span>
                <input
                  type="text"
                  value={previewTarget === "test" ? testCustomSlug : canonicalUrl.replace(/^https?:\/\//, "")}
                  onChange={(e) => {
                    if (previewTarget === "test") {
                      setTestCustomSlug(e.target.value);
                    } else {
                      setCanonicalUrl(`https://${e.target.value.replace(/^https?:\/\//, "")}`);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs font-mono font-semibold text-slate-800 outline-none"
                  placeholder={previewTarget === "test" ? "ssc/mock-test-1" : "taiyariya.in"}
                />
              </div>
            </div>

            {/* Rich Schema Rating & Reviews Controls */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block">
                  Schema Star Rating
                </label>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={ratingValue}
                    onChange={(e) => setRatingValue(e.target.value)}
                    placeholder="4.9"
                    className="w-full text-xs font-bold text-slate-800 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block">
                  Total Reviews / Votes
                </label>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1.5">
                  <input
                    type="text"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                    placeholder="1,840"
                    className="w-full text-xs font-bold text-slate-800 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">votes</span>
                </div>
              </div>
            </div>

            {/* Quick Variable Insert Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Quick Variable Chips (Click to insert)
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => insertToken("title", appConfig.appName || "Taiyariya")}
                  className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
                >
                  + App Name
                </button>
                {currentTest && (
                  <>
                    <button
                      type="button"
                      onClick={() => insertToken("title", currentTest.title)}
                      className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
                    >
                      + Test Title
                    </button>
                    <button
                      type="button"
                      onClick={() => insertToken("desc", `${currentTest.questionsCount} MCQs`)}
                      className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
                    >
                      + Qs Count
                    </button>
                    <button
                      type="button"
                      onClick={() => insertToken("desc", `${currentTest.duration} mins`)}
                      className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
                    >
                      + Duration
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => insertToken("title", "Free Mock Test")}
                  className="text-[10px] px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md font-medium cursor-pointer transition-colors"
                >
                  + Free Mock Test
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REALISTIC LIVE GOOGLE SERP SIMULATOR (7 Cols) */}
          <div className="lg:col-span-7 p-3.5 sm:p-5 md:p-6 bg-white space-y-5 sm:space-y-6 overflow-y-auto">
            {/* GOOGLE SEARCH BAR HEADER MOCK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Google Search Engine Results Page (SERP)
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {deviceMode === "desktop" ? "Desktop Browser (1200px+)" : "Mobile Device (375px)"}
                </span>
              </div>

              {/* Mock Search Box */}
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-slate-400 rounded-full px-4 py-2.5 shadow-sm transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Simulate a Google user query..."
                  className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <span className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Google</span>
                </div>
              </div>
            </div>

            {/* GOOGLE SEARCH RESULT CARD (Dynamic Desktop vs Mobile view) */}
            {deviceMode === "desktop" ? (
              /* DESKTOP SERP VIEW */
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-xs space-y-3 relative group transition-all">
                {/* 1. Header with Site Favicon & Breadcrumb URL */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-250 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {appConfig.logoUrl ? (
                      <img
                        src={appConfig.logoUrl}
                        alt="Favicon"
                        className="w-5 h-5 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#202124] font-medium leading-none">
                      <span className="font-semibold text-slate-900">{appConfig.appName || "Taiyariya"}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-sm">{displayedUrl}</span>
                    </div>
                    <span className="text-[11px] text-[#4d5156] truncate mt-0.5 font-sans">
                      {breadcrumbString}
                    </span>
                  </div>

                  {/* Three-dots menu icon */}
                  <div className="ml-auto text-slate-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                </div>

                {/* 2. Google Blue Clickable Title */}
                <div>
                  <h3 className="text-[20px] text-[#1a0dab] hover:underline font-normal leading-[1.3] cursor-pointer font-sans tracking-normal line-clamp-1">
                    {metaTitle || "Untitled Test Page - Exam Portal"}
                  </h3>
                </div>

                {/* 3. Structured Data / Rich Star Snippets */}
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-[#202124] text-xs">
                    Rating: {ratingValue || "4.9"}
                  </span>
                  <span className="text-[#4d5156] text-xs">
                    · {reviewCount || "1,840"} reviews
                  </span>
                  <span className="text-[#4d5156] text-xs">
                    · Free
                  </span>
                  {currentTest && (
                    <>
                      <span className="text-[#4d5156] text-xs">·</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {currentTest.duration} mins test
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {currentTest.questionsCount} questions
                      </span>
                    </>
                  )}
                </div>

                {/* 4. Google Snippet Description */}
                <p className="text-[14px] text-[#4d5156] leading-[1.58] line-clamp-2 font-sans">
                  {metaDescription || "No description specified. Write a meta description to attract clicks from search engines."}
                </p>

                {/* 5. Google Sitelinks Quick Links Mockup */}
                <div className="pt-3 border-t border-slate-150 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="text-left">
                    <span className="text-xs text-[#1a0dab] hover:underline font-medium cursor-pointer block truncate">
                      Start Test Now
                    </span>
                    <span className="text-[10px] text-[#4d5156] block truncate">Direct CBT portal launch</span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#1a0dab] hover:underline font-medium cursor-pointer block truncate">
                      Answer Key & Solutions
                    </span>
                    <span className="text-[10px] text-[#4d5156] block truncate">Explanations in Hindi/En</span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#1a0dab] hover:underline font-medium cursor-pointer block truncate">
                      Cutoff & Ranking
                    </span>
                    <span className="text-[10px] text-[#4d5156] block truncate">Live student percentile</span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#1a0dab] hover:underline font-medium cursor-pointer block truncate">
                      All Mock Tests
                    </span>
                    <span className="text-[10px] text-[#4d5156] block truncate">Full syllabus series</span>
                  </div>
                </div>
              </div>
            ) : (
              /* MOBILE SERP VIEW */
              <div className="max-w-sm mx-auto border-2 border-slate-300 rounded-3xl p-4 bg-[#f8f9fa] shadow-md space-y-3">
                {/* Simulated mobile screen header */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 border-b border-slate-200 pb-2">
                  <span className="font-mono font-bold">google.com</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  </div>
                </div>

                {/* Mobile Result Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {appConfig.logoUrl ? (
                        <img src={appConfig.logoUrl} alt="Logo" className="w-4 h-4 object-contain" />
                      ) : (
                        <Globe className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#202124] block truncate">
                        {appConfig.appName || "Taiyariya"}
                      </span>
                      <span className="text-[10px] text-[#4d5156] block truncate">{displayedUrl}</span>
                    </div>
                  </div>

                  <h3 className="text-[16px] font-semibold text-[#1a0dab] leading-[1.3] line-clamp-2">
                    {metaTitle || "Untitled Test Page"}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#4d5156]">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold ml-1 text-slate-800">{ratingValue}</span>
                    </div>
                    <span>({reviewCount})</span>
                    <span>· Free</span>
                    {currentTest && <span>· {currentTest.duration}m</span>}
                  </div>

                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                    {metaDescription || "No description provided."}
                  </p>

                  {/* Mobile Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Online CBT
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Bilingual
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Instant Rank
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SEO QUALITY SCORECARD & DIAGNOSTICS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Google Ranking Readiness
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Title Length</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">{titleCharCount} chars</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        titleCharCount >= 30 && titleCharCount <= 60
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {titleCharCount >= 30 && titleCharCount <= 60 ? "Great" : "Review"}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Snippet Length</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">{descCharCount} chars</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        descCharCount >= 100 && descCharCount <= 160
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {descCharCount >= 100 && descCharCount <= 160 ? "Great" : "Review"}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Structured Schema</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-emerald-600">Active</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      Quiz / Test
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER: ACTION BUTTONS */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-center sm:text-left">
            {saveSuccessNotification ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SEO configuration applied & saved successfully!</span>
              </span>
            ) : (
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Changes will be instantly synced to your live sitemap and Google Search Console tags.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#009CFC] via-[#008AE6] to-[#0077C8] hover:from-[#008AE6] hover:to-[#006BB5] text-white font-extrabold text-xs shadow-md shadow-[#009CFC]/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>Apply & Save SEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
