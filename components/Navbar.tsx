"use client";

import StaggeredMenu from './StaggeredMenu';

export default function Navbar() {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home', link: '/' },
    { label: 'Events', ariaLabel: 'View events', link: '/events' },
    { label: 'About', ariaLabel: 'About Us', link: '/about' },
    { label: 'Contact', ariaLabel: 'Contact Us', link: '/contact' },
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/hackathon-hub-nsbm/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/hackathon-hub-nsbm/' },
  ];

  return (
    <div className="fixed top-0 w-full z-[100]">
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={menuItems}
        socialItems={socialItems}
        colors={['#000000', '#0a0a0a', '#111111']} 
        accentColor="#00ad37"
        menuButtonColor="#ffffff"
        openMenuButtonColor="#000000"
        logoUrl="/hhlogo.png"
        changeMenuColorOnOpen={true}
      />
    </div>
  );
}