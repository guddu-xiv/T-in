import { ParsedQuestion } from "../types";

/**
 * Trims ONLY standard ASCII whitespace (spaces, tabs, \r, \n),
 * preserving special Unicode characters like Braille blanks (\u2800)
 * and Variation Selectors (\uFE0F). Also strips Windows UTF-8 BOM (\uFEFF).
 */
export function safeTrim(str: string): string {
  if (!str) return "";
  return str.replace(/^\uFEFF/, "").replace(/^[ \t\r\n\u00A0]+|[ \t\r\n\u00A0]+$/g, "");
}

/**
 * Decodes standard HTML entities (math symbols, Greek letters, degrees, quotes, superscripts)
 * to clean Unicode strings for pristine typesetting and rendering.
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  const entityMap: Record<string, string> = {
    "&deg;": "°",
    "&radic;": "√",
    "&pi;": "π",
    "&Pi;": "Π",
    "&theta;": "θ",
    "&Theta;": "Θ",
    "&phi;": "φ",
    "&Phi;": "Φ",
    "&alpha;": "α",
    "&Alpha;": "Α",
    "&beta;": "β",
    "&Beta;": "Β",
    "&gamma;": "γ",
    "&Gamma;": "Γ",
    "&delta;": "δ",
    "&Delta;": "Δ",
    "&lambda;": "λ",
    "&Lambda;": "Λ",
    "&mu;": "μ",
    "&micro;": "μ",
    "&sigma;": "σ",
    "&Sigma;": "Σ",
    "&tau;": "τ",
    "&omega;": "ω",
    "&Omega;": "Ω",
    "&times;": "×",
    "&middot;": "·",
    "&bull;": "•",
    "&sup2;": "²",
    "&sup3;": "³",
    "&sup1;": "¹",
    "&sup0;": "⁰",
    "&isin;": "∈",
    "&notin;": "∉",
    "&le;": "≤",
    "&ge;": "≥",
    "&ne;": "≠",
    "&plusmn;": "±",
    "&infin;": "∞",
    "&ang;": "∠",
    "&perp;": "⊥",
    "&sim;": "∼",
    "&cong;": "≅",
    "&asymp;": "≈",
    "&approx;": "≈",
    "&equiv;": "≡",
    "&prop;": "∝",
    "&empty;": "∅",
    "&cap;": "∩",
    "&cup;": "∪",
    "&sub;": "⊂",
    "&sup;": "⊃",
    "&sube;": "⊆",
    "&supe;": "⊇",
    "&rarr;": "→",
    "&larr;": "←",
    "&harr;": "↔",
    "&rArr;": "⇒",
    "&lArr;": "⇐",
    "&hArr;": "⇔",
    "&int;": "∫",
    "&sum;": "∑",
    "&prod;": "∏",
    "&part;": "∂",
    "&nabla;": "∇",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&amp;": "&"
  };

  let decoded = str;
  for (const [ent, val] of Object.entries(entityMap)) {
    if (decoded.includes(ent)) {
      decoded = decoded.split(ent).join(val);
    }
  }
  // Decimal numeric entities &#176;
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return _;
    }
  });
  // Hex numeric entities &#xB0;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return _;
    }
  });

  return decoded;
}

export interface ParsedTestMeta {
  title?: string;
  id?: string;
  totalQuestions?: number;
  duration?: number;
  posMarks?: number;
  negMarks?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  instructions?: string;
}

export interface ParseResult {
  meta: ParsedTestMeta;
  questions: ParsedQuestion[];
}

const DIVIDER_REGEX = /^[=\-_*~]{3,}\s*$/;

// Section / Part headers: "### [ PART-1 ] ###", "=== SECTION A ===", "--- Chapter 1 ---", etc.
const SECTION_HEADER_REGEX = /^\s*(?:#+\s*)?(?:\[\s*)?(?:part|section|set|खण्ड|भाग|विषय|chapter)\s*[-_:\d\s\w]+(?:\s*\])?(?:\s*#+)?\s*$/i;

// Alpha Options: (A), [A], A., A), Option A, Opt A, Option (A), Opt (A)
// Strict: NEVER match dash '-' as option separator (which is minus in math), and require start of string or proper prefix
const ALPHA_OPTION_REGEX = /^\s*(?:\(([A-Ea-e])\)|\[([A-Ea-e])\]|(?:Option|opt)\s*[:\-–—]?\s*(?:\(?([A-Ea-e])\)?)[\s.:\)\-–—]*|\bOption\s*\(([A-Ea-e])\)|([A-Ea-e])\s*[.):]\s+)\s*(.*)/i;

// Numeric Options: Parenthesized (1), [1], Option 1, Opt 1, or 1)
const NUMERIC_PAREN_OPTION_REGEX = /^\s*(?:\(([1-5])\)|\[([1-5])\]|(?:Option|opt)\s*[:\-–—]?\s*(?:\(?([1-5])\)?)[\s.:\)\-–—]*|\bOption\s*\(([1-5])\)|\b([1-5])\)\s+)\s*(.*)/i;

// Bare Numeric Options: 1. 2. 3. 4. 5.
const NUMERIC_BARE_OPTION_REGEX = /^\s*([1-5])\s*[.):](?!\d)\s+(.*)/i;

// Hindi / Devanagari Options: (क), (ख), (ग), (घ) or (अ), (ब), (स), (द) or क., ख., ग., घ.
const HINDI_KA_OPTION_REGEX = /^\s*(?:\(([कखगघङ])\)|\[([कखगघङ])\]|(?:विकल्प|ऑप्शन)\s*[:\-–—]?\s*(?:\(?([कखगघङ])\)?)[\s.:\)\-–—]*|([कखगघङ])\s*[.):]\s+)\s*(.*)/i;
const HINDI_A_OPTION_REGEX = /^\s*(?:\(([अबसदय])\)|\[([अबसदय])\]|(?:विकल्प|ऑप्शन)\s*[:\-–—]?\s*(?:\(?([अबसदय])\)?)[\s.:\)\-–—]*|([अबसदय])\s*[.):]\s+)\s*(.*)/i;

const CHECKMARK_REGEX = /[\u2705\u2714\u2611]\uFE0F?|✅|✔️|✔|☑|✓|\[Ans\]|\(Ans\)|\(Correct\)|\[Correct\]|\[✓\]|\(✓\)|\[x\]|\(x\)|\(उत्तर\)|\(सही\)|\(Right\)|\(True\)|\[उत्तर\]|\[सही\]|\[Right\]|\[True\]|(?:\(Ans:?\)|\(उत्तर:?\))/i;
const CHECKMARK_CLEAN_REGEX = /[\u2705\u2714\u2611]\uFE0F?|✅|✔️|✔|☑|✓|\[Ans\]|\(Ans\)|\(Correct\)|\[Correct\]|\[✓\]|\(✓\)|\[x\]|\(x\)|\(उत्तर\)|\(सही\)|\(Right\)|\(True\)|\[उत्तर\]|\[सही\]|\[Right\]|\[True\]|(?:\(Ans:?\)|\(उत्तर:?\))/gi;

// Comprehensive Ans line regex (Ans:, Answer:, Correct Option:, उत्तर:, सही उत्तर:, etc.)
const ANS_LINE_REGEX = /^\s*(?:ans(?:wer)?|correct\s*(?:option|answer|opt)?|right\s*(?:option|answer)?|उत्तर|सही\s*उत्तर|सही\s*विकल्प)\s*[:=\-–—.]*\s*(?:option|विकल्प)?\s*\(?([A-Ea-e1-5कखगघङअबसदय])\)?(?:\s*[\.:\)\-–—]\s*|\s+)?(.*)$/i;

// Explanations: Ex:, Exp:, Explanation:, Sol:, Solution:, व्याख्या:, हल:, etc.
const EXPLANATION_START_REGEX = /^\s*(?:ex(?:planation)?|exp|solution|soln?|हल|समाधान|व्याख्या)\s*[:=\-–—.]\s*/i;

