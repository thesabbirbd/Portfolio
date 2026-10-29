/**
 * Theme-aware floating backdrop (v4.0.1) — every device, CSS-only, no WebGL.
 *
 * Two layers:
 *  1. A fixed layer (always in view): gold deco rays, equaliser bars, a self-drawing line graph,
 *     drifting gold dust — plus, on the Blue theme, data streams down the edges.
 *  2. A tall "drift" layer of lightweight CSS-3D objects tied to the page scroll: as you scroll
 *     down they rise slowly (CSS scroll timeline, zero JS), like a camera move in a motion reel.
 *     Each colour theme gets its own objects:
 *       orange "Royal"  → gold gyroscope, spinning gold coin, gold wire cube
 *       green  "Studio" → solid Bauhaus cube, spheres, half-disc and triangle
 *       blue   "Tech"   → wireframe cube-in-cube, wire globe, radar sweep, network graph with
 *                          travelling packets, and a mini live dashboard (bars + sparkline)
 * The theme is chosen in CSS (html[data-theme-color]), so the server markup is the same for
 * everyone and nothing re-renders on theme change. Animations are transform/opacity/stroke only
 * and freeze under reduced motion (global rules in globals.css).
 */

const CUBE_FACES = ["f1", "f2", "f3", "f4", "f5", "f6"];
const Faces = () => (
  <>
    {CUBE_FACES.map((f) => (
      <i key={f} className={f} />
    ))}
  </>
);

const HEX = "7f3a 0c91 e4b2 1d08 a6f0 39c5 b71e 52d4 0fa9 c83b 6e17 d290 4b6c 91ef 2a58 f03d";

export function AmbientBackdrop() {
  return (
    <div aria-hidden="true" className="ambient absolute inset-0 overflow-hidden">
      {/* ---------- fixed layer ---------- */}
      <svg className="amb-rays" viewBox="0 0 400 400" preserveAspectRatio="xMaxYMin meet">
        {Array.from({ length: 13 }, (_, i) => {
          const a = (Math.PI / 2) * (i / 12);
          return <line key={i} x1="400" y1="0" x2={400 - Math.cos(a) * 400} y2={Math.sin(a) * 400} />;
        })}
        <circle cx="400" cy="0" r="120" />
        <circle cx="400" cy="0" r="200" />
      </svg>

      <div className="amb-bars">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${-i * 0.45}s`, animationDuration: `${3.2 + (i % 4) * 0.6}s` }} />
        ))}
      </div>

      <svg className="amb-graph" viewBox="0 0 240 80" preserveAspectRatio="none">
        <polyline points="0,62 20,55 40,58 60,40 80,46 100,30 120,36 140,22 160,28 180,14 200,20 220,8 240,12" />
        <polyline className="amb-graph-ghost" points="0,70 20,66 40,68 60,57 80,61 100,50 120,54 140,44 160,47 180,38 200,41 220,32 240,35" />
      </svg>

      <div className="amb-dust">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53 + 11) % 100}%`, animationDelay: `${-i * 1.7}s` }} />
        ))}
      </div>

      {/* Blue: data streams down both edges */}
      <div className="amb-only amb-blue">
        <div className="amb-stream amb-stream-l"><span>{HEX}</span><span>{HEX}</span></div>
        <div className="amb-stream amb-stream-r"><span>{HEX}</span><span>{HEX}</span></div>
        <div className="amb-floor" />
      </div>

      {/* ---------- drift layer: rises as the page scrolls down ---------- */}
      <div className="amb-only amb-orange">
        <div className="amb-drift">
          <div className="amb-3d amb-gyro" style={{ top: "54vh", right: "6vw" }}>
            <span className="ring r1" /><span className="ring r2" /><span className="core" />
          </div>
          <span className="amb-coin" style={{ top: "112vh", left: "5vw" }} />
          <div className="amb-3d amb-cube amb-cube-gold" style={{ top: "150vh", right: "9vw" }}><Faces /></div>
          <span className="amb-coin amb-coin-sm" style={{ top: "196vh", right: "22vw" }} />
          <div className="amb-3d amb-gyro amb-gyro-sm" style={{ top: "232vh", left: "8vw" }}>
            <span className="ring r1" /><span className="ring r2" /><span className="core" />
          </div>
        </div>
        <svg className="amb-deco" viewBox="0 0 200 120">
          <path d="M10 110 L100 20 L190 110" />
          <path d="M40 110 L100 50 L160 110" />
          <path d="M70 110 L100 80 L130 110" />
        </svg>
      </div>

      <div className="amb-only amb-green">
        <div className="amb-drift">
          <div className="amb-3d amb-cube amb-cube-solid" style={{ top: "56vh", right: "8vw" }}><Faces /></div>
          <span className="bh bh-circle" style={{ top: "16vh", left: "6vw" }} />
          <span className="bh bh-half" style={{ top: "104vh", right: "16vw" }} />
          <span className="amb-sphere" style={{ top: "140vh", left: "7vw" }} />
          <span className="bh bh-tri" style={{ top: "178vh", right: "10vw" }} />
          <div className="amb-3d amb-cube amb-cube-solid amb-cube-sm" style={{ top: "214vh", left: "12vw" }}><Faces /></div>
          <span className="bh bh-stripes" style={{ top: "250vh", right: "5vw" }} />
        </div>
      </div>

      <div className="amb-only amb-blue">
        <div className="amb-drift">
          <svg className="amb-circuit" viewBox="0 0 300 200" style={{ top: "8vh", left: 0 }}>
            <path d="M0 40 H80 L110 70 H190 L220 40 H300" />
            <path d="M0 120 H60 L90 150 H170" />
            <path d="M300 160 H230 L200 130 H140" />
            <circle cx="110" cy="70" r="4" /><circle cx="190" cy="70" r="4" /><circle cx="90" cy="150" r="4" /><circle cx="200" cy="130" r="4" />
          </svg>
          <div className="amb-3d amb-cube amb-cube-wire" style={{ top: "54vh", right: "7vw" }}>
            <Faces />
            <div className="amb-cube amb-cube-inner"><Faces /></div>
          </div>
          <div className="amb-radar" style={{ top: "96vh", left: "5vw" }}><span className="sweep" /><span className="blip b1" /><span className="blip b2" /></div>
          <svg className="amb-net" viewBox="0 0 220 140" style={{ top: "132vh", right: "4vw" }}>
            <path d="M20 110 L80 40 L150 70 L200 20" />
            <path d="M80 40 L120 120 L150 70" />
            <path className="pkt" d="M20 110 L80 40 L150 70 L200 20" />
            <path className="pkt pkt-2" d="M80 40 L120 120 L150 70" />
            <circle cx="20" cy="110" r="5" /><circle cx="80" cy="40" r="6" /><circle cx="150" cy="70" r="6" /><circle cx="200" cy="20" r="5" /><circle cx="120" cy="120" r="5" />
          </svg>
          <div className="amb-dash" style={{ top: "176vh", left: "6vw" }}>
            <div className="amb-dash-bars">
              {Array.from({ length: 7 }, (_, i) => <span key={i} style={{ animationDelay: `${-i * 0.35}s` }} />)}
            </div>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="0,24 14,20 28,22 42,12 56,15 70,8 84,10 100,3" /></svg>
          </div>
          <div className="amb-3d amb-globe" style={{ top: "214vh", right: "10vw" }}>
            <span className="ring" /><span className="ring g2" /><span className="ring g3" /><span className="ring g4" />
          </div>
        </div>
      </div>
    </div>
  );
}
