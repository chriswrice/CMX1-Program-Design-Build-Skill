# CMX1 Activity Studio — Shared Concepts (Universal Across Question Types)

> **Parent:** [`cmx1/activity-studio.md`](../activity-studio.md)

This file documents concepts and components that apply **universally across all question types**: the answer table grid, evaluation settings, compliance/risk/points, corrective actions, observations, recommendations, footer controls, visibility & requirement rules, and the next suggested step system.

---

## Key Principle: Inline Editing

**Most editing happens inline in the main canvas panel.** You do NOT need the side panel for most operations. The side panel is primarily needed for:
- Setting **visibility conditions** (Logic tab)
- Per-answer-item detail editing (clicking gear icon on answer controls)

---

## Evaluation Settings (Right Panel → ANSWER section)

These toggle switches appear in the right panel when a question is selected. They control what scoring/tracking columns appear in the answer table.

| Setting | Default | Selector |
|---------|---------|----------|
| Points | ON | `[data-cy="answer-settings-points-switch"]` |
| Compliance | ON | `[data-cy="answer-settings-compliance-switch"]` |
| Risk | ON | `[data-cy="answer-settings-risk-switch"]` |
| Corrective Actions | ON | `[data-cy="answer-settings-corrective-actions-switch"]` |
| Immediate Action | OFF | Nested under Corrective Actions (see below) |

> **Immediate Action** is a special evaluation mode for **critical situations that must be corrected on the spot** — e.g., an employee working sick (recommendation: immediately send home), a safety hazard that can't wait for a standard corrective action workflow. When enabled, the end-user filling out the form sees an Immediate Corrective Action prompt that can be set as Optional or Required. This is separate from the standard Corrective Actions (which have a timeline like 7 Business Days).

---

## OPTIONS Toggles (Right Panel → OPTIONS section)

Toggle switches for additional question features:

| Option | Default | Description |
|--------|---------|-------------|
| Instructions | ON | Show instructions text area below question |
| Policy | OFF | Attach policy reference to the question |
| Observations | OFF | Enable observation notes field with reasons list |
| Recommendations | OFF | Enable recommendations field with actions list |
| General Comments | ON | Allow free-text comments on the question |
| Photos & Attachments | ON | Allow photo/file attachments |
| Banners | OFF | Show visual banner/alert on the question |
| Question Duplication | OFF | Allow duplicating this question during form fill |

**Note:** Observations, Recommendations, Photos & Attachments, and Comments each have a **logic icon** (tree/branch icon with optional orange dot) to configure visibility & requirement rules. Click the logic icon to access those settings in the side panel's Logic tab. See **Visibility & Requirement Rules** section below.

---

## Answer Table (Inline Grid) — CRITICAL

The Answer Table is the **most important configuration area** for any scored question. It appears **inline in the main canvas** when you click the answer controls on a question, or when you click "EXPAND ANSWER TABLE" in the right panel.

### Answer Table Layout

```
+--------+--------+-----+------------+------------+-------------------+
| (drag) | LABEL  | >>  | POINTS     | COMPLIANCE | RISK LEVEL | CORRECTIVE ACTIONS |
+--------+--------+-----+------------+------------+------------+--------------------+
| ::     | [Yes]  |     | [2] / [2]  | [In    v]  | [Managed v]| [OFF] N/A          |
| ::     | [No ]  |     | [0] / [2]  | [Out   v]  | [Failure v]| [ON]  7 Business Days |
+--------+--------+-----+------------+------------+------------+--------------------+
                                      [Show extra columns]
```

### Answer Table DOM Selectors

