# CMX1 Activity Studio — Master Skill File

This skill documents the **CMX1 Activity Studio**, a form/checklist builder for quality, compliance, and inspection workflows. Use this as the entry point — it covers navigation, templates, and top-level concepts. Detailed form-building topics are in sub-files.

> **URL pattern:** `https://{clientname}.cmx1.com/a/activitystudio/{activity-id}/details`
> Each CMX1 customer has their own subdomain (e.g., `acme.cmx1.com`, `bigcorp.cmx1.com`). The client name varies by customer — ask the user which site they're working on if not already known.

The app uses `data-cy` attributes extensively for test automation. All Playwright selectors should prefer `[data-cy="..."]` patterns. UUIDs in selectors are dynamic per answer/question instance.

---

## Skill File Directory

| File | Covers |
|------|--------|
| **`cmx1/activity-studio.md`** *(this file)* | What is Activity Studio, navigating, top nav, creating/searching templates |
| **`cmx1/form-design-strategy.md`** | Higher-level form design: section strategy, risk taxonomy, scoring philosophy, analytics |
| **`cmx1/form-building/shared-concepts.md`** | Universal concepts across all question types: answer table, evaluation settings, compliance/risk/points, corrective actions, observations, recommendations, footer controls, visibility & requirement rules, next suggested step |
| **`cmx1/form-building/question-types/yes-no.md`** | Yes/No question type: block layout, selectors, workflows, example configuration |
| **`cmx1/form-building/question-types/button-group.md`** | Button Group question type *(TODO)* |
| **`cmx1/form-building/question-types/dropdown.md`** | Dropdown question type *(TODO)* |
| **`cmx1/form-building/question-types/checkbox.md`** | Checkbox question type *(TODO)* |
| **`cmx1/form-building/question-types/numeric.md`** | Numeric question type *(TODO)* |
| **`cmx1/form-building/question-types/text-date.md`** | Text / Date / DateTime question types *(TODO)* |
| **`cmx1/form-building/question-types/temperature-timer.md`** | Temperature / Timer question types *(TODO)* |
| **`cmx1/form-building/question-types/attachment-photo.md`** | Attachment / Photo question types *(TODO)* |
| **`cmx1/form-building/question-types/signature-executive-summary.md`** | Signature / Executive Summary question types *(TODO)* |

### Build Specs (Form Projects)

When planning a new form with a user, output the plan as a **build spec** — a set of files an agent can pick up and execute independently.

| Folder | Contents |
|--------|----------|
| **`cmx1/builds/{form-name}/settings.md`** | Template-level config: name, description, color, feature toggles, location scope, person types, activation model |
| **`cmx1/builds/{form-name}/form-layout.md`** | Complete section/subsection/question list with question types, visibility rules, and notes |
| **`cmx1/builds/{form-name}/scoring-compliance.md`** | Answer profiles (points, compliance, risk, CAs), per-question profile mapping, observations, recommendations |

**Existing build specs:**

| Build | Status |
|-------|--------|
| **`cmx1/builds/ccp-checklist/`** | Ready to build — CCP food safety checklist for CA restaurants |

---

## ⚠️ Browser Automation — MANDATORY RULES

> **NON-NEGOTIABLE:** You MUST use the user's existing, authenticated browser session. **NEVER launch a new/isolated browser instance.** Users are already logged into CMX1 — launching a fresh browser loses their session, cookies, and authentication. This is a hard requirement, not a suggestion.

### When to Use What

| Task | Use | Why |
|------|-----|-----|
| **Initial exploration** — figuring out the UI, finding selectors, understanding layout | Claude in Chrome | Quick screenshots, read page, natural language find |
| **Login / authentication** — helping user get logged in | Claude in Chrome | Already connected, can navigate to login URL |
| **Actual form building** — adding questions, configuring answers, setting compliance | **CDP Scripts** | 10x faster, uses `data-cy` selectors directly, no screenshots needed, saves massive tokens |
| **Bulk operations** — adding 10+ observations, configuring entire sections | **CDP Scripts** | Can loop through items programmatically in milliseconds |
| **One-off checks** — "what does this page look like?" | Claude in Chrome | Quick screenshot without script overhead |
| **Reusable scripts** — automation that runs again on other templates | **CDP Scripts** | Scripts are `.mjs` files that can be shared and re-run |

