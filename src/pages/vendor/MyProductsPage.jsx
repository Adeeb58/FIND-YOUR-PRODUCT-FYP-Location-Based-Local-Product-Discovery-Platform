// src/pages/vendor/MyProductsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package, PlusCircle, Edit, Trash2, Loader2,
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Search
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../../components/ui/card';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

// Stock badge component
const StockBadge = ({ stock }) => {
  const styles = {
    'Available': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Low': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Out of Stock': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  const icons = {
    'Available': <CheckCircle className="h-3 w-3" />,
    'Low': <AlertTriangle className="h-3 w-3" />,
    'Out of Stock': <XCircle className="h-3 w-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[stock] || styles['Available']}`}>
      {icons[stock]} {stock}
    </span>
  );
};

const MyProductsPage = () => {
  const { user } = useAuth();
  const [vendorProducts, setVendorProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add product modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addStock, setAddStock] = useState('50');
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit stock modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editStockStatus, setEditStockStatus] = useState('Available');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Fetch vendor's current inventory
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/inventory/my-store');
      setHasStore(data.hasStore);
      if (data.hasStore && data.vendor) {
        setVendorProducts(data.vendor.products || []);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
      toast.error('Failed to load your inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all products in the system (for the add-product dropdown)
  const fetchAllProducts = useCallback(async () => {
    try {
      const { data } = await axios.get('/inventory/products');
      setAllProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load product catalog:', error);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchAllProducts();
  }, [fetchInventory, fetchAllProducts]);

  // --- ADD PRODUCT ---
  const handleAddProduct = async () => {
    if (!selectedProductId || !addPrice) {
      toast.error('Please select a product and enter a price.');
      return;
    }
    try {
      setAddSubmitting(true);
      const { data } = await axios.post('/inventory/add-product', {
        productId: selectedProductId,
        price: parseFloat(addPrice),
        stockCount: parseInt(addStock) || 0,
      });
      toast.success(data.message);
      setAddModalOpen(false);
      setSelectedProductId('');
      setAddPrice('');
      setAddStock('50');
      fetchInventory(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product.');
    } finally {
      setAddSubmitting(false);
    }
  };

  // --- EDIT PRODUCT ---
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditPrice(item.price?.toString() || '');
    setEditStock(item.stockCount?.toString() || '0');
    setEditStockStatus(item.stock || 'Available');
    setEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!editingItem) return;
    try {
      setEditSubmitting(true);
      await axios.put(`/inventory/products/${editingItem._id}`, {
        price: parseFloat(editPrice),
        stockCount: parseInt(editStock),
        stock: editStockStatus,
      });
      toast.success('Product updated successfully!');
      setEditModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // --- DELETE PRODUCT ---
  const openDeleteModal = (item) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!deletingItem) return;
    try {
      setDeleteSubmitting(true);
      await axios.delete(`/inventory/products/${deletingItem._id}`);
      toast.success('Product removed from your inventory.');
      setDeleteModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filter products by search term
  const filteredProducts = vendorProducts.filter(item =>
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Products not yet in vendor's inventory (exclude already-added ones)
  const addedProductIds = vendorProducts.map(p => p.product?._id?.toString());
  const availableToAdd = allProducts.filter(p => !addedProductIds.includes(p._id?.toString()));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
        <span className="ml-3 text-lg text-gray-900 dark:text-gray-100">Loading your inventory...</span>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <Package className="h-20 w-20 mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Store Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          You haven't registered your store yet. Go to your profile settings to set up your shop.
        </p>
        <Link to="/vendor/profile">
          <Button variant="fypPrimary" size="lg">Setup My Store</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-poppins font-bold text-gray-900 dark:text-gray-100">My Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {vendorProducts.length} product{vendorProducts.length !== 1 ? 's' : ''} in your store
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchInventory}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button
            variant="fypPrimary"
            onClick={() => setAddModalOpen(true)}
            disabled={availableToAdd.length === 0}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search your products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Inventory Table */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12 text-center border-2 dark:bg-gray-800">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <CardTitle className="text-xl text-gray-700 dark:text-white mb-2">
            {searchTerm ? 'No matching products' : 'No Products Yet'}
          </CardTitle>
          <CardDescription className="mb-6">
            {searchTerm ? 'Try a different search term.' : 'Click "Add Product" to add items from the catalog to your store.'}
          </CardDescription>
          {!searchTerm && (
            <Button variant="fypPrimary" onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Product
            </Button>
          )}
        </Card>
      ) : (
        <Card className="border-2 dark:bg-gray-800 overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Your Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredProducts.map((item) => (
                  <motion.tr
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <TableCell>
                      <img
                        src={item.product?.imageUrl || 'https://placehold.co/50/e2e8f0/94a3b8?text=?'}
                        alt={item.product?.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50/e2e8f0/94a3b8?text=?'; }}
                        className="h-12 w-12 object-cover rounded-lg border dark:border-gray-700"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || 'Unknown Product'}
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.product?.brand}</p>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full bg-fypBlue/10 text-fypBlue text-xs font-medium">
                        {item.product?.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {item.stockCount}
                    </TableCell>
                    <TableCell>
                      <StockBadge stock={item.stock} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          className="hover:text-fypBlue"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(item)}
                          className="hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ── ADD PRODUCT MODAL ─────────────────────────────────────────── */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Add Product to Your Store</DialogTitle>
            <DialogDescription>
              Choose a product from the catalog and set your price and stock.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Product</label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Select a product from catalog..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 max-h-48">
                  {availableToAdd.length === 0 ? (
                    <SelectItem value="none" disabled>All products already added</SelectItem>
                  ) : (
                    availableToAdd.map(p => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name} — {p.category}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Your Price (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 149.99"
                  value={addPrice}
                  onChange={e => setAddPrice(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Initial Stock</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 50"
                  value={addStock}
                  onChange={e => setAddStock(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button variant="fypPrimary" onClick={handleAddProduct} disabled={addSubmitting}>
              {addSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add to Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT PRODUCT MODAL ──────────────────────────────────────────── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Edit: {editingItem?.product?.name}</DialogTitle>
            <DialogDescription>Update price, stock quantity, and availability status.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Price (₹)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={e => setEditPrice(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Stock Quantity</label>
              <Input
                type="number"
                min="0"
                value={editStock}
                onChange={e => setEditStock(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Availability Status</label>
              <Select value={editStockStatus} onValueChange={setEditStockStatus}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="Available">✅ Available</SelectItem>
                  <SelectItem value="Low">⚠️ Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">❌ Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="fypPrimary" onClick={handleEditProduct} disabled={editSubmitting}>
              {editSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM MODAL ─────────────────────────────────────────── */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-sm dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Remove Product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{deletingItem?.product?.name}</strong> from your store? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleteSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yes, Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MyProductsPage;
