import { useState } from 'react';
import { Eye, EyeOff, Brain, Shield, Zap, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    const mockUser = {
      id: '1',
      name: 'Executive User',
      email: formData.email,
      company: 'Acme Corporation',
      role: 'Chief Strategy Officer',
      avatar: '/api/placeholder/80/80'
    };
    
    onLogin(mockUser);
    setIsLoading(false);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced document processing with natural language understanding'
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'All processing happens locally - your data never leaves your machine'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Parallel processing for instant insights and analysis'
    },
    {
      icon: Database,
      title: 'Smart Memory',
      description: 'Intelligent indexing and retrieval of your knowledge base'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-title-2 font-bold">ERIKA</h1>
              <p className="text-callout text-muted-foreground">Executive Intelligence</p>
            </div>
          </div>
          
          <h2 className="text-title-3 font-semibold mb-6">
            Transform how you work with documents
          </h2>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-background/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-callout font-semibold mb-1">{feature.title}</h3>
                    <p className="text-caption-1 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-title-3 font-bold">ERIKA</h1>
                <p className="text-caption-1 text-muted-foreground">Executive Intelligence</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-title-3">Welcome back</CardTitle>
              <p className="text-callout text-muted-foreground">
                Sign in to access your executive dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="executive@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="remember" className="text-caption-1">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-caption-1">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-caption-2 text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="link" className="p-0 h-auto text-caption-2">
                      Contact your administrator
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-4 bg-muted/50">
            <CardContent className="p-4">
              <div className="text-center">
                <h4 className="text-caption-1 font-semibold mb-2">Demo Credentials</h4>
                <p className="text-caption-2 text-muted-foreground mb-2">
                  Use any email and password to access the demo
                </p>
                <div className="space-y-1 text-caption-2 font-mono">
                  <p>Email: demo@company.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}