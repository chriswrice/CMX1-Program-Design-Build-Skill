# CMX1 Activity Studio — Temperature / Timer Question Types

> **Parent:** [`cmx1/form-building/shared-concepts.md`](../shared-concepts.md)
> **See also:** [`cmx1/activity-studio.md`](../../activity-studio.md) for navigation and structure

The Temperature question type captures temperature readings from end-users. It supports unit selection (Fahrenheit/Celsius), configurable numeric thresholds, and condition-based evaluation for compliance/risk scoring. Timer is a related specialized type for elapsed time measurements.

For universal concepts (evaluation settings, observations, recommendations, logic rules, footer controls), see **[shared-concepts.md](../shared-concepts.md)**.

> **IMPORTANT:** The Temperature question type uses a **condition-based answer grid** (`numeric-type-grid-*` selectors) that is fundamentally different from the label-based answer grid (`answer-type-grid-*` selectors) used by Yes/No, Button Group, Dropdown, and Checkbox questions. Instead of predefined answer labels (Yes/No), Temperature defines **threshold conditions** (e.g., "Less Than or Equal To 41 F") that evaluate the numeric input.

---

## Question Block Layout (Main Canvas)

When a Temperature question exists in a section, it appears as a card on the canvas:

```
+---------------------------------------------------------------+
| [1/1]  [Tags]                                           [...]  |
|                                                                 |
| Receiving temperature -- Chicken                                |
| Click to add instructions (optional)..                          |
|                                                                 |
| [thermometer icon] [Enter Temperature___________] [*F] [v][^]  |
|                                                                 |
| [Number] [None] [AI Assist]    <-- toggle-answer-config bar     |
|                                                                 |
| === CONDITION TABLE (when expanded) ========================    |
| CONDITION              | POINTS | COMPLIANCE | RISK    | CA    |
| <= 41 *F  (green row)  | 2 / 2  | In         | Managed | N/A   |
| > 41 *F   (red row)    | 0 / 2  | Out        | Crit... | ON    |
| ============================================================    |
|                                              [+ Add]            |
|                                                                 |
| Next Suggested Step: [Observation Notes v] 1 of 3              |
|   [Create with AI] [Create Manually]                            |
|                                                                 |
| [Options]                     [Camera] [Comments] [Attach]      |
+---------------------------------------------------------------+
```

### Temperature Input Field

The temperature input consists of:
- **Thermometer icon** (gear/thermometer) on the left
- **Text input** with placeholder "Enter Temperature"
- **Unit indicator** showing `*F` (Fahrenheit) or `*C` (Celsius)
- **Up/Down arrows** (chevrons) for increment/decrement

### Toggle Answer Config Bar

Below the temperature input, a bar shows:
- **"Number"** label
- **"None"** (or unit name) label
- **"AI Assist"** button
- Clicking this bar or the `toggle-answer-config` button expands/collapses the condition table

> **CRITICAL:** The condition table lives **inside the question body on the center canvas** (`answer-wrapper` > `answer-config-detail-content-temperature`), NOT in the right panel. The `toggle-answer-config` button controls its visibility.

---

## Condition-Based Answer Table (Numeric Type Grid)

Unlike Yes/No or Button Group questions that use predefined answer labels, Temperature uses a **condition-based evaluation grid**. Each row defines a threshold condition that is evaluated against the end-user's numeric input.

### Grid Layout

```
+-------------------------------------------+--------+------------+------------+--------------------+
| CONDITION                                  | POINTS | COMPLIANCE | RISK LEVEL | CORRECTIVE ACTIONS |
+-------------------------------------------+--------+------------+------------+--------------------+
| 1 out of 1 answers are <= 41 *F  (green)  | 2 / 2  | In    v    | Managed  v | [OFF] N/A          |
| 1 out of 1 answers are > 41 *F   (red)    | 0 / 2  | Out   v    | Crit.Fail v| [ON]  Set Details  |
+-------------------------------------------+--------+------------+------------+--------------------+
                                                                                 [+ Add]
```

