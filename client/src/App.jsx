import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Publiclayouts from './layout/Publiclayouts';
import AdminLayouts from './layout/AdminLayouts';
import UserLayouts from './layout/userlayouts';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import FileUpload from './components/FileUpload';
import History from './components/History';
import Analysis from './pages/analysis.jsx';
import AIInsight from './pages/aiinsight';
import Settings from './pages/settings';
import NotFound from './pages/notfound';
import DashboardLay from './pages/dashboardlay';
import AdminDashboard from './pages/Admindashboard';
import AdminUsers from './components/AdminUsers';
import UsersDetail from './components/UsersDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<Publiclayouts />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User routes */}
        <Route element={<UserLayouts />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/aiinsight" element={<AIInsight />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayouts />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
