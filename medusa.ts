import Medusa from "@medusajs/medusa-js";
import type { Product } from "schema-dts";

const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL ?? "https://medusa.prixeo.com",
  maxRetries: 3,
});

export async function addProduct(product: Product): Promise<void> {
  console.log({ product });
  const response = await medusa.admin.products.create({
    title: product.name?.toString() ?? "MISSING_NAME",
    is_giftcard: false,
    discountable: true,
    variants: [
      { title: "foo", prices: [{ amount: 100, currency_code: "NOK" }] },
    ],
  });
  console.log(JSON.stringify(response, null, 2));
}
