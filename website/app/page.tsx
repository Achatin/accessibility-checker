'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Shield,
  Download,
  History,
  Zap,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Loader2,
  Github as GitHub,
} from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

interface CheckResult {
  id: string;
  url: string;
  date: string;
  violations: number;
  warnings: number;
}

export default function HomePage() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    violations: Array<{ type: string; count: number; fix: string }>;
    warnings: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'checker' | 'history'>('checker');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUrl) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResults = {
      violations: [
        {
          type: 'Missing alt text',
          count: 5,
          fix: 'Add descriptive alt text to all images',
        },
        {
          type: 'Color contrast',
          count: 3,
          fix: 'Ensure contrast ratio meets WCAG AA standards',
        },
        {
          type: 'Missing form labels',
          count: 2,
          fix: 'Associate all form inputs with labels',
        },
        {
          type: 'Heading hierarchy',
          count: 1,
          fix: 'Use headings in sequential order',
        },
      ],
      warnings: 2,
    };

    setResults(mockResults);
    const totalViolations = mockResults.violations.reduce(
      (sum, v) => sum + v.count,
      0
    );
    const newCheck = {
      id: Date.now().toString(),
      url: currentUrl,
      date: new Date().toLocaleString(),
      violations: totalViolations,
      warnings: mockResults.warnings,
    };
    setChecks((prev) => [newCheck, ...prev]);
    setLoading(false);
  };

  const exportToHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Report - ${currentUrl}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .violation { background: #fee; padding: 15px; margin: 10px 0; border-left: 4px solid #c33; border-radius: 4px; }
    .fix { color: #666; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Accessibility Report</h1>
  <p><strong>URL:</strong> ${currentUrl}</p>
  <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  <h2>Violations Found</h2>
  ${results?.violations
    .map(
      (v) => `
    <div class="violation">
      <strong>${v.type}</strong> (${v.count} occurrences)
      <div class="fix"><strong>Fix:</strong> ${v.fix}</div>
    </div>
  `
    )
    .join('')}
</body>
</html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `accessibility-report-${Date.now()}.html`;
    a.click();
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navigation />
      <main className='min-h-screen'>
        {/* Hero Section */}
        <section
          id='home'
          className='relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 py-20 md:py-32'
        >
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='text-center space-y-6'>
              <h1 className='text-4xl md:text-6xl font-bold text-balance tracking-tight'>
                Check Web Accessibility with Confidence
              </h1>
              <p className='text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto'>
                Find and fix accessibility violations instantly. Export to HTML
                or PDF, track history, and compare results across multiple
                websites.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                <button
                  onClick={() =>
                    document
                      .getElementById('checker')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium'
                >
                  <Zap className='w-5 h-5' />
                  Start Checking
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('pricing')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-input bg-background hover:bg-muted transition-colors font-medium'
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 md:py-32 border-t'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>Features</h2>
              <p className='text-lg text-muted-foreground'>
                Everything you need to ensure web accessibility
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='p-6 border-2 hover:border-primary/50 transition-colors'>
                <div className='flex gap-4'>
                  <CheckCircle2 className='w-6 h-6 text-primary flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-semibold text-lg mb-2'>
                      Unlimited Checks
                    </h3>
                    <p className='text-muted-foreground'>
                      Check as many websites as you need. No limits on scans or
                      comparisons.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className='p-6 border-2 hover:border-primary/50 transition-colors'>
                <div className='flex gap-4'>
                  <Download className='w-6 h-6 text-primary flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-semibold text-lg mb-2'>
                      Multiple Exports
                    </h3>
                    <p className='text-muted-foreground'>
                      Export reports as HTML or PDF. Perfect for sharing with
                      teams and stakeholders.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className='p-6 border-2 hover:border-primary/50 transition-colors'>
                <div className='flex gap-4'>
                  <History className='w-6 h-6 text-primary flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-semibold text-lg mb-2'>
                      Check History
                    </h3>
                    <p className='text-muted-foreground'>
                      Remember all your checks and compare results over time to
                      track improvements.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className='p-6 border-2 hover:border-primary/50 transition-colors'>
                <div className='flex gap-4'>
                  <Shield className='w-6 h-6 text-primary flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-semibold text-lg mb-2'>
                      Secure & Private
                    </h3>
                    <p className='text-muted-foreground'>
                      Your data stays private. No tracking, no storage of scan
                      results without consent.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id='pricing' className='py-20 md:py-32 bg-muted/30'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                Pricing Plans
              </h2>
            </div>

            <div className='grid md:grid-cols-3 gap-6 items-start'>
              {/* Free Plan */}
              <Card className='p-8 border-2 flex flex-col h-full'>
                <div className='mb-6'>
                  <h3 className='text-2xl font-bold mb-2'>Free</h3>
                  <p className='text-muted-foreground mb-4'>
                    Perfect for getting started
                  </p>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-4xl font-bold'>$0</span>
                    <span className='text-muted-foreground'>/month</span>
                  </div>
                </div>

                <ul className='space-y-4 mb-8 flex-grow'>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Unlimited accessibility checks
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>HTML export</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Check history & comparison
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Open-source access
                    </span>
                  </li>
                </ul>

                <div className='space-y-3'>
                  <Button className='w-full'>Get Started</Button>
                  <a
                    href='https://github.com/placeholder/a11ycheck'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block'
                  >
                    <Button
                      variant='outline'
                      className='w-full gap-2 bg-transparent'
                    >
                      <GitHub className='w-4 h-4' />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className='p-8 border-2 flex flex-col h-full'>
                <div className='absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg' />
                <div className='mb-6'>
                  <h3 className='text-2xl font-bold mb-2'>Pro</h3>
                  <p className='text-muted-foreground mb-4'>
                    For professional developers
                  </p>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-4xl font-bold'>$9</span>
                    <span className='text-muted-foreground'>/month</span>
                  </div>
                </div>

                <ul className='space-y-4 mb-8 flex-grow'>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Everything in Free
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>PDF export</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Detailed reports
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Priority support
                    </span>
                  </li>
                </ul>

                <Button className='w-full'>Upgrade to Pro</Button>
              </Card>

              {/* Team Plan */}
              <Card className='p-8 border-2 flex flex-col h-full'>
                <div className='mb-6'>
                  <h3 className='text-2xl font-bold mb-2'>Team</h3>
                  <p className='text-muted-foreground mb-4'>
                    For teams and agencies
                  </p>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-4xl font-bold'>$29</span>
                    <span className='text-muted-foreground'>/month</span>
                  </div>
                </div>

                <ul className='space-y-4 mb-8 flex-grow'>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Everything in Pro
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Team collaboration
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>API access</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <CheckCircle2 className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      24/7 dedicated support
                    </span>
                  </li>
                </ul>

                <Button className='w-full'>Contact Sales</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id='contact' className='py-20 md:py-32'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                Get In Touch
              </h2>
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
              <form onSubmit={handleFormSubmit} className='space-y-6'>
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
        </section>
      </main>
      <Footer />
    </>
  );
}
