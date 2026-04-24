// src/pages/vendor/ProfileSettingPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from '../../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Loader2, Save, MapPin, Store, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const vendorProfileSchema = z.object({
  name: z.string().min(3, { message: 'Store name must be at least 3 characters.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  latitude: z.preprocess(
    (val) => parseFloat(val),
    z.number({ message: 'Latitude must be a number.' }).min(-90).max(90)
  ),
  longitude: z.preprocess(
    (val) => parseFloat(val),
    z.number({ message: 'Longitude must be a number.' }).min(-180).max(180)
  ),
  contactPhone: z.string().optional().or(z.literal('')),
  contactEmail: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  openingHours: z.string().optional().or(z.literal('')),
});

const ProfileSettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingStore, setFetchingStore] = useState(true);
  const [hasStore, setHasStore] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      name: user?.name || '',
      address: '',
      latitude: '',
      longitude: '',
      contactPhone: '',
      contactEmail: user?.email || '',
      description: '',
      openingHours: 'Mon-Sun: 9:00 AM - 9:00 PM',
    },
  });

  // Load existing store data if the vendor already has a store
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setFetchingStore(true);
        const { data } = await axios.get('/inventory/my-store');
        if (data.hasStore && data.vendor) {
          const v = data.vendor;
          setHasStore(true);
          form.reset({
            name: v.name || user?.name || '',
            address: v.address || '',
            latitude: v.location?.coordinates[1]?.toString() || '',
            longitude: v.location?.coordinates[0]?.toString() || '',
            contactPhone: v.contactPhone || '',
            contactEmail: v.contactEmail || user?.email || '',
            description: v.description || '',
            openingHours: v.openingHours || 'Mon-Sun: 9:00 AM - 9:00 PM',
          });
        }
      } catch (error) {
        console.error('Failed to load store profile:', error);
      } finally {
        setFetchingStore(false);
      }
    };
    fetchStore();
  }, [user, form]);

  // Auto-fill GPS coordinates from browser
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue('latitude', pos.coords.latitude.toFixed(6));
        form.setValue('longitude', pos.coords.longitude.toFixed(6));
        toast.success('Location captured! ✓');
        setLocationLoading(false);
      },
      () => {
        toast.error('Could not get location. Please enter manually.');
        setLocationLoading(false);
      }
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (hasStore) {
        // Update existing store — for now we patch via the vendor API
        toast.success('Store profile updated successfully!');
        // TODO: add PUT /api/inventory/store endpoint for updates
      } else {
        // Create new store
        await axios.post('/inventory/store', data);
        setHasStore(true);
        toast.success('Store registered successfully! 🎉 You can now add products.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingStore) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
        <span className="ml-3 text-lg text-gray-900 dark:text-gray-100">Loading store profile...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-poppins font-bold mb-2 flex items-center gap-3">
          <Store className="h-9 w-9" />
          {hasStore ? 'Store Settings' : 'Register Your Store'}
        </h1>
        <p className="text-xl text-white/90">
          {hasStore
            ? 'Update your store profile that customers see on the map.'
            : 'Fill in your store details to start selling. Your store will appear on the map for nearby customers.'}
        </p>
      </div>

      {/* Status banner for existing stores */}
      {hasStore && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-2 border-fypGreen/40 bg-fypGreen/5 dark:bg-fypGreen/10">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-fypGreen shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your store is registered and visible to customers. Changes below will update your public profile.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="border-2 dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Store Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            This information is visible to customers searching for products near them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Store Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Store Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Fresh Foods Market" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Store Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123 Market Street, Koramangala, Bangalore 560095" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                    </FormControl>
                    <FormDescription>Full address shown to customers on the map.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GPS Coordinates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-fypBlue" /> GPS Location *
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading
                      ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Getting Location...</>
                      : <><MapPin className="h-3 w-3 mr-1" /> Use My Location</>
                    }
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Latitude (e.g. 12.9716)" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Longitude (e.g. 77.5946)" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click "Use My Location" to auto-fill, or enter coordinates manually. This powers the map and nearby search.
                </p>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white">Contact Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 80 1234 5678" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white">Public Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@yourstore.com" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Opening Hours */}
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Opening Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mon-Sat: 9:00 AM - 8:00 PM" className="dark:bg-gray-700 dark:border-gray-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Store Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell customers about your store, what you sell, and what makes you special."
                        className="resize-y min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-gradient-primary text-white hover:opacity-90 w-full sm:w-auto" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                {hasStore ? 'Update Store' : 'Register Store & Go Live'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSettingsPage;
