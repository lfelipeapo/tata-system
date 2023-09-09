"use strict";
import axios from "axios";

const BASE_URL = "http://localhost:5001";

const lexmlApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const getLeis = async (params) => {
  return await lexmlApi.get("/scrape", { params });
};