### Grid Row Colors
- **Green row**: Passing/compliant condition (Compliance = In)
- **Red row**: Failing/non-compliant condition (Compliance = Out)
- **Gray/neutral row**: Not Assessed condition

### Condition Structure

Each condition row has the format:
```
[count] out of [total] answers are [OPERATOR] [VALUE] [UNIT]
```

Where:
- **count / total**: How many answer controls must match (default: "1 out of 1" for single-input Temperature)
- **OPERATOR**: Comparison operator (see below)
- **VALUE**: Numeric threshold value
- **UNIT**: Temperature unit (`*F` or `*C`)

### Condition Operators

| Operator | Description |
|----------|-------------|
| Greater Than or Equal To | >= value |
| Greater Than | > value |
| Less Than or Equal To | <= value |
| Less Than | < value |
| Equal To | == value |
| Not Equal To | != value |
| Between | value1 <= x <= value2 (two value inputs) |
| Not Between | x < value1 OR x > value2 (two value inputs) |

### Adding a Condition Row

1. Click the **"+ Add"** button at the bottom-right of the grid
2. A new row appears with defaults:
   - Condition: "1 out of 1 answers are" (operator unset)
   - Points: 0 / 0
   - Compliance: Not Assessed
   - Risk Level: "Add Risk..." (empty)
   - Corrective Actions: OFF

### Configuring a Condition Row

**Option A: Via the Grid (Inline)**
- Click the **condition link** (blue hyperlink text) in the CONDITION column to navigate to the Compliance Settings sub-panel in the right panel
- Edit POINTS directly in the grid cells
- Click COMPLIANCE dropdown directly in the grid
- Click RISK LEVEL combobox directly in the grid (searchable/filterable)
- Toggle CORRECTIVE ACTIONS switch directly in the grid

**Option B: Via the Right Panel (Compliance Settings)**
- Click the condition link to open the Compliance Settings sub-panel
- Configure operator, value, points, compliance, risk, and CA from the right panel
- Click "Back to Question Block" to return

---

## Numeric Type Grid DOM Selectors

| Element | Selector |
|---------|----------|
| **Grid container** | `[data-cy="numeric-type-grid-container"]` |
| **Grid table** | `[data-cy="numeric-type-grid-table"]` |
| **Grid body** | `[data-cy="numeric-type-grid-body"]` |
| **Header row** | `[data-cy="numeric-type-grid-header-1"]` |
| **Points column header** | `[data-cy="numeric-type-grid-header-points"]` |
| **Compliance column header** | `[data-cy="numeric-type-grid-header-compliance"]` |
| **Risk Level column header** | `[data-cy="numeric-type-grid-header-risk"]` |
| **CA column header** | `[data-cy="numeric-type-grid-header-cap"]` |
| **Toggle extra columns** | `[data-cy="numeric-type-grid-toggle-columns-1"]` |
| **Points calculation toggle** | `[data-cy="numeric-type-grid-toggle-points-calculation-button"]` |
| **Row (by index)** | `[data-cy="numeric-type-grid-row-{N}"]` (0-indexed) |
| **Condition cell** | `[data-cy="numeric-type-grid-condition-{N}"]` |
| **Condition link (clickable)** | `[data-cy="numeric-type-grid-condition-button-{N}"]` |
| **Points cell** | `[data-cy="numeric-type-grid-points-{N}"]` |
| **Compliance cell** | `[data-cy="numeric-type-grid-compliance-{N}"]` |
| **Risk Level cell** | `[data-cy="numeric-type-grid-risk-{N}"]` |
| **CA toggle** | `[data-cy="numeric-type-grid-cap-toggle-{uuid}"]` |
| **Delete row** | `[data-cy="numeric-type-grid-delete-button-{N}"]` |
| **Add row button** | `[data-cy="numeric-type-grid-add-button-1"]` |

