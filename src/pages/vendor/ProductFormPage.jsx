// src/pages/vendor/ProductFormPage.jsx - Enhanced with consistent colors and INR
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../utils/validationSchemas';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockProducts, mockCategories } from '../../utils/mockData';
import { formatPrice } from '../../utils/currency';

const ProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = productId !== 'new';
  const [loading, setLoading] = useState(false);
  const [initialProductData, setInitialProductData] = useState(null);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const productToEdit = mockProducts.find(p => p.id === productId);
      if (productToEdit) {
        setInitialProductData(productToEdit);
        form.reset({
          name: productToEdit.name,
          description: productToEdit.description,
          price: 10.99,
          category: productToEdit.category,
          stock: 50,
          imageUrl: productToEdit.imageUrl,
        });
      } else {
        toast.error('Product not found for editing.');
        navigate('/vendor/products');
      }
      setLoading(false);
    } else {
      form.reset({
        name: '', description: '', price: 0, category: '', stock: 0, imageUrl: ''
      });
    }
  }, [productId, isEditing, form, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Product "${data.name}" updated successfully!`);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Product "${data.name}" added successfully!`);
      }
      navigate('/vendor/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
        <span className="ml-3 text-lg text-gray-900 dark:text-gray-100">Loading product data...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-poppins font-bold mb-2 flex items-center">
          <Package className="h-8 w-8 mr-3" />
          {isEditing ? `Edit Product: ${initialProductData?.name || productId}` : 'Add New Product'}
        </h1>
        <p className="text-xl text-white/90">
          {isEditing ? 'Update the information for your product.' : 'Enter details for your new product.'}
        </p>
      </div>

      <Card className="border-2 dark:bg-gray-800 p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Product Details</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'Update the information for your product.' : 'Enter details for your new product.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Product Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Organic Honey" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A detailed description of your product."
                        className="resize-y min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Enter price in INR"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-400">
                      {field.value > 0 && `Approximately ${formatPrice(field.value / 83)}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800">
                        {mockCategories.filter(cat => cat !== 'All').map(cat => (
                          <SelectItem key={cat} value={cat} className="dark:text-white">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Stock Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/product-image.jpg" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-400">
                      Provide a direct URL to your product image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-gradient-primary text-white hover:opacity-90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-2" /> {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductFormPage;
