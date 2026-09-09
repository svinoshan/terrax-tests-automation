# Purchase automation

The September 2026 UI uses inline item rows. No Farmer setup records are created by this suite.

## Run

Start with `npm run test:purchase:smoke`.
Other scripts: `test:purchase:create`, `:update`, `:validation`, `:lines`, `:authorize`, `:cancel`, `:report`.
`npm run test:purchase` runs everything, including transactions and cancellation.

```bash
TEST_CASE_IDS=PURCHASE_001 PURCHASE_RANDOM_SEED=trial-1 npm run test:purchase:create
TEST_DATA_OFFSET=0 TEST_DATA_LIMIT=2 npm run test:purchase:create
PURCHASE_MAX_FARMER_ATTEMPTS=30 npm run test:purchase:create
```

- PURCHASE_001: Farmer group, one item.
- PURCHASE_002: Supplier, two distinct items, one certification on the first line.
- JSON controls quantities, prices, updates, certification counts and date (`today` uses Asia/Colombo).
- Offset/limit and IDs select positive data for create/update/authorization/cancellation/report/lines.
- Smoke and validation run their complete independent matrices; offsets do not filter them.
- Update/authorization/cancellation/report workflows create their own purchase and identify it by its unique note. They never select an arbitrary existing transaction.
- The update script is a lifecycle test, not a batch updater for purchases created by an earlier command.
- Transaction retries are disabled in these scripts because creates/authorization affect persisted data.
- Authorization requires an account with the appropriate permission.

## Dynamic selection

Both purchase types are explicit cases. Eligible dropdown records are shuffled with a logged seed.
Farmer candidates are not revisited. Each candidate's plots are checked for enough distinct items.
Successful empty responses trigger fallback; HTTP/application errors and timeouts fail the test.
The farmer attempt limit defaults to 20. Plots within an attempted farmer are all considered.
The entire test also has a time budget (180–240 seconds).

Select purchasing officer after farmer because farmer selection auto-populates it.
Receiving locations come from active unassigned locations, suppliers from active suppliers.
Users and supplier/location results are limited by the application's current 100-record lookup page.
Supplier items come from mother-item options; Farmer items come from the selected plot.
Certificates are selected from the current certification options, without inventing links to suppliers/items.

Each test attaches `purchase-selection` JSON with seed, selected records and farmer/plot attempts.
A seed reproduces ordering only while input option lists are unchanged. Save the attachment when investigating failures.
Create results have no returned ID: identification reads up to 20 pages of purchases and confirms the unique note in purchase details.
No automatic data cleanup is performed. Cancellation tests only cancel the purchase created within that test.

## Coverage

- Smoke: current list columns and both conditional forms.
- Create: single/multiple rows, dynamic references, saved values.
- Update: note, quantity and price, followed by reopen verification.
- Authorization: direct authorization and authorization during update, read-only checks.
- Cancellation: authorized and unauthorized purchases created by the test.
- Validation: required headers and numeric boundaries; write requests are blocked as a safeguard.
- Lines: duplicate item invalidity, remove unsaved line, zero price, decimal totals, harvest date order.
- Report: opens the PDF popup for the purchase created by the test.

Excel import/export, detailed list filtering/pagination, permission-denial accounts, type-change stale values,
and backend-only validation cases are follow-on coverage, not implemented by these specs.

## Application findings to investigate

- Backend save currently assigns purchasing officer from the logged-in user. Persisted officer assertions intentionally expose a mismatch with a different selected officer.
- Quantity minimum differs: frontend 0.01; backend DTO 0.001. UI tests follow 0.01.
- Removing an existing persisted line calls DELETE immediately. Line-only tests remove unsaved rows.
- Purchase type changes may retain stale selected IDs/items. Current source does not call changePurchaseType from the type select.
- Edit form initialization does not await all lookup requests. Tests wait for actual field values rather than only the heading.
- Mass balance is displayed but no frontend maximum validator was found; this suite does not assume a maximum rule.

A passing compiler/discovery check is not evidence of a passing live workflow. Consult the run results.
