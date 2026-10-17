"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  BookmarkPlus
} from "lucide-react";

export function EventsClubsModule() {
  const { user } = useAuth();
  const { t } = useI18n();

  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"events" | "clubs">("events");
  const [isLoading, setIsLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (res.ok) {
          setEvents(data.events || []);
          setClubs(data.clubs || []);
        }
      } catch (err) {
        console.error("Events fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        setRegisteredEvents([...registeredEvents, eventId]);
        setEvents(
          events.map((e) =>
            e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
          )
        );
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maktab Hayoti va To'garaklar</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.nav.events}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Olimpiadalar, STEM mahorat darslari, to'garaklar va madaniy tadbirlar
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "events"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Tadbirlar ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "clubs"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            To'garaklar ({clubs.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400 p-8 text-center">{t.common.loading}</p>
      ) : activeTab === "events" ? (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => {
            const isReg = registeredEvents.includes(ev.id);
            const isFull = ev.registeredCount >= ev.capacity;

            return (
              <div
                key={ev.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="capitalize">{ev.category}</Badge>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ev.registeredCount} / {ev.capacity} o'rin</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="pt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sana: {ev.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Vaqt: {ev.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joy: {ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="w-32 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (ev.registeredCount / ev.capacity) * 100)}%` }}
                    />
                  </div>

                  {isReg ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ro'yxatdan o'tildi</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(ev.id)}
                      disabled={isFull}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-semibold text-xs transition-colors shadow-sm"
                    >
                      {isFull ? "O'rinlar to'ldi" : "Ro'yxatdan o'tish"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Clubs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubs.map((cl) => (
            <div
              key={cl.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {cl.name}
                </h3>
                <Badge variant="success">{cl.memberCount} a'zo</Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cl.description}
              </p>

              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div>Rahbar: <strong>{cl.leaderName}</strong></div>
                <div>Mashg'ulot vaqti: <strong>{cl.meetingSchedule}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
