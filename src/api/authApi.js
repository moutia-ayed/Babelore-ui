import axiosClient from "./axiosClient";

export const loginRequest = (email, password) =>
  axiosClient.post("/auth/login", { email, password });

export const registerRequest = (fullName, email, password) =>
  axiosClient.post("/auth/register", { fullName, email, password });