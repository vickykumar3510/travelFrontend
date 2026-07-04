import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import AiPlanner from './pages/AiPlanner.jsx';
import Favourites from './pages/Favourites.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Orders from './pages/Orders.jsx';
import { FavouritesProvider } from './context/FavouritesContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/destination',
        element: <Destinations />
      },
      {
        path: '/favourites',
        element: <Favourites />
      },
      {
        path: '/orders',
        element: <Orders />
      },
      {
        path: '/aiplanner',
        element: <AiPlanner />
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <AuthProvider>
    <FavouritesProvider>
    <OrdersProvider>
      <Toaster
        position="top-right"
        containerClassName="app-toaster"
        toastOptions={{ duration: 2000 }}
      />
      <RouterProvider router={router} />
    </OrdersProvider>
    </FavouritesProvider>
    </AuthProvider>
  </StrictMode>,
)