| Element | Selector Pattern |
|---------|-----------------|
| **Table container** | `[data-cy="answer-type-grid-container-1"]` |
| **Table element** | `[data-cy="answer-type-grid-table-1"]` |
| **Header row** | `[data-cy="answer-type-grid-header-1"]` |
| **Label column header** | `[data-cy="answer-type-grid-header-label-1"]` |
| **Points column header** | `[data-cy="answer-type-grid-header-points-1"]` |
| **Compliance column header** | `[data-cy="answer-type-grid-header-compliance-1"]` |
| **Risk Level column header** | `[data-cy="answer-type-grid-header-risk-1"]` |
| **Corrective Actions header** | `[data-cy="answer-type-grid-header-cap-1"]` |
| **Toggle extra columns** | `[data-cy="answer-type-grid-toggle-columns-1"]` |
| **Points calculation toggle** | `[data-cy="answer-type-grid-points-calculation-toggle-1"]` |
| **Row drag handle** | `[data-cy="answer-type-grid-drag-handle-{uuid}"]` |
| **Label cell** | `[data-cy="answer-type-grid-label-cell-{uuid}"]` |
| **Points input** | `[data-cy="answer-type-grid-points-{uuid}"]` — `<input>` |
| **Points available (denominator)** | `[data-cy="answer-type-grid-points-available-{uuid}"]` — `<input>` |
| **Risk Level combobox** | `[data-cy="risk-level-combo-container"]` → `[data-cy="risk-level-combo-input-container"]` |
| **Corrective Actions toggle** | `[data-cy="answer-type-grid-cap-toggle-{uuid}"]` contains `[data-cy="on-off-switch-toggle"]` |
| **CA empty state** | `[data-cy="answer-type-grid-cap-empty-{uuid}"]` |

### Answer Table Columns

#### LABEL
- Editable text input for the answer label
- Selector: `input[type="text"]` inside `[data-cy="answer-type-grid-label-cell-{uuid}"]`

#### POINTS
- Two inputs: **score** / **total available**
- Format: `[earned] / [total]`
- The numerator is the points this answer earns; denominator is max possible
- Example: Yes = `2 / 2` (full points), No = `0 / 2` (zero points)

#### COMPLIANCE
- **Dropdown** with three options:
  - **In** — The answer is compliant
  - **Out** — The answer is non-compliant
  - **Not Assessed** — Compliance not evaluated
- Click the cell to open the dropdown (custom `<button>` component, not native `<select>`)

#### RISK LEVEL
- **Combobox** (searchable dropdown) → `[data-cy="risk-level-combo-container"]`
- Risk levels are **custom/configurable at the organization level**
- Common standard risk levels: `Managed`, `Failure`, `Major`, `Minor`, `Warning`, `High`, `Non-Critical`, `Critical failure`, `Deviation`
- If no risk is assigned, shows "Add Risk..." placeholder
- **Best Practice Mapping:**

| Compliance | Risk Level | Meaning |
|------------|-----------|---------|
| **In** | **Managed** | Compliant, risk is under control |
| **Out** | **Failure** | Non-compliant, represents a failure |
| **Not Assessed** | (none / Add Risk...) | Not evaluated |

#### CORRECTIVE ACTIONS
- **Toggle switch** (on/off) → `[data-cy="on-off-switch-toggle"]` inside `[data-cy="answer-type-grid-cap-toggle-{uuid}"]`
- When **OFF**: Shows "N/A" or "Off" text
- When **ON**: Shows days and type (e.g., "7 Business Days")
- When enabled, clicking the answer row gear icon in the right panel reveals:
  - **Days**: Numeric input (e.g., `7`)
  - **Type**: Dropdown with two options:
    - **Business Day(s)**
    - **Calendar Day(s)**

### Answer Item Detail (Right Panel — "Answer Item" header)

Clicking a specific answer's **gear icon** in the Controls section, or clicking a row in the answer table, opens the **Answer Item** panel:

| Field | Description |
|-------|-------------|
| **Label** | Answer display text |
| **Points** | Score earned |
| **Total Points** | Max possible score |
| **Compliance** | Dropdown: In / Out / Not Assessed |
| **Risk Level** | Searchable dropdown (org-configured) |
| **Corrective Actions** | Checkbox + Days + Type |

### "Show Extra Columns" Button

Located below the answer table → `[data-cy="answer-type-grid-toggle-columns-1"]`
Reveals additional configuration columns in the grid (content varies by configuration).

---

## Observations & Recommended Actions

These are optional content blocks that appear **inline on the question card** in the main canvas when their respective OPTIONS toggles are enabled.

### Observations Block

Appears when **Observations** toggle is ON in OPTIONS.

```
-- Observations --
Title: "Observations" (editable)
Subtitle: "What are you seeing?" (editable)

Reasons:
  [debris present        ] [x]
  [hazards present       ] [x]
  [not locked            ] [x]
  [not guarded           ] [x]
  [Start typing to add more...]

[AI Assist] [Delete AI]
```

