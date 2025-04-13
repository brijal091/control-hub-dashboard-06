
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Plus, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Organization, User as UserType, UserRole } from '@/types';

// Mock data - would be replaced with API calls
const mockUsers: UserType[] = [
  { id: '1', userName: 'john.doe', userRole: 'orgadmin', organizationId: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', lastLogin: '2023-10-15' },
  { id: '2', userName: 'jane.smith', userRole: 'user', organizationId: '1', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', lastLogin: '2023-10-20' },
  { id: '3', userName: 'mike.wilson', userRole: 'user', organizationId: '2', email: 'mike@example.com', firstName: 'Mike', lastName: 'Wilson', lastLogin: '2023-10-18' },
];

const mockOrganizations: Organization[] = [
  { id: '1', name: 'Smart Home Inc', description: 'Home automation solutions' },
  { id: '2', name: 'Office Tech Ltd', description: 'Commercial IoT deployments' },
  { id: '3', name: 'Industrial IoT Solutions', description: 'Factory automation systems' },
];

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.userRole === 'superadmin';
  
  const [users, setUsers] = useState<UserType[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(isSuperAdmin ? '' : (user?.organizationId || ''));
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    userRole: 'user' as UserRole,
    organizationId: '',
    password: '',
  });

  useEffect(() => {
    // In a real application, these would be API calls
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (isSuperAdmin) {
          setOrganizations(mockOrganizations);
          
          if (selectedOrgId) {
            const filteredUsers = mockUsers.filter(u => u.organizationId === selectedOrgId);
            setUsers(filteredUsers);
          } else {
            setUsers(mockUsers);
          }
        } else {
          // For org admin, only show users in their organization
          const orgId = user?.organizationId || '';
          const filteredUsers = mockUsers.filter(u => u.organizationId === orgId);
          setUsers(filteredUsers);
          
          // Set the current org for org admin (they can't change it)
          const currentOrg = mockOrganizations.find(org => org.id === orgId);
          setOrganizations(currentOrg ? [currentOrg] : []);
          setSelectedOrgId(orgId);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSuperAdmin, selectedOrgId, user?.organizationId]);

  const handleOpenDialog = (user?: UserType) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        userName: user.userName,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userRole: user.userRole,
        organizationId: user.organizationId,
        password: '', // We don't set the password for edits
      });
    } else {
      setCurrentUser(null);
      setFormData({
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        userRole: 'user',
        organizationId: selectedOrgId,
        password: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName) {
      toast.error('Username is required');
      return;
    }

    if (!formData.organizationId) {
      toast.error('Organization is required');
      return;
    }
    
    if (currentUser) {
      // Update user
      const updatedUsers = users.map(u => 
        u.id === currentUser.id 
          ? { 
              ...u, 
              userName: formData.userName,
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              userRole: formData.userRole,
              organizationId: formData.organizationId,
            } 
          : u
      );
      setUsers(updatedUsers);
      toast.success('User updated successfully');
    } else {
      // Create new user
      // In a real app, API would handle password hashing etc.
      if (!formData.password) {
        toast.error('Password is required for new users');
        return;
      }
      
      const newUser: UserType = {
        id: Math.random().toString(36).substring(7),
        userName: formData.userName,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userRole: formData.userRole,
        organizationId: formData.organizationId,
        lastLogin: '-'
      };
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    }
    
    handleCloseDialog();
  };

  const handleDeleteUser = (id: string) => {
    // In a real app, this would be an API call
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    toast.success('User deleted successfully');
  };

  const getUserFullName = (user: UserType) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.userName;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          {isSuperAdmin && selectedOrgId && (
            <p className="text-sm text-muted-foreground">
              Showing users for {organizations.find(org => org.id === selectedOrgId)?.name}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {isSuperAdmin && (
            <Select 
              value={selectedOrgId} 
              onValueChange={handleOrgChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead>Role</TableHead>
                {isSuperAdmin && !selectedOrgId && (
                  <TableHead className="hidden md:table-cell">Organization</TableHead>
                )}
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin && !selectedOrgId ? 6 : 5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin && !selectedOrgId ? 6 : 5} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getUserFullName(user)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        user.userRole === 'orgadmin' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.userRole === 'orgadmin' ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    {isSuperAdmin && !selectedOrgId && (
                      <TableCell className="hidden md:table-cell">
                        {organizations.find(org => org.id === user.organizationId)?.name || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell className="hidden md:table-cell">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
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
              {currentUser ? 'Edit User' : 'Create User'}
            </DialogTitle>
            <DialogDescription>
              {currentUser 
                ? 'Update the user details below.' 
                : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input 
                id="userName" 
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>
            
            {/* Only show password field for new users */}
            {!currentUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Select 
                  value={formData.userRole}
                  onValueChange={(value) => handleSelectChange('userRole', value)}
                  disabled={user?.userRole !== 'superadmin' && formData.userRole === 'orgadmin'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Only super admin can create org admins */}
                    {user?.userRole === 'superadmin' && (
                      <SelectItem value="orgadmin">Organization Admin</SelectItem>
                    )}
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizationId">Organization</Label>
                <Select 
                  value={formData.organizationId}
                  onValueChange={(value) => handleSelectChange('organizationId', value)}
                  disabled={!isSuperAdmin}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {currentUser ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
