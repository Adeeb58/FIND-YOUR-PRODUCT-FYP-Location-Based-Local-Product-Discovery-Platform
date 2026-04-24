import React from 'react';
import { Search, CircleHelp, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const HelpCenterPage = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-primary/5 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-6 font-poppins">How can we help you?</h1>
                    <div className="max-w-2xl mx-auto relative cursor-text">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Phone, title: "Call Support", text: "+91 800-123-4567" },
                        { icon: Mail, title: "Email Us", text: "support@fyp.com" },
                        { icon: MessageSquare, title: "Live Chat", text: "Available 24/7" },
                    ].map((item, index) => (
                        <div key={index} className="p-6 rounded-xl border border-border text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.text}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {[
                        { question: "How do I track my order?", answer: "You can track your order by going to 'My Orders' in your profile and clicking on the 'Track' button next to your active order." },
                        { question: "What is the return policy?", answer: "We accept returns within 7 days of delivery for most items. Perishables like fresh produce may have a 24-hour return window. Please check the specific vendor's policy." },
                        { question: "How can I become a vendor?", answer: "Click on 'Become a Vendor' in the footer or navigate to our vendor signup page. You'll need to provide some basic business details and we'll verify your account within 48 hours." },
                        { question: "Do you offer same-day delivery?", answer: "Yes! Many of our local vendors offer same-day delivery within their specified service radius. Look for the 'Fast Delivery' tag on products." },
                    ].map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    );
};

export default HelpCenterPage;
