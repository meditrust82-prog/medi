import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import SeoHead, { buildLocalBusinessSchema, buildFAQSchema, buildBreadcrumbSchema } from '../components/SeoHead';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const productName = searchParams.get('product') || '';

  const [form, setForm] = useState({
    name: '',
    hospitalName: '',
    phone: '',
    email: '',
    message: productName ? `I am interested in ${productName}. Please provide more information and a quotation.` : '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveQuote = async () => {
    await api.post('/quotes', {
      productName: productName || 'General Inquiry',
      name: form.name,
      hospitalName: form.hospitalName,
      phone: form.phone,
      email: form.email,
      message: form.message,
      source: 'contact_form',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in name, phone and message');
      return;
    }
    setSubmitting(true);
    try {
      await saveQuote();
      toast.success('Inquiry submitted! We will contact you soon.');
      setForm({ name: '', hospitalName: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to submit. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = async () => {
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in name, phone and message first');
      return;
    }
    setSubmitting(true);
    try {
      await saveQuote();
    } catch {}
    const waMsg = encodeURIComponent(
      `*Quotation Request — Meditrust Nepal*\n\nName: ${form.name}\nHospital: ${form.hospitalName || 'N/A'}\nPhone: ${form.phone}\nEmail: ${form.email || 'N/A'}\nProduct: ${productName || 'General Inquiry'}\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/9779818100515?text=${waMsg}`, '_blank');
    setForm({ name: '', hospitalName: '', phone: '', email: '', message: '' });
    setSubmitting(false);
  };

  return (
    <>
      <SeoHead
        title="Contact Meditrust Nepal — Get a Quote for Medical Equipment"
        description="Contact Meditrust Nepal for medical equipment quotes, inquiries, and technical support. Call +977-9818100515 or visit our office in Kathmandu, Nepal. We respond within 24 hours."
        keywords="contact Meditrust Nepal, medical equipment quote Nepal, hospital equipment inquiry Kathmandu, medical device supplier contact Nepal"
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': 'https://meditrustnepal.com/contact#contactpage',
            name: 'Contact Meditrust Nepal',
            url: 'https://meditrustnepal.com/contact',
            description: 'Contact Meditrust Nepal for medical equipment quotes, inquiries, and technical support.',
            mainEntity: {
              '@type': 'Organization',
              '@id': 'https://meditrustnepal.com/#organization',
              name: 'Meditrust Nepal',
              telephone: '+977-9818100515',
              email: 'meditrust82@gmail.com',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+977-9818100515',
                  contactType: 'customer service',
                  availableLanguage: ['English', 'Nepali'],
                  contactOption: 'TollFree',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+977-9818100515',
                  contactType: 'sales',
                  availableLanguage: ['English', 'Nepali'],
                },
              ],
            },
          },
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' },
          ]),
          buildFAQSchema([
            { q: 'How do I contact Meditrust Nepal?', a: 'You can reach Meditrust Nepal by phone at +977-9818100515, by email at meditrust82@gmail.com, via WhatsApp, or by submitting the contact form on this page.' },
            { q: 'What are Meditrust Nepal office hours?', a: 'Our office is open Sunday to Friday, 9:00 AM to 6:00 PM (NPT). Emergency technical support is available 24/7.' },
            { q: 'How quickly will Meditrust Nepal respond to inquiries?', a: 'We aim to respond to all inquiries within 24 hours on business days. Urgent requests are prioritised.' },
            { q: 'Does Meditrust Nepal provide free quotations?', a: 'Yes, we provide free, no-obligation quotations for all medical equipment requirements. Simply fill in the contact form or call us.' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">{t('Nav_Contact')}</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3 mb-4 leading-tight">{t('Contact_Hero_Title')}</h1>
          <p className="text-primary-100 max-w-2xl text-sm sm:text-base">{t('Contact_Hero_Desc')}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('Send_Inquiry_Title')}</h2>
                <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">{t('Send_Inquiry_Desc')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label_Name')}</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t('Placeholder_Name')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label_Hospital')}</label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={form.hospitalName}
                        onChange={handleChange}
                        placeholder={t('Placeholder_Hospital')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label_Phone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+977-XXXXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label_Email')}</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label_Message')}</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder={t('Placeholder_Message')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane className="text-sm" />
                      {submitting ? t('Btn_Submitting') : t('Btn_Send_Inquiry')}
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleWhatsApp}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaWhatsapp className="text-lg" />
                      Send via WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('Contact_Info_Title')}</h3>
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FaMapMarkerAlt className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{t('Label_Address')}</p>
                      <a href="https://maps.app.goo.gl/2xTCxp9YeVqmSJgE7" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-primary-600 mt-0.5 block">
                        Kathmandu, Nepal
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FaPhone className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{t('Label_Phone_Short')}</p>
                      <a href="tel:+977-9818100515" className="text-gray-500 text-sm hover:text-primary-600 mt-0.5 block">+977-9818100515</a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FaEnvelope className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{t('Label_Email_Short')}</p>
                      <a href="mailto:meditrust82@gmail.com" className="text-gray-500 text-sm hover:text-primary-600 mt-0.5 block">meditrust82@gmail.com</a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FaWhatsapp className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{t('Label_WhatsApp_Short')}</p>
                      <a href="https://wa.me/9779818100515" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-green-600 mt-0.5 block">+977-9818100515</a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FaClock className="mr-2 text-primary-600" /> {t('Working_Hours_Title')}
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('Day_Sun_Fri')}</span>
                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('Day_Sat')}</span>
                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">{t('Emergency_Support')}</span>
                    <span className="font-medium text-green-600">{t('Emergency_Available')}</span>
                  </li>
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/9779818100515?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20medical%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 text-white rounded-2xl p-6 hover:bg-green-600 transition-colors"
              >
                <div className="flex items-center">
                  <FaWhatsapp className="text-3xl mr-4" />
                  <div>
                    <p className="font-semibold">{t('WhatsApp_Chat_Title')}</p>
                    <p className="text-green-100 text-sm">{t('WhatsApp_Chat_Desc')}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{t('Our_Location')}</h3>
              <p className="text-gray-500 text-sm">{t('Find_Us_Desc')}</p>
            </div>
            <iframe
              title="Meditrust Nepal Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31397712412!2d85.29111383371498!3d27.70895594443958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
