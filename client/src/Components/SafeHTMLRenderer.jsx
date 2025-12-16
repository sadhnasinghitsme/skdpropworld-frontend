import React, { useState, useEffect } from "react";

const SafeHTMLRenderer = ({ html, className = "" }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!html || typeof html !== "string") {
      setSanitizedHtml("");
      return;
    }

    try {
      // Basic sanitization - remove potentially dangerous scripts
      let cleaned = html
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        // Remove event handlers (onclick, onerror, etc.)
        .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
        // Remove javascript: protocols
        .replace(/javascript:/gi, "")
        // Remove iframe tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        // Remove object/embed tags
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");

      setSanitizedHtml(cleaned);
      setHasError(false);
    } catch (err) {
      console.error("Error sanitizing HTML:", err);
      setHasError(true);
      // Fallback: strip all HTML tags
      setSanitizedHtml(html.replace(/<[^>]+>/g, ""));
    }
  }, [html]);

  if (hasError) {
    return (
      <div className={className}>
        <p>Unable to render content. Please try refreshing the page.</p>
      </div>
    );
  }
  
  if (!sanitizedHtml && html) {
    // If we have HTML but sanitization resulted in empty string, show fallback
    return (
      <div className={className}>
        <p>Content is not available.</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHTMLRenderer;
