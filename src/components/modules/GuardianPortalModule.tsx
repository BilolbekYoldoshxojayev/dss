"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  HeartHandshake,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  UserCheck
} from "lucide-react";

export function GuardianPortalModule() {
  const { user } = useAuth();
  const { t } = useI18n();

  // Fictional linked child for Farhod Toirov -> Azamat Toirov (10-A)
  const child = {
    name: "Azamat Toirov",
    gradeLevel: 10,
    section: "A",
    curator: "Jasur Rahimov",
    attendanceRate: "97.5%",
    recentGrades: [
      { subject: "Kengaytirilgan Matematika", task: "Trigonometrik tenglamalar", score: 95, max: 100, date: "2026-10-18" },
      { subject: "Fizika", task: "Nyuton qonunlari tajribasi", score: 92, max: 100, date: "2026-10-14" },
      { subject: "Akademik Ingliz tili", task: "Insholar tahlili", score: 88, max: 100, date: "2026-10-10" },
    ],
    upcomingTasks: [
      { subject: "Fizika", title: "Laboratoriya hisoboti", dueDate: "2026-10-24", minutes: 90 },
      { subject: "Akademik Ingliz tili", title: "Critical Essay", dueDate: "2026-10-25", minutes: 75 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tasdiqlangan Ota-ona Hisobi</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.guardian.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Farzandingizning maktabdagi davomati, o'zlashtirish ko'rsatkichlari va yaqinlashayotgan vazifalari
          </p>
        </div>

        {/* Selected Child Pill */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
            AT
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">{t.guardian.childSelect}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {child.name} (10-A Sinf)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Davomat Ko'rsatkichi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{child.attendanceRate}</div>
          <span className="text-[11px] text-slate-400">Joriy 1-chorak bo'yicha</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>O'rtacha Baho</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">91.7 ball</div>
          <span className="text-[11px] text-emerald-600 font-semibold">A'lo (GPA: 4.8 / 5.0)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Sinf Rahbari (Kurator)</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">{child.curator}</div>
          <span className="text-[11px] text-slate-400">+998 (69) 227-10-00</span>
        </div>
      </div>

      {/* Two Column Progress & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {t.guardian.academicProgress} (Oxirgi Baholar)
          </h3>
          <div className="space-y-3">
            {child.recentGrades.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{g.subject}</h4>
                  <span className="text-[11px] text-slate-500">{g.task}</span>
                </div>
                <div className="text-right">
                  <Badge variant="success">{g.score} / {g.max}</Badge>
                  <span className="block text-[10px] text-slate-400 mt-1">{g.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {t.guardian.upcomingTasks}
          </h3>
          <div className="space-y-3">
            {child.upcomingTasks.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.subject}</h4>
                  <span className="text-[11px] text-slate-500">{t.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold block">{t.dueDate}</span>
                  <span className="text-[10px] text-slate-400 flex items-center justify-end space-x-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>~{t.minutes} daqiqa</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
