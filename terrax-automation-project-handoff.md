
# TerraX Playwright Automation Handoff

_Last updated: 2026-07-13_

## 1. Project Overview

This project is a Playwright + TypeScript end-to-end automation suite for TerraX.

The automation currently covers the main business flow:

```text
Login
→ Dashboard/App shell
→ Crops
→ Customers
→ Unit Info
→ Farmer Profile
→ Farmer Land/Crops/EU-NOP-JAS/Dossier
→ Purchase
→ Dispatch
```

The suite uses a Page Object Model structure:

```text
pages/<module>/*.ts
fixtures/*.fixture.ts
test-data/<module>/*.data.ts
tests/<module>/*.spec.ts
```

The current approach prioritizes stable UI automation with selectors based on:

```text
formcontrolname
role/name
visible table headers
scoped locators within app-* Angular components
```

Avoid brittle selectors such as dynamic Angular IDs like `#mat-select-value-12` unless there is no alternative.

---

## 2. Environment Setup

### Required `.env` values

```env
APP_BASE_URL=https://terraxdev.southeastasia.cloudapp.azure.com
APP_USERNAME=<your username>
APP_PASSWORD=<your password>

# Dispatch safe line value defaults
DISPATCH_MAX_QTY=10
DISPATCH_QTY_DECIMALS=2
DISPATCH_PRICE_MARKUP=10
DISPATCH_MAX_PRICE=999999
DISPATCH_FALLBACK_PRICE=45

# Optional prepared purchase validation data
PURCHASE_TEST_FARMER_NAME=Sampath Thennakoon
PURCHASE_TEST_PLOT_CODE=A

# Optional dispatch destination search
DISPATCH_TO_SEARCH=John
```

`APP_BASE_URL` was previously an IP-based URL and later changed to:

```text
https://terraxdev.southeastasia.cloudapp.azure.com
```

### Common commands

```bash
npm run typecheck
npm run test:headed -- tests/<module>/<file>.spec.ts
npm run test:dispatch:headed
npm run test:purchase:headed
npx playwright show-report
```

### Debug / slow run

```bash
npx playwright test tests/dispatch/dispatch-balance.spec.ts --project=chromium --debug
```

Or use `slowMo` temporarily in `playwright.config.ts`.

---

## 3. Test Data and File Uploads

### Dossier upload file

Use a repo-relative dummy file:

```text
test-data/files/dummy_land_certificate_10_pages.pdf
```

Recommended `.gitignore` approach:

```gitignore
# Ignore local/real uploaded test documents
test-data/files/*
!test-data/files/.gitkeep
!test-data/files/dummy_land_certificate_10_pages.pdf
```

Do not use OneDrive absolute paths in committed tests:

```text
C:\Users\svinoshan\OneDrive - Peterson and Control Union\CU\Tests\...
```

Use `.data.ts` files for dynamic data factories. JSON files are acceptable for static data, but `.data.ts` is preferred for unique timestamps, random safe options, and typed values.

---

## 4. Important Architecture Notes

### `authenticatedUser` fixture

Most tests include:

```ts
authenticatedUser
```

Even though its value is not read, it forces login setup to run. If lint/editor complains, use:

```ts
void authenticatedUser;
```

### Login timing

If login suddenly fails during deployment, first check if the app environment is being updated. The auth flow previously worked, and failures during deployment may not require test changes.

If login flakes after deployment is stable, strengthen login by waiting for `/home/` URL and OK dialog.

---

## 5. Farmer Module Status

### Covered

```text
✓ Farmer profile smoke tests
✓ Required field validation tests
✓ Full create flow
✓ Update basic profile information
✓ Farmer full supporting setup:
  - Active farmer
  - Land
  - Certifications
  - Crops
  - EU/NOP/JAS
  - Dossier upload
✓ Persistence audit test, with Supplier type bug captured
```

### Key Farmer insights

- The Active/Inactive switch uses:

```ts
page.locator('#flexSwitchCheckDefault')
```

- The switch label changes:

```text
unchecked = Inactive
checked = Active
```

- Purchase requires the farmer to be active.
- Purchase farmer autocomplete searches reliably by **full name**, not farmer code or name with initials.
- `supplierType` is visually required but has a persistence issue after Farmer creation.

### Known Farmer bug

```text
Supplier type selected during Farmer creation is not persisted.
After save/reopen, Supplier type resets to "Select Supplier type".
```

This is captured in the Farmer persistence audit and can be marked as expected failure until fixed.

---

## 6. Purchase Module Status

### Covered

```text
✓ Purchase smoke
✓ Create purchase note using Save
✓ Create purchase note using Save & Authorized
✓ Purchase validation
✓ Update unauthorized purchase
✓ Update & Authorized
✓ Cancel unauthorized purchase
✓ Cancel authorized purchase from view mode
```

### Key Purchase insights

- Create requires:

```text
Farmer
Purchasing officer
Plot code
Purchase date
At least one purchase line
```

- Farmer autocomplete should use `profileData.fullName`.
- Purchasing officer is required even if HTML initially looked optional.
- Add line modal requires item and purchase quantity.
- Unit price is visually marked required, but app allows blank unit price and creates line with `0.00`.

### Known Purchase validation gap

```text
Unit price is marked required but purchase line can be added without unit price.
```

Track as issue if business confirms Unit price must be mandatory.

---

