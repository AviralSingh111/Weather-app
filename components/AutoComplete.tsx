'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../lib/store';
import { fetchLocalities } from '../lib/store/localitiesSlice';

interface Locality {
  cityName: string;
  localityName: string;
  localityId: string;
  latitude: number;
  longitude: number;
  device_type: string;
}

interface AutoCompleteProps {
  onSelect: (locality: string) => void;
  onChange: (value: string) => void;
  value: string;
}

export default function AutoComplete({ onSelect, onChange, value }: AutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<Locality[]>([]);
  const localities = useSelector((state: RootState) => state.localities.data as Locality[]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLocalities());
  }, [dispatch]);

  useEffect(() => {
    if (value) {
      const filteredSuggestions = localities.filter((locality) =>
        locality.localityName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value, localities]);

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for a locality"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {suggestions.length > 0 && (
  <ul className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto transition-all duration-300 ease-in-out">
    {suggestions.map((suggestion) => (
      <li
      key={suggestion.localityId}
      className="px-4 py-2 cursor-pointer hover:bg-gray-100 truncate"
      onClick={() => onSelect(suggestion.localityId)}
    >
      {suggestion.localityName}
    </li>
    ))}
  </ul>
)}
    </div>
  );
}