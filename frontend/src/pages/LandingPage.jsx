
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const LandingPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/product/details');
        setProduct(response.data);
        // Initialize selected variants
        const initialVariants = {};
        response.data.variants.forEach(variant => {
          initialVariants[variant.name] = variant.options[0]; // Default to first option
        });
        setSelectedVariants(initialVariants);
        setError('');
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: value }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Format selectedVariant for passing to checkout
    const variantString = Object.entries(selectedVariants)
                              .map(([name, value]) => `${name}: ${value}`)
                              .join(', ');

    navigate('/checkout', {
      state: {
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
        selectedVariant: variantString,
        quantity,
      },
    });
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">No product found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-4xl font-semibold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>

          {product.variants && product.variants.map(variant => (
            <div key={variant.name} className="mb-4">
              <label htmlFor={variant.name} className="block text-sm font-medium text-gray-700 mb-1">
                {variant.name}:
              </label>
              <select
                id={variant.name}
                name={variant.name}
                value={selectedVariants[variant.name] || ''}
                onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {variant.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="mt-1 block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-150 ease-in-out"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;