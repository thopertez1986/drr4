import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const { gallery } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publishedGallery = gallery.filter(item => item.status === 'published');
  const categories = ['all', ...Array.from(new Set(publishedGallery.map(item => item.category).filter(Boolean)))];

  const filteredItems = publishedGallery.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredItems = filteredItems.filter(item => item.featured);

  // If no gallery items available, show admin link
  if (publishedGallery.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">Gallery</h1>
            <div className="bg-white rounded-xl shadow-lg p-12">
              <Tag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Gallery Items Available</h2>
              <p className="text-gray-600 mb-6">Photos and activities will appear here once uploaded by the admin.</p>
              <Link 
                to="/admin/gallery"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users className="mr-2" size={16} />
                Go to Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-blue-950 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Explore our collection of activities, training sessions, and community events
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="py-16">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{publishedGallery.length}</div>
              <div className="text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{featuredItems.length}</div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Date().getFullYear() - 2020}+
              </div>
              <div className="text-gray-600">Years Active</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search gallery items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

          {/* Featured Items */}
        {featuredItems.length > 0 && (
  <>
    <h2 className="text-2xl font-bold text-blue-900 mb-6">Featured</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {featuredItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="relative">
            <img
              src={
                item.image ||
                'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg'
              }
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Featured
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                {item.category || 'Event'}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">
              {item.description || 'No description available'}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2" />
                {item.location || 'Location not specified'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(item.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
)}

          {/* All Items */}
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            All Items ({filteredItems.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={item.image || 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg'}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.category || 'Event'}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description || 'No description available'}</p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={12} className="mr-1" />
                      {item.location || 'Location not specified'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {(item.tags || []).slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {(item.tags || []).length > 3 && (
                      <span className="text-xs text-gray-500">+{(item.tags || []).length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;