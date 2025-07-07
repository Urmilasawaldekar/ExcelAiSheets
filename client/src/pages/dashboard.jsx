import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Box, Grid, Button } from '@mui/material';
import { BarChart, TrendingUp, Upload, Psychology, People } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: 0, color: 'primary.main', icon: People },
    { title: "Files Uploaded", value: 0, color: 'success.main', icon: InsertDriveFileIcon },
    { title: "Charts Generated", value: 0, color: 'info.main', icon: TrendingUp },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('/api/user/dashboard', { withCredentials: true });
      const data = response.data;
      setStats([
        { title: "Total Users", value: data.totalUsers || 0, color: 'primary.main', icon: People },
        { title: "Files Uploaded", value: data.totalFilesUploaded || 0, color: 'success.main', icon: InsertDriveFileIcon },
        { title: "Charts Generated", value: data.chartsGenerated || 0, color: 'info.main', icon: TrendingUp },
      ]);
      // Format recent activity time as locale string
      const formattedActivity = (data.recentActivity || []).map(activity => ({
        ...activity,
        time: new Date(activity.time).toLocaleString(),
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

  if (loading) {
    return <Typography>Loading dashboard stats...</Typography>;
  }

  if (error) {
    return <Typography color="error.main">{error}</Typography>;
  }

  return (
    <Box sx={{ py: 6, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome back! Here's an overview of your data analytics.
        </Typography>
      </Box>

      {/* Stats Grid */}
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
                  <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mt: 2 }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Activity Section */}
      <Box sx={{ mb: 2, textAlign: 'centre'  }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          Recent Activity
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'medium', mb: 3 }}>
          Here is the latest activity overview for your dashboard.
        </Typography>
        <Card>
          <CardHeader
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            title={<Typography variant="h6">Recent Activity</Typography>}
         
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No recent activity found.
                </Typography>
              ) : (
                recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">{activity.user || 'Unknown User'}</Typography>
                        <Typography variant="body2" color="text.secondary">{activity.action || 'No action description'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