### Claude in Chrome (For Exploration & Setup)

> Claude in Chrome (`mcp__Claude_in_Chrome`) connects directly to the user's real Chrome browser with all cookies, sessions, and login state intact. **No CDP setup required. Just works.** Best for exploring the UI, taking screenshots, and helping with login.

**Strengths:**
- ✅ Zero setup — already connected to user's real browser
- ✅ Great for exploration, navigation, and login assistance
- ✅ Natural language element finding

**Weaknesses:**
- ❌ Every action requires a screenshot → vision interpretation → coordinate click cycle
- ❌ Burns tons of tokens on screenshot images
- ❌ Slow — screenshot + AI interpretation per step
- ❌ Coordinate-based clicking can miss targets
- ❌ Not reusable — each session is manual
- ❌ No `waitForSelector` — can't reliably wait for DOM changes

**Available Claude in Chrome Tools:**

| Tool | Purpose |
|------|---------|
| `mcp__Claude_in_Chrome__tabs_context_mcp` | Get tab group context — must call first |
| `mcp__Claude_in_Chrome__read_page` | Get accessibility tree of the page (elements, roles, refs) |
| `mcp__Claude_in_Chrome__find` | Find elements by natural language (e.g., "save button", "section named Receiving") |
| `mcp__Claude_in_Chrome__computer` | Mouse clicks, keyboard input, screenshots, scrolling |
| `mcp__Claude_in_Chrome__form_input` | Fill form inputs by element ref |
| `mcp__Claude_in_Chrome__navigate` | Navigate to URL or go back/forward |
| `mcp__Claude_in_Chrome__get_page_text` | Extract raw text content from page |
| `mcp__Claude_in_Chrome__javascript_tool` | Run JS in the page context |
| `mcp__Claude_in_Chrome__read_console_messages` | Read browser console output |
| `mcp__Claude_in_Chrome__read_network_requests` | Monitor network requests |

### 🏆 CDP Scripts (For Bulk Form Building — PREFERRED for Speed & Tokens)

> **This is the PREFERRED method for building forms.** CDP scripts use the Playwright library to connect to the user's browser via Chrome DevTools Protocol and use direct DOM selectors (`[data-cy="..."]`) — no screenshots, no vision model, no coordinate guessing. Each action is a single line of code that executes in milliseconds and costs almost zero tokens. These are standalone `.mjs` Node scripts, not MCP tools.

**Strengths:**
- ✅ Direct selector-based interactions — `page.locator('[data-cy="add-section-button"]').click()`
- ✅ Saves massive tokens — no screenshot images to process
- ✅ 10x faster — no screenshot → interpret → click cycle
- ✅ Precise — selectors hit exact elements, no coordinate guessing
- ✅ `waitForSelector` — reliably waits for DOM changes before proceeding
- ✅ Batch operations — loop through 20 observations in seconds
- ✅ Reusable — scripts are `.mjs` files that can run again on other templates
- ✅ All CMX1 elements have `data-cy` attributes — built for this

**Requirement:** Must connect to user's existing browser via CDP (see setup below). **NEVER use `chromium.launch()`.**

**Prerequisites — Ask the User:**

1. **Which browser?** (Chrome recommended, Edge, Brave work too. Safari/Firefox ⚠️ not supported for CDP.)
2. **Which profile?** (e.g., "Default", "Work", "Personal")
3. **Is CMX1 already open?** (must be logged in)

**Setup — User Must Restart Browser with CDP Flag:**

