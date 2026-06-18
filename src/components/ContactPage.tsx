import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { sendContactEmail } from '../services/emailService';

interface ContactPageProps {
  language: 'fr' | 'en';
}

export const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await sendContactEmail(formData);
      if (success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        alert(language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message');
      }
    } catch (error) {
      console.error('Error sending contact email:', error);
      alert(language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
          </h1>
          <p className="text-gray-600 text-lg">
            {language === 'fr' 
              ? 'Notre équipe est là pour vous aider. N\'hésitez pas à nous contacter.' 
              : 'Our team is here to help you. Don\'t hesitate to contact us.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {language === 'fr' ? 'Informations de contact' : 'Contact Information'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">planetpista@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {language === 'fr' ? 'Adresse' : 'Address'}
                  </h3>
                  <p className="text-gray-600">Cotonou, Benin</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {language === 'fr' ? 'Horaires d\'ouverture' : 'Opening Hours'}
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>{language === 'fr' ? 'Lundi - Vendredi: 9h - 17h (GMT)' : 'Monday - Friday: 9am - 5pm (GMT)'}</p>
                    <p>{language === 'fr' ? 'Dimanche: Fermé' : 'Sunday: Closed'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {language === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? 'Nom complet' : 'Full Name'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'fr' ? 'Sujet' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                      <Send size={18} />
                      {language === 'fr' ? 'Envoyer le message' : 'Send Message'}
                    </>
                  )}
                </button>
              </form>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-center">
                    {language === 'fr' 
                      ? 'Message envoyé avec succès !' 
                      : 'Message sent successfully!'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions'}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {language === 'fr' 
                      ? 'Comment puis-je publier une annonce ?' 
                      : 'How can I post a listing?'
                    }
                  </p>
                  <p className="text-gray-600">
                    {language === 'fr' 
                      ? 'Créez un compte et cliquez sur "Déposer une annonce"' 
                      : 'Create an account and click "Post Announcement"'
                    }
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {language === 'fr' 
                      ? 'Les frais de service sont-ils inclus ?' 
                      : 'Are service fees included?'
                    }
                  </p>
                  <p className="text-gray-600">
                    {language === 'fr' 
                      ? 'Tous les prix affichés incluent nos frais de service' 
                      : 'All displayed prices include our service fees'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};