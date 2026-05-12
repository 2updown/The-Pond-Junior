# HQ Admin — Design & Implementation Specification

**Product:** HCIS multi-branch academy platform · HQ (Headquarters) admin surface
**Scope of this document:** HQ admin only. Branch admin / parent / student modes are out of scope.
**Design system source of truth:** `tailwind.config.ts`, `app/globals.css`, `components/ui/*` in this repository.

> The HQ admin is a control plane, not an editor. HQ owns *capability* (who can do what, on what plan, with what limits). Branch admins own *content*. Every screen below is designed around that boundary.

---

## 1. Information Architecture

The IA is organised as a four-section sidebar. Each section has a fixed slug and is collapsible. The sidebar is the primary nav for desktop; on tablet (<1280 px) it collapses to icons.

```
HQ Admin
│
├── Dashboard                          /hq
│
├── Branch Management                  /hq/branches
│   ├── Branch List                    /hq/branches
│   ├── Branch Detail                  /hq/branches/:id
│   └── User Permissions               /hq/branches/:id/permissions
│
├── Brand Site Management              /hq/brand-site
│   ├── Brand Site Status              /hq/brand-site/status
│   ├── Template Management            /hq/brand-site/templates
│   ├── Domain Settings                /hq/brand-site/domains
│   ├── Publishing Permissions         /hq/brand-site/publishing
│   └── Storage Usage                  /hq/brand-site/storage
│
├── Subscription & Billing             /hq/billing
│   ├── Plan Management                /hq/billing/plans
│   ├── Feature Access                 /hq/billing/features
│   └── Payment Status                 /hq/billing/payments
│
└── System Settings                    /hq/settings
    ├── Global Settings                /hq/settings/global
    ├── Notification Settings          /hq/settings/notifications
    └── Template Defaults              /hq/settings/template-defaults
```

**IA principles**

- HQ never opens a branch's CMS editor. Any "go to site" action is a *read-only preview* or a deep-link to the branch admin signed-in as the branch owner.
- Cross-branch operations (assign template to N branches, change plan for N branches) are exposed at the *list* level, not buried inside detail pages.
- `Brand Site Management` is a *platform-level* configuration scope. `Branch Detail → Brand Site Status` is the *per-branch* view of the same data.

---

## 2. User Flows

### Flow A — Onboard a new branch onto Brand Site
```
Dashboard
  └── card "Pending brand-site activations" (3)
        └── Branch List (filtered: brand_site_enabled = false, plan ≠ free)
              └── Branch Detail
                    ├── toggle "Brand Site Enabled" → ON
                    ├── modal: select template + assign editors
                    └── confirm → row updates, toast "Activated"
```

### Flow B — Force-suspend a branch's site (compliance / non-payment)
```
Branch List
  └── row · kebab → "Suspend Site"
        └── modal (destructive) "Type SUSPEND to confirm"
              └── confirm → publishing_status = suspended, banner appears on branch
```

### Flow C — Bulk template rollout
```
Brand Site Management → Template Management
  └── pick template card → "Assign to branches"
        └── multi-select branches (with current-plan filter)
              └── modal "Replace existing template?" (Y/N per branch)
                    └── job runs async → toast "12 of 12 branches updated"
```

### Flow D — Quota top-up
```
Branch Detail → Storage Usage tile (over 90%)
  └── inline "Increase quota"
        └── modal: pick add-on (+5 GB / +20 GB) → bill to branch
              └── plan_addons updated, toast
```

### Flow E — Approve a publish request
```
Brand Site Management → Publishing Permissions → "Approval queue" tab
  └── 4 pending items
        └── click row → side-sheet preview (template render)
              └── Approve / Request changes / Reject
```

---

## 3. Wireframe Structure

Every HQ page follows the same shell:

