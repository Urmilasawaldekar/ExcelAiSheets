import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const RecentCharts = () => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentCharts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/recentCharts', { withCredentials: true });
        setCharts(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load recent charts');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCharts();
  }, []);

  if (loading) {
    return <Box sx={{ textAlign: 'center', p: 2 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  }

  if (charts.length === 0) {
    return <Typography sx={{ p: 2 }}>No recent charts found.</Typography>;
  }

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Recent Charts
      </Typography>
      <List>
        {charts.map((chart) => (
          <React.Fragment key={chart._id}>
            <ListItem>
              <ListItemText
                primary={`${chart.chartType} for ${chart.filename}`}
                secondary={`Created at: ${new Date(chart.createdAt).toLocaleString()}`}
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RecentCharts;
