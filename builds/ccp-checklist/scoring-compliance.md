# CCP Checklist — Scoring, Compliance & Risk

> **Build spec for:** CCP Checklist
> **Depends on:** `form-layout.md` (questions must exist first)
> **Role:** Companion to `form-layout.md` — provides observations, recommendations, and visibility rules per profile

This file defines **reusable answer profiles** that group observation reasons, recommended actions, and visibility/requirement rules. The builder agent uses `form-layout.md` for all core answer table configuration (points, compliance, risk, CA) and references this file only for:
- **Observation dropdown values** per profile
- **Recommendation dropdown values** per profile
- **Visibility/requirement rules** for observations, recommendations, photos, and comments

---

## Standard Answer Profiles

Most questions in this form follow one of these standard profiles. Apply the matching profile to each question unless noted otherwise.

### Profile A: Standard Yes/No (Compliance Question)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **Yes** | 2 / 2 | In | Managed | OFF | — | — |
| **No** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Observations (when No):** non-compliant condition observed, documentation missing, procedure not followed, equipment malfunction
**Recommendations (when No):** correct immediately, retrain staff, replace equipment, update procedure

**Visibility/Requirement rules:**
- Observations: Always Visible, Required when Not Compliant
- Recommendations: Visible when Not Compliant, Required when Not Compliant
- Photos: Always Visible, Required when Not Compliant
- Comments: Default visible

**Applies to questions:** 1.1, 1.6, 1.7, 2A.7, 2A.8, 2B.2, 4.9, 5.6, 6.3, 7.1, 7.5, 7.7, 7.8

---

### Profile B: Inverted Yes/No (No = Good, Yes = Bad)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **No** | 2 / 2 | In | Managed | OFF | — | — |
| **Yes** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Observations (when Yes):** thawing observed, expired items found, cross-contamination risk
**Recommendations (when Yes):** discard items, re-freeze if safe, update rotation procedures

**Applies to questions:** 2B.3 (signs of thawing), 7.6 (past use-by date)

---

### Profile C: Cold Temperature (≤41°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≤41°F** | 2 / 2 | In | Managed | OFF | — | — |
| **>41°F** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Observations (when fail):** temperature above threshold, cooler door left open, equipment malfunction, overcrowded storage
**Recommendations (when fail):** move items to functioning unit, adjust thermostat, service equipment, reduce load

**Applies to questions:** 1.2, 1.3, 1.4, 1.5, 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6, 7.2, 7.3, 7.4

---

### Profile D: Freezer Temperature (≤0°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≤0°F** | 2 / 2 | In | Managed | OFF | — | — |
| **>0°F** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Observations (when fail):** temperature above threshold, freezer door left open, defrost cycle issue, equipment malfunction
**Recommendations (when fail):** check door seal, service equipment, relocate items to backup freezer

**Applies to questions:** 2B.1

---

### Profile E: Hot Holding Temperature (≥135°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≥135°F** | 2 / 2 | In | Managed | OFF | — | — |
| **<135°F** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Observations (when fail):** temperature below threshold, equipment not preheated, too much cold product added, steam table malfunction
**Recommendations (when fail):** reheat to 165°F and return to holding, discard if below 135°F for >4 hours, service equipment

**Applies to questions:** 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8

---

### Profile F: Cooking Temperature (varies by protein)

Each cooking temp question has a **different threshold** based on the protein:

| Question | Protein | Threshold | Pass Points | Fail Points |
|----------|---------|-----------|-------------|-------------|
| 3.1 | Chicken/Poultry | ≥165°F | 2 / 2 | 0 / 2 |
| 3.2 | Ground beef | ≥155°F | 2 / 2 | 0 / 2 |
| 3.3 | Whole cuts beef/pork | ≥145°F | 2 / 2 | 0 / 2 |
| 3.4 | Fish | ≥145°F | 2 / 2 | 0 / 2 |
| 3.5 | Eggs (immediate) | ≥145°F | 2 / 2 | 0 / 2 |

All cooking questions: Compliance In/Out, Risk Managed/Failure, CA ON 1 Business Day when fail.

**Observations (when fail):** undercooked, pulled too early, thermometer not calibrated, grill/oven temperature too low
**Recommendations (when fail):** continue cooking to safe temp, recalibrate thermometer, adjust equipment, retrain cook

---

### Profile G: Cooling Temperature (2-hour mark ≤70°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≤70°F** | 2 / 2 | In | Managed | OFF | — | — |
| **>70°F** | 0 / 2 | Out | Failure | ON | 0 | Immediate |

**Applies to questions:** 5.4

---

### Profile H: Cooling Temperature (6-hour mark ≤41°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≤41°F** | 2 / 2 | In | Managed | OFF | — | — |
| **>41°F** | 0 / 2 | Out | Failure | ON | 0 | Immediate |

**Applies to questions:** 5.5

---

### Profile I: Reheating Temperature (≥165°F)

| Answer | Points | Compliance | Risk | CA | CA Days | CA Type |
|--------|--------|-----------|------|-----|---------|---------|
| **≥165°F** | 2 / 2 | In | Managed | OFF | — | — |
| **<165°F** | 0 / 2 | Out | Failure | ON | 1 | Business Day(s) |

**Applies to questions:** 6.2

---

### Profile Z: Data-Only (No Scoring)

No points, no compliance, no risk, no corrective actions. These are informational questions.

**Applies to questions:** 1.8 (photo), 3.6 (photo), 5.1 (gate), 5.2 (text), 5.3 (datetime), 5.7 (photo), 6.1 (gate), 8.1 (text), 8.2 (signature)

---

## Question-to-Profile Mapping (Quick Reference)

| Question | Profile |
|----------|---------|
| 1.1, 1.6, 1.7 | A (Standard Yes/No) |
| 1.2, 1.3, 1.4, 1.5 | C (Cold ≤41°F) |
| 1.8 | Z (Data-only) |
| 2A.1, 2A.2, 2A.3, 2A.4, 2A.5, 2A.6 | C (Cold ≤41°F) |
| 2A.7, 2A.8 | A (Standard Yes/No) |
| 2B.1 | D (Freezer ≤0°F) |
| 2B.2 | A (Standard Yes/No) |
| 2B.3 | B (Inverted Yes/No) |
| 3.1 | F (Cooking ≥165°F) |
| 3.2 | F (Cooking ≥155°F) |
| 3.3, 3.4, 3.5 | F (Cooking ≥145°F) |
| 3.6 | Z (Data-only) |
| 4.1–4.8 | E (Hot ≥135°F) |
| 4.9 | A (Standard Yes/No) |
| 5.1 | Z (Data-only gate) |
| 5.2, 5.3 | Z (Data-only) |
| 5.4 | G (Cooling 2hr ≤70°F) |
| 5.5 | H (Cooling 6hr ≤41°F) |
| 5.6 | A (Standard Yes/No) |
| 5.7 | Z (Data-only) |
| 6.1 | Z (Data-only gate) |
| 6.2 | I (Reheat ≥165°F) |
| 6.3 | A (Standard Yes/No) |
| 7.1, 7.5, 7.7, 7.8 | A (Standard Yes/No) |
| 7.2, 7.3, 7.4 | C (Cold ≤41°F) |
| 7.6 | B (Inverted Yes/No) |
| 8.1 | Z (Data-only) |
| 8.2 | Z (Data-only) |

---

## Scoring Summary

| Section | Scored Questions | Max Points |
|---------|-----------------|------------|
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
