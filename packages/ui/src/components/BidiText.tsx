import React from "react";

export interface BdiEnProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Bi-directional (BiDi) Text Isolation component.
 * Ensures any English word, phrase, or sentence inside Persian prose is wrapped in:
 * <bdi lang="en" dir="ltr" class="font-latin isolate-ltr">
 * with unicode-bidi: isolate and display: inline-block so punctuation never bleeds or flips.
 */
export function BdiEn({ children, className = "", ...props }: BdiEnProps) {
  return (
    <bdi
      lang="en"
      dir="ltr"
      className={`font-latin isolate-ltr ${className}`.trim()}
      {...props}
    >
      {children}
    </bdi>
  );
}

/**
 * Parses a mixed Persian/English string and wraps all English tokens/phrases
 * in <bdi lang="en" dir="ltr" class="font-latin isolate-ltr">.
 */
export function formatBidiText(text: string): React.ReactNode {
  if (!text) return text;

  // Regex to match English words, phrases, and technical tokens inside Persian text
  const latinRegex = /([A-Za-z0-9_#$@&%~+/:?!=<>()[\]{}-]+(?:\s+[A-Za-z0-9_#$@&%~+/:?!=<>()[\]{}-]+)*)/g;
  const parts = text.split(latinRegex);

  return parts.map((part, index) => {
    if (!part) return null;
    // Check if the part consists of Latin characters/numbers/punctuation
    if (/^[A-Za-z0-9_#$@&%~+/:?!=<>()[\]{}-]+(?:\s+[A-Za-z0-9_#$@&%~+/:?!=<>()[\]{}-]+)*$/.test(part.trim())) {
      return (
        <BdiEn key={index}>
          {part}
        </BdiEn>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const BiDiText = BdiEn;
