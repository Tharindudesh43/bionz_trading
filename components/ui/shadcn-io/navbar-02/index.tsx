'use client';


import * as React from 'react';
import logoSrc from "@/public/logo.png"; 
import Image from "next/image";
import {useRouter} from "next/navigation";
import { useEffect, useState, useRef } from 'react';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { useDispatch } from "react-redux";
import { clearUser } from "@/src/store/userSlice";


// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <div className="w-25 h-25 relative">
      <Image
        src={logoSrc}
        alt="Logo"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};


interface HamburgerIconProps extends React.SVGAttributes<SVGElement> {
  size?: number; // optional size prop
}


const HamburgerIcon = ({ size = 40, className, ...props }: HamburgerIconProps) => (
  <svg
    className={cn('pointer-events-none text-zinc-500', className)}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

export default HamburgerIcon;


// Types
export interface Navbar02NavItem {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: 'description' | 'simple' | 'icon';
  items?: Array<{
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
}

export interface Navbar02Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar02NavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar02NavItem[] = [
 { href: '/', label: 'Home' },
  {
    label: 'Courses',
    submenu: false,
    type: 'description',
    items: [
      {
        href: '#components',
        label: 'Components',
        description: 'Browse all components in the library.',
      },
      {
        href: '#documentation',
        label: 'Documentation',
        description: 'Learn how to use the library.',
      },
      {
        href: '#templates',
        label: 'Templates',
        description: 'Pre-built layouts for common use cases.',
      },
    ],
  },
  {
    label: 'News',
    submenu: false,
    href: '/news',
  },
  {
  label: 'Signals',
  submenu: false,
  type: 'icon',
  href: '/signals',
  },
   {
  label: 'Admin',
  submenu: false,
  type: 'icon',
  href: '/admin',
  }, {
  label: 'MarketCap',
  submenu: false,
  type: 'icon',
  href: '/marketcap',
  },
{
  label: 'Tips',
  submenu: false,
  type: 'icon',
  items: [
    { href: '/privacy-policy', label: 'Privacy Policy', icon: 'ShieldCheckIcon' }, // Privacy/security
    { href: '/about-us', label: 'About Us', icon: 'UserGroupIcon' },               // About the team/company
  ],
},
{ href: '/analyze', label: 'Analyze' },
];

export const Navbar02 = React.forwardRef<HTMLElement, Navbar02Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      signInText = 'My Account',
      signInHref = '#signin',
      ctaText = 'Register',
      ctaHref = '#get-started',
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const dispatch = useDispatch();


    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
          if(window.scrollY > 20){
            setIsScrolled(true);
          }else{
            setIsScrolled(false);
          }
      }
       window.addEventListener("scroll", handleScroll);
       return () => window.removeEventListener("scroll", handleScroll);
    }, []);


