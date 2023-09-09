'use strict'
import axios from 'axios';

const BASE_URL = 'https://legis.senado.leg.br/dadosabertos';

const senadoApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json'
  }
});

export const getNormas = async (params) => {
  return await senadoApi.get('/legislacao/lista.json', { params });
};

export const getTermos = async (params) => {
  return await senadoApi.get('/legislacao/termos.json', { params });
};

export const getTiposNorma = async () => {
  return await senadoApi.get('/legislacao/tiposNorma.json');
};

export const getTiposPublicacao = async () => {
  return await senadoApi.get('/legislacao/tiposPublicacao.json');
};

export const getTiposVide = async () => {
  return await senadoApi.get('/legislacao/tiposVide.json');
};

export const getNormaByCodigo = async (codigo, params) => {
  return await senadoApi.get(`/legislacao/${codigo}.json`, { params });
};

export const getTiposDeclaracaoDetalhe = async () => {
  return await senadoApi.get('/legislacao/tiposdeclaracao/detalhe.json');
};

export const getNormaDetails = async (tipo, numdata, anoseq, params) => {
  return await senadoApi.get(`/legislacao/${tipo}/${numdata}/${anoseq}.json`, { params });
};
