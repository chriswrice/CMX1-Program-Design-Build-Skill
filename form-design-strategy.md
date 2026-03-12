# CMX1 Activity Studio — Form Design Strategy

> **Parent:** [`cmx1/activity-studio.md`](activity-studio.md)

This file covers the **research & planning phase** for building CMX1 activity templates. Before touching the form builder, gather requirements from the user to make smart high-level decisions. These decisions map directly to the template creation wizard (Setup → Access & Activation) and influence everything downstream.

---

## Research & Planning Workflow

When a user asks to build a new form/template, follow this structured discovery process **before creating the template**. Each phase maps to real configuration in Activity Studio.

### Pre-Phase: Environment Setup (One-Time Only)

> **This only needs to happen once per machine.** On first run, install tools, gather the user's environment info, and persist it to a config file. On subsequent sessions, read the config file, verify tools are installed, and skip straight to Phase 1. Tell the user: "This is a one-time setup — once we get through this, future sessions will skip straight to building."

#### Step 1: Check for Existing Config

Look for the config file at: `cmx1-activity-studio-skills/user-environment.md`

- **If the file exists:** Read it, confirm the settings are still correct with the user ("I see you're using Chrome Profile 5 on acme.cmx1.com — still correct?"), verify Playwright CLI is installed (`playwright-cli --help`), then jump to Phase 1.
- **If the file doesn't exist:** Run Steps 2–4 to install tools, gather info, and create the config.

#### Step 2: Install Playwright CLI (One-Time Only)

> **IMPORTANT — Always fetch the latest instructions:** Before installing, read the official README at `https://github.com/microsoft/playwright-cli` to get the current installation commands and requirements. Do NOT rely on cached or memorized instructions — the CLI is actively developed and commands may change. Fetch the README, extract the install steps, and follow them.

**Why Playwright CLI?** This is the tool that lets Claude build forms by running browser commands directly — clicking buttons, filling inputs, configuring answer tables. Without it, form building falls back to slow screenshot-based interactions. It's fast, token-efficient, and purpose-built for coding agents.

**Installation steps:**

1. **Check Node.js version** (requires 18+):
   ```bash
   node --version
   ```
   If not installed or below v18, install via: `brew install node` (macOS) or download from https://nodejs.org

2. **Fetch latest install instructions from GitHub:**
   ```
   WebFetch https://github.com/microsoft/playwright-cli
   → Extract: npm install command, system requirements, any new setup steps
   ```

3. **Install globally:**
   ```bash
   npm install -g @playwright/cli@latest
   ```

4. **Install skills integration** (registers CLI with coding agents like Claude Code):
   ```bash
   playwright-cli install --skills
   ```

5. **Verify installation:**
   ```bash
   playwright-cli --help
   ```
   Should display available commands (open, click, fill, snapshot, screenshot, etc.)

6. **Install Chromium browser** (required for both `playwright-cli` and CDP scripts):
   ```bash
   # Create a workspace for CDP scripts (global npm installs don't resolve for ESM imports)
   mkdir -p ~/playwright-workspace && cd ~/playwright-workspace && npm init -y && npm install playwright
   # Download Chromium browser binary
   cd ~/playwright-workspace && npx playwright install chromium
   ```
   This downloads Chromium to `~/Library/Caches/ms-playwright/` — shared by both `playwright-cli` and CDP scripts.

7. **Verify both tools work:**
   ```bash
   # CLI tool (interactive agent commands)
   playwright-cli --help

   # Library (for .mjs batch scripts)
   cd ~/playwright-workspace && node -e "import('playwright').then(m => { console.log('✅ playwright library OK'); })"
   ```

**If npm/node is not available:** Help the user install Node.js first. On macOS: `brew install node`. On other platforms, direct them to https://nodejs.org.

#### Step 3: Gather Environment Info (First Time Only)

Ask the user these questions:

| Question | Why It Matters |
|----------|---------------|
| **Which Chrome profile do you use for CMX1?** | Chrome has multiple profiles — we need to launch the right one so cookies/sessions are preserved and Claude in Chrome connects to the correct window. |
| **What is your default CMX1 site URL?** (e.g., `acme.cmx1.com`) | Need to know where to navigate. |
| **Do you have additional sites?** (dev, staging, etc.) | Useful to have on file for quick switching. |

**How to find Chrome profiles** — run this to list available profiles with their names:
```bash
for dir in "$HOME/Library/Application Support/Google/Chrome/Default" \
           "$HOME/Library/Application Support/Google/Chrome"/Profile\ *; do
  [ -f "$dir/Preferences" ] && {
    name=$(python3 -c "import json; print(json.load(open('$dir/Preferences')).get('profile',{}).get('name','?'))" 2>/dev/null)
    echo "$(basename "$dir") → $name"
  }
done
```