// Option Analysis: Option Analysis:, Options Analysis:, विकल्प विश्लेषण:, Option Explanation:, OA:, etc.
const OPTION_ANALYSIS_START_REGEX = /^\s*(?:option\s*analys[ie]s|options\s*analys[ie]s|विकल्प\s*विश्लेषण|option\s*explanation|oa)\s*[:=\-–—.]?\s*(.*)$/i;

// Sub-language / Bilingual Explanation Header (e.g. [Hindi / हिन्दी व्याख्या]:, [हिन्दी व्याख्या]:, [Hindi Solution]:, [English Explanation]:, etc.)
const BILINGUAL_EXPL_HEADER_REGEX = /^\s*(?:\[\s*(?:Hindi|English|हिन्दी|अंग्रेजी|हल|समाधान|Explanation|Solution)(?:\s*(?:\/|\+|-)\s*(?:Hindi|English|हिन्दी|अंग्रेजी|व्याख्या|समाधान))*\s*(?:व्याख्या|अनुवाद|Solution|Explanation)?\s*\]|(?:Hindi|English|हिन्दी|अंग्रेजी)\s*(?:\/|\+|-)\s*(?:Hindi|English|हिन्दी|अंग्रेजी)?\s*(?:व्याख्या|Explanation|Solution)|(?:हिन्दी|अंग्रेजी)\s*व्याख्या|\[\s*(?:व्याख्या|हल|समाधान|Explanation|Solution)\s*\])\s*[:=\-–—.]?\s*(.*)$/i;

// Source: Source:, Ref:, Exam:, Paper:, स्रोत:, संदर्भ:, etc.
const SOURCE_START_REGEX = /^\s*(?:source|स्रोत|ref(?:erence)?|exam|paper|वर्ष|परीक्षा|संदर्भ)\s*[:=\-–—.]\s*(.*)$/i;

// Image: Image:, Img:, Photo:, चित्र:, फोटो:, etc.
const IMAGE_START_REGEX = /^\s*(?:image|img|चित्र|photo|फोटो)\s*[:=\-–—.]\s*(.*)$/i;

