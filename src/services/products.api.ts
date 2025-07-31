'use client';

import { ProductApiRepository } from '@/infrastructure/repositories/ProductApiRepository';
import { getProducts as getProductsUseCase } from '@/core/usecases/product/getProducts';
import { createProduct as createProductUseCase } from '@/core/usecases/product/createProduct';
import { updateProduct as updateProductUseCase } from '@/core/usecases/product/updateProduct';
import { deleteProduct as deleteProductUseCase } from '@/core/usecases/product/deleteProduct';
import { Product } from '@/core/domain/Product';
import axios from 'axios';

const API_BASE = 'http://localhost:3002/bp/products';

export const getProducts = getProductsUseCase(ProductApiRepository);
export const createProduct = createProductUseCase(ProductApiRepository);
export const updateProduct = updateProductUseCase(ProductApiRepository);
export const deleteProduct = deleteProductUseCase(ProductApiRepository);


export async function verifyProductId(id: string): Promise<boolean> {
  const res = await axios.get<{ data: boolean }>(`${API_BASE}/verification/${id}`);
  return res.data.data;
}
