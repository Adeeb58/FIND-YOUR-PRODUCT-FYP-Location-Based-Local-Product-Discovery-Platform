import React from 'react';
import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react';

const ShippingPage = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <Truck className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4 font-poppins">Shipping Information</h1>
                    <p className="text-xl text-muted-foreground">Everything you need to know about our delivery process.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="space-y-12">
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Delivery Times</h3>
                            <p className="text-muted-foreground mb-4">
                                Since FYP connects you with local vendors, delivery times are often much faster than standard e-commerce.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li><span className="font-semibold text-foreground">Standard Delivery:</span> 24-48 hours</li>
                                <li><span className="font-semibold text-foreground">Same-Day Delivery:</span> Available for orders placed before 2 PM within a 5km radius.</li>
                                <li><span className="font-semibold text-foreground">Scheduled Delivery:</span> Choose a slot that works for you at checkout.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                <MapPin className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Service Areas</h3>
                            <p className="text-muted-foreground mb-4">
                                We currently operate in major metropolitan areas including Bangalore, Mumbai, Delhi, and Pune. We are expanding to new neighborhoods every week!
                            </p>
                            <div className="bg-muted p-4 rounded-lg text-sm">
                                <strong>Note:</strong> Delivery availability depends on specific vendor coverage. Enter your pincode on the product page to check eligibility.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Shipping Costs</h3>
                            <p className="text-muted-foreground">
                                Shipping costs are determined by the distance between you and the vendor.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
                                <li>Free delivery on orders over ₹500 from a single vendor.</li>
                                <li>Nominal fee of ₹40 for orders under ₹500.</li>
                                <li>Premium delivery slots may incur additional charges.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShippingPage;
