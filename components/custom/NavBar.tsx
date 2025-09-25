"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, CircleUserRound } from "lucide-react"; // Added CircleUserRound
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const hideNavbar = pathname?.includes("/quiz");

  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const { data: session } = useSession();
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Roadmaps", href: "/roadmaps" },
    { name: "My learning", href: "/my-learning" },
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "credits",
      href: "/credits",
    },
  ];

  const mainDesktopLinks = navLinks.filter((link) => link.name !== "credits");
  const creditsLink = navLinks.find((link) => link.name === "credits");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        root.classList.add("dark");
        setIsDark(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setIsDesktopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <>
      {hideNavbar ? null : (
        <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={"/"}>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Learnly
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {mainDesktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {session ? (
                <div className="relative" ref={desktopMenuRef}>
                  {/* --- MODIFIED: Avatar Button to trigger dropdown --- */}
                  <button
                    onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-muted overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <CircleUserRound className="h-8 w-8 text-muted-foreground" />
                    )}
                  </button>

                  {isDesktopMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-background border rounded-md shadow-lg py-1 z-50">
                      {creditsLink && (
                        <Link
                          href={creditsLink.href}
                          onClick={() => setIsDesktopMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          Credits
                        </Link>
                      )}
                      <div
                        onClick={toggleTheme}
                        className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                      >
                        <span>Toggle Theme</span>
                        {isDark ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setIsDesktopMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-destructive hover:bg-muted"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button onClick={() => signIn()}>Login</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    className="bg-stone-200 cursor-pointer dark:bg-stone-800"
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="md:hidden bg-background border-t flex flex-col gap-2 items-center border-border px-6 py-4 space-y-4"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="bg-stone-200 cursor-pointer dark:bg-stone-800"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                {session ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      signIn();
                    }}
                  >
                    Login
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}
    </>
  );
}
