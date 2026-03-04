import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProductManagerDashboard from "@/components/product-manager/ProductManagerDashboard";

const ProductManagerPage = () => {
  return (
    <DashboardLayout roleOverride={"boss_owner" as any}>
      <ProductManagerDashboard viewOnly={false} />
    </DashboardLayout>
  );
};

export default ProductManagerPage;
