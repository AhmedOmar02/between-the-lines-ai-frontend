import { useState, useEffect } from "react";
import "./index.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://between-the-lines-ai-production.up.railway.app";

const TONE_COLORS = {
  neutral:     "var(--tone-neutral)",
  frustrated:  "var(--tone-frustrated)",
  sarcastic:   "var(--tone-sarcastic)",
  friendly:    "var(--tone-friendly)",
  anxious:     "var(--tone-anxious)",
  affectionate:"var(--tone-affectionate)",
  dismissive:  "var(--tone-dismissive)",
  apologetic:  "var(--tone-apologetic)",
};

function toneColor(tone) {
  return TONE_COLORS[tone?.toLowerCase()] || "var(--accent)";
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InterpCard({ interp, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 280);
    return () => clearTimeout(timer);
  }, [index]);

  const color = toneColor(interp.tone);

  return (
    <div
      className={`interp-card ${visible ? "visible" : ""}`}
      style={{ "--tone-color": color }}
    >
      <p className="interp-meaning">{interp.meaning}</p>
      <p className="interp-explanation">{interp.explanation}</p>
      <span className="tone-chip" style={{ color }}>
        {interp.tone}
      </span>
    </div>
  );
}

export default function App() {
  const [sentence, setSentence] = useState("");
  const [context, setContext] = useState({ relationshipType: "", channel: "", background: "" });
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  async function handleAnalyze() {
    if (!sentence.trim()) return;

    // NEW: Check character limit
    if (sentence.length > 500) {
      setError("Please use less than 500 characters");
      return;
    }

    // Check if we're in cooldown period
    const now = Date.now();
    if (now < cooldownUntil) {
      // Still in cooldown, show error and don't proceed
      setError(`Please wait ${Math.ceil((cooldownUntil - now) / 1000)} seconds before making another request. This helps protect your token usage.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const body = { sentence: sentence.trim() };
    const ctx = {};
    if (context.relationshipType.trim()) ctx.relationshipType = context.relationshipType.trim();
    if (context.channel.trim()) ctx.channel = context.channel.trim();
    if (context.background.trim()) ctx.background = context.background.trim();
    if (Object.keys(ctx).length) body.context = ctx;

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      // Set cooldown for 3 seconds after each request (success or error)
      setCooldownUntil(Date.now() + 3000);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze();
  }

  const dominantColor = result ? toneColor(result.dominantTone) : null;

  return (
    <div className="app">
      <div className="glow-orb" style={{ position: 'fixed' }} />

      <header className="header">
        <p className="header-eyebrow">Communication clarity</p>
        <h1 className="header-title">
          Between <em>the</em> Lines
        </h1>
        <p className="header-subtitle">
          Paste any sentence and uncover the meanings hiding inside it.
        </p>
      </header>

      {/* Input card */}
      <div className="card">
        <label className="field-label" htmlFor="sentence">Your sentence</label>
        <textarea
          id="sentence"
          className="sentence-input"
          placeholder="e.g. Fine, do whatever you want."
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <p style={{ fontSize: '0.75rem', color: sentence.length > 450 ? '#e07b72' : 'var(--muted)', textAlign: 'right' }}>
          {sentence.length}/500
        </p>

        <button
          className={`context-toggle ${showContext ? "open" : ""}`}
          onClick={() => setShowContext(v => !v)}
          type="button"
        >
          <ChevronIcon />
          {showContext ? "Hide context" : "Add context (optional)"}
        </button>

        <div className={`context-fields ${showContext ? "visible" : ""}`}>
          <div className="context-grid">
            <div>
              <label className="field-label" htmlFor="relationship">Relationship</label>
              <input
                id="relationship"
                className="ctx-input"
                placeholder="partner, colleague, friend…"
                value={context.relationshipType}
                onChange={e => setContext(c => ({ ...c, relationshipType: e.target.value }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="channel">Channel</label>
              <input
                id="channel"
                className="ctx-input"
                placeholder="text, email, in-person…"
                value={context.channel}
                onChange={e => setContext(c => ({ ...c, channel: e.target.value }))}
              />
            </div>
            <div className="full">
              <label className="field-label" htmlFor="background">Background</label>
              <textarea
                id="background"
                className="ctx-input"
                placeholder="What led up to this message?"
                rows={2}
                value={context.background}
                onChange={e => setContext(c => ({ ...c, background: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <button
          className={`analyze-btn ${loading ? "loading" : ""} ${cooldownUntil > Date.now() ? "cooldown" : ""}`}
          onClick={handleAnalyze}
          disabled={loading || !sentence.trim() || sentence.length > 500 || cooldownUntil > Date.now()}
        >
          {loading ? "Reading between the lines…" : cooldownUntil > Date.now() ? `Please wait ${Math.ceil((cooldownUntil - Date.now()) / 1000)}s…` : "Analyze  ⌘↵"}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>

      {/* Results card */}
      {result && (
        <div className="card">
          <div className="results-header">
            <p className="results-title">
              {result.interpretations.length} possible readings
            </p>
            <span
              className="dominant-tone-badge"
              style={{ color: dominantColor, borderColor: dominantColor }}
            >
              mostly {result.dominantTone}
            </span>
          </div>

          <div className="interp-list">
            {result.interpretations.map((interp, i) => (
              <InterpCard key={i} interp={interp} index={i} />
            ))}
          </div>

          <p className="processing-time">
            analysed in {(result.processingTimeMs / 1000).toFixed(1)}s
          </p>
        </div>
      )}
    </div>
  );
}
