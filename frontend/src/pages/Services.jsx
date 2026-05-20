import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SeoHead, { buildOrganizationSchema, buildFAQSchema, buildBreadcrumbSchema } from '../components/SeoHead';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineTruck, HiOutlineOfficeBuilding, HiOutlineCog, HiOutlineSupport } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import api from '../api';

const ICONS = [HiOutlineTruck, HiOutlineOfficeBuilding, HiOutlineCog, HiOutlineSupport];
const COLORS = ['primary', 'accent', 'secondary', 'primary'];

const Services = () => {
  const { t } = useTranslation();
  const [svcSettings, setSvcSettings] = useState(null);

  useEffect(() => {
    api.get('/services-settings', { silent: true }).then(r => setSvcSettings(r.data)).catch(() => {});
  }, []);

  const DEFAULT_SERVICES = [
    {
      icon: HiOutlineTruck,
      title: 'Medical Equipment Supply',
      subtitle: 'Comprehensive Range of Medical Devices',
      description: 'We provide a comprehensive range of high-quality medical equipment from globally recognized manufacturers. From diagnostic devices to surgical instruments, patient monitoring systems to laboratory equipment, we have everything your healthcare facility needs.',
      features: [
        'Wide range of medical devices and instruments',
        'Products from internationally certified manufacturers',
        'Competitive pricing with transparent quotations',
        'Timely delivery across Nepal',
        'Quality assurance on all products',
        'Custom procurement for specialized equipment',
      ],
      color: 'primary',
    },
    {
      icon: HiOutlineOfficeBuilding,
      title: 'Hospital Project Consultation',
      subtitle: 'Planning and Design Expertise',
      description: 'Our team of experienced healthcare professionals and engineers provides comprehensive consultation for hospital projects. From initial planning to equipment selection, we ensure your healthcare facility is set up for success.',
      features: [
        'Hospital layout and design consultation',
        'Equipment selection and specification',
        'Budget planning and cost optimization',
        'Compliance with healthcare standards',
        'Vendor coordination and management',
        'Project timeline management',
      ],
      color: 'accent',
    },
    {
      icon: HiOutlineCog,
      title: 'Equipment Installation',
      subtitle: 'Professional Installation Services',
      description: 'Our certified technicians ensure proper installation of all medical equipment, following manufacturer specifications and international safety standards. We handle everything from site preparation to final commissioning and user training.',
      features: [
        'Professional and certified installation team',
        'Site assessment and preparation guidance',
        'Installation as per manufacturer standards',
        'Equipment calibration and testing',
        'User training and orientation',
        'Documentation and compliance certificates',
      ],
      color: 'secondary',
    },
    {
      icon: HiOutlineSupport,
      title: 'Maintenance & Technical Support',
      subtitle: 'Ongoing Service and Support',
      description: 'We provide comprehensive after-sales support and maintenance services to ensure your equipment operates at peak performance. Our 24/7 technical support team is always ready to assist you with any issues.',
      features: [
        '24/7 technical support helpline',
        'Preventive maintenance programs',
        'Corrective maintenance and repairs',
        'Spare parts supply and management',
        'Annual maintenance contracts (AMC)',
        'Remote diagnostics and troubleshooting',
      ],
      color: 'primary',
    },
  ];

  const services = svcSettings?.services?.length
    ? svcSettings.services.map((s, i) => ({ ...DEFAULT_SERVICES[i] || DEFAULT_SERVICES[0], ...s, icon: ICONS[i % ICONS.length], color: COLORS[i % COLORS.length] }))
    : DEFAULT_SERVICES;

  const heroLabel = svcSettings?.heroLabel || t('Services_Hero_Label');
  const heroTitle = svcSettings?.heroTitle || t('Services_Hero_Title');
  const heroDesc  = svcSettings?.heroDesc  || t('Services_Hero_Desc');

  const bgColors = {
    primary: 'bg-primary-50',
    accent: 'bg-cyan-50',
    secondary: 'bg-green-50',
  };

  const iconBgColors = {
    primary: 'bg-primary-100',
    accent: 'bg-cyan-100',
    secondary: 'bg-green-100',
  };

  const iconColors = {
    primary: 'text-primary-600',
    accent: 'text-cyan-600',
    secondary: 'text-green-600',
  };

  return (
    <>
      <SeoHead
        title="Medical Equipment Services — Supply, Installation & Support in Nepal"
        description="Meditrust Nepal offers end-to-end medical equipment services: supply, hospital project consultation, professional installation, and 24/7 after-sales maintenance across Nepal."
        keywords="medical equipment services Nepal, hospital equipment installation Nepal, medical equipment maintenance Nepal, hospital project consultation Nepal, AMC medical equipment Nepal"
        schemas={[
          buildOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/services' },
          ]),
          buildFAQSchema([
            { q: 'What medical equipment services does Meditrust Nepal offer?', a: 'Meditrust Nepal offers four core services: medical equipment supply, hospital project consultation, equipment installation and commissioning, and maintenance & technical support including 24/7 helpline and Annual Maintenance Contracts (AMC).' },
            { q: 'Does Meditrust Nepal provide after-sales support?', a: 'Yes. Our technical support team is available 24/7 and we offer Annual Maintenance Contracts (AMC), preventive maintenance programs, corrective repairs, and spare parts management.' },
            { q: 'Can Meditrust Nepal help set up a new hospital?', a: 'Absolutely. Our hospital project consultation service covers layout and design, equipment selection, budget planning, compliance with healthcare standards, and full project management.' },
            { q: 'Which areas of Nepal does Meditrust Nepal serve?', a: 'We serve hospitals and clinics across Nepal including Kathmandu, Pokhara, Chitwan, Butwal, Biratnagar and all other major cities.' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">{heroLabel}</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3 mb-4 leading-tight">{heroTitle}</h1>
          <p className="text-primary-100 max-w-2xl text-sm sm:text-base leading-relaxed">{heroDesc}</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-20">
          {services.map((service, idx) => (
            <div key={idx} className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={idx % 2 !== 0 ? 'lg:order-2' : ''}>
                <div className={`w-14 h-14 ${iconBgColors[service.color]} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className={`text-3xl ${iconColors[service.color]}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
                <p className="text-primary-600 font-medium text-sm mb-4">{service.subtitle}</p>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-sm text-gray-600">
                      <FaCheckCircle className={`${iconColors[service.color]} mr-3 mt-0.5 flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-primary inline-flex items-center">
                  {t('Get_Started')} <FaArrowRight className="ml-2" />
                </Link>
              </div>
              <div className={`${bgColors[service.color]} rounded-2xl p-12 flex items-center justify-center min-h-[350px] ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="text-center">
                  <div className={`w-24 h-24 ${iconBgColors[service.color]} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                    <service.icon className={`text-4xl ${iconColors[service.color]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{service.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('Ready_To_Start')}</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t('Ready_Desc')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/9779818100515?text=${encodeURIComponent('Hello Meditrust Nepal! 👋\n\n*Demo / Site Visit Request*\n📍 Source: Services Page — meditrustnepal.com/services\n\n🏥 Hospital/Clinic Name: [your hospital name]\n📞 Contact Person: [your name]\n🔧 Equipment of Interest: [product name or category]\n📅 Preferred Date: [preferred date]\n📍 Location: [your city/district]\n\nPlease confirm availability for a demo or site visit.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
            >
              📅 Request a Demo / Site Visit
            </a>
            <Link to="/contact" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg">
              {t('Contact_Us')}
            </Link>
            <Link to="/products" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-all">
              {t('View_Products')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
