"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export function WorkloadModule() {
  const { t } = useI18n();

  // Fictional dates with assignments & estimated workload (minutes)
  const workloadSchedule = [
    {
      date: "2026-10-22",
      dayNameUz: "Payshanba",
      dayNameEn: "Thursday",
      totalMinutes: 60,
      tasks: [
        { subject: "Kengaytirilgan Matematika", title: "Trigonometrik tenglamalar", minutes: 60, isMajor: false },
      ],
    },
    {
      date: "2026-10-24",
      dayNameUz: "Shanba",
      dayNameEn: "Saturday",
      totalMinutes: 90,
      tasks: [
        { subject: "Fizika va Mexanika", title: "Laboratoriya hisoboti", minutes: 90, isMajor: true },
      ],
    },
    {
      date: "2026-10-25",
      dayNameUz: "Yakshanba",
      dayNameEn: "Sunday",
      totalMinutes: 165, // OVERLOAD (>120 mins threshold!)
      tasks: [
        { subject: "Akademik Ingliz tili", title: "Critical Essay (500 words)", minutes: 75, isMajor: true },
        { subject: "Informatika va Algoritmlar", title: "Dinamik Dasturlash Masalalari", minutes: 90, isMajor: true },
      ],
    },
    {
      date: "2026-10-28",
      dayNameUz: "Chorshanba",
      dayNameEn: "Wednesday",
      totalMinutes: 45,
      tasks: [
        { subject: "Kimyo", title: "Organik reaksiyalar balansi", minutes: 45, isMajor: false },
      ],
    },
  ];

  const [proposedDate, setProposedDate] = useState<string | null>(null);
  const [proposalSent, setProposalSent] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Yuklama Muvofiqlashtirish Tizimi</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.workload.title} (10-A Sinf)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O'qituvchilar belgilagan vaqt asosida o'quvchilarning umumiy uy vazifalari miqdori
          </p>
        </div>
      </div>

      {/* Threshold Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start space-x-3 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs">{t.workload.warningTitle}</h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            {t.workload.warningDescription} (25-oktabr kuni 2 ta yirik topshiriq va jami 165 daqiqa yuklama rejalashtirilgan).
          </p>
        </div>
      </div>

      {/* Workload Calendar Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workloadSchedule.map((day) => {
          const isOverloaded = day.totalMinutes > 120;
          return (
            <div
              key={day.date}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isOverloaded
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {day.dayNameUz}
                  </h4>
                  <span className="text-[11px] text-slate-400">{day.date}</span>
                </div>
                <Badge variant={isOverloaded ? "warning" : "default"}>
                  {day.totalMinutes} daq
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Kunlik sig'im</span>
                  <span>{Math.round((day.totalMinutes / 120) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isOverloaded ? "bg-amber-500" : "bg-sky-500"}`}
                    style={{ width: `${Math.min(100, (day.totalMinutes / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Tasks list */}
              <div className="space-y-2">
                {day.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1"
                  >
                    <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                      {task.subject}
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {task.title}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.minutes} daqiqa</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Reschedule action for overloaded day */}
              {isOverloaded && (
                <div className="pt-2">
                  {proposalSent ? (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ko'chirish taklifi yuborildi</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setProposalSent(true);
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-semibold text-xs transition-colors"
                    >
                      {t.workload.proposeReschedule}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
