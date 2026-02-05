

# Startup Application Feature - Implementation Plan

Add a dedicated funnel for startups to apply for investment pools on VaultCapital. This includes a CTA section on the landing page and a complete multi-step application form.

---

## Overview

**What we're building:**
1. A CTA section at the bottom of the Landing Page encouraging startups to apply
2. A new `/apply` page with a multi-step form (no login required)
3. Application management in the Admin panel

**Key behaviors:**
- No authentication required to submit an application
- Form progress saved locally (draft mode)
- Applications visible and manageable only in Admin mode
- All data stored in localStorage

---

## Technical Implementation

### 1. New Types

Add to `src/types/index.ts`:

```text
StartupApplication type with:
- id (application_id like "VC-APP-000123")
- startup_name, website, country, industry, stage, founding_year, team_size
- founders[] (name, role, linkedin_url)
- pitch_summary, problem, solution, traction
- deck_url, demo_url, data_room_url
- fundraising_target_eur, offering_equity_percent, valuation_pre_money_eur
- use_of_funds[]
- contact_email (required)
- status: draft | submitted | under_review | shortlisted | rejected | accepted
- internal_notes[] (for admin)
- rejection_reason (when rejected)
- created_at, updated_at

ApplicationStatus type
InternalNote type (author, text, created_at)
```

### 2. Store Updates

Extend `src/store/appStore.ts`:

```text
New state:
- applications: StartupApplication[]

New actions:
- saveApplicationDraft(data) - saves partial application to localStorage
- submitApplication(data) - generates ID, sets status to "submitted"
- updateApplicationStatus(appId, status, reason?) - admin action
- addApplicationNote(appId, note) - admin internal notes
- getApplicationById(appId)
- getApplications() - for admin list view
```

### 3. Landing Page CTA Section

Add a new section before the footer in `src/pages/LandingPage.tsx`:

```text
Section design:
- Card/banner style with light orange accent border
- Icon: Rocket or Building2
- Title: "Are you a startup opening a round?"
- Subtitle: "Apply to collaborate with VaultCapital. If we're interested, we'll contact you to evaluate a potential offer and a Pool on our platform."

Three bullet points:
- "Submit your pitch and metrics"
- "Internal team evaluation"
- "If selected, we propose an offer and open a public Pool"

CTA Button: "Apply Now" -> routes to /apply
```

### 4. Application Page (`/apply`)

Create `src/pages/ApplyPage.tsx`:

**Layout:**
- Standalone page (uses AppLayout but accessible without login)
- Header with VaultCapital branding
- Progress stepper showing current step (1-6)
- "Save Draft" button in header
- Resume draft banner if draft exists

**Multi-step Form (6 steps):**

**Step 1: Basics**
- startup_name* (required)
- website
- country* (dropdown)
- industry* (dropdown: Fintech, B2B SaaS, AI/ML, E-commerce, HealthTech, CleanTech, Other)
- stage* (pre-seed/seed/series-a)
- founding_year
- team_size (number)
- contact_email* (required)

**Step 2: Team**
- Dynamic founder list (add/remove)
- Per founder: name*, role*, linkedin_url

**Step 3: Pitch**
- pitch_summary* (textarea, max 500 chars)
- problem* (what problem are you solving)
- solution* (your solution)
- traction (optional - current metrics, users, revenue)

**Step 4: Materials**
- deck_url* (required - pitch deck link)
- demo_url (optional - live product/demo)
- data_room_url (optional)

**Step 5: Fundraising**
- fundraising_target_eur* (how much raising)
- offering_equity_percent* (equity offered)
- valuation_pre_money_eur (optional)
- use_of_funds (dynamic list - e.g., "40% Product", "30% Marketing")

**Step 6: Review & Submit**
- Read-only summary of all entered data
- Confirmation checkbox: "I confirm this information is accurate"*
- "Submit Application" button

