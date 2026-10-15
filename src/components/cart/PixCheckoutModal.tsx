import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { generatePixQrCodeDataUrl } from '../../utils/pix';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
  QrCode,
  Download,
} from 'lucide-react';
import { AmarelinhosLogo } from '../common/AmarelinhosLogo';

interface PixCheckoutModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PixCheckoutModal: React.FC<PixCheckoutModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus, showToast, groupConfig } = useApp();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (order?.pixPayload) {
      generatePixQrCodeDataUrl(order.pixPayload)
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Erro ao gerar QR Code PIX', err));
    }
  }, [order?.pixPayload]);

  if (!order) return null;

  const handleCopyPix = () => {
    if (navigator.clipboard && order.pixPayload) {
      navigator.clipboard.writeText(order.pixPayload);
      setCopied(true);
      showToast('Código PIX Copia e Cola copiado com sucesso!', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConfirmPayment = () => {
    setIsConfirming(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'pago');
      setIsConfirming(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#EC4899', '#FFFFFF', '#000000'],
        });
      } catch (e) {
        // Safe fallback
      }
      showToast('Pagamento confirmado! Sua encomenda entrou na fila de produção.', 'success');
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá Amarelinhos! Acabei de fazer a encomenda #${order.code} no valor de R$ ${order.totalAmount.toFixed(2).replace('.', ',')}. Segue meu comprovante de pagamento via PIX!`
  );

  const whatsappUrl = `https://wa.me/55${groupConfig.contactPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-auto animate-in zoom-in-95">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AmarelinhosLogo size={52} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-wider mb-2">
            Pagamento PIX BACEN EMV
          </span>
          <h3 className="text-2xl font-black text-white">
            Encomenda #{order.code}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Escaneie o QR Code no seu aplicativo do banco ou use o Copia e Cola.
          </p>
        </div>

        {/* Amount Box */}
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-center mb-5">
          <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider">
            Total a Pagar
          </span>
          <div className="font-display text-4xl font-black text-yellow-400 mt-0.5">
            R$ {order.totalAmount.toFixed(2).replace('.', ',')}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Validade: 30 minutos • Status atual: </span>
            <span className={`font-bold uppercase ${order.status === 'pago' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-yellow-400/80 mb-3">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code PIX Banco Central"
                className="w-48 h-48 sm:w-56 sm:h-56"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-neutral-100 text-neutral-500 text-xs">
                Gerando QR Code Oficial...
              </div>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-yellow-400" />
            Padrão BR Code EMV oficial do Banco Central do Brasil
          </p>
        </div>

        {/* Copia e Cola Field */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-300">Código PIX Copia e Cola:</span>
            <span className="text-[11px] text-neutral-500">TXID: {order.pixTxid}</span>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={order.pixPayload}
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-[11px] font-mono text-neutral-300 select-all resize-none focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyPix}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              copied
                ? 'bg-emerald-500 text-neutral-950 font-black'
                : 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 shadow-md shadow-yellow-400/20'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Código Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar Código PIX (Copia e Cola)
              </>
            )}
          </button>
        </div>

        {/* Receiver Details */}
        <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-neutral-800/80 text-[11px] space-y-1 text-neutral-400 mb-6">
          <div className="flex justify-between">
            <span>Recebedor:</span>
            <strong className="text-white">{groupConfig.pixConfig.merchantName}</strong>
          </div>
          <div className="flex justify-between">
            <span>Chave PIX:</span>
            <strong className="text-neutral-200">{groupConfig.pixConfig.key}</strong>
          </div>
          <div className="flex justify-between">
            <span>Cidade:</span>
            <strong className="text-neutral-200">{groupConfig.pixConfig.merchantCity}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {order.status !== 'pago' ? (
            <button
              type="button"
              disabled={isConfirming}
              onClick={handleConfirmPayment}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isConfirming ? 'Confirmando...' : 'Já Efetuei o Pagamento via PIX'}
            </button>
          ) : (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pagamento Confirmado no Sistema!
            </div>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            Enviar Comprovante no WhatsApp do Grupo
          </a>
        </div>
      </div>
    </div>
  );
};
