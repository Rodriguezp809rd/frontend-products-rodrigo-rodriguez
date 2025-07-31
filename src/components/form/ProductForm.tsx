'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './ProductForm.module.css';

import { Product } from '@/core/domain/Product';
import { BackendError } from '@/types/BackendError';
import { productSchema, ProductFormData } from '@/schemas/product.schema';


type Props = {
  onSubmit: (product: Product, data: ProductFormData, reset: () => void) => Promise<boolean>;
  resetOnSubmit?: boolean;
  initialProducts?: ProductFormData[];
  productToEdit?: Product;
};

export default function ProductForm({
  onSubmit,
  resetOnSubmit,
  initialProducts,
  productToEdit,
}: Props) {
  const {
  register,
  handleSubmit,
  reset,
  setValue,
  setError,
  formState: { errors, isSubmitting },
} = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
  mode: 'onChange',
});


  const [products, setProducts] = useState<ProductFormData[]>(() => {
    const stored = localStorage.getItem('productos');
    return stored ? JSON.parse(stored) : initialProducts || [];
  });

  const [sessionCreatedProducts, setSessionCreatedProducts] = useState<ProductFormData[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      Object.entries(productToEdit).forEach(([key, value]) => {
        setValue(key as keyof ProductFormData, value);
      });
      localStorage.removeItem('productos');
    }
  }, [productToEdit, setValue]);

  const internalSubmit = async (data: ProductFormData) => {
    try {
      const success = await onSubmit(data, data, reset);
      if (success) {
        if (!productToEdit) {
          const updated = [...products, data];
          setProducts(updated);
          localStorage.setItem('productos', JSON.stringify(updated));
          setSessionCreatedProducts((prev) => [...prev, data]);
        }
        setMessage('Producto guardado correctamente.');
        setIsError(false);
        if (resetOnSubmit) reset();
      } else {
        setMessage('Error al guardar el producto.');
        setIsError(true);
      }
    } catch (err: unknown) {
  const error = err as BackendError;
  const backendMessage = error?.response?.data?.message || error?.message || '';

  if (backendMessage.includes('Duplicate identifier')) {
    setError('id', {
      type: 'manual',
      message: 'ID no válido. Ya existe en la base de datos.',
    });
  } else {
    setMessage(backendMessage || 'Error al guardar el producto.');
    setIsError(true);
  }}};

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Formulario de Registro</h1>

        <form onSubmit={handleSubmit(internalSubmit)} className={styles.formGrid}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="id">ID</label>
              <input
                id="id"
                type="text"
                {...register('id')}
                className={styles.formInput}
                placeholder="Ej. P12345"
                disabled={!!productToEdit}
                style={!!productToEdit ? { backgroundColor: '#eee' } : {}}
              />
              {errors.id && <p className={styles.formError}>{errors.id.message}</p>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="name">Nombre del Producto</label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={styles.formInput}
                placeholder="Ej. Cafetera automática"
              />
              {errors.name && <p className={styles.formError}>{errors.name.message}</p>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                {...register('description')}
                className={styles.formInput}
                placeholder="Descripción del producto..."
              />
              {errors.description && <p className={styles.formError}>{errors.description.message}</p>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="logo">Logo (URL)</label>
              <input
                id="logo"
                type="text"
                {...register('logo')}
                className={styles.formInput}
                placeholder="Ej. https://imagen.com/logo.png"
              />
              {errors.logo && <p className={styles.formError}>{errors.logo.message}</p>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="date_release">Fecha de Lanzamiento</label>
              <input id="date_release" type="date" {...register('date_release')} className={styles.formInput} />
              {errors.date_release && <p className={styles.formError}>{errors.date_release.message}</p>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="date_revision">Fecha de Revisión</label>
              <input id="date_revision" type="date" {...register('date_revision')} className={styles.formInput} />
              {errors.date_revision && <p className={styles.formError}>{errors.date_revision.message}</p>}
            </div>
          </div>

          <div className={styles.formButtons}>
            <button type="reset" onClick={() => reset()} className={styles.btnReset}>
              Resetear
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Enviar'}
            </button>
          </div>
        </form>

        {sessionCreatedProducts.length > 0 && (
          <div className={styles.submittedWrapper}>
            <h2 className={styles.submittedTitle}>Productos Registrados</h2>
            <div className={styles.submittedScroll}>
              <div className={styles.submittedList}>
                {sessionCreatedProducts.map((product, index) => (
                  <div key={index} className={styles.submittedItem}>
                    <div><strong>ID:</strong> {product.id}</div>
                    <div><strong>Nombre:</strong> {product.name}</div>
                    <div><strong>Descripción:</strong> {product.description}</div>
                    <div>
                      <strong>Logo:</strong>{' '}
                      <a href={product.logo} target="_blank" rel="noreferrer">
                        {product.logo}
                      </a>
                    </div>
                    <div><strong>Fecha de Lanzamiento:</strong> {product.date_release}</div>
                    <div><strong>Fecha de Revisión:</strong> {product.date_revision}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