## 7. Dispatch Module Status

### Covered

```text
✓ Dispatch smoke
✓ Create Dispatch using Save
✓ Create Dispatch using Save & Authorized
✓ Dispatch validation
✓ Update unauthorized Dispatch
✓ Update & Authorized Dispatch
✓ Cancel unauthorized Dispatch
✓ Cancel authorized Dispatch
✓ Dispatch balance lifecycle tests
✓ Dispatch line delete/re-add before save
✓ Dispatch multiple line totals calculation
✓ Purchase report smoke
✓ Dispatch report smoke
```

### Known Dispatch validation bug

`DISPATCH_VAL_002 - Missing Dispatch date` is marked expected failure because the app displays a generic popup:

```text
Something went wrong!
Unexpected error occurred
```

Expected behavior should be a field-level validation message like:

```text
Dispatch date is required
```

### Dispatch stock/balance business rules confirmed

```text
Normal Save reduces/reserves stock immediately.
Cancel restores stock.
Save & Authorized reduces stock once.
Update adjusts stock by the quantity delta.
Cancel authorized dispatch restores stock.
```

### Dispatch balance tests included

```text
DISPATCH_BAL_001 - Save dispatch reduces balance by dispatch quantity
DISPATCH_BAL_002 - Cancel saved dispatch restores balance quantity
DISPATCH_BAL_003 - Update dispatch quantity adjusts balance correctly
DISPATCH_BAL_004 - Save and Authorized reduces balance once
DISPATCH_BAL_005 - Cancel authorized dispatch restores balance quantity
```

### Dispatch safe quantity strategy

Do not dispatch full balance by default.

Use:

```ts
await createDispatchPage.addFirstAvailablePurchaseDetail();
await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();
await createDispatchPage.save();
```

`DISPATCH_MAX_QTY` is a cap, not a fixed value:

```text
safeQty = min(DISPATCH_MAX_QTY, availableBalance)
```

Examples when `DISPATCH_MAX_QTY=10`:

```text
Balance 500   -> safe qty 10
Balance 50    -> safe qty 10
Balance 7.75  -> safe qty 7.75
Balance 0     -> fail clearly
```

Per-test overrides take priority over `.env`.

---

## 8. Current Known Bugs / Validation Gaps

### Farmer

```text
Supplier type does not persist after Farmer create.
```

### Purchase

```text
Unit price is marked required but purchase line can be added with 0.00.
```

### Dispatch

```text
Missing Dispatch date triggers generic "Something went wrong" popup instead of field-level validation.
```

---

## 9. Stability Patterns Learned

### Angular async form patching

Update forms sometimes patch values after the page opens. Before editing, wait for the original value.

Example pattern:

```ts
await createDispatchPage.expectDispatchNoteValue(dispatchData.note);
await createDispatchPage.updateNote(updatedNote);
```

### Mat-select placeholder vs selected text

Use helpers that read either:

```text
.mat-mdc-select-value-text
.mat-mdc-select-placeholder
```

Avoid `toContain()` when placeholder text can contain the expected word, e.g.:

```text
Expected: Supplier
Actual: Select Supplier type
```

Use exact match for selected values.

### Autocomplete robustness

For required autocomplete fields:

```ts
await input.fill(searchText);
await page.getByRole('option').filter({ hasText: searchText }).first().click();
```

For fields where exact option text is unknown, select first visible option after a stable search string.

### Refresh buttons after adding Land

Farmer Crops, EU/NOP/JAS, and Dossier plot code dropdowns may not load immediately after Land is added. Click the refresh button before selecting Plot code.

### Button locators after deployment

Avoid class-only button locators like:

```ts
.page-header button.btn-success
```

Use role/text where possible:

```ts
page.getByRole('button', { name: /Save$/i })
page.getByRole('button', { name: /Save\s*&\s*Authorized/i })
```

---

## 10. Suggested Next Work

### Immediate next: Dispatch line management

Already added:

```text
DISPATCH_LINE_001 - delete added dispatch line before save and add another line
```

Next recommended:

```text
DISPATCH_LINE_002 - add multiple dispatch lines and verify totals calculate correctly
```

### Later optional flows

```text
Audit module
EUDR module
Reports module deeper checks
Dispatch no-stock validation
Zero balance item cannot be dispatched
Decimal balance quantity edge cases
```

---

## 11. Useful Current Test Commands

```bash
npm run typecheck
npm run test:purchase:headed
npm run test:dispatch:headed
npm run test:reports:headed
npx playwright test tests/crops tests/customers tests/unit-info tests/farmer tests/purchase tests/dispatch --project=chromium --headed --workers=1
```

---

## 12. Recommended Git Checkpoint Messages Used

```text
Add Farmer Profile smoke and validation tests
Add Farmer full create regression test
Add Farmer full setup with land crop EU NOP JAS and dossier
Add Purchase create validation authorize and update tests
Complete Purchase create validation update authorize and cancel tests
Add Dispatch create validation update authorize and cancel tests
Add Dispatch balance lifecycle tests
Add Dispatch balance and line management tests
Add Purchase and Dispatch report smoke tests
```

---

## 13. If Starting a New Chat

Provide this file plus your latest failing test output, especially:

```text
error-context.md
test-failed-1.png
relevant spec file
relevant page object
```

Then ask to continue from the latest module instead of rebuilding from scratch.
