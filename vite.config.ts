import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages servíruje projektový web z /<jmeno-repa>/, ne z kořene.
// Jméno se bere z proměnné BASE_PATH, kterou nastavuje deploy workflow;
// při `npm run dev` zůstává '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { port: 5181 },
})
