"use client";

import { useState, useTransition } from "react";
import { runPressConferencePipeline } from "./actions";
import type { PipelineResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SEVERITY_COLORS = {
  low: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  medium: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  high: "bg-red-500/20 text-red-300 border-red-500/40",
};

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Session-level crisis mitigation tracking
  const [totalRuns, setTotalRuns] = useState(0);
  const [successRuns, setSuccessRuns] = useState(0);

  const mitigationRate =
    totalRuns === 0 ? null : Math.round((successRuns / totalRuns) * 100);

  function handleSubmit() {
    if (!input.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const data = await runPressConferencePipeline(input.trim());
        setResult(data);
        setTotalRuns((n) => n + 1);
        if (data.mitigationSuccess) setSuccessRuns((n) => n + 1);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              PreGame
            </span>
            <span className="text-slate-400 text-sm font-medium hidden sm:block">
              Press Conference Prep
            </span>
          </div>
          {mitigationRate !== null && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Crisis Mitigation Rate</span>
              <Badge
                className={`text-sm font-semibold px-3 py-1 ${
                  mitigationRate >= 80
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : mitigationRate >= 50
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                    : "bg-red-500/20 text-red-300 border-red-500/40"
                }`}
              >
                {mitigationRate}%
              </Badge>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Raw Statement
              </label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type what you're thinking of saying at the press conference…"
                className="min-h-[160px] bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 resize-none focus:border-slate-500 focus:ring-slate-500"
                disabled={isPending}
              />
              <Button
                onClick={handleSubmit}
                disabled={isPending || !input.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 transition-colors"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Running Analysis…
                  </span>
                ) : (
                  "Run Analysis"
                )}
              </Button>
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            {/* Risk Assessment Card */}
            {isPending && !result && (
              <RiskSkeleton />
            )}
            {result && (
              <Card className="bg-slate-900 border-slate-700 animate-in fade-in duration-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 text-base font-semibold">
                      Risk Assessment
                    </CardTitle>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
                        SEVERITY_COLORS[result.risk.severityLevel]
                      }`}
                    >
                      {result.risk.severityLevel} severity
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Flagged Phrases */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Flagged Phrases
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.risk.flaggedPhrases.map((phrase) => (
                        <span
                          key={phrase}
                          className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs px-2.5 py-1 rounded-full font-medium"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Risk Factors
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {result.risk.riskFactors.map((factor, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-orange-400 mt-0.5">⚠</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Headlines */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                      Potential Negative Headlines
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {result.risk.potentialHeadlines.map((headline, i) => (
                        <li key={i} className="text-sm text-amber-200/80 italic">
                          &ldquo;{headline}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Refined Statement */}
            {isPending && !result && (
              <>
                <RefinedSkeleton />
                <ReporterSkeleton />
              </>
            )}
            {result && (
              <>
                <Card className="bg-slate-900 border-emerald-500/30 animate-in fade-in duration-500 delay-150">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <CardTitle className="text-emerald-300 text-base font-semibold">
                        Press Conference Ready
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      {result.refinedStatement}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span
                        className={`text-xs font-medium ${
                          result.mitigationSuccess
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {result.mitigationSuccess
                          ? "✓ All risk factors mitigated"
                          : "✗ Some risk factors may remain"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Adversarial Reporter */}
                <Card className="bg-slate-900 border-slate-600 animate-in fade-in duration-500 delay-300">
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <CardTitle className="text-slate-200 text-base font-semibold">
                        Hostile Reporter
                      </CardTitle>
                      <span className="text-xs text-slate-500 ml-auto">
                        Adversarial follow-up
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ol className="flex flex-col gap-4">
                      {result.reporterQuestions.map((q, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-red-400 font-bold text-sm shrink-0 mt-0.5">
                            {i + 1}.
                          </span>
                          <p className="text-slate-200 font-semibold text-sm leading-relaxed">
                            {q}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Empty state */}
            {!isPending && !result && (
              <div className="flex-1 flex items-center justify-center min-h-[300px] border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-600 text-sm text-center px-8">
                  Enter a statement and run the analysis to see the refined
                  response and adversarial questions here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function RiskSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 animate-pulse flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-slate-800 rounded" />
        <div className="h-4 w-20 bg-slate-800 rounded-full" />
      </div>
      <div className="flex gap-2">
        {[60, 80, 50].map((w) => (
          <div key={w} className={`h-6 w-${w === 60 ? "16" : w === 80 ? "20" : "14"} bg-slate-800 rounded-full`} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 bg-slate-800 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

function RefinedSkeleton() {
  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-5 animate-pulse flex flex-col gap-3">
      <div className="h-4 w-40 bg-slate-800 rounded" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-3 bg-slate-800 rounded w-full" />
      ))}
    </div>
  );
}

function ReporterSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 animate-pulse flex flex-col gap-4">
      <div className="h-4 w-32 bg-slate-800 rounded" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-3 w-4 bg-slate-800 rounded shrink-0" />
          <div className="h-3 bg-slate-800 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
