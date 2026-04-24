import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/button';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-poppins">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground">We'd love to hear from you.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <p className="text-muted-foreground mb-8">
                            Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Our Office</h3>
                                    <p className="text-muted-foreground">
                                        123 Innovation Drive, Tech Park,<br />
                                        Koramangala, Bangalore 560095<br />
                                        India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                    <p className="text-muted-foreground">support@fyp.com</p>
                                    <p className="text-muted-foreground">partners@fyp.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                                    <p className="text-muted-foreground">+91 800-123-4567</p>
                                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri from 9am to 6pm IST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" placeholder="How can we help you?"></textarea>
                            </div>

                            <Button className="w-full">
                                <Send className="w-4 h-4 mr-2" /> Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
