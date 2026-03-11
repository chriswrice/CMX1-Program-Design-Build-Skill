# CMX1 Activity Studio — Form Design Strategy

> **Parent:** [`cmx1/activity-studio.md`](activity-studio.md)

This file covers the **research & planning phase** for building CMX1 activity templates. Before touching the form builder, gather requirements from the user to make smart high-level decisions. These decisions map directly to the template creation wizard (Setup → Access & Activation) and influence everything downstream.

---

## Research & Planning Workflow

When a user asks to build a new form/template, follow this structured discovery process **before creating the template**. Each phase maps to real configuration in Activity Studio.

### Pre-Phase: Environment Setup (One-Time Only)

> **This only needs to happen once per machine.** If the user has already completed this setup in a previous session, skip straight to Phase 1. Ask the user if they've done this before — don't repeat it every time.

Before building anything, confirm the tooling is ready:

**1. Claude in Chrome Extension**
- Is the Claude in Chrome MCP extension installed and connected?
- Quick check: call `tabs_context_mcp` — if it returns tab IDs, you're good.
- If not connected: guide the user to install the extension and click "Connect" in Chrome.

**2. CDP (Chrome DevTools Protocol) for Playwright Scripts**
- Is Chrome running with `--remote-debugging-port=9222`?
- Quick check: run `curl -s http://localhost:9222/json/version` — if it returns JSON, you're good.
- If not: the user needs to **fully quit Chrome** and relaunch with the flag:
  ```bash
  # macOS — Google Chrome:
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  ```
- See [`activity-studio.md`](activity-studio.md) for other browsers/platforms and troubleshooting.

**3. Playwright Installed**
- Quick check: run `node -e "require('playwright')"` — if no error, you're good.
- If not: `npm install playwright` in the project directory.

**4. CMX1 Logged In**
- Is the user logged into their CMX1 site in the browser?
- They need an active session before any automation can work.

**Once all four are confirmed, note it and never ask again for this session.** Jump to Phase 1.

---

### Phase 1: Template Identity & Purpose

**Goal:** Understand what the template is for, whether it's new or existing, and its scope.

**Always ask these questions first:**

| Question | Why It Matters | Maps To |
|----------|---------------|---------|
| Are you creating a **new activity** or **updating an existing** one? | Determines workflow: new = full wizard, existing = navigate to it and edit | Build workflow path |
| What **site/environment** are you working on? (e.g., dev, staging, production, specific URL) | Need to know where to navigate | Browser target URL |
| *(If existing)* Can you share the **link** to the activity template? | Direct navigation instead of searching | Browser navigation |
| What is this template called? | Template name shown to end-users | Setup → Template Name |
| What is its purpose? (1–2 sentences) | Description shown to end-users | Setup → Description |
| Is this a simple checklist or a full compliance audit? | Simple = just data capture, fewer features needed; Full = scoring, compliance tracking, risk levels, corrective actions | Setup → Evaluation Form checkboxes |

**Defaults:** If the user doesn't specify, start with the template name and description, and assume a full-featured compliance form (scoring + compliance + risk all enabled).

---

### Phase 2: Feature Toggles (Template Capabilities)

**Goal:** Determine which platform features this template needs. These are **template-level master switches** — if disabled here, the feature won't be available anywhere in the form.

#### Evaluation Form Features

| Feature | Question to Ask | When to Enable | When to Disable |
|---------|----------------|---------------|-----------------|
| **Scoring** | "Do you need to score/grade this activity?" | Audits, inspections with pass/fail scoring | Simple data-collection checklists |
| **Compliance** | "Do you need to track In/Out compliance?" | Regulatory audits, standards compliance | Internal surveys, data entry forms |
| **Risk** | "Do you need risk level assessment per question?" | Safety inspections, food safety, compliance audits | Simple task checklists |

> **Rule of thumb:** If the user chose "full compliance audit" in Phase 1, enable all three. If they chose "simple checklist," ask whether they need scoring — they may not.

#### Workflow Features

