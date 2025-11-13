// Blink App - Color Palette
// Dark, modern, technological and mysterious vibe

export const colors = {
  // Primary Background - Dark Navy/Charcoal
  background: {
    primary: '#1A1A2E',      // Ana zemin - Koyu lacivert
    secondary: '#222831',     // Alternatif koyu gri
    card: '#16213E',          // Kart arka planı
    input: '#0F3460',         // Input arka planı
  },

  // Accent Colors - Electric Blue/Cyan
  accent: {
    primary: '#00FFFF',       // Elektrik mavisi (Cyan)
    secondary: '#32E0C4',     // Canlı turkuaz
    glow: '#00D9FF',          // Parlama efekti
    dark: '#00A8CC',          // Koyu mavi vurgu
  },

  // Text Colors
  text: {
    primary: '#F0F0F0',       // Kırık beyaz - Ana metin
    secondary: '#B8B8B8',     // Açık gri - İkincil metin
    disabled: '#707070',      // Devre dışı metin
    inverse: '#1A1A2E',       // Ters metin (açık zemin için)
  },

  // Status Colors
  status: {
    success: '#00FF88',       // Başarılı
    error: '#FF3366',         // Hata
    warning: '#FFB800',       // Uyarı
    info: '#00BFFF',          // Bilgi
  },

  // UI Elements
  ui: {
    border: '#2E4057',        // Kenarlık
    divider: '#1C2833',       // Ayırıcı çizgi
    overlay: 'rgba(26, 26, 46, 0.9)',  // Overlay
    shadow: 'rgba(0, 255, 255, 0.3)',  // Gölge (cyan glow)
  },

  // Gradients
  gradients: {
    primary: ['#1A1A2E', '#16213E', '#0F3460'],
    accent: ['#00FFFF', '#32E0C4', '#00D9FF'],
    dark: ['#0F0F1E', '#1A1A2E', '#222831'],
  },
};

export default colors;
