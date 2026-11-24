'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors shadow-xs"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'candidate' && (
                      <>
                        <Link
                          href="/candidate/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>📊</span> Dashboard
                        </Link>
                        <Link
                          href="/candidate/saved"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>🔖</span> Saved Jobs
                        </Link>
                        <Link
                          href="/candidate/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>👤</span> My Profile
                        </Link>
                      </>
                    )}

                    {user.role === 'employer' && (
                      <>
                        <Link
                          href="/employer/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>📊</span> Dashboard
                        </Link>
                        <Link
                          href="/employer/jobs/new"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>➕</span> Post a Job
                        </Link>
                        <Link
                          href="/employer/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>🏢</span> Company Profile
                        </Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <span>🛡️</span> Admin Console
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <span>🚪</span> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={
                      user.role === 'candidate'
                        ? '/candidate/dashboard'
                        : user.role === 'employer'
                        ? '/employer/dashboard'
                        : '/admin'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600"
                  >
                    Go to Dashboard ({user.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
