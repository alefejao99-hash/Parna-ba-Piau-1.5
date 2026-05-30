/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HouseAd, BairroType } from '../types';
import { X, Save, Image as ImageIcon, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adData: Omit<HouseAd, 'id' | 'createdAt'>) => void;
  editingAd?: HouseAd | null;
}

const BAIRROS: BairroType[] = [
  'Centro Histórico',
  'Planalto',
  'João XXIII',
  'Reis Veloso',
  'Coqueiro',
  'Cantagalo',
  'Piauí',
  'Fátima',
];

const IMAGE_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600', label: 'Casarão Centro Histórico' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600', label: 'Planalto Moderna c/ Piscina' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', label: 'Duplex Reis Veloso' },
  { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600', label: 'Chalé Praia Coqueiro' },
  { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600', label: 'Casa de Campo Varanda' },
];

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onSubmit, editingAd }) => {
  // AI assist input
  const [aiText, setAiText] = useState('');
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [bairro, setBairro] = useState<BairroType>('Centro Histórico');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [area, setArea] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Customized fields requested
  const [tipoLocacao, setTipoLocacao] = useState<'Mensal' | 'Temporada'>('Mensal');
  const [anunciante, setAnunciante] = useState<'Particular' | 'Imobiliária'>('Particular');
  const [nomeContato, setNomeContato] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [showExactAddress, setShowExactAddress] = useState(true);
  const [garage, setGarage] = useState<'Sim' | 'Não'>('Sim');
  const [garageCount, setGarageCount] = useState<number>(1);
  const [salas, setSalas] = useState<number>(1);
  const [cozinhas, setCozinhas] = useState<number>(1);
  const [petFriendly, setPetFriendly] = useState<boolean>(true);

  // Toggle View for Presets Gallery
  const [showPresets, setShowPresets] = useState(true);

  // Synchronize when opening or editing
  useEffect(() => {
    if (editingAd) {
      setTitle(editingAd.title);
      setPrice(editingAd.price);
      setDescription(editingAd.description);
      setBairro(editingAd.bairro as BairroType);
      setBedrooms(editingAd.bedrooms);
      setBathrooms(editingAd.bathrooms);
      setArea(editingAd.area);
      setImageUrl(editingAd.imageUrl);
      setWhatsapp(editingAd.whatsapp);

      setTipoLocacao(editingAd.tipoLocacao || 'Mensal');
      setAnunciante(editingAd.anunciante || 'Particular');
      setNomeContato(editingAd.nomeContato || '');
      setEnderecoCompleto(editingAd.enderecoCompleto || '');
      setNumeroCasa(editingAd.numeroCasa || '');
      setShowExactAddress(editingAd.showExactAddress !== false);
      setGarage(editingAd.garage || 'Sim');
      setGarageCount(editingAd.garageCount || 1);
      setSalas(editingAd.salas || 1);
      setCozinhas(editingAd.cozinhas || 1);
      setPetFriendly(editingAd.petFriendly !== false);
    } else {
      // Clear or defaults
      setTitle('');
      setPrice('');
      setDescription('');
      setBairro('Centro Histórico');
      setBedrooms(3);
      setBathrooms(1);
      setArea('');
      setImageUrl(IMAGE_PRESETS[0].url);
      setWhatsapp('');
      setTipoLocacao('Mensal');
      setAnunciante('Particular');
      setNomeContato('');
      setEnderecoCompleto('');
      setNumeroCasa('');
      setShowExactAddress(true);
      setGarage('Sim');
      setGarageCount(1);
      setSalas(1);
      setCozinhas(1);
      setPetFriendly(true);
    }
  }, [editingAd, isOpen]);

  if (!isOpen) return null;

  // 1. Organizar com IA
  const handleOrganizeWithIA = async () => {
    if (!aiText.trim()) {
      alert('Digite algumas informações para a IA organizar.');
      return;
    }
    setIsOrganizing(true);
    try {
      const response = await fetch('/api/gemini/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });
      if (!response.ok) throw new Error('Erro na chamada da API.');
      const data = await response.json();

      // Apply the fields
      if (data.title) setTitle(data.title);
      if (data.price) setPrice(data.price);
      if (data.bairro && BAIRROS.includes(data.bairro as BairroType)) {
        setBairro(data.bairro as BairroType);
      }
      if (data.description) setDescription(data.description);
      if (data.bedrooms) setBedrooms(data.bedrooms);
      if (data.bathrooms) setBathrooms(data.bathrooms);
      if (data.area) setArea(data.area);
      if (data.whatsapp) setWhatsapp(data.whatsapp);
      if (data.tipoLocacao) setTipoLocacao(data.tipoLocacao);
      if (data.anunciante) setAnunciante(data.anunciante);
      if (data.nomeContato) setNomeContato(data.nomeContato);
      if (data.garage) setGarage(data.garage);
      if (data.garageCount) setGarageCount(data.garageCount);
      if (data.salas) setSalas(data.salas);
      if (data.cozinhas) setCozinhas(data.cozinhas);
      if (typeof data.petFriendly === 'boolean') setPetFriendly(data.petFriendly);

      alert('Cadastro preenchido com sucesso pela IA! Por favor revise as abas antes de publicar.');
    } catch (e) {
      console.error(e);
      alert('Não foi possível processar com IA neste momento. Preencha manualmente ou use as opções padrão.');
    } finally {
      setIsOrganizing(false);
    }
  };

  // 2. Gerar descrição com IA
  const handleGenerateDescription = async () => {
    if (!title) {
      alert('Por favor, defina um Título curto antes para orientar a descrição da IA.');
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const response = await fetch('/api/gemini/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          bairro,
          bedrooms,
          bathrooms,
          area,
          tipoLocacao,
          price,
          amenities: `Garagem: ${garage}, Salas: ${salas}, Cozinhas: ${cozinhas}, Aceita Pet: ${petFriendly ? 'Sim' : 'Não'}`
        }),
      });
      if (!response.ok) throw new Error('Erro na API.');
      const data = await response.json();
      if (data.description) {
        setDescription(data.description);
      }
    } catch (e) {
      console.error(e);
      alert('Houve um contratempo ao gerar a descrição. Escreva manualmente abaixo.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description || !whatsapp || !nomeContato) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    onSubmit({
      title,
      price: Number(price),
      description,
      bairro,
      bedrooms,
      bathrooms,
      area: Number(area || 80),
      imageUrl: imageUrl || IMAGE_PRESETS[0].url,
      whatsapp,
      tipoLocacao,
      anunciante,
      nomeContato,
      enderecoCompleto: enderecoCompleto || 'Bairro ' + bairro,
      numeroCasa: numeroCasa || 'S/N',
      showExactAddress,
      garage,
      garageCount,
      salas,
      cozinhas,
      petFriendly
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="ad-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col my-8 max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800 shrink-0">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>🏠</span> {editingAd ? 'Editar Anúncio do Imóvel' : 'Publicar Novo Imóvel'}
            </h2>
            <p className="text-3xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              Anúncio Grátis • Portal Parnaíba PI
            </p>
          </div>
          <button
            id="close-modal-btn"
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          
          {/* SEÇÃO INTELIGENTE: ANÚNCIO POR IA */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 space-y-3">
            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
              🪄 Anúncio por IA (Mais Fácil)
            </h3>
            <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Utilize este recurso para transformar as informações do imóvel em um cadastro mais completo e organizado. A IA preencherá os campos automaticamente, mas o anunciante deve revisar os dados antes de publicar.
            </p>
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Exemplo para colar ou digitar: Casa para aluguel mensal no bairro de Fátima, com 3 quartos, 2 banheiros, ampla garagem, aceita pets, valor R$ 1.500 e falar com Carlos no fone 86 99999-9999..."
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={handleOrganizeWithIA}
                disabled={isOrganizing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition-all disabled:opacity-50"
              >
                {isOrganizing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Organizando Dados...</span>
                  </>
                ) : (
                  <>
                    <span>🪄 Organizar com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span>📷</span> 1. Fotos da Casa ou Imóvel *
            </h4>
            
            {/* Imagem Preview */}
            {imageUrl && (
              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img 
                  src={imageUrl} 
                  alt="Previa do imovel" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover" 
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-bold opacity-90">
                  Capa Ativa
                </div>
              </div>
            )}

            {/* Enviar Arquivo de Foto Local */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Escolher Foto do seu Aparelho (Arquivo) 📷
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        setImageUrl(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950/30 dark:file:text-emerald-400 cursor-pointer"
              />
            </div>

            {/* Link Customizado Ficticio ou Real */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ou cole o Link de uma Foto da Web (Opcional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... (Cole o link da foto terminada em .jpg ou .png)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
              />
            </div>

            {/* Presets Toggle & Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-extrabold text-slate-500 uppercase flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Fotos sugestivas da nossa galeria:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-xs text-indigo-600 font-bold dark:text-indigo-400"
                >
                  {showPresets ? 'Esconder Galeria' : 'Ver Galeria Sugerida'}
                </button>
              </div>

              {showPresets && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {IMAGE_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`group relative aspect-video overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                        imageUrl === preset.url ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/15' : 'border-transparent opacity-80'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                        <span className="text-[9px] font-semibold text-white leading-tight truncate">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              📍 2. Endereço Completo em Parnaíba
            </h4>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Rua / Avenida */}
              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Endereço (Rua, Avenida, Bairro de Parnaíba) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua Pires Rebelo, Bairro de Fátima"
                  value={enderecoCompleto}
                  onChange={(e) => setEnderecoCompleto(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
                />
              </div>

              {/* Numero */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Número da Casa / Apto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1420 ou S/N"
                  value={numeroCasa}
                  onChange={(e) => setNumeroCasa(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Bairro Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Bairro de Parnaíba *
              </label>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value as BairroType)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
              >
                {BAIRROS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Privacy Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-3xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl">
              <input
                type="checkbox"
                checked={showExactAddress}
                onChange={(e) => setShowExactAddress(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
              <span>Autorizo mostrar o endereço exato no anúncio e no mapa. Se deixar desmarcado, o site mostrará apenas o bairro/região aproximada para preservar a privacidade do proprietário.</span>
            </label>
          </div>

          {/* VALORES */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              💵 3. Valor do Aluguel
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Tipo de Cobrança */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tipo de Cobrança *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoLocacao('Mensal')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      tipoLocacao === 'Mensal'
                        ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Aluguel Mensal
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoLocacao('Temporada')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      tipoLocacao === 'Temporada'
                        ? 'bg-amber-600/10 border-amber-500 text-amber-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Aluguel por Temporada (Diário)
                  </button>
                </div>
              </div>

              {/* Valor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Valor Comercial (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={tipoLocacao === 'Mensal' ? 'Ex: 1200' : 'Ex: 250 (por dia)'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-4 py-2.5 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DETALHES INTERNOS */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              🛏️ 4. Detalhes Internos do Imóvel
            </h4>

            {/* Quartos e Banheiros */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantidade de quartos? *
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900"
                >
                  <option value={1}>1 Quarto</option>
                  <option value={2}>2 Quartos</option>
                  <option value={3}>3 Quartos</option>
                  <option value={4}>4 Quartos</option>
                  <option value={5}>5 Quartos ou mais</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantidade de banheiros? *
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900"
                >
                  <option value={1}>1 Banheiro</option>
                  <option value={2}>2 Banheiros</option>
                  <option value={3}>3 Banheiros</option>
                  <option value={4}>4 Banheiros</option>
                  <option value={5}>5 Banheiros ou mais</option>
                </select>
              </div>
            </div>

            {/* Garagem / Vaga */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Possui Garagem / Vaga de Carro? *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGarage('Sim');
                      if (garageCount === 0) setGarageCount(1);
                    }}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      garage === 'Sim'
                        ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🚙 Sim, possui vaga
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGarage('Não');
                      setGarageCount(0);
                    }}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      garage === 'Não'
                        ? 'bg-rose-600/10 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ❌ Não possui vaga
                  </button>
                </div>
              </div>

              {garage === 'Sim' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quantas vagas de garagem?
                  </label>
                  <select
                    value={garageCount}
                    onChange={(e) => setGarageCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4 ou mais</option>
                  </select>
                </div>
              )}
            </div>

            {/* Outros cômodos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantas salas? *
                </label>
                <select
                  value={salas}
                  onChange={(e) => setSalas(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900"
                >
                  <option value={0}>Não tem</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3 ou mais</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantas cozinhas? *
                </label>
                <select
                  value={cozinhas}
                  onChange={(e) => setCozinhas(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900"
                >
                  <option value={0}>Não tem</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3 ou mais</option>
                </select>
              </div>
            </div>

            {/* Pets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Aceita Pet / Animais?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPetFriendly(true)}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                    petFriendly ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setPetFriendly(false)}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                    !petFriendly ? 'bg-rose-600/10 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Área Aproximada (m²) *
              </label>
              <input
                type="number"
                placeholder="Ex: 120"
                value={area}
                onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* TÍTULO E DIVULGAÇÃO */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ✍️ 5. Título e Divulgação
            </h4>

            {/* Titulo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Título do Anúncio (Curto e Atraente) *
              </label>
              <input
                type="text"
                required
                maxLength={45}
                placeholder="Ex: Ótima casa mobiliada no Centro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            {/* Descricao */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição do imóvel *
                </label>
                
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDesc}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 disabled:opacity-50 hover:underline"
                >
                  {isGeneratingDesc ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      <span>Gerar descrição com IA</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                required
                rows={4}
                placeholder="Informe os principais detalhes do imóvel, como estado de conservação, localização, proximidades, diferenciais, regras da locação..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3.5 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* CONTATOS */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              📞 6. Informações de Contato
            </h4>

            {/* Tipo Anunciante & Nome */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tipo de Anunciante *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAnunciante('Particular')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      anunciante === 'Particular' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    👤 Particular
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnunciante('Imobiliária')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold border text-center transition-all ${
                      anunciante === 'Imobiliária' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🏢 Imobiliária
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quem é o Contato? (Nome) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={nomeContato}
                  onChange={(e) => setNomeContato(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                WhatsApp de Contato (DDD + Número) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 8699112233"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-hidden focus:border-emerald-500 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3 dark:border-slate-800 shrink-0">
            <button
              id="cancel-modal-btn"
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancelar
            </button>
            <button
              id="submit-modal-btn"
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/20"
            >
              <Save className="h-4 w-4" />
              <span>{editingAd ? 'Salvar Alterações' : 'Publicar Anúncio'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
