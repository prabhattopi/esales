
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedVariant, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    customerName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '',
    cardNumber: '', expiryDate: '', cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');


  useEffect(() => {
    if (!product) {
      // If no product data, redirect to landing (or show error)
      navigate('/');
    }
  }, [product, navigate]);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'customerName':
        if (!value.trim()) errorMsg = 'Full name is required.';
        break;
      case 'email':
        if (!value.trim()) errorMsg = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = 'Email is invalid.';
        break;
      case 'phone':
        if (!value.trim()) errorMsg = 'Phone number is required.';
        else if (!/^\d{10,15}$/.test(value.replace(/\D/g,''))) errorMsg = 'Phone number is invalid (10-15 digits).';
        break;
      case 'address':
        if (!value.trim()) errorMsg = 'Address is required.';
        break;
      case 'city':
        if (!value.trim()) errorMsg = 'City is required.';
        break;
      case 'state':
        if (!value.trim()) errorMsg = 'State is required.';
        break;
      case 'zipCode':
        if (!value.trim()) errorMsg = 'Zip code is required.';
        break;
      case 'cardNumber':
        if (!value.trim()) errorMsg = 'Card number is required.';
        else if (!/^\d{16}$/.test(value.replace(/\s/g,''))) errorMsg = 'Card number must be 16 digits.';
        break;
      case 'expiryDate': {
        if (!value.trim()) errorMsg = 'Expiry date is required.';
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) errorMsg = 'Expiry date must be MM/YY format.';
        else {
          const [month, year] = value.split('/');
          const expiry = new Date(`20${year}`, month - 1); // JS months are 0-indexed
          const current = new Date();
          current.setDate(1); // Compare against the first of the current month
          current.setHours(0,0,0,0);
          // Expiry month should be greater than or equal to current month IF in same year,
          // OR expiry year should be greater.
          // For simplicity, expiry month end should be after current month start.
          if (expiry < current || new Date(`20${year}`, month, 0) < new Date()) {
             errorMsg = 'Expiry date must be in the future.';
          }
        }
        break;
      }
      case 'cvv':
        if (!value.trim()) errorMsg = 'CVV is required.';
        else if (!/^\d{3}$/.test(value)) errorMsg = 'CVV must be 3 digits.';
        break;
      default:
        break;
    }
    return errorMsg;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Validate on change
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach(key => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        ...formData,
        productDetails: {
          id: product.id,
          name: product.name,
          price: product.price,
          selectedVariant,
          quantity,
        },
      };
      const response = await apiClient.post('/orders', orderPayload);
      // Backend will return orderNumber and transactionStatus
      navigate(`/thankyou/${response.data.orderNumber}`, { state: { transactionStatus: response.data.transactionStatus } });

    } catch (err) {
      console.error("Order submission error:", err.response?.data || err.message);
      setSubmissionError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return <div className="text-center py-10">Loading checkout details or invalid access...</div>;
  }

  const subtotal = product.price * quantity;
  const total = subtotal; // Assume no tax/shipping

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1 order-last md:order-first">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt={product.name} className="w-16 h-16 object-cover rounded mr-4"/>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  {selectedVariant && <p className="text-sm text-gray-600">{selectedVariant}</p>}
                  <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                </div>
              </div>
              <p className="font-semibold">${(product.price * quantity).toFixed(2)}</p>
            </div>
            <hr className="my-2"/>
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* Add Tax, Shipping if needed */}
            <hr className="my-2"/>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="md:col-span-1 space-y-4">
          <div>
            <h2 className="text-xl font-medium mb-3">Shipping Information</h2>
            {['customerName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'].map(field => (
              <div key={field} className="mb-3">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-medium mb-3">Payment Details</h2>
            <p className="text-xs text-gray-500 mb-2">
              Test CVV: ends with '1' for Approved, '2' for Declined, '3' for Gateway Error.
            </p>
            {['cardNumber', 'expiryDate', 'cvv'].map(field => (
              <div key={field} className="mb-3">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                  {field === 'cvv' ? 'CVV' : field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={field === 'expiryDate' ? 'MM/YY' : ''}
                  className={`mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>
          
          {submissionError && <p className="text-red-600 text-sm my-3 bg-red-100 p-3 rounded">{submissionError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;