| Feature | Question to Ask | When to Enable | When to Disable |
|---------|----------------|---------------|-----------------|
| **Summary Report** | "Do you need a PDF report generated when the activity is completed?" | Most audits/inspections | Internal quick-checks where no record is needed |
| **Form Review** | "Should a manager review/approve the form before reports and corrective actions are generated?" | When accuracy verification is critical, regulated environments | Trust the field user's submission as-is |
| **Corrective Actions** | "When issues are found, do you need to track corrective actions (tasks to fix the problem)?" | Compliance audits, safety inspections | Data-collection-only forms |
| **CA Review** | "Should corrective actions require approval before they can be closed out?" | Regulated environments, high-stakes compliance | Standard operational inspections |

> **Defaults:** Summary Report ON, Form Review OFF, Corrective Actions ON, CA Review OFF. These defaults work for most standard inspections and audits.

---

### Phase 3: Location Scope (Applies To)

**Goal:** Determine which locations/places this template should be available at.

| Question | Options |
|----------|---------|
| "Is this template for all locations, or a specific subset?" | **All** (default) or **Filtered** |
| If filtered: "How should we filter? By place type, region, saved group?" | Place Type, Geography, Saved Group, etc. |
| "Are there specific place types this applies to?" (e.g., Restaurant, Corporate, Drive-in) | Multi-select values |

**How location access works:** Users see templates based on their **location access** — if a template is scoped to California restaurants, only users with access to California restaurant locations will see it. This is an indirect user access control.

> **Default:** All locations. Only filter if the user explicitly says the template is designed for a specific subset of locations.

---

### Phase 4: User Access (Person Types)

**Goal:** Determine which user roles/profiles can see activities from this template.

| Question | Options |
|----------|---------|
| "Should all user roles see this template, or only specific roles?" | **All** (default) or **Specific roles** |
| If specific: "Which roles need access?" (e.g., Manager, Regional Director, VP, Field Worker) | Multi-select person types |

**How person type access works:** Person Types are a mix of out-of-the-box defaults and customer-configured roles. This is a **global record-level** access rule — selected Person Types control visibility across all workflow states (draft, in-progress, completed, etc.). Site Admins always have implicit access regardless.

> **Default:** All Person Types. Only restrict if the user explicitly says the template is for specific roles (e.g., "only managers should see this").

---

### Phase 5: Activation Model

**Goal:** Determine how activities get created from this template.

| Question | Options |
|----------|---------|
| "Will end-users create these on-demand when they need to run an inspection?" | On-Demand toggle |
| "Should the system automatically create activities on a recurring schedule?" | Automated Schedule toggle |
| If scheduled: "Calendar-style (specific days/times) or shift-based (X per shift)?" | Time-based vs. Period-based |
| "Or both — on-demand AND scheduled?" | Both enabled (forces Time-based) |

**Activation modes:**

| Mode | Use Case |
|------|----------|
| **On-Demand only** | Field workers decide when to inspect — ad-hoc, event-driven |
| **Scheduled only (Time-based)** | Recurring calendar schedule — "every Monday at 9am" |
| **Scheduled only (Period-based)** | Shift-driven — "2 inspections per morning shift" |
| **Both On-Demand + Scheduled** | Scheduled baseline with ability to run additional ad-hoc — **must use Time-based** |

> **Important constraint:** If both On-Demand and Automated Schedule are enabled, Period-based scheduling is not available — must use Time-based.

> **Default:** On-Demand ON, Automated Schedule ON, Time-based selected.

---

### Phase 6: Form Structure (Sections & Questions)

**Goal:** Design the section hierarchy and question content before building.

| Question | Why It Matters |
|----------|---------------|
| "What are the main areas/categories you want to inspect?" | Maps to top-level **Sections** |
| "Within each area, are there sub-categories?" | Maps to **Subsections** (nested sections) |
| "What specific questions do you need in each section?" | Maps to **Questions** with specific types |
| "For each question, what happens when the answer is non-compliant?" | Maps to answer table config (risk, CAs, observations) |

> **See:** [`form-building/shared-concepts.md`](form-building/shared-concepts.md) for answer table, evaluation settings, corrective actions, observations, and recommendations configuration.

---

### Phase 7: Output Build Spec

**Goal:** Persist the entire plan as files so any agent can pick it up and build the form without needing conversation context.

After completing Phases 1–6 with the user, create a **build spec** folder under `cmx1/builds/{form-name}/` with three files:

