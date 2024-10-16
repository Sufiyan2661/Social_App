// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer'; // Import the visualizer plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ 
      open: true, // Automatically open the visualizer in your browser after build
      filename: 'bundle-visualization.html' // Output file for visualization
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Customize chunking based on file paths
          if (id.includes('node_modules')) {
            return 'vendor'; // Group all node_modules into a single vendor chunk
          }
          // You can add more conditions for other specific chunks if needed
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Set the chunk size warning limit to 1000 KB
  },
});

