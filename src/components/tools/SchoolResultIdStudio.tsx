"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  GraduationCap,
  Plus,
  Trash2,
  Sparkles,
  Download,
  CreditCard,
  User,
  Building,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface SubjectGrade {
  name: string;
  marks: number;
}

export function SchoolResultIdStudio() {
  const [mode, setMode] = useState<"marksheet" | "idcard">("marksheet");
  const [instituteName, setInstituteName] = useState("রাজশাহী কলেজিয়েট স্কুল");
  const [studentName, setStudentName] = useState("মো: তানভীর আহমেদ");
  const [studentRoll, setStudentRoll] = useState("১০২");
  const [studentClass, setStudentClass] = useState("১০ম শ্রেণি (বিজ্ঞান)");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [guardianPhone, setGuardianPhone] = useState("01712-345678");

  const [subjects, setSubjects] = useState<SubjectGrade[]>([
    { name: "বাংলা (Bangla)", marks: 82 },
    { name: "ইংরেজি (English)", marks: 78 },
    { name: "উচ্চতর গণিত (Math)", marks: 92 },
    { name: "পদার্থবিজ্ঞান (Physics)", marks: 86 },
    { name: "রসায়ন (Chemistry)", marks: 84 },
  ]);

  const calculateGradePoint = (marks: number) => {
    if (marks >= 80) return { grade: "A+", gpa: 5.0 };
    if (marks >= 70) return { grade: "A", gpa: 4.0 };
    if (marks >= 60) return { grade: "A-", gpa: 3.5 };
    if (marks >= 50) return { grade: "B", gpa: 3.0 };
    if (marks >= 40) return { grade: "C", gpa: 2.0 };
    if (marks >= 33) return { grade: "D", gpa: 1.0 };
    return { grade: "F", gpa: 0.0 };
  };

  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const avgGpa =
    subjects.length > 0
      ? (subjects.reduce((sum, s) => sum + calculateGradePoint(s.marks).gpa, 0) / subjects.length).toFixed(2)
      : "0.00";

  const handleLoadSample = () => {
    sound.click();
    setInstituteName("ঢাকা রেসিডেন্সিয়াল মডেল কলেজ");
    setStudentName("রাকিবুল হাসান");
    setStudentRoll("১০৫");
    setStudentClass("দ্বাদশ শ্রেণি");
    setBloodGroup("O+");
    setGuardianPhone("01811-223344");
    setSubjects([
      { name: "বাংলা", marks: 88 },
      { name: "ইংরেজি", marks: 82 },
      { name: "পদার্থ", marks: 95 },
      { name: "রসায়ন", marks: 89 },
      { name: "জীববিজ্ঞান", marks: 91 },
    ]);
  };

  const exportPayload = {
    instituteName,
    studentName,
    studentRoll,
    studentClass,
    bloodGroup,
    totalMarks,
    avgGpa,
    subjects,
  };

  return (
    <StudioWorkspaceShell
      toolSlug="school-result-id-studio"
      toolTitle="School Result Marksheet & Student ID Studio"
      category="Education & Career"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Student", value: studentName.slice(0, 20) },
        { label: "Class & Roll", value: `${studentClass} · ${studentRoll}` },
        { label: "Average GPA", value: `GPA ${avgGpa}` },
        { label: "Total Marks", value: `${totalMarks} / ${subjects.length * 100}` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setMode("marksheet")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                mode === "marksheet" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              মার্কশিট ও গ্রেড পয়েন্ট
            </button>
            <button
              onClick={() => setMode("idcard")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                mode === "idcard" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              স্টুডেন্ট আইডি কার্ড
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">শিক্ষা প্রতিষ্ঠানের নাম</label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">শিক্ষার্থীর নাম</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">রোল নম্বর</label>
              <input
                type="text"
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">শ্রেণি / বিভাগ</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">ব্লাড গ্রুপ</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-amber-400"
              />
            </div>
          </div>

          {mode === "marksheet" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">বিষয় ও প্রাপ্ত নম্বর</label>
              {subjects.map((sub, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[i].name = e.target.value;
                      setSubjects(updated);
                    }}
                    className="flex-1 text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
                  />
                  <input
                    type="number"
                    value={sub.marks}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[i].marks = Number(e.target.value);
                      setSubjects(updated);
                    }}
                    className="w-20 text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          {mode === "marksheet" ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-xl">
              <div className="text-center border-b border-neutral-800 pb-3 space-y-1">
                <h3 className="text-base font-bold text-white">{instituteName}</h3>
                <p className="text-xs text-neutral-400">একাডেমিক মূল্যায়ন ও মার্কশিট</p>
                <p className="text-xs font-mono text-amber-400">
                  {studentName} · রোল: {studentRoll} · {studentClass}
                </p>
              </div>

              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="pb-2">বিষয়</th>
                    <th className="pb-2">নম্বর</th>
                    <th className="pb-2">গ্রেড</th>
                    <th className="pb-2">জিপিএ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {subjects.map((s, idx) => {
                    const { grade, gpa } = calculateGradePoint(s.marks);
                    return (
                      <tr key={idx}>
                        <td className="py-2 text-white font-medium">{s.name}</td>
                        <td className="py-2 font-mono text-neutral-300">{s.marks}</td>
                        <td className="py-2 font-mono font-bold text-amber-400">{grade}</td>
                        <td className="py-2 font-mono text-emerald-400">{gpa.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between font-mono">
                <span className="text-neutral-400">মোট নম্বর: {totalMarks}</span>
                <span className="text-sm font-bold text-emerald-400">গড় ফলাফল: GPA {avgGpa}</span>
              </div>
            </div>
          ) : (
            /* Student ID Card Layout */
            <div className="max-w-sm mx-auto rounded-3xl border-2 border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 text-center space-y-4 shadow-2xl">
              <div className="space-y-0.5 border-b border-neutral-800 pb-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">STUDENT IDENTITY CARD</span>
                <h3 className="text-sm font-bold text-white">{instituteName}</h3>
              </div>

              <div className="h-24 w-24 rounded-2xl bg-neutral-800 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-3xl">
                🎓
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{studentName}</h4>
                <p className="text-xs text-neutral-400 font-mono">রোল: {studentRoll} · {studentClass}</p>
                <p className="text-xs text-rose-400 font-bold font-mono">রক্তের গ্রুপ: {bloodGroup}</p>
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono">
                জরুরি যোগাযোগ: {guardianPhone}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
