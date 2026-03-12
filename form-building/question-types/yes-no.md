# Yes/No Question — Build Recipe

> **Universal concepts** (answer table, evaluation toggles, logic rules): see [shared-concepts.md](../shared-concepts.md)
> **Two build methods:** This recipe shows CDP script code (raw Playwright API). For interactive agent building, use `playwright-cli` commands — see the Quick Reference below.

---

## `playwright-cli` Quick Reference (Interactive Building)

For agent-driven interactive building, these CLI commands map to the CDP code in the recipes below. Use `playwright-cli snapshot` between steps to get updated element refs.

| Recipe Step | `playwright-cli` Command |
|-------------|-------------------------|
| Add question zone | `playwright-cli click '[data-cy="add-question-zone-0"]'` |
| Select Yes/No type | `playwright-cli snapshot` → find "Yes / No" ref → `playwright-cli click eN` |
| Enter question text | `playwright-cli fill '[data-cy="question-text-input"]' "Question text here"` |
| Enter instructions | `playwright-cli snapshot` → find instructions placeholder ref → `playwright-cli click eN` → `playwright-cli type "Instructions text"` |
| Expand answer table | `playwright-cli click '[data-cy="toggle-answer-config"]'` |
| Set points (Yes row) | `playwright-cli snapshot` → find points input ref → `playwright-cli fill eN "4"` |
| Set points available | `playwright-cli fill eN "4"` (next input ref from snapshot) |
| Set compliance | `playwright-cli snapshot` → find compliance cell ref → `playwright-cli click eN` → `playwright-cli snapshot` → click "In" or "Out" ref |
| Set risk level | `playwright-cli fill '[data-cy^="answer-type-grid-risk-"] input' "High"` → `playwright-cli press Enter` |
| Toggle CA on | `playwright-cli snapshot` → find CA toggle ref → `playwright-cli click eN` |
| Enable Observations | `playwright-cli snapshot` → find Observations toggle ref → `playwright-cli click eN` |
| Click "Create Manually" | `playwright-cli snapshot` → find ref → `playwright-cli click eN` |
| Add reason item | `playwright-cli fill 'input[placeholder="Start typing to add more..."]' "Reason text"` → `playwright-cli press Enter` |
| Open logic panel | `playwright-cli click '[data-cy="logic-visual-indicator"]'` |
| Set logic dropdown | `playwright-cli snapshot` → find listbox button ref → `playwright-cli click eN` → `playwright-cli snapshot` → click option ref |

> **Key difference:** With `playwright-cli`, use `snapshot` to get element refs, then interact using those refs. With CDP scripts, use selectors directly in code. `playwright-cli` is adaptive (re-snapshot if something fails); CDP scripts are faster for batch operations.

---

## Critical Gotchas

> **Read these before building. These are verified bugs and behavioral quirks.**

1. **Risk level**: Do NOT click predefined risk dropdown options — there is a bug. Instead, **type the risk value** (e.g., "High") into the combobox input and **press Enter**.
2. **Policy**: Toggle ON is sufficient. Do not attempt to search or add from the policy library.
3. **Observations/Recommendations format**: Default is **Checkbox List (Multi-select)**. Format buttons in the block header: list icon = multi-pick, dropdown icon = dropdown, T icon = free text. If free text, no predefined reason items are needed.
4. **"Create Manually" required**: After enabling Observations or Recommendations, you must click "Create Manually" before reason input fields appear.
5. **Corrective Action days**: Default to **Business Days** (easier for corrective action workflows) unless explicitly told otherwise.

---

## Selector Quick Reference

All selectors use prefix matching — no UUIDs needed. Use `.first()` for Yes row, `.nth(1)` for No row.

