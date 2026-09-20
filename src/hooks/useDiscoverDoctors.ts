import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';

function normalizeList(list?: (string | null | undefined)[] | null): string[] {
  if (!list) return [];
  return list
    .map(item => item?.trim())
    .filter((item): item is string => Boolean(item));
}

function matchesAnyFilter(filterValues: string[], candidateValues: string[]): boolean {
  if (filterValues.length === 0) return true;
  if (candidateValues.length === 0) return false;
  return filterValues.some(filterValue =>
    candidateValues.some(candidate => candidate.toLowerCase().includes(filterValue.toLowerCase()))
  );
}

export function useDiscoverDoctors() {
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<string[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState(1500);
  const [genderFilter, setGenderFilter] = useState('Any');

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctors() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('doctor_subscriptions')
        .select(`*, doctors (*)`)
        .eq('status', 'active');

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setAllDoctors([]);
      } else {
        const flatList = (data ?? [])
          .map((sub: any) => sub.doctors)
          .filter(Boolean);
        setAllDoctors(flatList);
      }

      setLoading(false);
    }

    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const doctors = useMemo(() => {
    return allDoctors.filter(doc => {
      const cities = normalizeList([doc.city]);
      const matchLocation = matchesAnyFilter(userLocation, cities);

      const specialties = normalizeList([doc.specialization, doc.area_of_specialization]);
      const matchSpecialty = matchesAnyFilter(specialtyFilter, specialties);

      const spokenLanguages = normalizeList(doc.languages?.length ? doc.languages : ['English']);
      const matchLanguage = matchesAnyFilter(languageFilter, spokenLanguages);

      const fee = Number(doc.consultation_fee);
      const matchFee = Number.isFinite(fee) ? fee <= maxFee : true;

      const matchGender = genderFilter === 'Any'
        ? true
        : doc.gender?.toUpperCase() === genderFilter;

      return matchLocation && matchSpecialty && matchLanguage && matchFee && matchGender;
    });
  }, [allDoctors, userLocation, specialtyFilter, languageFilter, maxFee, genderFilter]);

  return {
    doctors,
    loading,
    error,
    userLocation,
    setUserLocation,
    specialtyFilter,
    setSpecialtyFilter,
    languageFilter,
    setLanguageFilter,
    maxFee,
    setMaxFee,
    genderFilter,
    setGenderFilter
  };
}
