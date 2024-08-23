'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AutoComplete from '../components/AutoComplete';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (localityId: string) => {
    router.push(`/weather/${localityId}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Weather Search</h1>
      <div className="w-full max-w-md">
        <AutoComplete
          onSelect={handleSearch}
          onChange={(value) => setSearchQuery(value)}
          value={searchQuery}
        />
      </div>
    </div>
  );
}