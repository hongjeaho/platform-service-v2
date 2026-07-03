# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout (current): single-context

This repo currently uses a **single** domain context. There is one `CONTEXT.md` at the repo root, and architectural decisions live under `docs/adr/`.

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-<decision>.md
│   └── 0002-<decision>.md
└── ... (api/, common/, datasource/, front/, ...)
```

## Target: multi-context (when a 2nd bounded context arrives)

Several **independent bounded contexts** are planned (e.g. `decision`). The repo will migrate to multi-context when the second genuinely-independent context starts development. **Until then, stay single** — a one-entry context map is pure overhead, and `CONTEXT.md` / ADRs are created lazily anyway.

`CONTEXT.md` is for **business domain language** only (`User`, `Decision`, `Auth`, …). Technical stack vocabulary (`@WebMvcTest`, Query key factory, CSS Module, JOOQ …) does **not** go here — it lives in `CLAUDE.md`.

## When to split into multi-context

Create a root `CONTEXT-MAP.md` and move to per-context files when ANY of these is true:

- A feature area forms an **independent ubiquitous language** that does not overlap the core. _(Confirmed for `decision` — it is an independent business area.)_
- The same word means different things in different areas (e.g. `Order` in ordering vs shipping).

**Do NOT split for:**

- **New feature areas / modules** that share the core language (`users`, `notice`, …) → keep one `CONTEXT.md`, organize it by section (`## Users`, `## Notice`, …).
- **Permission dimensions** like `admin` — `admin` manages the same entities (User, Decision) with elevated rights. It is **not a domain**. Put admin-specific terms under the relevant context.

## Layout when multi-context (this repo)

The skill's default `src/<context>/` layout does **not** fit this monorepo (Java packages under `com.platform.*` + a separate `front/`). Use a `docs/contexts/` tree instead:

```
docs/
├── agents/domain.md          # this file
├── adr/                       # system-wide (cross-context) decisions
└── contexts/
    ├── <name>/CONTEXT.md      # per-context glossary (created on split)
    └── <name>/adr/            # (optional) context-scoped decisions
```

A root `CONTEXT-MAP.md` lists each context and points at its `docs/contexts/<name>/CONTEXT.md`. Write it only at split time.

## Shared kernel (decide per context at split time)

When splitting, decide per context whether it shares the core **Identity** kernel (`User`, `Auth`):

- **Shares Identity** (most cases — e.g. "who made the decision") → keep a core `docs/contexts/identity/CONTEXT.md` that other contexts reference. Do **not** redefine `User` per context.
- **Fully independent** (no `User` reference) → standalone context, no shared file.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root (single-context), or **`CONTEXT-MAP.md`** at the root if it exists — follow it to the relevant per-context `CONTEXT.md`.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. In multi-context mode, also check `docs/contexts/<name>/adr/`.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The skills (`/grill-with-docs`, `/improve-codebase-architecture`) create them lazily when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it so it can be added to `CONTEXT.md`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 — but worth reopening because…_