| Element | Selector |
|---------|----------|
| Title | Editable textbox (e.g., "Observations") |
| Subtitle | Editable textbox (e.g., "What are you seeing?") |
| Reason items | `input[placeholder="Enter your text here..."]` |
| Add more | `input[placeholder="Start typing to add more..."]` |
| AI Assist button | `[data-cy="ai-assist-button"]` |
| Delete AI button | `[data-cy="delete-ai-button"]` |

- Each reason has a copy/duplicate icon button on the right
- Reasons are configured at design time and presented as selectable options to end-users
- The **logic icon** (tree/branch icon, next to collapse arrow) opens the side panel Logic tab to configure visibility & requirement rules
- An **orange dot** on the logic icon indicates rules are configured

### Recommended Actions Block

Appears when **Recommendations** toggle is ON in OPTIONS.

```
-- Recommended Actions --
Title: "Recommended Actions" (editable)
Subtitle: "Make a recommendation. Correct if possible." (editable)

Recommended Actions:
  [ensure debris is cleaned              ] [x]
  [ensure no hazards present             ] [x]
  [site walk every morning and afternoon ] [x]
  [re-train employees                    ] [x]
  [Start typing to add more...]

[AI Assist] [Delete AI]
```

Same structure as Observations. The **logic icon** configures visibility/required settings.

---

## Question Footer Controls

At the bottom-right of every question card, three icons control additional question components:

| Icon | Selector | Component Panel | Has Rules? |
|------|----------|----------------|------------|
| 📷 Camera | `[data-cy="question-footer-photo-control"]` | **Photos & Attachments** (linked together) | Visibility + Requirement |
| 💬 Speech bubble | `[data-cy="question-footer-comment-control"]` | **Comments** (separate) | Visibility only |
| 📎 Paperclip | `[data-cy="question-footer-attachment-control"]` | **Photos & Attachments** (linked with camera) | Visibility + Requirement |

Additional footer selectors:
- Footer container: `[data-cy="question-footer"]`
- Footer controls wrapper: `[data-cy="question-footer-controls"]`

> **Note:** Camera and Paperclip are **linked together** — clicking either opens the same "Photos & Attachments" panel. Comments is its own separate component.

---

## Visibility & Requirement Rules (Logic System) — CRITICAL

The CMX1 Activity Studio has a **universal logic rules system** that controls when components are visible to end-users and when they are required. This system is accessed via the **Logic tab** in the side panel, or by clicking the **logic icon** (tree/branch icon `[data-cy="logic-visual-indicator"]`) on inline components.

An **orange dot** (`[data-cy="logic-indicator-dot"]`) on the logic icon indicates that rules have been configured for that component.

### Rule Levels

Logic rules can be applied at different levels of the question hierarchy:

| Level | Supports Visibility | Supports Requirement | How to Access |
|-------|--------------------|--------------------|--------------|
| **Section** | ✅ | ❌ | Section → Logic tab in side panel |
| **Question** | ✅ | ❌ (use Required checkbox instead) | Question → Logic tab in side panel |
| **Observations** (reasons) | ✅ | ✅ | Logic icon on Observations block header |
| **Recommended Actions** | ✅ | ✅ | Logic icon on Recommendations block header |
| **Photos & Attachments** | ✅ | ✅ | Logic icon on camera/paperclip footer icons |
| **Comments** | ✅ | ❌ | Logic icon on speech bubble footer icon |

### Visibility Rules

**"This component is visible WHEN:"**

Each visibility rule has a **source dropdown** and optionally a **condition dropdown**.

#### Visibility Source Options

**At the component level** (Observations, Recommendations, Photos & Attachments):

| Source | Icon | Description |
|--------|------|-------------|
| **Always Visible** | 👁️ Eye | Component always shows to end-users (default for most) |
| **Question Results** | ☑️ Checkbox | Show based on this question's answer/compliance |

**At the question/section/comments level** (more options):

| Source | Icon | Description |
|--------|------|-------------|
| **Person Types** | 👤 Person | Show based on who is filling out the form |
| **Time-Based** | 🕐 Clock | Show based on time/schedule conditions |
| **Question Results** | ☑️ Checkbox | Show based on another question's answer |
| **Place-Based** | 📍 Pin | Show based on location context |

### Requirement Rules

**"This component is required WHEN:"**