```
┌──────────────────────────────────────────────────────────────┐
│ TopBar (h-14)  ·  search · env switcher · admin menu        │
├──────────┬───────────────────────────────────────────────────┤
│          │ PageHeader                                        │
│ Sidebar  │   ├ breadcrumb                                    │
│ (w-64)   │   ├ h1 + subtitle                                 │
│          │   └ primary action(s) right-aligned               │
│          │                                                   │
│          │ FilterBar  (search · facets · view toggle)       │
│          │                                                   │
│          │ Content                                           │
│          │   ├ stat row (1×4 cards)        ← optional       │
│          │   ├ tabs                         ← optional       │
│          │   └ data surface (table | grid | form)           │
│          │                                                   │
│          │ Pagination / footer                              │
└──────────┴───────────────────────────────────────────────────┘
```

**Per-page wireframes**

### 3.1 Dashboard
- Row 1: 4× `StatCard` — Total branches · Active brand sites · Pending approvals · Storage used (platform).
- Row 2 (2 cols 2/3 + 1/3):
  - **Activity feed** (publish events, plan changes, suspensions) — last 20.
  - **Health panel** — domain SSL expiring, storage > 90%, payment failed.
- Row 3 (2 cols 1/2 + 1/2):
  - **Plan distribution** — donut by plan tier with branch counts.
  - **Top branches by traffic** — mini bar list, last 30 days.

### 3.2 Branch List
- FilterBar: search by name/domain, facet `Plan`, facet `Brand Site` (on/off/suspended), facet `Publishing`, sort by `Last Updated`.
- Tabs: `All` · `Active` · `Suspended` · `Pending activation`.
- Bulk-actions tray (sticky, appears when ≥1 row selected): `Change Plan` · `Assign Template` · `Toggle Brand Site` · `Export CSV`.
- Table columns (see §6).
- Pagination: 25 / 50 / 100 page-size; total count left, controls right.

### 3.3 Branch Detail
Header: branch logo + name + status pills · breadcrumb back to list · split button "View site / Open admin (read-only)".

Two-column grid below header:
- **Left col (2/3):** sticky tab-bar `Overview · Brand Site · Plan · Usage · Permissions · Activity`.
- **Right col (1/3):** "Quick actions" card (Change plan, Assign template, Suspend site, Reset domain, Resend invite) + "Branch manager" mini-profile card.

Tab content per §1 Branch Detail spec.

### 3.4 Brand Site Status (HQ-level monitoring)
- Filter: state, plan, last publish date.
- Table: branch · enabled · template · domain · ssl · last publish · status badge · actions.
- Side-sheet on row click → live preview iframe + recent publish log.

---

## 4. Component Structure

All HQ components extend or compose existing `components/ui/*`. New HQ-only components live in `components/hq/*`.

```
components/
├── ui/                       (existing, untouched)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── table.tsx
│   ├── empty-state.tsx
│   └── …
├── layout/
│   ├── hq-shell.tsx          (TopBar + Sidebar + content slot)
│   ├── hq-sidebar.tsx
│   ├── hq-topbar.tsx
│   └── page-header.tsx
└── hq/
    ├── stat-row.tsx
    ├── filter-bar.tsx
    ├── data-table.tsx              (generic, column-driven)
    ├── bulk-action-tray.tsx
    ├── status-badge.tsx            (typed wrapper around Badge)
    ├── plan-pill.tsx
    ├── storage-meter.tsx           (progress bar + threshold colour)
    ├── domain-cell.tsx             (host + ssl chip)
    ├── confirmation-modal.tsx      (uses Radix Dialog)
    ├── side-sheet.tsx              (right-aligned Dialog)
    ├── kebab-menu.tsx              (Radix DropdownMenu)
    ├── activity-feed.tsx
    ├── plan-distribution-chart.tsx (recharts)
    └── empty-states/
        ├── no-branches.tsx
        ├── no-pending-approvals.tsx
        └── no-templates.tsx
```

**Conventions**