// Question numbers: Q1., Q.1., Que 1., Question 1., प्रश्न 1., प्र. 1., 1., (1), (Q1), **Q1.**, etc.
const QUESTION_NUMBER_REGEX = /^\s*(?:\*\*)?(?:#+\s*)?(?:Q|q|Question|Que|Ques|q\.|que\.|प्रश्न|प्र\.|प्र)\s*[:\-–—.]?\s*(\d+)[\s.)\-–—:]+(?:\*\*)?\s*/i;
// Bare question number regex: e.g. "1. Question text", "1) Question text", "1: Question text"
// STRICT: Requires a punctuation delimiter (. ) : -), NOT just space.
// Disallows decimals (1.5, 0.26) via (?!\d).
// Requires whitespace after delimiter followed by non-empty question text.
const STANDALONE_NUMBER_REGEX = /^\s*(?:\*\*)?(?:#+\s*)?(?:(?:\((\d{1,5})\))|(?:\[(\d{1,5})\])|(\d{1,5})\s*[\.):\-–—](?!\d))\s*(?:\*\*)?\s+(?!\s)(.+)$/;

// Regex to safely split multiple options on a single line (e.g. "(A) 10 (B) 20" or "A. 5/2 B. 3/2")
// STRICT: Only splits when multiple option markers genuinely appear on the same line
const MULTI_OPT_SPLIT_REGEX = /\s+(?=(?:\([A-Ea-e1-5कखगघङअबसदय]\)|\[[A-Ea-e1-5कखगघङअबसदय]\]|\b[A-Ea-e1-5]\s*[.):]|\b(?:Option|Opt|विकल्प|ऑप्शन)\s*\(?[A-Ea-e1-5]\)?[:.\-–—\s]))/gi;

/**
 * Strips bracketed source/exam tags (e.g. [CHSL, 15 Nov 2025, Shift 2], [SSC CGL 2024], [DP HCM])
 * from the question text so it doesn't appear inside the question body,
 * and extracts the source text if not already provided separately.
 */
export function stripBracketSourceFromQuestion(raw: string): { cleanedQuestion: string; extractedSource?: string } {
  if (!raw) return { cleanedQuestion: "" };
  let str = raw;
  let detectedSource: string | undefined = undefined;

  // Match all [ ... ] brackets (single or multiline)
  const bracketRegex = /\[([\s\S]*?)\]/g;
  let match: RegExpExecArray | null;
  const toRemove: string[] = [];

  while ((match = bracketRegex.exec(str)) !== null) {
    const fullMatch = match[0];
    const inner = match[1].replace(/\s+/g, " ").trim();

    // Check if inner content looks like exam metadata, shift, year, or trailing source
    const isExamKeywords = /(?:CHSL|CGL|SSC|MTS|GD|CPO|RRB|NTPC|CDS|NDA|IBPS|SBI|UPSC|Tier|Shift|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\b20\d\d\b|Paper|Exam|Set|Shift|Tier|स्रोत|परीक्षा|वर्ष|Constable|Police|Steno|Phase|DP\s*HCM|Ref|Held\s*on)/i.test(inner);
    const isTrailingOrStandalone = str.trim().endsWith(fullMatch) || str.trim().startsWith(fullMatch);
    const hasSourcePunctuation = (inner.includes(",") || inner.includes("-") || /\d/.test(inner)) && inner.length > 2;

    if (isExamKeywords || isTrailingOrStandalone || hasSourcePunctuation || inner.length > 3) {
      if (!detectedSource && inner.length > 1) {
        detectedSource = inner;
      }
      toRemove.push(fullMatch);
    }
  }

  for (const item of toRemove) {
    str = str.replace(item, "");
  }

  // Clean trailing spaces, consecutive blank lines, and dangling whitespace
  str = str
    .split("\n")
    .map(line => safeTrim(line))
    .filter((line, idx, arr) => line !== "" || (idx > 0 && arr[idx - 1] !== ""))
    .join("\n");

  return {
    cleanedQuestion: safeTrim(str),
    extractedSource: detectedSource
  };
}

function cleanQuestionText(raw: string): string {
  let cleaned = safeTrim(raw);
  cleaned = cleaned.replace(/^\s*(?:\*\*)?(?:#+\s*)?(?:Q|q|Question|Que|Ques|q\.|que\.|प्रश्न|प्र\.|प्र)\s*[:\-–—.]?\s*\d+[\s.)\-–—:]+(?:\*\*)?\s*/i, "");
  cleaned = cleaned.replace(/^\s*(?:\*\*)?(?:#+\s*)?(?:(?:\(\d+\))|(?:\[\d+\])|\d+[\s.)\-–—:]+)(?:\*\*)?\s*/, "");
  return safeTrim(cleaned);
}

function formatQuestionText(lines: string[]): string {
  if (lines.length === 0) return "";

  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const l = safeTrim(rawLine);
    if (!l) {
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== "") {
        formattedLines.push("");
      }
      continue;
    }

    if (DIVIDER_REGEX.test(l)) continue;

    let lineToAdd = l;
    if (formattedLines.length === 0) {
      lineToAdd = cleanQuestionText(l);
    }

    if (lineToAdd) {
      formattedLines.push(lineToAdd);
    }
  }

  return safeTrim(formattedLines.join("\n"));
}

export function extractLetterOrNumberIndex(charOrStr: string): number {
  const c = charOrStr.trim().toUpperCase();
  if (c === "A" || c === "1" || c === "(A)" || c === "[A]" || c === "क" || c === "(क)" || c === "अ" || c === "(अ)") return 1;
  if (c === "B" || c === "2" || c === "(B)" || c === "[B]" || c === "ख" || c === "(ख)" || c === "ब" || c === "(ब)") return 2;
  if (c === "C" || c === "3" || c === "(C)" || c === "[C]" || c === "ग" || c === "(ग)" || c === "स" || c === "(स)") return 3;
  if (c === "D" || c === "4" || c === "(D)" || c === "[D]" || c === "घ" || c === "(घ)" || c === "द" || c === "(द)") return 4;
  if (c === "E" || c === "5" || c === "(E)" || c === "[E]" || c === "ङ" || c === "(ङ)" || c === "य" || c === "(य)") return 5;
  if (c === "F" || c === "6" || c === "(F)" || c === "[F]") return 6;
  if (c === "G" || c === "7" || c === "(G)" || c === "[G]") return 7;
  if (c === "H" || c === "8" || c === "(H)" || c === "[H]") return 8;
  return 1;
}

/**
 * Parses a block of lines under an "Option Analysis:" header into an array indexed by option
 */
export function parseOptionAnalysisLines(lines: string[], optionCount: number = 4): string[] {
  const result: string[] = new Array(optionCount).fill("");
  let currentOptIdx = -1;

  for (const rawLine of lines) {
    const line = safeTrim(rawLine);
    if (!line) continue;

    // Check if line starts with option marker: (A), A), A., [A], Option A:, (1), (क), etc.
    const optMatch = line.match(
      /^\s*(?:\(?([A-Ha-h1-8कखगघङअबसदय])\)?[\s.:\)\-–—]+|(?:option|opt|विकल्प)\s*\(?([A-Ha-h1-8कखगघङअबसदय])\)?[\s.:\)\-–—]*)\s*(.*)$/i
    );
    if (optMatch) {
      const char = optMatch[1] || optMatch[2];
      const idx = extractLetterOrNumberIndex(char) - 1; // 0-indexed
      if (idx >= 0 && idx < optionCount) {
        currentOptIdx = idx;
        const text = safeTrim(optMatch[3] || "");
        result[currentOptIdx] = text;
        continue;
      }
    }

    // Continuation line for the active option analysis
    if (currentOptIdx >= 0 && currentOptIdx < optionCount) {
      result[currentOptIdx] = result[currentOptIdx]
        ? `${result[currentOptIdx]}\n${line}`
        : line;
    }
  }

  return result;
}

/**
 * Intelligently extracts option-specific analyses from an explanation or solution text
 * e.g. when an explanation contains "(A) ... (B) ... (C) ... (D) ..." breakdown.
 */
export function extractOptionAnalysesFromText(
  text: string,
  optionCount: number = 4
): {
  extractedOa?: string[];
  remainingExplanation?: string;
  hasExtracted: boolean;
} {
  if (!text || !text.trim()) {
    return { hasExtracted: false };
  }

  const lines = text.split("\n");
  const parsed = parseOptionAnalysisLines(lines, optionCount);
  const countFound = parsed.filter(p => p && p.trim().length > 0).length;

  if (countFound >= 2) {
    let preamble = "";
    const firstOptLineIdx = lines.findIndex(l =>
      /^\s*(?:\(?([A-Ha-h1-8कखगघङअबसदय])\)?[\s.:\)\-–—]+|(?:option|opt|विकल्प)\s*\(?([A-Ha-h1-8कखगघङअबसदय])\)?[\s.:\)\-–—]*)/i.test(
        l
      )
    );
    if (firstOptLineIdx > 0) {
      preamble = lines.slice(0, firstOptLineIdx).join("\n").trim();
    }
    return {
      extractedOa: parsed,
      remainingExplanation: preamble || undefined,
      hasExtracted: true
    };
  }

  // Fallback: Check regex across text for inline or unlined (A) ... (B) ...
  const pattern = /(?:^|\n|\s+)(?:\(([A-D1-4])\)|([A-D1-4])\s*[.):]|\b(?:Option|Opt|विकल्प)\s*\(?([A-D1-4])\)?[:.\-–—\s])\s*([\s\S]*?)(?=(?:(?:\n|\s+)(?:\([A-D1-4]\)|[A-D1-4]\s*[.):]|\b(?:Option|Opt|विकल्प)\s*\(?[A-D1-4]\)?[:.\-–—\s]))|$)/gi;
  const matches = [...text.matchAll(pattern)];

  if (matches.length >= 2) {
    const result: string[] = new Array(optionCount).fill("");
    for (const m of matches) {
      const char = m[1] || m[2] || m[3];
      const idx = extractLetterOrNumberIndex(char) - 1;
      if (idx >= 0 && idx < optionCount) {
        result[idx] = (m[4] || "").trim();
      }
    }
    if (result.filter(r => r && r.length > 0).length >= 2) {
      const firstMatchIndex = matches[0].index || 0;
      const preamble = text.slice(0, firstMatchIndex).trim();
      return {
        extractedOa: result,
        remainingExplanation: preamble || undefined,
        hasExtracted: true
      };
    }
  }

  return { hasExtracted: false };
}

