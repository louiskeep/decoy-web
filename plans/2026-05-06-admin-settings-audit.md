# Admin Settings Audit & Recommendations

> Status: Design doc. No code changes accompany this commit.
> Scope: Audits admin functionality across `decoy-platform`, `decoy-engine`, and `decoy`, and proposes the full set of admin settings and abilities the platform should support. Roles & RBAC is the prioritized area.

## 1. Current State

Admin functionality lives entirely in `decoy-platform`. `decoy-engine` (transform library) and `decoy` (CLI) have no admin surface — they validate license tier but do not have user/role models, admin endpoints, or audit logs.

### 1.1 Roles & auth

- **Role enum** in `api/models.py`: two values, `admin` and `user`.
- **User model** has `role`, `is_active`, and `is_primary` (the unique primary admin is protected from deletion and self-demotion).
- **Auth dependencies** in `api/auth/deps.py`:
  - `get_current_user` — validates JWT cookie or Bearer API key.
  - `require_admin` — gates all admin endpoints with a single role check.
- JWT cookie sessions plus per-user API keys. **No** session revocation, **no** API-key expiry, **no** 2FA, **no** rate limiting, **no** IP allowlist.

### 1.2 Admin endpoints (`api/admin/*`)

| Endpoint | Notes |
|---|---|
| `GET /api/admin/settings` | Available to all authenticated users. |
| `PATCH /api/admin/settings` | Admin-only; updates `AppSettings` singleton. |
| `POST /api/admin/purge-jobs` | Trigger job-retention cleanup. |
| `GET /api/admin/license` | License tier, seat count, usage. |
| `GET /api/admin/logs` | Tail of `app.log`. |
| `GET /api/admin/reset-instance/token` | Issues short-lived reset token. |
| `POST /api/admin/reset-instance` | Destructive wipe + re-seed; password + token required. |
| `POST /api/admin/seed-demo-connector` | Re-create sample DB connector. |

### 1.3 User management (`api/users/*`)

- `GET /api/users` — list (admin only).
- `POST /api/users/invite` — issue invite token; checked against license seats.
- `POST /api/users/accept-invite` — self-registration via token; re-checks seats.
- `PATCH /api/users/{user_id}` — change `role`, `is_active`.
- `DELETE /api/users/{user_id}` — hard delete; protects self and primary admin.
- License gating in `api/license/gates.py`.

### 1.4 AppSettings singleton (`api/models.py`)

- Preview row count.
- Default masking/generation parameters.
- Job history retention (`keep_all` / `by_days` / `by_count`).
- Workflow/pipeline version history retention count.
- SMTP host/port/user/pass/from.

### 1.5 Audit log

- `AuditEntry` table (`user_id`, `action`, `detail`, `created_at`).
- Helper `write_audit()` in `api/audit/logger.py`.
- Viewer at `web/src/pages/AuditLog.tsx`; admin-only router in `api/audit/router.py` with filters (action prefix, user, date range).
- Currently emits entries for `user.invite`, `user.delete`, `user.update`, `user.accept_invite`, and job creation.

### 1.6 Admin UI

- `web/src/pages/AdminSettings.tsx` — settings, license info, diagnostics.
- `web/src/pages/Users.tsx` — list, invite, role assignment, deactivate.
- `web/src/pages/AuditLog.tsx` — audit viewer.
- `web/src/pages/ApiKeys.tsx` — per-user API keys.
- `web/src/pages/ServerLogs.tsx` — recent `app.log` lines.

## 2. Gaps

Common admin capabilities that are **missing today**:

1. No password reset flow — users must be deleted and re-invited.
2. No user impersonation.
3. No 2FA, no IP allowlist, no admin-IP restriction.
4. No audit-log tamper-evidence; admins can delete `AuditEntry` rows directly.
5. No fine-grained permissions; `admin` is all-or-nothing.
6. No session revocation (logout-all, force-logout) and no API-key revoke/expiry.
7. No approval workflow for sensitive operations (delete user, reset instance).
8. No alerting (email/webhook) on admin actions.
9. No rate limiting / brute-force protection on login or admin endpoints.
10. Admin actions are not separately flagged in the audit log.