- Every list view consumes `<DataTable columns={…} rows={…} />`. Columns own their cell renderer; this keeps row markup uniform across HQ.
- Modals are *always* opened via a `useDisclosure()` hook returning `{ open, onOpen, onClose }`; no ad-hoc `useState` boolean toggles in pages.
- Status visuals are *only* expressed via `<StatusBadge kind={...} />`. Never hand-roll coloured pills.

---

## 5. Desktop-Responsive Layout

Desktop-first; the platform is intended for office use.

| Breakpoint | Behaviour                                                                 |
|------------|---------------------------------------------------------------------------|
| `≥1440px`  | Full shell: sidebar 256 px, content max-width 1280, 24 px gutter.         |
| `1280–1439`| Sidebar 224 px, content fluid, gutter 24 px.                              |
| `1024–1279`| Sidebar collapses to **icon rail** (64 px) with hover-flyout labels.      |
| `768–1023` | Tablet: shell hidden behind a hamburger; tables become 2-column cards.    |
| `<768`     | Not officially supported; renders mobile fallback "Open on desktop".      |

Grid system: 12-col Tailwind. Standard widths:
- Stat row card: `col-span-12 md:col-span-6 xl:col-span-3`.
- Branch detail main/aside: `xl:grid-cols-3` with main `col-span-2`.

Spacing scale follows DS: 4 / 8 / 12 / 16 / 24 / 32 / 48 px (Tailwind 1/2/3/4/6/8/12). No arbitrary values.

---

## 6. Table Layout Specs

Branch List canonical spec (other tables inherit pattern):

| Column            | Width          | Cell render                                    | Sortable |
|-------------------|----------------|------------------------------------------------|----------|
| ☐ select          | 40 px fixed    | Checkbox                                       | —        |
| Branch Name       | min 240 px     | Logo (32×32, rounded-md) + name + city subline | ✔        |
| Brand Site        | 96 px          | `<Switch />` + state label                     | ✔        |
| Current Plan      | 120 px         | `<PlanPill tier="pro" />`                      | ✔        |
| Publishing        | 120 px         | `<StatusBadge kind="published" \| …/>`        | ✔        |
| Domain            | 200 px         | host text + SSL chip + external-link icon      | —        |
| Storage           | 160 px         | `<StorageMeter used=… max=… />`                | ✔        |
| Last Updated      | 140 px         | relative time, full datetime on hover          | ✔ (def.) |
| Actions           | 56 px fixed    | `<KebabMenu items={…} />`                      | —        |

Header: `h-11`, label uppercase tracking-wide text-xs muted-foreground (matches existing `<TableHead />`).
Row: `h-16`, hover `bg-muted/40`, selected `bg-primary/5 ring-1 ring-primary/20`.
Empty body: collapse to `<EmptyState />` with action.
Skeleton state: 5 grey rows of correct height.
Sticky: header + first column sticky on `<1280px`.

Bulk-action tray markup:
```
fixed bottom-6 left-1/2 -translate-x-1/2
flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-lg
```

---

## 7. Modal UX

Three modal types in HQ. All built on Radix Dialog and styled with DS tokens.

### 7.1 Confirmation modal (default)
- Width: 480 px.
- Slots: icon (optional, 40 px tinted tile) · title · body · footer right-aligned (Cancel + primary).
- Used for: change plan, assign template, toggle brand site.

### 7.2 Destructive modal
- Same chrome but icon tile is `bg-destructive/10 text-destructive`.
- Requires user to type a confirmation phrase (e.g., `SUSPEND`) before primary becomes enabled.
- Used for: suspend site, delete domain, revoke publishing.

### 7.3 Form modal / Side sheet
- 560 px modal **or** 480 px right-anchored side sheet for read-heavy contexts (e.g., approval queue review).
- Side sheet uses `<aside class="fixed inset-y-0 right-0 w-[480px] border-l bg-background shadow-xl">`.
- Always two columns of footer: secondary action left (e.g., "Save as draft"), primary actions right.

