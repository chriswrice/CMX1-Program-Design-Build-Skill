# CCP Checklist — Form Layout & Questions

> **Build spec for:** CCP Checklist
> **Depends on:** `settings.md` (template must be created first)
> **Companion:** `scoring-compliance.md` (observations, recommendations, visibility rules per profile)

This file defines every section, subsection, and question with **inline scoring, compliance, risk, and corrective action configuration**. Each question row contains everything the builder agent needs to configure the answer table without cross-referencing.

---

## Column Legend

| Column | Meaning |
|--------|---------|
| **#** | Question number (section.question) |
| **Question** | Question text as shown to the end-user |
| **Type** | Question type in the form builder (Yes/No, Temp, Photo, Text, DateTime, Signature) |
| **Pass** | Pass answer → Earned/Available points, Compliance status, Risk level |
| **Fail** | Fail answer → Earned/Available points, Compliance status, Risk level |
| **CA** | Corrective Action config on fail: days + type (BD = Business Day, Immed = Immediate) |
| **Profile** | Letter reference to `scoring-compliance.md` for observations, recommendations, visibility rules |

**Notation:** `2/2` = 2 earned out of 2 available points. `In` = Compliant. `Out` = Not Compliant. `Managed` = low risk. `Failure` = high risk.

---

## Section 1: Receiving

**Instructions:** Verify incoming deliveries meet food safety standards
**Scored questions:** 7 | **Max points:** 14

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 1.1 | Are all delivered proteins at 41°F or below? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 1.2 | Receiving temperature — Chicken | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 1.3 | Receiving temperature — Beef | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 1.4 | Receiving temperature — Fish/Seafood | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 1.5 | Receiving temperature — Dairy (milk, cheese, cream) | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 1.6 | Is supplier documentation present and verified? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 1.7 | Are all items properly labeled with use-by dates? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 1.8 | Photo of delivery log | Photo | — | — | — | Z |

---

## Section 2: Cold Storage

**Instructions:** Walk-in cooler & freezer temperature monitoring

### Subsection 2A: Walk-In Cooler

**Scored questions:** 8 | **Max points:** 16

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 2A.1 | Walk-in cooler ambient temperature | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.2 | Raw chicken temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.3 | Raw beef temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.4 | Raw fish/seafood temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.5 | Deli meats temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.6 | Dairy products temp (milk, cream, yogurt) | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 2A.7 | Are all items properly stored (raw below ready-to-eat)? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 2A.8 | Are all items date-labeled? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |

### Subsection 2B: Freezer

**Scored questions:** 3 | **Max points:** 6

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 2B.1 | Freezer ambient temperature | Temp | ≤0°F → 2/2, In, Managed | >0°F → 0/2, Out, Failure | 1 BD | D |
| 2B.2 | Are all items properly sealed and labeled? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 2B.3 | Any signs of thawing/refreezing? | Yes/No | **No** → 2/2, In, Managed | **Yes** → 0/2, Out, Failure | 1 BD | B |

> **Note:** Question 2B.3 is **inverted** — "No" is the passing answer (no signs of thawing = good).

---

## Section 3: Cooking Temperatures

**Instructions:** Verify proteins reach safe internal cooking temps
**Scored questions:** 5 | **Max points:** 10

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 3.1 | Chicken/Poultry internal temp | Temp | ≥165°F → 2/2, In, Managed | <165°F → 0/2, Out, Failure | 1 BD | F |
| 3.2 | Ground beef internal temp | Temp | ≥155°F → 2/2, In, Managed | <155°F → 0/2, Out, Failure | 1 BD | F |
| 3.3 | Whole cuts beef/pork internal temp | Temp | ≥145°F → 2/2, In, Managed | <145°F → 0/2, Out, Failure | 1 BD | F |
| 3.4 | Fish internal temp | Temp | ≥145°F → 2/2, In, Managed | <145°F → 0/2, Out, Failure | 1 BD | F |
| 3.5 | Eggs (immediate service) internal temp | Temp | ≥145°F → 2/2, In, Managed | <145°F → 0/2, Out, Failure | 1 BD | F |
| 3.6 | Photo of cooking log | Photo | — | — | — | Z |

> **Note:** Each cooking question has a different temperature threshold based on the protein type.

---

## Section 4: Hot Holding

**Instructions:** Verify food on the line maintains safe holding temps
**Scored questions:** 9 | **Max points:** 18

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 4.1 | Grilled chicken holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.2 | Ground beef holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.3 | Rice holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.4 | Beans holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.5 | Soup holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.6 | Gravy/sauce holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.7 | Fried items holding temp (chicken, fries) | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.8 | Mac & cheese holding temp | Temp | ≥135°F → 2/2, In, Managed | <135°F → 0/2, Out, Failure | 1 BD | E |
| 4.9 | Is holding equipment functioning properly? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |

---

## Section 5: Cooling

**Instructions:** Verify food is cooled safely within required timeframes
**Scored questions:** 3 | **Max points:** 6

