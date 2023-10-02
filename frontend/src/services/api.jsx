import axios from "axios"
const BACKEND_URL = import.meta.env.BACKEND_APP || "http://localhost:8000";
const api = axios.create({
    baseURL: BACKEND_URL
})

export { api }
