import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import SeoHead from '../components/SeoHead';
import api from '../api';

const DEFAULT_CONTENT = `<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or subscribe to our newsletter. This may include your name, phone number, email address, and hospital/clinic name.</p>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to respond to your inquiries, process quote requests, send product updates and offers (only if you have opted in), and improve our website and services.</p>

<h2>3. Information Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, provided they agree to keep this information confidential.</p>

<h2>4. Data Security</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

<h2>5. Cookies</h2>
<p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of our website.</p>

<h2>6. Third-Party Links</h2>
<p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>

<h2>7. Your Rights</h2>
<p>You have the right to access, correct, or delete your personal information that we hold. To exercise these rights, please contact us at info@meditrustnepal.com or call +977-9818100515.</p>

<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with a revised "Last Updated" date.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at:<br/>
<strong>Meditrust Nepal</strong><br/>
Naxal, Bhagwati Bahal, Kathmandu, Nepal<br/>
Phone: +977-9818100515<br/>
Email: info@meditrustnepal.com</p>`;

const PrivacyPolicy = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/legal', { silent: true }).then(r => setData(r.data)).catch(() => {});
  }, []);

  const title = data?.privacyTitle || 'Privacy Policy';
  const lastUpdated = data?.privacyLastUpdated || '';
  const content = data?.privacyContent || DEFAULT_CONTENT;

  return (
    <>
      <SeoHead
        title={title}
        description="Meditrust Nepal Privacy Policy — how we collect, use, and protect your personal information."
        keywords="Meditrust Nepal privacy policy, data protection Nepal, medical equipment supplier privacy"
        noindex={false}
      />

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{title}</h1>
          {lastUpdated && <p className="text-primary-200 text-sm mt-2">Last updated: {lastUpdated}</p>}
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="prose prose-gray prose-lg max-w-none
              prose-h2:text-xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
