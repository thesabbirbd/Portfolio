"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  Trophy,
  Target,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Save,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  BoardGrade,
  BoardSubject,
  BOARD_GRADE_POINTS,
  calculateSscHscGpa,
  UniversityCourse,
  calculateUniversityCgpa,
  predictRequiredGpa,
  SAMPLE_SSC_SCIENCE_SUBJECTS,
  DegreeCategory,
  DEGREE_PROGRAMS,
  UGC_GRADE_OPTIONS,
  ProgramCourseDef,
  calculateFullDegreeProgress,
  FullDegreeProgressResult,
} from "@/lib/education/cgpa-grade-engine";
import { sound } from "@/lib/sound";

export function CgpaCalculatorStudio() {
  const [activeTab, setActiveTab] = useState<"board" | "university" | "target">("university");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: SSC/HSC Board State
  const [boardExam, setBoardExam] = useState<"SSC" | "HSC">("SSC");
  const [studentName, setStudentName] = useState("সাকিবুল হাসান");
  const [rollNumber, setRollNumber] = useState("102948");
  const [boardSubjects, setBoardSubjects] = useState<BoardSubject[]>(SAMPLE_SSC_SCIENCE_SUBJECTS);

  // Tab 2: University Full 4-Year Degree State
  const [selectedCategory, setSelectedCategory] = useState<DegreeCategory>("BSC");
  const [selectedProgramKey, setSelectedProgramKey] = useState<string>("bsc_cse");
  const [institutionName, setInstitutionName] = useState("বাংলাদেশ প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (BUET)");
  const [activeYear, setActiveYear] = useState<1 | 2 | 3 | 4>(1);
  const [semestersCourses, setSemestersCourses] = useState<Record<number, ProgramCourseDef[]>>(() => {
    const prog = DEGREE_PROGRAMS.bsc_cse;
    const initialMap: Record<number, ProgramCourseDef[]> = {};
    for (const sem of prog.semesters) {
      initialMap[sem.semesterNumber] = sem.courses.map((c) => ({ ...c }));
    }
    return initialMap;
  });
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Tab 3: Target Solver State
  const [targetCurrentCgpa, setTargetCurrentCgpa] = useState<number>(3.35);
  const [targetCompletedCredits, setTargetCompletedCredits] = useState<number>(65);
  const [targetDesiredCgpa, setTargetDesiredCgpa] = useState<number>(3.6);
  const [targetRemainingCredits, setTargetRemainingCredits] = useState<number>(45);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "cgpa-calculator",
    toolName: "SSC/HSC & University CGPA Studio",
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sabbir_os_cgpa_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedProgramKey && DEGREE_PROGRAMS[parsed.selectedProgramKey]) {
          setSelectedProgramKey(parsed.selectedProgramKey);
          setSelectedCategory(DEGREE_PROGRAMS[parsed.selectedProgramKey].category);
        }
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.institutionName) setInstitutionName(parsed.institutionName);
        if (parsed.semestersCourses) setSemestersCourses(parsed.semestersCourses);
        if (parsed.savedAt) setLastSavedTime(new Date(parsed.savedAt).toLocaleTimeString("bn-BD"));
      }
    } catch {
      // LocalStorage error fallback
    }
  }, []);

  // Auto-save whenever courses change
  const handleSaveToLocalStorage = () => {
    try {
      const now = new Date();
      localStorage.setItem(
        "sabbir_os_cgpa_data",
        JSON.stringify({
          selectedProgramKey,
          studentName,
          institutionName,
          semestersCourses,
          savedAt: now.toISOString(),
        })
      );
      setLastSavedTime(now.toLocaleTimeString("bn-BD"));
      sound.confirm();
    } catch {
      // ignore
    }
  };

  // Switch Degree Program
  const handleSelectProgram = (key: string) => {
    sound.click();
    const prog = DEGREE_PROGRAMS[key];
    if (!prog) return;

    setSelectedProgramKey(key);
    setSelectedCategory(prog.category);

    const newMap: Record<number, ProgramCourseDef[]> = {};
    for (const sem of prog.semesters) {
      newMap[sem.semesterNumber] = sem.courses.map((c) => ({ ...c }));
    }
    setSemestersCourses(newMap);
    setActiveYear(1);
    setActiveStep(1);
  };

  // Calculations
  const boardResult = useMemo(() => calculateSscHscGpa(boardSubjects), [boardSubjects]);
  const degreeResult: FullDegreeProgressResult = useMemo(
    () => calculateFullDegreeProgress(selectedProgramKey, semestersCourses),
    [selectedProgramKey, semestersCourses]
  );
  const targetResult = useMemo(
    () =>
      predictRequiredGpa({
        currentCgpa: targetCurrentCgpa,
        completedCredits: targetCompletedCredits,
        targetCgpa: targetDesiredCgpa,
        remainingCredits: targetRemainingCredits,
      }),
    [targetCurrentCgpa, targetCompletedCredits, targetDesiredCgpa, targetRemainingCredits]
  );

  // Update a single course grade in a semester
  const handleUpdateCourseGrade = (semNum: number, courseId: string, gradePoint: number) => {
    sound.click();
    setSemestersCourses((prev) => {
      const list = prev[semNum] || [];
      const updated = list.map((c) => (c.id === courseId ? { ...c, gradePoint } : c));
      return { ...prev, [semNum]: updated };
    });
    setActiveStep(2);
  };

  // Add a new custom course to a semester
  const handleAddCourseToSemester = (semNum: number) => {
    sound.click();
    const newCourse: ProgramCourseDef = {
      id: `custom-${Date.now()}`,
      code: `COURSE-${semNum}0${(semestersCourses[semNum]?.length || 0) + 1}`,
      name: "নতুন সাবজেক্ট / ল্যাব",
      credits: 3.0,
      gradePoint: 4.0,
    };
    setSemestersCourses((prev) => ({
      ...prev,
      [semNum]: [...(prev[semNum] || []), newCourse],
    }));
  };

  // Remove a course from a semester
  const handleRemoveCourseFromSemester = (semNum: number, courseId: string) => {
    sound.click();
    setSemestersCourses((prev) => ({
      ...prev,
      [semNum]: (prev[semNum] || []).filter((c) => c.id !== courseId),
    }));
  };

  // Reset a semester back to official default syllabus
  const handleResetSemesterToDefault = (semNum: number) => {
    sound.click();
    const prog = DEGREE_PROGRAMS[selectedProgramKey];
    if (!prog) return;
    const defaultSem = prog.semesters.find((s) => s.semesterNumber === semNum);
    if (!defaultSem) return;
    setSemestersCourses((prev) => ({
      ...prev,
      [semNum]: defaultSem.courses.map((c) => ({ ...c })),
    }));
  };

  // Copy Result Summary to Clipboard
  const handleCopySummary = async () => {
    sound.copy();
    const prog = DEGREE_PROGRAMS[selectedProgramKey];
    let text = `🎓 THE SABBiR OS — ৪ বছরের ডিগ্রি ও সিজিপিএ রিপোর্ট\n`;
    text += `👤 শিক্ষার্থী: ${studentName}\n`;
    text += `🏛️ প্রতিষ্ঠান: ${institutionName}\n`;
    text += `📚 ডিগ্রি: ${prog?.titleBn || "বিশ্ববিদ্যালয় ডিগ্রি"}\n`;
    text += `📊 মোট সিজিপিএ (Cumulative CGPA): ${degreeResult.overallCgpa.toFixed(2)} / ৪.০০\n`;
    text += `🏆 ফলাফল গ্রেড: ${degreeResult.letterGrade} (${degreeResult.standingBn})\n`;
    text += `⚡ সম্পন্ন ক্রেডিট: ${degreeResult.totalDegreeCreditsCompleted} Credits\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    for (const yr of degreeResult.years) {
      text += `• ${yr.yearLabelBn}: GPA ${yr.yearGpa.toFixed(2)} (${yr.yearCredits} Credits)\n`;
      for (const sem of yr.semesters) {
        text += `   - ${sem.semesterNameBn}: GPA ${sem.gpa.toFixed(2)} (${sem.semesterCredits} Cr)\n`;
      }
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `হিসাব করুন ও রেজাল্ট শিট পান: https://sabbir.nav.bd/tools/cgpa-calculator`;

    await navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    sound.click();
    const prog = DEGREE_PROGRAMS[selectedProgramKey];
    const text = encodeURIComponent(
      `🎓 আমার ৪ বছরের ডিগ্রি সিজিপিএ: ${degreeResult.overallCgpa.toFixed(2)} / ৪.০০ (${degreeResult.letterGrade})!\n📚 ডিগ্রি: ${prog?.titleBn}\n🏛️ প্রতিষ্ঠান: ${institutionName}\nহিসাব করুন: https://sabbir.nav.bd/tools/cgpa-calculator`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Download High-Resolution Academic Result Card (PNG)
  const handleDownloadResultCard = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1550;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark Academic Canvas Background
      ctx.fillStyle = "#0A0D14";
      ctx.fillRect(0, 0, 1200, 1550);

      // Gold Elegant Border
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 1490);

      ctx.strokeStyle = "#27272A";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 1120, 1470);

      // Header Banner
      ctx.fillStyle = "#18181B";
      ctx.fillRect(50, 50, 1100, 140);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 15px monospace";
      ctx.fillText("THE SABBiR OS · UGC BANGLADESH ACADEMIC TRANSCRIPT", 80, 90);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      const progTitle = DEGREE_PROGRAMS[selectedProgramKey]?.titleBn || "৪ বছরের বিশ্ববিদ্যালয় ডিগ্রি";
      ctx.fillText(progTitle, 80, 130);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px sans-serif";
      ctx.fillText(`শিক্ষার্থী: ${studentName}  |  প্রতিষ্ঠান: ${institutionName}`, 80, 165);

      // Master CGPA Hero Box
      ctx.fillStyle = "#111827";
      ctx.fillRect(50, 210, 1100, 160);

      ctx.fillStyle = "#38BDF8";
      ctx.font = "bold 14px monospace";
      ctx.fillText("CUMULATIVE GRADE POINT AVERAGE (CGPA)", 80, 245);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px monospace";
      ctx.fillText(`${degreeResult.overallCgpa.toFixed(2)}`, 80, 320);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`/ 4.00 (${degreeResult.letterGrade})`, 280, 315);

      ctx.fillStyle = "#10B981";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`স্বীকৃতি: ${degreeResult.standingBn}`, 80, 355);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px monospace";
      ctx.fillText(`মোট ক্রেডিট সম্পন্ন: ${degreeResult.totalDegreeCreditsCompleted} Credits`, 750, 315);

      // Year-by-Year Breakdown Rows
      let y = 410;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Year-by-Year Academic Progression Breakdown:", 60, y);

      y += 25;
      for (const yr of degreeResult.years) {
        ctx.fillStyle = "#18181B";
        ctx.fillRect(50, y, 1100, 80);

        ctx.fillStyle = "#FBBF24";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(`${yr.yearLabelBn}`, 70, y + 35);

        ctx.fillStyle = "#E4E4E7";
        ctx.font = "14px monospace";
        ctx.fillText(`Credits: ${yr.yearCredits}`, 70, y + 60);

        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 20px monospace";
        ctx.fillText(`Year GPA: ${yr.yearGpa.toFixed(2)}`, 500, y + 45);

        ctx.fillStyle = "#10B981";
        ctx.font = "bold 20px monospace";
        ctx.fillText(`Cum. CGPA: ${yr.cumulativeCgpa.toFixed(2)}`, 850, y + 45);

        y += 95;
      }

      // Course Details Snapshot for Active Year
      y += 10;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`Active Course Roster Sample (${degreeResult.years[activeYear - 1]?.yearLabelBn}):`, 60, y);

      y += 25;
      const activeSem1 = activeYear * 2 - 1;
      const activeSem2 = activeYear * 2;
      const sampleList = [
        ...(semestersCourses[activeSem1] || []).slice(0, 4),
        ...(semestersCourses[activeSem2] || []).slice(0, 4),
      ];

      for (const c of sampleList) {
        ctx.fillStyle = "#111318";
        ctx.fillRect(50, y, 1100, 40);

        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 13px monospace";
        ctx.fillText(c.code, 70, y + 25);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px sans-serif";
        ctx.fillText(c.name, 220, y + 25);

        ctx.fillStyle = "#A1A1AA";
        ctx.font = "13px monospace";
        ctx.fillText(`${c.credits} Cr`, 820, y + 25);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 14px monospace";
        ctx.fillText(`GP ${c.gradePoint.toFixed(2)}`, 1000, y + 25);

        y += 48;
      }

      // Footer
      ctx.fillStyle = "#52525B";
      ctx.font = "13px monospace";
      ctx.fillText("Generated & Verified with THE SABBiR OS · sabbir.nav.bd · Zero-Cost Client-Side Academic Engineering", 180, 1490);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `academic-transcript-${selectedProgramKey}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="cgpa-calculator"
      title="SSC / HSC / NU / University 4-Year CGPA Studio"
      category="Academic Engineering & Education"
      popularityScore={97}
      lede="বাংলাদেশ শিক্ষাবোর্ডের ৪র্থ বিষয়ের বোনাস পয়েন্টসহ এসএসসি/এইচএসসি GPA, বিশ্ববিদ্যালয় চার বছরের (১ম থেকে ৪র্থ বর্ষ) ফুল ডিগ্রি সিজিপিএ এবং রিভার্স টার্গেট প্রেডিক্টর।"
      activeStep={activeStep}
      getSharePayload={() => ({
        boardResult,
        degreeResult,
        targetResult,
        selectedProgramKey,
        studentName,
        institutionName,
      })}
      sampleLoaderSlot={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSelectProgram("nu_political_science")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>NU রাষ্ট্রবিজ্ঞান (রাজশাহী কলেজ)</span>
          </button>
          <button
            onClick={() => handleSelectProgram("nu_accounting")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>NU হিসাববিজ্ঞান স্যাম্পল</span>
          </button>
          <button
            onClick={() => handleSelectProgram("bsc_cse")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>BSc CSE স্যাম্পল</span>
          </button>
          <button
            onClick={() => handleSelectProgram("diploma_computer")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>ডিপ্লোমা স্যাম্পল</span>
          </button>
        </div>
      }
      exportSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted transition-colors shadow-xs"
            title="রেজাল্ট সামারি কপি করুন"
          >
            {copiedSummary ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-amber-500" />}
            <span className="hidden sm:inline">{copiedSummary ? "কপি হয়েছে!" : "Copy Report"}</span>
          </button>
          <button
            onClick={handleDownloadResultCard}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Transcript (PNG)</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* 3 Main Studio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("university");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "university"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>১. ৪ বছরের পূর্ণাঙ্গ ডিগ্রি ও সেমিস্টার হিসাব (Full 4-Year CGPA)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("board");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "board"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>২. এসএসসি ও এইচএসসি বোর্ড জিপিএ (SSC/HSC GPA)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("target");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "target"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Target className="h-4 w-4" />
            <span>৩. টার্গেট সিজিপিএ সলভার (Reverse Solver)</span>
          </button>
        </div>

        {/* TAB 1: FULL 4-YEAR UNIVERSITY DEGREE CGPA */}
        {activeTab === "university" && (
          <div className="space-y-6">
            {/* 1. Category & Program Selector Bar */}
            <div className="rounded-3xl border border-line bg-surface p-5 md:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-bold block">
                    🎓 ডিগ্রি ও ডিপার্টমেন্ট সিলেক্টর (BD Curriculum)
                  </span>
                  <h3 className="text-base font-bold text-ink drop-shadow-xs">
                    আপনার ডিগ্রি নির্বাচন করুন (BA, BBA, BSC, Diploma)
                  </h3>
                </div>

                {/* Auto-Save & Manual Save Pill */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToLocalStorage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all shadow-xs"
                    title="লোকাল স্টোরেজে সেভ করুন"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>সেভ করুন</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 text-xs font-semibold transition-all shadow-xs"
                    title="হোয়াটসঅ্যাপে শেয়ার করুন"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  {lastSavedTime && (
                    <span className="text-[10px] font-mono text-ink-3 hidden md:inline">
                      সংরক্ষিত: {lastSavedTime}
                    </span>
                  )}
                </div>
              </div>

              {/* 5 Main Degree Category Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { cat: "NU" as DegreeCategory, label: "🎓 জাতীয় বিশ্ববিদ্যালয় (NU)", sub: "রাজশাহী কলেজ ও অধিভুক্ত (২৩ বিষয়)" },
                  { cat: "BSC" as DegreeCategory, label: "🔬 BSC Eng & Science", sub: "CSE, EEE, Civil, SWE" },
                  { cat: "BBA" as DegreeCategory, label: "💼 BBA Business Admin", sub: "Accounting, Finance, Marketing" },
                  { cat: "BA" as DegreeCategory, label: "📚 BA / BSS Arts", sub: "English, Economics, Bangla" },
                  { cat: "DIPLOMA" as DegreeCategory, label: "⚙️ Diploma Eng", sub: "BTEB 4-Year Polytechnic" },
                ].map((item) => (
                  <button
                    key={item.cat}
                    onClick={() => {
                      sound.click();
                      setSelectedCategory(item.cat);
                      // Auto-switch to first program of this category
                      const matchingKey = Object.keys(DEGREE_PROGRAMS).find(
                        (k) => DEGREE_PROGRAMS[k].category === item.cat
                      );
                      if (matchingKey) handleSelectProgram(matchingKey);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedCategory === item.cat
                        ? "border-amber-500 bg-amber-500/10 text-ink shadow-sm shadow-amber-500/10"
                        : "border-line bg-muted/20 text-ink-3 hover:text-ink hover:bg-muted/40"
                    }`}
                  >
                    <div className="text-xs font-bold text-ink">{item.label}</div>
                    <div className="text-[10px] text-ink-3 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>

              {/* Programs under Selected Category */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
                <span className="text-xs font-semibold text-ink-3 mr-1">উপলব্ধ প্রোগ্রাম:</span>
                {Object.values(DEGREE_PROGRAMS)
                  .filter((p) => p.category === selectedCategory)
                  .map((prog) => (
                    <button
                      key={prog.key}
                      onClick={() => handleSelectProgram(prog.key)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedProgramKey === prog.key
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-line bg-muted/30 text-ink-2 hover:bg-muted hover:text-ink"
                      }`}
                    >
                      {prog.titleBn}
                    </button>
                  ))}
              </div>

              {/* Student and University Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-ink-3 block mb-1">শিক্ষার্থীর নাম (Student Name)</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                    placeholder="আপনার নাম লিখুন..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3 block mb-1">বিশ্ববিদ্যালয় / ইনস্টিটিউটের নাম</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                    placeholder="আপনার বিশ্ববিদ্যালয় / পলিটেকনিক এর নাম..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Master Cumulative Degree Score Hero Card */}
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 via-surface to-surface p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider border border-blue-500/30 shadow-xs">
                      UGC 4.00 স্কেল সামগ্রিক ডিগ্রি ফলাফল
                    </span>
                    <span className="text-xs font-mono text-ink-3">
                      {degreeResult.completedSemestersCount}/8 সেমিস্টার সম্পন্ন
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <div className="text-5xl md:text-7xl font-extrabold text-ink font-mono tracking-tight drop-shadow-sm">
                      {degreeResult.overallCgpa.toFixed(2)}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-amber-500 font-mono">
                      / ৪.০০ ({degreeResult.letterGrade})
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 drop-shadow-xs">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>{degreeResult.standingBn}</span>
                  </p>
                </div>

                {/* Quick Statistics Box */}
                <div className="rounded-2xl border border-line bg-surface/90 p-4 text-xs font-mono space-y-2 min-w-[260px] shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-3">মোট সম্পন্ন ক্রেডিট:</span>
                    <span className="text-blue-400 font-bold">{degreeResult.totalDegreeCreditsCompleted} Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">মোট অর্জিত পয়েন্ট:</span>
                    <span className="text-ink font-bold">{degreeResult.totalDegreePointsEarned}</span>
                  </div>
                  <div className="flex justify-between border-t border-line/60 pt-1">
                    <span className="text-ink-3">ডিগ্রি সম্পন্নতা:</span>
                    <span className="text-emerald-400 font-bold">{degreeResult.completionPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* 4-Year Year-by-Year Mini Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-line/60">
                {degreeResult.years.map((yr) => (
                  <div
                    key={yr.yearNumber}
                    onClick={() => {
                      sound.click();
                      setActiveYear(yr.yearNumber as 1 | 2 | 3 | 4);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      activeYear === yr.yearNumber
                        ? "border-blue-500 bg-blue-500/10 shadow-sm"
                        : "border-line bg-muted/20 hover:border-line/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-3">
                      <span>{yr.yearNumber}ম বর্ষ</span>
                      <span>{yr.yearCredits} Cr</span>
                    </div>
                    <div className="text-lg font-bold font-mono text-ink mt-0.5">
                      GPA {yr.yearGpa.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-mono text-blue-400 mt-0.5">
                      Cum: {yr.cumulativeCgpa.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Year Navigation Stepper Tabs */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { year: 1 as const, title: "১ম বর্ষ (১ম ও ২য় সেমিস্টার)", sem: "Semesters 1 & 2" },
                { year: 2 as const, title: "২য় বর্ষ (৩য় ও ৪র্থ সেমিস্টার)", sem: "Semesters 3 & 4" },
                { year: 3 as const, title: "৩য় বর্ষ (৫ম ও ৬ষ্ঠ সেমিস্টার)", sem: "Semesters 5 & 6" },
                { year: 4 as const, title: "৪র্থ বর্ষ (৭ম ও ৮ম সেমিস্টার)", sem: "Semesters 7 & 8" },
              ].map((step) => (
                <button
                  key={step.year}
                  onClick={() => {
                    sound.toggleSwitch();
                    setActiveYear(step.year);
                  }}
                  className={`flex-1 min-w-[200px] p-3.5 rounded-2xl border text-left transition-all ${
                    activeYear === step.year
                      ? "border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10"
                      : "border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink drop-shadow-xs">{step.title}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        activeYear === step.year
                          ? "bg-amber-500 text-black"
                          : "bg-muted text-ink-3"
                      }`}
                    >
                      {step.year}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-ink-3 mt-1">
                    GPA {degreeResult.years[step.year - 1]?.yearGpa.toFixed(2) || "0.00"} · {step.sem}
                  </div>
                </button>
              ))}
            </div>

            {/* 4. Active Year Semesters View */}
            <div className="space-y-6">
              {[activeYear * 2 - 1, activeYear * 2].map((semNum) => {
                const prog = DEGREE_PROGRAMS[selectedProgramKey];
                const semDef = prog?.semesters.find((s) => s.semesterNumber === semNum);
                const semName = semDef?.semesterNameBn || `${semNum}ম সেমিস্টার`;
                const coursesList = semestersCourses[semNum] || [];

                // Calculate semester subtotal
                let semCredits = 0;
                let semPoints = 0;
                for (const c of coursesList) {
                  semCredits += c.credits || 0;
                  semPoints += (c.credits || 0) * (c.gradePoint || 0);
                }
                const semGpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : "0.00";

                return (
                  <div key={semNum} className="rounded-3xl border border-line bg-surface overflow-hidden shadow-sm">
                    {/* Semester Header */}
                    <div className="p-4 sm:p-5 border-b border-line bg-muted/20 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
                          {semNum}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-ink drop-shadow-xs">{semName}</h4>
                          <span className="text-[11px] font-mono text-ink-3">
                            মোট {coursesList.length} টি কোর্স · {semCredits} Credits
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-xs">
                          সেমিস্টার GPA: <span className="text-sm text-ink">{semGpa}</span>
                        </div>
                        <button
                          onClick={() => handleResetSemesterToDefault(semNum)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-muted/40 border border-line hover:bg-muted text-xs font-semibold text-ink-3 hover:text-ink transition-colors shadow-xs"
                          title="এই সেমিস্টারের সিলেবাস পূর্বাবস্থায় ফিরিয়ে আনুন"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-500" />
                          <span className="hidden sm:inline">সিলেবাস রিসেট</span>
                        </button>
                        <button
                          onClick={() => handleAddCourseToSemester(semNum)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-line hover:bg-muted text-xs font-semibold text-ink transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>কোর্স যোগ করুন</span>
                        </button>
                      </div>
                    </div>

                    {/* Semester Courses Table */}
                    <div className="divide-y divide-line overflow-x-auto">
                      {coursesList.map((course) => (
                        <div
                          key={course.id}
                          className="p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
                        >
                          {/* Code & Title */}
                          <div className="flex-1 min-w-[260px] flex items-center gap-2">
                            <input
                              type="text"
                              value={course.code}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSemestersCourses((prev) => ({
                                  ...prev,
                                  [semNum]: prev[semNum].map((c) => (c.id === course.id ? { ...c, code: val } : c)),
                                }));
                              }}
                              title="ক্লিক করে কোড এডিট করুন"
                              className="w-24 px-2 py-1.5 rounded-lg border border-line/60 bg-muted/30 font-mono text-xs font-bold text-blue-400 uppercase focus:border-blue-500 focus:outline-none"
                              placeholder="CODE"
                            />
                            <input
                              type="text"
                              value={course.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSemestersCourses((prev) => ({
                                  ...prev,
                                  [semNum]: prev[semNum].map((c) => (c.id === course.id ? { ...c, name: val } : c)),
                                }));
                              }}
                              title="ক্লিক করে বিষয়ের নাম বা বইয়ের শিরোনাম পরিবর্তন বা এডিট করুন"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-line/60 bg-muted/20 hover:border-line focus:border-blue-500 text-xs sm:text-sm font-semibold text-ink focus:outline-none transition-colors"
                              placeholder="কোর্স বা বিষয়ের নাম..."
                            />
                          </div>

                          {/* Credits & Grade Selector */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-mono text-ink-3">ক্রেডিট:</span>
                              <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setSemestersCourses((prev) => ({
                                    ...prev,
                                    [semNum]: prev[semNum].map((c) => (c.id === course.id ? { ...c, credits: val } : c)),
                                  }));
                                }}
                                step={0.5}
                                min={0.5}
                                max={15}
                                className="w-14 rounded-lg border border-line bg-muted/30 px-2 py-1 text-xs font-mono font-bold text-ink text-center"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-mono text-ink-3">গ্রেড:</span>
                              <select
                                value={course.gradePoint}
                                onChange={(e) => handleUpdateCourseGrade(semNum, course.id, Number(e.target.value))}
                                className="rounded-xl border border-line bg-muted/40 px-2.5 py-1.5 text-xs font-mono font-bold text-ink focus:border-amber-500 focus:outline-none"
                              >
                                {UGC_GRADE_OPTIONS.map((g) => (
                                  <option key={g.grade} value={g.point}>
                                    {g.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={() => handleRemoveCourseFromSemester(semNum, course.id)}
                              className="p-1.5 rounded-lg text-ink-3 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="কোর্স মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Year Completion Stepper Action Banner */}
              <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
                    {activeYear}ম বর্ষের মূল্যায়ন সামারি
                  </div>
                  <h4 className="text-base font-bold text-ink drop-shadow-xs mt-0.5">
                    {degreeResult.years[activeYear - 1]?.yearLabelBn} সম্পন্ন হয়েছে
                  </h4>
                  <p className="text-xs text-ink-2 font-mono mt-1">
                    বর্ষের GPA: <strong className="text-amber-400 font-bold">{degreeResult.years[activeYear - 1]?.yearGpa.toFixed(2)}</strong> · {activeYear}ম বর্ষ পর্যন্ত পুঞ্জীভূত CGPA: <strong className="text-blue-400 font-bold">{degreeResult.years[activeYear - 1]?.cumulativeCgpa.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                  {activeYear > 1 && (
                    <button
                      onClick={() => {
                        sound.click();
                        setActiveYear((prev) => (prev - 1) as 1 | 2 | 3 | 4);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-line bg-surface text-ink hover:bg-muted font-bold text-xs transition-all shadow-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{activeYear - 1}ম বর্ষে ফিরুন</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveToLocalStorage}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 font-bold text-xs transition-all shadow-xs"
                    title="লোকাল স্টোরেজে সেভ করুন"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ করুন</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 font-bold text-xs transition-all shadow-xs"
                    title="হোয়াটসঅ্যাপে শেয়ার করুন"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {activeYear < 4 ? (
                    <button
                      onClick={() => {
                        sound.confirm();
                        setActiveYear((prev) => (prev + 1) as 1 | 2 | 3 | 4);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md"
                    >
                      <span>✓ {activeYear}ম বর্ষ সম্পন্ন! {activeYear + 1}ম বর্ষে যান</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleDownloadResultCard}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      <span>🎉 ৪ বছরের পূর্ণাঙ্গ ডিগ্রি ট্রান্সক্রিপ্ট ডাউনলোড (PNG)</span>
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SSC / HSC BOARD GPA */}
        {activeTab === "board" && (
          <div className="space-y-6">
            {/* Student & Exam Header */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-line bg-surface p-5">
              <div>
                <label className="text-xs font-semibold text-ink-3">পরীক্ষার ধরন</label>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBoardExam("SSC")}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      boardExam === "SSC" ? "bg-amber-500 text-black" : "bg-muted text-ink"
                    }`}
                  >
                    এসএসসি (SSC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoardExam("HSC")}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      boardExam === "HSC" ? "bg-amber-500 text-black" : "bg-muted text-ink"
                    }`}
                  >
                    এইচএসসি (HSC)
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-3">শিক্ষার্থীর নাম</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-3">রোল নম্বর</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPA Score Hero Banner */}
            <div
              className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg ${
                boardResult.isGoldenAPlus
                  ? "border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-zinc-950 to-zinc-900"
                  : boardResult.hasFail
                  ? "border-rose-500/30 bg-rose-500/10"
                  : "border-emerald-500/30 bg-emerald-500/10"
              }`}
            >
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {boardResult.isGoldenAPlus ? (
                    <Trophy className="h-6 w-6 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                    {boardResult.isGoldenAPlus ? "গোল্ডেন A+ রেজাল্ট" : "সর্বমোট ফলাফল"}
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono">
                  GPA {boardResult.calculatedGpa.toFixed(2)}
                </div>
                <p className="text-sm font-medium text-ink-2">{boardResult.summaryBn}</p>
              </div>

              <div className="rounded-2xl border border-line bg-surface/80 p-4 text-xs font-mono space-y-1.5 min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">আবশ্যিক বিষয়:</span>
                  <span className="text-ink font-bold">{boardResult.mandatoryCount} টি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">৪র্থ বিষয় বোনাস:</span>
                  <span className="text-emerald-500 font-bold">
                    +{boardResult.fourthSubjectBonus.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">৪র্থ বিষয়ের গ্রেড:</span>
                  <span className="text-amber-500 font-bold">{boardResult.fourthSubjectGrade || "None"}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">লেটার গ্রেড:</span>
                  <span className="text-ink font-bold">{boardResult.letterGrade}</span>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
              <div className="p-4 border-b border-line bg-muted/20 flex justify-between items-center">
                <h4 className="text-sm font-bold text-ink">বিষয় ও গ্রেড তালিকা</h4>
                <button
                  onClick={() => {
                    sound.click();
                    const newSub: BoardSubject = {
                      id: `sub-${Date.now()}`,
                      name: "অতিরিক্ত বিষয়",
                      grade: "A+",
                      isFourthSubject: false,
                    };
                    setBoardSubjects((prev) => [...prev, newSub]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-line hover:bg-muted text-xs font-semibold text-ink transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>বিষয় যোগ করুন</span>
                </button>
              </div>

              <div className="divide-y divide-line">
                {boardSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBoardSubjects((prev) =>
                            prev.map((s) => (s.id === sub.id ? { ...s, name: val } : s))
                          );
                        }}
                        className="rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-ink hover:border-line focus:border-amber-500 focus:outline-none"
                      />
                      {sub.isFourthSubject && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                          ৪র্থ বিষয়
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <select
                        value={sub.grade}
                        onChange={(e) => {
                          const val = e.target.value as BoardGrade;
                          setBoardSubjects((prev) =>
                            prev.map((s) => (s.id === sub.id ? { ...s, grade: val } : s))
                          );
                        }}
                        className="rounded-xl border border-line bg-muted/40 px-3 py-1.5 text-xs font-mono font-bold text-ink focus:border-amber-500 focus:outline-none"
                      >
                        {(["A+", "A", "A-", "B", "C", "D", "F"] as BoardGrade[]).map((g) => (
                          <option key={g} value={g}>
                            {g} ({BOARD_GRADE_POINTS[g].toFixed(2)})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setBoardSubjects((prev) => prev.filter((s) => s.id !== sub.id))}
                        className="p-1.5 rounded-lg text-ink-3 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TARGET CGPA REVERSE SOLVER */}
        {activeTab === "target" && (
          <div className="rounded-3xl border border-line bg-surface p-6 md:p-8 space-y-6">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <span>কাঙ্ক্ষিত সিজিপিএ প্রেডিক্টর (Reverse Target CGPA Solver)</span>
              </h3>
              <p className="text-xs text-ink-3 leading-relaxed">
                আপনার বর্তমান সিজিপিএ ও শেষ হওয়া ক্রেডিট এবং কাঙ্ক্ষিত সিজিপিএ লিখুন। আমাদের রিভার্স অ্যালগরিদম স্বয়ংক্রিয়ভাবে হিসাব করে দেবে অবশিষ্ট সেমিস্টারগুলোতে ঠিক কত জিপিএ প্রয়োজন।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold text-ink-3">বর্তমান সিজিপিএ (Current CGPA)</label>
                <input
                  type="number"
                  value={targetCurrentCgpa}
                  onChange={(e) => setTargetCurrentCgpa(Number(e.target.value))}
                  step={0.01}
                  min={0}
                  max={4}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono font-bold text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">সম্পন্ন হওয়া ক্রেডিট (Completed)</label>
                <input
                  type="number"
                  value={targetCompletedCredits}
                  onChange={(e) => setTargetCompletedCredits(Number(e.target.value))}
                  min={1}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono font-bold text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">কাঙ্ক্ষিত সিজিপিএ (Target CGPA)</label>
                <input
                  type="number"
                  value={targetDesiredCgpa}
                  onChange={(e) => setTargetDesiredCgpa(Number(e.target.value))}
                  step={0.01}
                  min={0}
                  max={4}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono font-bold text-amber-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">অবশিষ্ট ক্রেডিট (Remaining)</label>
                <input
                  type="number"
                  value={targetRemainingCredits}
                  onChange={(e) => setTargetRemainingCredits(Number(e.target.value))}
                  min={1}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono font-bold text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Prediction Result Card */}
            <div
              className={`rounded-2xl border p-6 flex items-start gap-4 ${
                targetResult.isAchievable
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              {targetResult.isAchievable ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5 text-rose-500" />
              )}
              <div className="space-y-1">
                <div className="text-sm font-bold text-ink">
                  প্রয়োজনীয় গড় জিপিএ:{" "}
                  <span className="font-mono text-lg font-extrabold text-amber-400">
                    GPA {targetResult.requiredGpa.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">{targetResult.statusMessageBn}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
