import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Restaurant, Category, Product, Offer } from '@/types';
import { restaurantsAPI, categoriesAPI, productsAPI, offersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Trash2, Save, Menu, X, Upload, ChefHat, ExternalLink, Phone, MapPin, Package, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';

const RestaurantAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const menuThemes = [
    { id: 'classic', name: 'Classic', description: 'Clean and professional' },
    { id: 'modern', name: 'Modern', description: 'Sleek and minimalist' },
    { id: 'luxury', name: 'Luxury', description: 'Elegant and premium' },
    { id: 'rustic', name: 'Rustic', description: 'Warm and cozy' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bold and colorful' }
  ];

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    address: '',
    contact: '',
    logo: '',
    theme: 'classic'
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    available: true
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    tags: '',
    validUntil: '',
    active: true
  });

  useEffect(() => {
    if (user?.restaurantId) {
      loadRestaurantData();
    }
  }, [user]);

  const loadRestaurantData = async () => {
    if (!user?.restaurantId) return;

    try {
      // Load restaurant
      const restaurants = await restaurantsAPI.getAll();
      const userRestaurant = restaurants.find((r: Restaurant) => r.adminId === user.restaurantId);
      if (userRestaurant) {
        setRestaurant(userRestaurant);
        setRestaurantForm({
          name: userRestaurant.name,
          address: userRestaurant.address,
          contact: userRestaurant.contact,
          logo: userRestaurant.logo || '',
          theme: userRestaurant.theme || 'classic'
        });
      }

      // Load categories
      const allCategories = await categoriesAPI.getAll();
      setCategories(allCategories.filter((c: Category) => c.restaurantId === user.restaurantId));

      // Load products
      const allProducts = await productsAPI.getAll();
      setProducts(allProducts.filter((p: Product) => p.restaurantId === user.restaurantId));

      // Load offers
      const allOffers = await offersAPI.getAll();
      setOffers(allOffers.filter((o: Offer) => o.restaurantId === user.restaurantId));
    } catch (error) {
      console.error('Error loading restaurant data:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurant data.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setter(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    try {
      const formData = new FormData();
      formData.append('name', restaurantForm.name);
      formData.append('address', restaurantForm.address);
      formData.append('contact', restaurantForm.contact);
      formData.append('theme', restaurantForm.theme);
      formData.append('adminId', restaurant.adminId || user?._id || '');

      if (restaurantForm.logo && restaurantForm.logo.startsWith('data:')) {
        // Convert data URL to File
        const response = await fetch(restaurantForm.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: 'image/png' });
        formData.append('logo', file);
      }

      await restaurantsAPI.update(restaurant._id, formData);
      
      toast({
        title: "Restaurant updated",
        description: "Restaurant profile has been updated successfully.",
      });
      
      loadRestaurantData();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to update restaurant profile.",
        variant: "destructive",
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    try {
      const formData = new FormData();
      formData.append('name', categoryForm.name);
      formData.append('restaurantId', user.restaurantId);
      formData.append('order', String(categories.length + 1));

      if (categoryForm.image && categoryForm.image.startsWith('data:')) {
        const response = await fetch(categoryForm.image);
        const blob = await response.blob();
        const file = new File([blob], 'category.png', { type: 'image/png' });
        formData.append('image', file);
      }

      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
        toast({
          title: "Category updated",
          description: "Category has been updated successfully.",
        });
      } else {
        await categoriesAPI.create(formData);
        toast({
          title: "Category created",
          description: "New category has been created successfully.",
        });
      }

      setCategoryForm({ name: '', image: '' });
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      loadRestaurantData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category.",
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('categoryId', productForm.categoryId);
      formData.append('restaurantId', user.restaurantId);
      formData.append('available', String(productForm.available));

      if (productForm.image && productForm.image.startsWith('data:')) {
        const response = await fetch(productForm.image);
        const blob = await response.blob();
        const file = new File([blob], 'product.png', { type: 'image/png' });
        formData.append('image', file);
      }

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData);
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        await productsAPI.create(formData);
        toast({
          title: "Product created",
          description: "New product has been created successfully.",
        });
      }

      setProductForm({ name: '', description: '', price: '', image: '', categoryId: '', available: true });
      setEditingProduct(null);
      setIsProductDialogOpen(false);
      loadRestaurantData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    try {
      const offerData = {
        title: offerForm.title,
        description: offerForm.description,
        discount: parseFloat(offerForm.discount),
        tags: offerForm.tags.split(',').map(tag => tag.trim()),
        restaurantId: user.restaurantId,
        validUntil: offerForm.validUntil,
        active: offerForm.active
      };

      if (editingOffer) {
        await offersAPI.update(editingOffer._id, offerData);
        toast({
          title: "Offer updated",
          description: "Offer has been updated successfully.",
        });
      } else {
        await offersAPI.create(offerData);
        toast({
          title: "Offer created",
          description: "New offer has been created successfully.",
        });
      }

      setOfferForm({ title: '', description: '', discount: '', tags: '', validUntil: '', active: true });
      setEditingOffer(null);
      setIsOfferDialogOpen(false);
      loadRestaurantData();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Error",
        description: "Failed to save offer.",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    // Check if category has products
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    if (categoryProducts.length > 0) {
      toast({
        title: "Cannot delete category",
        description: "This category has products. Please delete or move the products first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await categoriesAPI.delete(categoryId);
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
      loadRestaurantData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productsAPI.delete(productId);
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      loadRestaurantData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      await offersAPI.delete(offerId);
      toast({
        title: "Offer deleted",
        description: "Offer has been deleted successfully.",
      });
      loadRestaurantData();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "Error",
        description: "Failed to delete offer.",
        variant: "destructive",
      });
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      image: category.image || ''
    });
    setIsCategoryDialogOpen(true);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || '',
      categoryId: product.categoryId,
      available: product.available
    });
    setIsProductDialogOpen(true);
  };

  const startEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      discount: offer.discount.toString(),
      tags: offer.tags.join(', '),
      validUntil: offer.validUntil.split('T')[0],
      active: offer.active
    });
    setIsOfferDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-menu-bg">
      <Header />
      <div className="container mx-auto p-4 space-y-6 max-w-7xl">
        {/* Mobile-Optimized Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Restaurant Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your restaurant's profile and menu</p>
            </div>
            <Button
              onClick={() => window.open(`/menu/${user?.restaurantId}`, '_blank')}
              className="w-full sm:w-auto h-10 text-sm"
              size="sm"
            >
              <Menu className="h-4 w-4 mr-2" />
              View Menu Page
            </Button>
          </div>
        </div>

        <Tabs defaultValue="restaurant" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="restaurant" className="text-xs sm:text-sm py-2">Restaurant</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm py-2">Categories</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2">Products</TabsTrigger>
            <TabsTrigger value="offers" className="text-xs sm:text-sm py-2">Offers</TabsTrigger>
          </TabsList>

          {/* Restaurant Tab */}
          <TabsContent value="restaurant" className="space-y-4">
            <div className="space-y-4">
              {/* Mobile-Optimized Restaurant Profile Card */}
              <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50 border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Mobile-First Layout */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center shadow-inner border border-primary/20">
                        {restaurant?.logo ? (
                          <img 
                            src={restaurant.logo} 
                            alt="Restaurant Logo" 
                            className="w-14 h-14 sm:w-18 sm:h-18 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-primary/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                          {restaurant?.name || 'Restaurant Name'}
                        </h1>
                        <Badge variant="secondary" className="font-medium text-xs">
                          {restaurant?.theme ? menuThemes.find(t => t.id === restaurant.theme)?.name : 'No Theme'}
                        </Badge>
                      </div>
                    </div>

                    {/* Restaurant Contact Info */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{restaurant?.contact || 'No contact info'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{restaurant?.address || 'No address provided'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="bg-primary/5 rounded-lg p-2 sm:p-3 text-center border border-primary/10">
                        <div className="text-lg sm:text-xl font-bold text-primary">{categories.length}</div>
                        <div className="text-xs text-muted-foreground">Categories</div>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-2 sm:p-3 text-center border border-primary/10">
                        <div className="text-lg sm:text-xl font-bold text-primary">{products.length}</div>
                        <div className="text-xs text-muted-foreground">Products</div>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-2 sm:p-3 text-center border border-primary/10">
                        <div className="text-lg sm:text-xl font-bold text-primary">{offers.length}</div>
                        <div className="text-xs text-muted-foreground">Offers</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button 
                        onClick={() => setIsRestaurantDialogOpen(true)}
                        className="flex-1 h-10 sm:h-11 text-sm font-medium"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`/menu/${user?.restaurantId}`, '_blank')}
                        className="flex-1 h-10 sm:h-11 text-sm font-medium"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Menu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Menu Categories</span>
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', image: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? 'Update the category details.' : 'Create a new menu category.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            placeholder="Enter category name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryImage">Category Image</Label>
                          <Input
                            id="categoryImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (value) => setCategoryForm({ ...categoryForm, image: value }))}
                          />
                          {categoryForm.image && (
                            <img src={categoryForm.image} alt="Category preview" className="w-20 h-20 object-cover rounded" />
                          )}
                        </div>
                        <Button type="submit">{editingCategory ? 'Update Category' : 'Create Category'}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Organize your menu items into categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        {category.image && (
                          <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded mb-2" />
                        )}
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {products.filter(p => p.categoryId === category._id).length} products
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => startEditCategory(category)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteCategory(category._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Menu Products</span>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => { 
                          setEditingProduct(null); 
                          setProductForm({ name: '', description: '', price: '', image: '', categoryId: '', available: true }); 
                        }}
                        disabled={categories.length === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                          {editingProduct ? 'Update the product details.' : 'Create a new menu product.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                              id="productName"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              placeholder="Enter product name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productPrice">Price</Label>
                            <Input
                              id="productPrice"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productDescription">Description</Label>
                          <Textarea
                            id="productDescription"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Product description"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productCategory">Category</Label>
                          <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productImage">Product Image</Label>
                          <Input
                            id="productImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (value) => setProductForm({ ...productForm, image: value }))}
                          />
                          {productForm.image && (
                            <img src={productForm.image} alt="Product preview" className="w-20 h-20 object-cover rounded" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="productAvailable"
                            checked={productForm.available}
                            onCheckedChange={(checked) => setProductForm({ ...productForm, available: checked })}
                          />
                          <Label htmlFor="productAvailable">Available</Label>
                        </div>
                        <Button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Manage your menu items</CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4" />
                    <p>Create categories first before adding products.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {categories.map((category) => {
                      const categoryProducts = products.filter(p => p.categoryId === category._id);
                      return (
                        <div key={category._id}>
                          <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryProducts.map((product) => (
                              <Card key={product._id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  {product.image && (
                                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                                  )}
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <span className="text-sm font-bold text-primary">${product.price}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                                  <div className="flex justify-between items-center">
                                    <span className={`text-xs px-2 py-1 rounded ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {product.available ? 'Available' : 'Unavailable'}
                                    </span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" onClick={() => startEditProduct(product)}>
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          {categoryProducts.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Package className="h-8 w-8 mx-auto mb-2" />
                              <p>No products in this category yet.</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Special Offers</span>
                  <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingOffer(null); setOfferForm({ title: '', description: '', discount: '', tags: '', validUntil: '', active: true }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                        <DialogDescription>
                          {editingOffer ? 'Update the offer details.' : 'Create a new special offer.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleOfferSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="offerTitle">Offer Title</Label>
                          <Input
                            id="offerTitle"
                            value={offerForm.title}
                            onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                            placeholder="Enter offer title"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offerDescription">Description</Label>
                          <Textarea
                            id="offerDescription"
                            value={offerForm.description}
                            onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                            placeholder="Offer description"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="offerDiscount">Discount (%)</Label>
                            <Input
                              id="offerDiscount"
                              type="number"
                              step="0.01"
                              value={offerForm.discount}
                              onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                              placeholder="0"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="offerValidUntil">Valid Until</Label>
                            <Input
                              id="offerValidUntil"
                              type="date"
                              value={offerForm.validUntil}
                              onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offerTags">Tags (comma separated)</Label>
                          <Input
                            id="offerTags"
                            value={offerForm.tags}
                            onChange={(e) => setOfferForm({ ...offerForm, tags: e.target.value })}
                            placeholder="e.g. lunch, dinner, special"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="offerActive"
                            checked={offerForm.active}
                            onCheckedChange={(checked) => setOfferForm({ ...offerForm, active: checked })}
                          />
                          <Label htmlFor="offerActive">Active</Label>
                        </div>
                        <Button type="submit">{editingOffer ? 'Update Offer' : 'Create Offer'}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Create and manage special offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer) => (
                    <Card key={offer._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{offer.title}</h4>
                          <span className="text-lg font-bold text-primary">{offer.discount}% OFF</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {offer.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded ${offer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {offer.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" onClick={() => startEditOffer(offer)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteOffer(offer._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {offers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-4" />
                    <p>No special offers created yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Restaurant Edit Dialog */}
        <Dialog open={isRestaurantDialogOpen} onOpenChange={setIsRestaurantDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Restaurant Profile</DialogTitle>
              <DialogDescription>Update your restaurant information and appearance</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRestaurantSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={restaurantForm.contact}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, contact: e.target.value })}
                  placeholder="Phone number or email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={restaurantForm.address}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                  placeholder="Restaurant address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (value) => setRestaurantForm({ ...restaurantForm, logo: value }))}
                />
                {restaurantForm.logo && (
                  <img src={restaurantForm.logo} alt="Logo preview" className="w-20 h-20 object-cover rounded" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Menu Theme</Label>
                <Select value={restaurantForm.theme} onValueChange={(value) => setRestaurantForm({ ...restaurantForm, theme: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-muted-foreground">{theme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Update Restaurant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RestaurantAdminDashboard;
