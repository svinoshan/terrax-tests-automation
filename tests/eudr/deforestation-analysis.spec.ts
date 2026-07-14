import { test } from '@fixtures/auth.fixture';

test.describe('@regression EUDR Deforestation Analysis', () => {
  test('EUDR_DEFORESTATION_SMOKE_001 - Submit tab opens and shows expected columns', async ({
    authenticatedUser,
    deforestationAnalysisPage,
  }) => {
    void authenticatedUser;

    await deforestationAnalysisPage.open();
    await deforestationAnalysisPage.expectSubmitLoaded();
  });

  test('EUDR_DEFORESTATION_SEARCH_001 - user can search submit records', async ({
    authenticatedUser,
    deforestationAnalysisPage,
  }) => {
    void authenticatedUser;

    await deforestationAnalysisPage.open();

    await deforestationAnalysisPage.search(
      process.env.EUDR_DEFORESTATION_SEARCH ?? 'sa',
    );

    await deforestationAnalysisPage.expectAtLeastOneSubmitRow();
  });

  test('EUDR_DEFORESTATION_SELECT_001 - user can select and unselect submit row', async ({
    authenticatedUser,
    deforestationAnalysisPage,
  }) => {
    void authenticatedUser;

    await deforestationAnalysisPage.open();

    await deforestationAnalysisPage.search(
      process.env.EUDR_DEFORESTATION_SEARCH ?? 'sa',
    );

    await deforestationAnalysisPage.expectAtLeastOneSubmitRow();

    await deforestationAnalysisPage.selectFirstSubmitRow();
    await deforestationAnalysisPage.unselectFirstSubmitRow();
  });

  test('EUDR_DEFORESTATION_RESULT_SMOKE_001 - Result tab opens and shows expected columns', async ({
    authenticatedUser,
    deforestationAnalysisPage,
  }) => {
    void authenticatedUser;

    await deforestationAnalysisPage.open();

    await deforestationAnalysisPage.openResultTab();
  });

  test('EUDR_DEFORESTATION_FILTER_001 - user can open filter panel and select units', async ({
    authenticatedUser,
    deforestationAnalysisPage,
  }) => {
    void authenticatedUser;

    await deforestationAnalysisPage.open();

    await deforestationAnalysisPage.openFilterPanel();

    await deforestationAnalysisPage.selectMainUnitWithFallback(
      process.env.EUDR_DEFORESTATION_MAIN_UNIT ?? 'F001',
    );

    await deforestationAnalysisPage.selectSubUnitWithFallback(
      process.env.EUDR_DEFORESTATION_SUB_UNIT ?? 'B004',
    );

    await deforestationAnalysisPage.closeFilterPanel();
  });
});