**Cross-cutting modal rules**

- Esc closes; clicking outside closes a confirmation modal but **not** a destructive one.
- Focus trapped, returns to trigger on close (Radix default).
- Stack at most 1 modal — secondary flows promote to a fresh page.
- All modal copy lives in a `messages/hq.ts` file; never inlined.

---

## 8. Empty States

Pattern: dashed-border card, muted icon tile (12×12, rounded-full), title, optional description, primary CTA. Reuses `components/ui/empty-state.tsx`.

| Surface                     | Title                              | Body                                                              | CTA                          |
|-----------------------------|------------------------------------|-------------------------------------------------------------------|------------------------------|
| Branch list (zero branches) | "No branches yet"                  | "Add your first branch to start managing the platform."           | "Add branch"                 |
| Branch list (filtered = 0)  | "No branches match these filters"  | "Try clearing filters or broadening your search."                 | "Clear filters"              |
| Templates page (empty)      | "No templates available"           | "Upload a template archive or import from the marketplace."       | "Upload template"            |
| Approval queue (empty)      | "All caught up"                    | "No publish requests waiting on HQ review."                       | (none — passive state)       |
| Domain list (empty)         | "No custom domains connected"      | "Branches on Pro plans can connect their own domain."             | "Open domain guide"          |
| Activity feed (empty)       | "Nothing to report"                | "Platform-wide activity will appear here."                        | (none)                       |
| Search no-result            | "No results for `%s`"              | "Check spelling or try a different keyword."                      | "Reset search"               |
| Error fallback              | "Something went wrong"             | "Refresh, or contact platform-ops if the issue persists."         | "Retry"                      |

Loading states use a 3-row table skeleton or 4-card stat skeleton. Never spinners over a static layout.

---

## 9. Status Badge System

Single typed component `<StatusBadge kind="…" />` mapping to existing `Badge` variants:

| `kind`              | Badge variant | Label             | Used for                                  |
|---------------------|---------------|-------------------|-------------------------------------------|
| `published`         | `success`     | Published         | publishing_status                         |
| `draft`             | `muted`       | Draft             | publishing_status                         |
| `under_review`      | `info`        | Under review      | publishing_status (HQ approval)           |
| `changes_requested` | `warning`     | Changes requested | publishing_status                         |
| `scheduled`         | `violet`      | Scheduled         | publishing_status                         |
| `suspended`         | `destructive` | Suspended         | publishing_status, brand_site_enabled     |
| `enabled`           | `success`     | Enabled           | brand_site_enabled = true                 |
| `disabled`          | `muted`       | Disabled          | brand_site_enabled = false                |
| `domain_active`     | `success`     | SSL active        | domain.ssl                                |
| `domain_pending`    | `warning`     | DNS pending       | domain.ssl                                |
| `domain_failed`     | `destructive` | DNS failed        | domain.ssl                                |
| `payment_paid`      | `success`     | Paid              | invoice.status                            |
| `payment_due`       | `warning`     | Due               | invoice.status                            |
| `payment_failed`    | `destructive` | Failed            | invoice.status                            |
| `quota_ok`          | `muted`       | OK                | storage band 0-69%                        |
| `quota_warn`        | `warning`     | Near limit        | storage band 70-89%                       |
| `quota_critical`    | `destructive` | Over limit        | storage band ≥ 90%                        |
| `plan_free`         | `muted`       | Free              | plan tier                                 |
| `plan_pro`          | `info`        | Pro               | plan tier                                 |
| `plan_business`     | `violet`      | Business          | plan tier                                 |
| `plan_enterprise`   | `default`     | Enterprise        | plan tier                                 |

The HQ admin only ever uses **eight** semantic colours (the existing badge variants) — no new hues are introduced.

---

## 10. Design System Mapping

Every HQ surface must map back to an existing token / component. New code is forbidden where reuse exists.

