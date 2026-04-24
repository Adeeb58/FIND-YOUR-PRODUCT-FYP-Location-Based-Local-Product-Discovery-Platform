// src/components/auth/LoginForm.jsx - Enhanced with consistent colors
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchemas';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, LogIn, LockKeyhole } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoginForm() {
  const { login, verifyOtp, isLoading } = useAuth();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      if (result && result.requireOtp) {
        setShowOtp(true);
      }
    } catch (error) {
      console.error("Login component error:", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return; // Basic validation
    await verifyOtp(otp);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-xl dark:bg-gray-800">
          <CardHeader className="space-y-1 text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              {showOtp ? <LockKeyhole className="h-8 w-8 text-white" /> : <LogIn className="h-8 w-8 text-white" />}
            </div>
            <CardTitle className="text-3xl font-poppins font-bold text-gray-900 dark:text-white">
              {showOtp ? 'Verify OTP' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {showOtp ? 'Enter the 6-digit code sent to your email' : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!showOtp ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="m@example.com"
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="dark:bg-gray-700 dark:border-gray-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-primary text-white hover:opacity-90"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log In
                      </Button>
                    </form>
                  </Form>
                  <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-fypBlue hover:underline">
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">One-Time Password</label>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest dark:bg-gray-700 dark:border-gray-600"
                      maxLength={6}
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      Use code <strong>123456</strong> for testing
                    </p>
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    className="w-full bg-gradient-primary text-white hover:opacity-90"
                    disabled={isLoading || otp.length < 6}
                    size="lg"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify & Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowOtp(false)}
                    disabled={isLoading}
                  >
                    Back to Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
