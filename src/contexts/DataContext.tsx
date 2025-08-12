import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsItem])
        .select()
        .single();

      if (error) throw error;
      setNews(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding news:', err);
      throw err;
    }
  };

  const updateNews = async (id: string, updates: Partial<NewsItem>) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNews(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating news:', err);
      throw err;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting news:', err);
      throw err;
    }
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