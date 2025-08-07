import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RestaurantAdmin } from '@/types';
import { restaurantAdminsAPI, restaurantsAPI, categoriesAPI, productsAPI, offersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, Users, Store } from 'lucide-react';
import Header from '@/components/Header';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<RestaurantAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState<RestaurantAdmin | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<RestaurantAdmin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    restaurantName: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const admins = await restaurantAdminsAPI.getAll();
      setAdmins(admins);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurant admins.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAdmin) {
        // Update existing admin
        await restaurantAdminsAPI.update(editingAdmin._id, formData);
        toast({
          title: "Admin updated",
          description: "Restaurant admin has been updated successfully.",
        });
      } else {
        // Create new admin and restaurant
        const restaurantId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const adminData = {
          ...formData,
          restaurantId,
          createdAt: new Date().toISOString(),
        };
        
        await restaurantAdminsAPI.create(adminData);
        
        // Create associated restaurant
        const restaurantFormData = new FormData();
        restaurantFormData.append('name', formData.restaurantName);
        restaurantFormData.append('address', '');
        restaurantFormData.append('contact', '');
        restaurantFormData.append('adminId', restaurantId);
        
        await restaurantsAPI.create(restaurantFormData);
        
        toast({
          title: "Admin created",
          description: "New restaurant admin has been created successfully.",
        });
      }

      setFormData({ username: '', password: '', restaurantName: '' });
      setEditingAdmin(null);
      setIsDialogOpen(false);
      loadAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      toast({
        title: "Error",
        description: "Failed to save restaurant admin.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (admin: RestaurantAdmin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: admin.password,
      restaurantName: admin.restaurantName,
    });
    setIsDialogOpen(true);
  };

  const handleView = (admin: RestaurantAdmin) => {
    setViewingAdmin(admin);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    try {
      await restaurantAdminsAPI.delete(adminId);
      toast({
        title: "Admin deleted",
        description: "Restaurant admin has been deleted successfully.",
      });
      loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Error",
        description: "Failed to delete restaurant admin.",
        variant: "destructive",
      });
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.restaurantId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-menu-bg">
      <Header />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage restaurant administrators</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? 'Edit Restaurant Admin' : 'Create Restaurant Admin'}
                </DialogTitle>
                <DialogDescription>
                  {editingAdmin ? 'Update the restaurant admin details.' : 'Add a new restaurant administrator to the platform.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <Store className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Users className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant Administrators</CardTitle>
            <CardDescription>Manage all restaurant admin accounts</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by restaurant name, username, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAdmins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No admins found matching your search.' : 'No restaurant admins created yet.'}
                </div>
              ) : (
                filteredAdmins.map((admin) => (
                  <div key={admin._id} className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <h3 className="text-lg font-semibold text-primary">{admin.restaurantName}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(admin)}
                              className="flex items-center gap-2"
                            >
                              <Search className="h-4 w-4" />
                              <span className="hidden xs:inline">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(admin)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden xs:inline">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(admin._id)}
                              className="flex items-center gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden xs:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4">
                            <span className="font-medium">Username:</span>
                            <span>{admin.username}</span>
                          </div>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4">
                            <span className="font-medium">Restaurant ID:</span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{admin.restaurantId}</span>
                          </div>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4">
                            <span className="font-medium">Created:</span>
                            <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Restaurant Details Modal */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Restaurant Details</DialogTitle>
              <DialogDescription>
                View complete restaurant information and menu details
              </DialogDescription>
            </DialogHeader>
            {viewingAdmin && <RestaurantDetailsView restaurantId={viewingAdmin.restaurantId} adminDetails={viewingAdmin} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const RestaurantDetailsView = ({ restaurantId, adminDetails }: { restaurantId: string, adminDetails: any }) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load restaurant data
        const restaurants = await restaurantsAPI.getAll();
        const foundRestaurant = restaurants.find((r: any) => r._id === restaurantId);
        setRestaurant(foundRestaurant);

        // Load categories
        const allCategories = await categoriesAPI.getAll();
        const restaurantCategories = allCategories.filter((c: any) => c.restaurantId === restaurantId);
        setCategories(restaurantCategories);

        // Load products
        const allProducts = await productsAPI.getAll();
        const restaurantProducts = allProducts.filter((p: any) => p.restaurantId === restaurantId);
        setProducts(restaurantProducts);

        // Load offers
        const allOffers = await offersAPI.getAll();
        const restaurantOffers = allOffers.filter((o: any) => o.restaurantId === restaurantId);
        setOffers(restaurantOffers);
      } catch (error) {
        console.error('Error loading restaurant data:', error);
      }
    };

    loadData();
  }, [restaurantId]);

  return (
    <div className="space-y-6">
      {/* Admin Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Administrator Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Username</Label>
              <p className="text-sm text-muted-foreground">{adminDetails.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Restaurant ID</Label>
              <p className="text-sm text-muted-foreground font-mono">{adminDetails.restaurantId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Created Date</Label>
              <p className="text-sm text-muted-foreground">{new Date(adminDetails.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Restaurant Name</Label>
              <p className="text-sm text-muted-foreground">{adminDetails.restaurantName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Profile */}
      {restaurant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Restaurant Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {restaurant.logo && (
                <img 
                  src={restaurant.logo} 
                  alt="Restaurant logo" 
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="space-y-2 flex-1">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{restaurant.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact</Label>
                  <p className="text-sm text-muted-foreground">{restaurant.contact}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{offers.length}</div>
              <div className="text-sm text-muted-foreground">Offers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => window.open(`/menu/${restaurantId}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              View Public Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;