### Temperature-Specific Selectors

| Element | Selector |
|---------|----------|
| **Answer wrapper** (canvas) | `[data-cy="answer-wrapper"]` |
| **Answer config container** | `[data-cy="answer-config-temperature"]` |
| **Toggle expand/collapse** | `[data-cy="toggle-answer-config"]` |
| **Answer config detail** | `[data-cy="answer-config-detail"]` |
| **Detail content** | `[data-cy="answer-config-detail-content-temperature"]` |

### Compliance Settings Sub-Panel Selectors

| Element | Selector |
|---------|----------|
| **Operator dropdown** | Dropdown inside Compliance Settings (select element) |
| **Value input** | `[data-cy="expression-params-high-value-input"]` |
| **Risk Level combobox** | `[data-cy="risk-level-combo-container"]` > `[data-cy="risk-level-combo-input-container"]` |

---

## Question Settings (Right Panel -- "Question" header)

Clicking a Temperature question block opens the **Question** panel on the right side.

**Tabs:** `Settings` | `Logic`

### Settings Tab

#### QUESTION TYPE
- **Dropdown selector**: Shows "Temperature" with thermometer icon
- Selector: `[data-cy="question-type-selector"]`

#### QUESTION
- **Question text area**: Text input for the question (e.g., "Receiving temperature -- Chicken")
- **ID #**: Auto-generated unique identifier link
- **Required* checkbox**: When checked (blue), the question must be answered
  - **N/A**: Allow "Not Applicable" as a valid response
  - **N/O**: Allow "Not Observed" as a valid response

#### ANSWER Section (collapsible via chevron)
- **Evaluation Settings** (toggled by chevron):
  - Points: ON/OFF toggle -- `[data-cy="answer-settings-points-switch"]`
  - Compliance: ON/OFF toggle -- `[data-cy="answer-settings-compliance-switch"]`
  - Risk: ON/OFF toggle -- `[data-cy="answer-settings-risk-switch"]`
  - Corrective Actions: ON/OFF toggle -- `[data-cy="answer-settings-corrective-actions-switch"]`
    - Immediate Action: ON/OFF toggle (nested, only visible when CA is ON)

> **Note:** The ANSWER section chevron toggles visibility of the Evaluation Settings toggles. This is separate from the `toggle-answer-config` button that controls the condition grid in the canvas.

#### OPTIONS Section (collapsible via chevron)
- **Add'l Settings**:
  - Instructions: ON (default)
  - Policy: OFF
  - Observations: OFF (with pin/logic icon)
  - Recommendations: OFF (with pin/logic icon)
  - General Comments: ON (default)
  - Photos & Attachments: ON (default)
  - Banners: OFF
  - Question Duplication: OFF

### Logic Tab
- **Visibility**: "This component is visible by default, but you can set conditions to control when it's shown."
- **"+ Add Condition"** button to create visibility rules
- Conditions support: Person Types, Time-Based, Question Results, Place-Based sources

---

## Answer Sub-Panel (Right Panel -- "Answer" header)

Clicking the temperature input area in the canvas navigates the right panel into the **Answer** sub-panel, which shows Temperature-specific configuration:

| Field | Default | Description |
|-------|---------|-------------|
| **Controls** | 1 | Number of temperature input fields (- / + buttons) |
| **Allowed Inputs** | 1 MIN, 1 MAX | Min/max number of inputs |
| **Unit of Measurement** | None | Dropdown: None, Fahrenheit, Celsius |
| **Field Labels** | Off | Toggle to show labels on input fields |
| **Decimals** | 0 | Number of decimal places allowed |
| **Calculation Type** | None | Dropdown for calculation mode (None, Average, etc.) |
| **Evaluation Settings** | (same as Question panel) | Points, Compliance, Risk, CA toggles |
| **COLLAPSE ANSWER TABLE** | button | Collapses the condition grid in the canvas |

