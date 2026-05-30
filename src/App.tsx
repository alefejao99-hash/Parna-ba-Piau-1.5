/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HouseAd, BairroType } from './types';
import { INITIAL_ADS } from './initialAds';
import { HouseAdCard } from './components/HouseAdCard';
import { AdModal } from './components/AdModal';
import { DeleteDialog } from './components/DeleteDialog';
import { Header } from './components/Header';
import { 
  Building, 
  Search, 
  MapPin, 
  Coins, 
  SlidersHorizontal, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  AlertOctagon, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Compass, 
  HelpCircle,
  Megaphone,
  UserCheck
} from 'lucide-react';

// Import our beautiful backdrop of colonial houses in Parnaíba Piauí
import parnaibaHousesBg from './assets/images/parnaiba_houses_1780145541340.png';

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

const WHATSAPP_GROUP = 'https://chat.whatsapp.com/EYcNd2i0bti4tEUQgfIY8h?s=cl&p=a&mlu=1';
const FACEBOOK_GROUP = 'https://www.facebook.com/groups/parnaibadivulgacoes';

// Compra e Vendas group links requested by the user
const COMPRA_VENDAS_WA = 'https://tr.ee/_vp-pq6naZ';
const COMPRA_VENDAS_FB = 'https://www.facebook.com/share/g/1B2NpaQ8zZ/';

// Rodapé/Affiliates group requested by the user
const ACHADINHOS_GROUP_WA = 'https://chat.whatsapp.com/Lf3yyMFdpxd36JI2V3PJQ3?s=cl&p=a&mlu=1';