| File | Contents | Purpose |
|------|----------|---------|
| **`settings.md`** | Template name, description, color, all feature toggles, location scope, person types, activation model, build steps | Agent reads this to create the template via the 2-step wizard |
| **`form-layout.md`** | Every section, subsection, and question — **with inline scoring, compliance, risk, and CA config per question row** | Agent reads this to build questions AND configure answer tables |
| **`scoring-compliance.md`** | Reusable answer profiles with observations, recommendations, and visibility rules | Agent cross-references this for observation/recommendation dropdowns |

#### `form-layout.md` — Enhanced Question Table Format

The question tables must be **self-sufficient for the builder agent**. Every question row includes all answer table configuration inline so the agent never has to guess or cross-reference for core scoring setup.

**Required columns for scored questions:**

| Column | What to include |
|--------|----------------|
| **#** | Question number |
| **Question** | Full question text |
| **Type** | Question type (Yes/No, Temp, Photo, Text, DateTime, Signature) |
| **Pass** | Pass answer → points (earned/available), compliance status, risk level |
| **Fail** | Fail answer → points (earned/available), compliance status, risk level |
| **CA** | Corrective action on fail: days + type (BD = Business Day, Immed = Immediate) |
| **Profile** | Letter reference to `scoring-compliance.md` for observations & recommendations |

**Example row (Yes/No question):**
```
| 1.1 | Are all proteins at 41°F or below? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
```

**Example row (Temperature question):**
```
| 1.2 | Receiving temp — Chicken | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
```

**Example row (Data-only question):**
```
| 1.8 | Photo of delivery log | Photo | — | — | — | Z |
```

**Additional details to include per section:**
- Section-level scored question count and max points
- Visibility rules inline (add a Visibility column for gated sections)
- Callout notes for inverted questions, immediate CAs, or special thresholds
- Scoring summary table at the end

#### `scoring-compliance.md` — Companion File

This file defines **reusable answer profiles** (A, B, C, etc.) that group:
- Observation reasons (dropdown values for the observation field)
- Recommended actions (dropdown values for the recommendation field)
- Visibility/requirement rules (when observations, recommendations, photos are visible/required)

The builder agent reads `form-layout.md` for what to build and how to score, then references `scoring-compliance.md` only for observation/recommendation dropdown values and visibility rules.

**Why build specs?**
- Conversations get compacted — build specs persist the plan permanently
- A different agent session can pick up and execute the build
- The user can review and iterate on the spec before building
- Serves as documentation of what was built and why

> **Naming convention:** Use kebab-case for the folder name (e.g., `ccp-checklist`, `facility-safety-audit`, `daily-ops-checklist`)

#### Presenting Build Specs to the User

After generating the build spec files, **always present clickable file links** so the user can preview them directly in the Claude app without navigating to the folder manually.

**Format to use:**

```
Build spec is ready for review:

- [settings.md](cmx1/builds/{form-name}/settings.md)
- [form-layout.md](cmx1/builds/{form-name}/form-layout.md)
- [scoring-compliance.md](cmx1/builds/{form-name}/scoring-compliance.md)
```

Use **full absolute paths** in the links (e.g., `/Users/chrisrice/Documents/Business Stuff/vNext Agent Full Form Build/cmx1/builds/{form-name}/settings.md`) so they resolve correctly regardless of working directory. Present all three files together after they're all written, and ask the user to review before proceeding to build.

---

## Build Execution Strategy (Agent Orchestration)

Building a form from a build spec is a multi-phase process. Different models handle different phases based on the judgment required.

### Model Assignments

| Phase | Model | Why This Model |
|-------|-------|----------------|
| **1. Planning & Spec Creation** | Opus | High-judgment: interactive Q&A with user, domain reasoning, designing form structure, writing build specs |
| **2. Template Setup (wizard modal)** | Opus | UI navigation requiring visual understanding, adapting to dynamic UI state |
| **3. Form Scaffolding** | Opus | Establishes patterns — creates sections, subsections, and one example question per unique profile variation |
| **4. Bulk Question Build** | Haiku (sub-agent) | Repetitive execution: follows the patterns Opus established for 30-40 remaining questions |
| **5. Visual Verification** | Opus | Quality gate: screenshots each section, compares against spec, reports discrepancies |

### Phase-by-Phase Workflow

#### Phase 1: Planning (Opus)

