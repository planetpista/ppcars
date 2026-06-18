import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { sendVehicleInquiry } from '../services/emailService';

interface ContactModalProps {
  language: 'fr' | 'en';
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  language,
  vehicle,
  isOpen,
  onClose,
  userEmail = '',
  userName = ''
}) => {
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await sendVehicleInquiry({
        vehicleTitle: `${vehicle.brand} ${vehicle.model}`,
        ownerEmail: vehicle.user.email,
        inquirerName: formData.name,
        inquirerEmail: formData.email,
        message: formData.message
      });

      if (success) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({ name: userName, email: userEmail, message: '' });
        }, 2000);
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert(language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
          </h3>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Votre message a été envoyé au propriétaire du véhicule.'
              : 'Your message has been sent to the vehicle owner.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Contacter le vendeur' : 'Contact Seller'}
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
          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-600">
              {vehicle.city}, {vehicle.country} • {vehicle.price}€
              {vehicle.type === 'location' ? '/jour' : ''}
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Votre nom' : 'Your name'}
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Votre email' : 'Your email'}
              </label>
              <input
                type="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={language === 'fr' 
                  ? 'Bonjour, je suis intéressé(e) par votre véhicule...'
                  : 'Hello, I am interested in your vehicle...'
                }
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {language === 'fr' ? 'Envoi...' : 'Sending...'}
                </>
              ) : (
                <>
                  <MessageCircle size={18} />
                  {language === 'fr' ? 'Envoyer le message' : 'Send Message'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};