```bash
# macOS — Google Chrome:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# macOS — Specific profile:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --profile-directory="Profile 1"

# macOS — Microsoft Edge:
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222

# macOS — Brave:
/Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --remote-debugging-port=9222

# Windows — Google Chrome:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Linux:
google-chrome --remote-debugging-port=9222
```

> **Important:** Chrome must be FULLY quit before relaunching with the flag. If any Chrome window is still open, the new instance joins the existing process (without CDP) and the flag is ignored.

**Verify CDP:** `curl -s http://localhost:9222/json/version`

**Connect Playwright:**

```javascript
import { chromium } from 'playwright';

// ✅ CORRECT — connects to user's existing browser session
const browser = await chromium.connectOverCDP('http://localhost:9222');
const contexts = browser.contexts();
const page = contexts[0].pages().find(p => p.url().includes('cmx1.com')) || contexts[0].pages()[0];

// ❌ NEVER DO THIS — launches an empty browser with no session
// const browser = await chromium.launch({ headless: false });
```

### Troubleshooting (Playwright CDP Only)

| Problem | Cause | Fix |
|---------|-------|-----|
| CDP endpoint not responding | Chrome wasn't launched with `--remote-debugging-port` | Fully quit Chrome and relaunch with the flag |
| "Target closed" errors | User closed the tab Playwright was connected to | Re-find the page from `context.pages()` |
| Wrong profile | CDP connects to whichever Chrome process has the port | Use `--profile-directory` flag when launching |
| Multiple Chrome instances | Only one process can bind to port 9222 | Ensure all Chrome instances are quit before relaunching |
| Chrome keeps relaunching | Agent keeps killing/relaunching Chrome in a loop | **STOP.** Use Claude in Chrome instead — it just works |

---

## What is Activity Studio?

Activity Studio is CMX1's form/checklist builder. An **Activity** is the top-level container — it holds sections, subsections, and questions that field users fill out during audits, inspections, and quality checks.

Key concepts:
- **Activity** = the entire form/template
- **Section** = a grouping of questions (supports nesting into subsections)
- **Question** = an individual question with answers, scoring, and logic
- **Template** = a reusable activity definition that can be scheduled and assigned

---

## Top Navigation & Activity Tabs

The top of the page shows the activity name and main tabs:

| Tab | Selector | Description |
|-----|----------|-------------|
| Form | `[data-cy="designer-topbar-workflow-button"]` (first) | Form builder (main view) |
| Workflow | `[data-cy="designer-topbar-workflow-button"]` (second) | Workflow configuration |
| Corrective Actions | `[data-cy="designer-topbar-corrective-action-button"]` | CA template setup |
| Schedule | `[data-cy="designer-topbar-schedule-button"]` | Scheduling |

Sub-navigation (below tabs):
- **Build** / **Scoring** toggle: `[data-cy="build-scoring-toggle"]`
- **Publish** button: Top-right corner

---

## Form Structure (Left Navigation & Sections)

The left sidebar controls the hierarchical structure of a form. Forms are organized into **Sections** and **Subsections**, each containing questions.

### Left Sidebar Layout

```
+-----------------------------+
| Sections          [Add +]   |
+-----------------------------+
| v  Activity Name            |
|    (X sections, Y questions)|
|                             |
|    > Section 1       (N)    |
|    > Section 2       (N)    |
|      > Subsection A  (N)   |
|    > Section 3       (N)    |
+-----------------------------+
```

### DOM Selectors — Left Sidebar

| Element | Playwright Selector |
|---------|-------------------|
| Sections heading | `[data-cy="activity-sections-heading"]` |
| Add Section button | `[data-cy="add-section-button"]` |
| Add Section text | `[data-cy="add-section-text"]` |
| Section name input | `input[placeholder="Untitled Section"]` |
| Section item | `[data-cy="section-item-{uuid}"]` |
| Section context menu | Right-click on section item |

### Creating Sections

| Action | How | Selector |
|--------|-----|----------|
| Add new section | Click "Add +" button | `[data-cy="add-section-button"]` |
| Add subsection | Right-click section → "Add Subsection" | Context menu |
| Add section (alt) | Right-click section → "Add Section" | Context menu |

