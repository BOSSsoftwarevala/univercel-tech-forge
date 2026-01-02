import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  EyeOff,
  Filter,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  veg: boolean;
  available: boolean;
  popular: boolean;
  description?: string;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Butter Chicken', category: 'Main Course', price: 380, veg: false, available: true, popular: true, description: 'Creamy tomato-based curry with tender chicken' },
  { id: '2', name: 'Paneer Butter Masala', category: 'Main Course', price: 320, veg: true, available: true, popular: true, description: 'Rich paneer curry in buttery tomato gravy' },
  { id: '3', name: 'Dal Makhani', category: 'Main Course', price: 280, veg: true, available: true, popular: false, description: 'Slow-cooked black lentils with cream' },
  { id: '4', name: 'Chicken Biryani', category: 'Rice', price: 350, veg: false, available: true, popular: true, description: 'Aromatic basmati rice with spiced chicken' },
  { id: '5', name: 'Veg Biryani', category: 'Rice', price: 280, veg: true, available: true, popular: false },
  { id: '6', name: 'Paneer Tikka', category: 'Starters', price: 280, veg: true, available: true, popular: true },
  { id: '7', name: 'Chicken Tikka', category: 'Starters', price: 320, veg: false, available: false, popular: false },
  { id: '8', name: 'Garlic Naan', category: 'Breads', price: 70, veg: true, available: true, popular: true },
  { id: '9', name: 'Butter Naan', category: 'Breads', price: 60, veg: true, available: true, popular: false },
  { id: '10', name: 'Gulab Jamun', category: 'Desserts', price: 100, veg: true, available: true, popular: true },
];

const categories = ['All', 'Starters', 'Main Course', 'Rice', 'Breads', 'Desserts', 'Beverages'];

export const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Menu Management</h1>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-white rounded-xl"
            />
          </div>
          <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === cat 
                    ? "bg-orange-500 text-white" 
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="p-4 bg-zinc-900 border-b border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Item</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Item Name</label>
              <Input placeholder="Enter name" className="bg-zinc-800 border-zinc-700 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Category</label>
              <select className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-xl px-3 text-white">
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Price (₹)</label>
              <Input type="number" placeholder="0" className="bg-zinc-800 border-zinc-700 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Type</label>
              <div className="flex gap-2">
                <button className="flex-1 h-10 bg-green-500/20 border border-green-500 text-green-400 rounded-xl text-sm font-medium">
                  Veg
                </button>
                <button className="flex-1 h-10 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-xl text-sm">
                  Non-Veg
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" className="border-zinc-700 rounded-xl" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl">
              Save Item
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 grid grid-cols-4 gap-3">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-white">{items.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Available</p>
          <p className="text-2xl font-bold text-green-400">{items.filter(i => i.available).length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Unavailable</p>
          <p className="text-2xl font-bold text-red-400">{items.filter(i => !i.available).length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Popular Items</p>
          <p className="text-2xl font-bold text-orange-400">{items.filter(i => i.popular).length}</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "bg-zinc-900 rounded-xl border overflow-hidden transition-all",
                item.available ? "border-zinc-800" : "border-red-500/50 opacity-60"
              )}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-4 h-4 rounded-sm border-2 flex items-center justify-center text-xs",
                      item.veg ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                    )}>
                      ●
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-zinc-500">{item.category}</p>
                    </div>
                  </div>
                  {item.popular && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-orange-400">₹{item.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        item.available 
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      )}
                    >
                      {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