Run the interactive discovery process (Phases 1–6 above) with the user:
- Gather template identity, feature toggles, location scope, user access, activation model
- Design section structure and question list
- Generate build spec files (`settings.md`, `form-layout.md`, `scoring-compliance.md`)
- Get user approval on the spec before proceeding

#### Phase 2: Template Setup (Opus)

Navigate the 2-step creation wizard using values from `settings.md`:
1. Navigate to Activity Templates list page
2. Click "+ New Activity Template"
3. Fill Step 1 (Setup): name, description, color, evaluation toggles, workflow toggles
4. Click Next
5. Fill Step 2 (Access & Activation): location scope, person types, activation mode
6. Click "Create Template"
7. Arrives in Form Builder — ready for scaffolding

#### Phase 3: Form Scaffolding (Opus)

Create the structural foundation and establish patterns the bulk agent will follow:

1. **Create all sections and subsections** per `form-layout.md`
2. **Build one example question for each unique answer profile** end-to-end:
   - Create the question with the correct type
   - Configure the full answer table (points, compliance, risk, CA)
   - Set up observations and recommendations from `scoring-compliance.md`
   - Configure visibility/requirement rules
   - Verify it looks correct via screenshot

**Example questions to build (one per unique variation):**

| Profile | Example Question | Why It's Unique |
|---------|-----------------|-----------------|
| A | 1.1 (Standard Yes/No) | Base pattern — Yes=pass, No=fail |
| B | 2B.3 (Inverted Yes/No) | Reversed — No=pass, Yes=fail |
| C | 1.2 (Cold temp ≤41°F) | Temperature with upper-bound threshold |
| D | 2B.1 (Freezer ≤0°F) | Temperature with different threshold than C |
| E | 4.1 (Hot holding ≥135°F) | Temperature with lower-bound threshold |
| F | 3.1 (Cooking ≥165°F) | Cooking temp — each has a unique threshold per protein |
| G | 5.4 (Cooling 2hr ≤70°F) | Temperature + **Immediate** CA (not Business Day) |
| H | 5.5 (Cooling 6hr ≤41°F) | Temperature + **Immediate** CA (different threshold than G) |
| I | 6.2 (Reheat ≥165°F) | Reheat threshold |
| Z | 1.8 (Photo) | Data-only — no scoring, no answer table config |

> **Why one per profile?** This proves each pattern works in the actual UI, catches configuration issues early, and gives the bulk agent a concrete reference to follow.

#### Phase 4: Bulk Question Build (Haiku Sub-Agent)

Opus launches a Haiku sub-agent to build the remaining questions. The sub-agent receives:

**Context to include in the sub-agent prompt:**
- Path to all three build spec files
- List of questions already built by Opus (the example questions above)
- List of remaining questions to build
- Instructions to follow the established patterns section by section
- Reference to the relevant question type skill files for UI interaction steps

**Sub-agent workflow:**
1. Read `form-layout.md` for the full question list
2. For each remaining question:
   - Identify which section it belongs to
   - Create the question with the correct type
   - Configure answer table using the inline Pass/Fail/CA values from the spec
   - Add observations and recommendations per the Profile reference in `scoring-compliance.md`
   - Apply visibility rules if applicable (gated sections)
3. Work section by section in order

**What Haiku handles well here:**
- Following a clear, explicit spec (the enhanced `form-layout.md` tables)
- Repetitive UI interactions (same pattern, different values)
- High-volume question creation without context fatigue

