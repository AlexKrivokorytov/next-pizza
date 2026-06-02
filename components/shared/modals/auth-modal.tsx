'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Title } from '../title';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to register');
        }
      }

      const resp = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!resp?.ok) {
        setError(resp?.error || 'Failed to sign in');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'w-[400px] p-8',
          isDarkPurple ? 'bg-secondary border-border' : 'bg-white border-none',
        )}
      >
        <DialogTitle asChild>
          <Title text={type === 'login' ? 'Sign In' : 'Register'} size="md" className="font-bold text-center mb-6" />
        </DialogTitle>
        <div className="flex gap-2 mb-4 p-1 bg-muted/50 rounded-lg">
          <Button
            variant={type === 'login' ? 'default' : 'ghost'}
            className="flex-1 h-8 rounded-md"
            onClick={() => setType('login')}
          >
            Login
          </Button>
          <Button
            variant={type === 'register' ? 'default' : 'ghost'}
            className="flex-1 h-8 rounded-md"
            onClick={() => setType('register')}
          >
            Register
          </Button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {type === 'register' && (
            <div>
              <label className={cn('text-sm font-medium', isDarkPurple ? 'text-gray-300' : 'text-gray-700')}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  'w-full mt-1 p-2 rounded-md outline-none',
                  isDarkPurple ? 'bg-background text-foreground' : 'bg-gray-100 text-gray-900',
                )}
                required
              />
            </div>
          )}
          <div>
            <label className={cn('text-sm font-medium', isDarkPurple ? 'text-gray-300' : 'text-gray-700')}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full mt-1 p-2 rounded-md outline-none',
                isDarkPurple ? 'bg-background text-foreground' : 'bg-gray-100 text-gray-900',
              )}
              required
            />
          </div>
          <div>
            <label className={cn('text-sm font-medium', isDarkPurple ? 'text-gray-300' : 'text-gray-700')}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                'w-full mt-1 p-2 rounded-md outline-none',
                isDarkPurple ? 'bg-background text-foreground' : 'bg-gray-100 text-gray-900',
              )}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isLoading} className="mt-4">
            {isLoading ? 'Please wait...' : type === 'login' ? 'Sign In' : 'Register'}
          </Button>
          {type === 'login' && (
            <div className="text-center mt-2">
              <span className={cn("text-sm", isDarkPurple ? "text-gray-400" : "text-gray-500")}>
                (Hint: Jane@example.com / 123456)
              </span>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