Present the results to the user so they can pick their profile by name.

#### Step 4: Create the Config File

Write the config to `cmx1-activity-studio-skills/user-environment.md`:

```markdown
# User Environment Config
> Auto-generated by the form-building skill. Updated: {date}

## Playwright CLI
- **Installed:** yes
- **Version:** {output of `playwright-cli --version`}
- **Skills installed:** yes
- **Install command used:** `npm install -g @playwright/cli@latest`

## Playwright Library (for CDP Scripts)
- **Workspace:** ~/playwright-workspace/
- **Version:** {output of `cd ~/playwright-workspace && node -e "import('playwright').then(m => console.log(m.chromium.name()))"`}
- **Chromium:** downloaded to ~/Library/Caches/ms-playwright/

## Chrome Profile
- **Profile directory:** Profile 5
- **Profile name:** Meagan
- **Launch command:** `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --profile-directory="Profile 5"`

## CMX1 Sites
- **Primary:** https://acme.cmx1.com
- **Dev:** https://acme-dev.cmx1.com
- **Staging:** https://acme-staging.cmx1.com

## Claude in Chrome
- Extension installed: yes
- Quick check: `tabs_context_mcp` returns tab IDs
```

#### Step 5: Verify Tooling

Run these checks silently (don't ask the user — just verify and report any issues):

| Check | How | If Failing |
|-------|-----|------------|
| **Playwright CLI installed** | `playwright-cli --help` | Run Step 2 installation |
| **Playwright CLI skills** | Check `.claude/skills/playwright-cli/skill.md` exists | `playwright-cli install --skills` |
| **Node.js 18+** | `node --version` | `brew install node` or https://nodejs.org |
| **Chromium browser downloaded** | `ls ~/Library/Caches/ms-playwright/chromium-*` | `cd ~/playwright-workspace && npx playwright install chromium` |
| **CDP scripts workspace** | `ls ~/playwright-workspace/node_modules/playwright` | `mkdir -p ~/playwright-workspace && cd ~/playwright-workspace && npm init -y && npm install playwright` |
| **Claude in Chrome connected** | Call `tabs_context_mcp` | Tell user to open Chrome with their profile and click "Connect" in the Claude in Chrome extension |
| **Correct Chrome profile running** | Take a screenshot or check the tab URLs — does it match the user's expected profile/sites? | User needs to close Chrome and relaunch with the right profile |
| **CMX1 logged in** | Navigate to the user's CMX1 site URL and check if it loads (not a login page) | Tell user to log in first |

**Once verified, note it and never ask again for this session.** Jump to Phase 1.

#### Chrome Profile Tips

- **Why this matters:** If Chrome is already running with a different profile, launching with `--profile-directory` opens a new window in that profile but Claude in Chrome may still be connected to the wrong window. The safest flow: quit Chrome entirely → relaunch with the correct profile → connect Claude in Chrome.
- **Multiple profiles open:** Chrome can have multiple profiles open simultaneously, but Claude in Chrome connects to whichever window the user clicked "Connect" in. Always verify you're in the right profile by checking the tab URLs after connecting.

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
| "Which questions are scored/evaluated vs. just collecting information?" | Scored questions get Points, Compliance, Risk, CAs configured. Data-only questions (text, dates, photos, vendor info, etc.) get all evaluation toggles turned OFF. Maps to `Eval` column in build spec. |
| "For each scored question, what happens when the answer is non-compliant?" | Maps to answer table config (risk, CAs, observations) |
| "Should all questions be required, or are some optional? Any sections that are entirely optional?" | Maps to Required checkbox per question. Focus on always-visible content — questions behind visibility rules are already conditional. |
| "Do any questions need N/A (Not Applicable) or N/O (Not Observed) options?" | Maps to N/A and N/O toggles per question. Better than "optional" for audit trails since the end-user explicitly acknowledges why they're skipping. |

> **Default:** All questions required. Only mark questions as optional (or add N/A / N/O) when the user explicitly identifies them. For compliance audits, strongly prefer N/A over making questions optional — it keeps the audit trail clean.

> **See:** [`form-building/shared-concepts.md`](form-building/shared-concepts.md) for answer table, evaluation settings, corrective actions, observations, recommendations, and required/optional configuration.

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

**Required columns:**

| Column | What to include |
|--------|----------------|
| **#** | Question number |
| **Question** | Full question text |
| **Type** | Question type (Yes/No, Temp, Photo, Text, DateTime, Signature, Dropdown, Numeric, etc.) |
| **Eval** | Evaluation toggles: `Scored` (all ON) or `OFF` (all OFF — data-only). This tells the builder agent whether to leave Points/Compliance/Risk/CAs at defaults or turn them all off. |
| **Pass** | Pass answer → points (earned/available), compliance status, risk level. Use `—` for data-only questions. |
| **Fail** | Fail answer → points (earned/available), compliance status, risk level. Use `—` for data-only questions. |
| **CA** | Corrective action on fail: days + type (BD = Business Day, Immed = Immediate). Use `—` for data-only questions. |
| **Profile** | Letter reference to `scoring-compliance.md` for observations & recommendations |

**Example row (Yes/No — scored):**
```
| 1.1 | Are all proteins at 41°F or below? | Yes/No | Scored | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
```

**Example row (Temperature — scored):**
```
| 1.2 | Receiving temp — Chicken | Temp | Scored | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
```

**Example row (Text — data-only):**
```
| 1.7 | Invoice Number | Text | OFF | — | — | — | — |
```

**Example row (Date — data-only):**
```
| 1.8 | Date of Service | Date | OFF | — | — | — | — |
```

**Example row (Photo — data-only):**
```
| 1.9 | Photo of delivery log | Photo | OFF | — | — | — | Z |
```

**Example row (Dropdown — data-only, for categorization):**
```
| 1.10 | Vendor Name | Dropdown | OFF | — | — | — | — |
```

> **Builder agent rule:** When the `Eval` column says `OFF`, the agent **must** turn off all four evaluation toggles (Points, Compliance, Risk, Corrective Actions) for that question. Do not leave them at their defaults. When `Eval` says `Scored`, leave them at defaults (all ON) and configure the answer table per the Pass/Fail/CA columns.

**Additional details to include per section:**
- Section-level scored question count and max points (only count `Scored` questions)
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

Create the structural foundation and establish patterns the bulk agent will follow.

**Primary tool: `playwright-cli`** — The agent runs `snapshot` → `click`/`fill` loops interactively, adapting in real-time if selectors fail. This is preferred over CDP scripts because it's self-healing: if a snapshot ref is wrong, the agent re-snapshots and finds the right element.

**Workflow:**
```bash
# 1. Open browser and navigate to the template
playwright-cli open
playwright-cli goto "https://{site}.cmx1.com/a/activitystudio/{template-id}/details"

# 2. Take a snapshot to see the page structure
playwright-cli snapshot

# 3. Interact using element refs from the snapshot
playwright-cli click e15        # Click a section
playwright-cli fill e7 "text"   # Fill an input
playwright-cli snapshot          # Re-snapshot to verify and get new refs
```

**Steps:**
1. **Create all sections and subsections** per `form-layout.md`
2. **Build one example question for each unique answer profile** end-to-end:
   - Create the question with the correct type
   - Configure the full answer table (points, compliance, risk, CA)
   - Set up observations and recommendations from `scoring-compliance.md`
   - Configure visibility/requirement rules
   - Verify it looks correct via `playwright-cli snapshot` or `playwright-cli screenshot`

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

Opus launches a Haiku sub-agent to build the remaining questions.

**Primary tool: `playwright-cli`** — Sub-agents use `playwright-cli` commands via Bash. For each question: `snapshot` → identify refs → `click`/`fill` sequence following the recipe from the relevant question type file (e.g., `yes-no.md`). `playwright-cli` is preferred for sub-agents because it's self-healing — if a snapshot ref changes, the agent re-snapshots and adapts.

**Alternative:** For maximum speed on well-tested builds, run pre-written CDP `.mjs` scripts from `~/playwright-workspace/`. CDP scripts are rigid (break if selectors change) but faster for batch operations with no decision-making.

**Context to include in the sub-agent prompt:**
- Path to all three build spec files
- List of questions already built by Opus (the example questions above)
- List of remaining questions to build
- Instructions to follow the established patterns section by section
- Reference to the relevant question type skill files for `playwright-cli` command sequences
- The `playwright-cli` session name to reuse (e.g., `-s=cmx1`)

**Sub-agent workflow:**
1. Read `form-layout.md` for the full question list
2. For each remaining question:
   - `playwright-cli snapshot` to see current page state
   - Identify which section it belongs to, navigate if needed
   - Create the question with the correct type using `click`/`fill` commands
   - Configure answer table using the inline Pass/Fail/CA values from the spec
   - Add observations and recommendations per the Profile reference in `scoring-compliance.md`
   - Apply visibility rules if applicable (gated sections)
   - `playwright-cli snapshot` to verify before moving on
3. Work section by section in order

**What Haiku handles well here:**
- Following a clear, explicit spec (the enhanced `form-layout.md` tables)
- Repetitive `playwright-cli` command sequences (same pattern, different values)
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
□ Scored vs. data-only per question? (data-only = turn off Points/Compliance/Risk/CAs)
□ Required vs. optional questions? Any N/A or N/O needed?
□ Answer configurations for scored questions (points, compliance, risk, CAs)
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