export function matchOptionLine(
  line: string,
  optionsContext?: { hasAlphaOptions?: boolean; allowBareNumeric?: boolean }
): { isMatch: boolean; optionVal: string; analysisVal: string; letterMatched?: string; type: "alpha" | "hindi_ka" | "hindi_a" | "numeric" | "none" } {
  const l = safeTrim(line);
  if (!l) return { isMatch: false, optionVal: "", analysisVal: "", type: "none" };

  // 1. Try Alpha Options: (A), [A], A., A), Option A, Opt A
  let m = l.match(ALPHA_OPTION_REGEX);
  if (m) {
    const letter = (m[1] || m[2] || m[3] || m[4] || m[5] || "").toUpperCase();
    const content = m[6] !== undefined ? m[6] : l;
    return { isMatch: true, optionVal: content, analysisVal: "", letterMatched: letter, type: "alpha" };
  }

  // 2. Try Hindi Ka/Kha/Ga/Gha Options: (क), [क], क., क), विकल्प (क)
  m = l.match(HINDI_KA_OPTION_REGEX);
  if (m) {
    const letter = m[1] || m[2] || m[3] || m[4] || "";
    const content = m[5] !== undefined ? m[5] : l;
    return { isMatch: true, optionVal: content, analysisVal: "", letterMatched: letter, type: "hindi_ka" };
  }

  // 3. Try Hindi A/B/S/D Options: (अ), [अ], अ., अ), विकल्प (अ)
  m = l.match(HINDI_A_OPTION_REGEX);
  if (m) {
    const letter = m[1] || m[2] || m[3] || m[4] || "";
    const content = m[5] !== undefined ? m[5] : l;
    return { isMatch: true, optionVal: content, analysisVal: "", letterMatched: letter, type: "hindi_a" };
  }

  // 4. Try Parenthesized Numeric Options: (1), [1], Option 1, Opt 1
  m = l.match(NUMERIC_PAREN_OPTION_REGEX);
  if (m) {
    const num = m[1] || m[2] || m[3] || m[4] || "";
    const content = m[5] !== undefined ? m[5] : l;
    return { isMatch: true, optionVal: content, analysisVal: "", letterMatched: num, type: "numeric" };
  }

  // 5. Try Bare Numeric Options (1., 2., etc.) ONLY when explicitly permitted
  const allowBare = Boolean(optionsContext?.allowBareNumeric);
  if (allowBare) {
    m = l.match(NUMERIC_BARE_OPTION_REGEX);
    if (m) {
      const num = m[1] || "";
      const content = m[2] !== undefined ? m[2] : l;
      return { isMatch: true, optionVal: content, analysisVal: "", letterMatched: num, type: "numeric" };
    }
  }

  return { isMatch: false, optionVal: "", analysisVal: "", type: "none" };
}

function splitMultiOptionLines(rawLines: string[]): string[] {
  const result: string[] = [];
  for (const line of rawLines) {
    const l = safeTrim(line);
    if (!l) {
      result.push(line);
      continue;
    }
    // NEVER split Answer, Explanation, or Source lines
    if (ANS_LINE_REGEX.test(l) || EXPLANATION_START_REGEX.test(l) || SOURCE_START_REGEX.test(l) || IMAGE_START_REGEX.test(l)) {
      result.push(line);
      continue;
    }

    // Only attempt splitting if the line contains multiple option markers
    // e.g. contains (A) and (B), or A) and B), or (1) and (2)
    const hasMultipleMarkers =
      (/(?:\([A-Ea-e]\)|\[[A-Ea-e]\]|\b[A-Ea-e]\s*[.):]).*(?:\([B-Eb-e]\)|\[[B-Eb-e]\]|\b[B-Eb-e]\s*[.):])/i.test(l)) ||
      (/(?:\([1-5]\)|\[[1-5]\]|\b[1-5]\s*[.)]).*(?:\([2-5]\)|\[[2-5]\]|\b[2-5]\s*[.)])/i.test(l)) ||
      (/(?:\([कखगघङअबसदय]\)|\[[कखगघङअबसदय]\]).*(?:\([खगघङबसदय]\)|\[[खगघङबसदय]\])/i.test(l));

    if (hasMultipleMarkers) {
      const parts = line.split(MULTI_OPT_SPLIT_REGEX).map(s => safeTrim(s)).filter(Boolean);
      if (parts.length > 1) {
        for (const p of parts) result.push(p);
        continue;
      }
    }

    result.push(line);
  }
  return result;
}

function findOptionStartIndex(
  lines: string[],
  optionsContext?: { hasAlphaOptions?: boolean; allowBareNumeric?: boolean }
): number {
  // First, check if there is an option starting with 'A' / '(A)' / '1' / '(1)' / 'क' / 'अ'
  // that is followed by 'B' / '2' / 'ख' / 'ब'
  for (let i = 0; i < lines.length; i++) {
    const m = matchOptionLine(lines[i], optionsContext);
    if (m.isMatch) {
      const letUpper = (m.letterMatched || "").toUpperCase();
      // If it starts with A / 1 / क / अ, check if subsequent lines contain B / 2 / ख / ब
      if (letUpper === "A" || letUpper === "1" || letUpper === "क" || letUpper === "अ") {
        let hasSubsequent = false;
        for (let j = i + 1; j < Math.min(lines.length, i + 6); j++) {
          const mSub = matchOptionLine(lines[j], optionsContext);
          if (mSub.isMatch) {
            const nextLet = (mSub.letterMatched || "").toUpperCase();
            if (nextLet === "B" || nextLet === "2" || nextLet === "ख" || nextLet === "ब" || nextLet === "C" || nextLet === "3") {
              hasSubsequent = true;
              break;
            }
          }
        }
        if (hasSubsequent || lines.length <= i + 4) {
          return i;
        }
      }
    }
  }

  // Fallback: search for any first matched option index
  for (let i = 0; i < lines.length; i++) {
    const m = matchOptionLine(lines[i], optionsContext);
    if (m.isMatch) {
      return i;
    }
  }

  return -1;
}

