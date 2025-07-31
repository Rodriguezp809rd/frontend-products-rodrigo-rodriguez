'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductForm from '@/components/form/ProductForm';
// import { createProduct, verifyProductId, updateProduct } from '@/services/products.api';
import { Product } from '@/core/domain/Product';
import styles from './CreateProductPage.module.css';
import { createProduct } from '@/core/usecases/product/createProduct';
import { updateProduct } from '@/core/usecases/product/updateProduct';
import { verifyProductId } from '@/core/usecases/product/verifyProductId';
import { ProductApiRepository } from '@/infrastructure/repositories/ProductApiRepository';

export default function CreateProductPage() {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [productosEnviados, setProductosEnviados] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('productos_enviados');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProductosEnviados(parsed);
        }
      } catch {}
    }

    const productEditStr = localStorage.getItem('producto_a_editar');
    if (productEditStr) {
      try {
        const parsed = JSON.parse(productEditStr);
        setProductToEdit(parsed);
      } catch {}
      localStorage.removeItem('producto_a_editar');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productos_enviados', JSON.stringify(productosEnviados));
  }, [productosEnviados]);

  interface BackendError extends Error {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

 const handleSubmit = async (_: Product, data: Product, reset: () => void): Promise<boolean> => {
  setError('');
  setMensaje('');
  setShowSuccess(false);

  if (productToEdit) {
    try {
      const updatedProduct = await updateProduct(ProductApiRepository)(data.id, data);
      const updated = productosEnviados.map((p) => (p.id === data.id ? updatedProduct : p));
      setProductosEnviados(updated);
      setMensaje('Producto editado exitosamente.');
      setShowSuccess(true);
      return true;
    } catch (err) {
      throw err as BackendError;
    }
  }

  const existe = await verifyProductId(ProductApiRepository)(data.id);
  if (existe) {
    const error: BackendError = new Error('Duplicate identifier found in the database');
    error.response = {
      data: {
        message: 'Duplicate identifier found in the database',
      },
    };
    throw error;
  }

  try {
    const productoGuardado = await createProduct(ProductApiRepository)(data);
    setMensaje('Producto guardado exitosamente.');
    setProductosEnviados((prev) => [...prev, productoGuardado]);
    setShowSuccess(true);
    reset();
    return true;
  } catch (err) {
    throw err as BackendError;
  }
};


  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
        setMensaje('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess]);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.topButtonContainer}>
          <Link href="/">
            <button className={styles.backButton}>Volver a la Lista de Productos</button>
          </Link>
        </div>

        <div
          className={`${styles.successMessage} ${showSuccess ? styles.successMessageVisible : ''}`}
        >
          {mensaje}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <ProductForm
          onSubmit={handleSubmit}
          resetOnSubmit={!productToEdit}
          initialProducts={productosEnviados}
          productToEdit={productToEdit || undefined}
        />
      </div>
    </main>
  );
}
