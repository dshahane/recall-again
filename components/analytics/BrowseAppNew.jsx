import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- Mock Data and Utilities to make the code self-contained ---

/**
 * A mock custom hook that simulates fetching and managing data from an API.
 * It provides a simple in-memory CRUD (Create, Read, Update, Delete)
 * implementation to make the component runnable.
 * @param resourceName The name of the resource (e.g., 'products').
 */
const useResource = (resourceName) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate an API call with a delay
        const fetchData = async () => {
            try {
                // Mock initial data with product-related properties
                const mockData = [
                    {
                        id: 'prod-1',
                        name: 'Acoustic Headphones',
                        brand: 'AudioPhonic',
                        description: 'Immersive sound with active noise cancellation for a perfect listening experience.',
                        icon: '🎧',
                        category: ['Audio', 'Headphones'],
                        price: '$199.99'
                    },
                    {
                        id: 'prod-2',
                        name: 'Smartwatch Ultra',
                        brand: 'Wearable Tech Co.',
                        description: 'Track your fitness, notifications, and calls right from your wrist.',
                        icon: '⌚',
                        category: ['Wearable', 'Gadgets'],
                        price: '$349.00'
                    },
                    {
                        id: 'prod-3',
                        name: 'Minimalist Keyboard',
                        brand: 'TypingWorks',
                        description: 'A sleek, compact mechanical keyboard with a satisfying click.',
                        icon: '⌨️',
                        category: ['Peripherals', 'Accessories'],
                        price: '$89.50'
                    },
                    {
                        id: 'prod-4',
                        name: 'Portable Power Bank',
                        brand: 'ChargeFast',
                        description: 'Keep your devices charged on the go with this high-capacity battery pack.',
                        icon: '🔋',
                        category: ['Accessories', 'Mobile'],
                        price: '$45.00'
                    },
                    {
                        id: 'prod-5',
                        name: '4K Action Camera',
                        brand: 'ViewFinder',
                        description: 'Capture life\'s most exciting moments in stunning ultra-high definition.',
                        icon: '📹',
                        category: ['Photography', 'Video'],
                        price: '$299.99'
                    },
                    {
                        id: 'prod-6',
                        name: 'Smart Home Hub',
                        brand: 'Connected Living',
                        description: 'Control all your smart devices from a single, intuitive hub.',
                        icon: '🏠',
                        category: ['Smart Home', 'Automation'],
                        price: '$120.00'
                    },
                    {
                        id: 'prod-7',
                        name: 'Bluetooth Speaker',
                        brand: 'SonicWave',
                        description: 'Crisp, clear audio in a compact, waterproof design.',
                        icon: '🔊',
                        category: ['Audio', 'Speakers'],
                        price: '$75.00'
                    },
                ];
                await new Promise(resolve => setTimeout(resolve, 1000));
                setData(mockData);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [resourceName]);

    return { data, isLoading, error };
};

/**
 * Renders a single "Product Card" for the grid layout.
 * The card is consistent with the business of a product seller.
 * @param product The product object to display.
 */
const ProductCard = ({ product }) => (
    <Card className="flex flex-col p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-xl">
                    {product.icon}
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{product.brand}</p>
            </div>
            <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-4">
            {product.category.map(category => (
                <Badge key={category} variant="secondary" className="px-2 py-0.5">{category}</Badge>
            ))}
        </div>
        <div className="mt-4 font-bold text-lg">
            {product.price}
        </div>
    </Card>
);

/**
 * A simple card with a plus button to create a new item.
 */
const CreateNewCard = () => (
    <Card className="flex flex-col items-center justify-center p-4 h-full text-center transition-colors hover:bg-muted/50 cursor-pointer border-dashed border-2">
        <Button variant="ghost" className="h-16 w-16 rounded-full text-gray-500 dark:text-gray-400">
            <Plus className="h-8 w-8" />
        </Button>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Create New Product
        </p>
    </Card>
);

// --- Main App Component ---

/**
 * Main application component styled as a Shadcn UI dashboard, now
 * focused on a product marketplace with a simple grid layout.
 */
export default function BrowseAppNew() {
    const { data: products, isLoading, error } = useResource('products');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center p-4">
                <p className="text-center text-gray-500 dark:text-gray-400">Loading Products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center p-4">
                <p className="text-center text-red-500">Failed to load products. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <ScrollArea className="flex-1 p-6">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Marketplace</h1>
                        <p className="text-sm text-muted-foreground mt-1">Discover and manage your products.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9 w-full sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="w-full sm:w-auto hidden sm:flex">
                            <Plus className="h-4 w-4 mr-2" />
                            New Product
                        </Button>
                    </div>
                </header>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">All Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <CreateNewCard />
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
