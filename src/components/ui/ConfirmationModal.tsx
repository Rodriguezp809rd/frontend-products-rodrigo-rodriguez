'use client';

import React, { ReactNode } from 'react';

interface Props {
  title?: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-divider" />
        <div className="modal-buttons">
          <button onClick={onCancel} className="modal-cancel">Cancelar</button>
          <button onClick={onConfirm} className="modal-confirm">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
