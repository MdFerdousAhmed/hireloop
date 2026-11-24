'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

export default function DashboardLayout({ children, role = 'candidate', activeTab }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const candidateNav = [
    { label: 'Dashboard', href: '/candidate/dashboard', icon: '📊' },
    { label: 'My Profile', href: '/candidate/profile', icon: '👤' },
    { label: 'My Applications', href: '/candidate/dashboard#applications', icon: '📄' },
    { label: 'Saved Jobs', href: '/candidate/saved', icon: '🔖' },
    { label: 'My Resume', href: '/candidate/profile', icon: '📝' },
    { label: 'Settings', href: '/candidate/profile', icon: '⚙️' },
  ];

  const employerNav = [
    { label: 'Dashboard', href: '/employer/dashboard', icon: '📊' },
    { label: 'My Company', href: '/employer/profile', icon: '🏢' },
    { label: 'Post a Job', href: '/employer/jobs/new', icon: '➕' },
    { label: 'Manage Jobs', href: '/employer/dashboard#jobs', icon: '📋' },
    { label: 'Applicants', href: '/employer/dashboard#applicants', icon: '👥' },
    { label: 'Settings', href: '/employer/profile', icon: '⚙️' },
  ];

  const adminNav = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Manage Users', href: '/admin#users', icon: '👥' },
    { label: 'Manage Jobs', href: '/admin#jobs', icon: '📋' },
    { label: 'Moderation', href: '/admin#moderation', icon: '🛡️' },
    { label: 'Reports', href: '/admin#reports', icon: '📈' },
    { label: 'Settings', href: '/admin#settings', icon: '⚙️' },
  ];

  const navItems = role === 'employer' ? employerNav : role === 'admin' ? adminNav : candidateNav;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 flex-shrink-0 fixed inset-y-0 z-30">
        {/* Brand header */}
        <div className="h-18 px-6 flex items-center border-b border-gray-50">
          <Logo size="md" />
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab ? activeTab === item.label : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#eef2ff] text-[#4338ca] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-white flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <Logo size="md" />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                logout();
                setMobileSidebarOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-sm font-semibold text-gray-700 capitalize">
              {role} Space
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 rounded-full px-2 py-1">
              <span className="text-[11px] font-medium text-gray-500 pl-1">Role:</span>
              {[
                { r: 'candidate', href: '/candidate/dashboard' },
                { r: 'employer', href: '/employer/dashboard' },
                { r: 'admin', href: '/admin' }
              ].map(({ r, href }) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    router.push(href);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize transition-all ${
                    role === r
                      ? 'bg-[#4338ca] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2"></span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
