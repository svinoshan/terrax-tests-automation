# Bug: Create Crop Fails When Mother Crop Is Default and Out Turn Is Empty

## Module
Crops Info > Create Crop

## Environment
Dev - http://20.6.73.65

## Summary
Create Crop appears to fail when Mother Crop is set to Default and Out Turn is empty or disabled.

## Steps to Reproduce
1. Login to TerraX.
2. Navigate to Crops Info.
3. Click Add new.
4. Fill all required Create Crop fields.
5. Set Mother Crop as Default.
6. Leave Out Turn empty/disabled.
7. Click Save.

## Actual Result
Crop is not saved successfully.

## Expected Result
Crop should be saved when Mother Crop is Default and Out Turn is not applicable.

## Automation Status
Documented as skipped known-bug test in:

tests/crops/create-crop-full.spec.ts

## Notes
A passing scenario exists when Mother Crop is not Default and Out Turn is filled.
