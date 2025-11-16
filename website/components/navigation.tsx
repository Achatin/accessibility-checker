'use client';

import { Link } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className='border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <button
            onClick={() => scrollToSection('home')}
            className='flex items-center gap-3 font-bold text-2xl hover:opacity-80 transition-opacity'
          >
            <div>
              <span className='text-primary'>Feams</span>Check
            </div>
            <Image
              src='/logo.svg'
              alt='FeamsCheck Logo'
              width={40}
              height={40}
            />
          </button>

          <div className='hidden md:flex items-center gap-14'>
            <a
              href='#home'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Home
            </a>
            <a
              href='#pricing'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Pricing
            </a>
            <a
              href='#contact'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Contact
            </a>
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <button
              onClick={() => scrollToSection('checker')}
              className='inline-flex items-center justify-center px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
            >
              Start Checking
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