- New sections are created with the name **"Untitled Section"** by default
- The section name becomes editable in the right panel's Section Details

### Section Interactions

**Hover behavior:**
- Hovering over a section reveals two icon buttons:
  - **Pencil icon** (edit) — opens section settings in the right panel
  - **Three dots icon** (more options) — opens context menu

**Context menu options** (right-click or dots icon):

| Menu Item | Action |
|-----------|--------|
| Add Section | Creates a new sibling section |
| Add Subsection | Creates a child section nested under this one |
| Delete | Removes the section and its contents |
| Duplicate | Creates a copy of the section with all its questions |

### Section Settings (Right Panel)

When a section is selected, the right panel shows **"Section"** header.

**Tabs:** `Settings` | `Logic`

#### Settings Tab
- **Section Details**
  - Section name text field
  - Enter ID... field
- **OPTIONS** (collapsible)
  - Custom Value field
  - Instructions text area (with Rich Text Editor checkbox)

#### Logic Tab
- **Visibility**: Controls when this section appears
  - **"Add Condition"** button to create visibility rules
  - Only use the side panel for setting visibility conditions

### Adding Questions to a Section

1. Click on a section in the left nav to select it
2. The main canvas area shows the section's questions
3. Click the blue **"+"** button at the bottom of the canvas → `[data-cy="add-question-zone-0"]`
4. A **Content panel** appears on the right showing **QUESTION TYPES** grid:

```
+-------------+---------------+------------+------------+
| Yes / No    | Button Group  | Dropdown   | Checkbox   |
+-------------+---------------+------------+------------+
| Text        | Temperature   | Numeric    | Timer      |
+-------------+---------------+------------+------------+
| Date        | Date Time     | Attachment | Photo      |
+-------------+---------------+------------+------------+
```

Selector for adding a question: `[data-cy="add-question-section"]`

Available question types (14 total):
1. Yes / No
2. Button Group
3. Dropdown
4. Checkbox
5. Text
6. Temperature
7. Numeric
8. Timer
9. Date
10. DateTime
11. Attachment
12. Photo
13. Signature *(available in Question Type dropdown, not shown in grid)*
14. Executive Summary *(available in Question Type dropdown, not shown in grid)*

---

## Activity Templates List Page

**URL:** `https://{clientname}.cmx1.com/a/activitystudio`

Navigate here via the left sidebar: **BUILD → Activity Templates**

This page shows all existing activity templates in a table:

| Column | Description |
|--------|-------------|
| **ID** | Numeric template ID |
| **NAME** | Template name |
| **CONFIG VERSION** | Version number of the template configuration |
| **USERNAME** | Email of the user who created/owns the template |
| **STATUS** | **Published** or **Draft** |
| **ACTIONS** | View/Edit links |

### DOM Selectors — Activity Templates List

| Element | Selector |
|---------|----------|
| Page heading | Text: "Activity Templates" |
| New Activity Template button | `[data-cy="activitystudio-create-button"]` (top-right, blue) |
| Template list table | Main content area table |
| View/Edit link per row | ACTIONS column links |

---

## Creating a New Template (2-Step Process)

Click **"+ New Activity Template"** on the Activity Templates list page. A modal dialog opens with a **2-step wizard**: **Setup** → **Access & Activation**.

### Step 1: Setup

The Setup step configures the template's core identity and feature toggles.

```
+----------------------------------------------------------+
| [Activity Icon]                                     [X]  |
| [Template Name Input*]                              [CR] |
| [Description Input]                                      |
|                                                          |
|  =====[progress bar]=====                                |
|  ○ Setup          ○ Access & Activation                  |
|                                                          |
|  Template Color*                                         |
|  [■ color swatch] [#06b6d4]                              |
|  ─────────────────────────────────────                   |
|  Form Settings                                           |
|  ┌─────────────────────────────────────┐                 |
|  │ Evaluation Form                     │                 |
|  │ ☑ Scoring  ☑ Compliance  ☑ Risk     │                 |
|  └─────────────────────────────────────┘                 |
|  Summary Report              [====ON]                    |
|  Form Review                 [OFF====]                   |
|  ─────────────────────────────────────                   |
|  Corrective Actions                                      |
|  Corrective Actions          [====ON]                    |
|  Review                      [OFF====]                   |
|                                                          |
|  [Cancel]                              [Next]            |
+----------------------------------------------------------+
```

