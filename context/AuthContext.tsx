// 'use client';
// import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { apiClient, LoginResponse } from '@/lib/api';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: any | null;
//   login: (phone: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   user: null,
//   login: async () => false,
//   logout: () => {},
//   loading: true,
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname();

//   // Initial auth check
//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       apiClient.setToken(token);
//       setIsAuthenticated(true);
//       // You can also fetch user profile here if needed
//     }
//     setLoading(false);
//   }, []);

//   // Token expired listener
//   useEffect(() => {
//     const handleExpired = () => {
//       setIsAuthenticated(false);
//       setUser(null);
//       router.push('/login');
//     };

//     window.addEventListener('token-expired', handleExpired);
//     return () => window.removeEventListener('token-expired', handleExpired);
//   }, [router]);

//   // Protected routing logic
//   useEffect(() => {
//     if (loading) return;

//     if (!isAuthenticated && pathname !== '/login') {
//       router.replace('/login');        // Use replace instead of push
//     } else if (isAuthenticated && pathname === '/login') {
//       router.replace('/');
//     }
//   }, [isAuthenticated, pathname, router, loading]);

//   const login = async (phone: string, password: string): Promise<boolean> => {
//     try {
//       const response: LoginResponse = await apiClient.login(phone, password);

//       if (response.token) {
//         apiClient.setToken(response.token);
//         setIsAuthenticated(true);
//         setUser({
//           fullName: response.fullName || 'Admin User',
//           phone,
//           roles: '',
//         });
//         router.replace('/'); // Use replace
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     apiClient.clearToken();
//     setIsAuthenticated(false);
//     setUser(null);
//     router.replace('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient, LoginResponse } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Initial auth check
  // Initial auth check
  useEffect(() => {
    // Force clear state and redirect to login on initial load
    // Remove the token from localStorage to ensure a clean state
    localStorage.removeItem('adminToken');
    apiClient.clearToken();
    
    setIsAuthenticated(false);
    setLoading(false);
    
    // Optional: If you want to be absolutely sure they are at /login
    if (window.location.pathname !== '/login') {
      router.replace('/login');
    }
  }, []);


  // Protected routing logic
  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.replace('/');
    }
  }, [isAuthenticated, pathname, router, loading]);

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await apiClient.login(phone, password);

      if (response.token) {
        apiClient.setToken(response.token);
        setIsAuthenticated(true);
        setUser({
          fullName: response.fullName || 'Admin User',
          phone,
          roles: '',
        });
        router.replace('/');
        return true;
      }
      return false;
    } catch (error: any) {
      // Log it for debugging
      console.error('Login failed:', error);
      
      // IMPORTANT: Rethrow the error so the UI catch block receives it
      throw error; 
    }
  };


  const logout = () => {
    apiClient.clearToken();
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);