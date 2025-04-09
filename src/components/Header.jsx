import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { clearUser } from '../store/authSlice';
import ThemeToggle from './ThemeToggle';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const inputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      inputRef.current.focus();
    }
  };

  const getInitials = (email) => {
    return email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();
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
            <Link to="/san-pham" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Sản phẩm
            </Link>
            <Link to="/gioi-thieu" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Giới thiệu
            </Link>
            <Link to="/lien-he" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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

            <Link to="/gio-hang" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative">
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
                <div className="absolute right-0 mt-0 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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