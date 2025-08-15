import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useDashboard();

  // Sample credentials for demo purposes
  const sampleCredentials = [
    { email: 'sarah.johnson@ics.org', password: 'admin123', role: 'Global Administrator' },
    { email: 'james.kimani@ics.org', password: 'country123', role: 'Country Administrator' },
    { email: 'mary.wanjiku@ics.org', password: 'project123', role: 'Project Administrator' },
    { email: 'peter.ochieng@ics.org', password: 'branch123', role: 'Branch Administrator' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check credentials
      const credential = sampleCredentials.find(c => c.email === email && c.password === password);
      if (!credential) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Find the user in mock data
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        setError('User not found in system.');
        setIsLoading(false);
        return;
      }

      // Store user in localStorage and context
      localStorage.setItem('ics-dashboard-user', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <img src="/logo.png" alt="ICS Logo" className="h-12 w-auto mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">IDMS Dashboard</CardTitle>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <p className="text-sm text-gray-600">Click any account to auto-fill credentials</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleCredentials.map((credential, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleDemoLogin(credential.email, credential.password)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{credential.email}</span>
                  <span className="text-xs text-gray-500">{credential.role}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-600">
          <p>This is a demo application. Use the demo accounts above to explore different user roles.</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 