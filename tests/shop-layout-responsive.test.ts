import { describe, expect, it } from 'vitest'
import { SHOP_LAYOUT_CLASSES } from '../lib/shop-layout'

describe('shop responsive layout classes', () => {
  it('uses a mobile-first single-column grid and scales up on larger breakpoints', () => {
    const grid = SHOP_LAYOUT_CLASSES.productGrid

    expect(grid).toContain('grid-cols-1')
    expect(grid).toContain('md:grid-cols-2')
    expect(grid).toContain('2xl:grid-cols-3')
  })

  it('keeps desktop cart region visible without collapsing product grid to one column', () => {
    const contentWithCart = SHOP_LAYOUT_CLASSES.contentWithCart
    const grid = SHOP_LAYOUT_CLASSES.productGrid
    const cartRegion = SHOP_LAYOUT_CLASSES.desktopCartRegion

    expect(contentWithCart).toContain('xl:grid-cols-[1fr_320px]')
    expect(cartRegion).toContain('xl:block')
    expect(grid).not.toContain('xl:grid-cols-1')
    expect(grid).toContain('md:grid-cols-2')
  })
})
