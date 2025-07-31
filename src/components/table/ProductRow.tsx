'use client';

import { Product } from '@/core/domain/Product';
import React from 'react';
import styles from './ProductRow.module.css';

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductRow({ product, onEdit, onDelete }: Props) {
  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <img src={product.logo} alt={product.name} className={styles.logo} />
      </td>
      <td className={styles.cell}>{product.name}</td>
      <td className={styles.cell}>{product.description}</td>
      <td className={styles.cell}>{product.date_release}</td>
      <td className={styles.cell}>{product.date_revision}</td>
      <td className={styles.cell}>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEdit(product)}>
            Editar
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(product)}>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
