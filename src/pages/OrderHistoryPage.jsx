
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Loader2, Package, Calendar, CreditCard } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet, or they are still processing (wait 10 mins).</p>
                    <Link to="/products">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Order Placed</p>
                                    <p className="font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Total Amount</p>
                                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p className="font-medium flex items-center gap-1 capitalize">
                                        <CreditCard className="h-4 w-4" />
                                        {order.paymentMethod}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Order ID</p>
                                    <p className="font-mono text-xs">{order._id}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Package className="h-full w-full p-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' :
                                        order.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></div>
                                    <span className="font-medium text-sm">{order.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
