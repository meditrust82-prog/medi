import React, { useState, useEffect } from 'react';
import SeoHead, { buildOrganizationSchema, buildBreadcrumbSchema, buildFAQSchema } from '../components/SeoHead';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { HiOutlineShieldCheck, HiOutlineLightBulb, HiOutlineHeart, HiOutlineUsers } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import api from '../api';

const VALUE_ICONS = [HiOutlineShieldCheck, HiOutlineHeart, HiOutlineLightBulb, HiOutlineUsers];

const DEFAULT_VALUES = [
  { icon: HiOutlineShieldCheck, title: 'Integrity', desc: 'We conduct our business with the highest ethical standards and transparency.' },
  { icon: HiOutlineHeart, title: 'Quality', desc: 'We never compromise on the quality of our products and services.' },
  { icon: HiOutlineLightBulb, title: 'Innovation', desc: 'We stay updated with the latest advancements in medical technology.' },
  { icon: HiOutlineUsers, title: 'Customer Focus', desc: 'Our customers are at the heart of everything we do.' },
];

const DEFAULT_MILESTONES = [
  { year: '2009', title: 'Company Founded', desc: 'Meditrust Nepal was established in Kathmandu with a vision to provide quality medical equipment.' },
  { year: '2012', title: 'First Major Hospital Project', desc: 'Successfully completed equipment supply for a 200-bed hospital in Kathmandu.' },
  { year: '2015', title: 'Expanded Product Range', desc: 'Added imaging equipment and laboratory instruments to our product portfolio.' },
  { year: '2018', title: 'Regional Expansion', desc: 'Extended services to hospitals in Pokhara, Chitwan, and other major cities.' },
  { year: '2020', title: 'COVID-19 Response', desc: 'Played a crucial role in supplying critical care equipment during the pandemic.' },
  { year: '2023', title: '200+ Hospital Partners', desc: 'Reached the milestone of serving over 200 healthcare institutions across Nepal.' },
];

const DEFAULT_TEAM = [
  { name: 'Rajesh Shrestha', role: 'Managing Director', desc: 'Over 20 years of experience in the medical equipment industry.' },
  { name: 'Dr. Anita Gurung', role: 'Technical Director', desc: 'MBBS, MS with expertise in hospital planning and equipment selection.' },
  { name: 'Sunil Maharjan', role: 'Operations Manager', desc: 'Expert in logistics and supply chain management.' },
  { name: 'Priya Adhikari', role: 'Sales Manager', desc: 'Dedicated to providing the best solutions for our clients.' },
];

const About = () => {
  const { t } = useTranslation();
  const [cms, setCms] = useState(null);

  useEffect(() => {
    api.get('/about-settings', { silent: true }).then(r => setCms(r.data)).catch(() => {});
  }, []);

  const heroLabel  = cms?.heroLabel  || t('About_Hero_Label');
  const heroTitle  = cms?.heroTitle  || t('About_Hero_Title');
  const heroDesc   = cms?.heroDesc   || t('About_Hero_Desc');
  const storyPara1 = cms?.storyPara1 || 'Founded in 2009, Meditrust Nepal started with a simple mission: to make high-quality medical equipment accessible to healthcare institutions across Nepal. Over the years, we have grown from a small supplier to one of the most trusted names in the medical equipment industry.';
  const storyPara2 = cms?.storyPara2 || 'We understand the critical role that medical equipment plays in patient care and diagnosis. That is why we partner with globally recognized manufacturers to bring the best products to Nepali healthcare institutions, backed by professional installation and after-sales support.';
  const storyBadge = cms?.storyBadge || '15+';
  const missionText = cms?.missionText || 'To provide high-quality, reliable, and affordable medical equipment to healthcare institutions across Nepal, ensuring better patient care and diagnosis. We aim to bridge the gap between international medical technology and Nepali healthcare needs.';
  const visionText  = cms?.visionText  || 'To become the most trusted and preferred medical equipment partner for healthcare institutions in Nepal and South Asia, contributing to the advancement of healthcare infrastructure and improved patient outcomes.';

  const values = cms?.values?.length
    ? cms.values.map((v, i) => ({ ...v, icon: VALUE_ICONS[i % VALUE_ICONS.length] }))
    : DEFAULT_VALUES;
  const milestones = cms?.milestones?.length ? cms.milestones : DEFAULT_MILESTONES;
  const team       = cms?.team?.length       ? cms.team       : DEFAULT_TEAM;

  return (
    <>
      <SeoHead
        title="About Us — Leading Medical Equipment Supplier in Nepal Since 2009"
        description="Learn about Meditrust Nepal — founded in 2009, we are Kathmandu's trusted medical equipment supplier serving 200+ hospitals across Nepal with CE & ISO certified products."
        keywords="about Meditrust Nepal, medical equipment company Nepal, hospital equipment Kathmandu, medical device supplier Nepal"
        schemas={[
          buildOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'About Us', url: '/about' },
          ]),
          buildFAQSchema([
            { q: 'When was Meditrust Nepal established?', a: 'Meditrust Nepal was established in 2009 and has since grown to become one of Nepal\'s leading suppliers of certified medical equipment.' },
            { q: 'What does Meditrust Nepal do?', a: 'Meditrust Nepal imports, distributes and services CE and ISO certified medical equipment — including surgical instruments, ICU equipment, patient monitors, diagnostic devices and laboratory equipment — to hospitals and clinics across Nepal.' },
            { q: 'Is Meditrust Nepal equipment certified?', a: 'Yes. All products supplied by Meditrust Nepal are CE and ISO certified, meeting international safety and quality standards.' },
            { q: 'How many hospitals does Meditrust Nepal serve?', a: 'Meditrust Nepal serves over 200 hospitals, clinics and health institutions across Nepal.' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">{heroLabel}</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4 sm:mb-6 leading-tight">{heroTitle}</h1>
            <p className="text-primary-100 text-sm sm:text-base lg:text-lg leading-relaxed">{heroDesc}</p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">{t('Our_Story_Label')}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-6">{t('Our_Story_Title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {storyPara1}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {storyPara2}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['ISO Certified Products', 'Expert Technical Team', '24/7 Support', 'Nationwide Coverage'].map((item, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <FaCheckCircle className="text-primary-600 mr-2 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{storyBadge}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('Years_Excellence')}</h3>
                  <p className="text-gray-600 mt-2">{t('In_Medical_Supply')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('Our_Mission')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {missionText}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('Our_Vision')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">{t('Our_Values_Label')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">{t('Our_Values_Title')}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center p-4 sm:p-8 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300 group">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                  <value.icon className="text-3xl text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">{t('Our_Team_Label')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">{t('Our_Team_Title')}</h2>
            <p className="text-gray-600 mt-4">{t('Our_Team_Desc')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm card-hover text-center border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-3">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">{t('Our_Journey_Label')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">{t('Our_Journey_Title')}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {milestone.year}
                  </div>
                  {idx !== milestones.length - 1 && <div className="w-0.5 h-full bg-primary-200 mt-2"></div>}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('Partner_With_Us')}</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">{t('Partner_Desc')}</p>
          <Link to="/contact" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all inline-flex items-center">
            {t('Get_In_Touch')} <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default About;
