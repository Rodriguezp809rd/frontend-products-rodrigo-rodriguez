import { ProductRepository } from "@/core/ports/ProductRepository";
import { Product } from "@/core/domain/Product";

export const createProduct = (repo: ProductRepository) => {
  return async (product: Product) => {
    return await repo.create(product);
  };
};
