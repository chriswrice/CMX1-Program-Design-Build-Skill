# CMX1 Activity Studio — Yes/No Question Type

> **Parent:** [`cmx1/form-building/shared-concepts.md`](../shared-concepts.md)
> **See also:** [`cmx1/activity-studio.md`](../../activity-studio.md) for navigation and structure

The Yes/No question is the most common question type. It presents two answer buttons (Yes/No) and supports scoring, compliance tracking, risk assessment, and corrective actions.

For universal concepts (answer table, evaluation settings, observations, recommendations, logic rules, footer controls), see **[shared-concepts.md](../shared-concepts.md)**.

---

## Question Block Layout (Main Canvas)

When a Yes/No question exists in a section, it appears as a card on the canvas:

```
+--------------------------------------------------+
| [1/2]  [Tags]  [AI Assist]                       |
|                                                   |
| Question text goes here                           |
| Instructions / "Assess perimeter carefully"       |
| [+ Add Policies]                                  |
|                                                   |
| +--------+    +---------+            [v expand]   |
| |  Yes   |    |   No    |                         |
| +--------+    +---------+                         |
|                                                   |
| === ANSWER TABLE (when expanded) ===============  |
| LABEL | POINTS | COMPLIANCE | RISK | CORR.ACTIONS |
| Yes   | 2 / 2  | In         | Managed | OFF  N/A  |
| No    | 0 / 2  | Out        | Failure | ON 7 BusDy|
| ================================================  |
|                                                   |
| -- Observations --                                |
| "What are you seeing?"                            |
| Reasons: [item1] [item2] [item3] [add more...]    |
| [AI Assist] [Delete AI]                           |
|                                                   |
| -- Recommended Actions --                         |
| "Make a recommendation. Correct if possible."     |
| Actions: [item1] [item2] [add more...]            |
| [AI Assist] [Delete AI]                           |
|                                                   |
| Next Suggested Step: [Observation Notes v] 1 of 3 |
|   [Create with AI] [Create Manually]              |
|                                                   |
| [Options]          [Camera] [Comments] [Attach]   |
+--------------------------------------------------+
```

---

## Yes/No-Specific DOM Selectors

| Element | Selector |
|---------|----------|
| Question text input | `input[placeholder="Question text..."]` or `[data-cy="question-block-question-text-{uuid}"]` |
| Instructions area | `[data-cy="question-block-instructions-{uuid}"]` |
| Tags button | `[data-cy="question-block-tags-{uuid}"]` |
| Yes button | `[data-cy="question-block-answer-yes-{uuid}"]` |
| No button | `[data-cy="question-block-answer-no-{uuid}"]` |
| Options button | `[data-cy="question-block-options-{uuid}"]` |
| Expand/collapse answer chevron | Small `v` arrow button next to Yes/No row |

---

## Question Settings (Right Panel — "Question" header)

Clicking a Yes/No question block opens the **Question** panel on the right side.

**Tabs:** `Settings` | `Logic`

### Settings Tab

#### QUESTION TYPE
- **Dropdown selector**: Shows "Yes/No" when this type is selected
- Selector: `[data-cy="question-type-selector"]`

#### QUESTION
- **Question text area**: Multi-line text input for the question
- **ID #**: Auto-generated unique identifier
- **Required checkbox**: When checked, the question must be answered
  - **N/A sub-option**: Allow "Not Applicable" as a valid response
  - **N/O sub-option**: Allow "Not Observed" as a valid response

#### ANSWER (in right panel)
- **Controls**: Two answer items with gear icons
  - **Yes** (with gear icon) — click gear to open Answer Item detail
  - **No** (with gear icon) — click gear to open Answer Item detail
  - Selector: `[data-cy="answer-config-yesno"]`
  - Detail content: `[data-cy="answer-config-detail-content-yesno"]`

- **EXPAND ANSWER TABLE** / **COLLAPSE ANSWER TABLE** button: Opens/closes the inline answer grid in the main canvas

