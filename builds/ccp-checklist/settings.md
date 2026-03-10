# CCP Checklist — Template Settings

> **Build spec for:** CCP Checklist
> **Status:** Ready to build
> **Target site:** *(ask user which CMX1 subdomain)*

This file contains all template-level configuration for the 2-step creation wizard (Setup → Access & Activation). Use these values when creating the template via the Activity Studio UI.

---

## Step 1: Setup

| Setting | Value |
|---------|-------|
| **Template Name** | CCP Checklist |
| **Description** | Critical Control Point monitoring for food safety compliance |
| **Template Color** | `#06b6d4` (default teal, or adjust to customer preference) |

### Evaluation Form

| Feature | Enabled |
|---------|---------|
| **Scoring** | ☑ Yes |
| **Compliance** | ☑ Yes |
| **Risk** | ☑ Yes |

### Toggles

| Toggle | Value |
|--------|-------|
| **Summary Report** | ON |
| **Form Review** | OFF |
| **Corrective Actions** | ON |
| **CA Review** | OFF |

---

## Step 2: Access & Activation

### Location Scope (Applies To)

| Setting | Value |
|---------|-------|
| **Scope** | Filtered — Restaurant locations in California only |
| **Filter** | Where Places is Saved Group → Place Type is Restaurant, State/Region is California |

> **Note:** Exact filter conditions depend on how the customer's location hierarchy is configured. May need to use Place Type + geography filters.

### User Access (Person Types)

| Setting | Value |
|---------|-------|
| **Person Types** | Location Manager (remove all others from default selection) |

### Activation

| Setting | Value |
|---------|-------|
| **On-Demand** | ON |
| **Automated Schedule** | ON |
| **Schedule Type** | Time-based |
| **Schedule** | Daily at 11:00 AM and 4:00 PM |

> **Note:** Schedule details are configured on the Schedule tab after template creation. The time-based mode is selected during template creation.

---

## Build Steps (Agent Orchestration)

> **Full orchestration details:** See `form-design-strategy.md` → Build Execution Strategy

### Step 1: Template Setup (Opus)
1. Navigate to Activity Templates list page
2. Click "+ New Activity Template"
3. Fill Step 1 (Setup) using values above
4. Click Next
5. Configure Step 2 (Access & Activation) using values above
6. Click "Create Template" → lands in Form Builder

### Step 2: Form Scaffolding (Opus)
1. Create all 8 sections + 2 subsections per `form-layout.md`
2. Build one example question per unique answer profile (A, B, C, D, E, F, G, H, I, Z = 10 questions)
3. Verify each pattern works via screenshot

### Step 3: Bulk Build (Haiku Sub-Agent)
1. Opus launches Haiku sub-agent with paths to all three build spec files
2. Sub-agent reads `form-layout.md` for remaining ~35 questions
3. Builds each question following the patterns Opus established, section by section
4. References `scoring-compliance.md` for observation/recommendation dropdown values

### Step 4: Visual Verification (Opus)
1. Screenshot each section in the completed form
2. Verify question counts, scoring config, and visibility rules against spec
3. Report results to user
