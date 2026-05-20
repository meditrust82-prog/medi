import React, { useState, useEffect } from 'react';
import SeoHead, { buildBreadcrumbSchema } from '../components/SeoHead';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../api';

const projectCategories = ['All', 'Hospital Setup', 'Laboratory', 'ICU Setup', 'OT Setup', 'Diagnostic Center'];

const defaultProjects = [
  { _id: '1', title: 'Bir Hospital ICU Upgrade', category: 'ICU Setup', description: 'Complete ICU equipment supply and installation for 20-bed intensive care unit at Bir Hospital, including ventilators, patient monitors, and infusion pumps.', image: null, year: '2023' },
  { _id: '2', title: 'Nepal Mediciti Laboratory Setup', category: 'Laboratory', description: 'Full laboratory equipment setup including hematology analyzers, chemistry analyzers, and microscopy equipment.', image: null, year: '2022' },
  { _id: '3', title: 'Grande Hospital OT Installation', category: 'OT Setup', description: 'Operation theatre equipment supply including OT lights, tables, anesthesia machines, and electrosurgical units.', image: null, year: '2023' },
  { _id: '4', title: 'Patan Hospital Diagnostic Center', category: 'Diagnostic Center', description: 'Complete diagnostic center setup with X-ray, ultrasound, and ECG machines for outpatient diagnostics.', image: null, year: '2022' },
  { _id: '5', title: 'Teaching Hospital Equipment Supply', category: 'Hospital Setup', description: 'Comprehensive medical equipment supply for multiple departments including emergency, surgery, and radiology.', image: null, year: '2021' },
  { _id: '6', title: 'Norvic Hospital Expansion', category: 'Hospital Setup', description: 'Medical equipment for new wing expansion including patient monitoring systems and nursing station equipment.', image: null, year: '2023' },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const data = res.data.projects || res.data || [];
        setProjects(data.length > 0 ? data : defaultProjects);
      } catch (err) {
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const currentIdx = selectedProject ? filteredProjects.findIndex(p => p.id === selectedProject.id) : -1;

  const navigateProject = (dir) => {
    const newIdx = currentIdx + dir;
    if (newIdx >= 0 && newIdx < filteredProjects.length) {
      setSelectedProject(filteredProjects[newIdx]);
    }
  };

  return (
    <>
      <SeoHead
        title="Projects — Hospital Setups & Medical Equipment Installations Nepal"
        description="Explore Meditrust Nepal's completed projects: ICU setups, OT installations, laboratory equipment, and hospital fitouts for leading hospitals across Nepal."
        keywords="hospital setup Nepal, medical equipment installation Nepal, ICU setup Kathmandu, OT setup Nepal, hospital project Nepal, laboratory setup Nepal"
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Projects', url: '/projects' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Meditrust Nepal Projects',
            description: 'Completed hospital equipment installation and setup projects across Nepal.',
            url: 'https://meditrustnepal.com/projects',
          },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Our Projects</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4">Completed Projects</h1>
          <p className="text-primary-100 max-w-2xl">Explore our successfully completed projects across hospitals and healthcare institutions in Nepal.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6"><div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div><div className="h-3 bg-gray-200 rounded w-full"></div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group cursor-pointer border border-gray-100"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-primary-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <p className="text-primary-500 text-sm font-medium">{project.category}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-medium">View Project</span>
                    </div>
                    {project.year && (
                      <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">{project.year}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-primary-600 text-xs font-medium">{project.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-primary-600 transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-gray-500">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <img src={selectedProject.images[0]} alt={selectedProject.title} className="w-full h-80 object-cover rounded-t-2xl" />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-2xl">
                  <svg className="w-24 h-24 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <FaTimes className="text-gray-700" />
              </button>
              {/* Navigation */}
              {currentIdx > 0 && (
                <button onClick={() => navigateProject(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                  <FaChevronLeft className="text-gray-700" />
                </button>
              )}
              {currentIdx < filteredProjects.length - 1 && (
                <button onClick={() => navigateProject(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                  <FaChevronRight className="text-gray-700" />
                </button>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">{selectedProject.category}</span>
                {selectedProject.year && <span className="text-gray-500 text-sm">{selectedProject.year}</span>}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