#### Setup Fields & Controls

| Field | Selector | Description | Default |
|-------|----------|-------------|---------|
| **Template Name*** | `[data-cy="activity-name-input"]` | Name of the template (shown to end-users) — `placeholder="Untitled Activity"` | "Untitled Activity" |
| **Description** | `[data-cy="activity-description-input"]` | Purpose/description of the template — `placeholder="Add description..."` | Empty |
| **Template Color*** | `[data-cy="template-color-trigger"]` → `[data-cy="template-color-swatch"]` | Color swatch + hex input — visual identifier across the platform | `#06b6d4` (teal) |

#### Form Settings — Evaluation Form

These are **template-level master switches** that determine whether Scoring, Compliance, and Risk features are available *at all* across the entire form. If unchecked here, those columns won't appear in any question's answer table. Simple checklists may not need these; full compliance audits would enable all three.

| Checkbox | Selector | Default |
|----------|----------|---------|
| **Scoring** | `[data-cy="config-setting-scoring"]` → `input[type="checkbox"]` | ☑ Checked |
| **Compliance** | `[data-cy="config-setting-compliance"]` → `input[type="checkbox"]` | ☑ Checked |
| **Risk** | `[data-cy="config-setting-risk"]` → `input[type="checkbox"]` | ☑ Checked |

#### Form Settings — Toggles

| Toggle | Selector (row) | Default | Description |
|--------|---------------|---------|-------------|
| **Summary Report** | `[data-cy="summary-report-toggle-row"]` | **ON** | Enables the system to generate a PDF report when the activity is completed |
| **Form Review** | `[data-cy="form-review-toggle-row"]` | **OFF** | Adds a review/approval gate after end-user submits the form but *before* PDF reports and Corrective Actions are generated — allows a manager to verify the work first |
| **Corrective Actions** | `[data-cy="ca-toggle-row"]` | **ON** | Master switch to enable the Corrective Actions system for this template |
| **CA Review** | `[data-cy="ca-review-toggle-row"]` | **OFF** | When CAs are enabled, adds a review/approval step on corrective actions before they can be closed out |

> **Note:** All toggles use **HeadlessUI Switch** components (`button[role="switch"]` with `aria-checked`). The visible knob element is `[data-cy="on-off-switch-toggle"]` inside each row.

#### Modal Structure Selectors

| Element | Selector |
|---------|----------|
| Modal dialog | `[role="dialog"]` |
| Modal backdrop | `[data-cy="modal-backdrop"]` |
| Modal container | `[data-cy="modal-container"]` |
| Config form | `[data-cy="activity-config-form"]` |
| Close button (X) | `[data-cy="close-modal-button"]` |
| Modal header | `[data-cy="modal-header"]` |
| Activity icon | `[data-cy="activity-icon"]` |
| User avatar | `[data-cy="user-avatar"]` |
| Tab bar | `[data-cy="tab-bar"]` |
| Setup tab | `[data-cy="tab-setup"]` |
| Access & Activation tab | `[data-cy="tab-access-activation"]` |
| Scrollable content area | `[data-cy="scrollable-content"]` |
| Cancel button | `[data-cy="cancel-button"]` |
| Modal footer | `[data-cy="modal-footer"]` |

### Step 2: Access & Activation

The Access & Activation step controls **where** the template is used, **who** can see it, and **how** activities get created from it.

