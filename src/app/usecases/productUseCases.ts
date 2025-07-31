'use client';

import { ProductApiRepository } from "@/infrastructure/repositories/ProductApiRepository";

import { getProducts } from "@/core/usecases/product/getProducts";
import { createProduct } from "@/core/usecases/product/createProduct";
import { updateProduct } from "@/core/usecases/product/updateProduct";
import { deleteProduct } from "@/core/usecases/product/deleteProduct";

export const getProductsUseCase = getProducts(ProductApiRepository);
export const createProductUseCase = createProduct(ProductApiRepository);
export const updateProductUseCase = updateProduct(ProductApiRepository);
export const deleteProductUseCase = deleteProduct(ProductApiRepository);
