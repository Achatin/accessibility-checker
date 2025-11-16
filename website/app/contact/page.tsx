'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navigation />
      <main className='min-h-screen py-20 md:py-32'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Get In Touch
            </h1>
            <p className='text-lg text-muted-foreground'>
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            <Card className='p-6 text-center'>
              <Mail className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='font-semibold mb-2'>Email</h3>
              <a
                href='mailto:feams@check.com'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                feams@check.com
              </a>
            </Card>

            <Card className='p-6 text-center'>
              <Phone className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='font-semibold mb-2'>Phone</h3>
              <a
                href='tel:+1234567890'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                +1 (234) 567-890
              </a>
            </Card>

            <Card className='p-6 text-center'>
              <MapPin className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='font-semibold mb-2'>Address</h3>
              <p className='text-muted-foreground'>
                San Francisco, CA
                <br />
                United States
              </p>
            </Card>
          </div>

          <Card className='p-8 md:p-12 max-w-2xl mx-auto'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {submitted && (
                <div className='p-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100'>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium mb-2'
                >
                  Name
                </label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='Your name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium mb-2'
                >
                  Email
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='your@email.com'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium mb-2'
                >
                  Subject
                </label>
                <Input
                  id='subject'
                  name='subject'
                  type='text'
                  placeholder='How can we help?'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium mb-2'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  placeholder='Your message here...'
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  required
                />
              </div>

              <Button type='submit' className='w-full'>
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