function extractQuestionAndOptions(
  lines: string[],
  optionsContext?: { hasAlphaOptions?: boolean; allowBareNumeric?: boolean }
): {
  qText: string;
  options: string[];
  optionAnalyses: string[];
  correctIdx: number;
  detectedAnsText?: string;
  hasRealOptions?: boolean;
} {
  if (lines.length === 0) {
    return { qText: "", options: [], optionAnalyses: [], correctIdx: 1, hasRealOptions: false };
  }

  let detectedAnsText: string | undefined = undefined;
  let explicitAnsIdx: number | null = null;

  // First expand any multi-option lines safely (e.g. "(A) 10 (B) 20 (C) 30 (D) 40")
  const expandedLines = splitMultiOptionLines(lines);

  const filteredLines: string[] = [];
  for (const raw of expandedLines) {
    const l = safeTrim(raw);
    if (!l) {
      filteredLines.push("");
      continue;
    }
    if (DIVIDER_REGEX.test(l)) continue;

    const ansMatch = l.match(ANS_LINE_REGEX);
    if (ansMatch) {
      const matchedOptionChar = ansMatch[1];
      explicitAnsIdx = extractLetterOrNumberIndex(matchedOptionChar);
      detectedAnsText = l;
      continue;
    }
    filteredLines.push(l);
  }

  const optStartIndex = findOptionStartIndex(filteredLines, optionsContext);

  let qTextLines: string[] = [];
  let optRawLines: string[] = [];

  if (optStartIndex !== -1) {
    qTextLines = filteredLines.slice(0, optStartIndex);
    optRawLines = filteredLines.slice(optStartIndex);
  } else {
    qTextLines = filteredLines;
  }

  const qText = formatQuestionText(qTextLines);

  const options: string[] = [];
  const optionAnalyses: string[] = [];
  let checkmarkIdx: number | null = null;

  for (const rawLine of optRawLines) {
    const l = safeTrim(rawLine);
    if (!l) continue;

    const optMatch = matchOptionLine(l, optionsContext);
    if (optMatch.isMatch) {
      let optionPart = optMatch.optionVal;
      let analysisPart = "";

      // Check for inline option analysis separated by "///", "//", or "||"
      const slashMatch = optionPart.match(/\s*(?:\/{3,}|\s\/{2}\s|\|\|)\s*/);
      if (slashMatch && slashMatch.index !== undefined) {
        analysisPart = optionPart.substring(slashMatch.index + slashMatch[0].length);
        optionPart = optionPart.substring(0, slashMatch.index);
      } else if (optionPart.includes("///")) {
        const splitIdx = optionPart.indexOf("///");
        analysisPart = optionPart.substring(splitIdx + 3);
        optionPart = optionPart.substring(0, splitIdx);
      }

      // Check if checkmark is in option part, analysis part, or the raw line
      const hasCheckmark =
        CHECKMARK_REGEX.test(optionPart) ||
        CHECKMARK_REGEX.test(analysisPart) ||
        CHECKMARK_REGEX.test(l);

      optionPart = safeTrim(
        optionPart
          .replace(CHECKMARK_CLEAN_REGEX, "")
          .replace(/^\s*\*+|\*+\s*$/g, "")
      );
      analysisPart = safeTrim(analysisPart.replace(CHECKMARK_CLEAN_REGEX, ""));

      options.push(optionPart || `Option ${options.length + 1}`);
      optionAnalyses.push(analysisPart);

      if (hasCheckmark) {
        checkmarkIdx = options.length;
      }
    } else {
      if (options.length > 0) {
        const lastIdx = options.length - 1;
        const hasExistingAnalysis = Boolean(optionAnalyses[lastIdx] && optionAnalyses[lastIdx].trim().length > 0);
        const looksLikeAnalysisTag = /^\s*[-*•]?\s*\*?(?:synonyms?|antonyms?|opposites?|meaning|note|hint|अर्थ|विलोम(?:\s*शब्द)?|विपरीत(?:ार्थक)?|पर्यायवाची|समानार्थक|उपसर्ग|प्रत्यय|विवरण)\*?\s*[:=\-–—]/i.test(l);

        if (hasExistingAnalysis || looksLikeAnalysisTag) {
          optionAnalyses[lastIdx] = safeTrim(
            (optionAnalyses[lastIdx] ? optionAnalyses[lastIdx] + "\n" : "") + l
          );
        } else {
          options[lastIdx] = safeTrim(options[lastIdx] + "\n" + l);
        }
      }
    }
  }

  const hasRealOptions = options.length > 0;

  // Fallback 4 options if none matched
  if (options.length === 0) {
    options.push("Option A", "Option B", "Option C", "Option D");
  }

  const correctIdx = checkmarkIdx !== null ? checkmarkIdx : (explicitAnsIdx !== null ? explicitAnsIdx : 1);

  return { qText, options, optionAnalyses, correctIdx, detectedAnsText, hasRealOptions };
}

/**
 * Extracts test header metadata (Title, ID, Total Questions, etc.)
 */
function extractHeaderMeta(lines: string[]): { meta: ParsedTestMeta; contentStartIndex: number } {
  const meta: ParsedTestMeta = {};
  let contentStartIndex = 0;
  let insideHeaderBox = false;

  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const l = safeTrim(lines[i]);
    if (!l) continue;

    const isQuestionStart = QUESTION_NUMBER_REGEX.test(l) || (STANDALONE_NUMBER_REGEX.test(l) && !matchOptionLine(l).isMatch);
    if (isQuestionStart) {
      contentStartIndex = i;
      break;
    }

    if (DIVIDER_REGEX.test(l)) {
      if (!insideHeaderBox) {
        insideHeaderBox = true;
      } else {
        contentStartIndex = i + 1;
        break;
      }
      continue;
    }

    if (insideHeaderBox || i < 25) {
      if (/^(?:format|file\s*format|type)\s*[:=\-–—.]\s*/i.test(l)) {
        // Skip format specifier headers like "Format. TXT" or "Format: TXT"
        continue;
      } else if (/^id\s*[:=\-–—]\s*(.*)$/i.test(l)) {
        meta.id = safeTrim(l.replace(/^id\s*[:=\-–—]\s*/i, ""));
      } else if (/^(?:total\s*(?:no\.?\s*of\s*)?(?:questions?|q)?|no\.?\s*of\s*questions?|number\s*of\s*questions?|questions?|कुल\s*(?:प्रश्नों?\s*(?:की\s*संख्या)?|प्रश्न))\s*[:=\-–—.]?\s*(\d+)/i.test(l)) {
        const m = l.match(/^(?:total\s*(?:no\.?\s*of\s*)?(?:questions?|q)?|no\.?\s*of\s*questions?|number\s*of\s*questions?|questions?|कुल\s*(?:प्रश्नों?\s*(?:की\s*संख्या)?|प्रश्न))\s*[:=\-–—.]?\s*(\d+)/i);
        if (m) meta.totalQuestions = parseInt(m[1], 10);
      } else if (/^(\d+)\s*(?:total\s*)?(?:questions?|q|mcqs?|प्रश्न)\b/i.test(l)) {
        const m = l.match(/^(\d+)\s*(?:total\s*)?(?:questions?|q|mcqs?|प्रश्न)\b/i);
        if (m) meta.totalQuestions = parseInt(m[1], 10);
      } else if (/^duration\s*[:=\-–—]\s*(\d+)/i.test(l)) {
        const m = l.match(/^duration\s*[:=\-–—]\s*(\d+)/i);
        if (m) meta.duration = parseInt(m[1], 10);
      } else if (/^pos(?:itive)?\s*marks?\s*[:=\-–—]\s*([0-9.]+)/i.test(l)) {
        const m = l.match(/^pos(?:itive)?\s*marks?\s*[:=\-–—]\s*([0-9.]+)/i);
        if (m) meta.posMarks = parseFloat(m[1]);
      } else if (/^neg(?:ative)?\s*marks?\s*[:=\-–—]\s*([0-9.]+)/i.test(l)) {
        const m = l.match(/^neg(?:ative)?\s*marks?\s*[:=\-–—]\s*([0-9.]+)/i);
        if (m) meta.negMarks = parseFloat(m[1]);
      } else if (/^title\s*[:=\-–—]\s*(.*)$/i.test(l)) {
        meta.title = safeTrim(l.replace(/^title\s*[:=\-–—]\s*/i, ""));
      } else if (!meta.title && insideHeaderBox && !/^(?:total|id|duration|marks|time|instructions?)\b/i.test(l) && l.length > 3 && !matchOptionLine(l).isMatch) {
        meta.title = l;
      }
    }
  }

  return { meta, contentStartIndex };
}

/**
 * Looks ahead from a candidate question line to verify if valid option lines (A, B, C, D)
 * appear before the next question start, divider, or explanation start.
 */
