
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Organization } from '@/types';
import { organizationsApi } from '@/services/api';

// Mock data for fallback if API fails
const mockOrganizations: Organization[] = [
  { 
    id: 1, 
    orgname: 'Tech Solutions Inc', 
    rowstate: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 2, 
    orgname: 'IoT Innovations', 
    rowstate: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 3, 
    orgname: 'Smart Home Systems', 
    rowstate: '0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const OrganizationsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const createOgranization = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const res = await organizationsApi.create({orgname: formData.name});
          if(res)
          fetchOrganizations()
        } catch (error) {
          console.error('Error fetching organizations:', error);
          toast.error('Failed to fetch organizations, using mock data');
          // Fall back to mock data
          setOrganizations(mockOrganizations);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
      toast.error('Failed to fetch organizations');
      setOrganizations(mockOrganizations);
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      // Delay the API call slightly to ensure token is available
      setTimeout(async () => {
        try {
          const data = await organizationsApi.getAll();
          setOrganizations(data);
        } catch (error) {
          console.error('Error fetching organizations:', error);
          toast.error('Failed to fetch organizations, using mock data');
          // Fall back to mock data
          setOrganizations(mockOrganizations);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
      toast.error('Failed to fetch organizations');
      setOrganizations(mockOrganizations);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrganizations();
  }, [token]);

  const handleOpenDialog = (org?: Organization) => {
    if (org) {
      setCurrentOrg(org);
      setFormData({ name: org.orgname });
    } else {
      setCurrentOrg(null);
      setFormData({ name: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentOrg(null);
    setFormData({ name: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Organization name is required');
      return;
    }
    
    if (currentOrg) {
      toast.success('Organization updated successfully');
    } else {
      createOgranization()
      toast.success('Organization created successfully');
    }
    
    handleCloseDialog();
  };

  const handleDeleteOrganization = (id: number) => {
    // In a real app, this would be an API call
    toast.success('Organization deleted successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {/* <TableHead className="hidden md:table-cell">Status</TableHead> */}
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Loading organizations...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No organizations found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{org.orgname}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        org.rowstate === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {org.rowstate === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell> */}
                    <TableCell className="hidden md:table-cell">
                      {formatDate(org.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(org.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(org)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentOrg ? 'Edit Organization' : 'Create Organization'}
            </DialogTitle>
            <DialogDescription>
              {currentOrg 
                ? 'Update the organization details below.' 
                : 'Fill in the details to create a new organization.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {currentOrg ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsPage;
