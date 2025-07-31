import { Product } from "@/core/domain/Product";
import { ProductRepository } from "@/core/ports/ProductRepository";

export const updateProduct = (repo: ProductRepository) => {
  return async (id: string, updatedProduct: Product) => {
    return await repo.update(id, updatedProduct);
  };
};