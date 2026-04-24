import React from 'react';
import { RefreshCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const ReturnsPage = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <RefreshCcw className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4 font-poppins">Returns & Refunds</h1>
                    <p className="text-xl text-muted-foreground">Hassle-free returns for your peace of mind.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4">Our Policy</h2>
                    <p className="text-muted-foreground mb-8">
                        At FYP, we want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <h3 className="font-bold flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-5 h-5 text-green-500" /> Standard Items
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Non-perishable items like clothes, electronics, and home decor can be returned within <strong>7 days</strong> of delivery.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <h3 className="font-bold flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-5 h-5 text-orange-500" /> Perishable Items
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Fresh produce, dairy, and bakery items must be reported within <strong>24 hours</strong> if damaged or spoiled.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">How to Initiate a Return</h2>
                    <ol className="list-decimal pl-5 space-y-4 text-muted-foreground mb-12">
                        <li>Go to <strong>My Orders</strong> in your profile.</li>
                        <li>Select the order containing the item you wish to return.</li>
                        <li>Click on the <strong>"Return Item"</strong> button.</li>
                        <li>Select the reason for return and upload photos if necessary.</li>
                        <li>Submit your request. Our team will review it within 24 hours.</li>
                    </ol>

                    <h2 className="text-2xl font-bold mb-4">Refund Process</h2>
                    <p className="text-muted-foreground mb-4">
                        Once your return is approved and picked up, your refund will be processed.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                            Original Payment Method: 5-7 business days
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                            FYP Wallet: Instant credit
                        </li>
                    </ul>
                </div>

                <div className="mt-12 text-center p-8 bg-muted/30 rounded-2xl">
                    <h3 className="text-xl font-bold mb-2">Have more questions?</h3>
                    <p className="text-muted-foreground mb-6">Our support team is ready to assist you.</p>
                    <Link to="/contact">
                        <Button>Contact Support</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ReturnsPage;
