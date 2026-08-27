import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'employee';

  const navLinks = {
    employee: [
      { name: 'Home', path: '/' },
      { name: 'My Tasks', path: '/my-tasks' },
      { name: 'Profile Page', path: '/profile' },
    ],
    team_manager: [
      { name: 'Home', path: '/' },
      { name: 'My Tasks', path: '/my-tasks' },
      { name: 'Assign Tasks', path: '/assign-tasks' },
      { name: 'Review Table', path: '/review-table' },
      { name: 'Profile Page', path: '/profile' },
    ],
    department_manager: [
      { name: 'Home', path: '/' },
      { name: 'Assign Tasks', path: '/assign-tasks' },
      { name: 'Review Table', path: '/review-table' },
      { name: 'Profile Page', path: '/profile' },
    ],
    hr_manager: [
      { name: 'Home', path: '/' },
      { name: 'Company Archive', path: '/company-archive' },
      { name: 'Profile Page', path: '/profile' },
    ]
  };

  const links = navLinks[role] || navLinks.employee;

  return (
    <div className="h-full py-6 flex flex-col">
      {/* Spacer for TopNavbar alignment if needed, but usually logo is in topnav. 
          In the design, the logo is actually in the top left, spanning the sidebar area. 
          We'll add a placeholder block or let the TopNav handle it. */}
      <div className="h-16 hidden">Logo Space</div> 
      
      <nav className="flex-1 px-4 space-y-2 mt-8">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-amber-500 text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
