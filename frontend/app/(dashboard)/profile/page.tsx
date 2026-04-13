'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Settings, 
  History,
  LogOut,
  Trash2,
  Globe,
  Bell,
  Droplets,
  Sun,
  Moon,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

// Types
interface FarmProfile {
  name: string;
  language: 'hindi' | 'english';
  area: string;
  soilType: string;
  primaryCrops: string[];
  irrigation: string;
}

interface UserSettings {
  weatherAlerts: boolean;
  dailyTips: boolean;
  irrigationReminders: boolean;
}

interface Recommendation {
  id: string;
  date: string;
  topCrop: string;
  summary: string;
}

interface ChatSession {
  id: string;
  date: string;
  messageCount: number;
  lastMessage: string;
}

// Mock data
const mockUser = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  role: 'Farmer',
  initials: 'RK'
};

const mockFarmProfile: FarmProfile = {
  name: 'Green Valley Farm',
  language: 'hindi',
  area: '5.2 acres',
  soilType: 'Loamy',
  primaryCrops: ['Wheat', 'Rice', 'Sugarcane'],
  irrigation: 'Drip Irrigation'
};

const mockSettings: UserSettings = {
  weatherAlerts: true,
  dailyTips: true,
  irrigationReminders: false
};

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    date: '2024-04-10',
    topCrop: 'Wheat',
    summary: 'Optimal harvest time approaching in 2 weeks'
  },
  {
    id: '2',
    date: '2024-04-08',
    topCrop: 'Rice',
    summary: 'Consider increasing nitrogen fertilizer'
  },
  {
    id: '3',
    date: '2024-04-05',
    topCrop: 'Sugarcane',
    summary: 'Monitor for pest activity in lower fields'
  }
];

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    date: '2024-04-11',
    messageCount: 12,
    lastMessage: 'Thank you for the irrigation advice!'
  },
  {
    id: '2',
    date: '2024-04-09',
    messageCount: 8,
    lastMessage: 'What fertilizer should I use for wheat?'
  },
  {
    id: '3',
    date: '2024-04-07',
    messageCount: 15,
    lastMessage: 'The weather prediction was very helpful'
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('farm');
  const [isEditing, setIsEditing] = useState(false);
  const [farmProfile, setFarmProfile] = useState(mockFarmProfile);
  const [settings, setSettings] = useState(mockSettings);
  const [newCrop, setNewCrop] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handleAddCrop = () => {
    if (newCrop.trim() && !farmProfile.primaryCrops.includes(newCrop.trim())) {
      setFarmProfile({
        ...farmProfile,
        primaryCrops: [...farmProfile.primaryCrops, newCrop.trim()]
      });
      setNewCrop('');
      toast.success('Crop added successfully!');
    }
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    setFarmProfile({
      ...farmProfile,
      primaryCrops: farmProfile.primaryCrops.filter(crop => crop !== cropToRemove)
    });
    toast.success('Crop removed successfully!');
  };

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleSwitchChange = (key: keyof UserSettings) => (checked: boolean) => {
    handleSettingChange(key, checked);
  };

  const handleLanguageToggle = () => {
    const newLanguage = farmProfile.language === 'hindi' ? 'english' : 'hindi';
    setFarmProfile({ ...farmProfile, language: newLanguage });
    toast.success(`Language changed to ${newLanguage === 'hindi' ? 'Hindi' : 'English'}`);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowLogoutDialog(false);
      toast.success('Logged out successfully!');
      // In real app, redirect to login page
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDeleteDialog(false);
      toast.error('Account deletion requested. You will receive a confirmation email.');
      // In real app, initiate account deletion process
    }, 1000);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          {/* Green Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-green-600 to-green-500 relative">
            {/* Avatar overlapping banner */}
            <div className="absolute -bottom-8 left-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-xl font-bold text-green-600">
                  {mockUser.initials}
                </span>
              </div>
            </div>
          </div>
          
          <CardContent className="pt-12 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{mockUser.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{mockUser.phone}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Farmer {String.fromCodePoint(0x1F33E)}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="mt-4 sm:mt-0">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="farm" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Farm Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          {/* Farm Profile Tab */}
          <TabsContent value="farm" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Farm Information</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="farmName">Farm Name</Label>
                        {isEditing ? (
                          <Input
                            id="farmName"
                            value={farmProfile.name}
                            onChange={(e) => setFarmProfile({ ...farmProfile, name: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{farmProfile.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Farm Area</Label>
                        {isEditing ? (
                          <Input
                            id="area"
                            value={farmProfile.area}
                            onChange={(e) => setFarmProfile({ ...farmProfile, area: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{farmProfile.area}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        {isEditing ? (
                          <Input
                            id="soilType"
                            value={farmProfile.soilType}
                            onChange={(e) => setFarmProfile({ ...farmProfile, soilType: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{farmProfile.soilType}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="irrigation">Irrigation Method</Label>
                        {isEditing ? (
                          <Input
                            id="irrigation"
                            value={farmProfile.irrigation}
                            onChange={(e) => setFarmProfile({ ...farmProfile, irrigation: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{farmProfile.irrigation}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Primary Crops</Label>
                      <div className="flex flex-wrap gap-2">
                        {farmProfile.primaryCrops.map((crop) => (
                          <Badge
                            key={crop}
                            variant="secondary"
                            className={`${isEditing ? 'cursor-pointer hover:bg-red-100' : ''}`}
                            onClick={() => isEditing && handleRemoveCrop(crop)}
                          >
                            {crop}
                            {isEditing && <X className="w-3 h-3 ml-1" />}
                          </Badge>
                        ))}
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add crop"
                              value={newCrop}
                              onChange={(e) => setNewCrop(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddCrop()}
                              className="w-32"
                            />
                            <Button size="sm" onClick={handleAddCrop}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Preference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <span>Language</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={farmProfile.language === 'hindi' ? 'font-medium text-green-600' : 'text-gray-600'}>
                      {String.fromCodePoint(0x0915)} {String.fromCodePoint(0x0939)} {String.fromCodePoint(0x093f)} {String.fromCodePoint(0x0928)} {String.fromCodePoint(0x094d)} {String.fromCodePoint(0x0926)} {String.fromCodePoint(0x0940)}
                    </span>
                    <Switch
                      checked={farmProfile.language === 'english'}
                      onCheckedChange={handleLanguageToggle}
                    />
                    <span className={farmProfile.language === 'english' ? 'font-medium text-green-600' : 'text-gray-600'}>
                      English
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-5 h-5 text-gray-600" />
                    <span>Weather Alerts</span>
                  </div>
                  <Switch
                    checked={settings.weatherAlerts}
                    onCheckedChange={handleSwitchChange('weatherAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span>Daily Tips</span>
                  </div>
                  <Switch
                    checked={settings.dailyTips}
                    onCheckedChange={handleSwitchChange('dailyTips')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-gray-600" />
                    <span>Irrigation Reminders</span>
                  </div>
                  <Switch
                    checked={settings.irrigationReminders}
                    onCheckedChange={handleSwitchChange('irrigationReminders')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build</span>
                  <span className="font-medium">2024.04.13</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.topCrop}</h4>
                      <p className="text-sm text-gray-600">{rec.summary}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{rec.date}</p>
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockChatSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Chat Session</h4>
                      <p className="text-sm text-gray-600 truncate">{session.lastMessage}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500">{session.date}</p>
                      <p className="text-xs text-gray-400">{session.messageCount} messages</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Confirmation Dialog */}
        {showLogoutDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg">Confirm Logout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowLogoutDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Account Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Delete Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This action cannot be undone. All your data will be permanently deleted.
                  </AlertDescription>
                </Alert>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This will remove all your farm data, chat history, and preferences.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}
