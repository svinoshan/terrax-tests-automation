export type AuditTestData = {
  fieldOfficer: string;
  planDate: string;
  auditNumber: string;
  farmerRowsToSelect: number;

  auditDate: string;
  auditType: string;
  note?: string;
};

export function createAuditData(): AuditTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(8, 17);

  const today = new Date().toISOString().slice(0, 10);

  return {
    fieldOfficer: process.env.AUDIT_FIELD_OFFICER ?? "Chiranjaya Denuwan",
    planDate: process.env.AUDIT_PLAN_DATE ?? today,

    auditNumber: `AUD-E2E-${suffix}`,
    farmerRowsToSelect: Number(process.env.AUDIT_FARMER_ROWS ?? 1),

    // Config Audit modal data.
    auditDate: process.env.AUDIT_DATE ?? today,
    auditType: process.env.AUDIT_TYPE ?? "Fruit and Vegetables",
    note: `Automation audit config note ${suffix}`,
  };
}