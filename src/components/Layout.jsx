import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Sidebar />
      <Header />
      <main className="md:ml-64 mt-16 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
