import { Product } from "@/core/domain/Product";

export interface ProductRepository {
  getAll(page?: number, limit?: number): Promise<{ data: Product[]; total: number }>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<{ message: string }>;
  verifyId(id: string): Promise<boolean>;
}
