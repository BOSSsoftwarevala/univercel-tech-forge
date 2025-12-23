import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProductManager } from "@/components/demo-manager/ProductManager";

const ProductManagerPage = () => {
  return (
    <DashboardLayout roleOverride="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Product Manager</h1>
          <p className="text-muted-foreground">View all products (read-only access for Super Admin)</p>
        </div>
        <ProductManager viewOnly={true} />
      </div>
    </DashboardLayout>
  );
};

export default ProductManagerPage;
