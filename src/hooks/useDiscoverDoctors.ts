import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';

export function useDiscoverDoctors() {
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [maxFee, setMaxFee] = useState(1500);
  // 1. Add gender state (defaulting to 'Any')
  const [genderFilter, setGenderFilter] = useState('Any'); 

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_subscriptions')
        .select(`*, doctors (*)`)
        .eq('status', 'active');

      if (!error && data) {
        const flatList = data.map((sub: any) => sub.doctors).filter(Boolean);
        setAllDoctors(flatList);
      }
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  const doctors = useMemo(() => {
    return allDoctors.filter(doc => {
      const matchLocation = userLocation ? doc.postal_code?.includes(userLocation) : true;
      const matchSpecialty = specialtyFilter ? doc.specialization?.toLowerCase() === specialtyFilter.toLowerCase() : true;
      const matchFee = maxFee ? Number(doc.consultation_fee) <= maxFee : true;
      
      // 2. Apply gender logic
      const matchGender = genderFilter === 'Any' ? true : 
        doc.gender?.toLowerCase() === genderFilter.toLowerCase();
      
      return matchLocation && matchSpecialty && matchFee && matchGender;
    });
  }, [allDoctors, userLocation, specialtyFilter, maxFee, genderFilter]);

  return {
    doctors,
    loading,
    userLocation,
    setUserLocation,
    specialtyFilter,
    setSpecialtyFilter,
    maxFee,
    setMaxFee,
    // 3. Export the state
    genderFilter,
    setGenderFilter
  };
}
