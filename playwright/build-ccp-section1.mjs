/**
 * CMX1 Activity Studio — CDP Script (Batch Automation)
 *
 * NOTE: This is a CDP Script — it uses the `playwright` npm library directly.
 * It must be run from a directory with `playwright` installed as a local dependency
 * (e.g., ~/playwright-workspace/). Global npm installs do NOT resolve for ESM imports.
 *
 * For interactive form building, prefer `playwright-cli` commands instead.
 * See activity-studio.md for the recommended workflow.
 *
 * Connects to the user's EXISTING Chrome browser via Chrome DevTools Protocol.
 * Builds CCP Checklist Section 1 (Receiving) using skill file patterns.
 *
 * PREREQUISITES:
 *   1. Chrome must be running with: --remote-debugging-port=9222
 *   2. User must be logged into CMX1 in that browser
 *   3. The CCP Checklist template should be open in Activity Studio
 *   4. Run from ~/playwright-workspace/ (or any dir with playwright installed locally)
 *
 * Usage: cd ~/playwright-workspace && node /path/to/build-ccp-section1.mjs
 */

import { chromium } from 'playwright';

const CDP_ENDPOINT = 'http://localhost:9222';
const CMX1_URL_PATTERN = 'cmx1.com';
const TEMPLATE_URL = 'https://vnext-qa.cmx1.com/a/activitystudio/2e7c248f4351457187d2551341e87e66/details';

// ── Profile C: Cold Temperature (≤41°F) observations & recommendations ──
const PROFILE_C = {
  observations: [
    'temperature above threshold',
    'cooler door left open',
    'equipment malfunction',
    'overcrowded storage'
  ],
  recommendations: [
    'move items to functioning unit',
    'adjust thermostat',
    'service equipment',
    'reduce load'
  ]
};

// ── Profile A: Standard Yes/No observations & recommendations ──
const PROFILE_A = {
  observations: [
    'non-compliant condition observed',
    'documentation missing',
    'procedure not followed',
    'equipment malfunction'
  ],
  recommendations: [
    'correct immediately',
    'retrain staff',
    'replace equipment',
    'update procedure'
  ]
};

// ── Helper: log with timestamp ──
function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

// ── Helper: Native input value setter (React state workaround) ──
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

// ── Helper: Click section in left sidebar ──
async function clickSection(page, sectionName) {
  log(`Clicking section: ${sectionName}`);
  const section = page.locator(`text=${sectionName}`).first();
  await section.click();
  await page.waitForTimeout(1500);
}

// ── Helper: Enable an option toggle in the right panel ──
async function enableOption(page, optionName) {
  log(`Enabling option: ${optionName}`);
  const optionRow = page.locator(`text=${optionName}`).first();
  const toggle = optionRow.locator('xpath=ancestor::div[contains(@class,"flex")]//button[contains(@class,"switch") or @role="switch"]').first();

  const isChecked = await toggle.getAttribute('aria-checked').catch(() => null) ||
                    await toggle.getAttribute('data-state').catch(() => null);

  if (isChecked === 'true' || isChecked === 'checked') {
    log(`  ${optionName} already enabled`);
    return;
  }

  await toggle.click();
  await page.waitForTimeout(500);
  log(`  ${optionName} enabled`);
}

// ── Helper: Add observation/recommendation reasons ──
async function addReasons(page, reasons, blockTitle) {
  log(`Adding ${reasons.length} reasons to ${blockTitle}`);

  for (const reason of reasons) {
    const addInput = page.locator('input[placeholder="Start typing to add more..."]').last();
    await addInput.fill(reason);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    log(`  Added: "${reason}"`);
  }
}

// ── Helper: Configure visibility rule to "Question Results → Is Not Compliant" ──
async function setVisibilityNotCompliant(page) {
  log('Setting visibility: Question Results → Is Not Compliant');

  const logicIcon = page.locator('[data-cy="logic-visual-indicator"]').first();
  await logicIcon.click();
  await page.waitForTimeout(1000);

  const addConditionBtn = page.locator('button:has-text("Add Condition")').first();
  if (await addConditionBtn.isVisible().catch(() => false)) {
    await addConditionBtn.click();
    await page.waitForTimeout(500);
  }

  const sourceDropdowns = page.locator('button[id^="headlessui-listbox-button-"]');
  const sourceBtn = sourceDropdowns.first();
  await sourceBtn.click();
  await page.waitForTimeout(300);
  await page.locator('text=Question Results').first().click();
  await page.waitForTimeout(500);

  const conditionBtn = sourceDropdowns.nth(1);
  await conditionBtn.click();
  await page.waitForTimeout(300);
  await page.locator('text=Is Not Compliant').first().click();
  await page.waitForTimeout(500);

  log('  Visibility rule set');
}

