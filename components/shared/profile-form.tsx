'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateProfile } from '@/lib/actions/profile';
import { User, PaymentMethod } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, MapPin, CreditCard, Save } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

interface ProfileFormProps {
  user: User;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark-purple';
  
  const [isPending, startTransition] = React.useTransition();
  const [fullName, setFullName] = React.useState(user.fullName || '');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState(user.phone || '');
  const [address, setAddress] = React.useState(user.address || '');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = React.useState<PaymentMethod | undefined>(
    user.defaultPaymentMethod || undefined
  );

  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    startTransition(async () => {
      try {
        await updateProfile({
          fullName,
          password: password ? password : undefined,
          phone: phone ? phone : undefined,
          address: address ? address : undefined,
          defaultPaymentMethod,
        });
        setMessage('Profile updated successfully! A confirmation email has been sent.');
        setPassword('');
      } catch (err) {
        console.error(err);
        setError('Failed to update profile. Please check your data.');
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl mx-auto">
      {message && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", isDark ? 'bg-secondary/20' : 'bg-white')}>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </div>
          <CardDescription>Your basic account details and security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Enter your full name" 
                disabled={isPending}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address (Read-only)</label>
              <Input value={user.email} disabled className="bg-muted" />
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="text-sm font-medium">New Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave empty to keep current password" 
              disabled={isPending}
              className="max-w-md transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", isDark ? 'bg-secondary/20' : 'bg-white')}>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Delivery Details</CardTitle>
          </div>
          <CardDescription>Optional. These will be auto-filled during checkout.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input 
              type="tel"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+1 (555) 000-0000" 
              disabled={isPending}
              className="max-w-md transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Address</label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="123 Pizza Street, Apt 4B" 
              disabled={isPending}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", isDark ? 'bg-secondary/20' : 'bg-white')}>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Payment Settings</CardTitle>
          </div>
          <CardDescription>Select your preferred way to pay.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium">Default Payment Method</label>
            <Select 
              value={defaultPaymentMethod || ''} 
              onValueChange={(val) => setDefaultPaymentMethod(val as PaymentMethod)}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CARD">Credit/Debit Card (Stripe)</SelectItem>
                <SelectItem value="CASH">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isPending} 
          size="lg"
          className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          {isPending ? 'Saving Changes...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  );
};