| HQ need                  | Token / component used                                                  |
|--------------------------|-------------------------------------------------------------------------|
| Page background          | `bg-background`                                                         |
| Card surface             | `<Card />` → `rounded-lg border bg-card shadow-sm`                      |
| Section title            | `<CardTitle />` typography                                              |
| Helper / supporting copy | `text-sm text-muted-foreground`                                         |
| Primary action           | `<Button variant="default" />`                                          |
| Secondary action         | `<Button variant="outline" />`                                          |
| Destructive              | `<Button variant="destructive" />`                                      |
| Pills / status           | `<Badge />` 10 existing variants only                                   |
| Tabular data             | `<Table />` family                                                      |
| Form fields              | `<Input />` `<Select />` `<Textarea />` `<Label />`                     |
| Empty state              | `<EmptyState />`                                                        |
| Toast confirmation       | `<Toast />`                                                             |
| Loading                  | `<Loading />`                                                           |
| Error fallback           | `<ErrorState />`                                                        |
| Section divider          | `<Separator />`                                                         |
| Stat tile                | `<StatCard />` (extend existing teacher one — promote to `components/ui` if used in 2+ surfaces) |
| Spacing                  | Tailwind 1/2/3/4/6/8/12 only                                            |
| Radius                   | `var(--radius)` (md/lg) only                                            |
| Icons                    | `lucide-react`                                                          |
| Typography               | inherits global; sizes from `text-xs`, `text-sm`, `text-base`, `text-2xl` |

**Forbidden**

- Inline hex colours.
- New radius / shadow scales.
- Colours outside existing badge variants for status visuals.
- Custom dropdown / dialog implementations (must be Radix).

---

## 11. Recommended Backend Data Structure

The HQ admin is the read-write client for these resources. Multi-tenant via `branch_id`. All timestamps ISO-8601 UTC; storage in bytes.

### `branches`
```ts
type Branch = {
  id: string;
  name: string;
  slug: string;                       // unique
  logo_url: string | null;
  address: { line1: string; city: string; region: string; country: string; postal_code: string };
  contact: { email: string; phone: string };
  manager_user_id: string;
  status: "active" | "inactive" | "archived";
  brand_site: { enabled: boolean; suspended_at: string | null; suspension_reason: string | null };
  plan_id: string;                    // FK plans
  created_at: string;
  updated_at: string;
};
```

### `plans`
```ts
type Plan = {
  id: string;
  tier: "free" | "pro" | "business" | "enterprise";
  name: string;
  monthly_price: number;              // in minor currency units
  storage_quota_bytes: number;
  feature_flags: string[];            // e.g. ["custom_domain","draft_review","analytics"]
  max_editors: number;
  active: boolean;
};
```

### `brand_sites` (per-branch site state)
```ts
type BrandSite = {
  branch_id: string;                  // PK == branch_id
  template_id: string | null;
  domain_id: string | null;
  publishing_status:
    | "draft" | "under_review" | "changes_requested"
    | "scheduled" | "published" | "suspended";
  publish_required_approval: boolean;
  draft_only_mode: boolean;
  last_published_at: string | null;
  last_publisher_user_id: string | null;
};
```

### `templates`
```ts
type Template = {
  id: string;
  name: string;
  category: "academy" | "language" | "kids" | "general";
  preview_image_url: string;
  thumbnail_url: string;
  is_default: boolean;                // platform default
  available_for_plans: string[];      // plan ids
  archived: boolean;
};
```

### `domains`
```ts
type Domain = {
  id: string;
  branch_id: string;
  hostname: string;
  ssl_status: "active" | "pending" | "failed";
  ssl_expires_at: string | null;
  dns_records: { type: "A" | "CNAME"; host: string; value: string; verified: boolean }[];
  connected_at: string;
};
```

