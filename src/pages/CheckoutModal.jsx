import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { IMAGES } from './data';

export default function CheckoutModal({ 
  isCheckoutOpen, 
  setIsCheckoutOpen, 
  orderPlaced: externalOrderPlaced, 
  setOrderPlaced: externalSetOrderPlaced,
  address, 
  handleAddressChange, 
  paymentMethod, 
  setPaymentMethod, 
  cartTotal,
  cart = [],
  visibleSection = '0'
}) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [localOrderPlaced, setLocalOrderPlaced] = useState(false);

  // Sync external prop state with local state if provided
  const isConfirmed = localOrderPlaced || externalOrderPlaced;

  // Handle Navigation to ToonHubHero page
  const handleShopMore = () => {
    setIsCheckoutOpen(false);
    setLocalOrderPlaced(false);
    if (externalSetOrderPlaced) externalSetOrderPlaced(false);
    navigate('/ToonHubHero');
  };

  // 5-Second Automatic Timer when order is confirmed
  useEffect(() => {
    let timer;
    if (isConfirmed && isCheckoutOpen) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleShopMore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConfirmed, isCheckoutOpen]);

  // Reset local state when modal reopens
  useEffect(() => {
    if (!isCheckoutOpen) {
      setLocalOrderPlaced(false);
    }
  }, [isCheckoutOpen]);

  // Early return safely after all hooks
  if (!isCheckoutOpen) return null;

  const activeProductIndex = parseInt(visibleSection) || 0;
  const currentProduct = IMAGES[activeProductIndex] || IMAGES[0];
  
  const displayItems = cart.length > 0 ? cart : [
    { 
      id: currentProduct.id || `prod_0${activeProductIndex + 1}`, 
      name: currentProduct.name || currentProduct.title || 'Selected Shoe', 
      price: currentProduct.price || 0, 
      quantity: 1 
    }
  ];

  const shoeIdsString = displayItems.map((item, idx) => item.id || `prod_0${idx + 1}`).join(', ');
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Submit Handler for EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();

    const SERVICE_ID = 'service_d32p1zg';
    const TEMPLATE_ID = 'template_s310m43';
    const PUBLIC_KEY = 'Iu5oRBE3QM5rXv296';

    // Directly trigger the confirmed screen immediately
    setLocalOrderPlaced(true);
    if (externalSetOrderPlaced) externalSetOrderPlaced(true);

    // Send email in the background
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY)
      .then((result) => {
        console.log('Email successfully sent!', result.text);
      })
      .catch((error) => {
        console.error('Email failed to send:', error.text);
      });
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6">
      <div onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity" />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c1c24] to-[#121217] border border-white/20 rounded-3xl text-white p-6 sm:p-10 max-h-[90vh] overflow-y-auto z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
          <X size={20} />
        </button>

        {isConfirmed ? (
          <div className="text-center py-12 flex flex-col items-center">
            <CheckCircle2 size={72} className="text-indigo-400 mb-6 animate-bounce" />
            <h3 className="font-['Anton'] text-4xl sm:text-5xl mb-3 tracking-wide text-white">ORDER CONFIRMED!</h3>
            <p className="text-white/70 text-sm sm:text-base max-w-md mb-8">
              Thank you for your order. Your product is being prepared for dispatch.
            </p>

            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              <button 
                onClick={handleShopMore}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/40"
              >
                <ShoppingBag size={18} />
                <span>Shop More</span>
              </button>

              <p className="text-xs text-white/50 font-mono">
                Redirecting to shop in <span className="text-indigo-400 font-bold">{countdown}s</span>...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="shoe_id" value={shoeIdsString} />
            <input type="hidden" name="order_id" value={orderId} />

            <div>
              <h3 className="font-['Anton'] text-3xl sm:text-4xl mb-1 tracking-wide">CHECKOUT</h3>
              <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Complete delivery & secure payment details</p>
            </div>

            {/* Order Items Summary */}
            <div className="space-y-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Order Items & shoe_id</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {displayItems.map((item, index) => {
                  const shoeId = item.id || `prod_0${index + 1}`;
                  return (
                    <div key={index} className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                          shoe_id: {shoeId}
                        </span>
                        <span className="font-medium text-white/90">{item.name || item.title}</span>
                      </div>
                      <span className="text-white/60 text-xs">x{item.quantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-white/10 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-[10px]">1</span>
                Delivery Address
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" required name="full_name" placeholder="Full Name" 
                  value={address.full_name || address.fullName || ''} onChange={handleAddressChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                />
                <input 
                  type="email" required name="email_address" placeholder="Email Address" 
                  value={address.email_address || address.email || ''} onChange={handleAddressChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                />
              </div>

              <input 
                type="text" required name="street_address" placeholder="Street Address" 
                value={address.street_address || address.street || ''} onChange={handleAddressChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <input 
                  type="text" required name="city" placeholder="City" 
                  value={address.city || ''} onChange={handleAddressChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                />
                <input 
                  type="text" required name="zip_code" placeholder="ZIP / Postal Code" 
                  value={address.zip_code || address.zip || ''} onChange={handleAddressChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                />
                <input 
                  type="text" required name="country" placeholder="Country" 
                  value={address.country || ''} onChange={handleAddressChange}
                  className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-white/10 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-[10px]">2</span>
                Payment Method
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]'}`}
                >
                  <CreditCard size={22} className="mb-2" />
                  <span className="text-xs font-bold">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${paymentMethod === 'cod' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]'}`}
                >
                  <Banknote size={22} className="mb-2" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${paymentMethod === 'crypto' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]'}`}
                >
                  <span className="font-bold text-lg mb-1 leading-none">₿</span>
                  <span className="text-xs font-bold">Crypto</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <input 
                    type="text" required placeholder="Card Number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" required placeholder="MM / YY" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                    />
                    <input 
                      type="text" required placeholder="CVC" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all" 
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs leading-relaxed">
                  Pay with cash upon successful delivery of your package right at your doorstep.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 block font-semibold tracking-wider uppercase">TOTAL DUE</span>
                <span className="font-['Anton'] text-3xl text-indigo-400">
                  ${(cartTotal || currentProduct.price || 0).toFixed(2)}
                </span>
              </div>

              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/40 cursor-pointer"
              >
                Confirm Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}