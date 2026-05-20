import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import SeoHead from '../components/SeoHead';
import api from '../api';

const DEFAULT_CONTENT = `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using the Meditrust Nepal website (meditrustnepal.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>

<h2>2. Products and Services</h2>
<p>Meditrust Nepal supplies medical equipment, surgical instruments, and related healthcare products to hospitals, clinics, and healthcare facilities across Nepal. All products are sourced from certified manufacturers and meet international quality standards (CE & ISO certified where applicable).</p>

<h2>3. Pricing and Quotations</h2>
<p>All prices displayed on the website are indicative and subject to change without notice. Final pricing is confirmed through a formal quotation. Prices are in Nepalese Rupees (NPR) unless otherwise stated. Taxes and delivery charges may apply.</p>

<h2>4. Orders and Payments</h2>
<p>Orders are confirmed upon receipt of a signed purchase order or formal agreement. Standard payment terms are 50% advance and 50% on delivery, unless otherwise agreed. We accept bank transfer, cheque, and other agreed payment methods.</p>

<h2>5. Delivery</h2>
<p>We deliver to all provinces of Nepal. Delivery timelines vary by product and location, typically 3–14 business days within Kathmandu Valley and 7–21 business days for other regions. Delivery charges are communicated at the time of quotation.</p>

<h2>6. Warranty and Returns</h2>
<p>All products carry manufacturer warranties as specified. Warranty claims must be submitted within the warranty period. Returns are accepted for defective or incorrectly supplied products within 7 days of delivery. Custom orders and opened products are non-returnable unless defective.</p>

<h2>7. Installation and Support</h2>
<p>Professional installation services are available for applicable equipment. Annual Maintenance Contracts (AMC) are available for all major equipment categories. Technical support is available 24/7 at +977-9818100515.</p>

<h2>8. Intellectual Property</h2>
<p>All content on this website, including text, images, logos, and product descriptions, is the property of Meditrust Nepal or its content suppliers and is protected by copyright law. Unauthorized use is prohibited.</p>

<h2>9. Limitation of Liability</h2>
<p>Meditrust Nepal shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product in question.</p>

<h2>10. Governing Law</h2>
<p>These Terms and Conditions are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.</p>

<h2>11. Changes to Terms</h2>
<p>We reserve the right to modify these Terms and Conditions at any time. Changes take effect immediately upon posting to the website. Continued use of the website constitutes acceptance of the revised terms.</p>

<h2>12. Contact Us</h2>
<p>For any questions regarding these Terms and Conditions, please contact:<br/>
<strong>Meditrust Nepal</strong><br/>
Naxal, Bhagwati Bahal, Kathmandu, Nepal<br/>
Phone: +977-9818100515<br/>
Email: info@meditrustnepal.com</p>`;

const TermsConditions = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/legal', { silent: true }).then(r => setData(r.data)).catch(() => {});
  }, []);

  const title = data?.termsTitle || 'Terms & Conditions';
  const lastUpdated = data?.termsLastUpdated || '';
  const content = data?.termsContent || DEFAULT_CONTENT;

  return (
    <>
      <SeoHead
        title={title}
        description="Meditrust Nepal Terms and Conditions — pricing, delivery, warranty, and usage policies."
        keywords="Meditrust Nepal terms and conditions, medical equipment purchase terms Nepal"
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

export default TermsConditions;