```
+----------------------------------------------------------+
| [Activity Icon]                                     [X]  |
| [Template Name]                                     [CR] |
| [Description]                                            |
|                                                          |
|  =====[progress bar]=====                                |
|  ○ Setup          ● Access & Activation                  |
|                                                          |
|  ACCESS                                                  |
|  ┌─────────────────────────────────────────────────────┐ |
|  │ ⊙ Applies To*                                      │ |
|  │ Where [Places v] is [Saved Group v]                │ |
|  │                                                     │ |
|  │ Match all of the following conditions:              │ |
|  │ [Place Type v] [is v] [Restaurant x][Corporate x]  │ |
|  │ + Add Condition                                     │ |
|  │ + Add Filter Rule                                   │ |
|  └─────────────────────────────────────────────────────┘ |
|                                                          |
|  👥 Access*                                              |
|  [Site Admin x] [Regional Manager x] [PPT Reader x]     |
|  [Admin x] [BI Editor x] [BI Organizer x]         [v]   |
|  ─────────────────────────────────────                   |
|  ACTIVATION                                              |
|  ┌─────────────────────────────────────────────────────┐ |
|  │ + On-Demand                        [====ON]         │ |
|  │ ↻ Automated Schedule               [====ON]         │ |
|  │   Schedule Type                                     │ |
|  │   ⦿ Time-based                                     │ |
|  │   ○ Period-based                                    │ |
|  └─────────────────────────────────────────────────────┘ |
|                                                          |
|  [Back] [Cancel]                      [Create Template]  |
+----------------------------------------------------------+
```

#### ACCESS — Applies To (Location Scoping)

**Applies To** controls **which locations** this template is available at. This is an indirect user access control: users see templates based on their **location access**, so scoping a template to California locations means only users with access to California locations will see it.

The filter has two levels:

| Level | Description | Example |
|-------|-------------|---------|
| **Subject filter** (top row) | What entity to filter and how | `Where [Places] is [Saved Group]` |
| **Condition rows** | Specific filter conditions (AND logic — "Match all") | `[Place Type] is [Restaurant] [Corporate]` |

- **Default:** All locations (no filtering applied)
- **Saved Group** mode enables the rule builder for fine-grained location targeting
- **"+ Add Condition"**: Adds another AND condition within the same filter rule
- **"+ Add Filter Rule"**: Adds a new top-level filter block
- The `is` connector (`[data-cy="is-connector"]`) joins the target and value selectors

> **Best practice:** Leave as all locations unless the user specifies the template is for a specific subset of locations. Ask during the planning/research phase.

| Element | Selector |
|---------|----------|
| Access header | `[data-cy="access-header"]` |
| Applies To section | `[data-cy="applies-to-section"]` |
| Applies To content | `[data-cy="applies-to-content"]` |
| Subject filter container | `[data-cy="subject-filter-container"]` |
| "Where" label | `[data-cy="where-label"]` |
| Filter controls | `[data-cy="filter-controls"]` |
| Target select (e.g., "Places") | `[data-cy="target-select-container"]` |
| "is" connector | `[data-cy="is-connector"]` |
| Filter select (e.g., "Saved Group") | `[data-cy="filter-select-container"]` |

#### ACCESS — Person Type (Role-Based Access)

**Access** (required) controls **which user roles** can see activities from this template. These are **Person Types** — a mix of out-of-the-box defaults and customer-configured custom roles.

- **Default:** All person types selected
- **Typical real-world usage:** 3–5 roles (e.g., Manager, Regional Director, VP)
- **Site Admins** have implicit access to everything regardless of selection
- **"Applies to all workflow states"** means this is a **global record-level** access rule — the selected Person Types control visibility across draft, in-progress, completed, etc. (Future: granular access by state/section is planned)

| Element | Selector |
|---------|----------|
| Access permissions section | `[data-cy="access-permissions-section"]` |
| Access permissions content | `[data-cy="access-permissions-content"]` |
| Person Type multi-select | `[data-cy="access-person-type-selector"]` |

> **Best practice:** Default to all Person Types unless the user specifies the template is for specific roles. Ask during the planning/research phase.

