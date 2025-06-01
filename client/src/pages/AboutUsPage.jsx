import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Heart, Award, Truck, Shield, Star, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const AboutUsPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('mission');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        { number: '10M+', label: 'Happy Customers', icon: Users },
        { number: '500K+', label: 'Products Available', icon: ShoppingBag },
        { number: '99.9%', label: 'Customer Satisfaction', icon: Heart },
        { number: '24/7', label: 'Customer Support', icon: Shield }
    ];

    const values = [
        {
            icon: Award,
            title: 'Excellence',
            description: 'We strive for excellence in every product we offer and every service we provide.'
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Lightning-fast delivery to get your products to you when you need them most.'
        },
        {
            icon: Shield,
            title: 'Trust & Security',
            description: 'Your data and transactions are protected with enterprise-grade security.'
        },
        {
            icon: Star,
            title: 'Quality First',
            description: 'Every product is carefully curated to meet our high standards of quality.'
        }
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb81c?w=300&h=300&fit=crop&crop=face',
            description: 'Visionary leader with 15+ years in e-commerce innovation.'
        },
        {
            name: 'Michael Chen',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            description: 'Tech genius ensuring our platform stays cutting-edge.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Customer Experience',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            description: 'Dedicated to making every customer interaction exceptional.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className={`relative container mx-auto px-6 py-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                            <ShoppingBag className="w-5 h-5 text-purple-300" />
                            <span className="text-purple-200 font-medium">Your Ultimate Shopping Destination</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                            GrabAll
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            We're revolutionizing e-commerce by bringing you everything you need, 
                            all in one place, with an experience that's simply extraordinary.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center">
                                Start Shopping
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <button className="border border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className={`text-center transform transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 mx-auto">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission, Vision, Values Tabs */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Our Story
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Discover what drives us and the values that shape every decision we make
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {['mission', 'vision', 'story'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-full font-semibold transform transition-all duration-300 ${
                                        activeTab === tab 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105' 
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                            {activeTab === 'mission' && (
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold mb-6 text-purple-300">Our Mission</h3>
                                    <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                                        To democratize shopping by making high-quality products accessible to everyone, everywhere. 
                                        We believe that great shopping experiences shouldn't be a luxury – they should be the standard. 
                                        Through innovative technology, exceptional service, and genuine care for our customers, 
                                        we're building the future of e-commerce, one satisfied customer at a time.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'vision' && (
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold mb-6 text-purple-300">Our Vision</h3>
                                    <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                                        To become the world's most trusted and beloved e-commerce platform, where customers can 
                                        find anything they need with confidence, convenience, and joy. We envision a world where 
                                        shopping is not just a transaction, but a delightful experience that brings people 
                                        closer to the products and brands they love.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'story' && (
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold mb-6 text-purple-300">Our Story</h3>
                                    <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                                        GrabAll was born from a simple frustration: why was online shopping so complicated? 
                                        Founded in 2020 by a team of passionate entrepreneurs, we set out to create an e-commerce 
                                        platform that puts customers first. Starting with just 100 products and a dream, 
                                        we've grown to serve millions of customers worldwide, but our core values remain unchanged: 
                                        simplicity, quality, and genuine care for every person who chooses to shop with us.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Our Values
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center group hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-purple-300">{value.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Meet Our Team
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The brilliant minds behind GrabAll's success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center group hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-purple-500/50 group-hover:ring-purple-400 transition-all duration-300">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-purple-300">{member.name}</h3>
                                <p className="text-pink-300 font-semibold mb-4">{member.role}</p>
                                <p className="text-gray-300 leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact/CTA Section */}
            <div className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Ready to Experience GrabAll?
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Join millions of satisfied customers who have made GrabAll their go-to shopping destination. 
                            Your perfect shopping experience is just a click away.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2">Email Us</h3>
                                <p className="text-gray-300">support@graball.com</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2">Call Us</h3>
                                <p className="text-gray-300">1-800-GRABALL</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2">Visit Us</h3>
                                <p className="text-gray-300">San Francisco, CA</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center text-lg">
                                Start Shopping Now
                                <ShoppingBag className="w-5 h-5" />
                            </Link>
                            <Link to="/categories" className="border border-white/30 hover:bg-white/10 px-10 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 text-lg">
                                Browse Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;