At the bottom: **"Back to Question Block"** link to return to the Question panel.

---

## Compliance Settings Sub-Panel (Right Panel)

Clicking a condition link (blue hyperlink text in the CONDITION column) navigates the right panel into the **Compliance Settings** sub-panel:

```
Compliance Settings
Define rules to evaluate if the answer(s) meets compliance.

[1 v] out of [1] Answers

[Operator Dropdown v]      <-- 8 operators available

[Value Input] [*F]         <-- threshold value with unit

THEN:

  [Scoring badge]
  Points [earned] / [pencil icon] / Total Points [available]

  [Compliance badge]
  [drag handle] [Dropdown: In / Out / Not Assessed]

  [Risk Level badge]
  [drag handle] [Dropdown: searchable risk categories]

  [Corrective Action badge]
  [No Corrective Action v]  or  [Corrective Action v]
    Days: [0]  Type: [Business Day(s) v]
```

At the bottom: **"Back to Question Block"** link to return.

---

## Scoring View

Clicking the **"Scoring"** toggle (next to "Build" in the sub-header) switches to the Scoring view:

| Setting | Options |
|---------|---------|
| **Score Type** | Percentage / Points / Fixed-Based |
| **Point Allocation** | Configurable |
| **Decimal Places** | 0, 1, 2, etc. |
| **When to Display** | Always / Conditionally |

The left panel shows **Points** and **Ratings** tabs for configuring scoring tiers.

---

## Key Interaction Patterns

### Expanding the Condition Table
The condition evaluation table is collapsed by default. To expand:
1. Click the `toggle-answer-config` bar/button in the question body on the canvas
2. Or click "EXPAND ANSWER TABLE" in the right panel Answer sub-panel

### Navigating the Right Panel Hierarchy
The right panel has a navigation hierarchy for Temperature questions:
```
Question (top level)
  -> Settings tab / Logic tab
  -> Answer (sub-panel, via clicking temperature input)
     -> Compliance Settings (sub-sub-panel, via clicking condition link)
```
Each level has a "Back to..." link to navigate up.

### Setting Risk Level in the Grid
The Risk Level combobox in the grid is **searchable/filterable**:
1. Click the dropdown arrow on the Risk Level cell in the grid row
2. Type to filter the list (e.g., "Critical" filters to matching options)
3. Click to select

> **Tip:** If the right panel Risk Level dropdown does not respond, use the grid's inline Risk Level combobox instead. The grid dropdowns are more reliable for this operation.

### Condition Row Color Coding
Row colors update automatically based on Compliance setting:
- Set Compliance to **In** -> row turns **green** (passing)
- Set Compliance to **Out** -> row turns **red** (failing)
- Set Compliance to **Not Assessed** -> row stays **neutral/gray**

---

## Playwright Workflows

### Workflow: Create a Temperature Question

```python
# 1. Navigate to the Activity Studio template
page.goto("https://{clientname}.cmx1.com/a/activitystudio/{id}/details")

# 2. Click a section in the left sidebar
page.click('[data-cy="section-item-{uuid}"]')

# 3. Click blue "+" to add question
page.click('[data-cy="add-question-zone-0"]')

# 4. Select Temperature from question type grid
page.click('text=Temperature')

# 5. Enter question text (inline in main canvas)
page.fill('[data-cy="question-text-input"]', 'Receiving temperature -- Chicken')

# 6. Expand the condition table
page.click('[data-cy="toggle-answer-config"]')
```

### Workflow: Add a Passing Condition (e.g., <= 41 F)

