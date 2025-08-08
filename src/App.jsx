import { createBrowserRouter, RouterProvider } from "react-router-dom"
//import layout
import AdminLayout from "./layouts/AdminLayout"
import AuthLayout from "./layouts/AuthLayout"
import UserLayout from "./layouts/UserLayout"
//public pages
import HomePublicPage from "./pages/public/HomePublicPage"
import Cart from "./pages/public/CartPage"
import AboutStorePage from "./pages/public/AboutStorePage"
//admin pages
import Dashboard from "./pages/admin/DashboardPage"
import AddProduct from "./pages/admin/AddProduct"
import EditProduct from "./pages/admin/EditProduct"
import DetailProduct from "./pages/public/DetailProduct"
//auth pages
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import AdminProtectedPage from "./components/AdminCheck"
import AuthContextProvider from "./context/ProviderAuth"
//redux provider
import store from "./redux/store"
import { Provider } from "react-redux"
import CheckOutPage from "./pages/public/CheckOutPage"


const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <HomePublicPage />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'about',
        element: <AboutStorePage />
      },
      {
        path: 'checkout',
        element: <CheckOutPage/>
      }
    ],
  },

  {
    path: '/admin',
    element:
      <AdminProtectedPage>
        <AdminLayout />
      </AdminProtectedPage>
    ,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'add',
        element: <AddProduct />
      },
      {
        path: 'edit/:id',
        element: <EditProduct />
      },
      {
        path: 'detail/:id',
        element: <DetailProduct/>
      }
    ],
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
    ],
  },
]);

function App() {

  return (
    <>
      <AuthContextProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </AuthContextProvider>
    </>
  )
}

export default App