### Logic Tab
- **VISIBILITY**: `[data-cy="visibility-conditions"]`
  - **"Add Condition"** button to create visibility rules
  - Conditions reference other questions' answers to show/hide dynamically

---

## Automation Workflows

### Workflow: Create a Fully Configured Yes/No Question

```python
# 1. Navigate to the Activity Studio
page.goto("https://{clientname}.cmx1.com/a/activitystudio/{id}/details")

# 2. Click Form tab if not already active
page.click('[data-cy="designer-topbar-workflow-button"] >> text=Form')

# 3. Click a section in the left sidebar
page.click('[data-cy="section-item-{uuid}"]')

# 4. Click blue "+" to add question
page.click('[data-cy="add-question-zone-0"]')

# 5. Select Yes/No from question type grid
page.click('text=Yes/No')  # or specific data-cy for the grid item

# 6. Enter question text (inline in main canvas)
page.fill('input[placeholder="Question text..."]', 'Is perimeter free of debris?')

# 7. Enter instructions
page.fill('[placeholder="Click to add instructions (optional).."]', 'Assess carefully')

# 8. Click Yes/No answer area to expand answer table
page.click('text=Yes')  # Click the Yes button on the question card

# 9. Click EXPAND ANSWER TABLE in right panel
page.click('text=EXPAND ANSWER TABLE')

# 10. Configure Yes row
page.fill('[data-cy="answer-type-grid-points-{yes-uuid}"]', '2')
page.fill('[data-cy="answer-type-grid-points-available-{yes-uuid}"]', '2')
# Click compliance dropdown for Yes row and select "In"
# Click risk level combobox and type/select "Managed"

# 11. Configure No row
page.fill('[data-cy="answer-type-grid-points-{no-uuid}"]', '0')
# Click compliance dropdown for No row and select "Out"
# Click risk level combobox and type/select "Failure"
# Toggle corrective actions ON
page.click('[data-cy="answer-type-grid-cap-toggle-{no-uuid}"]')
# Set days and type in Answer Item panel
```

### Workflow: Create Form Structure with Sections

```python
# 1. Navigate to Activity Studio
page.goto("https://{clientname}.cmx1.com/a/activitystudio/{id}/details")

# 2. Add a new section
page.click('[data-cy="add-section-button"]')

# 3. Name the section (right panel)
page.fill('input[placeholder="Untitled Section"]', 'Section Name')

# 4. Add subsection (right-click → Add Subsection)
page.click('[data-cy="section-item-{uuid}"]', button='right')
page.click('text=Add Subsection')

# 5. Name subsection
page.fill('input[placeholder="Untitled Section"]', 'Subsection Name')
```

### Workflow: Configure Answer Table for Compliance

```
For a standard compliance Yes/No question:

YES answer:
  - Points: [full score] / [total]
  - Compliance: In
  - Risk Level: Managed
  - Corrective Actions: OFF

NO answer:
  - Points: 0 / [total]
  - Compliance: Out
  - Risk Level: Failure (or appropriate risk from org list)
  - Corrective Actions: ON
    - Days: 7 (or as required)
    - Type: Business Day(s) or Calendar Day(s)
```

---

## Example: Full Yes/No Configuration (Compliance Question)

**Question:** "Is perimeter free of debris?"

| Setting | Yes Answer | No Answer |
|---------|-----------|----------|
| Label | Yes | No |
| Points | 2 / 2 | 0 / 2 |
| Compliance | In | Out |
| Risk Level | Managed | Failure |
| Corrective Actions | OFF | ON — 7 Business Days |

**Logic rules applied:**
| Component | Visibility | Requirement |
|-----------|-----------|------------|
| Observations | Always Visible | Required when Not Compliant |
| Recommendations | Visible when Not Compliant | Required when Not Compliant |
| Photos & Attachments | Always Visible | Required when Not Compliant |
| Comments | Default visible | N/A |

**Observations (reasons):** debris present, hazards present, not locked, not guarded
**Recommendations (actions):** ensure debris is cleaned, ensure no hazards present, site walk every morning and afternoon, re-train employees
