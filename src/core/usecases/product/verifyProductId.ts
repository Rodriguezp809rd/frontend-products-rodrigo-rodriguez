import { ProductRepository } from "@/core/ports/ProductRepository";

export const verifyProductId = (repo: ProductRepository) => {
  return async (id: string): Promise<boolean> => {
    return await repo.verifyId(id);
  };
};