| What | Selector | Targeting |
|------|----------|-----------|
| Add question zone | `[data-cy="add-question-zone-0"]` | `.first()` |
| Question type: Yes/No | `text=Yes / No` | `.first()` |
| Question text input | `[data-cy="question-text-input"]` | `.first()` |
| Instructions placeholder | `text=Click to add instructions (optional)...` | `.first()` |
| Expand answer table | `[data-cy="toggle-answer-config"]` | `.first()` |
| Points earned input | `[data-cy^="answer-type-grid-points-"] input` | `.first()` = Yes, `.nth(1)` = No |
| Points available input | `[data-cy^="answer-type-grid-points-available-"] input` | `.first()` = Yes, `.nth(1)` = No |
| Compliance dropdown | `[data-cy^="answer-type-grid-compliance-"]` | `.first()` = Yes, `.nth(1)` = No |
| Risk combobox input | `[data-cy^="answer-type-grid-risk-"] input` | `.first()` = Yes, `.nth(1)` = No |
| CA toggle container | `[data-cy^="answer-type-grid-cap-toggle-"]` | `.first()` = Yes, `.nth(1)` = No |
| CA switch (inside container) | `[data-cy="on-off-switch-toggle"]` | nested inside CA container |
| Eval: Points toggle | `[data-cy="answer-settings-points-switch"]` | right panel |
| Eval: Compliance toggle | `[data-cy="answer-settings-compliance-switch"]` | right panel |
| Eval: Risk toggle | `[data-cy="answer-settings-risk-switch"]` | right panel |
| Eval: CA toggle | `[data-cy="answer-settings-corrective-actions-switch"]` | right panel |
| Logic icon (inline) | `[data-cy="logic-visual-indicator"]` | positional per component |
| Logic dropdowns | `button[id^="headlessui-listbox-button-"]` | positional (see step details) |
| Reason/action input | `input[placeholder="Start typing to add more..."]` | `.last()` |
| Create Manually button | `text=Create Manually` | `.first()` |
| Back to Question Block | `text=Back to Question Block` | `.first()` |

---

## Recipe 1: Complex Scored/Compliance Yes/No

**Use this recipe for compliance audit questions that need scoring, risk, corrective actions, observations, and recommendations.**

### Target Configuration

| Setting | Yes Answer | No Answer |
|---------|-----------|----------|
| Points | 4 / 4 | 0 / 4 |
| Compliance | In | Out |
| Risk Level | Managed | High |
| Corrective Actions | OFF | ON — 1 Business Day |

| Component | Visibility | Requirement |
|-----------|-----------|------------|
| Observations | Always Visible | Required when Is Not Compliant |
| Recommendations | Visible when Is Not Compliant | Required when Is Not Compliant |
| Photos & Attachments | Always Visible | Required when Is Not Compliant |
| Comments | Always Visible (default) | N/A |

---

### Step 1: Add Question

Click the add-question zone in the current section, then select Yes/No type.

```javascript
// Click add question zone
await page.locator('[data-cy="add-question-zone-0"]').first().click();
await page.waitForTimeout(1000);

// Select Yes/No from type picker
await page.locator('text=Yes / No').first().click();
await page.waitForTimeout(1000);
```

### Step 2: Enter Question Text

```javascript
const questionInput = page.locator('[data-cy="question-text-input"]').first();
await questionInput.fill('Is the work area free of safety hazards? (debris, exposed materials, trip hazards)');
await page.waitForTimeout(500);
```

### Step 3: Enter Instructions (Optional)

Click the instructions placeholder, then type the instruction text.

```javascript
const instructionsPlaceholder = page.locator('text=Click to add instructions (optional)...').first();
await instructionsPlaceholder.click();
await page.waitForTimeout(300);
await page.keyboard.type('Inspect the work area thoroughly for any items such as tools, materials, or debris that may obstruct walkways or pathways.');
await page.waitForTimeout(500);
```

### Step 4: Expand Answer Table

```javascript
const toggleConfig = page.locator('[data-cy="toggle-answer-config"]').first();
await toggleConfig.click();
await page.waitForTimeout(1000);
```

### Step 5: Configure YES Row — Points

```javascript
// Yes points earned: 4
const yesPointsEarned = page.locator('[data-cy^="answer-type-grid-points-"] input').first();
await yesPointsEarned.fill('4');
await page.waitForTimeout(200);

// Yes points available: 4
const yesPointsAvail = page.locator('[data-cy^="answer-type-grid-points-available-"] input').first();
await yesPointsAvail.fill('4');
await page.waitForTimeout(200);
```

### Step 6: Configure NO Row — Points

```javascript
// No points earned: 0
const noPointsEarned = page.locator('[data-cy^="answer-type-grid-points-"] input').nth(1);
await noPointsEarned.fill('0');
await page.waitForTimeout(200);

// No points available: 4
const noPointsAvail = page.locator('[data-cy^="answer-type-grid-points-available-"] input').nth(1);
await noPointsAvail.fill('4');
await page.waitForTimeout(200);
```

