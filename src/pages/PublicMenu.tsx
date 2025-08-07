import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Restaurant, Category, Product, Offer } from '@/types';
import { restaurantsAPI, categoriesAPI, productsAPI, offersAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChefHat, Clock, Phone, MapPin, ChevronDown, ChevronUp, Tag, Search, Star, Heart, Share2 } from 'lucide-react';
import { getTheme } from '@/components/MenuThemes';

const PublicMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = getTheme(restaurant?.theme);

  useEffect(() => {
    if (restaurantId) {
      loadMenuData();
    }
  }, [restaurantId]);

  const loadMenuData = async () => {
    if (!restaurantId) return;
    setLoading(true);

    try {
      // Load restaurant by ID
      const restaurant = await restaurantsAPI.getById(restaurantId);
      setRestaurant(restaurant);

      if (restaurant) {
        // Load categories
        const allCategories = await categoriesAPI.getAll();
        const restaurantCategories = allCategories
          .filter((c: Category) => c.restaurantId === restaurantId)
          .sort((a: Category, b: Category) => a.order - b.order);
        setCategories(restaurantCategories);

        // Load products
        const allProducts = await productsAPI.getAll();
        setProducts(allProducts.filter((p: Product) => p.restaurantId === restaurantId));

        // Load offers
        const allOffers = await offersAPI.getAll();
        const activeOffers = allOffers.filter((o: Offer) => 
          o.restaurantId === restaurantId && 
          o.active && 
          new Date(o.validUntil) > new Date()
        );
        setOffers(activeOffers);

        // Open first category by default
        if (restaurantCategories.length > 0) {
          setOpenCategories(new Set([restaurantCategories[0]._id]));
        }
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId);
    } else {
      newOpenCategories.add(categoryId);
    }
    setOpenCategories(newOpenCategories);
  };

  const getCategoryProducts = (categoryId: string) => {
    return products.filter(p => 
      p.categoryId === categoryId && 
      p.available &&
      (searchQuery === '' || 
       p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredCategories = categories.filter(category => 
    getCategoryProducts(category._id).length > 0
  );

  if (loading) {
    return (
      <div className={`${theme.classes.container} flex items-center justify-center min-h-screen`}>
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <ChefHat className="w-8 h-8 text-primary/60" />
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-primary/10 rounded-lg w-32 mx-auto animate-pulse"></div>
            <div className="h-4 bg-primary/5 rounded-lg w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className={`${theme.classes.container} flex items-center justify-center min-h-screen`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8 text-destructive/60" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Restaurant Not Found</h1>
            <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme.classes.container}>
      <div className="max-w-sm mx-auto min-h-screen bg-background">
        {/* Mobile App Header */}
        <div className="bg-white dark:bg-slate-900 px-4 py-4 sticky top-0 z-50 shadow-sm border-b">
          <div className="space-y-4">
            {/* Restaurant Info Section */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center shadow-sm">
                {restaurant.logo ? (
                  <img 
                    src={restaurant.logo} 
                    alt={restaurant.name} 
                    className="w-10 h-10 object-cover rounded-md"
                  />
                ) : (
                  <ChefHat className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {restaurant.name}
                </h1>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{restaurant.contact}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/30 border-border/40 focus:bg-background text-sm rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Special Offers */}
          {offers.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Special Offers
              </h2>
              <div className="space-y-2">
                {offers.map((offer) => (
                  <Card key={offer._id} className="border border-primary/20 bg-primary/5 hover-scale">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-primary text-sm">{offer.title}</h3>
                        <Badge variant="destructive" className="bg-primary text-primary-foreground font-bold text-xs">
                          {offer.discount}% OFF
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        {offer.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {offer.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Menu Categories */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-primary" />
              Menu
            </h2>
            
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const categoryProducts = getCategoryProducts(category._id);
                const isOpen = openCategories.has(category._id);
                
                return (
                  <Card key={category._id} className="border border-border/50 bg-card shadow-sm hover-scale">
                    <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category._id)}>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {category.image && (
                                <img 
                                  src={category.image} 
                                  alt={category.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              )}
                              <div className="text-left">
                                <h3 className="font-semibold text-foreground text-sm">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {categoryProducts.length} items
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                        <CollapsibleContent>
                          <div className="px-3 pb-3 space-y-2">
                            {categoryProducts.map((product, index) => (
                              <div
                                key={product._id} 
                                className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
                              >
                                <div className="flex gap-3 w-full">
                                  {product.image && (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                    />
                                )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                      <h4 className="font-semibold text-foreground text-sm leading-tight">
                                        {product.name}
                                      </h4>
                                      <span className="font-bold text-primary text-base flex-shrink-0">
                                        ${product.price}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {searchQuery ? 'No items found' : 'No menu items available'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'The restaurant menu is being updated'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicMenu;