/// <reference types="vite/client" />
/// <reference types="leaflet" />

// Vue components
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  
  // Vue Leaflet
  declare module '@vue-leaflet/vue-leaflet'