export const SHOP_LAYOUT_CLASSES = {
  // Keep cart summary visible on xl while preserving product density.
  contentWithCart: 'grid gap-6 xl:grid-cols-[1fr_320px]',
  // Mobile-first: 1 column; tablet/desktop: at least 2; very wide: 3.
  productGrid: 'grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3',
  desktopCartRegion: 'hidden xl:block',
} as const
