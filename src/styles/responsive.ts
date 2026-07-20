export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

export const responsiveStyles = `
  @media (max-width: ${breakpoints.lg}px) {
    .hide-lg { display: none !important; }
    .show-lg { display: block !important; }
  }

  @media (max-width: ${breakpoints.md}px) {
    .hide-md { display: none !important; }
    .show-md { display: block !important; }
    .stack-md { flex-direction: column !important; }
    .full-md { width: 100% !important; }
  }

  @media (max-width: ${breakpoints.sm}px) {
    .hide-sm { display: none !important; }
    .show-sm { display: block !important; }
    .stack-sm { flex-direction: column !important; }
    .full-sm { width: 100% !important; }
  }

  .responsive-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (max-width: ${breakpoints.lg}px) {
    .responsive-grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: ${breakpoints.sm}px) {
    .responsive-grid-4 {
      grid-template-columns: 1fr;
    }
  }

  .responsive-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: ${breakpoints.md}px) {
    .responsive-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  .responsive-grid-2-1 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
  }

  @media (max-width: ${breakpoints.lg}px) {
    .responsive-grid-2-1 {
      grid-template-columns: 1fr;
    }
  }

  .responsive-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .responsive-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .responsive-header {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .responsive-filters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .responsive-filters {
      flex-direction: column;
    }
    .responsive-filters > * {
      width: 100% !important;
      flex: none !important;
    }
  }

  .mobile-sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 40;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
  }

  .mobile-sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .mobile-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .mobile-sidebar.active {
    transform: translateX(0);
  }

  .mobile-menu-btn {
    display: none;
  }

  @media (max-width: ${breakpoints.lg}px) {
    .desktop-sidebar {
      display: none !important;
    }
    .mobile-menu-btn {
      display: flex !important;
    }
  }

  .chart-container {
    min-height: 200px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .chart-container {
      min-height: 180px;
    }
  }

  .page-padding {
    padding: 28px 32px;
  }

  @media (max-width: ${breakpoints.md}px) {
    .page-padding {
      padding: 20px 16px;
    }
  }

  @media (max-width: ${breakpoints.sm}px) {
    .page-padding {
      padding: 16px 12px;
    }
  }

  .card-padding {
    padding: 20px 24px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .card-padding {
      padding: 16px;
    }
  }

  .page-title {
    font-size: 22px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .page-title {
      font-size: 18px;
    }
  }

  .stat-value {
    font-size: 26px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .stat-value {
      font-size: 20px;
    }
  }
`

export const useIsMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpoints.lg
}