Only available on Observations, Recommended Actions, and Photos & Attachments.

#### Requirement Source Options

| Source | Icon | Description |
|--------|------|-------------|
| **No** | ❌ Circle-X | Not required / no requirement rule |
| **Question Results** | ☑️ Checkbox | Required based on this question's answer/compliance |

### "Question Results" Condition Values

When **Question Results** is selected as the source (for either visibility or requirement), the **condition dropdown** offers:

| Condition | Description |
|-----------|-------------|
| **(select)** | Placeholder — no condition set |
| **Specific Answer(s)** | Triggers on specific answer selections (e.g., Yes or No) |
| **Answered** | Triggers when any answer is given |
| **Is Compliant** | Triggers when answer has Compliance = In |
| **Is Not Compliant** | Triggers when answer has Compliance = Out |
| **Risk Level** | Triggers based on the risk level of the selected answer |

### Rule Structure

```
Rule 1
  [Source dropdown v]     ← e.g., "Question Results"
  [Condition dropdown v]  ← e.g., "Is Not Compliant"

[+ Add Condition]         ← Add another rule (OR logic between rules)
```

- Each rule has a **trash icon** 🗑️ to delete it
- Multiple rules are combined with **OR** logic — any matching rule activates
- Rules use **HeadlessUI listbox** components (not native `<select>`)

### DOM Selectors for Logic System

| Element | Selector |
|---------|----------|
| Logic icon (on inline components) | `[data-cy="logic-visual-indicator"]` |
| Orange dot (rules configured) | `[data-cy="logic-indicator-dot"]` |
| Tree/branch icon | `[data-cy="logic-indicator-tree-icon"]` |
| Source/condition dropdowns | `button[id^="headlessui-listbox-button-"]` (dynamic IDs) |
| Add Condition button | `button:has-text("Add Condition")` |
| Delete rule (trash) icon | Trash icon button inside rule card |
| Settings tab | Tab labeled "Settings" in side panel |
| Logic tab | Tab labeled "Logic" in side panel |

### Best Practice: Example Configuration (Compliance Question)

Here's how a compliance-style Yes/No question (e.g., "Is perimeter free of debris?") should be configured — a recommended pattern:

| Component | Visibility Rule | Requirement Rule | Design Rationale |
|-----------|----------------|-----------------|------------------|
| **Question** | Default (always visible) | N/A (Required checkbox) | Question always shown |
| **Observations** | **Always Visible** | Question Results → **Is Not Compliant** | End-user always sees common issues (helps with answering), but only *must* fill them out when non-compliant |
| **Recommendations** | Question Results → **Is Not Compliant** | Question Results → **Is Not Compliant** | Only shows fix suggestions when there's actually an issue — no point showing them when compliant |
| **Photos & Attachments** | **Always Visible** | Question Results → **Is Not Compliant** | End-user can always attach photos, but *must* capture evidence when non-compliant |
| **Comments** | Default (always visible) | N/A | Leave on by default — only disable if user specifically requests removal |

---

## Next Suggested Step & Corrective Action Flow

Below the answer area, each question shows a **Next Suggested Step** bar that guides form builders through remaining configuration steps:

```
Next Suggested Step: [Observation Notes v] 1 of 3
  [Create with AI]  [Create Manually]
```

- The step type is a **dropdown selector** that cycles through unconfigured components
- "Create with AI" generates content using AI
- "Create Manually" opens manual entry
- The `X of Y` counter shows how many suggested steps remain

### Immediate Corrective Action (Next Suggested Step)

When **Immediate Action** is enabled in the evaluation settings (under Corrective Actions), a Next Suggested Step appears for configuring Immediate Corrective Actions:

```
Next Suggested Step: [Immediate Corrective Action v]
  [Optional]  [Required]
```

This is for **critical on-the-spot situations** where the end-user discovers something that must be fixed immediately — e.g., an employee working sick (immediate recommendation: send home), an exposed electrical wire (immediate action: power off and barricade). Unlike standard Corrective Actions (which set a timeline like 7 Business Days), Immediate Corrective Actions prompt the end-user to take action **right now** during the inspection.

| Option | Meaning |
|--------|---------|
| **Optional** | End-user sees the Immediate CA prompt but can skip it |
| **Required** | End-user must complete the Immediate CA before moving on |
