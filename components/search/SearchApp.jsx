import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

// --- Mock Data ---
const mockProducts = [
    { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 79.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Headphones', rating: 4.5, reviews: 120, description: 'High-fidelity sound with a comfortable, over-ear design. Up to 24 hours of battery life.' },
    { id: 2, name: 'Smart Fitness Tracker Watch', category: 'Wearables', price: 129.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Fitness+Tracker', rating: 4.7, reviews: 250, description: 'Track your heart rate, steps, and sleep. Waterproof and includes a vibrant AMOLED display.' },
    { id: 3, name: 'Espresso Machine with Grinder', category: 'Home & Kitchen', price: 349.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Espresso+Machine', rating: 4.8, reviews: 95, description: 'Brew cafe-quality espresso at home with a built-in conical burr grinder.' },
    { id: 4, name: 'Portable External Hard Drive', category: 'Electronics', price: 59.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Hard+Drive', rating: 4.2, reviews: 300, description: '1TB storage capacity with USB 3.0 for fast data transfer. Slim and durable design.' },
    { id: 5, name: '4K Ultra HD Smart TV', category: 'Electronics', price: 899.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Smart+TV', rating: 4.9, reviews: 520, description: 'Experience stunning visuals and built-in streaming apps with this 55-inch smart television.' },
    { id: 6, name: 'Ergonomic Office Chair', category: 'Office Supplies', price: 199.50, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Office+Chair', rating: 4.6, reviews: 180, description: 'Fully adjustable lumbar support and armrests for maximum comfort during long work sessions.' },
    { id: 7, name: 'Non-stick Cookware Set', category: 'Home & Kitchen', price: 89.00, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Cookware+Set', rating: 4.3, reviews: 110, description: 'Complete 10-piece set with durable non-stick coating. Dishwasher safe.' },
    { id: 8, name: 'Professional DSLR Camera', category: 'Electronics', price: 1299.00, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=DSLR+Camera', rating: 4.9, reviews: 75, description: 'Capture stunning photos and videos with a 24.2 MP sensor and interchangeable lenses.' },
    { id: 9, name: 'Portable Power Bank 20000mAh', category: 'Electronics', price: 35.00, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Power+Bank', rating: 4.4, reviews: 450, description: 'Charge multiple devices on the go with this high-capacity power bank. Fast charging support.' },
    { id: 10, name: 'Acoustic Guitar Starter Kit', category: 'Musical Instruments', price: 149.99, image: 'https://placehold.co/400x400/1e293b/a5b4fc?text=Guitar', rating: 4.1, reviews: 60, description: 'Everything you need to start playing, including a guitar, tuner, strap, and picks.' }
];

const mockCategories = ['All', 'Electronics', 'Home & Kitchen', 'Wearables', 'Office Supplies', 'Musical Instruments'];

const mockRecommendations = [
    { id: 11, name: 'Gaming Mouse', price: 49.99, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Gaming+Mouse' },
    { id: 12, name: 'Wireless Keyboard', price: 89.99, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Wireless+Keyboard' },
    { id: 13, name: 'LED Desk Lamp', price: 25.50, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Desk+Lamp' },
    { id: 14, name: 'Bluetooth Speaker', price: 65.00, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Bluetooth+Speaker' },
    { id: 15, name: 'Yoga Mat', price: 29.99, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Yoga+Mat' },
    { id: 16, name: 'Digital Scale', price: 19.99, image: 'https://placehold.co/200x200/1e293b/a5b4fc?text=Digital+Scale' },
];

/**
 * Custom hook to simulate fetching data from an API.
 * Adds a delay to mimic network latency.
 */
const useApiData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            setData({
                products: mockProducts,
                categories: mockCategories,
                recommendations: mockRecommendations,
            });
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading };
};

/**
 * The main application component.
 * Manages state for search query and active category.
 */
const SearchApp = () => {
    const { data, loading } = useApiData();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Filter products based on search query and category
    const filteredProducts = useMemo(() => {
        if (!data) return [];
        return data.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [data, searchQuery, activeCategory]);

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            {/* Header with Search Bar */}
            <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold">🛒 Shop</h1>
                    </div>
                    <div className="relative w-full max-w-lg">
                        <Input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full pl-10 pr-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.264.077c.603.036 1.15.32 1.518.796l4.049 5.864a1.8 1.8 0 0 1-.322 2.454l-1.264.077c-.603.036-1.15-.32-1.518-.796l-4.049-5.864a1.8 1.8 0 0 1 .322-2.454ZM12 4.5a1.5 1.5 0 0 1-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75V4.5a1.5 1.5 0 0 1 1.5-1.5h1.5Zm-1.5 1.5H9.75v1.5H12v-1.5Z" />
                            </svg>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.533 0 2.077 1.054 1.867 2.68-.066.589-.182 1.26-.279 1.898-.216.756-.479 1.348-1.077 1.348H5.96a1.5 1.5 0 0 1-1.5-1.5c0-.98.6-1.996 1.5-2.25H12a.75.75 0 0 0 0-1.5H7.5Z" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
                    </div>
                </div>
            ) : (
                <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Categories and Filters Sidebar */}
                    <aside className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                                <CardDescription>Filter by product category.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {data.categories.map(category => (
                                    <Button
                                        key={category}
                                        variant={activeCategory === category ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content Area */}
                    <main className="md:col-span-3">
                        {/* Recommendation Widget */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
                                <div className="flex w-max space-x-4">
                                    {data.recommendations.map((rec) => (
                                        <Card key={rec.id} className="inline-block w-[150px] overflow-hidden">
                                            <CardContent className="p-0">
                                                <img src={rec.image} alt={rec.name} className="h-auto w-full object-cover" />
                                            </CardContent>
                                            <CardHeader className="p-2 pb-0">
                                                <CardDescription className="line-clamp-2">{rec.name}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="p-2 pt-0">
                                                <p className="text-sm font-semibold">${rec.price}</p>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Ad Banner */}
                        <Card className="mb-8 bg-primary/20 text-primary-foreground border-primary/40">
                            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold">Limited Time Offer!</h3>
                                    <p className="text-sm">Save big on your first purchase with our exclusive discounts.</p>
                                </div>
                                <Button variant="outline">Shop Now</Button>
                            </CardContent>
                        </Card>

                        {/* Search Results */}
                        <h2 className="text-xl font-bold mb-4">Search Results</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <Card key={product.id}>
                                        <CardHeader className="p-0 pb-4">
                                            <img src={product.image} alt={product.name} className="h-auto w-full object-cover rounded-t-lg" />
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2 p-4 pt-0">
                                            <CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
                                            <CardDescription className="text-muted-foreground line-clamp-3 h-12">{product.description}</CardDescription>
                                            <div className="flex items-center gap-2 text-sm text-yellow-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.123 6.233a.562.562 0 0 0 .585.353l6.57-.492a.562.562 0 0 1 .454.86L18.232 15.34a.562.562 0 0 0-.18.558l1.824 6.096a.562.562 0 0 1-.762.61l-5.694-3.469a.562.562 0 0 0-.585 0L6.798 22.505a.562.562 0 0 1-.762-.61l1.824-6.096a.562.562 0 0 0-.18-.558L2.097 10.39a.562.562 0 0 1 .454-.86l6.57.492a.562.562 0 0 0 .585-.353l2.123-6.233Z" />
                                                </svg>
                                                <span>{product.rating} ({product.reviews} reviews)</span>
                                            </div>
                                            <p className="text-xl font-bold mt-2">${product.price}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">Add to Cart</Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-muted-foreground py-10">
                                    <p>No products found for this search or category.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default SearchApp;
