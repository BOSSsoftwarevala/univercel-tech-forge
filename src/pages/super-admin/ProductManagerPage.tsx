import DashboardLayout from "@/components/layouts/DashboardLayout";
import PMEnterpriseLayout from "@/components/product-manager/PMEnterpriseLayout";

const ProductManagerPage = () => {
  return (
    <DashboardLayout roleOverride={"boss_owner" as any}>
      <PMEnterpriseLayout viewOnly={false} />
    </DashboardLayout>
  );
};

export default ProductManagerPage;
