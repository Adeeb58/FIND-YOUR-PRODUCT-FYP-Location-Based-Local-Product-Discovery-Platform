import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const posts = [
        {
            id: 1,
            title: "Why Hyperlocal is the Future of E-commerce",
            excerpt: "Discover how buying local is reshaping the global economy and reducing carbon footprints.",
            author: "Sarah Jenkins",
            date: "Oct 12, 2025",
            category: "Industry Trends",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800"
        },
        {
            id: 2,
            title: "Spotlight: The Story Behind 'Grandma's Pickles'",
            excerpt: "An interview with one of our top-rated vendors who started from a small home kitchen.",
            author: "David Chen",
            date: "Sep 28, 2025",
            category: "Vendor Stories",
            image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=800"
        },
        {
            id: 3,
            title: "5 Tips to Grow Your Local Business Online",
            excerpt: "Practical advice for small business owners looking to expand their digital presence.",
            author: "Priya Sharma",
            date: "Sep 15, 2025",
            category: "Business Tips",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="py-20 bg-muted/20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">FYP <span className="text-primary">Blog</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Insights, stories, and news from the world of hyperlocal commerce.
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative group">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                    {post.category}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                                </div>
                                <h2 className="text-xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto pt-4 border-t border-border/50">
                                    <Button variant="link" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
                                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