```python
# 1. Click "+ Add" to add a condition row
page.click('[data-cy="numeric-type-grid-add-button-1"]')

# 2. Click condition link to open Compliance Settings
page.click('[data-cy="numeric-type-grid-condition-button-0"]')

# 3. Select operator "Less Than or Equal To"
# (Use the operator dropdown in the right panel Compliance Settings)
page.select_option('select', label='Less Than or Equal To')

# 4. Enter threshold value
page.fill('[data-cy="expression-params-high-value-input"]', '41')

# 5. Set Points (earned / total)
# Use JavaScript native setter for React state updates:
# nativeInputValueSetter.call(pointsInput, '2')
# pointsInput.dispatchEvent(new Event('input', {bubbles: true}))

# 6. Set Compliance to "In" via grid dropdown
page.click('[data-cy="numeric-type-grid-compliance-0"]')
page.click('text=In')

# 7. Set Risk Level via grid combobox (searchable)
risk_cell = page.locator('[data-cy="numeric-type-grid-risk-0"]')
risk_cell.locator('button').click()
risk_cell.locator('input[placeholder="Add Risk..."]').fill('Managed')
page.click('text=Managed')  # Select from filtered results
```

### Workflow: Add a Failing Condition (e.g., > 41 F)

```python
# 1. Click "+ Add" to add another condition row
page.click('[data-cy="numeric-type-grid-add-button-1"]')

# 2. Click condition link for row 1 (0-indexed)
page.click('[data-cy="numeric-type-grid-condition-button-1"]')

# 3. Select operator "Greater Than"
page.select_option('select', label='Greater Than')

# 4. Enter threshold value
page.fill('[data-cy="expression-params-high-value-input"]', '41')

# 5. Set Points to 0 / 2

# 6. Set Compliance to "Out" via grid dropdown
page.click('[data-cy="numeric-type-grid-compliance-1"]')
page.click('text=Out')

# 7. Set Risk Level via grid combobox
risk_cell = page.locator('[data-cy="numeric-type-grid-risk-1"]')
risk_cell.locator('button').click()
# Type to filter, then select
page.click('text=Critical failure')

# 8. Toggle Corrective Actions ON
page.click('[data-cy="numeric-type-grid-cap-toggle-{uuid}"]')
```

### Workflow: Set Unit of Measurement

```python
# 1. Click temperature input area to open Answer sub-panel
page.click('[data-cy="answer-config-temperature"]')

# 2. Find Unit of Measurement dropdown and select Fahrenheit
page.select_option('select:near(:text("Unit of Measurement"))', label='Fahrenheit')

# 3. Click "Back to Question Block" to return
page.click('text=Back to Question Block')
```

---

## Example: Full Temperature Configuration (Food Safety CCP)

**Question:** "Receiving temperature -- Chicken"

### Template Settings
- Scoring: ON, Compliance: ON, Risk: ON
- Corrective Actions: ON, Immediate Action: OFF
- Unit of Measurement: Fahrenheit

### Condition Table

| Condition | Points | Compliance | Risk Level | Corrective Actions |
|-----------|--------|------------|------------|-------------------|
| 1 out of 1 answers are Less Than or Equal To 41 *F | 2 / 2 | In | Managed | OFF (N/A) |
| 1 out of 1 answers are Greater Than 41 *F | 0 / 2 | Out | Critical failure | ON (Set Details) |

### Interpretation
- If the received chicken temperature is **41 F or below**: PASS (In compliance, managed risk, full points)
- If the received chicken temperature is **above 41 F**: FAIL (Out of compliance, critical failure risk, zero points, corrective action required)

### Suggested Logic Rules (Best Practice)

| Component | Visibility | Requirement |
|-----------|-----------|------------|
| Observations | Always Visible | Required when Not Compliant |
| Recommendations | Visible when Not Compliant | Required when Not Compliant |
| Photos & Attachments | Always Visible | Required when Not Compliant |
| Comments | Default visible | N/A |

---

## Multiple Inputs & Calculation Types

The Temperature question type supports **multiple input controls** for capturing several temperature readings in a single question (e.g., three separate probe readings). When multiple controls are configured, a **Calculation Type** can aggregate the values, and the **condition evaluation text** dynamically changes to reflect the multi-input context.

