import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProductManager } from "@/components/demo-manager/ProductManager";

const ProductManagerPage = () => {
  return (
    <DashboardLayout roleOverride={"boss_owner" as any}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Product Manager</h1>
          <p className="text-muted-foreground">Full product management access</p>
        </div>
        <ProductManager viewOnly={false} />
      </div>
    </DashboardLayout>
  );
};

export default ProductManagerPage;