export default function App() {
  const [ads, setAds] = useState<HouseAd[]>([]);
  
  // Filtering and Searching States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBairro, setSelectedBairro] = useState<string>('Todos');
  const [selectedTipoLocacao, setSelectedTipoLocacao] = useState<'Todos' | 'Temporada' | 'Mensal'>('Todos');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Voting poll states (Persisted in localStorage)
  const [votosGostaram, setVotosGostaram] = useState<number>(0);
  const [votosNaoCurtem, setVotosNaoCurtem] = useState<number>(0);
  const [userVoted, setUserVoted] = useState<boolean>(false);

  // Animated Joined WhatsApp Counter
  const [joinedCounter, setJoinedCounter] = useState<number>(142);

  // Modals and Delete Dialog States
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<HouseAd | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adToDeleteId, setAdToDeleteId] = useState<string | null>(null);

  // Load state and counters on mount
  useEffect(() => {
    // 1. Ads
    const savedAds = localStorage.getItem('parnaiba_classifieds_ads');
    if (savedAds) {
      try {
        setAds(JSON.parse(savedAds));
      } catch (e) {
        console.error('Erro ao ler anúncios. Carregando iniciais.', e);
        setAds(INITIAL_ADS);
      }
    } else {
      setAds(INITIAL_ADS);
    }

    // 2. Poll counts
    const savedPolG = localStorage.getItem('votos_gostaram');
    const savedPolN = localStorage.getItem('votos_nao_curtem');
    const savedVoted = localStorage.getItem('user_voted_poll');
    if (savedPolG) setVotosGostaram(Number(savedPolG));
    else setVotosGostaram(38); // nice starting base

    if (savedPolN) setVotosNaoCurtem(Number(savedPolN));
    else setVotosNaoCurtem(2);

    if (savedVoted) setUserVoted(JSON.parse(savedVoted));

    // Simulated increment for active user group entries
    const interval = setInterval(() => {
      setJoinedCounter(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Save changes to ads in state and storage
  const saveAdsList = (updated: HouseAd[]) => {
    setAds(updated);
    localStorage.setItem('parnaiba_classifieds_ads', JSON.stringify(updated));
  };

  // Voting poll functionality
  const handleVote = (type: 'like' | 'dislike') => {
    if (userVoted) {
      alert('Você já deixou seu voto rápido hoje! Obrigado por participar.');
      return;
    }
    if (type === 'like') {
      const updated = votosGostaram + 1;
      setVotosGostaram(updated);
      localStorage.setItem('votos_gostaram', String(updated));
    } else {
      const updated = votosNaoCurtem + 1;
      setVotosNaoCurtem(updated);
      localStorage.setItem('votos_nao_curtem', String(updated));
    }
    setUserVoted(true);
    localStorage.setItem('user_voted_poll', 'true');
  };

  // Register or edit submissions
  const handleAdSubmit = (adData: Omit<HouseAd, 'id' | 'createdAt'>) => {
    if (editingAd) {
      const updated = ads.map(a => 
        a.id === editingAd.id 
          ? { ...a, ...adData, title: adData.title.trim(), description: adData.description.trim() }
          : a
      );
      saveAdsList(updated);
      setEditingAd(null);
    } else {
      const newAd: HouseAd = {
        ...adData,
        id: Math.random().toString(36).substring(2, 9),
        title: adData.title.trim(),
        description: adData.description.trim(),
        createdAt: new Date().toISOString()
      };
      saveAdsList([newAd, ...ads]);
    }
  };

  const handleEditClick = (ad: HouseAd) => {
    setEditingAd(ad);
    setIsAdModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAdToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (adToDeleteId) {
      const filtered = ads.filter(a => a.id !== adToDeleteId);
      saveAdsList(filtered);
      setAdToDeleteId(null);
    }
  };

  // Apply filters seamlessly
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.nomeContato && ad.nomeContato.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBairro = selectedBairro === 'Todos' || ad.bairro === selectedBairro;
    const matchesTipo = selectedTipoLocacao === 'Todos' || ad.tipoLocacao === selectedTipoLocacao;
    const matchesMaxPrice = !maxPrice || ad.price <= maxPrice;

    return matchesSearch && matchesBairro && matchesTipo && matchesMaxPrice;
  });

  const getAdTitleToDelete = () => {
    if (!adToDeleteId) return '';
    return ads.find(a => a.id === adToDeleteId)?.title || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Header element */}
      <Header onAddAdClick={() => {
        setEditingAd(null);
        setIsAdModalOpen(true);
      }} />

      {/* Main Hero styled with Parnaíba, Piauí traditional houses backdrop */}
      <section className="relative w-full overflow-hidden bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background photo aligns to Parnaíba Piauí houses prompt */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={parnaibaHousesBg}
            alt="Fachadas Coloniais de Parnaíba PI"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-30 scale-102 blur-3xs"
          />
          {/* Shadow gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-indigo-950/45" />
        </div>

        {/* Hero content markup */}
        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-3xs font-extrabold text-emerald-400 border border-emerald-500/20 uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span>Grupo Oficial de Divulgação - Parnaíba / PI</span>
          </motion.div>

          <h2 className="text-2xl font-black tracking-tight text-white sm:text-5xl uppercase leading-none">
            🏠 ALUGUEL DE CASA <br />
            <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              PARNAÍBA PI DIVULGAÇÃO
            </span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            O seu portal 100% gratuito para encontrar ou anunciar casas de temporada e locação mensal em Parnaíba e região. Cadastre o seu imóvel em poucos segundos e compartilhe diretamente no nosso grupo de divulgação do WhatsApp!
          </p>

          {/* Call to actions segment */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <button
              onClick={() => {
                setEditingAd(null);
                setIsAdModalOpen(true);
              }}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3.5 transition-all shadow-md shadow-emerald-950/30 flex items-center gap-2"
            >
              <span>Cadastrar Meu Imóvel Grátis 🏠</span>
            </button>
            <a
              href={WHATSAPP_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 font-bold text-xs px-6 py-3.5 transition-all flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Entrar no Grupo de WhatsApp 💬</span>
            </a>
          </div>

          {/* Quick Search & Filtering Console */}
          <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl bg-white p-3 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Text Search */}
              <div className="relative flex-1">
                <Search className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Pesquisar por título, bairro ou comodidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 pl-11 pr-4 py-3 text-xs text-slate-850 outline-hidden border border-transparent focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Advanced Filter Action button */}
              <div className="flex gap-2">
                <button
                  id="btn-toggle-filters"
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    showFilters 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>

            {/* Quick Rental Type tabs (Todos, Temporada, Mensal) */}
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-850 justify-start">
              <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider mr-2">Tipo:</span>
              {(['Todos', 'Temporada', 'Mensal'] as const).map(tipo => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setSelectedTipoLocacao(tipo)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    selectedTipoLocacao === tipo 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>

            {/* Advanced Filters Expandable Drawer */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden text-left"
                >
                  <div className="grid grid-cols-1 gap-4 pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 sm:grid-cols-2">
                    {/* Bairro selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        Bairro em Parnaíba
                      </label>
                      <select
                        value={selectedBairro}
                        onChange={(e) => setSelectedBairro(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Todos">Todos os bairros</option>
                        {BAIRROS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-emerald-500" />
                        Preço Máximo (R$)
                      </label>
                      <input
                        type="number"
                        placeholder="Qualquer valor"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Main Container Layout */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left segment - Listings (Col-span 8) */}
        <main className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Header area of listings */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
                Casas Disponíveis para Locação
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mostrando <strong className="font-bold text-slate-700 dark:text-slate-300">{filteredAds.length}</strong> encontrados
              </p>
            </div>

            {/* Reset Defaults & filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBairro('Todos');
                setSelectedTipoLocacao('Todos');
                setMaxPrice('');
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Cards list */}
          <AnimatePresence mode="popLayout">
            {filteredAds.length > 0 ? (
              <div 
                id="listings-grid" 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                {filteredAds.map((ad) => (
                  <motion.div
                    key={ad.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HouseAdCard 
                      ad={ad} 
                      onEdit={handleEditClick} 
                      onDelete={handleDeleteClick} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                id="empty-results"
                className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Building className="h-12 w-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum imóvel disponível nestas condições</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm leading-relaxed">
                  Não encontramos correspondência para os filtros definidos. Crie o seu anúncio grátis usando o botão superior!
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* "Quer Anunciar?" banner box */}
          <section className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-2xl text-white text-left shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md text-3xs font-extrabold uppercase tracking-widest">
              Quer Anunciar?
            </span>
            <p className="text-sm font-extrabold mt-3 max-w-md text-white">
              Anuncie sua casa ou quarto para aluguel de forma 100% gratuita neste site e apareça para milhares de pessoas!
            </p>
            <button
              onClick={() => {
                setEditingAd(null);
                setIsAdModalOpen(true);
              }}
              className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 transition-all shadow-xs"
            >
              Anunciar Grátis Agora
            </button>
          </section>

          {/* AVISO IMPORTANTE SOBRE GOLPES */}
          <section className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-6 border border-rose-100 dark:border-rose-900/30 text-left space-y-4">
            <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              🚨 ATENÇÃO – AVISO IMPORTANTE SOBRE GOLPES 🚨
            </h3>
            
            <p className="text-xs text-rose-600 dark:text-rose-300 leading-relaxed font-semibold">
              Pessoal, fiquem atentos! Identificamos possíveis tentativas de golpe no grupo.
            </p>

            <div className="space-y-2.5 pt-1.5">
              <h4 className="text-3xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                ⚠️ ORIENTAÇÕES IMPORTANTES:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Não faça pagamentos adiantados</strong> sem ver o imóvel pessoalmente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Não confie</strong> em ofertas com preço muito abaixo do normal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Evite negociar</strong> fora do grupo de divulgação sem segurança.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sempre peça</strong> fotos reais, endereço definitivo e, se possível, visite o local.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Desconfie</strong> de perfis novos ou com poucas informações associadas.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-rose-200/40">
              <h4 className="text-3xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                🚫 PROIBIDO NO GRUPO:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertOctagon className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Golpistas serão removidos</strong> imediatamente sem direito a reingresso.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertOctagon className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Contas suspeitas</strong> serão denunciadas de forma rígida às autoridades.</span>
                </li>
                <li className="flex items-start gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Nosso objetivo</strong> é manter o grupo seguro e produtivo para todos os piauienses!</span>
                </li>
              </ul>
            </div>

            <p className="text-2xs text-rose-500 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-950/40 p-3 rounded-xl leading-relaxed">
              📢 Se você identificar algo suspeito, avise imediatamente o administrador do grupo ou fale diretamente com nosso canal de apoio. Fiquem atentos e não caiam em golpes!
            </p>
          </section>

        </main>

        {/* Right segment - Group info, Voting Widget, Buy-Sell links (Col-span 4) */}
        <aside className="lg:col-span-4 flex flex-col space-y-6 text-left">
          
          {/* Grupo oficial card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              Grupo de Divulgação
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Receba avisos diários de novas casas e participe da comunidade ativa de locatários.
            </p>

            {/* Simulated Live Joined Counter */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-3xs font-extrabold text-slate-400 uppercase block">Quem está entrando:</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{joinedCounter} pessoas</span>
                <span className="text-[10px] text-slate-400 font-medium">já entraram no grupo hoje</span>
              </div>
            </div>

            <a
              href={WHATSAPP_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-extrabold text-white transition-all shadow-xs"
            >
              <MessageSquare className="h-4 w-4 fill-white/10" />
              <span>Entrar no Grupo Oficial 💬</span>
            </a>
          </div>

          {/* Buy and sell local groups */}
          <div className="bg-gradient-to-tr from-indigo-950 to-slate-900 border-2 border-indigo-500/40 p-5 rounded-2xl shadow-md text-white space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 h-16 w-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-1 relative z-10 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 border border-indigo-500/20">
                🚨 GRUPOS ATIVOS
              </span>
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                🛒 COMPRA E VENDAS PARNAÍBA PI 🇧🇷
              </h3>
              <p className="text-3xs text-slate-300 leading-relaxed font-semibold">
                Participe dos canais mais movimentados da região e feche negócios rapidamente com total visibilidade!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1 relative z-10">
              {/* WhatsApp Compra e Vendas Link */}
              <a
                href={COMPRA_VENDAS_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start justify-between rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 p-4 transition-all duration-300 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/20"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-50 bg-white/10 px-2 py-0.5 rounded-sm">
                    GRUPO WHATSAPP 📲
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                  </span>
                </div>
                <div className="flex w-full items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm font-black text-white">
                    🛒 COMPRA E VENDAS 🤝🇧🇷
                  </span>
                  <Compass className="h-4 w-4 text-white shrink-0 group-hover:rotate-45 transition-transform" />
                </div>
                <span className="text-[9px] font-bold text-emerald-200 mt-1 uppercase">CLIQUE PARA ENTRAR NO GRUPO ➡</span>
              </a>

              {/* Facebook Compra e Vendas Link */}
              <a
                href={COMPRA_VENDAS_FB}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start justify-between rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 hover:opacity-95 p-4 transition-all duration-300 shadow-lg shadow-blue-950/40 hover:scale-[1.02] active:scale-[0.98] border border-blue-400/20"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-50 bg-white/10 px-2 py-0.5 rounded-sm">
                    GRUPO FACEBOOK 📲
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-300"></span>
                  </span>
                </div>
                <div className="flex w-full items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm font-black text-white">
                    🛒 COMPRA E VENDAS 🤝🇧🇷
                  </span>
                  <Share2 className="h-4 w-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[9px] font-bold text-blue-200 mt-1 uppercase">CLIQUE PARA PARTICIPAR DO FACEBOOK ➡</span>
              </a>
            </div>
          </div>

          {/* Voting General Rating / Avaliação Geral module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              Avaliação Geral
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              As pessoas estão gostando e curtindo o grupo? Dê seu voto rápido!
            </p>

            {/* Voting buttons */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleVote('like')}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  userVoted ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-slate-200'
                }`}
              >
                <ThumbsUp className="h-5 w-5 text-emerald-500 mb-1" />
                <span className="text-xs font-extrabold text-slate-750 dark:text-slate-200">{votosGostaram}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Gostaram</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote('dislike')}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  userVoted ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900' : 'hover:bg-rose-50 dark:hover:bg-rose-950/20 border-slate-200'
                }`}
              >
                <ThumbsDown className="h-5 w-5 text-rose-500 mb-1" />
                <span className="text-xs font-extrabold text-slate-755 dark:text-slate-200">{votosNaoCurtem}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Não curtem</span>
              </button>
            </div>
            {userVoted && (
              <p className="text-3xs text-emerald-600 dark:text-emerald-400 text-center font-bold">
                ✓ Seu voto e opinião importam! Obrigado pelo voto.
              </p>
            )}
          </div>

          {/* Quick instructions/Affiliates footer box */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border-2 border-orange-500/30 text-xs text-slate-600 leading-relaxed space-y-2 dark:from-amber-950/25 dark:to-orange-950/25 dark:border-orange-850/40">
            <span className="font-extrabold text-orange-600 dark:text-orange-400 uppercase flex items-center gap-1 text-xs">
              <Megaphone className="h-4 w-4 text-orange-500 animate-bounce" /> BASS COMPRE MAIS ACHADINHO 🛍️
            </span>
            <p className="text-3xs sm:text-2xs font-medium">Encontre as melhores ofertas, produtos sensacionais e promoções imperdíveis selecionadas diretamente para economizar de verdade no grupo oficial!</p>
            <a
              href={ACHADINHOS_GROUP_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-4 py-2.5 transition-all shadow-md shadow-orange-950/20"
            >
              <span>Promoções WhatsApp 🛍️</span>
            </a>
          </div>

        </aside>

      </div>

      {/* NOVO BANNER SUPER DESTACADO PARA O GRUPO DE ACHADINHOS NO RODAPÉ (DE PONTA A PONTA) */}
      <section className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 py-8 text-white shadow-xl relative overflow-hidden">
        
        {/* Decorative glowing backdrops */}
        <div className="absolute -top-10 -left-10 h-40 w-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Content info */}
          <div className="space-y-3 text-left max-w-3xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-3xs font-extrabold uppercase tracking-wider text-yellow-100">
              ⚡ PARCERIA DE OFERTAS COMPRE MAIS
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              🛍️ BASS COMPRE MAIS ACHADINHO
            </h3>
            <p className="text-xs sm:text-sm text-yellow-50 leading-relaxed max-w-2xl font-medium">
              Entre no melhor grupo de descontos e promoções imperdíveis da internet! Receba diariamente links de produtos com os menores preços testados, cupons exclusivos e achadinhos inesquecíveis para economizar muito.
            </p>
          </div>

          {/* CTA Button */}
          <div className="shrink-0 w-full md:w-auto text-center">
            <a
              href={ACHADINHOS_GROUP_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full md:w-auto items-center justify-center gap-2.5 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] px-8 py-4 text-xs sm:text-sm font-black transition-all shadow-lg"
            >
              <span>PARTICIPAR DO GRUPO DO WHATSAPP ➡</span>
            </a>
          </div>
        </div>
      </section>

      {/* Elegant minimalist region details footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/50 py-8 dark:border-slate-800 dark:bg-slate-950/40 text-center">
        <div id="footer-text-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-3xs text-slate-400 dark:text-slate-500 space-y-2">
          <p>© 2026 Aluguel de Casa e Temporada Parnaíba PI. Todos os direitos reservados.</p>
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            <span>Redes Ativas de Divulgação:</span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">Planalto</span> •
            <span className="font-semibold text-slate-500 dark:text-slate-400">Coqueiro</span> •
            <span className="font-semibold text-slate-500 dark:text-slate-400">Centro Histórico</span> •
            <span className="font-semibold text-slate-500 dark:text-slate-400">Reis Veloso</span> •
            <span className="font-semibold text-slate-500 dark:text-slate-400">João XXIII</span> •
            <span className="font-semibold text-slate-500 dark:text-slate-400">Fátima</span>
          </p>
        </div>
      </footer>

      {/* Create / Edit Modals */}
      <AdModal
        isOpen={isAdModalOpen}
        onClose={() => {
          setIsAdModalOpen(false);
          setEditingAd(null);
        }}
        onSubmit={handleAdSubmit}
        editingAd={editingAd}
      />

      {/* Delete Confirmation popup */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setAdToDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        adTitle={getAdTitleToDelete()}
      />

    </div>
  );
}