**What Haiku should NOT do:**
- Make judgment calls about scoring or risk levels (that's in the spec)
- Skip questions or sections
- Deviate from the established patterns

#### Phase 5: Visual Verification (Opus)

After the sub-agent completes, Opus takes over for quality assurance:

1. **Section-by-section screenshots** — capture each section in the form builder
2. **Question count verification** — confirm the right number of questions per section
3. **Spot-check answer tables** — open a few questions per section and verify scoring, compliance, risk, CA config
4. **Visibility rule verification** — test gate questions (5.1, 6.1) to confirm dependent questions hide/show
5. **Scoring summary check** — verify the Scoring view shows correct max points per section
6. **Report to user** — summary of what was built, any discrepancies found, screenshots of completed form

### Orchestration Diagram

```
┌─────────────────────────────────────────────────────┐
│                   OPUS (Planning)                    │
│  Interactive Q&A → Build Spec Files                  │
│  settings.md · form-layout.md · scoring-compliance   │
└──────────────────────┬──────────────────────────────┘
                       │ user approves spec
                       ▼
┌─────────────────────────────────────────────────────┐
│                 OPUS (Template Setup)                │
│  2-step wizard: Setup → Access & Activation          │
│  → Lands in Form Builder                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               OPUS (Form Scaffolding)                │
│  Create sections/subsections                         │
│  Build 1 example question per unique profile (A–Z)   │
│  Verify each pattern works via screenshot            │
└──────────────────────┬──────────────────────────────┘
                       │ launches sub-agent
                       ▼
┌─────────────────────────────────────────────────────┐
│             HAIKU SUB-AGENT (Bulk Build)             │
│  Reads build spec files                              │
│  Builds remaining ~35 questions                      │
│  Follows established patterns section by section     │
└──────────────────────┬──────────────────────────────┘
                       │ completes
                       ▼
┌─────────────────────────────────────────────────────┐
│              OPUS (Visual Verification)              │
│  Screenshot each section                             │
│  Verify question counts, scoring, visibility rules   │
│  Report results to user                              │
└─────────────────────────────────────────────────────┘
```

---

## Planning Checklist (Quick Reference)

Use this checklist when starting a new template project:

```
□ New activity or updating existing?
□ Site/environment (dev, staging, production, URL)
□ Link to existing activity (if updating)
□ Template name and description
□ Simple checklist or full compliance audit?
□ Template color (visual identifier)
□ Evaluation features: Scoring? Compliance? Risk?
□ Summary Report needed?
□ Form Review gate needed?
□ Corrective Actions needed?
□ CA Review gate needed?
□ Location scope: All or filtered?
□ User access: All Person Types or specific roles?
□ Activation: On-demand? Scheduled? Both?
□ If scheduled: Time-based or Period-based?
□ Section structure outline
□ Question list per section (with types)
□ Answer configurations (points, compliance, risk, CAs)
□ Observation reasons and recommended actions per question
□ Visibility/requirement rules for observations, recommendations, photos
```

---

## Section & Subsection Architecture

> **TODO:** Document best practices for organizing sections and subsections:
> - When to use flat vs. nested sections
> - Sub-sub-sub section depth limits and recommendations
> - Grouping questions by area, process, or risk category
> - Section naming conventions for analytics consistency

---

## Risk Taxonomy & Risk Levels

> **TODO:** Document risk level design:
> - Standard risk levels (Managed, Failure, Major, Minor, Warning, etc.)
> - How risk levels are configured at the organization level
> - Mapping answers to risk levels for meaningful analytics
> - Risk assortment: mapping different question/answer combinations to an overall risk profile
> - Risk level hierarchy and severity ordering

---

## Scoring & Points Strategy

> **TODO:** Document scoring design:
> - Points system: earned vs. available points
> - Weighting questions by importance via point allocation
> - Section-level scoring rollups
> - Scoring toggle (Build / Scoring view in top nav)
> - Designing a scoring rubric that reflects actual risk

---

## Compliance Framework

> **TODO:** Document compliance design:
> - In / Out / Not Assessed — when to use each
> - Designing questions for clear compliance mapping
> - Compliance percentage calculations
> - Regulatory vs. internal compliance standards

---

## Corrective Action Timeframes

> **TODO:** Document CA timeline design:
> - Business Days vs. Calendar Days — when to use each
> - Standard timeframe recommendations (7, 14, 30 days)
> - Immediate Actions vs. Standard CAs — design intent
> - Escalation patterns for overdue CAs
> - How CA timeframes affect analytics and reporting

---

## Analytics & Reporting Considerations

> **TODO:** Document designing forms for good analytics:
> - Consistent answer schemas across questions for aggregation
> - Using observations/reasons for trend analysis
> - How corrective action data feeds into dashboards
> - Template versioning and its impact on historical data
> - Tagging strategy for cross-form analytics

---

## Template Lifecycle

> **TODO:** Document template management:
> - Creating a new template from scratch
> - Searching for and cloning existing templates
> - Template versioning and publishing
> - Template sharing across teams/locations
