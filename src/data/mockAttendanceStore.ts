// ====== Attendance Store — Điểm danh do Giáo vụ quản lý ======
import { useSyncExternalStore } from 'react';
import { classRosters, type EvaluationAttendance } from './mockClassReports';
import { classReports } from './mockClassReports';

export type { EvaluationAttendance };

export interface AttendanceEntry {
  id: string;
  className: string;
  sessionDate: string;   // dd/mm/yyyy
  sessionLabel: string;  // e.g. "Buổi 1 — Orientation..."
  studentId: string;
  studentName: string;
  status: EvaluationAttendance;
  note?: string;
}

export interface SessionInfo {
  className: string;
  sessionDate: string;
  sessionLabel: string;
  sessionOrder: number;
}

// Derive unique sessions from classReports seed data
export const getSessionsForClass = (className: string): SessionInfo[] => {
  const seen = new Set<string>();
  const result: SessionInfo[] = [];
  classReports
    .filter((r) => r.className === className)
    .sort((a, b) => a.sessionOrder - b.sessionOrder)
    .forEach((r) => {
      const key = `${r.className}||${r.sessionDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          className: r.className,
          sessionDate: r.sessionDate,
          sessionLabel: `Buổi ${r.sessionOrder} — ${r.sessionTitle}`,
          sessionOrder: r.sessionOrder,
        });
      }
    });
  return result;
};

// Seed initial attendance from classReports evaluations
const buildSeed = (): AttendanceEntry[] => {
  const entries: AttendanceEntry[] = [];
  classReports.forEach((r) => {
    r.evaluations.forEach((ev) => {
      entries.push({
        id: `ATT-${r.id}-${ev.studentId}`,
        className: r.className,
        sessionDate: r.sessionDate,
        sessionLabel: `Buổi ${r.sessionOrder} — ${r.sessionTitle}`,
        studentId: ev.studentId,
        studentName: ev.studentName,
        status: ev.attendance,
        note: ev.comment,
      });
    });
  });
  return entries;
};

// ====== Mutable reactive store ======
type Listener = () => void;
const listeners = new Set<Listener>();
let state: AttendanceEntry[] = buildSeed();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

export const attendanceStore = {
  getAll(): AttendanceEntry[] {
    return state;
  },

  getByClass(className: string): AttendanceEntry[] {
    return state.filter((e) => e.className === className);
  },

  getBySession(className: string, sessionDate: string): AttendanceEntry[] {
    return state.filter((e) => e.className === className && e.sessionDate === sessionDate);
  },

  isSessionDone(className: string, sessionDate: string): boolean {
    return state.some((e) => e.className === className && e.sessionDate === sessionDate);
  },

  upsert(entry: AttendanceEntry) {
    const idx = state.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      state = [...state.slice(0, idx), entry, ...state.slice(idx + 1)];
    } else {
      state = [...state, entry];
    }
    emit();
  },

  bulkSave(className: string, sessionDate: string, sessionLabel: string, entries: { studentId: string; studentName: string; status: EvaluationAttendance; note?: string }[]) {
    entries.forEach((e) => {
      const id = `ATT-${className}-${sessionDate}-${e.studentId}`.replace(/\s+/g, '_').replace(/\//g, '-');
      this.upsert({ id, className, sessionDate, sessionLabel, studentId: e.studentId, studentName: e.studentName, status: e.status, note: e.note });
    });
  },

  /** Danh sách lớp + thống kê */
  getClassSummaries(): { className: string; totalSessions: number; doneSessions: number; roster: { studentId: string; studentName: string }[] }[] {
    return Object.entries(classRosters).map(([className, roster]) => {
      const sessions = getSessionsForClass(className);
      const done = sessions.filter((s) => this.isSessionDone(className, s.sessionDate)).length;
      return { className, totalSessions: sessions.length, doneSessions: done, roster };
    });
  },
};

export const useAttendanceStore = (): AttendanceEntry[] =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
