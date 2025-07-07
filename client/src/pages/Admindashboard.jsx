import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import { TrendingUp, Users, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: 0, color: 'primary.main', icon: Users },
    { title: "Files Uploaded", value: 0, color: 'success.main', icon: FileSpreadsheet },
    { title: "Charts Generated", value: 0, color: 'info.main', icon: TrendingUp },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusBadge = (status) => {
    let color;
    let label;
    switch (status) {
      case 'success':
        color = 'green';
        label = 'Success';
        break;
      case 'error':
        color = 'red';
        label = 'Error';
        break;
      case 'warning':
        color = 'orange';
        label = 'Warning';
        break;
      default:
        color = 'gray';
        label = 'Unknown';
    }
    return (
      <Typography sx={{ color: color, fontWeight: 'bold', fontSize: 12 }}>
        {label}
      </Typography>
    );
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('/api/admin/dashboard', { withCredentials: true });
      const data = response.data;
      setStats([
        { title: "Total Users", value: data.totalUsers, color: 'primary.main', icon: Users },
        { title: "Files Uploaded", value: data.totalFilesUploaded, color: 'success.main', icon: FileSpreadsheet },
        { title: "Charts Generated", value: data.chartsGenerated, color: 'info.main', icon: TrendingUp },
      ]);
      // Format recent activity time as relative time string
      const formattedActivity = data.recentActivity.map(activity => ({
        ...activity,
        time: new Date(activity.time).toLocaleString(),
        status: 'success' // default status for now
      }));
      setRecentActivity(formattedActivity);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <Box sx={{ py: 6, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome back! Here's an overview of your data analytics.
        </Typography>
      </Box>

      {/* Stats Grid */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error.main">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={5} sx={{ justifyContent: 'center', mb: 6 }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={12} md={6} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ position: 'relative', overflow: 'hidden', boxShadow: 3, '&:hover': { boxShadow: 6 }, width: 300, height: 240 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: stat.color,
                        opacity: 0.1,
                        zIndex: 0,
                      }}
                    />
                    <CardHeader
                      sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, position: 'relative', zIndex: 1 }}
                      title={
                        <Typography variant="subtitle2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      }
                      action={
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: stat.color, color: 'white' }}>
                          <Icon fontSize="small" />
                        </Box>
                      }
                    />
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h4" fontWeight="bold" color="text.primary">
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Recent Activity */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
              Recent Activity
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              Here is the latest activity overview for your admin dashboard.
            </Typography>
          </Box>
          <Card>
            <CardHeader sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">Recent Activity</Typography>
                <Typography variant="body2" color="text.secondary">Latest user actions and system events</Typography>
              </Box>
              <Button variant="outlined" size="small">View All</Button>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">{activity.user}</Typography>
                        <Typography variant="body2" color="text.secondary">{activity.action}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
