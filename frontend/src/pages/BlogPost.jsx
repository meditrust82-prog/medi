import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHead, { buildBlogPostingSchema, buildBreadcrumbSchema } from '../components/SeoHead';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import api from '../api';

const DEFAULT_POSTS = {
  'icu-ventilator-price-nepal-2025': {
    slug: 'icu-ventilator-price-nepal-2025',
    title: 'ICU Ventilator Price in Nepal 2025 — Complete Buying Guide',
    excerpt: 'Compare ICU ventilator prices in Nepal. Learn what affects cost, which brands are CE certified, and how to request a quote from Meditrust Nepal.',
    category: 'ICU Equipment',
    author: 'Meditrust Nepal',
    createdAt: '2025-01-10',
    content: `
      <h2>ICU Ventilator Prices in Nepal — What to Expect in 2025</h2>
      <p>Setting up or upgrading an ICU in Nepal requires careful consideration of ventilator costs, which can vary significantly based on features, brand, and support terms. This guide breaks down everything you need to know before purchasing.</p>
      <h3>Price Ranges by Category</h3>
      <ul>
        <li><strong>Basic Volume/Pressure Ventilators:</strong> NPR 8,00,000 – 15,00,000. Suitable for general wards with basic ventilation needs.</li>
        <li><strong>Mid-Range ICU Ventilators (with CPAP/BiPAP):</strong> NPR 15,00,000 – 35,00,000. Recommended for district hospitals and general ICUs.</li>
        <li><strong>High-End Critical Care Ventilators:</strong> NPR 35,00,000 – 80,00,000+. Feature advanced modes (PRVC, APRV, HFOV) suitable for tertiary centers and NICU.</li>
        <li><strong>Transport/Portable Ventilators:</strong> NPR 6,00,000 – 18,00,000. For ambulance, intrahospital transfer, and field use.</li>
      </ul>
      <h3>Key Features That Affect Price</h3>
      <ul>
        <li><strong>Ventilation modes:</strong> More modes (A/C, SIMV, PSV, PRVC, APRV) = higher cost</li>
        <li><strong>Monitoring capabilities:</strong> Integrated SpO2, EtCO2, and waveform loops add value</li>
        <li><strong>Screen size and UI:</strong> Touchscreen models cost more but reduce training time</li>
        <li><strong>Battery backup:</strong> Critical for load-shedding in Nepal; essential feature</li>
        <li><strong>Neonatal compatibility:</strong> Ventilators supporting neonates carry a significant premium</li>
      </ul>
      <h3>Certification Requirements in Nepal</h3>
      <p>The Department of Drug Administration (DDA) Nepal requires all imported medical devices including ventilators to carry CE marking and ISO 13485 certification. Always request the Certificate of Conformity and Declaration of Conformity before purchasing.</p>
      <h3>Top Brands Available Through Meditrust Nepal</h3>
      <p>Meditrust Nepal supplies internationally certified ICU ventilators from established manufacturers with full installation, biomedical training, and after-sales service across Nepal. All units come with:</p>
      <ul>
        <li>CE and ISO 13485 certification documentation</li>
        <li>On-site installation and commissioning</li>
        <li>Staff training (2–3 days)</li>
        <li>Preventive Maintenance Contract (PMC) options</li>
        <li>Genuine spare parts availability</li>
      </ul>
      <h3>How to Get a Quotation</h3>
      <p>Contact Meditrust Nepal via WhatsApp at +977-9818100515 or through our <a href="/contact">contact page</a>. Specify your requirements: ward type, number of beds, budget range, and any specific ventilation modes needed. We provide same-day quotations for most standard requests.</p>
      <p><strong>Pro tip:</strong> Use our <a href="/bulk-inquiry">Bulk Inquiry form</a> if you need ventilators alongside other ICU equipment — we can prepare a consolidated quotation for your entire department.</p>
    `,
  },
  'patient-monitor-buying-guide-nepal': {
    slug: 'patient-monitor-buying-guide-nepal',
    title: 'Patient Monitor Buying Guide for Hospitals in Nepal',
    excerpt: 'How to choose the right patient monitor for your hospital in Nepal. Compare bedside vs transport monitors, parameters, brands and prices.',
    category: 'Monitoring Equipment',
    author: 'Meditrust Nepal',
    createdAt: '2025-02-05',
    content: `
      <h2>Choosing the Right Patient Monitor for Your Hospital</h2>
      <p>Patient monitors are among the most frequently purchased pieces of equipment in Nepali hospitals. Whether you're equipping a new ward, upgrading aging monitors, or setting up a step-down ICU, this guide will help you make an informed decision.</p>
      <h3>Types of Patient Monitors</h3>
      <ul>
        <li><strong>Bedside Monitors:</strong> Designed to stay at the patient's bedside. Typically 10–15 inch screens. Suitable for ICU, HDU, post-op wards.</li>
        <li><strong>Central Station Monitors:</strong> Network multiple bedside monitors to a nurse station for centralized oversight. Recommended for ICUs with 4+ beds.</li>
        <li><strong>Transport Monitors:</strong> Compact, battery-powered. Essential for moving patients between departments or for ambulance use.</li>
        <li><strong>Spot-Check Monitors:</strong> For quick vital signs in OPD, emergency triage, and GP clinics.</li>
      </ul>
      <h3>Essential Parameters to Consider</h3>
      <ul>
        <li><strong>ECG (3-lead or 5-lead):</strong> Standard for all ICU monitors; 5-lead provides better ST monitoring</li>
        <li><strong>SpO2:</strong> Essential everywhere; look for Masimo or Nellcor technology for accuracy in motion</li>
        <li><strong>NIBP:</strong> Automatic NIBP cycling is standard; dual-mode (adult/pediatric cuffs) recommended</li>
        <li><strong>Temperature:</strong> Important in post-op and neonatal settings</li>
        <li><strong>EtCO2 (capnography):</strong> Critical for intubated patients; often an add-on module</li>
        <li><strong>IBP (Invasive Blood Pressure):</strong> Required for cardiac ICU and post-cardiac surgery units</li>
      </ul>
      <h3>Price Guide (Nepal 2025)</h3>
      <ul>
        <li>Basic 5-parameter monitor (ECG, SpO2, NIBP, RR, Temp): NPR 80,000 – 2,00,000</li>
        <li>Multi-parameter ICU monitor with EtCO2: NPR 2,00,000 – 5,00,000</li>
        <li>Central monitoring station (4–8 beds): NPR 4,00,000 – 12,00,000</li>
        <li>Transport monitor with battery: NPR 1,20,000 – 3,50,000</li>
      </ul>
      <h3>Connectivity and EMR Integration</h3>
      <p>Modern hospitals in Nepal are increasingly integrating patient monitors with Hospital Management Systems (HMS). Look for monitors with LAN/WiFi connectivity and HL7 output capability if you plan to integrate with your EMR in the future.</p>
      <h3>After-Sales Support in Nepal</h3>
      <p>This is often overlooked but is the most important factor for long-term value. Meditrust Nepal provides same-day response for critical equipment failures in Kathmandu and next-day support in major cities including Pokhara, Biratnagar, Bharatpur, and Butwal.</p>
      <p>Contact us at <a href="/contact">meditrustnepal.com/contact</a> or WhatsApp +977-9818100515 for a customized recommendation based on your ward setup.</p>
    `,
  },
  'how-to-set-up-icu-nepal': {
    slug: 'how-to-set-up-icu-nepal',
    title: 'How to Set Up an ICU in Nepal — Complete Equipment Checklist',
    excerpt: 'Planning to set up an ICU in Nepal? This complete checklist covers every essential piece of medical equipment, staffing ratios, and procurement tips.',
    category: 'Hospital Setup',
    author: 'Meditrust Nepal',
    createdAt: '2025-02-20',
    content: `
      <h2>Setting Up an ICU in Nepal — A Practical Equipment Guide</h2>
      <p>Opening or upgrading an intensive care unit (ICU) is a major undertaking. Based on our experience supplying equipment to over 200 hospitals across Nepal, we've compiled the essential checklist every procurement team needs.</p>
      <h3>ICU Equipment Checklist by Category</h3>
      <h4>Life Support Equipment</h4>
      <ul>
        <li>Mechanical Ventilators (1 per ICU bed minimum)</li>
        <li>Infusion Pumps (2–4 per bed)</li>
        <li>Syringe Pumps (2–4 per bed)</li>
        <li>Defibrillator / AED</li>
        <li>Suction Machines</li>
        <li>Oxygen Concentrators (as backup)</li>
        <li>High-Flow Nasal Cannula (HFNC) System</li>
      </ul>
      <h4>Monitoring Equipment</h4>
      <ul>
        <li>Multi-parameter Patient Monitors (1 per bed)</li>
        <li>Central Monitoring Station</li>
        <li>Portable Pulse Oximeters</li>
        <li>Blood Gas Analyzer (ABG machine)</li>
        <li>Point-of-Care Glucometers</li>
      </ul>
      <h4>Hospital Furniture & Beds</h4>
      <ul>
        <li>ICU Electric Beds (hi-lo, Trendelenburg, cardiac chair position)</li>
        <li>Overbed Tables</li>
        <li>IV Poles</li>
        <li>Nurse Call Systems</li>
      </ul>
      <h4>Diagnostic Equipment</h4>
      <ul>
        <li>Portable X-Ray (or C-arm access)</li>
        <li>Portable Ultrasound (bedside)</li>
        <li>12-lead ECG Machine</li>
        <li>Temperature Management System</li>
      </ul>
      <h3>DDA Certification Requirements</h3>
      <p>All medical devices imported into Nepal must be registered with the Department of Drug Administration (DDA). Ensure your supplier provides CE/ISO certificates and registration documents. Meditrust Nepal handles all DDA compliance documentation for every device we supply.</p>
      <h3>Budget Planning</h3>
      <p>A complete 4-bed ICU setup in Nepal (mid-range equipment) typically costs NPR 80 lakhs to 1.5 crore depending on specifications. Use our <a href="/bulk-inquiry">Bulk Inquiry form</a> to get a consolidated quotation for your complete ICU setup.</p>
      <p>We offer phased procurement planning so you can prioritize critical equipment first and add specialized equipment as your budget allows.</p>
    `,
  },
  'surgical-instruments-nepal': {
    slug: 'surgical-instruments-nepal',
    title: 'Surgical Instruments in Nepal — CE Certified Sources & Prices',
    excerpt: 'Where to buy CE certified surgical instruments in Nepal. Compare prices for laparoscopic sets, basic surgical trays, orthopedic instruments and more.',
    category: 'Surgical Equipment',
    author: 'Meditrust Nepal',
    createdAt: '2025-03-01',
    content: `
      <h2>Buying Surgical Instruments in Nepal — What You Need to Know</h2>
      <p>Surgical instruments represent one of the highest-volume purchases for hospital procurement departments in Nepal. This guide covers everything from basic instrument sets to advanced laparoscopic equipment.</p>
      <h3>Categories of Surgical Instruments</h3>
      <h4>General Surgery</h4>
      <ul>
        <li>Scalpel handles and blades (various sizes)</li>
        <li>Forceps (tissue, dressing, hemostatic — Mosquito, Kelly, Kocher)</li>
        <li>Scissors (Mayo, Metzenbaum, iris)</li>
        <li>Retractors (Langenbeck, Deaver, Balfour)</li>
        <li>Needle holders (Mayo-Hegar, Castroviejo)</li>
        <li>Suction tips and tubing</li>
      </ul>
      <h4>Laparoscopic Surgery Set</h4>
      <ul>
        <li>Laparoscopic camera and light source</li>
        <li>CO2 insufflator</li>
        <li>Laparoscopic graspers, scissors, clip applicators</li>
        <li>Trocars (5mm, 10mm, 12mm)</li>
        <li>Energy devices (harmonic scalpel, LigaSure)</li>
      </ul>
      <h4>Orthopedic Instruments</h4>
      <ul>
        <li>Bone saws and drills</li>
        <li>Chisels, mallets, elevators</li>
        <li>Implant systems (plates, screws, nails)</li>
        <li>Arthroscopy sets</li>
      </ul>
      <h3>CE Certification — Why It Matters</h3>
      <p>CE-marked surgical instruments meet European Union safety standards for medical devices. In Nepal, the DDA recommends CE certification as a quality benchmark. Always request the Declaration of Conformity and test certificates for stainless steel grade (German 4116 or 17-4 PH for premium instruments).</p>
      <h3>Price Guide</h3>
      <ul>
        <li>Basic General Surgery Set (20 pieces): NPR 40,000 – 1,20,000</li>
        <li>Laparoscopic Basic Set (10 instruments): NPR 2,50,000 – 8,00,000</li>
        <li>Orthopedic Drill and Saw Set: NPR 1,80,000 – 5,00,000</li>
        <li>Sterilization Tray with Instruments: NPR 15,000 – 80,000</li>
      </ul>
      <h3>Sterilization and Maintenance</h3>
      <p>Quality surgical instruments are designed to withstand repeated autoclave sterilization (134°C, 18 psi). Meditrust Nepal also supplies autoclaves, ultrasonic cleaners, and sterilization pouches. Ask about our complete OT setup packages.</p>
      <p>Contact Meditrust Nepal at +977-9818100515 or visit <a href="/products">our products page</a> to browse our full catalogue of CE-certified surgical instruments.</p>
    `,
  },
  'medical-equipment-maintenance-nepal': {
    slug: 'medical-equipment-maintenance-nepal',
    title: 'Medical Equipment Maintenance in Nepal — AMC, PMC & Best Practices',
    excerpt: 'How to maintain medical equipment in Nepali hospitals. Learn about Annual Maintenance Contracts (AMC), Preventive Maintenance, and common equipment failures.',
    category: 'Maintenance',
    author: 'Meditrust Nepal',
    createdAt: '2025-03-15',
    content: `
      <h2>Medical Equipment Maintenance in Nepal — A Hospital Manager's Guide</h2>
      <p>Equipment downtime in a hospital can directly impact patient care. In Nepal's challenging environment — with load-shedding, humidity variation, and dust — a robust maintenance program is not optional, it's essential.</p>
      <h3>Types of Maintenance Contracts</h3>
      <h4>Annual Maintenance Contract (AMC)</h4>
      <p>AMC covers corrective maintenance — repairs when something breaks. This is the minimum level of support you should have for critical equipment. Typical AMC response time in Nepal:</p>
      <ul>
        <li>Kathmandu Valley: 4–8 hours</li>
        <li>Major cities (Pokhara, Biratnagar, Bharatpur): 24 hours</li>
        <li>Remote areas: 48–72 hours + transportation logistics</li>
      </ul>
      <h4>Preventive Maintenance Contract (PMC)</h4>
      <p>PMC includes scheduled visits (quarterly or biannual) to inspect, clean, calibrate, and replace wearing parts before they fail. Studies show PMC reduces equipment downtime by 60–70% compared to AMC-only coverage.</p>
      <p>Recommended PMC schedule for critical equipment:</p>
      <ul>
        <li><strong>Ventilators:</strong> Every 3 months (replace exhalation valves, filters, check seals)</li>
        <li><strong>Patient Monitors:</strong> Every 6 months (battery calibration, sensor check, software update)</li>
        <li><strong>Defibrillators:</strong> Monthly energy output test, quarterly full service</li>
        <li><strong>Infusion/Syringe Pumps:</strong> Every 6 months (flow accuracy test, battery check)</li>
        <li><strong>Autoclaves:</strong> Monthly Bowie-Dick and Helix tests, annual validation</li>
      </ul>
      <h3>Common Equipment Failures in Nepal</h3>
      <ul>
        <li><strong>Ventilators:</strong> Exhalation valve clogging from dust; flow sensor contamination; power surge damage</li>
        <li><strong>Patient Monitors:</strong> SpO2 probe failures (most common); battery degradation; touchscreen damage</li>
        <li><strong>Infusion Pumps:</strong> Motor wear; door latch failures; occlusion alarm sensor drift</li>
        <li><strong>Autoclaves:</strong> Door seal wear; solenoid valve failure; chamber corrosion from poor water quality</li>
      </ul>
      <h3>Biomedical Engineering — Building Internal Capacity</h3>
      <p>Meditrust Nepal offers biomedical technician training as part of all equipment purchases. We recommend every hospital with more than 20 beds hire or train at least one dedicated biomedical technician.</p>
      <h3>Spare Parts Availability</h3>
      <p>One of the biggest maintenance challenges in Nepal is spare parts availability. Before purchasing equipment, always ask: <em>Are spare parts available in Nepal? What is the typical lead time?</em></p>
      <p>Meditrust Nepal maintains a local spare parts inventory for all equipment we supply, ensuring faster repair turnaround. Contact us at <a href="/contact">meditrustnepal.com/contact</a> or WhatsApp +977-9818100515.</p>
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${slug}`);
        setPost(res.data.blog || res.data);

        // Fetch related posts
        const relRes = await api.get('/blogs?limit=3');
        const blogs = relRes.data.blogs || relRes.data || [];
        setRelatedPosts(blogs.filter(b => (b.slug || b.id) !== slug).slice(0, 3));
      } catch (err) {
        const fallback = DEFAULT_POSTS[slug];
        setPost(fallback || {
          title: 'Blog Post',
          content: '<p>This blog post content will be available soon.</p>',
          author: 'Meditrust Nepal',
          createdAt: new Date().toISOString(),
          category: 'Healthcare',
        });
        setRelatedPosts(Object.values(DEFAULT_POSTS).filter(p => p.slug !== slug).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-80 bg-gray-200 rounded-2xl mb-8"></div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (<div key={i} className="h-4 bg-gray-200 rounded w-full"></div>))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <Link to="/blog" className="btn-primary inline-flex items-center"><FaArrowLeft className="mr-2" /> Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={post.title}
        description={post.excerpt || post.content?.substring(0, 160) || post.title}
        image={post.image || undefined}
        type="article"
        schemas={[
          buildBlogPostingSchema(post),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title },
          ]),
        ]}
      />

      <article className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-primary-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 line-clamp-1">{post.title}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            {post.category && (
              <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-4">{post.category}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <span className="flex items-center"><FaUser className="mr-2" />{post.author || 'Meditrust Nepal'}</span>
              <span className="flex items-center"><FaCalendarAlt className="mr-2" />{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image ? (
            <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-2xl mb-8" />
          ) : (
            <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl mb-8">
              <svg className="w-24 h-24 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }} />
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-3">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <FaFacebookF />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                <FaTwitter />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <FaLinkedinIn />
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Back */}
          <Link to="/blog" className="inline-flex items-center text-primary-600 font-medium hover:underline mb-12">
            <FaArrowLeft className="mr-2" /> Back to All Articles
          </Link>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug || rp.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group border border-gray-100">
                    <div className="h-36 bg-gray-100 overflow-hidden">
                      {rp.image ? (
                        <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                          <svg className="w-10 h-10 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{rp.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(rp.createdAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost;
