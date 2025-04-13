
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Organization } from '@/types';

// Mock data - would be replaced with API calls
const mockOrganizations: Organization[] = [
  { id: '1', name: 'Smart Home Inc', description: 'Home automation solutions', createdAt: '2023-04-10' },
  { id: '2', name: 'Office Tech Ltd', description: 'Commercial IoT deployments', createdAt: '2023-05-15' },
  { id: '3', name: 'Industrial IoT Solutions', description: 'Factory automation systems', createdAt: '2023-06-22' },
];

const OrganizationsPage: React.FC = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with mock data
        setTimeout(() => {
          setOrganizations(mockOrganizations);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        toast.error('Failed to fetch organizations');
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOpenDialog = (org?: Organization) => {
    if (org) {
      setCurrentOrg(org);
      setFormData({ name: org.name, description: org.description || '' });
    } else {
      setCurrentOrg(null);
      setFormData({ name: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentOrg(null);
    setFormData({ name: '', description: '' });
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
      // Update organization
      const updatedOrgs = organizations.map(org => 
        org.id === currentOrg.id 
          ? { ...org, name: formData.name, description: formData.description } 
          : org
      );
      setOrganizations(updatedOrgs);
      toast.success('Organization updated successfully');
    } else {
      // Create new organization
      const newOrg: Organization = {
        id: Math.random().toString(36).substring(7), // In real app this would come from API
        name: formData.name,
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setOrganizations([...organizations, newOrg]);
      toast.success('Organization created successfully');
    }
    
    handleCloseDialog();
  };

  const handleDeleteOrganization = (id: string) => {
    // In a real app, this would be an API call
    const updatedOrgs = organizations.filter(org => org.id !== id);
    setOrganizations(updatedOrgs);
    toast.success('Organization deleted successfully');
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
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No organizations found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{org.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {org.description || 'No description'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {org.createdAt}
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
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter organization description"
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
