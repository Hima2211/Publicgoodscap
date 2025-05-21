import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Names() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">YouBuidl Names</h1>
      <p className="text-center text-gray-500 mb-8">
        Discover and register unique .youbuidl and .givestation names for your projects.
      </p>

      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <Input
          type="text"
          placeholder="Search for a name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 bg-darkCard text-sm"
        />
        <Button type="submit" className="ml-4">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example name cards */}
        <div className="p-4 border border-darkBorder rounded-lg bg-darkCard">
          <h2 className="text-lg font-bold text-white">example.youbuidl</h2>
          <p className="text-sm text-gray-400">Available</p>
          <Button className="mt-4 w-full">Register</Button>
        </div>
        <div className="p-4 border border-darkBorder rounded-lg bg-darkCard">
          <h2 className="text-lg font-bold text-white">example.givestation</h2>
          <p className="text-sm text-gray-400">Available</p>
          <Button className="mt-4 w-full">Register</Button>
        </div>
        {/* Add more cards dynamically based on search results */}
      </div>
    </div>
  );
}
