const fs = require('fs');

let appCss = fs.readFileSync('src/App.css', 'utf8');

// Remove hover effects for cards
appCss = appCss.replace(/\.runtime-card:hover \{\n  transform: translateY\(-4px\);\n  box-shadow: var\(--hover-shadow\);\n  border-color: var\(--accent-border\);\n\}/g, '');
appCss = appCss.replace(/\.highlight-grid article:hover,\n\.doc-section:hover \{\n  transform: translateY\(-4px\);\n  box-shadow: var\(--hover-shadow\);\n  border-color: var\(--accent-border\);\n\}/g, '');

// Add terminal block styles
const terminalStyles = `
.terminal-block {
  margin-top: 28px;
  border: 1px solid var(--code-border);
  border-radius: 10px;
  background: var(--code-bg);
  box-shadow: var(--soft-shadow);
  overflow: hidden;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: 0.5s;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 46px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--code-border);
}

.mac-dots {
  display: flex;
  gap: 8px;
}

.mac-dots .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.pkg-tabs {
  display: flex;
  gap: 2px;
  height: 100%;
  align-items: flex-end;
}

.pkg-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}

.pkg-tab svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.pkg-tab:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.03);
}

.pkg-tab:hover svg {
  opacity: 1;
}

.pkg-tab.active {
  background: var(--code-bg);
  color: var(--text);
  border-color: var(--code-border);
}

.pkg-tab.active svg {
  opacity: 1;
}

.pkg-tab.npm.active { color: #CB3837; }
.pkg-tab.pnpm.active { color: #F69220; }
.pkg-tab.yarn.active { color: #2C8EBB; }
.pkg-tab.bun.active { color: #f472b6; }

.terminal-block .command-line {
  margin-top: 0;
  border: none;
  box-shadow: none;
  border-radius: 0;
  animation: none;
  opacity: 1;
}
`;

appCss += terminalStyles;

// Fix animation on command line because we moved it to terminal-block
appCss = appCss.replace(/\.hero-copy \.command-line \{ animation-delay: 0\.5s; \}/g, '.hero-copy .terminal-block { animation-delay: 0.5s; }');

fs.writeFileSync('src/App.css', appCss);
console.log('App.css patched');
