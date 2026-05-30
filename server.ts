/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. API: Organize unstructured house text with Gemini AI
app.post('/api/gemini/organize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto de entrada inválido.' });
    }

    if (!ai) {
      // Fallback fallback if no API key is provided
      return res.json({
        title: 'Casa para Alugar',
        price: 1200,
        bairro: 'Centro Histórico',
        description: text,
        bedrooms: 2,
        bathrooms: 1,
        area: 100,
        whatsapp: '86999999999',
        garage: 'Sim',
        garageCount: 1,
        salas: 1,
        cozinhas: 1,
        petFriendly: true,
        anunciante: 'Particular',
        nomeContato: 'Anunciante',
        tipoLocacao: 'Mensal'
      });
    }

    const prompt = `Analise a seguinte descrição de imóvel em Parnaíba - PI e extraia/organize as informações estruturadas em JSON. Se o dado não for mencionado, forneça um valor padrão inteligente coerente.
Atribua o "bairro" a uma destas opções exatas de Parnaíba: "Centro Histórico", "Planalto", "João XXIII", "Reis Veloso", "Coqueiro", "Cantagalo", "Piauí", "Fátima".

Texto para analisar:
"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um corretor de imóveis especializado em Parnaíba (PI). Seu trabalho é ler textos livres sobre casas de aluguel e organizá-los estritamente no esquema JSON fornecido. Certifique-se de que o preço seja um número inteiro redondo representando o valor total do aluguel.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título atraente e curto de até 40 caracteres.' },
            price: { type: Type.INTEGER, description: 'Valor numérico do aluguel.' },
            bairro: { type: Type.STRING, description: 'Bairro exato em Parnaíba.' },
            description: { type: Type.STRING, description: 'Uma descrição limpa do imóvel.' },
            bedrooms: { type: Type.INTEGER, description: 'Número de quartos.' },
            bathrooms: { type: Type.INTEGER, description: 'Número de banheiros.' },
            area: { type: Type.INTEGER, description: 'Área aproximada em metros quadrados.' },
            whatsapp: { type: Type.STRING, description: 'Telefone ou whatsapp no formato DDD+Numero apenas dígitos.' },
            garage: { type: Type.STRING, description: '"Sim" ou "Não".' },
            garageCount: { type: Type.INTEGER, description: 'Número de vagas de garagem.' },
            salas: { type: Type.INTEGER, description: 'Quantidade de salas.' },
            cozinhas: { type: Type.INTEGER, description: 'Quantidade de cozinhas.' },
            petFriendly: { type: Type.BOOLEAN, description: 'true se aceita animais de estimação, false do contrário.' },
            anunciante: { type: Type.STRING, description: '"Particular" ou "Imobiliária".' },
            nomeContato: { type: Type.STRING, description: 'Nome do anunciante/contato principal.' },
            tipoLocacao: { type: Type.STRING, description: '"Mensal" ou "Temporada".' },
          },
          required: ['title', 'price', 'bairro', 'description', 'bedrooms', 'bathrooms', 'area', 'whatsapp', 'garage', 'garageCount', 'salas', 'cozinhas', 'petFriendly', 'anunciante', 'nomeContato', 'tipoLocacao'],
        },
      },
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error('Erro na rota /api/gemini/organize:', error);
    res.status(500).json({ error: error.message || 'Erro ao organizar dados com IA.' });
  }
});

// 2. API: Generate an optimized description with Gemini AI
app.post('/api/gemini/describe', async (req, res) => {
  try {
    const { title, bairro, bedrooms, bathrooms, area, amenities, tipoLocacao, price } = req.body;

    if (!ai) {
      return res.json({
        description: `Excelente imóvel para aluguel ${tipoLocacao === 'Temporada' ? 'por temporada' : 'mensal'} no bairro ${bairro || 'Centro'} em Parnaíba, PI. O imóvel possui ${bedrooms || 2} quartos, ${bathrooms || 1} banheiros e uma área total de ${area || 100}m². Ideal para quem busca conforto e comodidade. Entre em contato para mais informações!`,
      });
    }

    const prompt = `Crie uma descrição detalhada de locação comercial/residencial no modelo brasileiro para o seguinte imóvel em Parnaíba (PI):
Título do anúncio: ${title || 'Casa para Alugar'}
Bairro: ${bairro || 'Centro'}
Tipo de Aluguel: ${tipoLocacao || 'Mensal'} (Valor: R$ ${price || 'A combinar'})
Características do imóvel: ${bedrooms || 2} quartos, ${bathrooms || 1} banheiros, Área de ${area || '100'}m². 
Mais detalhes / adicionais: ${amenities || 'Bem localizada, ventilada e confortável'}.

Escreva um texto atraente de 2 a 3 parágrafos, sem mentir sobre o imóvel, destacando a brisa agradável de Parnaíba, a proximidade com comércios ou atrativos da região.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um redator imobiliário experiente de Parnaíba, Piauí. Seus textos são convidativos, realistas, respeitosos e focados em destacar o potencial do imóvel para aluguel residencial mensal ou de férias/temporada.',
      },
    });

    res.json({ description: response.text?.trim() || '' });
  } catch (error: any) {
    console.error('Erro na rota /api/gemini/describe:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar descrição com IA.' });
  }
});

async function main() {
  // Vite integration for dev vs prod running rules
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Server startup failed:', err);
});
