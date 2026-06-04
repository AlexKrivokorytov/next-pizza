'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { Container, Title } from '@/components/shared';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

/**
 * Checkout page component.
 * Allows user to review cart and submit delivery details.
 *
 * @returns The checkout page UI.
 */
export default function CheckoutPage() {
  const { items, totalAmount, removeItem, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Zod format: { fieldName: { _errors: ['message'] } }
          const formattedErrors: Record<string, string[]> = {};
          Object.keys(data.errors).forEach(key => {
            if (key !== '_errors' && data.errors[key]._errors) {
              formattedErrors[key] = data.errors[key]._errors;
            }
          });
          setFieldErrors(formattedErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error(data.message || 'Failed to create order');
      }

      // Clear the cart on success
      clearCart();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push('/profile'); // Fallback redirect
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="mt-10 max-w-200 text-center">
        <Title text="Checkout" size="lg" className="font-extrabold mb-8" />
        <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
        <Button onClick={() => router.push('/')} size="lg">
          Go back to menu
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-10 pb-14">
      <Title text="Checkout" size="lg" className="font-extrabold mb-8" />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left side: Form */}
        <div className="flex-1">
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6 border">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={fieldErrors.fullName ? 'border-destructive' : ''}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-destructive">{fieldErrors.fullName[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={fieldErrors.email ? 'border-destructive' : ''}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                    className={fieldErrors.phone ? 'border-destructive' : ''}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-destructive">{fieldErrors.phone[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Delivery Address</label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Apt 4B"
                    className={fieldErrors.address ? 'border-destructive' : ''}
                  />
                  {fieldErrors.address && (
                    <p className="text-xs text-destructive">{fieldErrors.address[0]}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label htmlFor="comment" className="text-sm font-medium">Order Comment (Optional)</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full min-h-25 p-3 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Leave at the door..."
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right side: Order Summary */}
        <div className="w-full lg:w-100">
          <div className="bg-card p-6 rounded-lg shadow-sm border sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 max-h-100 overflow-y-auto pr-2 mb-6 scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold whitespace-nowrap text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold text-xl">${totalAmount.toFixed(2)}</span>
              </div>

              <Button
                form="checkout-form"
                type="submit"
                className="w-full h-12 text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
