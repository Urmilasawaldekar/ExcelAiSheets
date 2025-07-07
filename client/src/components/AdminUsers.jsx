import React, { useEffect, useState } from 'react';
import { Box, Button, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress } from '@mui/material';
import { PersonAdd as PersonAddIcon, Mail as MailIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import axios from 'axios';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/admin/getuser');
      // Defensive check for response data structure
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/delete/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      const message = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || 'Failed to delete user';
      alert(message);
    }
  };

  const handleAddUserOpen = () => {
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setOpenAddDialog(true);
  };

  const handleAddUserClose = () => {
    setOpenAddDialog(false);
    setError('');
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Name, email and password are required');
      return;
    }
    setAdding(true);
    setError('');
    try {
      setUsers(prev => [...prev, response.data.user]);
      setOpenAddDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box maxWidth={1000} mx="auto" p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
        <Box component="h1" fontSize={28} fontWeight="bold" sx={{ fontFamily: 'Arial, sans-serif', color: '#1976d2' }}>
          User Management
        </Box>
        <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={handleAddUserOpen}>
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box color="error.main" textAlign="center" mt={4}>{error}</Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="user management table" sx={{ tableLayout: 'auto', minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Files Uploaded</TableCell>
                <TableCell>Charts Created</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box fontWeight="bold">{user.name}</Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <MailIcon fontSize="small" />
                      {user.email}
                    </Box>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CalendarIcon fontSize="small" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell>{user.filesUploaded || 0}</TableCell>
                  <TableCell>{user.chartsCreated || 0}</TableCell>
                  <TableCell>{user.lastActive || 'N/A'}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button variant="outlined" size="small" onClick={() => handleDelete(user._id)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openAddDialog} onClose={handleAddUserClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="standard"
            value={newUser.name}
            onChange={handleAddUserChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="standard"
            value={newUser.email}
            onChange={handleAddUserChange}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={handleAddUserChange}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            select
            fullWidth
            variant="standard"
            value={newUser.role}
            onChange={handleAddUserChange}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {error && <Box color="error.main" mt={1}>{error}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserClose} disabled={adding}>Cancel</Button>
          <Button onClick={handleAddUserSubmit} disabled={adding}>
            {adding ? 'Adding...' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
