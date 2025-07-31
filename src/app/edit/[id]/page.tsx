'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/form/ProductForm';
import { getProducts, updateProduct } from '@/services/products.api';
import { Product } from '@/core/domain/Product';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = typeof params.id === 'string' ? params.id : '';

  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const all = await getProducts();
        const found = all.find((p) => p.id === productId);
        if (!found) {
          setErrorMessage('Product not found.');
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setErrorMessage('Failed to load product.');
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (updated: Product) => {
    try {
      await updateProduct(productId, updated);
      router.push('/');
    } catch (err) {
      console.error('Error updating product:', err);
      setErrorMessage('Failed to update product.');
    }
  };

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Edit Product</h1>

      {errorMessage && <p style={{ color: 'red', marginBottom: '12px' }}>{errorMessage}</p>}

      {product ? (
        <ProductForm
          onSubmit={handleSubmit}
          disableId={true}
          defaultValues={product}
        />
      ) : (
        !errorMessage && <p>Loading...</p>
      )}
    </main>
  );
}