function hasOptionsInFollowingLines(
  lines: string[],
  startIdx: number,
  candidateQNum: number | null,
  hasAlphaOptions: boolean,
  maxLookAhead = 6
): boolean {
  for (let i = startIdx + 1; i < Math.min(lines.length, startIdx + maxLookAhead); i++) {
    const l = safeTrim(lines[i]);
    if (!l) continue;
    if (DIVIDER_REGEX.test(l) || SECTION_HEADER_REGEX.test(l)) {
      break;
    }
    if (ANS_LINE_REGEX.test(l) || EXPLANATION_START_REGEX.test(l) || OPTION_ANALYSIS_START_REGEX.test(l) || SOURCE_START_REGEX.test(l) || IMAGE_START_REGEX.test(l)) {
      break;
    }
    if (QUESTION_NUMBER_REGEX.test(l)) {
      break;
    }
    const bareMatch = l.match(STANDALONE_NUMBER_REGEX);
    if (bareMatch) {
      const opt = matchOptionLine(l, { hasAlphaOptions, allowBareNumeric: false });
      if (!opt.isMatch) {
        break;
      }
    }

    const opt = matchOptionLine(l, { hasAlphaOptions, allowBareNumeric: !hasAlphaOptions });
    if (opt.isMatch) {
      return true;
    }
  }
  return false;
}

/**
 * Main parser that parses raw test text and returns parsed questions along with any extracted metadata
 */
