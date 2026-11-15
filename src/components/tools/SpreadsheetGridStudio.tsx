"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  Plus,
  Trash2,
  Download,
  Share2,
  FileSpreadsheet,
  BarChart2,
  Sparkles,
  Calculator,
  RefreshCw,
  Check,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  SPREADSHEET_TEMPLATES,
  SheetTemplate,
  GridData,
  computeEntireGrid,
  evaluateCell,
  exportGridToCsv,
} from "@/lib/sheets/formula-grid-engine";

export function SpreadsheetGridStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<SheetTemplate>(SPREADSHEET_TEMPLATES[0]);
  const [gridData, setGridData] = useState<GridData>(SPREADSHEET_TEMPLATES[0].initialData);
  const [cols, setCols] = useState<string[]>(SPREADSHEET_TEMPLATES[0].cols);
  const [rowCount, setRowCount] = useState<number>(SPREADSHEET_TEMPLATES[0].rowCount);

  const [selectedCell, setSelectedCell] = useState<string>("B6");
  const [formulaInput, setFormulaInput] = useState<string>("");

  const [showChart, setShowChart] = useState(false);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "spreadsheet-grid",
    toolName: "Smart Khata & Formula Spreadsheet Studio",
  });

  // Recompute reactive values
  const computedValues = useMemo(() => {
    return computeEntireGrid(gridData);
  }, [gridData]);

  // When clicking a cell
  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setFormulaInput(gridData[cellId] ?? "");
    sound.click();
  };

  // Update cell
  const handleCellChange = (cellId: string, val: string) => {
    setGridData((prev) => ({
      ...prev,
      [cellId]: val,
    }));
  };

  // Template switch
  const handleSelectTemplate = (tmpl: SheetTemplate) => {
    setSelectedTemplate(tmpl);
    setGridData(tmpl.initialData);
    setCols(tmpl.cols);
    setRowCount(tmpl.rowCount);
    setSelectedCell("B6");
    sound.launch();
  };

  // Export CSV
  const handleExportCsv = () => {
    triggerExport(() => {
      sound.shutter();
      const csv = exportGridToCsv(gridData, cols, rowCount);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sabbir-khata-sheet-${selectedTemplate.id}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const getSharePayload = () => {
    return {
      type: "spreadsheet-snapshot",
      templateId: selectedTemplate.id,
      cols,
      rowCount,
      gridData,
      computedValues,
      createdAt: new Date().toISOString(),
    };
  };

  // Extract chart data from Column B (numeric values)
  const chartData = useMemo(() => {
    const points: Array<{ label: string; value: number }> = [];
    for (let r = 2; r < rowCount; r++) {
      const label = String(computedValues[`A${r}`] ?? `Item ${r}`);
      const val = Number(computedValues[`B${r}`] ?? 0);
      if (!isNaN(val) && val > 0) {
        points.push({ label, value: val });
      }
    }
    return points;
  }, [computedValues, rowCount]);

  const maxChartVal = Math.max(...chartData.map((d) => d.value), 100);

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="spreadsheet-grid"
        toolName="Smart Khata &amp; Formula Spreadsheet Studio"
        category="Finance &amp; Data Studio"
        onExportClick={handleExportCsv}
        getSharePayload={getSharePayload}
      />

      {/* Main Studio Container */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-7 backdrop-blur-md space-y-6">
        {/* Template Quick Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{selectedTemplate.name}</h2>
              <p className="text-xs text-neutral-400">{selectedTemplate.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                showChart
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{showChart ? "Hide Chart" : "Generate Chart"}</span>
            </button>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const tmpl = SPREADSHEET_TEMPLATES.find((t) => t.id === e.target.value);
                if (tmpl) handleSelectTemplate(tmpl);
              }}
              className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200"
            >
              {SPREADSHEET_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 text-xs font-mono">
          <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 font-bold">
            {selectedCell}
          </div>
          <span className="text-neutral-500 font-bold">fx</span>
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => {
              setFormulaInput(e.target.value);
              handleCellChange(selectedCell, e.target.value);
            }}
            placeholder="Type value or formula (e.g. =SUM(B2:B5) or =B2-C2)"
            className="flex-1 bg-transparent px-2 text-xs text-white placeholder-neutral-600 focus:outline-none"
          />
        </div>

        {/* Reactive Grid Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 shadow-inner bg-neutral-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-neutral-400 font-mono text-[11px] border-b border-neutral-800">
                <th className="py-2 px-3 text-center border-r border-neutral-800 w-12 bg-neutral-900/90 text-neutral-500">
                  #
                </th>
                {cols.map((c) => (
                  <th key={c} className="py-2.5 px-3 border-r border-neutral-800 last:border-r-0 min-w-[130px]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 font-mono">
              {Array.from({ length: rowCount }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <tr key={rowNum} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2 px-3 text-center font-bold text-neutral-500 bg-neutral-900/60 border-r border-neutral-800 select-none">
                      {rowNum}
                    </td>
                    {cols.map((c) => {
                      const cellId = `${c}${rowNum}`;
                      const isSelected = selectedCell === cellId;
                      const rawVal = gridData[cellId] ?? "";
                      const displayVal = computedValues[cellId] ?? "";
                      const isHeaderRow = rowNum === 1;

                      return (
                        <td
                          key={cellId}
                          onClick={() => handleCellClick(cellId)}
                          className={`p-1 border-r border-neutral-800 last:border-r-0 ${
                            isSelected
                              ? "bg-amber-500/20 ring-2 ring-amber-500 ring-inset"
                              : isHeaderRow
                              ? "bg-neutral-900/50 font-bold font-sans text-neutral-200"
                              : ""
                          }`}
                        >
                          <input
                            type="text"
                            value={isSelected ? formulaInput : String(displayVal)}
                            onChange={(e) => {
                              setFormulaInput(e.target.value);
                              handleCellChange(cellId, e.target.value);
                            }}
                            className={`w-full bg-transparent px-2 py-1 text-xs outline-none ${
                              isHeaderRow
                                ? "font-bold font-sans text-white"
                                : typeof displayVal === "number"
                                ? "text-right text-amber-300 font-bold"
                                : "text-neutral-200 font-sans"
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live SVG Bar Chart Generator */}
        {showChart && chartData.length > 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 animate-in fade-in">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <span>Real-Time Column Visualizer ({selectedTemplate.name})</span>
            </h3>

            <div className="space-y-2 pt-2">
              {chartData.map((d, i) => {
                const widthPct = Math.round((d.value / maxChartVal) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span className="truncate">{d.label}</span>
                      <span className="font-mono font-bold text-amber-400">৳{d.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Export Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-500">
            Reactive formulas: <code className="text-amber-400">=SUM()</code>, <code className="text-amber-400">=AVERAGE()</code>, <code className="text-amber-400">=IF()</code>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Sheet (+25 XP)</span>
          </button>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
