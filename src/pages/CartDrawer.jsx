import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartDrawer({ isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal, setIsCheckoutOpen }) {
  return (
    <div className={`fixed inset-0 z-[120] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#161618] border-l border-white/10 text-white p-6 sm:p-8 flex flex-col justify-between transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShoppingCart size={22} />
              <h3 className="font-['Anton'] text-2xl tracking-wide uppercase">YOUR COLLECTION</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="py-6 space-y-6 max-h-[50vh] overflow-y-auto pr-2">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p className="text-base mb-2">Your collection is empty.</p>
                <p className="text-xs uppercase tracking-widest text-white/30">Scroll through and collect your first 3D figurine!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <img src={item.src} alt={item.name} className="w-16 h-20 object-contain" />
                  <div className="flex-1">
                    <h4 className="font-['Anton'] text-lg tracking-wide">{item.name}</h4>
                    <p className="text-white/60 text-sm">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-white/70 hover:text-white bg-white/10 rounded">
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-white/70 hover:text-white bg-white/10 rounded">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-6 text-lg font-bold">
              <span className="text-white/70 uppercase text-xs tracking-widest">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white/90 transition-all active:scale-98"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}