**Validation:**
- Required fields: startup_name, country, industry, stage, contact_email, pitch_summary, problem, solution, deck_url, fundraising_target_eur, offering_equity_percent
- Email format validation
- URL format validation for links
- At least one founder with name and role

**Submit behavior:**
- Generate application_id: `VC-APP-XXXXXX` (6 random digits)
- Set status: "submitted"
- Set created_at
- Save to store/localStorage
- Show success modal with:
  - "Application Received"
  - Application ID
  - "Next steps: Our team will review within 5-7 business days"
  - "Back to Home" button

**Draft handling:**
- "Save Draft" button saves current form state
- On page load, check for existing draft
- If draft exists, show banner: "You have a saved draft. Resume?" with Resume/Start Fresh options

### 5. Admin Panel Updates

Extend `src/pages/AdminPage.tsx`:

**Add "Applications" tab** using Tabs component:
- Tab 1: Pool Management (existing)
- Tab 2: Applications (new)
- Tab 3: Reset Demo (existing)

**Applications Tab:**

**List View:**
- Filter by status (All, Submitted, Under Review, Shortlisted, Rejected, Accepted)
- Search by startup_name
- Table columns: Application ID, Startup Name, Industry, Stage, Target Amount, Status, Date
- Click row to open detail view

**Detail View (dialog/sheet):**
- All submitted data in organized sections:
  - Basics (name, website, country, industry, stage, team size)
  - Team (founders list with LinkedIn links)
  - Pitch (summary, problem, solution, traction)
  - Materials (links as clickable)
  - Fundraising (target, equity, valuation, use of funds)
  - Contact: contact_email prominently displayed

- Status change buttons:
  - "Mark Under Review"
  - "Shortlist"
  - "Accept"
  - "Reject" (opens dialog for rejection reason)

- Internal Notes section:
  - Display existing notes (author, date, text)
  - Textarea + "Add Note" button

### 6. Routing

Update `src/App.tsx`:
- Add route: `/apply` -> `ApplyPage`
- This page should be accessible without authentication

### 7. Component Files

New files to create:
- `src/pages/ApplyPage.tsx` - main application page
- `src/components/apply/ApplicationForm.tsx` - form wrapper with step logic
- `src/components/apply/FormStepBasics.tsx` - step 1
- `src/components/apply/FormStepTeam.tsx` - step 2
- `src/components/apply/FormStepPitch.tsx` - step 3
- `src/components/apply/FormStepMaterials.tsx` - step 4
- `src/components/apply/FormStepFundraising.tsx` - step 5
- `src/components/apply/FormStepReview.tsx` - step 6
- `src/components/apply/ApplicationSuccess.tsx` - success modal content
- `src/components/apply/index.ts` - exports
- `src/components/admin/ApplicationsList.tsx` - admin list view
- `src/components/admin/ApplicationDetail.tsx` - admin detail view

---

## Files to Modify

1. **src/types/index.ts** - Add new types
2. **src/store/appStore.ts** - Add applications state and actions
3. **src/pages/LandingPage.tsx** - Add startup CTA section
4. **src/pages/AdminPage.tsx** - Add Applications tab
5. **src/App.tsx** - Add /apply route

## Files to Create

1. **src/pages/ApplyPage.tsx** - Main application page
2. **src/components/apply/** - All form step components (8 files)
3. **src/components/admin/** - Application management components (2 files)

---

## User Flow

```text
Landing Page
     |
     v
[Apply Now Button]
     |
     v
/apply (Step 1: Basics)
     |
     v
Step 2: Team -> Step 3: Pitch -> Step 4: Materials -> Step 5: Fundraising
     |
     v
Step 6: Review & Submit
     |
     v
Success Modal (ID: VC-APP-000123)
     |
     v
Back to Home
```

**Admin Flow:**
```text
/admin -> Applications Tab -> View List -> Click Application -> Detail View -> Change Status / Add Notes
```

---

## Demo Data

Add 1-2 sample applications in different statuses for testing:
- One "submitted" application from a mock startup
- One "under_review" application with internal notes

