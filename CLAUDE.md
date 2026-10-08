# GEO Marketing UI

## Project
Web app for the Startup Hackathon project that helps SME teams create
consistent, multilingual, GEO-optimized marketing content. The frontend
(this repo) talks to a backend AI pipeline (Generate Content agent + GEO
optimization agents for summary/rating/report) that drafts, refines, and
scores multilingual marketing content (email, video script, blog post)
against a brand profile and trending local topics. See `README.md` for the
feature walkthrough and `DESIGN.md` for the fuller technical plan.

## Commands
- Dev environment setup: `npm install`
- Test: *(no test suite configured yet — flag this if a task needs one)*
- Lint / type-check: `tsc -b` (also runs as part of `npm run build`)
- Build: `npm run build`
- Preview production build: `npm run preview`
- Dev server: `npm run dev`

## Conventions
- Folder structure:
  - `src/pages/` — route-level views (Dashboard, ContentGenerator, BrandProfile, Multilingual, Settings)
  - `src/components/` — shared/reusable UI, with `layout/` for page chrome
  - `src/stores/` — Zustand stores (e.g. `companyStore.ts`)
  - `src/lib/` — API clients (`supabaseClient.ts`, `topicsApi.ts`, `generateContentApi.ts`)
  - `src/i18n/` + `src/locales/` — i18next setup and translation JSON (`en.json`, `fi.json`)
  - `src/types/` — shared TypeScript types
  - `src/styles/` — global CSS and design tokens
- Tech stack: React 18 + TypeScript, Vite, React Router, Zustand, i18next, Supabase JS client.
- Things Claude must never do:
  - Commit `.env` or Supabase credentials.
  - Hand-translate copy without adding keys to both `en.json` and `fi.json`.
  - Tune generated/GEO-scoring thresholds just to make something look like it passes.

---

## Multi-agent workflow
<!-- This section and "Model policy" below are the reusable part of this
     template — copy them as-is into every project's CLAUDE.md. They
     describe the coordinator in .claude/commands/code-task.md and the
     four subagents in .claude/agents/. -->

- Write a task in `Artifacts/TASK.md` with a difficulty (`easy` | `medium` |
  `hard`) and run `/code-task`.
- Only the coordinator (the `/code-task` command, run in the main session —
  not a subagent) writes `Artifacts/state.json`.
- Only the analyzer writes `Artifacts/analysis.md` (its findings for the
  current task; overwritten each run).
- Only the tester — or the coordinator itself on `easy` tasks — appends to
  `Artifacts/dev-diary.md`.
- Agent definitions live in `.claude/agents/` (`analyzer`, `planner`,
  `coder`, `tester`); the coordinator lives in `.claude/commands/code-task.md`.
- Routes: `easy` → planner → coder → done (no analyzer, no tester, no
  retries). `medium` / `hard` → **analyzer → planner → coder → tester** →
  loop or finish.
- The analyzer runs first and investigates: it reads the relevant code and
  data, measures rather than assumes, researches externally when the task
  needs it, and writes `Artifacts/analysis.md`. It produces **facts, not a
  plan**, and verifies the claims `TASK.md` itself makes. The planner reads
  that file directly rather than having it relayed through the coordinator.
- After 2 failed test runs in a row on `medium`/`hard`, the coordinator stops
  and asks you instead of retrying again.
- If an agent dies because the **session/usage limit was hit**, that is a
  pause, not a failure: the coordinator records `status: "paused_rate_limit"`
  in `Artifacts/state.json`, leaves `consecutive_failures` untouched, reports
  what already landed on disk, and stops. Say "continue" once the limit
  resets — it picks up from the interrupted step rather than restarting, and
  never downgrades the model to get around the limit.

### Model policy (a constraint, not a default)
Opus is for **thinking**, never for typing. The reasoning budget is spent
upstream so the plan is detailed enough for a cheaper model to implement.

| difficulty | analyzer | planner | coder | tester |
|---|---|---|---|---|
| `easy` | *(not run)* | `haiku` | `haiku` | *(not run)* |
| `medium` | **`opus`** | `sonnet` | `sonnet` | `sonnet` |
| `hard` | **`opus`** | **`opus`** | `sonnet` | `sonnet` |

- **Only the analyzer and planner may use Opus** — the analyzer on
  `medium`/`hard`, the planner on **`hard` only**.
- On `medium` the expensive thinking is the **analysis**. The analyzer still
  runs on Opus and produces measured facts; the planner's job there is to turn
  those facts into ordered steps, not to re-derive them. If a `medium` task
  turns out to need Opus-level planning, that is a signal it was mis-filed —
  re-file it as `hard`, don't quietly upgrade the planner.
- **Never run the coder or tester on Opus** — not on a retry, not when a task
  looks hard. If the coder struggles, the plan wasn't detailed enough: go
  back to the planner, don't upgrade the coder. On `medium` that re-plan also
  stays on `sonnet`; the two-consecutive-failure stop above is the backstop,
  not a model upgrade.
- Because the coder runs on a smaller model, the planner **must** produce
  explicit step-by-step instructions — exact files, line numbers, values and
  call shapes — so the coder can implement literally without re-deriving
  anything.

- All agents and the coordinator treat this file as the source of truth for
  commands and conventions — they do not duplicate them elsewhere.
