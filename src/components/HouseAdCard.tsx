/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HouseAd } from '../types';
import { Edit3, Trash2, MapPin, BedDouble, Bath, Maximize2, MessageSquare, User, Building, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface HouseAdCardProps {
  ad: HouseAd;
  onEdit: (ad: HouseAd) => void;
  onDelete: (id: string) => void;
}

export const HouseAdCard: React.FC<HouseAdCardProps> = ({ ad, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format price helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Create WhatsApp URL helper
  const getWhatsappUrl = (phone: string, title: string) => {
    const text = encodeURIComponent(`Olá! Vi o anúncio da casa "${title}" no portal ALUGUEL DE CASA PARNAÍBA PIAUÍ DIVULGAÇÕES e gostaria de saber as condições de locação.`);
    return `https://wa.me/55${phone.replace(/\D/g, '')}?text=${text}`;
  };

  const isMensal = ad.tipoLocacao === 'Mensal';

  return (
    <div 
      id={`ad-card-${ad.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      {/* House Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          id={`ad-image-${ad.id}`}
          src={ad.imageUrl || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600'} 
          alt={ad.title} 
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Rent Type Tag (Temporada vs Mensal) */}
        <div className={`absolute top-3 left-3 rounded-lg px-2.5 py-1 text-2xs font-extrabold uppercase tracking-wider text-white shadow-xs backdrop-blur-sm ${
          isMensal ? 'bg-indigo-600/90' : 'bg-amber-600/90'
        }`}>
          {isMensal ? 'Mensal' : 'Temporada'}
        </div>

        {/* Action Controls (Edit & Delete visible on the ad) */}
        <div 
          id={`ad-actions-${ad.id}`}
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl bg-slate-950/70 p-1.5 backdrop-blur-sm"
        >
          <button
            id={`btn-edit-ad-${ad.id}`}
            type="button"
            onClick={() => onEdit(ad)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-transform active:scale-95"
            title="Editar"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            id={`btn-delete-ad-${ad.id}`}
            type="button"
            onClick={() => onDelete(ad.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-transform active:scale-95"
            title="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        
        {/* Price & Advertiser Segment */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {formatPrice(ad.price)}
            <span className="text-xs font-normal text-slate-400">/{isMensal ? 'mensal' : 'diária'}</span>
          </div>

          <div className="inline-flex items-center gap-1 text-2xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-full uppercase">
            {ad.anunciante === 'Particular' ? (
              <>
                <User className="h-3 w-3 text-emerald-500" />
                <span>Particular</span>
              </>
            ) : (
              <>
                <Building className="h-3 w-3 text-indigo-500" />
                <span>Imobiliária</span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 id={`ad-title-${ad.id}`} className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {ad.title}
          </h3>
          <div className="flex items-center gap-1 text-2xs text-slate-400 dark:text-slate-500 mt-1 md:mt-0 font-medium">
            <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
            <span className="truncate">{ad.bairro}, Parnaíba - PI {ad.showExactAddress && ad.enderecoCompleto ? `• ${ad.enderecoCompleto}, nº ${ad.numeroCasa || 'S/N'}` : ''}</span>
          </div>
        </div>

        {/* Key Housing Specs Line (exactly as defined inside user mock text) */}
        <div id={`ad-bullet-specs-${ad.id}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-b border-slate-50 dark:border-slate-800/60 py-2">
          <span>{ad.bedrooms} {ad.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>{ad.bathrooms} {ad.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
          {ad.garage === 'Sim' && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Vaga ({ad.garageCount} {ad.garageCount === 1 ? 'carro' : 'carros'})</span>
            </>
          )}
          {ad.petFriendly && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 gap-0.5">
                <Heart className="h-3 w-3 fill-emerald-600/30" /> Pets OK
              </span>
            </>
          )}
        </div>

        {/* Description & Advanced Info */}
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
          <p className={showDetails ? "" : "line-clamp-2"}>
            {ad.description}
          </p>
          {showDetails && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-3xs">
              <div><strong className="text-slate-700 dark:text-slate-300">Contato:</strong> {ad.nomeContato || 'Anunciante'}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">Quantidade de Salas:</strong> {ad.salas}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">Quantidade de Cozinhas:</strong> {ad.cozinhas}</div>
              {ad.area && <div><strong className="text-slate-700 dark:text-slate-300">Área Privativa:</strong> {ad.area} m²</div>}
              {ad.enderecoCompleto && <div><strong className="text-slate-700 dark:text-slate-300">Região:</strong> {ad.bairro} ({ad.enderecoCompleto})</div>}
            </div>
          )}
        </div>

        {/* Action triggers */}
        <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
          {/* Toggle details accordion */}
          <button
            id={`btn-toggle-details-${ad.id}`}
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 text-xs font-semibold"
          >
            {showDetails ? (
              <>
                <span>Fechar Detalhes</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Ver Detalhes →</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          {/* Direct WhatsApp Message Contact */}
          <a
            id={`ad-contact-whatsapp-${ad.id}`}
            href={getWhatsappUrl(ad.whatsapp, ad.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-xs"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-white/10" />
            <span>Falar c/ Anunciante</span>
          </a>
        </div>
      </div>
    </div>
  );
};
