'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sprout,
  Cloud,
  Droplets,
  BarChart3,
  Activity,
  Eye,
  RefreshCw,
  Phone,
  Mail,
  Clock,
  Star,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const agronomistStats = [
  { icon: Users, label: 'Farmers Helped', value: '147', change: '+12 this week', color: 'bg-blue-500/10 text-blue-600' },
  { icon: MessageCircle, label: 'Consultations', value: '89', change: '+8 this week', color: 'bg-green-500/10 text-green-600' },
  { icon: Sprout, label: 'Crop Diagnosed', value: '234', change: '+15 this week', color: 'bg-purple-500/10 text-purple-600' },
  { icon: Star, label: 'Success Rate', value: '94%', change: '+2%', color: 'bg-yellow-500/10 text-yellow-600' },
];

const farmerRequests = [
  { 
    id: 1, 
    farmer: 'Ramesh Kumar', 
    location: 'Delhi, India',
    crop: 'Wheat',
    issue: 'Yellowing leaves',
    priority: 'high',
    time: '2 hours ago',
    status: 'pending'
  },
  { 
    id: 2, 
    farmer: 'Suresh Patel', 
    location: 'Gujarat, India',
    crop: 'Cotton',
    issue: 'Pest identification',
    priority: 'medium',
    time: '5 hours ago',
    status: 'in-progress'
  },
  { 
    id: 3, 
    farmer: 'Amit Singh', 
    location: 'Punjab, India',
    crop: 'Rice',
    issue: 'Irrigation advice',
    priority: 'low',
    time: '1 day ago',
    status: 'resolved'
  },
];

const advisoryTips = [
  { 
    title: 'Wheat Season Alert', 
    description: 'Monitor for rust diseases in current weather conditions',
    type: 'warning',
    icon: AlertTriangle
  },
  { 
    title: 'Optimal Planting Time', 
    description: 'Next 7 days ideal for Rabi crops in North India',
    type: 'success',
    icon: CheckCircle
  },
  { 
    title: 'New Pest Treatment', 
    description: 'Organic pest control approved for cotton farming',
    type: 'info',
    icon: Lightbulb
  },
];

function AgronomistDashboardContent() {
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
          className="p-4 bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] rounded-3xl shadow-2xl"
        >
          <BookOpen className="h-12 w-12 text-white" />
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Advisory Overview', icon: BarChart3 },
    { id: 'farmers', label: 'Farmer Requests', icon: Users },
    { id: 'consultations', label: 'Consultations', icon: MessageCircle },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9eb] flex">
      {/* Agronomist Sidebar */}
      <div className="w-64 bg-[#7c3aed] text-white p-6 border-r border-purple-800">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Agronomist Portal</h2>
          <p className="text-purple-100 text-sm">Agricultural Expert System</p>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedTab === tab.id 
                  ? 'bg-purple-700 text-white' 
                  : 'hover:bg-purple-800 text-purple-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-purple-200">Agronomist</p>
            </div>
          </div>
          <Button variant="outline" className="w-full border-purple-600 text-purple-100 hover:bg-purple-800">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#7c3aed]">Agronomist Dashboard</h1>
            <p className="text-sm text-gray-600">Expert agricultural advisory system</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>North Region</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <h2 className="text-2xl font-bold text-[#7c3aed] mb-2">
                  Welcome back, {user?.name}! 🌱
                </h2>
                <p className="text-gray-700">
                  You have 3 new farmer requests and 5 consultations scheduled for today.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agronomistStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        Active
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xs text-purple-600 mt-2">{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Advisory Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Important Advisory Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advisoryTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tip.type === 'warning' ? 'bg-orange-100' :
                          tip.type === 'success' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          <tip.icon className={`h-5 w-5 ${
                            tip.type === 'warning' ? 'text-orange-600' :
                            tip.type === 'success' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{tip.title}</p>
                          <p className="text-sm text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'farmers' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Farmer Assistance Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farmerRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold">
                            {request.farmer[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.farmer}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{request.location}</span>
                            </div>
                            <p className="text-sm">{request.crop} • {request.issue}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{request.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'consultations' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Consultation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Consultation history and analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'knowledge' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Agricultural Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Comprehensive knowledge base coming soon</p>
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

export default function AgronomistDashboardPage() {
  return (
    <ProtectedRoute requiredRole="agronomist">
      <AgronomistDashboardContent />
    </ProtectedRoute>
  );
}
