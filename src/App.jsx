import { useState } from "react";

const fc = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(2)}M` : `$${Math.round(n).toLocaleString()}`;

const LANG = {
  en: {
    badge: "Operations Cost Analysis · Gastonia NC",
    title: "Phantom Demand Cost Calculator",
    inputsTitle: "Input Variables",
    inputs: ["Supervisors", "Hours Lost / Day", "Base Salary", "Phantom Inventory", "Working Days / Yr"],
    units: ["", "hrs", "", "", "days"],
    outputTitle: "Annual Cost of Phantom Demand",
    outputSub: "fully loaded annual cost",
    stats: ["Hourly rate (loaded)", "Daily waste / supervisor", "% of payroll wasted"],
    projection: "3-Year If Unremediated",
    breakdownTitle: "Cost Breakdown",
    barLabels: ["Supervisor Time Waste", "Inventory Holding Cost", "Opportunity Cost"],
    barDescs: [
      (s,h,d) => `${s} supervisors × ${h}h/day × ${d} days`,
      (inv)   => `25% carrying rate on $${(inv/1000).toFixed(0)}K phantom WIP`,
      ()      => `$50K/yr per supervisor not on floor improvement`,
    ],
    tiles: ["Per Hour", "Per Day", "Per Week", "Per Supervisor / yr"],
    tileSubs: ["phantom WO time", "all supervisors", "5-day week", "salary waste only"],
    foot: "Assumptions:",
    footText: "Burden 1.30× base · Holding 25%/yr · Opp cost $50K/yr per supervisor · NC avg base $65–68K (ZipRecruiter 2025) · Gastonia metro adjustment applied",
    dark: "Dark", light: "Light",
  },
  es: {
    badge: "Análisis de Costos Operacionales · Gastonia NC",
    title: "Calculadora de Costos — Demanda Fantasma",
    inputsTitle: "Variables de Entrada",
    inputs: ["Supervisores", "Horas Perdidas / Día", "Salario Base", "Inventario Fantasma", "Días Laborales / Año"],
    units: ["", "hrs", "", "", "días"],
    outputTitle: "Costo Anual de Demanda Fantasma",
    outputSub: "costo anual completamente cargado",
    stats: ["Tarifa por hora cargada", "Pérdida diaria / supervisor", "% de nómina desperdiciada"],
    projection: "Proyección 3 Años Sin Remedio",
    breakdownTitle: "Desglose de Costos",
    barLabels: ["Pérdida de Tiempo Supervisor", "Costo de Almacenamiento", "Costo de Oportunidad"],
    barDescs: [
      (s,h,d) => `${s} supervisores × ${h}h/día × ${d} días`,
      (inv)   => `25% costo anual sobre $${(inv/1000).toFixed(0)}K WIP fantasma`,
      ()      => `$50K/año por supervisor no invertido en mejoras`,
    ],
    tiles: ["Por Hora", "Por Día", "Por Semana", "Por Supervisor / año"],
    tileSubs: ["tiempo OT fantasma", "todos los supervisores", "semana de 5 días", "solo pérdida salarial"],
    foot: "Supuestos:",
    footText: "Carga 1.30× salario base · Almacenamiento 25%/año · Oportunidad $50K/año · Promedio NC $65–68K (ZipRecruiter 2025) · Ajuste Gastonia aplicado",
    dark: "Oscuro", light: "Claro",
  },
};

export default function App() {
  const [dark, setDark]   = useState(true);
  const [lang, setLang]   = useState("en");
  const [sups, setSups]   = useState(6);
  const [hrs, setHrs]     = useState(4.5);
  const [sal, setSal]     = useState(68000);
  const [inv, setInv]     = useState(500000);
  const [days, setDays]   = useState(250);

  const t = LANG[lang];

  const loaded   = (sal * 1.3) / 2080;
  const daily    = loaded * hrs;
  const supWaste = daily * days * sups;
  const holding  = inv * 0.25;
  const opp      = sups * 50000;
  const total    = supWaste + holding + opp;
  const pct      = (supWaste / (sal * 1.3 * sups)) * 100;

  const bars = [
    { label: t.barLabels[0], value: supWaste, color: "#E84855", desc: t.barDescs[0](sups, hrs, days) },
    { label: t.barLabels[1], value: holding,  color: "#F4A261", desc: t.barDescs[1](inv) },
    { label: t.barLabels[2], value: opp,      color: "#4A9FD4", desc: t.barDescs[2]() },
  ];
  const maxBar = Math.max(...bars.map(b => b.value));

  const sliders = [
    { v: sups, set: setSups, min:1,     max:20,      step:1,     disp: v => v },
    { v: hrs,  set: setHrs,  min:0.5,   max:8,       step:0.5,   disp: v => v },
    { v: sal,  set: setSal,  min:45000, max:100000,  step:1000,  disp: v => `$${(v/1000).toFixed(0)}K` },
    { v: inv,  set: setInv,  min:50000, max:2000000, step:50000, disp: v => `$${(v/1000).toFixed(0)}K` },
    { v: days, set: setDays, min:200,   max:260,     step:5,     disp: v => v },
  ];

  const tiles = [
    { label: t.tiles[0], sub: t.tileSubs[0], val: fc(total / (days * 8)) },
    { label: t.tiles[1], sub: t.tileSubs[1], val: fc(total / days) },
    { label: t.tiles[2], sub: t.tileSubs[2], val: fc(total / (days / 5)) },
    { label: t.tiles[3], sub: t.tileSubs[3], val: fc(supWaste / sups) },
  ];

  // Theme
  const bg   = dark ? "#0D0D0D" : "#F0EDE8";
  const surf = dark ? "#1A1A1A" : "#FFFFFF";
  const bdr  = dark ? "#383838" : "#C8C4BE";
  const tP   = dark ? "#FFFFFF" : "#111111";
  const tS   = dark ? "#CCCCCC" : "#444444";
  const trk  = dark ? "#333333" : "#DDDDDD";
  const s2   = dark ? "#222222" : "#E5E1DC";
  const b2   = dark ? "#444444" : "#B8B4AE";
  const acc  = "#E84855";

  const btn = (on, bg2, txt) => ({
    padding: "6px 14px", fontSize: 18, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", borderRadius: 5, outline: "none", transition: "all 0.2s",
    background: on ? bg2 : "transparent",
    color: on ? txt : tS,
    border: `2px solid ${on ? bg2 : bdr}`,
  });

  const panel = {
    background: surf, border: `2px solid ${bdr}`,
    borderRadius: 6, boxSizing: "border-box",
    transition: "background 0.3s",
  };

  return (
    <div style={{
      background: bg, height: "100vh", overflow: "hidden",
      fontFamily: "'Courier New', monospace", color: tP,
      padding: "12px 16px", boxSizing: "border-box",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateColumns: "1fr 2fr",
      gridTemplateAreas: `"header header" "left right" "footer footer"`,
      gap: 10,
      transition: "background 0.3s",
    }}>

      {/* ── HEADER ROW ── */}
      <div style={{ gridArea: "header", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.15em", color: acc, textTransform: "uppercase" }}>
            {t.badge}
          </div>
          <div style={{ fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", color: tP, lineHeight: 1.1 }}>
            {t.title}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setLang("en")} style={btn(lang==="en", acc, "#FFF")}>EN</button>
          <button onClick={() => setLang("es")} style={btn(lang==="es", acc, "#FFF")}>ES</button>
          <div style={{ width: 2, height: 30, background: bdr, margin: "0 4px" }} />
          <button onClick={() => setDark(true)}  style={btn(dark,  "#FFF", "#0D0D0D")}>◐ {t.dark}</button>
          <button onClick={() => setDark(false)} style={btn(!dark, "#111", "#FFF")}>○ {t.light}</button>
        </div>
      </div>

      {/* ── LEFT: Inputs ── */}
      <div style={{ ...panel, gridArea: "left", padding: "14px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: tS, textTransform: "uppercase", marginBottom: 8 }}>
          {t.inputsTitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-around" }}>
          {sliders.map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 18, color: tS }}>{t.inputs[i]}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: tP, whiteSpace: "nowrap" }}>
                  {s.disp(s.v)}{t.units[i] ? ` ${t.units[i]}` : ""}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.v}
                onChange={e => s.set(Number(e.target.value))}
                style={{ width: "100%", accentColor: acc, cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: stacked top + bottom ── */}
      <div style={{ gridArea: "right", display: "grid", gridTemplateRows: "auto 1fr", gap: 10 }}>

        {/* TOP: Annual cost + tiles + 3yr */}
        <div style={{ ...panel, padding: "14px 20px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 24px", alignItems: "start" }}>
          {/* Big number block */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: tS, textTransform: "uppercase", marginBottom: 2 }}>
              {t.outputTitle}
            </div>
            <div style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 700, color: acc, lineHeight: 1, letterSpacing: "-0.03em", transition: "all 0.3s" }}>
              {fc(total)}
            </div>
            <div style={{ fontSize: 18, color: tS, marginTop: 2 }}>{t.outputSub}</div>

            {/* inline stats */}
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                `$${loaded.toFixed(2)}/hr`,
                `$${Math.round(daily).toLocaleString()}`,
                `${pct.toFixed(0)}%`,
              ].map((val, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 18, color: tS }}>{t.stats[i]}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: i===2 && pct>50 ? acc : tP, whiteSpace: "nowrap" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: tiles 2x2 + 3yr */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {tiles.map((tile, i) => (
              <div key={i} style={{ background: s2, border: `2px solid ${b2}`, borderRadius: 5, padding: "8px 12px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: tS, textTransform: "uppercase", marginBottom: 2 }}>{tile.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: tP, letterSpacing: "-0.02em" }}>{tile.val}</div>
                <div style={{ fontSize: 18, color: tS }}>{tile.sub}</div>
              </div>
            ))}
            {/* 3-year spans full width */}
            <div style={{ gridColumn: "1 / -1", background: s2, border: `2px solid ${b2}`, borderRadius: 5, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: tS, textTransform: "uppercase" }}>{t.projection}</div>
                <div style={{ fontSize: 18, color: tS, marginTop: 2 }}>if MRP is not remediated</div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#F4A261", letterSpacing: "-0.02em" }}>{fc(total * 3)}</div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Bar chart */}
        <div style={{ ...panel, padding: "14px 20px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: tS, textTransform: "uppercase", marginBottom: 8 }}>
            {t.breakdownTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-around" }}>
            {bars.map(bar => (
              <div key={bar.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 600, color: tP }}>{bar.label}</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: tP, whiteSpace: "nowrap" }}>{fc(bar.value)}</span>
                </div>
                <div style={{ height: 18, background: trk, borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${(bar.value/maxBar)*100}%`, background: bar.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: 18, color: tS }}>{bar.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ gridArea: "footer", borderTop: `1px solid ${b2}`, paddingTop: 5, fontSize: 18, color: tS, lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700, color: tP }}>{t.foot}</span>{" "}{t.footText}
      </div>
    </div>
  );
}