### `storage_quota`
```ts
type StorageQuota = {
  branch_id: string;
  used_bytes: number;
  quota_bytes: number;                // overrides plan default if set
  max_upload_bytes: number;
  computed_at: string;                // refresh ≤ 5 min
};
```

### `permissions`
```ts
type BrandSitePermission = {
  branch_id: string;
  user_id: string;
  role: "owner" | "editor" | "viewer";
  can_publish: boolean;
  granted_by_hq: boolean;             // HQ-imposed gate
};
```

### `publishing_requests` (approval queue)
```ts
type PublishingRequest = {
  id: string;
  branch_id: string;
  requested_by_user_id: string;
  draft_revision_id: string;
  status: "pending" | "approved" | "changes_requested" | "rejected";
  hq_reviewer_user_id: string | null;
  hq_note: string | null;
  created_at: string;
  decided_at: string | null;
};
```

### `audit_log`
```ts
type AuditEvent = {
  id: string;
  actor_user_id: string;
  actor_role: "hq_admin" | "branch_admin" | "system";
  action: string;                     // e.g. "brand_site.suspend"
  resource: { type: string; id: string };
  metadata: Record<string, unknown>;
  created_at: string;
};
```

### `invoices` / `payments`
```ts
type Invoice = {
  id: string;
  branch_id: string;
  plan_id: string;
  period_start: string;
  period_end: string;
  amount_due: number;
  status: "paid" | "due" | "failed" | "refunded";
  paid_at: string | null;
};
```

### Index strategy
- `branches.slug` unique.
- `domains.hostname` unique globally.
- `audit_log` partitioned by month, indexed on `(actor_user_id, created_at desc)` and `(resource.type, resource.id)`.
- `storage_quota` recomputed by background job; HQ reads from this table, never from object storage directly.

### API surface (HQ scope)
```
GET    /api/hq/branches                 ?q,plan,brand_site,publishing,page,page_size,sort
GET    /api/hq/branches/:id
PATCH  /api/hq/branches/:id             body: partial Branch
POST   /api/hq/branches/:id/suspend     body: { reason, confirm: "SUSPEND" }
POST   /api/hq/branches/:id/restore
POST   /api/hq/branches/bulk            body: { ids[], op, payload }   // bulk plan/template

GET    /api/hq/templates
POST   /api/hq/templates
POST   /api/hq/templates/:id/assign     body: { branch_ids[] }
PATCH  /api/hq/templates/:id            body: partial Template

GET    /api/hq/domains
POST   /api/hq/domains/:id/verify

GET    /api/hq/publishing-requests      ?status
POST   /api/hq/publishing-requests/:id/approve
POST   /api/hq/publishing-requests/:id/request-changes
POST   /api/hq/publishing-requests/:id/reject

GET    /api/hq/plans
POST   /api/hq/plans
PATCH  /api/hq/plans/:id

GET    /api/hq/billing/invoices         ?branch_id,status
GET    /api/hq/storage                  ?branch_id

GET    /api/hq/audit
```

All HQ endpoints require `role=hq_admin` and emit one `audit_log` row per write.

---

## 12. Out-of-scope (intentionally)

- Branch admin CMS editor / page builder.
- Student / parent-facing surfaces.
- Real-time collaboration on brand-site drafts.
- Content moderation of user-generated content (handled by branch admin).
- Marketing site / public landing pages of the SaaS itself.

---

## 13. Acceptance criteria checklist

- [ ] Sidebar IA matches §1 exactly (slugs and nesting).
- [ ] No new colour tokens introduced; all status indicators map to §9.
- [ ] Every list page reuses the generic `<DataTable />` and has empty + loading + error states from §8.
- [ ] All destructive flows use the §7.2 confirmation pattern.
- [ ] Branch detail and Brand Site Status read from the same `BrandSite` record (single source of truth).
- [ ] Bulk operations exposed only at list level, never inside detail pages.
- [ ] Every HQ write produces an `audit_log` entry.
