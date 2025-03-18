import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';
import ProductVariantesSimples from './ProductVariantesSimples';
import ProductVariantesMasivas from './ProductVariantesMasivas';

interface ProductInfoProps {
  product: Product;
  brotherProducts?: Product[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, brotherProducts }) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  // Get the price to display (precio_venta if available, otherwise precio_tarifa)
  const displayPrice = product.precio_venta || product.precio_tarifa || 0;
  
  // Check if product is out of stock
  const isOutOfStock = product.stock_texto?.toLowerCase().includes('agotado');
  
  // Determine which variant component to show based on the number of brother products
  const renderVariantComponent = () => {
    if (!brotherProducts || brotherProducts.length <= 1) {
      return null; // Don't show anything if there's only one product or no brother products
    }
    
    if (brotherProducts.length >= 2 && brotherProducts.length <= 6) {
      return <ProductVariantesSimples currentProduct={product} brotherProducts={brotherProducts} />;
    }
    
    if (brotherProducts.length > 6) {
      return <ProductVariantesMasivas currentProduct={product} brotherProducts={brotherProducts} />;
    }
    
    return null;
  };
  
  return (
    <div>
      {/* Brand */}
      {product.marca && (
        <p className="text-gray-500 mb-2">{product.marca}</p>
      )}
      
      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.nombre}</h1>
      
      {/* Price */}
      <div className="flex items-baseline mb-6">
        <span className="text-3xl font-bold text-gray-900">{displayPrice.toFixed(2)}€</span>
      </div>
      
      {/* Short Description */}
      {product.descripcion_corta && (
        <div className="mb-6">
          <p className="text-gray-700">{product.descripcion_corta}</p>
        </div>
      )}

      {/* Product Variants Component */}
      {renderVariantComponent()}
      
      {/* Stock Status */}
      <div className="mb-6">
        <p className="text-sm font-medium">
          Disponibilidad: 
          <span className={`ml-2 ${isOutOfStock ? 'text-red-600' : product.stock_texto?.includes('En stock') ? 'text-green-600' : 'text-amber-600'}`}>
            {product.stock_texto || 'Consultar disponibilidad'}
          </span>
        </p>
      </div>
      
      {/* Quantity Selector - Only show if product is in stock */}
      {!isOutOfStock && (
        <div className="flex items-center mb-6">
          <span className="mr-3 text-gray-700">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button 
              onClick={decrementQuantity}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
            <button 
              onClick={incrementQuantity}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Add to Cart Button */}
      <div className="mb-8">
        <Button 
          onClick={handleAddToCart} 
          size="lg"
          fullWidth
          className="flex items-center justify-center gap-2"
          disabled={isOutOfStock}
        >
          <ShoppingCart size={20} />
          <span>¡Lo quiero!</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
