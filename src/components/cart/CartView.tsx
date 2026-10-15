import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerInfo, Order } from '../../types';
import { PixCheckoutModal } from './PixCheckoutModal';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    currentUser,
    orders,
    setActiveTab,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'retirada' | 'envio'>('retirada');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'São Paulo',
    state: 'SP',
    address: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePixOrder, setActivePixOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping fee
  const shippingFee = deliveryMethod === 'envio' ? 25.0 : 0.0;
  const finalTotal = cartTotal + shippingFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Seu carrinho está vazio.');
      return;
    }

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setErrorMsg('Por favor, preencha os dados de contato (Nome, E-mail e WhatsApp).');
      return;
    }

    if (deliveryMethod === 'envio' && !customer.address?.trim()) {
      setErrorMsg('Informe o endereço completo para envio.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder(customer, deliveryMethod);
      setActivePixOrder(newOrder);
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao gerar a encomenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recent user orders if any
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white">
          Carrinho de Encomendas
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Revise seus uniformes e itens oficiais selecionados antes de gerar o PIX oficial
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-xs text-neutral-400 mb-6">
            Confira as camisas, bretelles e acessórios oficiais dos Amarelinhos com tamanhos do PP ao GG.
          </p>
          <button
            onClick={() => setActiveTab('loja')}
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition"
          >
            Ir para a Loja Oficial <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Items (8 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wider">
                Itens Selecionados ({cart.length})
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-neutral-500 hover:text-red-400 font-semibold"
              >
                Esvaziar Carrinho
              </button>
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-neutral-950 shrink-0 border border-neutral-800"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-400 text-neutral-950">
                        Tam: {item.size}
                      </span>
                      <span className="text-xs text-neutral-400">
                        R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-bold text-yellow-400">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Selector */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                Opção de Entrega / Retirada
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryMethod('retirada')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    deliveryMethod === 'retirada'
                      ? 'bg-yellow-400/10 border-yellow-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'retirada'}
                    onChange={() => setDeliveryMethod('retirada')}
                    className="mt-1 accent-yellow-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Retirada no Pedal (Grátis)</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Ponto de encontro oficial da quarta ou sábado com os capitães
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('envio')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    deliveryMethod === 'envio'
                      ? 'bg-yellow-400/10 border-yellow-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'envio'}
                    onChange={() => setDeliveryMethod('envio')}
                    className="mt-1 accent-yellow-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Envio Correios (+ R$ 25,00)</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Entrega no seu endereço com código de rastreamento
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Customer & Checkout Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl sticky top-24">
              <h2 className="font-display text-2xl font-bold uppercase text-white mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-yellow-400" />
                Dados para a Encomenda
              </h2>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-4">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Nome de quem vai receber/retirar"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                </div>

                {deliveryMethod === 'envio' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Endereço Completo de Entrega *
                    </label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Rua, número, complemento, bairro, CEP"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Observações (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="Ex: Retiro na saída de quarta-feira"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Totals Summary */}
                <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal uniformes:</span>
                    <strong className="text-white">
                      R$ {cartTotal.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Entrega:</span>
                    <strong className="text-white">
                      {deliveryMethod === 'retirada' ? 'Grátis no Pedal' : 'R$ 25,00'}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-white">Total a pagar:</span>
                    <span className="font-display text-3xl font-black text-yellow-400">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-400/25 transition active:scale-95 disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4 text-neutral-950" />
                  {isSubmitting ? 'Gerando QR Code PIX...' : 'Gerar Pedido e Pagar via PIX'}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PIX com especificações EMV do Banco Central</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders in this device */}
      {recentOrders.length > 0 && (
        <div className="pt-8 border-t border-neutral-800">
          <h2 className="font-display text-2xl font-bold uppercase text-white mb-4">
            Suas Encomendas Recentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setActivePixOrder(ord)}
                className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">#{ord.code}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ord.status === 'pago'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : ord.status === 'enviado'
                          ? 'bg-blue-500/15 text-blue-400'
                          : ord.status === 'entregue'
                          ? 'bg-purple-500/15 text-purple-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {ord.items.length} {ord.items.length === 1 ? 'item' : 'itens'}:{' '}
                    {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-yellow-400">
                    R$ {ord.totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-yellow-400 font-bold hover:underline">
                    Ver PIX / Detalhes →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active PIX Modal */}
      {activePixOrder && (
        <PixCheckoutModal
          order={activePixOrder}
          onClose={() => setActivePixOrder(null)}
        />
      )}
    </div>
  );
};
