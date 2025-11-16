'use client';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className='border-t bg-card/50 mt-16 md:mt-32'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 className='font-bold text-lg mb-4'>FeamsCheck</h3>
            <p className='text-muted-foreground text-sm'>
              Open-source accessibility checker for modern websites.
            </p>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Product</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Pricing
                </button>
              </li>
              <li>
                <a
                  href='https://github.com'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Company</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Contact
                </button>
              </li>
              <li>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Connect</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href='mailto:feams@check.com'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>&copy; 2025 FeamsCheck. Open source and freely available.</p>
        </div>
      </div>
    </footer>
  );
}
