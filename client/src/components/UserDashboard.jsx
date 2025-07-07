import React from 'react';
import { SidebarProvider, AppSidebar } from './ui/sidebar';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Dashboard } from '@mui/icons-material';
import DashboardLay from '../pages/dashboardlay';

const UserDashboard = () => {

  return (
<DashboardLay/>
  );
};

export default UserDashboard;
