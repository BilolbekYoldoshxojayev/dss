"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { TimetableSlot } from "@/types";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export function TimetableModule() {
  const { user, role } = useAuth();
  const { locale, t } = useI18n();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Monday
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const days = [
    { id: 1, nameUz: "Dushanba", nameEn: "Monday" },
    { id: 2, nameUz: "Seshanba", nameEn: "Tuesday" },
    { id: 3, nameUz: "Chorshanba", nameEn: "Wednesday" },
    { id: 4, nameUz: "Payshanba", nameEn: "Thursday" },
    { id: 5, nameUz: "Juma", nameEn: "Friday" },
  ];

  useEffect(() => {
    async function loadTimetable() {
      setIsLoading(true);
      try {
        let url = "/api/timetable";
        if (role === "student" && user?.gradeLevel && user?.section) {
          url += `?gradeLevel=${user.gradeLevel}&section=${user.section}`;
        } else if (role === "teacher" && user?.fullName) {
          url += `?teacherName=${encodeURIComponent(user.fullName)}`;
        } else {
          // Director or Manager view 10-A by default
          url += `?gradeLevel=10&section=A`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setSlots(data.slots || []);
        }
      } catch (err) {
        console.error("Timetable fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTimetable();
  }, [role, user]);

  const currentDaySlots = slots
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Asia/Tashkent (UTC+5)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.nav.timetable} {role === "student" ? `(10-A Sinf)` : ""}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Darslar, xonalar va o'qituvchilarning haftalik taqvimi
          </p>
        </div>

        {/* Day Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDay === day.id
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {locale === "uz" ? day.nameUz.substring(0, 3) : day.nameEn.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>{locale === "uz" ? days.find((d) => d.id === selectedDay)?.nameUz : days.find((d) => d.id === selectedDay)?.nameEn} jadvali</span>
          <span className="text-slate-400 font-normal">({currentDaySlots.length} ta dars)</span>
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">{t.common.loading}</div>
        ) : currentDaySlots.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <span>Bugun uchun dars jadvali belgilanmagan</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDaySlots.map((slot, index) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-sky-300 dark:hover:border-sky-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-mono font-semibold">
                    <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {index + 1}-dars
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {slot.subjectName}
                  </h4>
                  <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.teacherName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-200">{slot.room}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
