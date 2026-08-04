

// 'use client';
// import { usePathname } from 'next/navigation';
// import { AuthProvider, useAuth } from "@/context/AuthContext";
// import { Sidebar } from "@/components/Sidebar";
// import "./globals.css";

// function AppContent({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const { loading, isAuthenticated } = useAuth();

//   const isLoginPage = pathname === '/login';

//   // 1. Still determining auth status
//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-950">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-400 text-sm">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // 2. Not logged in → ONLY show login page
//   if (!isAuthenticated) {
//     if (isLoginPage) {
//       return <div className="min-h-screen bg-slate-950">{children}</div>;
//     }
//     // Force redirect (extra safety)
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-950">
//         <div className="text-slate-400">Redirecting to login...</div>
//       </div>
//     );
//   }

//   // 3. Logged in → show app
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {!isLoginPage && <Sidebar />}
//       <main className="flex-1 overflow-auto bg-slate-50">
//         {children}
//       </main>
//     </div>
//   );
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <AuthProvider>
//           <AppContent>{children}</AppContent>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


'use client';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, isAuthenticated } = useAuth();

  const isLoginPage = pathname === '/login';

  // 1. Still determining auth status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in → ONLY show login page
  if (!isAuthenticated) {
    if (isLoginPage) {
      return <div className="min-h-screen bg-slate-950">{children}</div>;
    }
    // Force redirect (extra safety)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Redirecting to login...</div>
      </div>
    );
  }

  // 3. Logged in → show app
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}