export function parseTestTextWithMeta(text: string): ParseResult {
  if (!text || !text.trim()) {
    return { meta: {}, questions: [] };
  }

  // Normalize line endings and strip BOM
  const cleanedText = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = cleanedText.split("\n");

  const { meta, contentStartIndex } = extractHeaderMeta(rawLines);
  const bodyLines = rawLines.slice(contentStartIndex);

  // Scan document to detect structural style:
  // 1. Explicit Q prefix style: "Q1.", "Question 1.", "प्रश्न 1."
  // 2. Explicit divider style: "----", "===="
  // 3. Alpha option style: "A)", "(A)", "A."
  let explicitQPrefixCount = 0;
  let bareNumberedQCount = 0;
  let dividerCount = 0;
  let alphaOptionCount = 0;
  let numericOptionCount = 0;
  let hindiOptionCount = 0;

  for (const rawLine of bodyLines) {
    const l = safeTrim(rawLine);
    if (!l) continue;
    if (DIVIDER_REGEX.test(l)) dividerCount++;
    if (QUESTION_NUMBER_REGEX.test(l)) explicitQPrefixCount++;
    if (STANDALONE_NUMBER_REGEX.test(l) && !matchOptionLine(l, { hasAlphaOptions: true }).isMatch) bareNumberedQCount++;
    if (ALPHA_OPTION_REGEX.test(l)) alphaOptionCount++;
    if (NUMERIC_PAREN_OPTION_REGEX.test(l) || NUMERIC_BARE_OPTION_REGEX.test(l)) numericOptionCount++;
    if (HINDI_KA_OPTION_REGEX.test(l) || HINDI_A_OPTION_REGEX.test(l)) hindiOptionCount++;
  }

  const fileUsesExplicitQ = explicitQPrefixCount >= 1;
  const fileUsesNumberedQ = explicitQPrefixCount >= 1 || bareNumberedQCount >= 1;
  const fileUsesDividers = dividerCount >= 1;
  const fileHasAlphaOptions = alphaOptionCount >= 1;
  const fileHasAnyOptions = fileHasAlphaOptions || numericOptionCount >= 2 || hindiOptionCount >= 1;

  const questions: ParsedQuestion[] = [];

  let currentQBlockLines: string[] = [];
  let currentExplLines: string[] = [];
  let currentOaLines: string[] = [];
  let currentSource = "";
  let currentImage = "";
  let currentAnsLine = "";
  let lastQuestionNum = 0;

  // States: 'IDLE' | 'QUESTION' | 'EXPLANATION' | 'OPTION_ANALYSIS' | 'SOURCE'
  let state: "IDLE" | "QUESTION" | "EXPLANATION" | "OPTION_ANALYSIS" | "SOURCE" = "IDLE";

  const finalizeCurrentQuestion = () => {
    if (currentQBlockLines.length === 0 && currentExplLines.length === 0 && currentOaLines.length === 0 && !currentAnsLine) {
      return;
    }

    // If Ans line was recorded outside options, include it for parsing if not already there
    if (currentAnsLine && !currentQBlockLines.some(l => ANS_LINE_REGEX.test(l))) {
      currentQBlockLines.push(currentAnsLine);
    }

    const { qText, options, optionAnalyses, correctIdx, detectedAnsText, hasRealOptions } = extractQuestionAndOptions(
      currentQBlockLines,
      { hasAlphaOptions: fileHasAlphaOptions, allowBareNumeric: !fileHasAlphaOptions }
    );

    if (!qText && options.length === 0) {
      currentQBlockLines = [];
      currentExplLines = [];
      currentOaLines = [];
      currentSource = "";
      currentImage = "";
      currentAnsLine = "";
      state = "IDLE";
      return;
    }

    // If the document has options overall, but this candidate block has no real options:
    // avoid generating a phantom question with synthetic options.
    if (fileHasAnyOptions && !hasRealOptions) {
      if (questions.length > 0) {
        const lastQ = questions[questions.length - 1];
        const strayText = [qText, ...currentExplLines].filter(Boolean).join("\n");
        if (strayText) {
          lastQ.s = lastQ.s ? `${lastQ.s}\n\n${strayText}` : strayText;
        }
      }
      currentQBlockLines = [];
      currentExplLines = [];
      currentOaLines = [];
      currentSource = "";
      currentImage = "";
      currentAnsLine = "";
      state = "IDLE";
      return;
    }

    let finalCorrectIdx = correctIdx;
    let explanationText = safeTrim(currentExplLines.join("\n"));

    // Check if an explicit Ans: line was provided
    const ansToParse = currentAnsLine || detectedAnsText || "";
    if (ansToParse) {
      const ansMatch = ansToParse.match(ANS_LINE_REGEX);
      if (ansMatch) {
        finalCorrectIdx = extractLetterOrNumberIndex(ansMatch[1]);
      }
    }

    // If still default 1 and not explicitly chosen, check explanation text
    if (finalCorrectIdx === 1 && !ansToParse && explanationText) {
      const optMatch = explanationText.match(/(?:correct\s+(?:option|answer|opt)\s*(?:is|i\.e\.)?\s*:?|Ans(?:wer)?\s*:?|Option|उत्तर\s*:?)\s*\(?([1-5A-Ea-eकखगघङअबसदय])\)?/i);
      if (optMatch) {
        finalCorrectIdx = extractLetterOrNumberIndex(optMatch[1]);
      }
    }

    // Clean source text if surrounded by brackets [ ... ]
    let cleanedSource = currentSource ? safeTrim(currentSource) : undefined;
    if (cleanedSource && cleanedSource.startsWith("[") && cleanedSource.endsWith("]")) {
      cleanedSource = safeTrim(cleanedSource.slice(1, -1));
    }

    // Strip [ ... ] bracket tags from question text so they don't appear in the question body
    const { cleanedQuestion, extractedSource } = stripBracketSourceFromQuestion(qText);
    const finalQuestionText = cleanedQuestion || qText || `Question ${questions.length + 1}`;

    if (!cleanedSource && extractedSource) {
      cleanedSource = extractedSource;
    }

    // Resolve option-specific analyses (from dedicated Option Analysis: block or inline options)
    let finalOptionAnalyses = optionAnalyses;
    if (currentOaLines.length > 0) {
      const parsedBlockOa = parseOptionAnalysisLines(currentOaLines, options.length);
      if (parsedBlockOa.some(a => a && a.trim().length > 0)) {
        finalOptionAnalyses = parsedBlockOa;
      }
    }

    questions.push({
      q: decodeHtmlEntities(finalQuestionText),
      o: options.map(opt => decodeHtmlEntities(opt)),
      c: finalCorrectIdx,
      s: decodeHtmlEntities(explanationText || (ansToParse ? ansToParse : "No explanation provided.")),
      source: cleanedSource ? decodeHtmlEntities(cleanedSource) : undefined,
      image: currentImage ? safeTrim(currentImage) : undefined,
      oa: finalOptionAnalyses.some(a => a && a.length > 0) ? finalOptionAnalyses.map(a => decodeHtmlEntities(a)) : undefined
    });

    // Reset accumulators
    currentQBlockLines = [];
    currentExplLines = [];
    currentOaLines = [];
    currentSource = "";
    currentImage = "";
    currentAnsLine = "";
    state = "IDLE";
  };

  for (let idx = 0; idx < bodyLines.length; idx++) {
    const rawLine = bodyLines[idx];
    const line = safeTrim(rawLine);

    if (!line) {
      if (state === "QUESTION" && currentQBlockLines.length > 0) {
        currentQBlockLines.push("");
      } else if (state === "EXPLANATION" && currentExplLines.length > 0) {
        currentExplLines.push("");
      }
      continue;
    }

    // Divider line like '--------------------------------------------------'
    if (DIVIDER_REGEX.test(line)) {
      if (state !== "IDLE" && (currentQBlockLines.length > 0 || currentExplLines.length > 0 || currentAnsLine)) {
        finalizeCurrentQuestion();
      }
      state = "IDLE";
      // Retain lastQuestionNum across simple question dividers to avoid resetting numbering sequence
      continue;
    }

    // Section or Part Header line like '### [ PART-1 ] ###' or '=== SECTION A ==='
    if (SECTION_HEADER_REGEX.test(line)) {
      if (state !== "IDLE" && (currentQBlockLines.length > 0 || currentExplLines.length > 0 || currentAnsLine)) {
        finalizeCurrentQuestion();
      }
      state = "IDLE";
      lastQuestionNum = 0;
      continue;
    }

    const hasExplicitQ = QUESTION_NUMBER_REGEX.test(line);
    const bareNumMatch = line.match(STANDALONE_NUMBER_REGEX);

    // Bare numbers can only be options if the file has no alpha options and we are inside a question statement
    const canBeBareOption = !fileHasAlphaOptions && state === "QUESTION" && currentQBlockLines.length > 0;
    const optCheck = matchOptionLine(line, { hasAlphaOptions: fileHasAlphaOptions, allowBareNumeric: canBeBareOption });

    let isNewQuestionStart = false;
    let detectedQNum: number | null = null;

    if (hasExplicitQ) {
      const qm = line.match(QUESTION_NUMBER_REGEX);
      if (qm && qm[1]) {
        detectedQNum = parseInt(qm[1], 10);
      }
    } else if (bareNumMatch && !optCheck.isMatch) {
      // Bare number line like "1. Question text"
      // If the file consistently uses explicit Q (e.g. "Q1.", "Question 1"),
      // bare numbers like "1. Example" or "2. Rule" in explanations are NEVER question starters.
      if (!fileUsesExplicitQ || state === "IDLE") {
        const numValStr = bareNumMatch[1] || bareNumMatch[2] || bareNumMatch[3];
        if (numValStr) {
          detectedQNum = parseInt(numValStr, 10);
        }
      }
    }

    if (detectedQNum !== null) {
      const hasFollowingOptions = hasOptionsInFollowingLines(bodyLines, idx, detectedQNum, fileHasAlphaOptions, 8);
      const isSequentialNext = detectedQNum === lastQuestionNum + 1;
      const isAscending = detectedQNum > lastQuestionNum;

      if (state === "IDLE") {
        if (hasExplicitQ || hasFollowingOptions || detectedQNum === 1 || !fileHasAlphaOptions) {
          isNewQuestionStart = true;
        }
      } else if (hasExplicitQ) {
        if (isAscending || lastQuestionNum === 0 || hasFollowingOptions) {
          isNewQuestionStart = true;
        }
      } else if (state === "EXPLANATION" || state === "SOURCE") {
        // Inside explanation/source: if followed by options (A, B, C, D),
        // it is DEFINITIVELY a new question (e.g. repeated "1.", bulk attached question, or non-sequential)!
        if (hasFollowingOptions) {
          isNewQuestionStart = true;
        } else if (hasExplicitQ && (isAscending || lastQuestionNum === 0)) {
          isNewQuestionStart = true;
        } else if (!fileUsesExplicitQ && isSequentialNext) {
          isNewQuestionStart = true;
        }
      } else if (state === "QUESTION") {
        const currentHasOptions = currentQBlockLines.some(l =>
          matchOptionLine(l, { hasAlphaOptions: fileHasAlphaOptions, allowBareNumeric: false }).isMatch
        );

        if (currentHasOptions) {
          if (hasFollowingOptions || (isAscending && (isSequentialNext || !fileHasAlphaOptions))) {
            isNewQuestionStart = true;
          }
        } else {
          // Numbered statements inside question premise must NOT split the question
          // while options have not yet appeared.
        }
      }
    } else if (!optCheck.isMatch && !ANS_LINE_REGEX.test(line) && !EXPLANATION_START_REGEX.test(line) && !OPTION_ANALYSIS_START_REGEX.test(line) && !SOURCE_START_REGEX.test(line) && !IMAGE_START_REGEX.test(line)) {
      // Questions without numbers or with non-standard prefix
      const looksLikeAnalysisTag = /^\s*[-*•]?\s*\*?(?:synonyms?|antonyms?|opposites?|meaning|note|hint|अर्थ|विलोम(?:\s*शब्द)?|विपरीत(?:ार्थक)?|पर्यायवाची|समानार्थक|उपसर्ग|प्रत्यय|विवरण)\*?\s*[:=\-–—]/i.test(line);
      const currentHasOptions = currentQBlockLines.some(l =>
        matchOptionLine(l, { hasAlphaOptions: fileHasAlphaOptions, allowBareNumeric: false }).isMatch
      );

      // Never treat an analysis tag, a line while options are ongoing, or an explanation line in numbered files as a new question
      if (!looksLikeAnalysisTag && !currentHasOptions && (state === "IDLE" || !fileUsesNumberedQ)) {
        const hasFollowingOptions = hasOptionsInFollowingLines(bodyLines, idx, null, fileHasAlphaOptions, 8);
        if (hasFollowingOptions) {
          isNewQuestionStart = true;
        } else if (state === "IDLE" && fileUsesDividers) {
          isNewQuestionStart = true;
        }
      }
    }

    if (isNewQuestionStart) {
      finalizeCurrentQuestion();
      if (detectedQNum !== null) {
        lastQuestionNum = detectedQNum;
      } else {
        lastQuestionNum++;
      }
      state = "QUESTION";
      currentQBlockLines.push(line);
      continue;
    }

    // Check for Ans: line
    if (ANS_LINE_REGEX.test(line)) {
      currentAnsLine = line;
      continue;
    }

    // Check for bilingual / secondary explanation marker (e.g. [Hindi / हिन्दी व्याख्या]:, [हिन्दी व्याख्या]:, [English Explanation]:, etc.)
    const bilingualExplMatch = line.match(BILINGUAL_EXPL_HEADER_REGEX);
    if (bilingualExplMatch) {
      state = "EXPLANATION";
      const trailingContent = safeTrim(bilingualExplMatch[1] || "");
      const headerPart = safeTrim(line.slice(0, line.length - trailingContent.length));
      
      if (currentExplLines.length > 0) {
        currentExplLines.push("");
      }
      currentExplLines.push(headerPart);
      if (trailingContent) {
        currentExplLines.push(trailingContent);
      }
      continue;
    }

    // Check for explanation marker (Ex:, Explanation:, Exp:, Solution:, Sol:, व्याख्या:, etc.)
    if (EXPLANATION_START_REGEX.test(line)) {
      state = "EXPLANATION";
      const explContent = line.replace(EXPLANATION_START_REGEX, "");
      if (explContent) {
        currentExplLines.push(safeTrim(explContent));
      }
      continue;
    }

    // Check for Option Analysis marker (Option Analysis:, Options Analysis:, विकल्प विश्लेषण:, OA:, etc.)
    if (OPTION_ANALYSIS_START_REGEX.test(line)) {
      state = "OPTION_ANALYSIS";
      const oaContent = line.replace(OPTION_ANALYSIS_START_REGEX, "$1");
      if (oaContent && safeTrim(oaContent)) {
        currentOaLines.push(safeTrim(oaContent));
      }
      continue;
    }

    // Check for source marker (Source:, Ref:, स्रोत:, etc.)
    if (SOURCE_START_REGEX.test(line)) {
      state = "SOURCE";
      const sourceContent = safeTrim(line.replace(SOURCE_START_REGEX, "$1"));
      currentSource = sourceContent;
      // If the source is complete (e.g. has closing bracket ']' or doesn't have an unclosed bracket),
      // transition state to EXPLANATION so follow-up lines (e.g. "Hence, ...") are captured in explanation
      if (!currentSource.startsWith("[") || currentSource.includes("]")) {
        state = "EXPLANATION";
      }
      continue;
    }

    // Check for image marker (Image:, Img:, चित्र:, etc.)
    if (IMAGE_START_REGEX.test(line)) {
      currentImage = line.replace(IMAGE_START_REGEX, "$1");
      continue;
    }

    // Line routing based on current state
    if (state === "QUESTION") {
      currentQBlockLines.push(line);
    } else if (state === "EXPLANATION") {
      currentExplLines.push(line);
    } else if (state === "OPTION_ANALYSIS") {
      currentOaLines.push(line);
    } else if (state === "SOURCE") {
      if (currentSource.startsWith("[") && !currentSource.includes("]")) {
        currentSource += " " + line;
        if (currentSource.includes("]")) {
          state = "EXPLANATION";
        }
      } else {
        // Any subsequent line after source is part of the explanation
        state = "EXPLANATION";
        currentExplLines.push(line);
      }
    } else {
      state = "QUESTION";
      currentQBlockLines.push(line);
    }
  }

  // Finalize last question in buffer
  finalizeCurrentQuestion();

  let finalQuestions = questions;

  // If header declared total questions (e.g. "Total Questions: 349"):
  // Reconcile and prune any extra phantom items if count exceeded declared total
  if (meta.totalQuestions && meta.totalQuestions > 0 && finalQuestions.length > meta.totalQuestions) {
    const genuineQuestions = finalQuestions.filter(q => {
      const isDefaultFour = q.o.length === 4 &&
        q.o[0] === "Option A" && q.o[1] === "Option B" &&
        q.o[2] === "Option C" && q.o[3] === "Option D";
      return !isDefaultFour;
    });

    if (genuineQuestions.length >= meta.totalQuestions) {
      finalQuestions = genuineQuestions.slice(0, meta.totalQuestions);
    } else {
      finalQuestions = finalQuestions.slice(0, meta.totalQuestions);
    }
  } else if (!meta.totalQuestions && finalQuestions.length > 0) {
    meta.totalQuestions = finalQuestions.length;
  }

  return { meta, questions: finalQuestions };
}

