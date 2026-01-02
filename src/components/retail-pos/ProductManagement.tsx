import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  Barcode,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const sampleProducts = [
  { id: '1', name: 'Rice (1kg)', price: 55, stock: 150, barcode: '8901234567890', category: 'Grocery' },
  { id: '2', name: 'Cooking Oil (1L)', price: 140, stock: 80, barcode: '8901234567891', category: 'Grocery' },
  { id: '3', name: 'Sugar (1kg)', price: 45, stock: 200, barcode: '8901234567892', category: 'Grocery' },
  { id: '4', name: 'Tea (250g)', price: 120, stock: 45, barcode: '8901234567893', category: 'Beverages' },
  { id: '5', name: 'Milk (500ml)', price: 28, stock: 60, barcode: '8901234567894', category: 'Dairy' },
  { id: '6', name: 'Bread', price: 35, stock: 25, barcode: '8901234567895', category: 'Bakery' },
  { id: '7', name: 'Eggs (12pc)', price: 84, stock: 40, barcode: '8901234567896', category: 'Dairy' },
  { id: '8', name: 'Butter (100g)', price: 55, stock: 35, barcode: '8901234567897', category: 'Dairy' },
];

export const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProducts = sampleProducts.filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.barcode.includes(searchQuery)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500">Manage your inventory</p>
        </div>
        <Button 
          size="lg" 
          className="h-14 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-lg"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search products or scan barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-white border-slate-200 rounded-xl"
          />
        </div>
        <Button variant="outline" size="lg" className="h-14 px-6 rounded-xl">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Product Name</label>
              <Input placeholder="Enter product name" className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Barcode</label>
              <div className="flex gap-2">
                <Input placeholder="Scan or enter barcode" className="h-12 rounded-xl" />
                <Button variant="outline" className="h-12 px-4 rounded-xl">
                  <Barcode className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Price (₹)</label>
              <Input type="number" placeholder="0.00" className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Stock Quantity</label>
              <Input type="number" placeholder="0" className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
              <Input placeholder="Select category" className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Unit</label>
              <Input placeholder="kg, pc, L, etc." className="h-12 rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="h-12 px-6 rounded-xl" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
              Save Product
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="h-14 text-slate-600 font-semibold">Product</TableHead>
              <TableHead className="h-14 text-slate-600 font-semibold">Barcode</TableHead>
              <TableHead className="h-14 text-slate-600 font-semibold">Category</TableHead>
              <TableHead className="h-14 text-slate-600 font-semibold text-right">Price</TableHead>
              <TableHead className="h-14 text-slate-600 font-semibold text-center">Stock</TableHead>
              <TableHead className="h-14 text-slate-600 font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-500" />
                    </div>
                    <span className="font-medium text-slate-800">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 font-mono">{product.barcode}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-800">₹{product.price}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock < 30 
                      ? 'bg-red-100 text-red-600' 
                      : product.stock < 50 
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold text-slate-800">248</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Low Stock Items</p>
          <p className="text-2xl font-bold text-amber-500">12</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Categories</p>
          <p className="text-2xl font-bold text-slate-800">8</p>
        </div>
      </div>
    </div>
  );
};
