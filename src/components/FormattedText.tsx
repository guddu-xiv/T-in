import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Converts Markdown bold formatting (**text**) to HTML strong tags
 */
export function formatMarkdownToHtml(text: string): string {
  if (!text) return "";
  // Convert **bold** to <strong>bold</strong>
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export function isHindiText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text || "");
}

/**
 * React component that renders text with support for:
 * - **bold text** (renders as <strong>)
 * - Multiline preservation (\n)
 * - Automatic font-family: Outfit for English, Anek Devanagari for Hindi
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  const hasHindi = isHindiText(text);
  const fontClass = hasHindi ? "font-hindi" : "font-sans";
  const inlineFontFamily = hasHindi
    ? "'Anek Devanagari', 'Anek Devnagari', sans-serif"
    : "'Outfit', sans-serif";

  // Split by line breaks to preserve formatting
  const lines = text.split("\n");

  return (
    <span
      className={`${fontClass} ${className}`.trim()}
      style={{ fontFamily: inlineFontFamily }}
    >
      {lines.map((line, lineIdx) => {
        // Split each line by **bold** markdown pattern
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <React.Fragment key={lineIdx}>
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
                const boldContent = part.slice(2, -2);
                return (
                  <strong key={partIdx} className="font-bold text-inherit">
                    {boldContent}
                  </strong>
                );
              }
              return <React.Fragment key={partIdx}>{part}</React.Fragment>;
            })}
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};
