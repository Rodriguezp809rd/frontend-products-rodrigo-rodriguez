'use client';

import axios from 'axios';
import { Product } from '@/core/domain/Product';
import { ProductRepository } from '@/core/ports/ProductRepository';

const BASE_URL = 'http://localhost:3002/bp/products';

export const ProductApiRepository: ProductRepository = {
  async getAll(page = 1, limit = 5) {
    const res = await axios.get<{ data: Product[]; total: number }>(
      `${BASE_URL}?page=${page}&limit=${limit}`
    );
    return {
      data: res.data.data,
      total: res.data.total,
    };
  },
  async verifyId(id: string) {
  const res = await axios.get<{ data: boolean }>(`${BASE_URL}/verification/${id}`);
  return res.data.data;
},


  async create(product: Product) {
    const res = await axios.post<Product>(`${BASE_URL}`, product);
    return res.data;
  },

  async update(id: string, product: Product) {
    const res = await axios.put<Product>(`${BASE_URL}/${id}`, product);
    return res.data;
  },

  async delete(id: string) {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};
