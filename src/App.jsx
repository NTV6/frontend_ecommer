import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './lib/firebase';
import { authService } from './services/api';
import { setUser, clearUser } from './store/authSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Admin from './pages/Admin/HomeAdmin';
import Profile from './pages/Profile';

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
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/san-pham" element={<Products />} />
                  <Route path="/san-pham/:id" element={<ProductDetail />} />
                  <Route path="/gio-hang" element={<Cart />} />
                  <Route path="/gioi-thieu" element={<About />} />
                  <Route path="/lien-he" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/tim-kiem" element={<SearchResults />} />
                  <Route path="/danh-muc/:id" element={<CategoryProducts />} />
                  <Route path="/thanh-toan" element={<Checkout />} />
                  <Route path="/thanh-toan/thanh-cong" element={<CheckoutSuccess />} />
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