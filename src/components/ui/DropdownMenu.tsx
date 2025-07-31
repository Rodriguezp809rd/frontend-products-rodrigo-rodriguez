'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './DropdownMenu.module.css';

type DropdownMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function DropdownMenu({ onEdit, onDelete }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={menuRef}>
      <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
        ⋮
      </button>
      {open && (
        <div className={styles.menu}>
        <button
          className={styles.menuItem}
          onClick={() => {
            onEdit();
            setOpen(false);
          }}
          aria-label="Editar"
        >
          Editar
        </button>
        <button
          className={`${styles.menuItem} ${styles.deleteItem}`}
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
          aria-label="Eliminar"
        >
          Eliminar
        </button>

        </div>
      )}
    </div>
  );
}
