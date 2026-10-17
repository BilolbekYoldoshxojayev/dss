"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  CalendarDays,
  Clock,
  CheckSquare,
  Award,
  Bell,
  MessageSquareLock,
  Wrench,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface StudentProps {
  onNavigate: (tab: string) => void;
}

export function StudentDashboardModule({ onNavigate }: StudentProps) {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Namangan Prezident Maktabi • 10-A Sinf</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Xush kelibsiz, {user?.fullName}!
          </h2>
          <p className="text-xs md:text-sm text-sky-100 mt-1 max-w-xl">
            Bugun 4 ta darsingiz bor. Birinchi dars: <strong>08:30 da Kengaytirilgan Matematika (302-xona)</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate("suggestions")}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-md hover:bg-sky-50 transition-colors"
          >
            <MessageSquareLock className="w-4 h-4 text-emerald-600" />
            <span>Anonim taklif</span>
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("timetable")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-sky-400 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Bugungi Darslar</span>
            <CalendarDays className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">4 ta dars</div>
          <span className="text-[11px] text-sky-600 font-semibold flex items-center space-x-1">
            <span>Dars jadvalini ko'rish</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate("assignments")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-sky-400 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Aktiv Vazifalar</span>
            <CheckSquare className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">3 ta topshiriq</div>
          <span className="text-[11px] text-amber-600 font-semibold flex items-center space-x-1">
            <span>Topshirish va baholar</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate("workload")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-sky-400 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Haftalik Yuklama</span>
            <Clock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">Normal</div>
          <span className="text-[11px] text-purple-600 font-semibold flex items-center space-x-1">
            <span>Yuklama taqvimi</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate("attendance")}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-sky-400 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Davomat Ko'rsatkichi</span>
            <Award className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">97.5%</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <span>Qatnashish tarixi</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Bugungi darslar taqvimi (Dushanba)
            </h3>
            <button
              onClick={() => onNavigate("timetable")}
              className="text-xs text-sky-600 font-semibold hover:underline"
            >
              To'liq jadval &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {[
              { time: "08:30 - 09:15", name: "Kengaytirilgan Matematika", teacher: "Jasur Rahimov", room: "302-xona", active: true },
              { time: "09:25 - 10:10", name: "Fizika va Mexanika", teacher: "Bobur Alimov", room: "Fizika Lab 1", active: false },
              { time: "10:30 - 11:15", name: "Akademik Ingliz tili", teacher: "Malika Usmanova", room: "204-xona", active: false },
              { time: "11:25 - 12:10", name: "Informatika va Algoritmlar", teacher: "Jasur Rahimov", room: "Kompyuter Lab 2", active: false },
            ].map((cls, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  cls.active
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850"
                }`}
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400">
                    {cls.time}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {cls.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">O'qituvchi: {cls.teacher}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    {cls.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements & Fast Tickets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Muhim e'lonlar
            </h3>
            <button
              onClick={() => onNavigate("announcements")}
              className="text-xs text-sky-600 font-semibold hover:underline"
            >
              Barcha e'lonlar &rarr;
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="error">Shoshilinch</Badge>
                <span className="text-[10px] text-slate-400">Kecha, 08:00</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Respublika Fan Olimpiadasining maktab saralash bosqichi
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Matematika, Fizika va Kimyo fanlaridan 25-oktabr kuni saralash o'tkaziladi.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="default">Tadbir</Badge>
                <span className="text-[10px] text-slate-400">14-oktabr</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Kuzgi Robototexnika va STEM Ko'rgazmasi
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                28-oktabr kuni soat 14:00 da maktab asosiy zalida o'tkaziladi.
              </p>
            </div>
          </div>

          {/* Smartboard support shortcut */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate("facilities")}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-sky-600" />
              <span>Smartboard yoki IT nosozligi haqida xabar berish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
