import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './lib/firebase';
import { authService } from './services/api';
import { setUser, clearUser } from './store/authSlice';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/Admin/HomeAdmin';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CategoryProducts from './pages/CategoryProducts';

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Lấy thông tin profile để có role
          const response = await authService.getProfile();
          const userRole = response.data.data.role;

          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            role: userRole,
            isAdmin: userRole === 'admin'
          }));
        } catch (error) {
          console.error('Error fetching user role:', error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: "74px" }}
        />
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/category/:id" element={<CategoryProducts />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;