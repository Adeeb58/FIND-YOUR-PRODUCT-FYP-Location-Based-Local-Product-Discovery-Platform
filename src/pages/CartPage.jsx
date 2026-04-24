import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { motion } from 'framer-motion';
import { PaymentModal } from '../components/common/PaymentModal';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const navigate = useNavigate();

    // Group items by vendor to show shipping costs per vendor properly in future
    // For now simple list

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Looks like you haven't added anything to your cart yet. Browse our products and find great deals!
                </p>
                <Link to="/search">
                    <Button size="lg" className="rounded-full px-8">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8" />
                Shopping Cart
                <span className="text-lg font-normal text-muted-foreground ml-auto">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <motion.div
                            key={`${item.id}-${item.vendor.id}`} // Unique key for product+vendor combo
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border rounded-lg p-4 flex gap-4 shadow-sm"
                        >
                            <div className="h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                <img
                                    src={item.imageUrl || 'https://placehold.co/150/e2e8f0/94a3b8?text=Item'}
                                    alt={item.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150/e2e8f0/94a3b8?text=Item'; }}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">Sold by: {item.vendor.name}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex items-center gap-3 border rounded-md p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <div className="flex justify-end pt-4 gap-4">
                        <Button variant="outline" onClick={clearCart} className="text-muted-foreground">
                            Clear Cart
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-lg p-6 shadow-md sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatPrice(getCartTotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPrice(getCartTotal())}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                            size="lg"
                            onClick={() => setIsPaymentModalOpen(true)}
                        >
                            Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="mt-4 text-center">
                            <Link to="/search" className="text-sm text-muted-foreground hover:text-primary underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalAmount={getCartTotal()}
                items={cart}
                onSuccess={() => {
                    clearCart();
                }}
            />
        </div>
    );
};

export default CartPage;
