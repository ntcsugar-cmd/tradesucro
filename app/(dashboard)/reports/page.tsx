import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { ReportCard } from "@/components/reports";
import { REPORT_DEFINITIONS } from "@/services/report.service";

export default function ReportsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Reports" }]} className="mb-5" />
      <PageHeader title="Reports" description="Mock report generation with placeholder PDF/Excel/CSV export." />
      <Grid cols={1} colsMd={2} gap="md">
        {REPORT_DEFINITIONS.map((report) => (
          <GridItem key={report.type}>
            <ReportCard report={report} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