/**
 * Backward-compatible helper returning ParsedQuestion[]
 */
export function parseTestText(text: string): ParsedQuestion[] {
  return parseTestTextWithMeta(text).questions;
}

/**
 * Converts an array of ParsedQuestions back into clean, standard .txt format
 * with optional metadata header.
 */
export function formatQuestionsToTxt(
  questions: ParsedQuestion[],
  meta?: ParsedTestMeta & { duration?: number; positiveMarks?: number; negativeMarks?: number; instructions?: string }
): string {
  const lines: string[] = [];

  if (meta) {
    if (meta.title) lines.push(`Title: ${meta.title}`);
    if (meta.id) lines.push(`Test ID: ${meta.id}`);
    if (meta.duration !== undefined) lines.push(`Time: ${meta.duration}`);
    if (meta.positiveMarks !== undefined) lines.push(`Positive Marks: ${meta.positiveMarks}`);
    if (meta.negativeMarks !== undefined) lines.push(`Negative Marks: ${meta.negativeMarks}`);
    if (meta.instructions) lines.push(`Instructions: ${meta.instructions}`);
    if (lines.length > 0) lines.push("");
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  questions.forEach((q, idx) => {
    lines.push(`${idx + 1}. ${q.q}`);

    if (q.source && q.source.trim()) {
      lines.push(`[${q.source.trim()}]`);
    }

    if (q.image && q.image.trim()) {
      lines.push(`[Image: ${q.image.trim()}]`);
    }

    if (q.o && q.o.length > 0) {
      q.o.forEach((opt, optIdx) => {
        const letter = optionLetters[optIdx] || String.fromCharCode(65 + optIdx);
        lines.push(`(${letter}) ${opt || ""}`);
      });
    }

    if (q.c !== undefined && q.c !== null && q.c >= 1) {
      const correctLetter = optionLetters[q.c - 1] || String.fromCharCode(64 + q.c);
      lines.push(`Answer: (${correctLetter})`);
    }

    if (q.s && q.s.trim()) {
      lines.push(`Explanation: ${q.s.trim()}`);
    }

    if (q.oa && q.oa.length > 0) {
      const hasAnyOa = q.oa.some(oa => oa && oa.trim());
      if (hasAnyOa) {
        lines.push("Option Analysis:");
        q.oa.forEach((analysis, optIdx) => {
          if (analysis && analysis.trim()) {
            const letter = optionLetters[optIdx] || String.fromCharCode(65 + optIdx);
            lines.push(`(${letter}) ${analysis.trim()}`);
          }
        });
      }
    }

    lines.push(""); // blank line divider between questions
  });

  return lines.join("\n");
}
