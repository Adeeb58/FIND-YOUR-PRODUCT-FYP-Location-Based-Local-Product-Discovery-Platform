import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const CareersPage = () => {
    const jobs = [
        {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Bangalore (Remote)",
            type: "Full-time"
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Mumbai (Hybrid)",
            type: "Full-time"
        },
        {
            title: "Vendor Success Manager",
            department: "Operations",
            location: "Delhi (On-site)",
            type: "Full-time"
        },
        {
            title: "Marketing Specialist",
            department: "Marketing",
            location: "Pune (Remote)",
            type: "Part-time"
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                    >
                        We're Hiring
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Build the Future of <span className="text-gradient-primary">Local Commerce</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground mb-8"
                    >
                        Join a passionate team dedicated to empowering small businesses and connecting communities through technology.
                    </motion.p>
                    <Link to="#openings">
                        <Button size="lg" className="rounded-full">View Open Positions</Button>
                    </Link>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Flexible Work</h3>
                            <p className="text-muted-foreground">Work from where you feel most productive. We prioritize output over hours.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6" /> // Assuming Heart is imported, if not I will replace
                            </div>
                            <h3 className="text-xl font-bold mb-2">Comprehensive Health</h3>
                            <p className="text-muted-foreground">We take care of you and your family with top-tier health insurance plans.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Career Growth</h3>
                            <p className="text-muted-foreground">Continuous learning budget and mentorship to help you reach your potential.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section id="openings" className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                <div className="grid gap-4">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all"
                        >
                            <div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.department}</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// Start of Heart icon import fix since I wasn't sure if it was imported
import { Heart } from 'lucide-react';

export default CareersPage;
