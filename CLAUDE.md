# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page application for Big Data engineering interview preparation, based on DOU (Ukrainian IT community) interview questions. Deployed on GitHub Pages — no build step required.

## Running Locally

Open `index.html` directly in a browser. No server, no build tools, no dependencies to install.

## Architecture

Three files form the entire application:

- **`index.html`** — Data and markup. Contains all 125 FAQ items split across three hidden `<section>` elements (`#junior-questions`, `#middle-questions`, `#senior-questions`). Each item is a `.faq-item` div with a `.faq-question` button and a `.faq-answer` div. The level-selection screen (`#level-selection`) is shown by default.

- **`styles.css`** — Theming via CSS custom properties, 3-column grid for the level cards, accordion animation with `max-height` transitions (0 → 1000px), and a 900px-max-width container.

- **`scripts.js`** — Three responsibilities:
  - `selectLevel(level)` hides the level-selection screen and shows the matching question section.
  - `goBack()` reverses that.
  - A delegated click listener on `.faq-question` toggles `.active` on the parent `.faq-item`, which drives the CSS accordion open/close.

State is held entirely in the DOM via CSS class toggling (`.active`). There is no framework, bundler, or package manager.

## Content Language

Questions and answers are written in Ukrainian. Technical terms (Hadoop, Spark, SQL, etc.) remain in English.

## Deployment

Push to the `main` branch; GitHub Pages serves `index.html` from the repository root.

## Code Review Criteria

When reviewing PRs via CI, check for:

- **Security**: XSS vulnerabilities (`innerHTML`, `eval`, unescaped user input), missing input sanitization
- **Accessibility**: missing `aria-*` attributes, unlabeled interactive elements, keyboard navigation issues
- **JavaScript**: event listener leaks, missing null checks on DOM queries, incorrect accordion state logic
- **CSS**: broken responsive layout (mobile < 600px), overridden custom properties that break theming
- **Content**: Ukrainian text quality, correct pluralization forms (1 / 2-4 / 5+), technical terms left in English
