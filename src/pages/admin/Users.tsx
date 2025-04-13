
import React, { useState } from 'react';
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
import { usersApi, organizationsApi } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isSuperAdmin = user?.userRole === '1';
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>(isSuperAdmin ? 'all' : (user?.organizationId || ''));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    userRole: '3' as UserRole,
    organizationId: '',
    password: '',
  });

  // Fetch organizations
  const { 
    data: organizations = [], 
    isLoading: isLoadingOrgs 
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsApi.getAll(),
    enabled: !!user
  });

  // Fetch users based on selected organization
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users', selectedOrgId],
    queryFn: () => usersApi.getAll(selectedOrgId === 'all' ? undefined : selectedOrgId),
    enabled: !!user
  });

  const users = usersData?.users || usersData || [];

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => usersApi.create(userData),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message}`);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => usersApi.update(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  });

  const handleOpenDialog = (user?: UserType) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userRole: user.userRole || '3',
        organizationId: user.organizationId?.toString() || '',
        password: '', // We don't set the password for edits
      });
    } else {
      setCurrentUser(null);
      setFormData({
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        userRole: '3',
        organizationId: selectedOrgId === 'all' ? '' : selectedOrgId,
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
      updateUserMutation.mutate({
        id: currentUser.id,
        data: {
          username: formData.userName,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.userRole,
          orgId: parseInt(formData.organizationId),
        }
      });
    } else {
      // Create new user
      if (!formData.password) {
        toast.error('Password is required for new users');
        return;
      }
      
      createUserMutation.mutate({
        username: formData.userName,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.userRole,
        orgId: parseInt(formData.organizationId),
        password: formData.password
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const getUserFullName = (user: UserType) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.userName || '';
  };

  // Find organization name by ID
  const getOrgName = (orgId: string | number) => {
    const org = organizations.find(org => org.id.toString() === orgId.toString());
    return org ? org.orgname : 'Unknown';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          {isSuperAdmin && selectedOrgId && selectedOrgId !== 'all' && (
            <p className="text-sm text-muted-foreground">
              Showing users for {getOrgName(selectedOrgId)}
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
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id.toString()} value={org.id.toString()}>
                    {org.orgname}
                  </SelectItem>
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
                {isSuperAdmin && selectedOrgId === 'all' && (
                  <TableHead className="hidden md:table-cell">Organization</TableHead>
                )}
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin && selectedOrgId === 'all' ? 6 : 5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin && selectedOrgId === 'all' ? 6 : 5} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.userName || ''}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getUserFullName(user)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        (user.userRole === '2') 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {(user.userRole === '2') ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    {isSuperAdmin && selectedOrgId === 'all' && (
                      <TableCell className="hidden md:table-cell">
                        {getOrgName(user.organizationId || '')}
                      </TableCell>
                    )}
                    <TableCell className="hidden md:table-cell">
                      {user.lastLogin || 'Never'}
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
                  disabled={user?.userRole !== '1' && formData.userRole === '2'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Only super admin can create org admins */}
                    {user?.userRole === '1' && (
                      <SelectItem value="2">Organization Admin</SelectItem>
                    )}
                    <SelectItem value="3">User</SelectItem>
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
                      <SelectItem key={org.id.toString()} value={org.id.toString()}>
                        {org.orgname}
                      </SelectItem>
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
