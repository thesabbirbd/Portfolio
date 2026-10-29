import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AiyaarName, withAiyaarLinks } from "@/components/system/AiyaarName";
import { AIYAAR } from "@/data/aiyaar";
import { subnet, b64encode, b64decode } from "./Tools";
import { takeToken, pickServer, lruAccess } from "./Playground";
import { NEWS, VLOGS, GAMES } from "@/data/discover";
import { isValidContentDate } from "@/lib/content-date";

describe("Aiyaar name links (owner request: every name goes to the website)", () => {
  it("AiyaarName opens aiyaar.ltd in a new tab safely", () => {
    const html = renderToStaticMarkup(<AiyaarName />);
    expect(html).toContain(`href="${AIYAAR.url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(">Aiyaar<");
  });
  it("withAiyaarLinks links every standalone occurrence and keeps the rest of the text", () => {
    const html = renderToStaticMarkup(<p>{withAiyaarLinks("Aiyaar runs shops. I work at Aiyaar.")}</p>);
    expect(html.match(/href="https:\/\/aiyaar\.ltd/g)?.length).toBe(2);
    expect(html).toContain(" runs shops. I work at ");
  });
});

describe("interactive tools", () => {
  it("subnet calculator", () => {
    const rows = (x: ReturnType<typeof subnet>) => Object.fromEntries(x.rows ?? []);
    const r = subnet("192.168.10.77/26");
    expect(rows(r)).toMatchObject({ Network: "192.168.10.64/26", Broadcast: "192.168.10.127", "First host": "192.168.10.65", "Last host": "192.168.10.126", "Usable hosts": "62" });
    const p2p = subnet("10.0.0.0/31");
    expect(rows(p2p)["Usable hosts"]).toBe("2");
    expect("error" in subnet("300.1.1.1/24")).toBe(true);
    expect("error" in subnet("not an ip")).toBe(true);
  });
  it("Base64 round-trips UTF-8 (including Bangla)", () => {
    for (const s of ["THE SABBiR", "আমি", "{\"a\":1}"]) expect(b64decode(b64encode(s))).toBe(s);
    expect(() => b64decode("@@@")).toThrow();
  });
});

describe("playground simulations", () => {
  it("token bucket rejects when empty", () => {
    expect(takeToken(1)).toEqual({ allowed: true, tokens: 0 });
    expect(takeToken(0.5)).toEqual({ allowed: false, tokens: 0.5 });
  });
  it("load balancer picks round-robin or least-connections", () => {
    expect([0, 1, 2, 3].map((i) => pickServer("round-robin", [5, 0, 0], i))).toEqual([0, 1, 2, 0]);
    expect(pickServer("least-conn", [3, 1, 2], 0)).toBe(1);
  });
  it("LRU cache evicts the least recently used key", () => {
    let c: string[] = [];
    for (const k of ["A", "B", "C", "D"]) c = lruAccess(c, k, 4).cache;
    const hit = lruAccess(c, "A", 4);
    expect(hit.hit).toBe(true);
    const miss = lruAccess(hit.cache, "E", 4);
    expect(miss.evicted).toBe("B");
    expect(miss.cache).toEqual(["E", "A", "D", "C"]);
  });
});

describe("discover data honesty", () => {
  it("every news item has an https primary source and a valid source date", () => {
    for (const n of NEWS) {
      expect(n.sourceUrl).toMatch(/^https:\/\//);
      expect(isValidContentDate(n.sourceDate)).toBe(true);
      expect(n.demo).toBe(true);
    }
  });
  it("vlogs carry no video links; games are not playable yet", () => {
    for (const v of VLOGS) expect(JSON.stringify(v)).not.toMatch(/youtube|youtu\.be|https?:/);
    expect(GAMES.length).toBeGreaterThan(0);
  });
});
