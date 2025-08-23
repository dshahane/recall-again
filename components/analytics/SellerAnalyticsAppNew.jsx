import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    User,
    ChevronRight,
    LineChart,
    DollarSign,
    Package,
    TrendingUp,
    Star,
    Monitor,
    Shield
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// --- Mock Data and Utilities to make the code self-contained ---

const useResource = (resourceName) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let mockData = [];
                if (resourceName === 'products') {
                    mockData = [
                        {
                            id: 'prod-1',
                            name: 'Wireless Ergonomic Mouse',
                            category: 'Electronics',
                            marketplace: 'Amazon',
                            description: 'High-comfort mouse for long work sessions.',
                            icon: '🖱️',
                            image: 'https://images.unsplash.com/photo-1577979607632-680459521798?q=80&w=2940&auto=format&fit=crop',
                            conversionRate: '5.2%',
                            revenue: '$15,400',
                            isOnline: true,
                            badges: ['Best Seller', 'FBA', 'Prime']
                        },
                        {
                            id: 'prod-2',
                            name: 'Smart Coffee Brewer',
                            category: 'Home Goods',
                            marketplace: 'Walmart',
                            description: 'Brew your coffee from your phone.',
                            icon: '☕',
                            image: 'https://images.unsplash.com/photo-1541167713803-b072225381a1?q=80&w=2940&auto=format&fit=crop',
                            conversionRate: '3.1%',
                            revenue: '$8,200',
                            isOnline: true,
                            badges: ['Deal of the Day', 'Free Shipping']
                        },
                        {
                            id: 'prod-3',
                            name: 'Tactical Backpack',
                            category: 'Outdoors',
                            marketplace: 'Website',
                            description: 'Durable backpack for hiking and travel.',
                            icon: '🎒',
                            image: 'https://images.unsplash.com/photo-1587397843825-992a5d5a695d?q=80&w=2940&auto=format&fit=crop',
                            conversionRate: '6.5%',
                            revenue: '$21,900',
                            isOnline: true,
                            badges: ['Exclusive', 'High Margin']
                        },
                        {
                            id: 'prod-4',
                            name: 'Bluetooth Headphones',
                            category: 'Electronics',
                            marketplace: 'Amazon',
                            description: 'Noise-cancelling headphones for immersive sound.',
                            icon: '🎧',
                            image: 'https://images.unsplash.com/photo-1620023642398-35ed06716093?q=80&w=2940&auto=format&fit=crop',
                            conversionRate: '4.8%',
                            revenue: '$12,100',
                            isOnline: false,
                            badges: ['Prime', 'Rank #5']
                        },
                        {
                            id: 'prod-5',
                            name: 'Portable Charger',
                            category: 'Electronics',
                            marketplace: 'Amazon',
                            description: 'Fast-charging power bank for devices on the go.',
                            icon: '🔋',
                            image: 'https://images.unsplash.com/photo-1616462719124-b1523455a49c?q=80&w=2940&auto=format&fit=crop',
                            conversionRate: '7.0%',
                            revenue: '$19,800',
                            isOnline: true,
                            badges: ['New Arrival', 'High Demand']
                        }
                    ];
                } else if (resourceName === 'campaigns') {
                    mockData = [
                        {
                            id: 'camp-1',
                            name: 'Q3 Product Launch',
                            platform: 'Amazon Ads',
                            status: 'Active',
                            icon: '🚀',
                            spend: '$500',
                            roas: '3.2x'
                        },
                        {
                            id: 'camp-2',
                            name: 'Social Media Push',
                            platform: 'Meta Ads',
                            status: 'Paused',
                            icon: '📣',
                            spend: '$200',
                            roas: '1.8x'
                        },
                        {
                            id: 'camp-3',
                            name: 'Winter Sale',
                            platform: 'Google Ads',
                            status: 'Active',
                            icon: '❄️',
                            spend: '$750',
                            roas: '4.5x'
                        },
                    ];
                } else if (resourceName === 'competitors') {
                    mockData = [
                        {
                            id: 'comp-1',
                            name: 'Tech Innovations Inc.',
                            product: 'Ultra-Slim Mouse',
                            marketplace: 'Amazon',
                            rank: '3',
                            icon: '🏢'
                        },
                        {
                            id: 'comp-2',
                            name: 'Modern Home Co.',
                            product: 'Smart Kettle',
                            marketplace: 'Walmart',
                            rank: '12',
                            icon: '🏡'
                        },
                        {
                            id: 'comp-3',
                            name: 'Outdoor Adventures',
                            product: 'Travel Backpack Pro',
                            marketplace: 'Website',
                            rank: '2',
                            icon: '🗺️'
                        },
                    ];
                }
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

