import { columns } from "./Columns";
import { DataTable } from "./DataTable";
import { getAllMerchantDetails } from "@/lib/services/merchants";

export default async function MerchantsPage() {
  const merchantDetails = await getAllMerchantDetails();
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
        <p className="text-muted-foreground">
          Manage and monitor all merchants on the platform.
        </p>
      </div>

      <DataTable columns={columns} data={merchantDetails} />
    </div>
  );
}
