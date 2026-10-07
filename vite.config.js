import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        calculator: resolve(import.meta.dirname, 'calculator.html'),
        factories: resolve(import.meta.dirname, 'factories.html'),
        laboratory: resolve(import.meta.dirname, 'laboratory.html'),
        projects: resolve(import.meta.dirname, 'projects.html'),
        contacts: resolve(import.meta.dirname, 'contacts.html'),
        productDetails: resolve(import.meta.dirname, 'product-details.html'),
      },
    },
  },
});