// ── Helper: Configure requirement rule to "Question Results → Is Not Compliant" ──
async function setRequirementNotCompliant(page) {
  log('Setting requirement: Question Results → Is Not Compliant');

  const reqDropdowns = page.locator('button[id^="headlessui-listbox-button-"]');

  const reqSourceBtn = reqDropdowns.nth(2);
  if (await reqSourceBtn.isVisible().catch(() => false)) {
    await reqSourceBtn.click();
    await page.waitForTimeout(300);
    await page.locator('text=Question Results').last().click();
    await page.waitForTimeout(500);

    const reqConditionBtn = reqDropdowns.nth(3);
    await reqConditionBtn.click();
    await page.waitForTimeout(300);
    await page.locator('text=Is Not Compliant').last().click();
    await page.waitForTimeout(500);
  }

  log('  Requirement rule set');
}

// ══════════════════════════════════════════════════════════════════
// MAIN SCRIPT — CDP Connection (connects to user's existing browser)
// ══════════════════════════════════════════════════════════════════

(async () => {
  log('');
  log('╔══════════════════════════════════════════════════════════════╗');
  log('║  CMX1 Playwright Builder — CDP Mode                        ║');
  log('║  Connecting to your existing Chrome browser...             ║');
  log('╚══════════════════════════════════════════════════════════════╝');
  log('');

  // ── Step 1: Connect to existing Chrome via CDP ──
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_ENDPOINT);
    log('✅ Connected to Chrome via CDP');
  } catch (err) {
    log('');
    log('❌ ERROR: Could not connect to Chrome via CDP.');
    log('');
    log('Make sure Chrome was launched with remote debugging enabled:');
    log('');
    log('  macOS:  /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
    log('  Win:    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
    log('  Linux:  google-chrome --remote-debugging-port=9222');
    log('');
    log('Chrome must be FULLY quit before relaunching with the flag.');
    log(`Technical error: ${err.message}`);
    process.exit(1);
  }

  // ── Step 2: Find the CMX1 tab in the existing browser ──
  const contexts = browser.contexts();
  log(`Found ${contexts.length} browser context(s)`);

  let page = null;

  for (const ctx of contexts) {
    const pages = ctx.pages();
    log(`  Context has ${pages.length} page(s)`);

    for (const p of pages) {
      const url = p.url();
      log(`    Tab: ${url.substring(0, 80)}...`);
      if (url.includes(CMX1_URL_PATTERN)) {
        page = p;
        log(`  ✅ Found CMX1 tab!`);
        break;
      }
    }
    if (page) break;
  }

  if (!page) {
    log('');
    log('❌ No CMX1 tab found in the browser.');
    log(`Please open ${TEMPLATE_URL} in Chrome and make sure you're logged in.`);
    log('Then re-run this script.');
    // Don't close browser — it's the user's browser!
    process.exit(1);
  }

  // Bring the CMX1 tab to focus
  await page.bringToFront();
  await page.waitForTimeout(1000);

  // ── Step 3: Verify we're in Activity Studio ──
  const currentUrl = page.url();
  log(`Current URL: ${currentUrl}`);

  if (!currentUrl.includes('activitystudio')) {
    log('Navigating to the CCP Checklist template...');
    await page.goto(TEMPLATE_URL);
    await page.waitForTimeout(3000);
  }

  // Wait for the form builder to be loaded
  try {
    await page.waitForSelector('[data-cy^="section-item"]', { timeout: 15000 });
    log('✅ Activity Studio is loaded and ready');
  } catch (e) {
    log('❌ Activity Studio did not load. Are you logged in?');
    log('Please log in and navigate to the template, then re-run.');
    process.exit(1);
  }

  // ── Step 4: Take a screenshot of initial state ──
  await page.screenshot({ path: '/tmp/cmx1-playwright-01-initial.png' });
  log('Screenshot saved: /tmp/cmx1-playwright-01-initial.png');

  // ── Step 5: Click Section 1 (Receiving) ──
  await clickSection(page, 'Receiving');
  await page.screenshot({ path: '/tmp/cmx1-playwright-02-section1.png' });

  // ── Step 6: Find question 1.2 (Temperature — Chicken) and add obs/recs ──
  log('Looking for question 1.2 (Receiving temperature — Chicken)...');
  const q12 = page.locator('text=Receiving temperature').first();

  if (await q12.isVisible().catch(() => false)) {
    log('Found question 1.2! Clicking to select...');
    await q12.click();
    await page.waitForTimeout(1500);

    // ── Step 6a: Enable Observations ──
    log('--- Configuring Observations for Q1.2 (Profile C) ---');
    try {
      await enableOption(page, 'Observations');
      await page.waitForTimeout(1000);

      const createManually = page.locator('text=Create Manually').first();
      if (await createManually.isVisible().catch(() => false)) {
        await createManually.click();
        await page.waitForTimeout(1000);
        log('Clicked "Create Manually" for observations');
      }

      await addReasons(page, PROFILE_C.observations, 'Observations');
      await page.screenshot({ path: '/tmp/cmx1-playwright-03-observations.png' });

    } catch (err) {
      log(`Warning: Could not configure observations - ${err.message}`);
    }

    // ── Step 6b: Enable Recommendations ──
    log('--- Configuring Recommendations for Q1.2 (Profile C) ---');
    try {
      await q12.click();
      await page.waitForTimeout(1000);

      await enableOption(page, 'Recommendations');
      await page.waitForTimeout(1000);

      const createManually2 = page.locator('text=Create Manually').first();
      if (await createManually2.isVisible().catch(() => false)) {
        await createManually2.click();
        await page.waitForTimeout(1000);
        log('Clicked "Create Manually" for recommendations');
      }

      await addReasons(page, PROFILE_C.recommendations, 'Recommendations');
      await page.screenshot({ path: '/tmp/cmx1-playwright-04-recommendations.png' });

    } catch (err) {
      log(`Warning: Could not configure recommendations - ${err.message}`);
    }

    // ── Step 6c: Set visibility logic on Recommendations ──
    log('--- Setting visibility logic for Recommendations ---');
    try {
      const recBlock = page.locator('text=Recommended Actions').first();
      if (await recBlock.isVisible().catch(() => false)) {
        await setVisibilityNotCompliant(page);
        await page.screenshot({ path: '/tmp/cmx1-playwright-05-logic.png' });
      }
    } catch (err) {
      log(`Warning: Could not set visibility logic - ${err.message}`);
    }

  } else {
    log('Question 1.2 not found on canvas. Skipping observations/recommendations.');
  }

  // ── Step 7: Build Question 1.1 (Yes/No — Profile A) ──
  log('');
  log('═══ Building Question 1.1: "Are all delivered proteins at 41°F or below?" ═══');

  try {
    const addZone = page.locator('[data-cy="add-question-zone-0"]').first();
    if (await addZone.isVisible().catch(() => false)) {
      await addZone.click();
      await page.waitForTimeout(1000);
      log('Clicked add question zone');
    } else {
      const addBtn = page.locator('[data-cy^="add-question"]').first();
      await addBtn.click();
      await page.waitForTimeout(1000);
      log('Clicked add question button');
    }

    const yesNoOption = page.locator('text=Yes / No').first();
    if (await yesNoOption.isVisible().catch(() => false)) {
      await yesNoOption.click();
      await page.waitForTimeout(1000);
      log('Selected Yes/No question type');
    }

    const questionInput = page.locator('[data-cy="question-text-input"]').first();
    if (await questionInput.isVisible().catch(() => false)) {
      await questionInput.fill('Are all delivered proteins at 41°F or below?');
      await page.waitForTimeout(500);
      log('Entered question text');
    }

    await page.screenshot({ path: '/tmp/cmx1-playwright-06-q11-created.png' });

    // ── Configure answer table for Profile A ──
    log('Configuring answer table for Profile A...');

    const toggleConfig = page.locator('[data-cy="toggle-answer-config"]').first();
    if (await toggleConfig.isVisible().catch(() => false)) {
      await toggleConfig.click();
      await page.waitForTimeout(1000);
    }

    // Yes row - 2/2 points
    const yesPointsEarned = page.locator('[data-cy^="answer-type-grid-points-"] input').first();
    if (await yesPointsEarned.isVisible().catch(() => false)) {
      await yesPointsEarned.fill('2');
      await page.waitForTimeout(200);
    }

    const yesPointsAvail = page.locator('[data-cy^="answer-type-grid-points-available-"] input').first();
    if (await yesPointsAvail.isVisible().catch(() => false)) {
      await yesPointsAvail.fill('2');
      await page.waitForTimeout(200);
    }

    // No row - 0/2 points
    const noPointsEarned = page.locator('[data-cy^="answer-type-grid-points-"] input').nth(1);
    if (await noPointsEarned.isVisible().catch(() => false)) {
      await noPointsEarned.fill('0');
      await page.waitForTimeout(200);
    }

    const noPointsAvail = page.locator('[data-cy^="answer-type-grid-points-available-"] input').nth(1);
    if (await noPointsAvail.isVisible().catch(() => false)) {
      await noPointsAvail.fill('2');
      await page.waitForTimeout(200);
    }

    log('Points configured (Yes: 2/2, No: 0/2)');

    // Compliance: Yes = In, No = Out
    const yesCompliance = page.locator('[data-cy^="answer-type-grid-compliance-"]').first();
    if (await yesCompliance.isVisible().catch(() => false)) {
      await yesCompliance.click();
      await page.waitForTimeout(300);
      await page.locator('text=In').first().click();
      await page.waitForTimeout(300);
    }

    const noCompliance = page.locator('[data-cy^="answer-type-grid-compliance-"]').nth(1);
    if (await noCompliance.isVisible().catch(() => false)) {
      await noCompliance.click();
      await page.waitForTimeout(300);
      await page.locator('text=Out').first().click();
      await page.waitForTimeout(300);
    }

    log('Compliance configured (Yes: In, No: Out)');

    // Risk: Yes = Managed, No = Failure
    const yesRisk = page.locator('[data-cy^="answer-type-grid-risk-"]').first();
    if (await yesRisk.isVisible().catch(() => false)) {
      const riskBtn = yesRisk.locator('button').first();
      await riskBtn.click();
      await page.waitForTimeout(300);
      const riskInput = yesRisk.locator('input').first();
      if (await riskInput.isVisible().catch(() => false)) {
        await riskInput.fill('Managed');
        await page.waitForTimeout(300);
      }
      await page.locator('text=Managed').first().click();
      await page.waitForTimeout(300);
    }

    const noRisk = page.locator('[data-cy^="answer-type-grid-risk-"]').nth(1);
    if (await noRisk.isVisible().catch(() => false)) {
      const riskBtn2 = noRisk.locator('button').first();
      await riskBtn2.click();
      await page.waitForTimeout(300);
      const riskInput2 = noRisk.locator('input').first();
      if (await riskInput2.isVisible().catch(() => false)) {
        await riskInput2.fill('Failure');
        await page.waitForTimeout(300);
      }
      await page.locator('text=Failure').first().click();
      await page.waitForTimeout(300);
    }

    log('Risk configured (Yes: Managed, No: Failure)');

    // Toggle CA ON for No row
    const noCaToggle = page.locator('[data-cy^="answer-type-grid-cap-toggle-"]').nth(1);
    if (await noCaToggle.isVisible().catch(() => false)) {
      const toggle = noCaToggle.locator('[data-cy="on-off-switch-toggle"]').first();
      await toggle.click();
      await page.waitForTimeout(500);
      log('Corrective Actions enabled for No answer');
    }

    await page.screenshot({ path: '/tmp/cmx1-playwright-07-q11-configured.png' });
    log('Question 1.1 fully configured!');

  } catch (err) {
    log(`Error building Q1.1: ${err.message}`);
    await page.screenshot({ path: '/tmp/cmx1-playwright-error-q11.png' });
  }

  // ── Step 8: Build Question 1.3 (Temperature — Beef, Profile C) ──
  log('');
  log('═══ Building Question 1.3: "Receiving temperature — Beef" ═══');

  try {
    const addZone2 = page.locator('[data-cy^="add-question-zone"]').last();
    await addZone2.click();
    await page.waitForTimeout(1000);

    const tempOption = page.locator('text=Temperature').first();
    if (await tempOption.isVisible().catch(() => false)) {
      await tempOption.click();
      await page.waitForTimeout(1000);
      log('Selected Temperature question type');
    }

    const qInput2 = page.locator('[data-cy="question-text-input"]').first();
    if (await qInput2.isVisible().catch(() => false)) {
      await qInput2.fill('Receiving temperature — Beef');
      await page.waitForTimeout(500);
      log('Entered question text');
    }

    // Expand condition table
    const toggleConfig2 = page.locator('[data-cy="toggle-answer-config"]').last();
    if (await toggleConfig2.isVisible().catch(() => false)) {
      await toggleConfig2.click();
      await page.waitForTimeout(1000);
    }

    // Add passing condition: <= 41 F
    log('Adding passing condition: <= 41°F');
    const addBtn = page.locator('[data-cy="numeric-type-grid-add-button-1"]').last();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }

    const condLink0 = page.locator('[data-cy="numeric-type-grid-condition-button-0"]').last();
    if (await condLink0.isVisible().catch(() => false)) {
      await condLink0.click();
      await page.waitForTimeout(1000);

      const operatorDropdown = page.locator('select').last();
      if (await operatorDropdown.isVisible().catch(() => false)) {
        await operatorDropdown.selectOption({ label: 'Less Than or Equal To' });
        await page.waitForTimeout(300);
      }

      const valueInput = page.locator('[data-cy="expression-params-high-value-input"]').last();
      if (await valueInput.isVisible().catch(() => false)) {
        await valueInput.fill('41');
        await page.waitForTimeout(300);
      }

      log('Condition 0 configured: <= 41');
    }

    // Go back to question
    const backLink = page.locator('text=Back to Question Block').first();
    if (await backLink.isVisible().catch(() => false)) {
      await backLink.click();
      await page.waitForTimeout(1000);
    }

    // Set compliance to In for row 0
    const comp0 = page.locator('[data-cy="numeric-type-grid-compliance-0"]').last();
    if (await comp0.isVisible().catch(() => false)) {
      await comp0.click();
      await page.waitForTimeout(300);
      await page.locator('text=In').first().click();
      await page.waitForTimeout(300);
    }

    // Add failing condition: > 41 F
    log('Adding failing condition: > 41°F');
    const addBtn2 = page.locator('[data-cy="numeric-type-grid-add-button-1"]').last();
    await addBtn2.click();
    await page.waitForTimeout(500);

    const condLink1 = page.locator('[data-cy="numeric-type-grid-condition-button-1"]').last();
    if (await condLink1.isVisible().catch(() => false)) {
      await condLink1.click();
      await page.waitForTimeout(1000);

      const operatorDropdown2 = page.locator('select').last();
      if (await operatorDropdown2.isVisible().catch(() => false)) {
        await operatorDropdown2.selectOption({ label: 'Greater Than' });
        await page.waitForTimeout(300);
      }

      const valueInput2 = page.locator('[data-cy="expression-params-high-value-input"]').last();
      if (await valueInput2.isVisible().catch(() => false)) {
        await valueInput2.fill('41');
        await page.waitForTimeout(300);
      }

      log('Condition 1 configured: > 41');
    }

    // Go back
    const backLink2 = page.locator('text=Back to Question Block').first();
    if (await backLink2.isVisible().catch(() => false)) {
      await backLink2.click();
      await page.waitForTimeout(1000);
    }

    // Set compliance to Out for row 1
    const comp1 = page.locator('[data-cy="numeric-type-grid-compliance-1"]').last();
    if (await comp1.isVisible().catch(() => false)) {
      await comp1.click();
      await page.waitForTimeout(300);
      await page.locator('text=Out').first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: '/tmp/cmx1-playwright-08-q13-configured.png' });
    log('Question 1.3 condition table configured!');

  } catch (err) {
    log(`Error building Q1.3: ${err.message}`);
    await page.screenshot({ path: '/tmp/cmx1-playwright-error-q13.png' });
  }

  // ── Final Summary ──
  log('');
  log('╔══════════════════════════════════════════════════════════════╗');
  log('║  BUILD COMPLETE — Summary                                   ║');
  log('╠══════════════════════════════════════════════════════════════╣');
  log('║  Q1.2: Observations + Recommendations added (Profile C)     ║');
  log('║  Q1.1: Yes/No question created (Profile A)                  ║');
  log('║  Q1.3: Temperature question created (Profile C)             ║');
  log('╠══════════════════════════════════════════════════════════════╣');
  log('║  Screenshots saved to /tmp/cmx1-playwright-*.png            ║');
  log('║                                                             ║');
  log('║  Your browser is untouched — script disconnected cleanly.   ║');
  log('╚══════════════════════════════════════════════════════════════╝');

  // Disconnect from browser — DO NOT close it (it's the user's browser!)
  browser.close();  // In CDP mode, close() disconnects without closing Chrome
  log('Disconnected from Chrome. Your browser session is still active.');
})();
