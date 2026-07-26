import React from 'react'
import { Product } from '../lib/types'

type Props = {
  product: Product
  onAdd?: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="border rounded p-3 bg-white">
      {product.image ? (
        <img
          src={product.image.startsWith('http') ? product.image : `/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover mb-2"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 mb-2 flex items-center justify-center">No Image</div>
      )}
      <div className="text-sm text-gray-600 mb-1">{product.type} • {product.category}</div>
      <h3 className="font-serif text-lg mb-2">{product.name}</h3>
      <div className="mb-3">
        {product.discountPrice ? (
          <div>
            <span className="text-gray-500 line-through mr-2">₹{product.price}</span>
            <span className="text-maroon font-semibold">₹{product.discountPrice}</span>
          </div>
        ) : (
          <div className="font-semibold">₹{product.price}</div>
        )}
      </div>
      <button
        onClick={() => onAdd && onAdd(product)}
        disabled={!product.inStock}
        className={`w-full py-2 rounded ${product.inStock ? 'bg-maroon text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
        {product.inStock ? 'Add to Order' : 'Out of Stock'}
      </button>
    </div>
  )
}

