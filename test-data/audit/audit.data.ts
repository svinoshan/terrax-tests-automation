export type AuditTestData = {
  fieldOfficer: string;
  planDate: string;
  auditNumber: string;
  farmerRowsToSelect: number;
};

export function createAuditData(): AuditTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(8, 17);

  return {
    fieldOfficer: process.env.AUDIT_FIELD_OFFICER ?? "Chiranjaya Denuwan",

    // Plan date can be today or past date. Use today by default.
    planDate:
      process.env.AUDIT_PLAN_DATE ?? new Date().toISOString().slice(0, 10),

    auditNumber: `AUD-E2E-${suffix}`,
    farmerRowsToSelect: Number(process.env.AUDIT_FARMER_ROWS ?? 2),
  };
}
