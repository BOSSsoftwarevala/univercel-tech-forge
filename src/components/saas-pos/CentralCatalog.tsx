import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  Tag,
  DollarSign,
  RefreshCw,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  basePrice: number;
  outlets: { id: string; name: string; price: number; synced: boolean }[];
  stock: number;
  image: string;
}

const products: Product[] = [
  { 
    id: '1', 
    name: 'Premium Coffee Blend', 
    sku: 'COF-001', 
    category: 'Beverages', 
    basePrice: 9.99,
    outlets: [
      { id: '1', name: 'Downtown', price: 9.99, synced: true },
      { id: '2', name: 'Mall', price: 10.99, synced: true },
      { id: '3', name: 'Airport', price: 12.99, synced: false },
    ],
    stock: 450,
    image: '☕'
  },
  { 
    id: '2', 
    name: 'Organic Green Tea', 
    sku: 'TEA-002', 
    category: 'Beverages', 
    basePrice: 7.99,
    outlets: [
      { id: '1', name: 'Downtown', price: 7.99, synced: true },
      { id: '2', name: 'Mall', price: 7.99, synced: true },
      { id: '3', name: 'Airport', price: 9.99, synced: true },
    ],
    stock: 320,
    image: '🍵'
  },
  { 
    id: '3', 
    name: 'Chocolate Croissant', 
    sku: 'BAK-003', 
    category: 'Bakery', 
    basePrice: 4.99,
    outlets: [
      { id: '1', name: 'Downtown', price: 4.99, synced: true },
      { id: '2', name: 'Mall', price: 5.49, synced: true },
      { id: '3', name: 'Airport', price: 6.49, synced: true },
    ],
    stock: 180,
    image: '🥐'
  },
  { 
    id: '4', 
    name: 'Avocado Toast', 
    sku: 'FOD-004', 
    category: 'Food', 
    basePrice: 12.99,
    outlets: [
      { id: '1', name: 'Downtown', price: 12.99, synced: true },
      { id: '2', name: 'Mall', price: 13.99, synced: false },
      { id: '3', name: 'Airport', price: 15.99, synced: true },
    ],
    stock: 95,
    image: '🥑'
  },
  { 
    id: '5', 
    name: 'Fresh Orange Juice', 
    sku: 'JUI-005', 
    category: 'Beverages', 
    basePrice: 5.99,
    outlets: [
      { id: '1', name: 'Downtown', price: 5.99, synced: true },
      { id: '2', name: 'Mall', price: 5.99, synced: true },
      { id: '3', name: 'Airport', price: 7.99, synced: true },
    ],
    stock: 210,
    image: '🍊'
  },
];

const categories = ['All', 'Beverages', 'Bakery', 'Food', 'Snacks'];

export const CentralCatalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Central Product Catalog</h1>
          <p className="text-slate-500">Manage products and sync across all outlets</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" />
            Sync All
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all">
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === cat 
                  ? "bg-violet-100 text-violet-700" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-md", viewMode === 'grid' ? "bg-white shadow-sm" : "")}
          >
            <Grid className="w-4 h-4 text-slate-600" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-md", viewMode === 'list' ? "bg-white shadow-sm" : "")}
          >
            <List className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-5xl">
                {product.image}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{product.category}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-slate-500">Base Price</p>
                    <p className="text-lg font-bold text-violet-600">${product.basePrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Stock</p>
                    <p className="font-semibold text-slate-900">{product.stock}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {product.outlets.map((outlet) => (
                        <div 
                          key={outlet.id}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            outlet.synced ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          )}
                          title={`${outlet.name}: $${outlet.price} - ${outlet.synced ? 'Synced' : 'Pending'}`}
                        >
                          {outlet.synced ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setShowPriceModal(true); }}
                      className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                      <Tag className="w-4 h-4" />
                      Price Rules
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Base Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Outlet Sync</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{product.sku}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{product.category}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-violet-600">${product.basePrice}</td>
                  <td className="py-4 px-6 text-slate-900">{product.stock}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      {product.outlets.map((outlet) => (
                        <div 
                          key={outlet.id}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            outlet.synced ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          )}
                        >
                          {outlet.synced ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => { setSelectedProduct(product); setShowPriceModal(true); }}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Price Rules Modal */}
      {showPriceModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Price Rules</h2>
                <p className="text-slate-500">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setShowPriceModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-violet-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-violet-700">Base Price</span>
                  <span className="text-lg font-bold text-violet-700">${selectedProduct.basePrice}</span>
                </div>
              </div>
              {selectedProduct.outlets.map((outlet) => (
                <div key={outlet.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      outlet.synced ? "bg-emerald-100" : "bg-amber-100"
                    )}>
                      {outlet.synced ? <Check className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{outlet.name}</p>
                      <p className="text-xs text-slate-500">{outlet.synced ? 'Synced' : 'Pending sync'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      defaultValue={outlet.price}
                      className="w-20 h-9 px-3 border border-slate-200 rounded-lg text-right font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPriceModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg">
                Save & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
