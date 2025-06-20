
import React, { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('user');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('111111');
      setActiveTab('admin');
    } else {
      setEmail('user@gmail.com');
      setPassword('111111');
      setActiveTab('user');
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white px-4">
      <Card className="w-full max-w-md shadow-2xl border-purple-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Box Cricket Booking
          </CardTitle>
          <CardDescription className="text-purple-600">
            Choose your login type and access the platform
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-6 mb-4 bg-purple-100">
            <TabsTrigger 
              value="user" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              User
            </TabsTrigger>
            <TabsTrigger 
              value="admin"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-0">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-2">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">User Login</h3>
                  <p className="text-sm text-purple-600">Book your cricket slots</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fillCredentials('user')}
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  Use Demo Credentials
                </Button>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login as User'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="admin" className="mt-0">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-2">
                    <Crown className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">Admin Login</h3>
                  <p className="text-sm text-purple-600">Manage centers and bookings</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-purple-700">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-purple-700">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fillCredentials('admin')}
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  Use Demo Credentials
                </Button>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
