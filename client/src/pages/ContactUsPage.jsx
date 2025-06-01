import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones, ShoppingBag, Send, CheckCircle, Star, Users, Globe, Zap } from 'lucide-react';

const ContactUsPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeContact, setActiveContact] = useState('email');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
            }, 3000);
        }, 1000);
    };

    const contactMethods = [
        {
            id: 'email',
            icon: Mail,
            title: 'Email Support',
            description: 'Get detailed help via email',
            contact: 'support@graball.com',
            response: 'Response within 2-4 hours',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'phone',
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak directly with our team',
            contact: '1-800-GRABALL (472-2255)',
            response: 'Available 24/7',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'chat',
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Instant help when you need it',
            contact: 'Start Chat',
            response: 'Average wait: 30 seconds',
            color: 'from-purple-500 to-pink-500'
        }
    ];

    const supportCategories = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'orders', label: 'Orders & Shipping' },
        { value: 'returns', label: 'Returns & Refunds' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'billing', label: 'Billing & Payments' },
        { value: 'partnership', label: 'Business Partnership' }
    ];

    const officeLocations = [
        {
            city: 'San Francisco',
            address: '123 Commerce Street, San Francisco, CA 94105',
            phone: '+1 (415) 555-0123',
            hours: 'Mon-Fri: 9AM-6PM PST'
        },
        {
            city: 'New York',
            address: '456 Business Ave, New York, NY 10001',
            phone: '+1 (212) 555-0456',
            hours: 'Mon-Fri: 9AM-6PM EST'
        },
        {
            city: 'London',
            address: '789 Digital Lane, London EC1A 1BB, UK',
            phone: '+44 20 7123 4567',
            hours: 'Mon-Fri: 9AM-5PM GMT'
        }
    ];

    const stats = [
        { icon: Users, number: '50K+', label: 'Daily Inquiries Resolved' },
        { icon: Clock, number: '< 2min', label: 'Average Response Time' },
        { icon: Star, number: '4.9/5', label: 'Customer Satisfaction' },
        { icon: Globe, number: '24/7', label: 'Global Support Coverage' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className={`relative container mx-auto px-6 py-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                            <Headphones className="w-5 h-5 text-purple-300" />
                            <span className="text-purple-200 font-medium">We're Here to Help</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                            Contact Us
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Have a question, need support, or want to share feedback? 
                            Our dedicated team is ready to assist you every step of the way.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-3">
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="py-20 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Choose Your Preferred Way to Connect
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Multiple ways to reach us, all designed for your convenience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                        {contactMethods.map((method, index) => (
                            <div 
                                key={method.id}
                                onClick={() => setActiveContact(method.id)}
                                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer group transform transition-all duration-300 hover:scale-105 ${
                                    activeContact === method.id ? 'ring-2 ring-purple-400 bg-white/20' : ''
                                }`}
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <method.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-purple-300">{method.title}</h3>
                                <p className="text-gray-300 mb-4">{method.description}</p>
                                <div className="text-lg font-semibold text-white mb-2">{method.contact}</div>
                                <div className="text-sm text-green-300">{method.response}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form & Info */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-purple-300">Send us a Message</h2>
                            </div>

                            {!isSubmitted ? (
                                <div onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        >
                                            {supportCategories.map((category) => (
                                                <option key={category.value} value={category.value} className="bg-gray-800">
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-green-300">Message Sent Successfully!</h3>
                                    <p className="text-gray-300">
                                        Thank you for contacting us. We'll get back to you within 2-4 hours.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Office Locations */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-8 text-purple-300 flex items-center gap-3">
                                    <MapPin className="w-8 h-8" />
                                    Our Global Offices
                                </h2>
                            </div>

                            {officeLocations.map((office, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-white mb-4">{office.city}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300">{office.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-purple-300 flex-shrink-0" />
                                            <span className="text-gray-300">{office.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-purple-300 flex-shrink-0" />
                                            <span className="text-gray-300">{office.hours}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-300" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5 text-purple-300" />
                                        <span>Track Your Order</span>
                                    </button>
                                    <button className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-purple-300" />
                                        <span>Start Live Chat</span>
                                    </button>
                                    <button className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3">
                                        <Headphones className="w-5 h-5 text-purple-300" />
                                        <span>Schedule a Call</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                question: "How can I track my order?",
                                answer: "You can track your order using the tracking number sent to your email, or log into your GrabAll account to view real-time updates."
                            },
                            {
                                question: "What's your return policy?",
                                answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached for a full refund."
                            },
                            {
                                question: "How long does shipping take?",
                                answer: "Standard shipping takes 3-5 business days, while express shipping delivers within 1-2 business days. Free shipping on orders over $50."
                            },
                            {
                                question: "Do you ship internationally?",
                                answer: "Yes! We ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                                <h3 className="text-lg font-bold text-purple-300 mb-3">{faq.question}</h3>
                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;