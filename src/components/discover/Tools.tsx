"use client";

import React, { useMemo, useState } from "react";
import { Network, KeyRound, Binary, Braces, Clock } from "lucide-react";
import { sound } from "@/lib/sound";

// Five small tools that run entirely in the browser (no server, no data leaves the page).

const field =
  "w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";
const btn =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold surface-card surface-interactive text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

function ToolCard({ id, title, Icon, children }: { id: string; title: string; Icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="reveal scroll-mt-28 rounded-card surface-card p-4 sm:p-6 lux-card">
      <h2 id={`${id}-title`} className="flex items-center gap-2 text-lg sm:text-xl font-bold text-ink">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary"><Icon className="w-[18px] h-[18px]" /></span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Result({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 border-b border-line py-1.5">
          <dt className="text-ink-3">{k}</dt>
          <dd className="text-ink text-right break-all">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------- Subnet / CIDR ----------
const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
export function subnet(input: string) {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return { error: "Use the form 192.168.10.77/26" };
  const octets = m.slice(1, 5).map(Number);
  const prefix = Number(m[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return { error: "Octets must be 0–255 and the prefix 0–32" };
  const ip = octets.reduce((a, o) => ((a << 8) | o) >>> 0, 0);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);
  const usable = prefix >= 31 ? total : total - 2; // RFC 3021 /31 and single-host /32
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  return {
    rows: [
      ["Network", `${toIp(network)}/${prefix}`],
      ["Netmask", toIp(mask)],
      ["Wildcard", toIp(~mask >>> 0)],
      ["Broadcast", prefix >= 31 ? "n/a" : toIp(broadcast)],
      ["First host", toIp(first)],
      ["Last host", toIp(last)],
      ["Addresses", total.toLocaleString("en-US")],
      ["Usable hosts", usable.toLocaleString("en-US")],
    ] as [string, string][],
  };
}

function SubnetTool() {
  const [value, setValue] = useState("192.168.10.77/26");
  const out = useMemo(() => subnet(value), [value]);
  return (
    <ToolCard id="subnet" title="Subnet / CIDR calculator" Icon={Network}>
      <label htmlFor="subnet-input" className="text-sm text-ink-2">IPv4 address with prefix</label>
      <input id="subnet-input" className={`${field} mt-1`} value={value} onChange={(e) => { setValue(e.target.value); sound.type(); }} spellCheck={false} inputMode="decimal" />
      {"error" in out ? <p role="alert" className="mt-3 text-sm text-ink-2">{out.error}</p> : <Result rows={out.rows} />}
    </ToolCard>
  );
}

// ---------- chmod ----------
const WHO = ["Owner", "Group", "Others"] as const;
const PERMS = [["r", 4], ["w", 2], ["x", 1]] as const;
function ChmodTool() {
  const [bits, setBits] = useState([7, 5, 5]);
  const octal = bits.join("");
  const symbolic = bits.map((b) => PERMS.map(([c, v]) => (b & v ? c : "-")).join("")).join("");
  const setOctal = (v: string) => {
    if (/^[0-7]{3}$/.test(v)) setBits(v.split("").map(Number));
  };
  return (
    <ToolCard id="chmod" title="chmod permission calculator" Icon={KeyRound}>
      <div className="grid grid-cols-3 gap-2">
        {WHO.map((who, i) => (
          <fieldset key={who} className="rounded-xl border border-line p-2.5">
            <legend className="px-1 text-xs font-semibold text-ink-2">{who}</legend>
            {PERMS.map(([c, v]) => (
              <label key={c} className="flex min-h-8 items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  className="w-7 h-7 m-0 shrink-0 accent-[rgb(var(--primary))]"
                  checked={(bits[i] & v) !== 0}
                  onChange={() => { setBits((b) => b.map((x, j) => (j === i ? x ^ v : x))); sound.toggleSwitch(); }}
                />
                {c === "r" ? "read" : c === "w" ? "write" : "execute"}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <label htmlFor="chmod-octal" className="mt-4 block text-sm text-ink-2">Octal</label>
      <input id="chmod-octal" className={`${field} mt-1 max-w-[8rem]`} value={octal} onChange={(e) => setOctal(e.target.value)} inputMode="numeric" maxLength={3} />
      <Result rows={[["Symbolic", symbolic], ["Command", `chmod ${octal} file`]]} />
    </ToolCard>
  );
}

// ---------- Base64 ----------
export const b64encode = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
export const b64decode = (s: string) => new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));
function Base64Tool() {
  const [text, setText] = useState("THE SABBiR");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (fn: (s: string) => string) => {
    try { setOut(fn(text)); setErr(""); sound.confirm(); } catch { setOut(""); setErr("That input isn't valid Base64 (or isn't UTF-8 text)."); sound.error(); }
  };
  return (
    <ToolCard id="base64" title="Base64 encode / decode" Icon={Binary}>
      <label htmlFor="b64-input" className="text-sm text-ink-2">Input (UTF-8 text or Base64)</label>
      <textarea id="b64-input" rows={3} className={`${field} mt-1`} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => run(b64encode)}>Encode</button>
        <button type="button" className={btn} onClick={() => run(b64decode)}>Decode</button>
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-ink-2">{err}</p>}
      {out && <output className="mt-3 block rounded-xl bg-muted px-3 py-2 font-mono text-sm text-ink break-all">{out}</output>}
    </ToolCard>
  );
}

// ---------- JSON ----------
function JsonTool() {
  const [text, setText] = useState('{"name":"THE SABBiR","stack":["FastAPI","PostgreSQL","Docker"]}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (indent: number | undefined) => {
    try { setOut(JSON.stringify(JSON.parse(text), null, indent)); setErr(""); sound.confirm(); } catch (e) { setOut(""); setErr((e as Error).message); sound.error(); }
  };
  return (
    <ToolCard id="json" title="JSON formatter & validator" Icon={Braces}>
      <label htmlFor="json-input" className="text-sm text-ink-2">JSON</label>
      <textarea id="json-input" rows={4} className={`${field} mt-1`} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => run(2)}>Format</button>
        <button type="button" className={btn} onClick={() => run(undefined)}>Minify</button>
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-ink-2">Invalid JSON: {err}</p>}
      {out && <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-muted px-3 py-2 font-mono text-sm text-ink">{out}</pre>}
    </ToolCard>
  );
}

// ---------- Unix time ----------
function TimeTool() {
  const [value, setValue] = useState("1767225600");
  const parsed = useMemo(() => {
    const v = value.trim();
    const ms = /^\d{1,13}$/.test(v) ? (v.length > 10 ? Number(v) : Number(v) * 1000) : Date.parse(v);
    if (Number.isNaN(ms)) return null;
    const d = new Date(ms);
    const rows: [string, string][] = [
      ["Unix seconds", String(Math.floor(ms / 1000))],
      ["ISO 8601 (UTC)", d.toISOString()],
      ["UTC", d.toUTCString()],
    ];
    return { rows, d };
  }, [value]);
  return (
    <ToolCard id="timestamp" title="Unix timestamp converter" Icon={Clock}>
      <label htmlFor="ts-input" className="text-sm text-ink-2">Unix seconds / milliseconds, or an ISO date</label>
      <div className="mt-1 flex gap-2">
        <input id="ts-input" className={field} value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} />
        <button type="button" className={btn} onClick={() => { setValue(String(Math.floor(Date.now() / 1000))); sound.click(); }}>Now</button>
      </div>
      {parsed ? (
        <>
          <Result rows={parsed.rows} />
          {/* The visitor's own zone differs from the server's: rendered on the client only. */}
          <p className="mt-2 font-mono text-sm text-ink-2" suppressHydrationWarning>Your time zone: {parsed.d.toLocaleString()}</p>
        </>
      ) : <p role="alert" className="mt-3 text-sm text-ink-2">Not a timestamp or date this tool understands.</p>}
    </ToolCard>
  );
}

export function ToolsSuite() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
      <SubnetTool />
      <ChmodTool />
      <Base64Tool />
      <JsonTool />
      <TimeTool />
    </div>
  );
}
