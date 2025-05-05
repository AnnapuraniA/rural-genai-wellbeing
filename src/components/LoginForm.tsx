import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      const success = await login(username, password);
      
      if (success) {
        toast({
        title: t('auth.loginSuccess'),
          variant: 'default',
        });
      
      const user = JSON.parse(localStorage.getItem('wellnet_user') || 'null');
      if (user) {
        const dashboardRoute = (() => {
          switch (user.role) {
            case 'coordinator':
              return '/dashboard/coordinator';
            case 'health_sakhi':
              return '/dashboard/sakhi';
            case 'customer':
              return '/dashboard/customer';
            case 'lab':
              return '/dashboard/lab';
            default:
              return '/dashboard';
          }
        })();
        navigate(dashboardRoute);
      }
    } else {
      toast({
        title: t('auth.loginError'),
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">{t('auth.username')}</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember">{t('auth.rememberMe')}</Label>
        </div>
        <Button variant="link" className="px-0">
          {t('auth.forgotPassword')}
        </Button>
      </div>
      <Button type="submit" className="w-full">
        {t('auth.signIn')}
      </Button>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">{t('auth.dontHaveAccount')}</span>
        <Button variant="link" className="px-0 ml-2">
          {t('auth.createAccount')}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;

