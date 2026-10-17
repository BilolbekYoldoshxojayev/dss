"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  User,
  Plus,
  Sparkles,
  Layers
} from "lucide-react";

export function ProjectsModule() {
  const { user } = useAuth();
  const { t } = useI18n();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (res.ok) {
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error("Projects error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Innovatsion Loyihalar va Ilmiy Izlanishlar</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.nav.projects}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O'quvchilarning ilmiy-amaliy startaplari, STEM loyihalari va mentorlik hamkorligi
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400 p-8 text-center">{t.common.loading}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((prj) => (
            <div
              key={prj.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-sky-300 dark:hover:border-sky-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <Badge variant="default">{prj.category}</Badge>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {prj.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {prj.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {prj.description}
                </p>
              </div>

              {/* Mentorship & Lead */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                <div>Loyiha rahbari: <strong>{prj.leadStudentName}</strong></div>
                <div>Ilmiy mentor: <strong>{prj.mentorName}</strong></div>
              </div>

              {/* Milestones Checklist */}
              {prj.milestones && prj.milestones.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bosqichlar (Milestones):
                  </span>
                  <div className="space-y-1.5">
                    {prj.milestones.map((m: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        {m.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        )}
                        <span className={m.done ? "text-slate-500 line-through" : "text-slate-800 dark:text-slate-200 font-medium"}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