#### ACTIVATION — On-Demand

Controls whether users can **manually create** activities from this template ad-hoc (e.g., a field worker decides to run an inspection right now).

| Element | Selector | Default |
|---------|----------|---------|
| On-Demand row | `[data-cy="on-demand-row"]` | — |
| On-Demand card | `[data-cy="on-demand-card"]` | — |
| On-Demand toggle | `[data-cy="on-demand-toggle"]` | **ON** |

- **Typically left ON** unless activities are exclusively auto-scheduled

#### ACTIVATION — Automated Schedule

Controls whether the system **automatically creates activities on a recurring schedule** to ensure work gets assigned and tracked.

| Element | Selector | Default |
|---------|----------|---------|
| Automated Schedule row | `[data-cy="automated-schedule-row"]` | — |
| Automated Schedule card | `[data-cy="automated-schedule-card"]` | — |
| Automated Schedule toggle | `[data-cy="automated-schedule-toggle"]` | **ON** |
| Schedule Type radios | `[data-cy="schedule-type-radios"]` | — |
| Time-based radio | `[data-cy="time-based-radio"]` | ⦿ Selected |
| Period-based radio | `[data-cy="period-based-radio"]` | ○ Unselected |

**Schedule Types:**

| Type | Radio Value | Description |
|------|-------------|-------------|
| **Time-based** | `specific-time` | Calendar-style scheduling — set specific days/times (like Google Calendar). Required if On-Demand is also enabled. |
| **Period-based** | `named-period` | Shift-based scheduling — schedule X activities per shift/day-part, driven by the organization's operational period setup. Only available when On-Demand is OFF. |

> **Important constraint:** If both **On-Demand** and **Automated Schedule** are enabled, you **must** use **Time-based** scheduling. Period-based is only available when On-Demand is OFF.

> **Note:** The actual schedule details are configured later on the **Schedule tab** in the form builder. This step only sets the scheduling *mode* upfront because it impacts how the workflow gets configured and which experience to load.

#### Step 2 Footer Buttons

| Button | Selector | Action |
|--------|----------|--------|
| **Back** | `[data-cy="back-button"]` | Returns to Step 1 (Setup) |
| **Cancel** | `[data-cy="cancel-button-tab2"]` | Abandons template creation |
| **Create Template** | `[data-cy="create-button"]` | Creates the template in **Draft** status and navigates directly to the Form builder |

> **Note:** All toggles on this step use **HeadlessUI Switch** components (`button[role="switch"]` with `aria-checked`). The knob element is `[data-cy="on-off-switch-toggle"]` inside each toggle row.

#### Planning Questions to Ask Users

When helping a user create a new template, ask these during the research/planning phase:

1. **Location scope:** Is this template for all locations, or a specific subset? (e.g., only restaurants, only California locations)
2. **User access:** Should all user roles see this, or only specific Person Types? (e.g., managers only, field workers only)
3. **Activation model:** Will end-users create these on-demand when needed, will they be auto-scheduled on a recurring basis, or both?
4. **If both on-demand + scheduled:** Must use Time-based scheduling
5. **If scheduled only:** Time-based (calendar-style) or Period-based (per-shift)?

---

## Finding & Opening Existing Templates

To work with an existing template:

1. **Navigate to Activity Templates**: `https://{clientname}.cmx1.com/a/activitystudio`
2. **Find the template**: Scroll the list or search by name
3. **Click View/Edit**: Opens the template in the Activity Studio form builder
4. **Navigate to the Form tab**: Click the **Form** tab in the top navigation to enter the form builder
5. **Start building**: Use the left sidebar sections and the canvas to add/configure questions

> **TODO:** Document search/filter functionality, cloning templates, and template versioning.

---

## Important Notes for Automation

### 🚫 Hard Rules — Non-Negotiable

