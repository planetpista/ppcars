import React, { useState } from 'react';
import { X, Shield, Info } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Vehicle } from '../types';
import { createPayPalOrder, onPayPalApprove, calculateServiceFee, calculateTotalAmount } from '../services/paymentService';

interface PaymentModalProps {
  language: 'fr' | 'en';
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string) => void;
  rentalDays?: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  language,
  vehicle,
  isOpen,
  onClose,
  onPaymentSuccess,
  rentalDays = 1
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !vehicle) return null;

  const baseAmount = vehicle.type === 'location'
    ? (vehicle.dailyRate || vehicle.price) * rentalDays
    : vehicle.price;

  const serviceFee = calculateServiceFee(baseAmount);
  const totalAmount = calculateTotalAmount(baseAmount);

  const paypalOptions = {
    clientId: process.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "EUR",
    intent: "capture" as const
  };

  const handleApprove = async (_data: any, actions: any) => {
    setIsProcessing(true);
    try {
      const result = await onPayPalApprove(actions);
      if (result.success && result.transactionId) {
        onPaymentSuccess(result.transactionId);
        onClose();
      } else {
        alert(result.error || 'Erreur de paiement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Paiement sécurisé' : 'Secure Payment'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Vehicle Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>
                  {vehicle.type === 'location' 
                    ? `${language === 'fr' ? 'Location' : 'Rental'} (${rentalDays} ${language === 'fr' ? 'jours' : 'days'})`
                    : language === 'fr' ? 'Achat' : 'Purchase'
                  }
                </span>
                <span>{baseAmount.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'fr' ? 'Frais de service' : 'Service fee'}</span>
                <span>{serviceFee.toFixed(2)}€</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={20} className="text-blue-600" />
              <span className="font-medium text-blue-900">
                {language === 'fr' ? 'Paiement sécurisé' : 'Secure Payment'}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {language === 'fr' 
                ? 'Vos données de paiement sont protégées par le cryptage SSL et traitées par PayPal.'
                : 'Your payment data is protected by SSL encryption and processed by PayPal.'
              }
            </p>
          </div>

          {/* PayPal Buttons */}
          <div className="mb-4">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                disabled={isProcessing}
                createOrder={(_data, actions) => {
                  return actions.order.create(createPayPalOrder({
                    amount: totalAmount,
                    currency: 'EUR',
                    description: `${vehicle.brand} ${vehicle.model} - ${vehicle.type === 'location' ? 'Location' : 'Achat'}`,
                    vehicleId: vehicle.id,
                    userId: vehicle.userId
                  }));
                }}
                onApprove={handleApprove}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  alert('Erreur PayPal. Veuillez réessayer.');
                }}
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect' as const,
                  label: 'pay' as const
                }}
              />
            </PayPalScriptProvider>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              {language === 'fr' 
                ? 'En procédant au paiement, vous acceptez nos conditions générales de vente et notre politique de confidentialité.'
                : 'By proceeding with payment, you accept our terms of sale and privacy policy.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};