import { ProductRepository } from "@/core/ports/ProductRepository";

export const deleteProduct = (repo: ProductRepository) => {
  return async (id: string) => {
    return await repo.delete(id);
  };
};