import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { fetchCart, resetCart } from '../store/cartSlice';

import { auth } from '../lib/firebase';
import { getInitials } from '../utils';
import { clearUser } from '../store/authSlice';
import ThemeToggle from './ThemeToggle';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector((state) => state.carts.items);
  const { user } = useSelector((state) => state.auth);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(resetCart());
      dispatch(clearUser());
      navigate('/auth');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      inputRef.current.focus();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-950 dark:shadow-blue-300 shadow-md transition-colors fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-[42px]">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">SAVANI</Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Trang chủ
            </Link>
            <Link to="/product" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Sản phẩm
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Giới thiệu
            </Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
  focus:outline-none focus:border-gray-500 dark:focus:border-gray-400
  transition-all duration-300 ease-in-out
  bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-32 text-sm`} />

                <button
                  type="button"
                  onClick={handleSearch}
                  className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white absolute right-3`}>
                  <FaSearch size={16} />
                </button>
              </form>
            </div>

            <ThemeToggle />

            <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-900 dark:bg-gray-600 text-white rounded-full flex items-center justify-center">
                    {getInitials(user.email)}
                  </div>
                </button>
                {/* Added pt-2 for hover space and changed transition */}
                <div className="absolute right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 
      group-hover:visible transition-all duration-300 ease-in-out z-10">
                  <div className="bg-white dark:bg-gray-700 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                      {user.email}
                    </div>

                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Tài khoản của tôi
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <FaUser size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;