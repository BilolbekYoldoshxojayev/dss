"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import { Badge } from "@/components/ui/Badge";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Check
} from "lucide-react";

export function AttendanceModule() {
  const { user, role } = useAuth();
  const { t } = useI18n();

  // Fictional Student Roster for 10-A
  const [students, setStudents] = useState([
    { id: "usr-stu-01", name: "Azamat Toirov", status: "present", notes: "" },
    { id: "usr-stu-02", name: "Madina Zaripova", status: "present", notes: "" },
    { id: "usr-stu-03", name: "Jasurbek Soliyev", status: "late", notes: "5 daqiqa kechikdi" },
    { id: "usr-stu-04", name: "Sabina Aliyeva", status: "absent", notes: "Kasal (shifokor ma'lumotnomasi kutilmoqda)" },
    { id: "usr-stu-05", name: "Otabek Qodirov", status: "excused", notes: "Fan olimpiadasida" },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="success">{t.attendance.present}</Badge>;
      case "absent":
        return <Badge variant="error">{t.attendance.absent}</Badge>;
      case "late":
        return <Badge variant="warning">{t.attendance.late}</Badge>;
      case "excused":
        return <Badge variant="info">{t.attendance.excused}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Davomat va Nazorat</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.attendance.title} (10-A Sinf)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dars mashg'ulotlariga qatnashish qaydnomasi va oylik ko'rsatkichlar
          </p>
        </div>

        {/* Stats card */}
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">{t.attendance.overallRate}</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">96.4%</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Bugungi dars davomati: <strong>Kengaytirilgan Matematika (1-dars)</strong>
          </h3>
          {role === "teacher" && (
            <button
              onClick={handleSaveAttendance}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? t.common.success : t.common.save}</span>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">O'quvchi F.I.Sh.</th>
                <th className="py-3 px-3">Holati</th>
                {role === "teacher" && <th className="py-3 px-3">Belgilash</th>}
                <th className="py-3 px-3">Izoh / Sabab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {stu.name}
                  </td>
                  <td className="py-3 px-3">{getStatusBadge(stu.status)}</td>
                  {role === "teacher" && (
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1">
                        {(["present", "absent", "late", "excused"] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(stu.id, st)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                              stu.status === st
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            {st === "present" ? "Bor" : st === "absent" ? "Yo'q" : st === "late" ? "Kech" : "Sababli"}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {stu.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
