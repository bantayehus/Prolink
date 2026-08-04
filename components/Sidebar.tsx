
// 'use client';
// import { useState } from 'react';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Package, 
//   ShoppingCart, 
//   UserCheck, 
//   Settings, 
//   LogOut, 
//   ChevronLeft, 
//   ChevronRight,
//   Briefcase ,
//   MessageSquare  // ← New icon for Services
// } from 'lucide-react';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';

// const menuItems = [
//   { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
//   { name: 'Providers', icon: UserCheck, href: '/providers' },
//   { name: 'Customers', icon: Users, href: '/customers' },
//   { name: 'Categories', icon: Package, href: '/categories' },
//   { name: 'Services', icon: Briefcase, href: '/services' },     // ← Fixed
//   { name: 'Orders', icon: ShoppingCart, href: '/orders' },
//   { name: 'Feedbacks', icon: MessageSquare, href: '/feedbacks' },   // ← Added

// ];

// export function Sidebar() {
//   const pathname = usePathname();
//   const [collapsed, setCollapsed] = useState(false);
//   const { logout } = useAuth();

//   return (
//     <aside 
//       className={`bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800/80 shadow-2xl transition-all duration-500 ease-in-out ${collapsed ? 'w-20' : 'w-72'}`}
//     >
//       {/* Logo Area */}
//       <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
//         <div className="flex items-center gap-3 overflow-hidden">
//           <div className="w-10 h-10 bg-gradient-to-br from-teal-400 via-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 relative">
//             <span className="text-slate-950 font-black text-2xl tracking-tighter">P</span>
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
//           </div>
//           {!collapsed && (
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tighter">
//                 Prolink
//               </h1>
//               <p className="text-[10px] text-slate-500 -mt-1 font-medium tracking-[2px]">ADMIN PORTAL</p>
//             </div>
//           )}
//         </div>
        
//         <button 
//           onClick={() => setCollapsed(!collapsed)} 
//           className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all duration-200"
//         >
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-8 space-y-2">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
//                 isActive 
//                   ? 'bg-teal-500/10 text-teal-300 shadow-inner shadow-teal-500/20' 
//                   : 'hover:bg-slate-800/80 hover:text-white'
//               }`}
//             >
//               {/* Active indicator */}
//               {isActive && (
//                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-teal-400 rounded-r-full" />
//               )}
              
//               <div className={`p-1 rounded-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
//                 <item.icon 
//                   size={22} 
//                   className={isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'} 
//                 />
//               </div>
              
//               {!collapsed && (
//                 <span className="font-semibold text-sm tracking-wide">{item.name}</span>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Section */}
//       <div className="p-5 border-t border-slate-800/80 mt-auto">
//         <button 
//           onClick={logout} 
//           className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all duration-200 group"
//         >
//           <div className="p-1 rounded-xl group-hover:rotate-12 transition-transform">
//             <LogOut size={20} />
//           </div>
//           {!collapsed && <span className="font-semibold text-sm">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }

'use client';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Providers', icon: UserCheck, href: '/providers' },
  { name: 'Customers', icon: Users, href: '/customers' },
  { name: 'Categories', icon: Package, href: '/categories' },
  { name: 'Services', icon: Briefcase, href: '/services' },
  { name: 'Orders', icon: ShoppingCart, href: '/orders' },
  { name: 'Feedbacks', icon: MessageSquare, href: '/feedbacks' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 h-screen flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">P</span>
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-white font-semibold text-sm leading-tight truncate">
              Prolink Admin
            </h1>
            <p className="text-[11px] text-slate-500 truncate">Management Portal</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}