// src/pages/user/UserProfilePage.jsx - Enhanced with consistent colors
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const userProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  phone: z.string().min(10, { message: "Phone number is required." }).optional().or(z.literal('')),
  location: z.string().optional(),
});

const UserProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
    },
  });

  React.useEffect(() => {
    if (user && !authLoading) {
        form.reset({
            name: user.name,
            email: user.email,
            phone: user.phone || '+91 80 1234 5678',
            location: user.location || 'Bangalore, India',
        });
    }
  }, [user, authLoading, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Profile updated:", data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-poppins font-bold mb-2">My Profile</h1>
        <p className="text-xl text-white/90">Manage your personal details and contact information</p>
      </div>

      <Card className="border-2 dark:bg-gray-800 p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Personal Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage your personal details and contact information.
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
                    <FormLabel className="text-gray-900 dark:text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Email (Cannot be changed)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled 
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-400">
                      Email is used for your account identity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="e.g., +91 80 1234 5678" 
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Default Search Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City, State" 
                        className="dark:bg-gray-700 dark:border-gray-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="bg-gradient-primary text-white hover:opacity-90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfilePage;
