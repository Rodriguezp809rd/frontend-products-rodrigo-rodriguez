'use client';

import React from 'react';
import styles from './PaginationSelect.module.css';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function PaginationSelect({ value, onChange }: Props) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {[5, 10, 20].map((option) => (
        <option key={option} value={option}>
          {option} por página
        </option>
      ))}
    </select>
  );
}
