"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { runPressConferencePipeline } from "./actions";
import type { PipelineResult } from "@/lib/types";

// ── Shared styles ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  padding: 32,
  marginBottom: 40,
  maxWidth: 720,
  width: "100%",
};

const EYEBROW: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#8E8E93",
  marginBottom: 16,
  display: "block",
};

const SEVERITY_PILL: Record<string, React.CSSProperties> = {
  low:    { background: "#FFF3E0", color: "#BF5700" },
  medium: { background: "#FFF3E0", color: "#BF5700" },
  high:   { background: "#FFF0EE", color: "#C0392B" },
};

// ── FadeCard: fades in when scrolled into view ────────────────────────────────
function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number | null, duration = 900) {
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (target === null) { setDisplay(null); return; }
    const start = Date.now();
    const from = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(from + (target - from) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [totalRuns, setTotalRuns] = useState(0);
  const [successRuns, setSuccessRuns] = useState(0);
  const [btnActive, setBtnActive] = useState(false);
  const [focusedTextarea, setFocusedTextarea] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const mitigationRate = totalRuns === 0 ? null : Math.round((successRuns / totalRuns) * 100);
  const displayRate = useCountUp(mitigationRate);

  function handleSubmit() {
    if (!input.trim() || isPending) return;
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const data = await runPressConferencePipeline(input.trim());
        setResult(data);
        setTotalRuns((n) => n + 1);
        if (data.mitigationSuccess) setSuccessRuns((n) => n + 1);
        // Auto-scroll to results after state settles
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>

      {/* ── Sticky Nav ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.72)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#1D1D1F", letterSpacing: "-0.02em" }}>PreGame</span>
          {displayRate !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#6E6E73" }}>Crisis Mitigation Rate</span>
              <span style={{ background: "#E8F5E9", color: "#1D8348", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
                {displayRate}%
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero (100vh) ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 720, margin: "0 auto", padding: "80px 24px 48px" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#1D1D1F", textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 12px" }}>
          What are you about to say?
        </h1>
        <p style={{ fontSize: 18, color: "#8E8E93", textAlign: "center", margin: "0 0 40px", fontWeight: 400 }}>
          Paste your statement. We&apos;ll handle the fallout.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocusedTextarea(true)}
          onBlur={() => setFocusedTextarea(false)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          placeholder="I just want to say that the coaching staff has no idea what they're doing…"
          disabled={isPending}
          style={{
            width: "100%", minHeight: "40vh",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 16,
            fontSize: 22, fontWeight: 400, color: "#1D1D1F",
            padding: "24px", resize: "none", outline: "none",
            boxShadow: focusedTextarea ? "0 0 0 4px rgba(0,113,227,0.15)" : "0 2px 12px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.2s ease",
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
        />
        {/* placeholder color via global style */}
        <style>{`textarea::placeholder { color: #AAAAAA; }`}</style>

        <button
          onClick={handleSubmit}
          disabled={isPending || !input.trim()}
          onMouseDown={() => setBtnActive(true)}
          onMouseUp={() => setBtnActive(false)}
          onMouseLeave={() => setBtnActive(false)}
          style={{
            marginTop: 16,
            background: isPending || !input.trim() ? "#A0C4F1" : "#0071E3",
            color: "#FFFFFF",
            border: "none", borderRadius: 980,
            padding: "16px 28px",
            fontSize: 17, fontWeight: 600,
            cursor: isPending || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            transform: btnActive ? "scale(0.98)" : "scale(1)",
            opacity: btnActive ? 0.85 : 1,
            width: "100%",
          }}
        >
          {isPending ? "Analyzing…" : "Run Analysis"}
        </button>

        {error && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#C0392B", background: "#FFF0EE", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </section>

      {/* ── Results ── */}
      {result && (
        <section ref={resultsRef} style={{ paddingTop: 80, paddingBottom: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "80px 24px 120px" }}>

          {/* Risk Assessment */}
          <FadeCard delay={0}>
            <div style={CARD}>
              <span style={EYEBROW}>Risk Assessment</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: "#1D1D1F" }}>What could go wrong</span>
                <span style={{ ...SEVERITY_PILL[result.risk.severityLevel], borderRadius: 980, padding: "5px 14px", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {result.risk.severityLevel} severity
                </span>
              </div>

              <span style={EYEBROW}>Flagged Phrases</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {result.risk.flaggedPhrases.map((phrase) => (
                  <span key={phrase} style={{ background: "#FFF0EE", color: "#C0392B", borderRadius: 980, padding: "5px 14px", fontSize: 13, fontWeight: 500 }}>
                    {phrase}
                  </span>
                ))}
              </div>

              <span style={EYEBROW}>Risk Factors</span>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {result.risk.riskFactors.map((factor, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: "#3A3A3C", alignItems: "flex-start", lineHeight: 1.5 }}>
                    <span style={{ color: "#FF3B30", flexShrink: 0 }}>⚠</span>
                    {factor}
                  </li>
                ))}
              </ul>

              <div style={{ background: "#FFFBF0", borderLeft: "4px solid #FFD60A", borderRadius: "0 12px 12px 0", padding: "16px 18px" }}>
                <span style={{ ...EYEBROW, color: "#BF5700", marginBottom: 10 }}>Potential Negative Headlines</span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.risk.potentialHeadlines.map((headline, i) => (
                    <li key={i} style={{ fontSize: 14, color: "#5C4A00", fontStyle: "italic", lineHeight: 1.5 }}>
                      &ldquo;{headline}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeCard>

          {/* Press Conference Ready */}
          <FadeCard delay={150}>
            <div style={{ ...CARD, background: "#F0FFF4" }}>
              <span style={{ ...EYEBROW, color: "#34C759" }}>Press Conference Ready</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: "#1A3A2A", display: "block", marginBottom: 16 }}>Refined statement</span>
              <p style={{ fontSize: 16, color: "#1D3A2A", lineHeight: 1.7, margin: "0 0 20px" }}>
                {result.refinedStatement}
              </p>
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(52,199,89,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: result.mitigationSuccess ? "#34C759" : "#FF3B30" }}>
                  {result.mitigationSuccess ? "✓ All risk factors mitigated" : "✗ Some risk factors may remain"}
                </span>
              </div>
            </div>
          </FadeCard>

          {/* Hostile Reporter */}
          <FadeCard delay={300}>
            <div style={CARD}>
              <span style={EYEBROW}>Hostile Reporter</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: "#1D1D1F", display: "block", marginBottom: 20 }}>Adversarial follow-up questions</span>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                {result.reporterQuestions.map((q, i) => (
                  <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#F2F2F7", color: "#0071E3", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>
                      {q}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeCard>

        </section>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
