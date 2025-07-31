'use client';

import { Product } from '@/core/domain/Product';
import ProductRow from './ProductRow';
import styles from './ProductTable.module.css';

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Logo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Lanzamiento</th>
            <th>Revisión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
