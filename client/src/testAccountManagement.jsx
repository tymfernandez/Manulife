import React, { useState } from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import AccountManagement from './AccountManagement/accountManagement';

const TestAccountManagement = () => {
  const [activeItem, setActiveItem] = useState('accounts');

  return (
    <div className="min-h-screen">
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1">
          {activeItem === 'accounts' && <AccountManagement />}
          {activeItem !== 'accounts' && (
            <div className="bg-gray-100 min-h-screen p-6">
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">{activeItem}</h1>
              <p className="text-gray-600 mt-2">This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TestAccountManagement;