
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import apiClient from '../services/api';

const ThankYouPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation(); // To get transaction status if passed directly
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Attempt to get transactionStatus from navigation state first, then from fetched orderDetails
  const initialTransactionStatus = location.state?.transactionStatus;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No order number provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiClient.get(`/orders/${orderNumber}`);
        setOrderDetails(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load order details. Please check your order number or contact support.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div className="text-center py-10">Loading order confirmation...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!orderDetails) return <div className="text-center py-10">Order not found.</div>;

  const { 
    customerName, email, phone, address, city, state, zipCode,
    product, subtotal, total, transactionStatus: finalTransactionStatus // use this from DB as source of truth
  } = orderDetails;
  
  const displayTransactionStatus = initialTransactionStatus || finalTransactionStatus;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
      {displayTransactionStatus === 'approved' ? (
        <>
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Thank You For Your Order!</h1>
          <p className="text-gray-700 mb-4">Your order <span className="font-semibold">#{orderNumber}</span> has been confirmed.</p>
          <p className="text-gray-600 mb-6">An email confirmation has been sent to <span className="font-semibold">{email}</span>.</p>
        </>
      ) : (
        <>
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Order Transaction Failed</h1>
          <p className="text-gray-700 mb-4">Unfortunately, we couldn't process your payment for order attempt <span className="font-semibold">#{orderNumber}</span>.</p>
          <p className="text-gray-600 mb-6">
            Status: <span className="font-semibold capitalize">{displayTransactionStatus}</span>.
            An email with details has been sent to <span className="font-semibold">{email}</span>. 
            Please try again or contact support.
          </p>
        </>
      )}

      <div className="bg-gray-50 p-6 rounded-lg text-left mt-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary (#{orderNumber})</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-800">Product Details:</h3>
          <p>{product.name}</p>
          {product.selectedVariant && <p className="text-sm text-gray-600">Variant: {product.selectedVariant}</p>}
          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
          <p className="text-sm text-gray-600">Price per item: ${product.price.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-800">Customer Information:</h3>
          <p>{customerName}</p>
          <p>{email} | {phone}</p>
          <p>{address}</p>
          <p>{city}, {state} {zipCode}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-800">Payment Information:</h3>
          <p className="text-sm text-gray-600">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="font-semibold">Total: ${total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Card Used: **** **** **** {orderDetails.cardNumberLast4}</p>
          <p className="text-sm text-gray-600">Transaction Status: <span className={`font-semibold ${finalTransactionStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{finalTransactionStatus.toUpperCase()}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;