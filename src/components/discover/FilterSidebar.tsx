import { useState, KeyboardEvent } from 'react';
import './FilterSidebar.css';

interface FilterProps {
  userLocation: string[];
  setUserLocation: (val: string[]) => void;
  specialtyFilter: string[];
  setSpecialtyFilter: (val: string[]) => void;
  languageFilter: string[];
  setLanguageFilter: (val: string[]) => void;
  maxFee: number;
  setMaxFee: (val: number) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
}

type GroupKey = 'gender' | 'price' | 'cities' | 'speciality' | 'language';

export default function FilterSidebar({
  userLocation, setUserLocation,
  specialtyFilter, setSpecialtyFilter,
  languageFilter, setLanguageFilter,
  maxFee, setMaxFee,
  genderFilter, setGenderFilter
}: FilterProps) {

  const [openGroups, setOpenGroups] = useState<Record<GroupKey, boolean>>({
    gender: true,
    price: true,
    cities: true,
    speciality: true,
    language: true
  });

  const [cityInput, setCityInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const toggleGroup = (key: GroupKey) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addTag = (value: string, list: string[], setList: (val: string[]) => void, clearInput: () => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (list.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      clearInput();
      return;
    }
    setList([...list, trimmed]);
    clearInput();
  };

  const removeTag = (value: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.filter(item => item !== value));
  };

  const handleTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    list: string[],
    setList: (val: string[]) => void,
    clearInput: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(value, list, setList, clearInput);
    }
  };

  return (
    <div className="filter-sidebar">

      <div className="filter-group">
        <div className="filter-header" onClick={() => toggleGroup('gender')}>
          <h4>Gender</h4>
          <i className={`fa-solid fa-chevron-${openGroups.gender ? 'up' : 'down'}`}></i>
        </div>
        {openGroups.gender && (
          <div className="filter-options">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="M"
                checked={genderFilter === 'M'}
                onChange={(e) => setGenderFilter(e.target.value)}
              /> Male
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="F"
                checked={genderFilter === 'F'}
                onChange={(e) => setGenderFilter(e.target.value)}
              /> Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="O"
                checked={genderFilter === 'O'}
                onChange={(e) => setGenderFilter(e.target.value)}
              /> Other
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="Any"
                checked={genderFilter === 'Any'}
                onChange={(e) => setGenderFilter(e.target.value)}
              /> Any
            </label>
          </div>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-header" onClick={() => toggleGroup('price')}>
          <h4>Price Range</h4>
          <i className={`fa-solid fa-chevron-${openGroups.price ? 'up' : 'down'}`}></i>
        </div>
        {openGroups.price && (
          <div className="filter-content">
            <input
              type="range"
              min="100"
              max="1500"
              step="100"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>₹100</span>
              <span>₹{maxFee}</span>
              <span>₹1500</span>
            </div>
          </div>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-header" onClick={() => toggleGroup('cities')}>
          <h4>Cities / Postal Code</h4>
          <i className={`fa-solid fa-chevron-${openGroups.cities ? 'up' : 'down'}`}></i>
        </div>
        {openGroups.cities && (
          <div className="filter-content">
            <button className="search-near-me-btn">Search Near Me</button>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="E.g. Dehradun"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, cityInput, userLocation, setUserLocation, () => setCityInput(''))}
              />
              <button
                className="add-btn"
                onClick={() => addTag(cityInput, userLocation, setUserLocation, () => setCityInput(''))}
              >
                Add
              </button>
            </div>
            {userLocation.length > 0 && (
              <div className="active-tags">
                {userLocation.map(city => (
                  <span className="tag" key={city}>
                    {city}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(city, userLocation, setUserLocation)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-header" onClick={() => toggleGroup('speciality')}>
          <h4>Speciality</h4>
          <i className={`fa-solid fa-chevron-${openGroups.speciality ? 'up' : 'down'}`}></i>
        </div>
        {openGroups.speciality && (
          <div className="filter-content">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="E.g. Hair"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, specialtyInput, specialtyFilter, setSpecialtyFilter, () => setSpecialtyInput(''))}
              />
              <button
                className="add-btn"
                onClick={() => addTag(specialtyInput, specialtyFilter, setSpecialtyFilter, () => setSpecialtyInput(''))}
              >
                Add
              </button>
            </div>
            {specialtyFilter.length > 0 && (
              <div className="active-tags">
                {specialtyFilter.map(spec => (
                  <span className="tag" key={spec}>
                    {spec}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(spec, specialtyFilter, setSpecialtyFilter)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-header" onClick={() => toggleGroup('language')}>
          <h4>Languages Spoken</h4>
          <i className={`fa-solid fa-chevron-${openGroups.language ? 'up' : 'down'}`}></i>
        </div>
        {openGroups.language && (
          <div className="filter-content">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="E.g. Tamil"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, languageInput, languageFilter, setLanguageFilter, () => setLanguageInput(''))}
              />
              <button
                className="add-btn"
                onClick={() => addTag(languageInput, languageFilter, setLanguageFilter, () => setLanguageInput(''))}
              >
                Add
              </button>
            </div>
            {languageFilter.length > 0 && (
              <div className="active-tags">
                {languageFilter.map(lang => (
                  <span className="tag" key={lang}>
                    {lang}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(lang, languageFilter, setLanguageFilter)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