Additional concerns surfaced by the audit:

- License validation is enforced server-side at invite time but the validator is mockable in non-production builds.
- Instance reset confirmation is single-factor (password + ephemeral token, same admin).
- Server logs UI exposes raw `app.log` to any admin — fine today, but couples audit and operational logs.

## 3. Recommended Admin Settings & Abilities

The catalogue below describes the target state. Implementation is out of scope for this doc.

### 3.1 Roles & RBAC (priority)

#### 3.1.1 Role set

| Role | Purpose |
|---|---|
| `owner` | Single-instance super-admin. Replaces the current `is_primary` admin. Only role that can transfer ownership, reset instance, manage billing/license. |
| `admin` | Full operational admin minus ownership-only actions. Manage users (except owner), settings, connectors, pipelines, jobs. |
| `operator` | Manage connectors, pipelines, and jobs across all users. **Cannot** manage users, settings, or license. |
| `auditor` | Read-only access to audit log, server logs, user list, and settings. **No** mutations anywhere. |
| `billing` | View and edit license, seat allocation, and usage. **No** access to user data or pipelines. |
| `user` | Standard end user. Only own resources. Unchanged from today. |

The instance always has exactly one `owner`; `admin` may exist 0..N. Demotion of the sole `owner` is blocked unless ownership is transferred first.

#### 3.1.2 Capability model

Move from role checks to **capability checks**. Each endpoint declares the capability it requires; a static map binds capabilities to roles.

Initial capability set (illustrative, not exhaustive):

```
users.read              users.invite           users.update.role
users.delete            users.impersonate
settings.read           settings.write
license.read            license.write
audit.read              audit.export
logs.read
instance.reset          instance.transfer_ownership
connectors.admin        pipelines.admin        jobs.admin
apikeys.admin.others    apikeys.manage.self
```

`ROLE_CAPABILITIES` map (single source of truth, proposed `api/auth/rbac.py`):

| Capability | owner | admin | operator | auditor | billing | user |
|---|---|---|---|---|---|---|
| users.read | ✓ | ✓ | – | ✓ | – | – |
| users.invite | ✓ | ✓ | – | – | – | – |
| users.update.role | ✓ | ✓* | – | – | – | – |
| users.delete | ✓ | ✓* | – | – | – | – |
| users.impersonate | ✓ | – | – | – | – | – |
| settings.read | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| settings.write | ✓ | ✓ | – | – | – | – |
| license.read | ✓ | ✓ | – | ✓ | ✓ | – |
| license.write | ✓ | – | – | – | ✓ | – |
| audit.read | ✓ | ✓ | – | ✓ | – | – |
| audit.export | ✓ | ✓ | – | ✓ | – | – |
| logs.read | ✓ | ✓ | – | ✓ | – | – |
| instance.reset | ✓ | – | – | – | – | – |
| instance.transfer_ownership | ✓ | – | – | – | – | – |
| connectors.admin | ✓ | ✓ | ✓ | – | – | – |
| pipelines.admin | ✓ | ✓ | ✓ | – | – | – |
| jobs.admin | ✓ | ✓ | ✓ | – | – | – |
| apikeys.admin.others | ✓ | ✓ | – | – | – | – |
| apikeys.manage.self | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

`*` = `admin` cannot operate on `owner` accounts.

#### 3.1.3 Enforcement

- New dependency `require_capability(cap)` replaces `require_admin` at the endpoint layer.
- `require_admin` retained as a thin alias (`require_capability(any_admin_cap)`) during migration so unmigrated endpoints continue to work.
- Resource ownership checks remain separate; capabilities authorize the action class, not the specific resource.
- Every denied capability check writes an audit entry (`access.denied`, with capability and route).
- Every `users.update.role` writes an audit entry recording before/after roles.

