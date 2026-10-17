"use client";

import React from "react";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  ShieldCheck,
  MessageSquareLock
} from "lucide-react";

interface DirectorProps {
  onNavigateToSuggestions: () => void;
}

export function DirectorDashboardModule({ onNavigateToSuggestions }: DirectorProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Maktab Rahbariyati va Boshqaruv Nazorati</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Namangan Prezident Maktabi Boshqaruv Paneli
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Maktab faoliyati, ta'lim sifati, o'qituvchilar yuklamasi va o'quvchilar takliflarining umumiy statistikasi
          </p>
        </div>

        <button
          onClick={onNavigateToSuggestions}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md transition-colors self-start md:self-auto shrink-0"
        >
          <MessageSquareLock className="w-4 h-4" />
          <span>Anonim takliflarni ko'rib chiqish</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Jami O'quvchilar</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">168 nafar</div>
          <span className="text-[11px] text-emerald-600 font-medium">5 - 11 sinflar (100% iqtidorli)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Umumiy Davomat</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">96.8%</div>
          <span className="text-[11px] text-slate-400">Joriy chorak bo'yicha</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>O'rtacha Akademik Baho</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">91.4 / 100</div>
          <span className="text-[11px] text-emerald-600 font-medium">+2.1% o'tgan chorakka nisbatan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Yangi Takliflar</span>
            <MessageSquareLock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">2 ta aktiv</div>
          <span className="text-[11px] text-purple-600 font-medium">Ko'rib chiqish kutilmoqda</span>
        </div>
      </div>

      {/* Initiatives & Academic Health Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Improvement Initiatives */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Maktab Rivojlanish Tashabbuslari (2026-2027)
            </h3>
            <span className="text-xs font-semibold text-sky-600">3 ta loyiha</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Kutubxona raqamli resurslar bazasini boyitish",
                owner: "Nodira Karimova (Menejer)",
                progress: 80,
                status: "Yakunlanmoqda",
              },
              {
                title: "Robototexnika laboratoriyasiga yangi mikrokontrollerlar",
                owner: "Jasur Rahimov (STEM koordinatori)",
                progress: 55,
                status: "Jarayonda",
              },
              {
                title: "Catering va o'quvchilar ovqatlanish ratsionini yangilash",
                owner: "Ma'muriy bo'lim",
                progress: 30,
                status: "Boshlandi",
              },
            ].map((init, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">{init.title}</h4>
                  <Badge variant="default">{init.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Mas'ul: {init.owner}</span>
                  <span>{init.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${init.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Overview per Grade Level */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Sinflar Kesimida Akademik O'zlashtirish
            </h3>
            <span className="text-xs text-slate-400">Joriy 1-chorak</span>
          </div>

          <div className="space-y-3">
            {[
              { grade: "11-Sinf", students: 24, avg: 94.2, attendance: "98.1%" },
              { grade: "10-Sinf", students: 26, avg: 92.5, attendance: "97.4%" },
              { grade: "9-Sinf", students: 25, avg: 90.8, attendance: "96.2%" },
              { grade: "8-Sinf", students: 24, avg: 89.6, attendance: "95.8%" },
              { grade: "7-Sinf", students: 23, avg: 91.0, attendance: "96.5%" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{row.grade}</h4>
                  <span className="text-[11px] text-slate-400">{row.students} nafar o'quvchi</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{row.avg} ball</span>
                  <span className="block text-[11px] text-emerald-600 font-semibold">{row.attendance} davomat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
