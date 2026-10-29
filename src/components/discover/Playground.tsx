"use client";

import React, { useEffect, useRef, useState } from "react";
import { Gauge, Split, Layers3 } from "lucide-react";
import { sound } from "@/lib/sound";
import { Segmented } from "@/components/system/Controls";

// Three live simulations of backend building blocks. Pure client-side state; timers only run
// while a simulation has work to do, so an idle page costs nothing.

const btn =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold surface-card surface-interactive text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

function SimCard({ id, title, lede, Icon, children }: { id: string; title: string; lede: string; Icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="reveal scroll-mt-28 rounded-card surface-card p-4 sm:p-6 lux-card">
      <h2 id={`${id}-title`} className="flex items-center gap-2 text-lg sm:text-xl font-bold text-ink">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-signal/10 text-signal"><Icon className="w-[18px] h-[18px]" /></span>
        {title}
      </h2>
      <p className="mt-2 text-sm text-ink-2 leading-relaxed">{lede}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ---------- Token bucket rate limiter ----------
export function takeToken(tokens: number) {
  return tokens >= 1 ? { allowed: true, tokens: tokens - 1 } : { allowed: false, tokens };
}

function TokenBucket() {
  const CAPACITY = 5;
  const REFILL_PER_SEC = 1;
  const [tokens, setTokens] = useState(CAPACITY);
  const [log, setLog] = useState<{ id: number; ok: boolean }[]>([]);
  const idRef = useRef(0);

  // Refill only while the bucket isn't full.
  useEffect(() => {
    if (tokens >= CAPACITY) return;
    const t = setInterval(() => setTokens((x) => Math.min(CAPACITY, x + REFILL_PER_SEC / 10)), 100);
    return () => clearInterval(t);
  }, [tokens]);

  const send = (n: number) => {
    let current = tokens;
    const results: { id: number; ok: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      const r = takeToken(current);
      current = r.tokens;
      results.push({ id: idRef.current++, ok: r.allowed });
    }
    setTokens(current);
    setLog((l) => [...results.reverse(), ...l].slice(0, 12));
    if (results.some((r) => !r.ok)) sound.error(); else sound.click();
  };

  const pct = (tokens / CAPACITY) * 100;
  return (
    <SimCard id="rate-limiter" title="Token bucket rate limiter" Icon={Gauge} lede={`Capacity ${CAPACITY} tokens, refilled at ${REFILL_PER_SEC}/s. Each request takes one token; with none left the request gets HTTP 429.`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden" role="meter" aria-label="Tokens available" aria-valuemin={0} aria-valuemax={CAPACITY} aria-valuenow={Math.floor(tokens)}>
          <div className="h-full bg-gradient-to-r from-signal to-gold transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
        <span className="w-16 text-right font-mono text-sm text-ink">{tokens.toFixed(1)}/{CAPACITY}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => send(1)}>Send 1 request</button>
        <button type="button" className={btn} onClick={() => send(8)}>Burst of 8</button>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5 min-h-7" aria-live="polite" aria-label="Recent requests">
        {log.map((r) => (
          <li key={r.id} className={`px-2 py-0.5 rounded font-mono text-[11px] ${r.ok ? "bg-ok/15 text-ok" : "bg-primary/10 text-primary"}`}>{r.ok ? "200" : "429"}</li>
        ))}
      </ul>
    </SimCard>
  );
}

// ---------- Load balancer ----------
type Algo = "round-robin" | "least-conn";
export function pickServer(algo: Algo, active: number[], rrIndex: number) {
  if (algo === "round-robin") return rrIndex % active.length;
  return active.indexOf(Math.min(...active));
}

function LoadBalancer() {
  const SERVERS = ["app-1", "app-2", "app-3"];
  const [algo, setAlgo] = useState<Algo>("round-robin");
  const [active, setActive] = useState([0, 0, 0]);
  const [served, setServed] = useState([0, 0, 0]);
  const rr = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (n: number) => {
    // Durations vary: some requests are slow, which is where least-connections wins.
    const local = [...active];
    for (let i = 0; i < n; i++) {
      const s = pickServer(algo, local, rr.current++);
      local[s]++;
      const duration = 600 + ((i * 7919) % 5) * 500;
      setServed((x) => x.map((v, j) => (j === s ? v + 1 : v)));
      timers.current.push(setTimeout(() => setActive((x) => x.map((v, j) => (j === s ? Math.max(0, v - 1) : v))), duration));
    }
    setActive(local);
    sound.navigate();
  };
  const max = Math.max(4, ...active);
  return (
    <SimCard id="load-balancer" title="Load balancer" Icon={Split} lede="Send traffic to three app servers. Round-robin rotates blindly; least-connections sends each request to the least busy server.">
      <Segmented label="Algorithm" value={algo} onChange={(v) => { setAlgo(v); sound.toggleSwitch(); }} options={[{ value: "round-robin", label: "Round-robin" }, { value: "least-conn", label: "Least connections" }]} />
      <ul className="mt-4 space-y-2">
        {SERVERS.map((name, i) => (
          <li key={name} className="flex items-center gap-3 font-mono text-sm">
            <span className="w-12 text-ink-2">{name}</span>
            <span className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <span className="block h-full bg-gradient-to-r from-primary to-gold transition-[width] duration-200" style={{ width: `${(active[i] / max) * 100}%` }} />
            </span>
            <span className="w-28 text-right text-ink">{active[i]} active · {served[i]}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => send(1)}>1 request</button>
        <button type="button" className={btn} onClick={() => send(10)}>10 requests</button>
      </div>
    </SimCard>
  );
}

// ---------- LRU cache ----------
export function lruAccess(cache: string[], key: string, capacity: number) {
  const hit = cache.includes(key);
  const next = [key, ...cache.filter((k) => k !== key)];
  const evicted = next.length > capacity ? next[next.length - 1] : null;
  return { hit, cache: next.slice(0, capacity), evicted };
}

function LruCache() {
  const CAPACITY = 4;
  const KEYS = ["A", "B", "C", "D", "E", "F"];
  const [cache, setCache] = useState<string[]>([]);
  const [stats, setStats] = useState({ hits: 0, misses: 0, last: "" });
  const access = (k: string) => {
    const r = lruAccess(cache, k, CAPACITY);
    setCache(r.cache);
    setStats((s) => ({ hits: s.hits + (r.hit ? 1 : 0), misses: s.misses + (r.hit ? 0 : 1), last: r.hit ? `${k}: hit` : r.evicted ? `${k}: miss, evicted ${r.evicted}` : `${k}: miss` }));
    if (r.hit) sound.confirm(); else sound.click();
  };
  const total = stats.hits + stats.misses;
  return (
    <SimCard id="lru-cache" title="LRU cache" Icon={Layers3} lede={`A cache with room for ${CAPACITY} keys. Reading a key moves it to the front; when full, the least recently used key is evicted.`}>
      <div className="flex flex-wrap gap-2">
        {KEYS.map((k) => <button key={k} type="button" className={`${btn} w-11 px-0 font-mono`} onClick={() => access(k)} aria-label={`Read key ${k}`}>{k}</button>)}
      </div>
      <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Cache, most recent first">
        {Array.from({ length: CAPACITY }, (_, i) => (
          <li key={i} className={`grid place-items-center h-12 rounded-xl border font-mono text-lg ${cache[i] ? "border-gold/50 bg-gold/10 text-ink" : "border-dashed border-line text-ink-3"}`}>{cache[i] ?? "—"}</li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-sm text-ink-2" aria-live="polite">
        {stats.last || "Pick a key."} · hit rate {total ? Math.round((stats.hits / total) * 100) : 0}% ({stats.hits}/{total})
      </p>
    </SimCard>
  );
}

export function PlaygroundSuite() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
      <TokenBucket />
      <LoadBalancer />
      <div className="lg:col-span-2"><LruCache /></div>
    </div>
  );
}
