"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  Search,
  BookOpen,
  Shield,
  HelpCircle,
  ExternalLink,
  Calendar,
  Layers
} from "lucide-react";

export function KnowledgeBaseModule() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const policies = [
    {
      id: "pol-01",
      title: "Namangan Prezident Maktabi Ichki Tartib Qoidalari",
      category: "handbook",
      categoryName: "Qoidalar to'plami",
      version: "v2.1 (2026-nashr)",
      effectiveDate: "2026-09-01",
      content:
        "O'quvchilar maktab hududida belgilangan rasmiy formada yurishlari, dars mashg'ulotlariga 10 daqiqa oldin yetib kelishlari, akademik halollik, o'qituvchilar va tengdoshlarga hurmat ko'rsatishlari shart. Smartfonlardan dars vaqtida faqat o'qituvchi topshirig'iga binoan foydalaniladi.",
    },
    {
      id: "pol-02",
      title: "Akademik Halollik va Plagiatga Qarshi Siyosat",
      category: "academic",
      categoryName: "Akademik tartib",
      version: "v1.4",
      effectiveDate: "2026-09-01",
      content:
        "Topshiriqlar va loyiha ishlari o'quvchi tomonidan mustaqil bajarilishi shart. Boshqa manbalar yoki tengdoshlar ishidan ko'chirib olish qat'iyan taqiqlanadi. Sun'iy intellekt vositalaridan ruxsat etilgan vazifalarda manba sifatida ko'rsatilgan holda foydalanish mumkin.",
    },
    {
      id: "pol-03",
      title: "IT va Laboratoriya Xonalari Xavfsizlik Yo'riqnomasi",
      category: "it",
      categoryName: "IT va Texnika",
      version: "v1.2",
      effectiveDate: "2026-09-15",
      content:
        "Kompyuter sinflari va smartboard qurilmalariga ehtiyotkorlik bilan munosabatda bo'lish, ruxsatsiz dasturiy ta'minot o'rnatmaslik va kabel ulanishlarini o'zboshimchalik bilan o'zgartirmaslik talab etiladi. Nosozlik aniqlanganda darhol 'IT so'rovi' orqali ariza qoldiring.",
    },
    {
      id: "pol-04",
      title: "Davomat, Dars Qoldirish va Sababli Hujjatlar Tartibi",
      category: "academic",
      categoryName: "Davomat",
      version: "v2.0",
      effectiveDate: "2026-09-01",
      content:
        "O'quvchi betob bo'lib dars qoldirgan taqdirda, ota-onalar 24 soat ichida sinf rahbarini xabardor qilishlari va 3 kundan ortiq qoldirilganda shifokor ma'lumotnomasini taqdim etishlari shart.",
    },
  ];

  const filtered = policies.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rasmiy Hujjatlar va Yo'riqnomalar</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.nav.knowledgeBase}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maktab tartib-qoidalari, xavfsizlik yo'riqnomalari va me'yoriy nizomlar
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qoidalardan qidirish..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Barchasi" },
          { id: "handbook", label: "Ichki tartib" },
          { id: "academic", label: "Akademik siyosat" },
          { id: "it", label: "IT va Texnika" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === tab.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pol) => (
          <div
            key={pol.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                  {pol.categoryName}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {pol.version}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {pol.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pol.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Kuchga kirgan sana: {pol.effectiveDate}</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Amaldagi</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
