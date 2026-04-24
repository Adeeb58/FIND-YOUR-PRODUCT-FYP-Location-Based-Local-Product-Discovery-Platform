import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

const PressPage = () => {
    const releases = [
        {
            date: "January 15, 2026",
            title: "FYP Raises Series A to Expand to 50 New Cities",
            source: "TechCrunch"
        },
        {
            date: "November 20, 2025",
            title: "Hyperlocal Marketplaces: The Antidote to Quick Commerce Burnout",
            source: "Forbes"
        },
        {
            date: "September 05, 2025",
            title: "FYP Launches 'Vendor First' Initiative with Zero Commission for Startups",
            source: "Press Release"
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-poppins">Newsroom</h1>
                    <p className="text-xl text-muted-foreground">Latest news, updates, and resources from FYP.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <h2 className="text-2xl font-bold border-b border-border pb-4">Latest Releases</h2>
                        {releases.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="group p-6 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                            >
                                <div className="text-sm text-muted-foreground mb-2">{item.date} • {item.source}</div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                <a href="#" className="text-sm font-medium text-primary flex items-center gap-1 mt-2">
                                    Read Full Story <ExternalLink className="h-3 w-3" />
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-72 space-y-8">
                        <div className="bg-card p-6 rounded-xl border border-border">
                            <h3 className="font-bold mb-4">Media Contact</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                For press inquiries, interviews, and brand assets, please contact:
                            </p>
                            <a href="mailto:press@fyp.com" className="flex items-center gap-2 text-primary font-medium hover:underline">
                                <Mail className="h-4 w-4" /> press@fyp.com
                            </a>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border">
                            <h3 className="font-bold mb-4">Brand Assets</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Download official logos, photos, and executive bios.
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" /> Download Kit
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PressPage;
