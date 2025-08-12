import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { handleAsyncError } from '../utils/errorHandling';
import type { Database } from '../lib/supabase';

type NewsItem = Database['public']['Tables']['news']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type IncidentReport = Database['public']['Tables']['incident_reports']['Row'];
type GalleryItem = Database['public']['Tables']['gallery']['Row'];

interface DataContextType {
  // News
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNews: (id: string, news: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  
  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  // Incident Reports
  incidents: IncidentReport[];
  addIncident: (incident: Omit<IncidentReport, 'id' | 'date_reported' | 'updated_at' | 'reference_number'>) => Promise<void>;
  updateIncident: (id: string, incident: Partial<IncidentReport>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  // Loading states
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        // Use mock data if Supabase is not configured
        setNews([
          {
            id: '1',
            title: 'BDRRM Planning Training Workshop for Barangay Officials',
            excerpt: 'On June 25, 2024, the Municipal Disaster Risk Reduction and Management Office (MDRRMO) conducted an essential training session...',
            content: 'The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran successfully conducted a comprehensive Barangay Disaster Risk Reduction and Management (BDRRM) Planning Training Workshop on June 25, 2024, at Barangay Basicao Interior.',
            image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
            author: 'MDRRMO Staff',
            status: 'published',
            date: '2024-06-29',
            created_at: '2024-06-29T10:00:00Z',
            updated_at: '2024-06-29T10:00:00Z'
          },
          {
            id: '2',
            title: 'Successful Nationwide Simultaneous Earthquake Drill Conducted',
            excerpt: 'The municipality participated in the 2nd quarter nationwide simultaneous earthquake drill with over 5,000 participants...',
            content: 'Pio Duran municipality successfully participated in the 2nd quarter nationwide simultaneous earthquake drill, demonstrating our commitment to disaster preparedness and community safety.',
            image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg',
            author: 'MDRRMO Staff',
            status: 'published',
            date: '2023-06-09',
            created_at: '2023-06-09T10:00:00Z',
            updated_at: '2023-06-09T10:00:00Z'
          }
        ]);
        
        setServices([
          {
            id: '1',
            title: 'Disaster Prevention & Mitigation',
            description: 'Immediate response to disaster-related emergencies with our trained response teams.',
            icon: 'Shield',
            tags: ['Search & Rescue', 'Medical Assistance', 'Fire Response'],
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            title: 'Disaster Preparedness',
            description: 'Regular training programs for community members, volunteers, and responders.',
            icon: 'Heart',
            tags: ['First Aid Training', 'DRRM Workshops', 'Drills'],
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]);
        
        setGallery([
          {
            id: '1',
            title: 'BDRRM Planning Training Workshop',
            description: 'Training session on Barangay Disaster Risk Reduction and Management Planning at Barangay Basicao Interior.',
            image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
            category: 'Training',
            date: '2024-06-25',
            location: 'Barangay Basicao Interior',
            tags: ['BDRRM', 'Training', 'Workshop', 'Barangay Officials'],
            status: 'published',
            featured: true,
            created_at: '2024-06-25T00:00:00Z',
            updated_at: '2024-06-25T00:00:00Z'
          }
        ]);
        
        setIncidents([]);
        setLoading(false);
        return;
      }
      // Fetch news
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      // Fetch incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incident_reports')
        .select('*')
        .order('date_reported', { ascending: false });

      if (incidentsError) throw incidentsError;

      // Fetch gallery
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryError) throw galleryError;

      setNews(newsData || []);
      setServices(servicesData || []);
      setIncidents(incidentsData || []);
      setGallery(galleryData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // News functions
  const addNews = async (newsItem: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
    return handleAsyncError(async () => {
      const { data, error } = await supabase
        .from('news')
        .insert([newsItem])
        .select()
        .single();

      if (error) throw error;
      setNews(prev => [data, ...prev]);
    }, 'Failed to add news article');
  };

  const updateNews = async (id: string, updates: Partial<NewsItem>) => {
    return handleAsyncError(async () => {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNews(prev => prev.map(item => item.id === id ? data : item));
    }, 'Failed to update news article');
  };

  const deleteNews = async (id: string) => {
    return handleAsyncError(async () => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNews(prev => prev.filter(item => item.id !== id));
    }, 'Failed to delete news article');
  };

  // Services functions
  const addService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      setServices(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding service:', err);
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setServices(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServices(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  // Incidents functions
  const addIncident = async (incident: Omit<IncidentReport, 'id' | 'date_reported' | 'updated_at' | 'reference_number'>) => {
    try {
      const referenceNumber = `RD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      
      const { data, error } = await supabase
        .from('incident_reports')
        .insert([{ 
          ...incident, 
          reference_number: referenceNumber,
          reporter_name: (incident as any).reporterName || incident.reporter_name,
          contact_number: (incident as any).contactNumber || incident.contact_number,
          incident_type: (incident as any).incidentType || incident.incident_type
        }])
        .select()
        .single();

      if (error) throw error;
      setIncidents(prev => [data, ...prev]);
      return referenceNumber;
    } catch (err) {
      console.error('Error adding incident:', err);
      throw err;
    }
  };

  const updateIncident = async (id: string, updates: Partial<IncidentReport>) => {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setIncidents(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating incident:', err);
      throw err;
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIncidents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting incident:', err);
      throw err;
    }
  };

  // Gallery functions
  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      setGallery(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding gallery item:', err);
      throw err;
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGallery(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating gallery item:', err);
      throw err;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGallery(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      news, addNews, updateNews, deleteNews,
      services, addService, updateService, deleteService,
      incidents, addIncident, updateIncident, deleteIncident,
      gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      loading, error
    }}>
      {children}
    </DataContext.Provider>
  );
};