export type { MarketplaceProduct } from "./types";
export { educationProducts } from "./education";
export { healthcareProducts } from "./healthcare";
export { realEstateProducts } from "./realestate";
export { crmProducts } from "./crm";
export { posProducts } from "./pos";

import { educationProducts } from "./education";
import { healthcareProducts } from "./healthcare";
import { realEstateProducts } from "./realestate";
import { crmProducts } from "./crm";
import { posProducts } from "./pos";
import { MarketplaceProduct } from "./types";

/** All marketplace products from separate category files */
export const allMarketplaceProducts: MarketplaceProduct[] = [
  ...educationProducts,
  ...healthcareProducts,
  ...realEstateProducts,
  ...crmProducts,
  ...posProducts,
];

/** Total count across all categories */
export const totalProductCount = allMarketplaceProducts.length;
