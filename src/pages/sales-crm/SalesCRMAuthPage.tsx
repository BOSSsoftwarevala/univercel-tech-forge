import { CRMAuthProvider, useCRMAuth } from "@/hooks/useCRMAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SalesCRMAuth from "./SalesCRMAuth";

const AuthContent = () => {
  const { user, isLoading } = useCRMAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/sales-crm');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;
  if (user) return null;

  return <SalesCRMAuth />;
};

const SalesCRMAuthPage = () => {
  return (
    <CRMAuthProvider>
      <AuthContent />
    </CRMAuthProvider>
  );
};

export default SalesCRMAuthPage;
