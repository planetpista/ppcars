import { supabase } from '../lib/supabase';

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  vehicleId: string;
  userId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const createPayPalOrder = async (paymentData: PaymentData) => {
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: paymentData.currency,
          value: paymentData.amount.toString()
        },
        description: paymentData.description,
        custom_id: `${paymentData.vehicleId}_${paymentData.userId}`
      }
    ],
    application_context: {
      brand_name: 'Planet Pista',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`
    }
  };
};

export const onPayPalApprove = async (data: any, actions: any): Promise<PaymentResult> => {
  try {
    const order = await actions.order.capture();
    console.log('Payment successful:', order);
    
    // Save transaction to database
    const { error: dbError } = await supabase
      .from('transactions')
      .insert([{
        transaction_id: order.id,
        amount: parseFloat(order.purchase_units[0].amount.value),
        currency: order.purchase_units[0].amount.currency_code,
        status: 'completed',
        payment_method: 'paypal',
        vehicle_id: order.purchase_units[0].custom_id?.split('_')[0],
        user_id: order.purchase_units[0].custom_id?.split('_')[1],
        created_at: new Date().toISOString()
      }]);

    if (dbError) {
      console.error('Error saving transaction:', dbError);
    }
    
    return {
      success: true,
      transactionId: order.id
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: 'Erreur lors du traitement du paiement'
    };
  }
};

export const calculateServiceFee = (amount: number): number => {
  // Frais de service de 5% avec minimum de 2€
  const fee = Math.max(amount * 0.05, 2);
  return Math.round(fee * 100) / 100;
};

export const calculateTotalAmount = (baseAmount: number): number => {
  const serviceFee = calculateServiceFee(baseAmount);
  return Math.round((baseAmount + serviceFee) * 100) / 100;
};