1. **🚫 NEVER launch a new/isolated browser** — No `chromium.launch()`, no Playwright Chromium, no "Chrome for Testing" windows. These create empty browsers with no cookies, no session, no login. **Completely useless for CMX1.**
2. **🚫 NEVER call `browser.close()` on the user's browser** — In CDP mode, `browser.close()` disconnects Playwright without closing Chrome (correct). But never attempt to close, kill, or terminate the user's browser process.
3. **🚫 NEVER repeatedly kill/relaunch Chrome** — If CDP isn't working, switch to Claude in Chrome tools. Don't loop killing and relaunching Chrome trying to get CDP to bind.

### 🔐 Authentication & Login

CMX1 login redirects to a branded login page ("Sign in to X1 Platform"). There are **three approaches** — ask the user which they prefer:

**Option A: User logs in manually (default)**
- Navigate to the CMX1 URL — the browser will redirect to the login page
- Tell the user: "Please log in. I'll continue once I detect you're in Activity Studio."
- Poll/wait for the Activity Studio page to load (look for `[data-cy^="section-item"]` or the Activity Studio URL pattern)

**Option B: Google SSO (recommended for automation)**
- Click the **"Continue with Google"** button on the login page
- The browser redirects to Google's OAuth flow
- If the user is already signed into Google in their browser, it may auto-select the account or show an account picker
- If multiple Google accounts are signed in, the user may need to select the correct one
- After Google auth completes, the browser redirects back to CMX1 authenticated
- **Login page selectors:**
  - Username/email input: `input[placeholder="Enter username, or email..."]`
  - Continue button: Button with text "Continue"
  - Google SSO button: Button with text "Continue with Google" (has Google "G" logo)
- **Best for automation:** No credentials needed — leverages the user's existing Google session

**Option C: User provides credentials for automation**
- Ask the user for their **CMX1 email** and **password**
- Fill the email input, click Continue, then fill the password field and submit
- Handle any MFA/2FA prompts by asking the user for the code
- **Security notes:**
  - Never store credentials in script files, logs, or build specs
  - Credentials should only be used in-session and never persisted
  - If the login page changes (e.g., CAPTCHA), fall back to Option A

**Login Flow (for Option C):**
```
1. Navigate to CMX1 URL → redirects to login page
2. Find email/username input → fill with user-provided email
3. Click "Continue" button
4. Find password input → fill with user-provided password
5. Click "Sign In" / submit button
6. If MFA prompt appears → ask user for code → fill and submit
7. Wait for Activity Studio to load
```

> **Ask during setup:** "Would you like to log in manually, use Google SSO (recommended), or should I handle the login with your email/password?"

### ✅ How to Automate

5. **Claude in Chrome for exploration & login** — `mcp__Claude_in_Chrome` tools connect directly to the user's real browser. No setup needed. Use for navigating, exploring UI, helping with login, and one-off checks.
6. **CDP scripts for actual building** — Once CDP is set up, use CDP scripts for all form building work. Direct DOM selectors are 10x faster, save massive tokens (no screenshots), and produce reusable `.mjs` scripts.
7. **Ask about browser first** — Before any CDP script work, ask the user which browser (Chrome/Edge/Brave) and which profile they use.
8. **Ideal workflow:** Claude in Chrome to explore → set up CDP → CDP scripts for the heavy lifting.

### 🔧 UI Interaction Notes

8. **Inline editing preferred**: Most values are set directly in the main canvas, not the side panel. All answer settings should be set in the answer table in the main canvas.
9. **Side panel only for**: Visibility conditions (Logic tab)
10. **Custom dropdowns**: Compliance and Risk Level use custom components, not native `<select>`. Use click + text selection or type, THEN HIT ENTER
11. **Risk levels are org-configured**: The available risk levels vary by organization. Use the combobox to search/type
12. **data-cy attributes**: Always prefer `[data-cy="..."]` selectors — they are stable test IDs
13. **UUIDs are dynamic**: Answer row UUIDs change per question instance. Use relative selectors within grid rows
14. **Auto-save**: Changes are auto-saved (status bar shows "Changes saved on..." with timestamp)