### Step 7: Set Compliance

```javascript
// YES → In
const yesCompliance = page.locator('[data-cy^="answer-type-grid-compliance-"]').first();
await yesCompliance.click();
await page.waitForTimeout(300);
await page.locator('text=In').first().click();
await page.waitForTimeout(300);

// NO → Out
const noCompliance = page.locator('[data-cy^="answer-type-grid-compliance-"]').nth(1);
await noCompliance.click();
await page.waitForTimeout(300);
await page.locator('text=Out').first().click();
await page.waitForTimeout(300);
```

### Step 8: Set Risk Level

> **BUG WORKAROUND**: Type the value and press Enter. Do NOT click dropdown options.

```javascript
// YES → Managed
const yesRiskInput = page.locator('[data-cy^="answer-type-grid-risk-"] input').first();
await yesRiskInput.click();
await page.waitForTimeout(200);
await yesRiskInput.fill('Managed');
await page.waitForTimeout(200);
await page.keyboard.press('Enter');
await page.waitForTimeout(300);

// NO → High
const noRiskInput = page.locator('[data-cy^="answer-type-grid-risk-"] input').nth(1);
await noRiskInput.click();
await page.waitForTimeout(200);
await noRiskInput.fill('High');
await page.waitForTimeout(200);
await page.keyboard.press('Enter');
await page.waitForTimeout(300);
```

### Step 9: Enable Corrective Actions for NO Row

```javascript
// Toggle CA ON for No answer
const noCaContainer = page.locator('[data-cy^="answer-type-grid-cap-toggle-"]').nth(1);
const caSwitch = noCaContainer.locator('[data-cy="on-off-switch-toggle"]').first();
await caSwitch.click();
await page.waitForTimeout(500);
```

After toggling CA on, the default is 1 Business Day. To change the days or type (Business/Calendar), click the days text that appears (e.g., "1 Business Days") to open the configuration panel. Most questions use the default — only change if the build spec requires it.

### Step 10: Enable Policy Toggle

Toggle Policy ON in the OPTIONS section of the right panel. No need to search for or attach a specific policy.

```javascript
await enableOption(page, 'Policy');
await page.waitForTimeout(500);
```

### Step 11: Enable & Configure Observations

```javascript
// 1. Enable Observations toggle in OPTIONS
await enableOption(page, 'Observations');
await page.waitForTimeout(1000);

// 2. Click "Create Manually" (required before input fields appear)
const createManually = page.locator('text=Create Manually').first();
if (await createManually.isVisible().catch(() => false)) {
  await createManually.click();
  await page.waitForTimeout(1000);
}

// 3. Add reason items (default format: Checkbox List / Multi-select)
const reasons = [
  'Trip hazards are present due to loose materials or debris on the floor.',
  'Exposed cables or wiring are creating potential tripping risks.',
  'Walkways are obstructed by tools or equipment left in the area.',
  'Uneven surfaces or flooring are not clearly marked or addressed.',
  'Safety signage indicating hazards is missing or not visible.'
];
for (const reason of reasons) {
  const addInput = page.locator('input[placeholder="Start typing to add more..."]').last();
  await addInput.fill(reason);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
}
```

**Format options** (buttons in block header, default is multi-pick):
- **List icon** = Checkbox List (Multi-select) — end-user picks multiple predefined items
- **Dropdown icon** = Dropdown — end-user picks one from a dropdown
- **T icon** = Free Text — end-user types freely, no predefined options needed

### Step 12: Enable & Configure Recommendations

Same pattern as Observations. Click the question first to re-select it if needed.

```javascript
// 1. Enable Recommendations toggle
await enableOption(page, 'Recommendations');
await page.waitForTimeout(1000);

// 2. Click "Create Manually"
const createManually2 = page.locator('text=Create Manually').first();
if (await createManually2.isVisible().catch(() => false)) {
  await createManually2.click();
  await page.waitForTimeout(1000);
}

// 3. Add recommendation items
const actions = [
  'Clear all loose materials and debris from the work area immediately.',
  'Secure and cover any exposed cables or wiring to prevent tripping.',
  'Ensure all tools and equipment are stored properly and walkways are kept clear.',
  'Repair or mark any uneven surfaces to alert workers and prevent accidents.',
  'Install visible safety signage to inform workers of potential hazards.'
];
for (const action of actions) {
  const addInput = page.locator('input[placeholder="Start typing to add more..."]').last();
  await addInput.fill(action);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
}
```

