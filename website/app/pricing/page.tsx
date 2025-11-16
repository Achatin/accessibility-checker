'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Github as GitHub } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main className='min-h-screen'>
        <section className='py-20 md:py-32'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='text-center mb-16'>
              <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                Simple, Transparent Pricing
              </h1>
              <p className='text-lg text-muted-foreground'>
                Choose the plan that fits your needs
              </p>
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
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Unlimited accessibility checks
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>HTML export</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Check history & comparison
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Open-source access
                    </span>
                  </li>
                </ul>

                <div className='space-y-3'>
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
              <Card className='p-8 border-2 border-primary relative md:scale-105 flex flex-col h-full'>
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
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Everything in Free
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>PDF export</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Detailed reports
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
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
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Everything in Pro
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      Team collaboration
                    </span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>API access</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <Check className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>
                      24/7 dedicated support
                    </span>
                  </li>
                </ul>

                <Link href='/contact' className='block'>
                  <Button variant='outline' className='w-full bg-transparent'>
                    Contact Sales
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