### Controls (Number of Inputs)

| Setting | Location | Default | Range |
|---------|----------|---------|-------|
| **Controls** | Answer sub-panel | 1 | 1 -- 10+ (via -/+ buttons) |

The **Controls** field uses **minus (-)** and **plus (+)** buttons (no `data-cy` attribute -- located via DOM traversal from the "Controls" label within `[data-cy="question-numeric-container"]`).

**Behavior when increasing Controls:**
- Each increment adds a new temperature input field on the canvas
- The condition text updates its denominator: "1 out of **N** answers are ..."
- **Allowed Inputs MAX** auto-synchronizes to match the Controls count (e.g., Controls=3 forces MAX=3)
- **Allowed Inputs MIN** does NOT auto-change (stays at its previous value)

**Behavior when decreasing Controls:**
- Removes the last temperature input field from the canvas
- The condition text updates its denominator accordingly
- Allowed Inputs MAX auto-synchronizes downward

**Canvas rendering with multiple Controls:**
```
Controls = 3:
[thermometer] [Enter Temperature___] [*F] [^][v]
[thermometer] [Enter Temperature___] [*F] [^][v]
[thermometer] [Enter Temperature___] [*F] [^][v]
```

**Toggle bar changes with multiple Controls:**
```
Controls = 1:  [Number] [None]    [AI Assist]
Controls = 2+: [Number] [None] [.] [AI Assist]
               (extra dot-separator appears)
```

### Allowed Inputs (MIN / MAX)

| Setting | Location | Default | Notes |
|---------|----------|---------|-------|
| **Allowed Inputs MIN** | Answer sub-panel | 1 | Minimum inputs the end-user must fill at runtime |
| **Allowed Inputs MAX** | Answer sub-panel | 1 (auto-syncs to Controls) | Maximum inputs the end-user may fill at runtime |

- Both are `input[type="number"]` elements within `[data-cy="question-numeric-container"]` (index 1=MIN, index 2=MAX)
- **MIN and MAX do NOT affect condition text** -- they only govern runtime fill requirements
- When a **Calculation Type** is active, MIN is forced to equal the Controls count (all inputs required for aggregation)

### Calculation Type

| Setting | Location | Default | Options |
|---------|----------|---------|---------|
| **Calculation Type** | Answer sub-panel | None | None, Average, Minimum, Maximum, Product, Sum |

The Calculation Type dropdown is a custom button-based dropdown (not a native `<select>` element).

**Behavior when set to a calculation type (e.g., Average):**

1. **Canvas adds a calculation row** between the input fields and the condition table:
   ```
   [thermometer] [Enter Temperature___] [*F] [^][v]
   [thermometer] [Enter Temperature___] [*F] [^][v]
   [thermometer] [Enter Temperature___] [*F] [^][v]
   -----------------------------------------------
   Average  |  0  |  *F                  <-- NEW calculation row
   -----------------------------------------------
   === CONDITION TABLE ===
   ```

2. **Toggle bar changes** to include the calculation type name:
   ```
   [Number] [Average] [AI Assist]
   ```

3. **Condition text pattern changes** from count-based to aggregate-based:
   ```
   No calculation: "1 out of 3 answers are [operator] [value] [unit]"
   With Average:   "The Average of all answers is [operator] [value] [unit]"
   With Minimum:   "The Minimum of all answers is [operator] [value] [unit]"
   With Maximum:   "The Maximum of all answers is [operator] [value] [unit]"
   With Product:   "The Product of all answers is [operator] [value] [unit]"
   With Sum:       "The Sum of all answers is [operator] [value] [unit]"
   ```

4. **Allowed Inputs MIN is forced** to match Controls count (all inputs required)

5. **Switching back to None** restores the count-based pattern: "1 out of N answers are ..."

### Condition Text DOM Selectors

The condition text is composed of individual `<span>` elements. The selectors differ based on whether a Calculation Type is active:

