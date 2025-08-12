import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'typhoon' | 'earthquake' | 'flood' | 'fire' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  issuedAt: string;
}

const EmergencyAlertBanner: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Mock alerts - in production, these would come from your database
  const mockAlerts: EmergencyAlert[] = [
    {
      id: '1',
      type: 'typhoon',
      severity: 'high',
      title: 'Typhoon Warning - Signal No. 2',
      message: 'Typhoon "Pepito" is approaching. Expected landfall in 12 hours. Residents in low-lying areas should evacuate immediately.',
      location: 'Municipality-wide',
      issuedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Simulate fetching alerts
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'typhoon':
        return '🌪️';
      case 'earthquake':
        return '🌍';
      case 'flood':
        return '🌊';
      case 'fire':
        return '🔥';
      default:
        return '⚠️';
    }
  };

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentAlertIndex];

  return (
    <div className={`${getSeverityColor(currentAlert.severity)} text-white py-3 px-4 relative z-40`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl animate-pulse">{getTypeIcon(currentAlert.type)}</span>
            <AlertTriangle className="animate-bounce" size={20} />
            <span className="font-bold text-sm">EMERGENCY ALERT:</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="font-medium">{currentAlert.title}</span>
              <span className="mx-4">•</span>
              <span>{currentAlert.message}</span>
              <span className="mx-4">•</span>
              <span>Location: {currentAlert.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {alerts.length > 1 && (
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              {currentAlertIndex + 1} of {alerts.length}
            </div>
          )}
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-gray-200 transition-colors"
            title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
            title="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;