import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, TrendingUp, ShoppingBag, Smartphone, Home, Shirt, Gamepad2, Heart, Baby, Car, Camera, Book, Dumbbell, Gift, Zap, ChevronRight, Tag, Users, Package } from 'lucide-react';

const CategoriesPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const categories = [
        {
            id: 'electronics',
            name: 'Electronics',
            description: 'Latest gadgets, smartphones, laptops, and tech accessories',
            icon: Smartphone,
            productCount: 15420,
            color: 'from-blue-500 to-cyan-500',
            image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Smartphones', 'Laptops', 'Audio', 'Gaming', 'Accessories']
        },
        {
            id: 'fashion',
            name: 'Fashion & Apparel',
            description: 'Trendy clothing, shoes, and accessories for all styles',
            icon: Shirt,
            productCount: 28750,
            color: 'from-pink-500 to-rose-500',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry']
        },
        {
            id: 'home',
            name: 'Home & Garden',
            description: 'Everything for your home, garden, and living space',
            icon: Home,
            productCount: 12340,
            color: 'from-green-500 to-emerald-500',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Storage']
        },
        {
            id: 'beauty',
            name: 'Beauty & Personal Care',
            description: 'Skincare, makeup, fragrances, and wellness products',
            icon: Heart,
            productCount: 9870,
            color: 'from-purple-500 to-pink-500',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Tools']
        },
        {
            id: 'sports',
            name: 'Sports & Fitness',
            description: 'Equipment, apparel, and gear for active lifestyles',
            icon: Dumbbell,
            productCount: 8650,
            color: 'from-orange-500 to-red-500',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Fitness Equipment', 'Sports Gear', 'Activewear', 'Outdoor', 'Supplements']
        },
        {
            id: 'books',
            name: 'Books & Media',
            description: 'Books, e-books, audiobooks, movies, and music',
            icon: Book,
            productCount: 45680,
            color: 'from-indigo-500 to-purple-500',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Movies', 'Music']
        },
        {
            id: 'automotive',
            name: 'Automotive',
            description: 'Car accessories, parts, tools, and maintenance products',
            icon: Car,
            productCount: 7890,
            color: 'from-gray-600 to-gray-800',
            image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Parts', 'Accessories', 'Tools', 'Care Products', 'Electronics']
        },
        {
            id: 'baby',
            name: 'Baby & Kids',
            description: 'Everything for babies, toddlers, and children',
            icon: Baby,
            productCount: 6540,
            color: 'from-yellow-400 to-orange-400',
            image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Baby Gear', 'Toys', 'Clothing', 'Feeding', 'Safety']
        },
        {
            id: 'gaming',
            name: 'Gaming',
            description: 'Video games, consoles, accessories, and gaming gear',
            icon: Gamepad2,
            productCount: 4320,
            color: 'from-violet-500 to-purple-600',
            image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Consoles', 'Games', 'Accessories', 'PC Gaming', 'Collectibles']
        },
        {
            id: 'photography',
            name: 'Photography',
            description: 'Cameras, lenses, accessories, and photography equipment',
            icon: Camera,
            productCount: 3210,
            color: 'from-teal-500 to-cyan-600',
            image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Cameras', 'Lenses', 'Accessories', 'Lighting', 'Storage']
        },
        {
            id: 'gifts',
            name: 'Gifts & Special Occasions',
            description: 'Perfect gifts for birthdays, holidays, and celebrations',
            icon: Gift,
            productCount: 5670,
            color: 'from-red-500 to-pink-500',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
            trending: true,
            subcategories: ['Birthday Gifts', 'Holiday Items', 'Anniversary', 'Wedding', 'Personalized']
        },
        {
            id: 'office',
            name: 'Office & Business',
            description: 'Office supplies, furniture, and business equipment',
            icon: Package,
            productCount: 4890,
            color: 'from-slate-500 to-gray-600',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
            trending: false,
            subcategories: ['Supplies', 'Furniture', 'Electronics', 'Storage', 'Printing']
        }
    ];

    const filters = [
        { id: 'all', label: 'All Categories', count: categories.length },
        { id: 'trending', label: 'Trending', count: categories.filter(cat => cat.trending).length },
        { id: 'popular', label: 'Most Popular', count: 5 },
        { id: 'new', label: 'New Arrivals', count: 3 }
    ];

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedFilter === 'all') return matchesSearch;
        if (selectedFilter === 'trending') return matchesSearch && category.trending;
        if (selectedFilter === 'popular') return matchesSearch && category.productCount > 10000;
        if (selectedFilter === 'new') return matchesSearch && ['gaming', 'photography', 'gifts'].includes(category.id);
        
        return matchesSearch;
    });

    const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className={`relative container mx-auto px-6 py-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                            <ShoppingBag className="w-5 h-5 text-purple-300" />
                            <span className="text-purple-200 font-medium">Discover Everything You Need</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                            Categories
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Explore our vast collection of products across all categories. 
                            From the latest tech to everyday essentials, find exactly what you're looking for.
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{categories.length}</div>
                                <div className="text-gray-300">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{totalProducts.toLocaleString()}+</div>
                                <div className="text-gray-300">Products</div>
                            </div>
                            <div className="text-center col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-white mb-2">{categories.filter(cat => cat.trending).length}</div>
                                <div className="text-gray-300">Trending Now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="py-12 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Filters and View Toggle */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                                            selectedFilter === filter.id
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        {filter.label}
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                        viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                        viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid/List */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-4">No Categories Found</h3>
                            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className={`${
                            viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                                : 'space-y-6'
                        }`}>
                            {filteredCategories.map((category, index) => (
                                <div
                                    key={category.id}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    className={`group cursor-pointer transform transition-all duration-500 ${
                                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    } ${viewMode === 'grid' ? 'hover:scale-105' : ''}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    {viewMode === 'grid' ? (
                                        // Grid View
                                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden group-hover:bg-white/20 transition-all duration-300">
                                            <div className="relative h-48 overflow-hidden">
                                                <img 
                                                    src={category.image} 
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                
                                                {/* Trending Badge */}
                                                {category.trending && (
                                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Trending
                                                    </div>
                                                )}

                                                {/* Category Icon */}
                                                <div className="absolute bottom-4 left-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                        <category.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                                        {category.name}
                                                    </h3>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
                                                </div>
                                                
                                                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                                    {category.description}
                                                </p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-purple-300">
                                                        <Package className="w-4 h-4" />
                                                        {category.productCount.toLocaleString()} products
                                                    </div>
                                                </div>

                                                {/* Subcategories */}
                                                <div className="flex flex-wrap gap-1">
                                                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                                                        <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                    {category.subcategories.length > 3 && (
                                                        <span className="text-xs text-purple-300">
                                                            +{category.subcategories.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // List View
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="relative flex-shrink-0">
                                                    <img 
                                                        src={category.image} 
                                                        alt={category.name}
                                                        className="w-24 h-24 object-cover rounded-xl"
                                                    />
                                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                                                        <category.icon className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                                            {category.name}
                                                        </h3>
                                                        {category.trending && (
                                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3" />
                                                                Trending
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <p className="text-gray-300 mb-3 leading-relaxed">
                                                        {category.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-purple-300">
                                                            <Package className="w-4 h-4" />
                                                            {category.productCount.toLocaleString()} products
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <Tag className="w-4 h-4" />
                                                            {category.subcategories.length} subcategories
                                                        </div>
                                                    </div>
                                                </div>

                                                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Subcategories */}
            <div className="py-20 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Popular Subcategories
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Dive deeper into the most popular product subcategories
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                        {[
                            'Smartphones', 'Laptops', 'Women\'s Fashion', 'Men\'s Fashion', 
                            'Home Decor', 'Kitchen', 'Skincare', 'Makeup', 'Fitness Equipment', 
                            'Sports Gear', 'Fiction Books', 'Gaming Consoles'
                        ].map((subcategory, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                                <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors duration-300">
                                    {subcategory}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Can't Find What You're Looking For?
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            We're constantly adding new categories and products. 
                            Let us know what you need and we'll help you find it!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center">
                                <Search className="w-5 h-5" />
                                Request a Category
                            </button>
                            <button className="border border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center">
                                <Users className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;