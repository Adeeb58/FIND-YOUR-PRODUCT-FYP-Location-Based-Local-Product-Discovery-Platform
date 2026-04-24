import React from 'react';
import { motion } from 'framer-motion';
import { Store, Users, Heart, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold font-poppins mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                        >
                            Empowering Local Vendors, Connecting Communities
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            We're not just another delivery app. We're a movement to reclaim the local marketplace for the people who built it.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">More Than Just Speed</h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                In a world obsessed with 10-minute deliveries, we believe in something deeper: <span className="font-semibold text-foreground">Meaningful Connections.</span>
                            </p>
                            <p className="text-lg text-muted-foreground mb-6">
                                Quick-commerce giants often sideline small businesses, turning them into mere warehouses. At FYP (Find Your Product), we put the vendor first. We provide a platform where local artisans, grocers, and creators can shine, tell their stories, and reach their neighbors directly without losing their identity.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Vendor-Centric Approach</h3>
                                        <p className="text-muted-foreground">We empower vendors with tools to manage their brand, not just their inventory.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Community First</h3>
                                        <p className="text-muted-foreground">Every purchase supports a family in your neighborhood, keeping the local economy thriving.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000"
                                alt="Local vendor smiling"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <p className="text-white font-medium text-lg">"FYP helped me keep my shop open during tough times. Now, my neighbors know my name." - Rajesh, Local Grocer</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why We Are Different</h2>
                        <p className="text-muted-foreground">
                            We stand apart from the crowd by sticking to values that matter.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Heart,
                                title: "Fair Partnerships",
                                desc: "Low commissions and transparent policies ensure our vendors take home what they deserve."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Trust & Quality",
                                desc: "We verify every vendor to ensure you get authentic, high-quality products every time."
                            },
                            {
                                icon: Zap,
                                title: "Sustainable Growth",
                                desc: "We prioritize long-term relationships over short-term profits. We grow when you grow."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Revolution</h2>
                            <p className="text-white/90 text-lg mb-8">
                                Whether you're a vendor looking to expand or a shopper seeking quality, there's a place for you here.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold">
                                        Become a Vendor
                                    </Button>
                                </Link>
                                <Link to="/search">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Background Decorations */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
