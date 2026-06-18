import { supabase } from '../lib/supabase';

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  senderName?: string;
  senderEmail?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Call Supabase Edge Function for email sending
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> => {
  const htmlContent = `
    <h2>Nouveau message de contact - Planet Pista</h2>
    <p><strong>Nom:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Sujet:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message.replace(/\n/g, '<br>')}</p>
  `;

  return await sendEmail({
    to: 'contact@planetpista.com',
    subject: `Contact: ${contactData.subject}`,
    htmlContent,
    textContent: `Nouveau message de ${contactData.name} (${contactData.email}): ${contactData.message}`,
    senderName: contactData.name,
    senderEmail: contactData.email
  });
};

export const sendVehicleInquiry = async (inquiryData: {
  vehicleTitle: string;
  ownerEmail: string;
  inquirerName: string;
  inquirerEmail: string;
  message: string;
}): Promise<boolean> => {
  const htmlContent = `
    <h2>Demande de renseignements - ${inquiryData.vehicleTitle}</h2>
    <p><strong>De:</strong> ${inquiryData.inquirerName} (${inquiryData.inquirerEmail})</p>
    <p><strong>Véhicule:</strong> ${inquiryData.vehicleTitle}</p>
    <p><strong>Message:</strong></p>
    <p>${inquiryData.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><em>Vous pouvez répondre directement à cet email pour contacter l'intéressé.</em></p>
  `;

  return await sendEmail({
    to: inquiryData.ownerEmail,
    subject: `Demande pour votre véhicule: ${inquiryData.vehicleTitle}`,
    htmlContent,
    textContent: `${inquiryData.inquirerName} s'intéresse à votre véhicule "${inquiryData.vehicleTitle}". Message: ${inquiryData.message}`,
    senderName: inquiryData.inquirerName,
    senderEmail: inquiryData.inquirerEmail
  });
};