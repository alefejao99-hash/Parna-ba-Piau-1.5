/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HouseAd {
  id: string;
  title: string;
  price: number;
  description: string;
  bairro: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in m²
  imageUrl: string;
  whatsapp: string; // Contact phone / whatsapp
  createdAt: string;
  
  // Custom Rent details requested
  tipoLocacao: 'Mensal' | 'Temporada';
  anunciante: 'Particular' | 'Imobiliária';
  nomeContato: string;
  enderecoCompleto?: string;
  numeroCasa?: string;
  showExactAddress?: boolean;
  garage: 'Sim' | 'Não';
  garageCount: number;
  salas: number;
  cozinhas: number;
  petFriendly: boolean;
}

export type BairroType = 'Centro Histórico' | 'Planalto' | 'João XXIII' | 'Reis Veloso' | 'Coqueiro' | 'Cantagalo' | 'Piauí' | 'Fátima';
