"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Play
} from "lucide-react";

export function CsvImportModule() {
  const { role } = useAuth();
  const { t } = useI18n();

  const [entityType, setEntityType] = useState("students");
  const [csvContent, setCsvContent] = useState(
    "fullname,email,gradelevel,section\n" +
    "Shaxzod Alimov,shaxzod.alimov@student.namps.uz,10,A\n" +
    "Nilufar Yoqubova,nilufar.yoqubova@student.namps.uz,10,A\n" +
    "Jahongir Qosimov,jahongir.qosimov@student.namps.uz,10,B"
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownloadTemplate = () => {
    let template = "";
    if (entityType === "students") {
      template = "fullname,email,gradelevel,section\nAli Valiyev,ali.valiyev@student.namps.uz,9,A\n";
    } else if (entityType === "teachers") {
      template = "fullname,email,subject\nSardor Ergashev,sardor.ergashev@namps.uz,Matematika\n";
    } else {
      template = "gradelevel,section,room\n10,A,302-xona\n";
    }

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `namps_${entityType}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRun = async (dryRun: boolean) => {
    setIsProcessing(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/import/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          csvContent,
          isDryRun: dryRun,
          callerRole: role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setResult({ success: false, errors: data.errors });
        } else {
          setErrorMsg(data.error || "Import xatosi yuz berdi");
        }
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Maktab Serveriga Ma'lumotlarni Ko'chirish</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.common.importCsv} — Ommaviy Ma'lumotlarni Yuklash
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O'quvchilar, o'qituvchilar va jadvallarni CSV fayli orqali xavfsiz tekshirib import qilish
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>{t.common.downloadTemplate}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Entity Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Qaysi bo'lim ma'lumotlarini import qilmoqchisiz?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "students", label: "O'quvchilar (Students)" },
              { id: "teachers", label: "O'qituvchilar (Teachers)" },
              { id: "classes", label: "Sinflar (Classes)" },
            ].map((ent) => (
              <button
                key={ent.id}
                type="button"
                onClick={() => setEntityType(ent.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  entityType === ent.id
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mb-1 text-slate-400" />
                <span>{ent.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CSV Editor Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            CSV Matni yoki fayl mazmuni (Vergul bilan ajratilgan):
          </label>
          <textarea
            rows={7}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result & Preview Box */}
        {result && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-3 ${
              result.success
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{result.message || "Validatsiya natijasi"}</span>
            </div>

            {result.preview && (
              <div className="space-y-1">
                <span className="font-semibold block">Tekshiruvdan o'tgan dastlabki qatorlar:</span>
                <pre className="p-2 rounded bg-white/60 dark:bg-slate-900/60 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(result.preview, null, 2)}
                </pre>
              </div>
            )}

            {result.errors && (
              <ul className="list-disc pl-5 space-y-0.5 text-rose-700 dark:text-rose-300">
                {result.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRun(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <FileCheck className="w-4 h-4 text-slate-500" />
            <span>Tekshirish (Xatoliklarni qidirish / Dry-run)</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRun(false)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>Tizimga Import Qilish (Bajarish)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