### Step 13: Configure Observations Logic

Click the logic icon (tree icon with orange dot) on the Observations block header to open the Logic panel.

**Visibility**: Already defaults to "Always Visible" — no change needed.

**Requirement**: Set to "Question Results → Is Not Compliant":

```javascript
// Click the Observations logic icon to open its Logic panel
const obsLogicIcon = page.locator('[data-cy="logic-visual-indicator"]').first();
await obsLogicIcon.click();
await page.waitForTimeout(1000);

// The Logic panel opens in the right side panel with:
//   Visibility section (dropdowns at positions 0, 1)
//   Requirement section (dropdowns at positions 2, 3)
//
// Visibility is already "Always Visible" — skip it.
//
// Set Requirement source → "Question Results"
const logicDropdowns = page.locator('button[id^="headlessui-listbox-button-"]');

const reqSourceBtn = logicDropdowns.nth(2);
await reqSourceBtn.click();
await page.waitForTimeout(300);
await page.locator('text=Question Results').last().click();
await page.waitForTimeout(500);

// Set Requirement condition → "Is Not Compliant"
const reqConditionBtn = logicDropdowns.nth(3);
await reqConditionBtn.click();
await page.waitForTimeout(300);
await page.locator('text=Is Not Compliant').last().click();
await page.waitForTimeout(500);
```

> **Dropdown position index**: When the Logic panel has both Visibility and Requirement sections, the `headlessui-listbox-button-` dropdowns are indexed as:
> - `.first()` (0) = Visibility source
> - `.nth(1)` = Visibility condition
> - `.nth(2)` = Requirement source
> - `.nth(3)` = Requirement condition

### Step 14: Configure Recommendations Logic

Click "Back to Question Block" first, then click the Recommendations logic icon.

```javascript
// Go back to the question
await page.locator('text=Back to Question Block').first().click();
await page.waitForTimeout(1000);

// Scroll to find the Recommendations block and click its logic icon
// The Recommendations logic icon is the second [data-cy="logic-visual-indicator"] on the page
const recLogicIcon = page.locator('[data-cy="logic-visual-indicator"]').nth(1);
await recLogicIcon.click();
await page.waitForTimeout(1000);

// Set Visibility source → "Question Results"
const logicDropdowns2 = page.locator('button[id^="headlessui-listbox-button-"]');

const visSourceBtn = logicDropdowns2.first();
await visSourceBtn.click();
await page.waitForTimeout(300);
await page.locator('text=Question Results').first().click();
await page.waitForTimeout(500);

// Set Visibility condition → "Is Not Compliant"
const visConditionBtn = logicDropdowns2.nth(1);
await visConditionBtn.click();
await page.waitForTimeout(300);
await page.locator('text=Is Not Compliant').first().click();
await page.waitForTimeout(500);

// Set Requirement source → "Question Results"
const reqSourceBtn2 = logicDropdowns2.nth(2);
await reqSourceBtn2.click();
await page.waitForTimeout(300);
await page.locator('text=Question Results').last().click();
await page.waitForTimeout(500);

// Set Requirement condition → "Is Not Compliant"
const reqConditionBtn2 = logicDropdowns2.nth(3);
await reqConditionBtn2.click();
await page.waitForTimeout(300);
await page.locator('text=Is Not Compliant').last().click();
await page.waitForTimeout(500);
```

### Step 15: Configure Photos & Attachments Logic

Click "Back to Question Block", then click the camera icon in the question footer.

```javascript
// Go back to the question
await page.locator('text=Back to Question Block').first().click();
await page.waitForTimeout(1000);

// Click the camera footer icon to open Photos & Attachments panel
const cameraIcon = page.locator('[data-cy="question-footer-photo-control"]').first();
await cameraIcon.click();
await page.waitForTimeout(1000);

// Visibility is already "Always Visible" — skip it.
// Set Requirement source → "Question Results"
const logicDropdowns3 = page.locator('button[id^="headlessui-listbox-button-"]');

const reqSourceBtn3 = logicDropdowns3.nth(2);
await reqSourceBtn3.click();
await page.waitForTimeout(300);
await page.locator('text=Question Results').last().click();
await page.waitForTimeout(500);

// Set Requirement condition → "Is Not Compliant"
const reqConditionBtn3 = logicDropdowns3.nth(3);
await reqConditionBtn3.click();
await page.waitForTimeout(300);
await page.locator('text=Is Not Compliant').last().click();
await page.waitForTimeout(500);
```

