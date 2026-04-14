'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Settings, 
  Database, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  BarChart3,
  Activity,
  Mail,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const adminStats = [
  { icon: Users, label: 'Total Users', value: '1,247', change: '+12%', color: 'bg-blue-500/10 text-blue-600' },
  { icon: Activity, label: 'Active Sessions', value: '342', change: '+8%', color: 'bg-green-500/10 text-green-600' },
  { icon: Shield, label: 'Verified Agronomists', value: '89', change: '+15%', color: 'bg-purple-500/10 text-purple-600' },
  { icon: AlertTriangle, label: 'Pending Issues', value: '23', change: '-5%', color: 'bg-orange-500/10 text-orange-600' },
];

const recentUsers = [
  { id: 1, name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'farmer', status: 'active', joined: '2024-01-15' },
  { id: 2, name: 'Dr. Priya Sharma', email: 'priya@example.com', role: 'agronomist', status: 'pending', joined: '2024-01-14' },
  { id: 3, name: 'Suresh Patel', email: 'suresh@example.com', role: 'farmer', status: 'active', joined: '2024-01-13' },
  { id: 4, name: 'Amit Singh', email: 'amit@example.com', role: 'admin', status: 'active', joined: '2024-01-12' },
];

function AdminDashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9eb] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-4 bg-gradient-to-br from-[#1e1c12] to-[#3e4a3d] rounded-3xl shadow-2xl"
        >
          <Shield className="h-12 w-12 text-white" />
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fff9eb] flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[#1e1c12] text-white p-6 border-r border-gray-800">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
          <p className="text-gray-400 text-sm">Complete System Control</p>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedTab === tab.id 
                  ? 'bg-[#006b2c] text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1e1c12]">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage entire system</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8">
          {selectedTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge className={stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1e1c12]">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {user.status}
                          </Badge>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'users' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </div>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Advanced user management features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Advanced analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>System configuration panel coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
