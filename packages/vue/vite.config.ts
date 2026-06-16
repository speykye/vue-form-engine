import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'VueFormEngine',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['vue', '@speykye/vue-form-engine-core']
    }
  }
});