### Step 16: Return to Question Block

```javascript
await page.locator('text=Back to Question Block').first().click();
await page.waitForTimeout(500);
```

---

## Recipe 2: Simple Data-Only Yes/No

**Use this for questions that collect a yes/no answer without scoring, compliance, risk, or corrective actions.** Examples: "Was the delivery received?", "Did the vendor arrive on time?"

### Step 1: Add Question & Enter Text

```javascript
// Add question
await page.locator('[data-cy="add-question-zone-0"]').first().click();
await page.waitForTimeout(1000);
await page.locator('text=Yes / No').first().click();
await page.waitForTimeout(1000);

// Enter question text
await page.locator('[data-cy="question-text-input"]').first().fill('Was the delivery received?');
await page.waitForTimeout(500);
```

### Step 2: Turn OFF All Evaluation Toggles

In the right panel ANSWER section, turn off all four evaluation toggles.

```javascript
// Turn off Points
const pointsSwitch = page.locator('[data-cy="answer-settings-points-switch"]');
if (await pointsSwitch.getAttribute('aria-checked') === 'true') {
  await pointsSwitch.click();
  await page.waitForTimeout(300);
}

// Turn off Compliance
const compSwitch = page.locator('[data-cy="answer-settings-compliance-switch"]');
if (await compSwitch.getAttribute('aria-checked') === 'true') {
  await compSwitch.click();
  await page.waitForTimeout(300);
}

// Turn off Risk
const riskSwitch = page.locator('[data-cy="answer-settings-risk-switch"]');
if (await riskSwitch.getAttribute('aria-checked') === 'true') {
  await riskSwitch.click();
  await page.waitForTimeout(300);
}

// Turn off Corrective Actions
const caSwitch = page.locator('[data-cy="answer-settings-corrective-actions-switch"]');
if (await caSwitch.getAttribute('aria-checked') === 'true') {
  await caSwitch.click();
  await page.waitForTimeout(300);
}
```

That's it. No answer table configuration, no observations/recommendations, no logic rules needed.

---

## Helper Functions

### enableOption — Toggle an OPTIONS switch ON

```javascript
async function enableOption(page, optionName) {
  const optionRow = page.locator(`text=${optionName}`).first();
  const toggle = optionRow.locator(
    'xpath=ancestor::div[contains(@class,"flex")]//button[contains(@class,"switch") or @role="switch"]'
  ).first();

  const isChecked = await toggle.getAttribute('aria-checked').catch(() => null) ||
                    await toggle.getAttribute('data-state').catch(() => null);

  if (isChecked === 'true' || isChecked === 'checked') {
    return; // already enabled
  }

  await toggle.click();
  await page.waitForTimeout(500);
}
```

### addReasons — Add items to Observations or Recommendations

```javascript
async function addReasons(page, reasons) {
  for (const reason of reasons) {
    const addInput = page.locator('input[placeholder="Start typing to add more..."]').last();
    await addInput.fill(reason);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
  }
}
```

### clickSection — Select a section in the left sidebar

```javascript
async function clickSection(page, sectionName) {
  const section = page.locator(`text=${sectionName}`).first();
  await section.click();
  await page.waitForTimeout(1500);
}
```

### setInputValue — React-compatible input value setter (fallback)

Use this if `.fill()` doesn't trigger React state updates on a particular input.

```javascript
async function setInputValue(page, selector, value) {
  await page.evaluate(({ sel, val }) => {
    const input = document.querySelector(sel);
    if (!input) throw new Error(`Input not found: ${sel}`);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(input, val);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, { sel: selector, val: value });
}
```

---

## Wait Time Reference

| Action Type | Wait (ms) | Why |
|-------------|-----------|-----|
| Question type selection | 1000 | React re-renders the entire question block |
| Expand answer table | 1000 | Answer grid renders inline on canvas |
| Text input fill | 200-500 | Minimal, no major re-render |
| Dropdown click → option click | 300 each | Dropdown open/close animation |
| Toggle switch | 500 | State persistence |
| Logic icon click | 1000 | Side panel switches to Logic tab |
| Logic dropdown selection | 300-500 | HeadlessUI animation |
| Section click | 1500 | Full section content loads |
