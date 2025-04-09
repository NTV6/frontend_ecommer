import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
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
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          isAdmin: user.email === 'admin@example.com'
        }));
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
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/*"
            element={
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
                    <Route path="/danh-muc/:slug" element={<CategoryProducts />} />
                    <Route path="/thanh-toan" element={<Checkout />} />
                    <Route path="/thanh-toan/thanh-cong" element={<CheckoutSuccess />} />
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