const MetricCard = ({ title, value, icon, description }) => (
    <Card className="flex flex-col items-center justify-center p-4 text-center min-w-[120px]">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="font-bold text-lg">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">{description}</p>
    </Card>
);

const ProductCard = ({ product }) => (
    <Card className="h-full flex flex-col justify-between p-4">
        <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl mr-4">
                {product.icon}
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.marketplace}</p>
            </div>
        </div>
        <div className="space-y-2 mb-4">
            <p className="text-sm font-medium">Revenue: <span className="text-green-600 dark:text-green-400">{product.revenue}</span></p>
            <p className="text-sm font-medium">Conversion: <span className="text-blue-600 dark:text-blue-400">{product.conversionRate}</span></p>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
            {product.badges.map(badge => (
                <Badge key={badge} variant="secondary">{badge}</Badge>
            ))}
        </div>
        <Button variant="outline" className="w-full">
            <LineChart className="h-4 w-4 mr-2" />
            View Details
        </Button>
    </Card>
);

const CampaignCard = ({ campaign }) => (
    <Card className="p-4 flex items-center h-full">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl mr-4">
            {campaign.icon}
        </div>
        <div className="flex-1">
            <h3 className="font-semibold">{campaign.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.platform}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold">{campaign.roas}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">ROAS</p>
        </div>
        <Button variant="outline" className="ml-4">
            <Star className="h-4 w-4" />
        </Button>
    </Card>
);

const CompetitorCard = ({ competitor }) => (
    <Card className="p-4 flex items-center h-full">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl mr-4">
            {competitor.icon}
        </div>
        <div className="flex-1">
            <h3 className="font-semibold">{competitor.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{competitor.product} on {competitor.marketplace}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">#{competitor.rank}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
        </div>
        <Button variant="outline" className="ml-4">
            <Monitor className="h-4 w-4" />
        </Button>
    </Card>
);

export default function SellerAnalyticsAppNew() {
    const { data: products, isLoading: productsLoading, error: productsError } = useResource('products');
    const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useResource('campaigns');
    const { data: competitors, isLoading: competitorsLoading, error: competitorsError } = useResource('competitors');

    if (productsLoading || campaignsLoading || competitorsLoading) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    if (productsError || campaignsError || competitorsError) {
        return (
            <div className="p-4 text-center text-red-500">
                <p>Failed to load data. Please try again.</p>
            </div>
        );
    }

    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
    const totalRevenue = products.reduce((acc, p) => acc + parseFloat(p.revenue.replace(/[^0-9.-]+/g, "")), 0);
    const totalConversionRate = (products.reduce((acc, p) => acc + parseFloat(p.conversionRate.replace('%', '')), 0) / products.length).toFixed(1);

    return (
        <div className="p-4 bg-white dark:bg-gray-950 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{todayDate}</p>
                    <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
                </div>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white">
                        <Search className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white">
                        <User className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Section: Today's Snapshot */}
                <h2 className="text-2xl font-bold">Today's Snapshot</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard
                        title="Total Revenue"
                        value={`$${totalRevenue.toFixed(2)}`}
                        icon={<DollarSign />}
                        description="Across all marketplaces"
                    />
                    <MetricCard
                        title="Avg. Conversion"
                        value={`${totalConversionRate}%`}
                        icon={<TrendingUp />}
                        description="Average across all products"
                    />
                    <MetricCard
                        title="Inventory Level"
                        value="92%"
                        icon={<Package />}
                        description="Based on reorder point"
                    />
                </div>

                <Separator />

                {/* Section: Top Products & Campaigns */}
                <h2 className="text-2xl font-bold">Top Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <Separator />

                {/* Section: Campaign Performance */}
                <h2 className="text-2xl font-bold">Campaign Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>

                <Separator />

                {/* Section: Competitor Rank Tracking */}
                <h2 className="text-2xl font-bold">Competitor Insights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                    {competitors.map((competitor) => (
                        <CompetitorCard key={competitor.id} competitor={competitor} />
                    ))}
                </div>
            </div>
        </div>
    );
}