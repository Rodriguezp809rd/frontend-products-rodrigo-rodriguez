import { ProductRepository } from "@/core/ports/ProductRepository";

export const getProducts = (repo: ProductRepository) => {
  return async (page: number, limit: number) => {
    return await repo.getAll(page, limit);
  };
};
