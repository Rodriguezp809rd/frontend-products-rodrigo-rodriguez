'use client';

import React from 'react';
import styles from './SearchInput.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
      suppressHydrationWarning
    />
  );
}
