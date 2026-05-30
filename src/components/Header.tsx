/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Plus, Sun, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onAddAdClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddAdClick }) => {
  const WHATSAPP_GROUP = 'https://chat.whatsapp.com/EYcNd2i0bti4tEUQgfIY8h?s=cl&p=a&mlu=1';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-slate-900 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and title */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-950/40">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight leading-none text-emerald-400 uppercase">
              🏠 ALUGUEL DE CASA
            </h1>
            <h2 className="text-2xs sm:text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              PARNAÍBA PI DIVULGAÇÕES
            </h2>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Quick weather badge */}
          <div className="hidden items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-amber-400 md:flex">
            <Sun className="h-3 w-3 animate-pulse" />
            <span>Parnaíba: 31°C Sol</span>
          </div>

          {/* Group invite in header */}
          <a
            href={WHATSAPP_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-2xs font-bold text-emerald-400 transition-all border border-emerald-500/10"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Grupo WhatsApp</span>
          </a>

          <button
            id="btn-new-ad-header"
            onClick={onAddAdClick}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-2xs font-bold text-white transition-all hover:bg-emerald-500 hover:scale-[1.01] shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Anunciar Grátis 🏠</span>
          </button>
        </div>
      </div>
    </header>
  );
};