#### Without Calculation Type (None)

| Element | Selector | Example Value |
|---------|----------|---------------|
| **Count prefix** | `[data-cy="compliance-count-prefix"]` | `1` |
| **"out of" text** | `[data-cy="compliance-out-of-text"]` | `out of` |
| **Total count** | `[data-cy="compliance-total-count"]` | `3` |
| **Answers text** | `[data-cy="compliance-answers-text"]` | `answers are` |
| **Operator** | `[data-cy="compliance-operator"]` | `Less Than or Equal To` |
| **Value** | `[data-cy="compliance-first-value"]` | `41` |

Full pattern: `[count-prefix] [out-of-text] [total-count] [answers-text] [operator] [value] [unit]`

#### With Calculation Type (Average, Minimum, Maximum, Product, Sum)

| Element | Selector | Example Value |
|---------|----------|---------------|
| **"The" prefix** | `[data-cy="compliance-count-prefix"]` | `The` |
| **Aggregate type** | `[data-cy="compliance-aggregate-type"]` | `Average` |
| **"of all" text** | `[data-cy="compliance-aggregate-text"]` | `of all` |
| **Answers text** | `[data-cy="compliance-answers-text"]` | `answers is` |
| **Operator** | `[data-cy="compliance-operator"]` | `Less Than or Equal To` |
| **Value** | `[data-cy="compliance-first-value"]` | `41` |

Full pattern: `[count-prefix] [aggregate-type] [aggregate-text] [answers-text] [operator] [value] [unit]`

> **Key differences when Calculation Type is active:**
> - `compliance-count-prefix` changes from a number (e.g., `1`) to the word `The`
> - `compliance-aggregate-type` (NEW) appears with the calculation name
> - `compliance-aggregate-text` (NEW) appears with `of all`
> - `compliance-answers-text` changes from `answers are` (plural) to `answers is` (singular)
> - `compliance-out-of-text` and `compliance-total-count` are removed

### Field Labels

| Setting | Location | Default | Options |
|---------|----------|---------|---------|
| **Field Labels** | Answer sub-panel | Off | Off, Same Label, Individual Labels |

Field Labels is a **3-option dropdown** (not a simple toggle):

- **Off**: No labels shown on temperature input fields
- **Same Label**: Shows a single **"Label for all inputs"** dropdown below the Field Labels setting; all input fields share the same label
- **Individual Labels**: Shows separate **"Label for input # 1"**, **"Label for input # 2"**, **"Label for input # 3"** (etc.) dropdowns; each input gets its own label

> **Note:** The label dropdowns appear to be combobox/select elements with predefined options (not free-text). The number of individual label dropdowns matches the Controls count.

### Decimals

| Setting | Location | Default | Options |
|---------|----------|---------|---------|
| **Decimals** | Answer sub-panel | 0 | 0, 1, 2, 3 |

The Decimals dropdown controls how many decimal places are allowed in the temperature value input. This affects both the input field precision and the condition threshold display.

### Unit of Measurement

| Setting | Location | Default | Options |
|---------|----------|---------|---------|
| **Unit of Measurement** | Answer sub-panel | None | None, Celcius, Fahrenheit |

> **CRITICAL -- UI Spelling:** The dropdown uses the spelling **"Celcius"** (not "Celsius") and **"Farenheit"** (not "Fahrenheit"). Automation scripts must match the exact UI spelling.

> **DESTRUCTIVE GOTCHA:** Changing the Unit of Measurement **deletes condition rows** that have no value set. Switching from Fahrenheit to Celcius removed the first condition row (empty value). Switching to None removed ALL remaining condition rows. This deletion is **NOT undoable** via Ctrl+Z or the undo button. The condition rows must be manually recreated. **Always set condition values before changing units, or avoid changing units after conditions are configured.**

### Playwright Workflow: Configure Multiple Inputs with Calculation