| # | Question | Type | Pass | Fail | CA | Profile | Visibility |
|---|----------|------|------|------|-----|---------|------------|
| 5.1 | Is any food currently in the cooling process? | Yes/No | — | — | — | Z | Always visible (gate question) |
| 5.2 | Item being cooled (describe) | Text | — | — | — | Z | Visible when 5.1 = Yes |
| 5.3 | Time cooling started | DateTime | — | — | — | Z | Visible when 5.1 = Yes |
| 5.4 | Temp at 2-hour mark | Temp | ≤70°F → 2/2, In, Managed | >70°F → 0/2, Out, Failure | **Immed** | G | Visible when 5.1 = Yes |
| 5.5 | Temp at 6-hour mark (total) | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | **Immed** | H | Visible when 5.1 = Yes |
| 5.6 | Was the 135°F → 70°F → 41°F cooling process followed? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A | Visible when 5.1 = Yes |
| 5.7 | Photo of cooling log | Photo | — | — | — | Z | Visible when 5.1 = Yes |

> **Critical:** Questions 5.4 and 5.5 use **Immediate** corrective actions (0 days) — cooling failures are time-sensitive food safety hazards.

---

## Section 6: Reheating

**Instructions:** Verify reheated items reach safe temperatures
**Scored questions:** 2 | **Max points:** 4

| # | Question | Type | Pass | Fail | CA | Profile | Visibility |
|---|----------|------|------|------|-----|---------|------------|
| 6.1 | Are any items being reheated today? | Yes/No | — | — | — | Z | Always visible (gate question) |
| 6.2 | Reheated item internal temp | Temp | ≥165°F → 2/2, In, Managed | <165°F → 0/2, Out, Failure | 1 BD | I | Visible when 6.1 = Yes |
| 6.3 | Was the item reheated within 2 hours? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A | Visible when 6.1 = Yes |

---

## Section 7: Sensitive Produce & Date Marking

**Instructions:** Leafy greens, cut fruit/veg handling, allergen controls, and date tracking
**Scored questions:** 7 | **Max points:** 14

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 7.1 | Have all leafy greens been properly washed? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 7.2 | Cut lettuce/salad mix holding temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 7.3 | Cut fruit holding temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 7.4 | Sliced tomatoes holding temp | Temp | ≤41°F → 2/2, In, Managed | >41°F → 0/2, Out, Failure | 1 BD | C |
| 7.5 | Are all prepped produce items date-marked? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 7.6 | Are any items past their use-by date? | Yes/No | **No** → 2/2, In, Managed | **Yes** → 0/2, Out, Failure | 1 BD | B |
| 7.7 | Are allergen cross-contact controls in place? (separate cutting boards, utensils) | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |
| 7.8 | Are allergen items (nuts, shellfish, gluten) properly labeled and separated? | Yes/No | Yes → 2/2, In, Managed | No → 0/2, Out, Failure | 1 BD | A |

> **Note:** Question 7.6 is **inverted** — "No" is the passing answer (no items past use-by = good).

---

## Section 8: Manager Verification

**Instructions:** Sign-off and overall assessment
**Scored questions:** 0 | **Max points:** 0

| # | Question | Type | Pass | Fail | CA | Profile |
|---|----------|------|------|------|-----|---------|
| 8.1 | Overall comments or notes | Text | — | — | — | Z |
| 8.2 | Manager signature | Signature | — | — | — | Z |

> **Note:** 8.2 (Manager signature) should be marked as **Required**.

---

## Scoring Summary

| Section | Scored Qs | Max Points |
|---------|-----------|------------|
| 1. Receiving | 7 | 14 |
| 2A. Walk-In Cooler | 8 | 16 |
| 2B. Freezer | 3 | 6 |
| 3. Cooking Temperatures | 5 | 10 |
| 4. Hot Holding | 9 | 18 |
| 5. Cooling | 3 | 6 |
| 6. Reheating | 2 | 4 |
| 7. Sensitive Produce | 7 | 14 |
| 8. Manager Verification | 0 | 0 |
| **TOTAL** | **44** | **88** |

---

## Visibility Rules

| Gate Question | Controls Visibility Of |
|--------------|----------------------|
| 5.1 "Is any food currently in the cooling process?" = Yes | 5.2, 5.3, 5.4, 5.5, 5.6, 5.7 |
| 6.1 "Are any items being reheated today?" = Yes | 6.2, 6.3 |

---

## Builder Agent Quick Reference

**For every scored question, the builder agent must configure:**
1. **Answer options** — based on question type (Yes/No buttons, temperature threshold)
2. **Points** — earned/available per answer (pass = 2/2, fail = 0/2)
3. **Compliance** — In or Out per answer
4. **Risk level** — Managed (pass) or Failure (fail)
5. **Corrective Action toggle** — ON for fail answers, OFF for pass answers
6. **CA timeframe** — days + type (1 Business Day for most, Immediate for cooling failures)
7. **Observations** — see Profile in `scoring-compliance.md` for observation reasons per profile
8. **Recommendations** — see Profile in `scoring-compliance.md` for recommended actions per profile
9. **Visibility/requirement rules** — observations, recommendations, photos visibility per profile

**Inverted questions** (2B.3, 7.6): The pass/fail answers are swapped — "No" = good, "Yes" = bad.

**Data-only questions** (Profile Z): No answer table configuration needed — just create the question with its type.
