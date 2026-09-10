import { useState, useEffect } from 'react';
import servicesData from '@/lib/data/services.json';

type ServiceType = 'cv-writing' | 'linkedin-makeover' | 'masterclass' | 'career-guidance';

export function useServiceData(serviceType: ServiceType) {
  const [serviceData, setServiceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const data = servicesData[serviceType];
      setServiceData(data);
    } catch (error) {
      console.error(`Error loading service data for ${serviceType}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [serviceType]);

  return { serviceData, isLoading };
}
