import { useState, useEffect, useRef } from "react";
import "./index.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://between-the-lines-ai-production.up.railway.app";

const TONE_COLORS = {
  neutral:      "var(--tone-neutral)",
  frustrated:   "var(--tone-frustrated)",
  sarcastic:    "var(--tone-sarcastic)",
  friendly:     "var(--tone-friendly)",
  anxious:      "var(--tone-anxious)",
  affectionate: "var(--tone-affectionate)",
  dismissive:   "var(--tone-dismissive)",
  apologetic:   "var(--tone-apologetic)",
};

function toneColor(tone) {
  return TONE_COLORS[tone?.toLowerCase()] || "var(--accent)";
}

/* ── Icons ── */
function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

/* ── Navbar ── */
function Navbar({ onTryNow }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "How it Works", href: "#how" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#home" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Between <em>the</em> Lines
        </a>

        {/* Desktop links */}
        <div className="navbar-links">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
          <a
            href="https://github.com"
            className="nav-link nav-link-icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <button className="nav-cta" onClick={onTryNow}>Try Now</button>
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map(l => (
          <a key={l.label} href={l.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a
          href="https://github.com"
          className="mobile-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          GitHub
        </a>
        <button className="nav-cta mobile-cta" onClick={() => { onTryNow(); setMenuOpen(false); }}>
          Try Now
        </button>
      </div>
    </nav>
  );
}

/* ── Interpretation Card ── */
function InterpCard({ interp, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 280);
    return () => clearTimeout(t);
  }, [index]);
  const color = toneColor(interp.tone);
  return (
    <div className={`interp-card ${visible ? "visible" : ""}`} style={{ "--tone-color": color }}>
      <p className="interp-meaning">{interp.meaning}</p>
      <p className="interp-explanation">{interp.explanation}</p>
      <span className="tone-chip" style={{ color }}>{interp.tone}</span>
    </div>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Between <em>the</em> Lines AI</span>
          <p className="footer-desc">Uncovering the meanings hiding inside your words.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
          <a href="#privacy" className="footer-link">Privacy</a>
          <a href="mailto:contact@betweenthelines.ai" className="footer-link">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BetweenTheLines.AI — All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ── Main App ── */
export default function App() {
  const [sentence, setSentence] = useState("");
  const [context, setContext] = useState({ relationshipType: "", channel: "", background: "" });
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const inputCardRef = useRef(null);

  function scrollToInput() {
    inputCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleAnalyze() {
    if (!sentence.trim()) return;
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
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze();
  }

  const dominantColor = result ? toneColor(result.dominantTone) : null;

  return (
    <>
      <div className="glow-orb" />
      <Navbar onTryNow={scrollToInput} />

      <main className="app">
        {/* Hero */}
        <section id="home" className="hero">
          <p className="header-eyebrow">Communication clarity</p>
          <h1 className="header-title">Between <em>the</em> Lines</h1>
          <p className="header-subtitle">
            Paste any sentence and uncover the meanings hiding inside it.
          </p>
          <button className="hero-cta" onClick={scrollToInput}>Try it now →</button>
        </section>

        {/* Input card */}
        <div className="card" ref={inputCardRef} id="analyze">
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
            className={`analyze-btn ${loading ? "loading" : ""}`}
            onClick={handleAnalyze}
            disabled={loading || !sentence.trim()}
          >
            {loading ? "Reading between the lines…" : "Analyze  ⌘↵"}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Results */}
        {result && (
          <div className="card">
            <div className="results-header">
              <p className="results-title">{result.interpretations.length} possible readings</p>
              <span className="dominant-tone-badge" style={{ color: dominantColor, borderColor: dominantColor }}>
                mostly {result.dominantTone}
              </span>
            </div>
            <div className="interp-list">
              {result.interpretations.map((interp, i) => (
                <InterpCard key={i} interp={interp} index={i} />
              ))}
            </div>
            <p className="processing-time">analysed in {(result.processingTimeMs / 1000).toFixed(1)}s</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
