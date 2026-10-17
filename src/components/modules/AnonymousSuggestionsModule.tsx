"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import { SuggestionStatus } from "@/types";
import {
  MessageSquareLock,
  Send,
  Search,
  KeyRound,
  ShieldCheck,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from "lucide-react";

export function AnonymousSuggestionsModule() {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<"submit" | "check">("submit");

  // Submission Form State
  const [category, setCategory] = useState<"academic" | "facilities" | "catering" | "events" | "general">("academic");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receiptResult, setReceiptResult] = useState<{
    receiptCode: string;
    secretToken: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Status Check State
  const [checkCode, setCheckCode] = useState("");
  const [checkSecret, setCheckSecret] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/suggestions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setReceiptResult({
        receiptCode: data.receiptCode,
        secretToken: data.secretToken,
      });
      setTitle("");
      setContent("");
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckError("");
    setLookupResult(null);
    setIsChecking(true);

    try {
      const res = await fetch("/api/suggestions/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptCode: checkCode, secretToken: checkSecret }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Murojaat topilmadi yoki sirli kalit noto'g'ri");
      }

      setLookupResult(data.suggestion);
    } catch (err: any) {
      setCheckError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = () => {
    if (!receiptResult) return;
    const text = `NamPS OS Anonim Taklif Kvitansiyasi\nKvitansiya Kodi: ${receiptResult.receiptCode}\nSirli Kalit: ${receiptResult.secretToken}\nHolatni tekshirish uchun ushbu ma'lumotlarni saqlab qo'ying.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getStatusBadge = (status: SuggestionStatus) => {
    const map: Record<SuggestionStatus, { label: string; variant: "default" | "success" | "warning" | "error" | "info" }> = {
      received: { label: t.suggestions.statuses.received, variant: "info" },
      under_review: { label: t.suggestions.statuses.under_review, variant: "warning" },
      approved: { label: t.suggestions.statuses.approved, variant: "success" },
      denied: { label: t.suggestions.statuses.denied, variant: "error" },
      in_progress: { label: t.suggestions.statuses.in_progress, variant: "default" },
      implemented: { label: t.suggestions.statuses.implemented, variant: "success" },
      closed: { label: t.suggestions.statuses.closed, variant: "default" },
    };
    const s = map[status] || { label: status, variant: "default" };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/50">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Shaxsiy daxlsizlik va Maxfiylik</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {t.suggestions.title}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              {t.suggestions.subtitle}
            </p>
          </div>
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 items-center justify-center text-emerald-400">
            <MessageSquareLock className="w-6 h-6" />
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="mt-6 flex space-x-2 border-b border-slate-700/60 pb-2">
          <button
            onClick={() => setActiveSubTab("submit")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "submit"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.nav.anonymousSuggestion}</span>
          </button>
          <button
            onClick={() => setActiveSubTab("check")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "check"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.nav.checkSuggestionStatus}</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SUBMIT NEW SUGGESTION */}
      {activeSubTab === "submit" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {receiptResult ? (
            /* One-Time Credentials Display */
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Taklifingiz muvaffaqiyatli qabul qilindi!</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    {t.suggestions.credentialsWarning}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {t.suggestions.receiptCodeLabel}
                  </span>
                  <div className="mt-2 text-xl font-mono font-bold text-sky-600 dark:text-sky-400 select-all">
                    {receiptResult.receiptCode}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Murojaatingizning ochiq kodi</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {t.suggestions.secretTokenLabel}
                  </span>
                  <div className="mt-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 select-all break-all">
                    {receiptResult.secretToken}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Hech kimga bermang, faqat sizda qoladi</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? "Nusxa olindi!" : t.suggestions.copyCredentials}</span>
                </button>
                <button
                  onClick={() => {
                    setCheckCode(receiptResult.receiptCode);
                    setCheckSecret(receiptResult.secretToken);
                    setActiveSubTab("check");
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.suggestions.checkStatusLink}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{t.suggestions.privacyNotice}</span>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                  {submitError}
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.suggestions.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="academic">{t.suggestions.categoryAcademic}</option>
                  <option value="facilities">{t.suggestions.categoryFacilities}</option>
                  <option value="catering">{t.suggestions.categoryCatering}</option>
                  <option value="events">{t.suggestions.categoryEvents}</option>
                  <option value="general">{t.suggestions.categoryGeneral}</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.suggestions.subjectLabel}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.suggestions.subjectPlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.suggestions.contentLabel}
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t.suggestions.contentPlaceholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-y"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span>{isSubmitting ? t.common.loading : t.suggestions.submitButton}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUBTAB 2: CHECK SUGGESTION STATUS */}
      {activeSubTab === "check" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.suggestions.checkTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Murojaat yuborganingizda berilgan kvitansiya kodi va sirli kalitingizni kiriting.
            </p>

            {/* Quick Demo Pre-Fill Hint */}
            <div className="p-3 mb-4 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between">
              <span>Namunaviy kvitansiyani tekshirib ko'rish:</span>
              <button
                type="button"
                onClick={() => {
                  setCheckCode("NPS-DEMO1234");
                  setCheckSecret("sec_demo_token_1234");
                }}
                className="px-2.5 py-1 rounded bg-sky-600 text-white text-[11px] font-semibold hover:bg-sky-700 transition-colors"
              >
                Kiritish (NPS-DEMO1234)
              </button>
            </div>

            <form onSubmit={handleCheckStatus} className="space-y-4">
              {checkError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                  {checkError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.suggestions.receiptCodeLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={checkCode}
                    onChange={(e) => setCheckCode(e.target.value)}
                    placeholder="Masalan: NPS-DEMO1234"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.suggestions.secretTokenLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={checkSecret}
                    onChange={(e) => setCheckSecret(e.target.value)}
                    placeholder="sec_..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChecking}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Search className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                  <span>{isChecking ? t.common.loading : t.suggestions.checkButton}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Result Card */}
          {lookupResult && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kvitansiya: {lookupResult.receiptCode}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {lookupResult.title}
                  </h4>
                </div>
                <div>{getStatusBadge(lookupResult.status)}</div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <span className="font-semibold text-slate-500 block mb-1">Murojaat matni:</span>
                {lookupResult.content}
              </div>

              {/* Official Response */}
              <div className="p-4 rounded-xl border border-sky-100 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-sky-800 dark:text-sky-300 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{t.suggestions.officialResponse}</span>
                </div>
                {lookupResult.officialResponse ? (
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {lookupResult.officialResponse}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {t.suggestions.noResponseYet}
                  </p>
                )}
                {lookupResult.respondedAt && (
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Javob berilgan vaqt: {new Date(lookupResult.respondedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