async function signOutUser(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include", // IMPORTANT!
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    console.log("Signed out successfully");

    // Clear Redux user data
    dispatch(clearUser());

    // Redirect if you want
    // router.push("/");
  } catch (err) {
    console.error("Sign out failed:", err);
  }
}



    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    const renderIcon = (iconName: string) => {
      switch (iconName) {
        case 'BookOpenIcon':
          return <BookOpenIcon size={16} className="text-foreground opacity-60" aria-hidden={true} />;
        case 'LifeBuoyIcon':
          return <LifeBuoyIcon size={16} className="text-foreground opacity-60" aria-hidden={true} />;
        case 'InfoIcon':
          return <InfoIcon size={16} className="text-foreground opacity-60" aria-hidden={true} />;
        default:
          return null;
      }
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
    `sticky top-0 z-50 w-full transition-all duration-300 
     bg-[#302F2F] backdrop-blur-md shadow-lg
     px-4 md:px-4`,
    className
  )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          {link.submenu ? (
                            <>
                              <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                                {link.label}
                              </div>
                              <ul>
                                {link.items?.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <button
                                      onClick={(e) => e.preventDefault()}
                                      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                                    >
                                      {item.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <button
                              onClick={(e) => e.preventDefault()}
                              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                            >
                              {link.label}
                            </button>
                          )}
                          {/* Add separator between different types of items */}
                          {index < navigationLinks.length - 1 &&
                            ((!link.submenu && navigationLinks[index + 1].submenu) ||
                              (link.submenu && !navigationLinks[index + 1].submenu) ||
                              (link.submenu &&
                                navigationLinks[index + 1].submenu &&
                                link.type !== navigationLinks[index + 1].type)) && (
                              <div
                                role="separator"
                                aria-orientation="horizontal"
                                className="bg-border -mx-1 my-1 h-px w-full"
                              />
                            )}
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
          
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">
                  {logo}
                </div>
                {/* <span className="hidden font-bold text-xl sm:inline-block">shadcn.io</span> */}
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex ">
                  <NavigationMenuList className="gap-1">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger>
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {link.type === 'description' && link.label === 'Courses' ? (
                            <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <div className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <button
                                    onClick={(e) => e.preventDefault()}
                                    className="flex h-full w-full select-none flex-col justify-center items-center text-center rounded-md  from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md cursor-pointer"
                                  >
                                    <div className="mb-3 text-xl font-medium">
                                      shadcn.io
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                      Beautifully designed components built with Radix UI and Tailwind CSS.
                                    </p>
                                  </button>
                                </NavigationMenuLink>
                              </div>
                              {link.items?.map((item, itemIndex) => (
                                <ListItem
                                  key={itemIndex}
                                  title={item.label}
                                  href={item.href}
                                  type={link.type}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </div>
                          ) : link.type === 'simple' ? (
                            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {link.items?.map((item, itemIndex) => (
                                <ListItem
                                  key={itemIndex}
                                  title={item.label}
                                  href={item.href}
                                  type={link.type}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </div>
                          ) : link.type === 'icon' ? (
                            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {link.items?.map((item, itemIndex) => (
                                <ListItem
                                  key={itemIndex}
                                  title={item.label}
                                  href={item.href}
                                  icon={item.icon}
                                  type={link.type}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </div>
                          ) : (
                            <div className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {link.items?.map((item, itemIndex) => (
                                <ListItem
                                  key={itemIndex}
                                  title={item.label}
                                  href={item.href}
                                  type={link.type}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </div>
                          )}
                        </NavigationMenuContent>
                      </>
                      ) : (
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(navigationMenuTriggerStyle(), 'cursor-pointer hover:bg-white/10')}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.href) {
                            window.location.href = link.href;
                          }
                        }}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
                </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
         <Button
             variant="ghost"
              size="sm"
              className="font-bold bg-white text-blue-950 border-3 border-blue-950  hover:bg-black cursor-pointer hover:text-white  px-4 h-9 rounded-4xl shadow-sm transition-colors"
              // className="text-sm cursor-pointer text-white font-medium rounded-full p-4 cusor border border-gray-500 hover:bg-white hover:text-black transition-colors"
               onClick={() => { window.location.href = '/authentication'; }}
            >
          {signInText}
          </Button>

{/* 
        {
          user ?   */}
           <Button
              size="sm"
              className="font-bold bg-blue-950 text-white border-3 border-blue-950 hover:bg-white cursor-pointer hover:text-black px-4 h-9 rounded-4xl shadow-sm transition-colors"
              // className="text-sm hover:bg-white cursor-pointer hover:text-black font-medium px-4 h-9 rounded-4xl shadow-sm"
              onClick={signOutUser}>
              LOG OUT
            </Button>
            {/* : (null) */}
        {/* }       */}
         

{/* 
            <Button
              size="sm"
              className="text-sm hover:bg-white cursor-pointer hover:text-black font-medium px-4 h-9 rounded-4xl shadow-sm"
              onClick={(e) => {
              e.preventDefault();
              
              }}
            >
              {ctaText}
            </Button> */}
          </div>
        </div>
      </header>
    );
  }
);

Navbar02.displayName = 'Navbar02';

// ListItem component for navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
    href?: string;
    icon?: string;
    type?: 'description' | 'simple' | 'icon';
    children?: React.ReactNode;
  }
>(({ className, title, children, icon, type, ...props }, ref) => {
  const renderIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    switch (iconName) {
      case 'BookOpenIcon':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'LifeBuoyIcon':
        return <LifeBuoyIcon className="h-5 w-5" />;
      case 'InfoIcon':
        return <InfoIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        onClick={(e) => e.preventDefault()}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer',
          className
        )}
        {...props}
      >
        {type === 'icon' && icon ? (
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              {renderIconComponent(icon)}
            </div>
            <div className="space-y-1">
              <div className="text-base font-medium leading-tight">{title}</div>
              {children && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-base font-medium leading-none">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </>
        )}
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = 'ListItem';

export { Logo, HamburgerIcon };