#### 3.1.4 Migration

- DB migration: extend `Role` enum with new values; map existing rows:
  - `is_primary=True, role=admin` → `owner` (clear `is_primary` afterward).
  - All other `admin` rows → `admin`.
  - All `user` rows unchanged.
- Backwards-compatible: `owner` and `admin` both satisfy any legacy `require_admin` check.
- One-shot script verifies exactly one `owner` exists post-migration.

#### 3.1.5 UI

- `Users.tsx`: role picker shows the six roles, each with a tooltip listing the capability bundle. Current admin-only filters become role-aware.
- `AdminSettings.tsx`: add a read-only **Roles & Permissions** panel that renders the capability matrix from the same `ROLE_CAPABILITIES` map (single source of truth, no drift).
- New **Transfer Ownership** action in `AdminSettings.tsx`, owner-only, requires password + email confirmation.

### 3.2 Account Security

- Password reset via emailed token (reuses configured SMTP).
- Optional TOTP 2FA per user; admin can require 2FA for selected roles (`owner`, `admin`, `billing`).
- Session revocation: logout-all-sessions for self; force-logout for any user (`users.update.role` + new `users.session.revoke`).
- API-key lifecycle: explicit revoke, optional expiry, optional capability scoping (subset of caller's caps).
- Login rate limiting and account lockout on repeated failure.
- Optional IP allowlist enforced for `owner`/`admin`/`billing` roles.

### 3.3 Server Behavior & Feature Flags

- **Maintenance mode** toggle: read-only mode and/or banner; honored by API + UI.
- **Feature flags** table (`FeatureFlag`) with admin UI; replaces ad-hoc env toggles where practical.
- **Quotas** in `AppSettings`: max connectors, max pipelines, max concurrent jobs, max upload size, dataset row cap.
- **Retention** extensions: audit-log retention, server-log retention.
- **SMTP test** endpoint that sends a self-test message and surfaces errors in the UI.
- **Webhook destinations** for system events (job failure, license expiry, admin actions).
- **Metadata backup/export** on demand: settings + users + audit + license.

### 3.4 Auditing & Compliance

- Append-only audit storage. Two viable options, decision deferred:
  - DB role used by API lacks `DELETE` on `audit_entry`; truncation only via offline maintenance role.
  - Hash-chain each entry (`prev_hash`, `entry_hash`) to make tampering detectable.
- New boolean `admin_action` on `AuditEntry`; viewer adds an "Admin actions only" filter.
- Audit export (CSV/JSON), gated by `audit.export`.
- Alert rules: per-action email/webhook on selected actions (`instance.reset`, `users.delete`, `users.update.role`, `license.write`, `access.denied` bursts).
- Impersonation: writes paired `impersonate.start` / `impersonate.end` entries with target user; banner in UI throughout the session.

## 4. Out of Scope

- Anything in `decoy-engine` and `decoy` — neither has an admin surface today, and adding one is not justified by current product needs.
- Multi-tenant org/workspace model — the platform remains single-instance.

## 5. Critical Files Referenced

- `api/models.py` — `Role`, `User`, `AppSettings`, `AuditEntry`.
- `api/auth/deps.py` — `get_current_user`, `require_admin`.
- `api/admin/*` — admin routers.
- `api/users/*` — user-management routers.
- `api/audit/logger.py`, `api/audit/router.py` — audit log.
- `api/license/gates.py` — seat & feature gates.
- `web/src/pages/AdminSettings.tsx`, `Users.tsx`, `AuditLog.tsx`, `ApiKeys.tsx`, `ServerLogs.tsx`.

## 6. Verification

This is a doc-only change.

1. Render this file on GitHub and confirm tables and headings display correctly.
2. Confirm every path in §1 and §5 still exists on the target branch via repo browse.
3. Confirm the commit lands only on `claude/admin-settings-audit-1Nk5w` in `louiskeep/decoy-platform`; no changes to `decoy-engine` or `decoy`.