```python
# 1. Click temperature input to open Answer sub-panel
page.click('[data-cy="answer-config-temperature"]')

# 2. Increase Controls from 1 to 3 (click + button twice)
# Controls +/- buttons have no data-cy; use DOM traversal:
plus_button = page.evaluate('''() => {
    const container = document.querySelector('[data-cy="question-numeric-container"]');
    const labels = container.querySelectorAll('label, span');
    for (const label of labels) {
        if (label.textContent.trim() === 'Controls') {
            const row = label.closest('div');
            const buttons = row.querySelectorAll('button');
            return buttons[1]; // plus is second button (identified by SVG path)
        }
    }
}''')
page.click(plus_button)  # Controls: 1 -> 2
page.click(plus_button)  # Controls: 2 -> 3

# 3. Select Calculation Type "Average"
# (Custom button dropdown, not native select)
page.click('button:has-text("None"):near(:text("Calculation Type"))')
page.click('text=Average')

# 4. Verify condition text changed to aggregate pattern
condition_text = page.text_content('[data-cy="compliance-count-prefix"]')
assert condition_text == "The"
agg_type = page.text_content('[data-cy="compliance-aggregate-type"]')
assert agg_type == "Average"

# 5. Set Field Labels to "Individual Labels"
page.click('button:has-text("Off"):near(:text("Field Labels"))')
page.click('text=Individual Labels')
# Individual label dropdowns now appear for each input

# 6. Set Decimals to 1
page.click('button:has-text("0"):near(:text("Decimals"))')
page.click('text=1')
```

### Multi-Input Interaction Summary

| Setting Changed | Canvas Effect | Condition Text Effect | Side Effects |
|----------------|---------------|----------------------|--------------|
| Controls +1 | Adds input field | "out of N" increments | MAX auto-syncs up |
| Controls -1 | Removes input field | "out of N" decrements | MAX auto-syncs down |
| MIN changed | No canvas change | No text change | Runtime fill requirement only |
| MAX changed | No canvas change | No text change | Runtime fill requirement only |
| Calc Type set | Adds calculation row | Pattern changes to "The [Type] of all answers is ..." | MIN forced = Controls; toggle bar updated |
| Calc Type = None | Removes calculation row | Pattern reverts to "X out of N answers are ..." | MIN unfrozen; toggle bar reverts |
| Field Labels = Same | No canvas change | No text change | One shared label dropdown appears |
| Field Labels = Individual | No canvas change | No text change | Per-input label dropdowns appear |
| Decimals changed | No visible canvas change | No text change | Precision constraint on input values |
| Unit changed | Unit symbols update | Unit in condition text updates | **DESTRUCTIVE: may delete condition rows** |

---

## Temperature vs. Numeric: Key Differences

| Feature | Temperature | Numeric |
|---------|-------------|---------|
| **Grid prefix** | `numeric-type-grid-*` | `numeric-type-grid-*` (same) |
| **Unit support** | Fahrenheit / Celsius | Custom units |
| **Input icon** | Thermometer | None |
| **Condition system** | Threshold-based (same) | Threshold-based (same) |
| **Answer config** | `answer-config-temperature` | `answer-config-numeric` |
| **Detail content** | `answer-config-detail-content-temperature` | `answer-config-detail-content-numeric` |

Both Temperature and Numeric use the same **condition-based evaluation grid** (`numeric-type-grid-*` selectors). The primary differences are the input presentation (thermometer icon, unit selector) and the answer config data-cy attributes.

---

## Timer Question Type

> **TODO:** The Timer question type has not yet been explored in the UI. Future sessions should document:
> - Timer controls and duration capture format
> - How timer values map to compliance/risk thresholds
> - Whether Timer uses the same `numeric-type-grid-*` condition system
> - Unique Timer settings (start/stop controls, elapsed time display)
> - Example configurations (e.g., handwashing timer, cooling process timer)
> - Playwright automation workflows for Timer
