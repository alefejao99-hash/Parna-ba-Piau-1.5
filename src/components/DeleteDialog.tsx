/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adTitle: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, onClose, onConfirm, adTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        id="delete-dialog-container"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4"
      >
        {/* Floating warning icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Excluir Anúncio?
          </h3>
          <p id="delete-dialog-body" className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
            Você tem certeza de que deseja apagar permanentemente o anúncio <strong className="text-slate-800 dark:text-slate-200">"{adTitle}"</strong>? Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancelar
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-rose-500 hover:scale-101"
          >
            <Trash2 className="h-4 w-4" />
            Excluir Anúncio
          </button>
        </div>
      </div>
    </div>
  );
};
