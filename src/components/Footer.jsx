import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/product', label: 'Sản phẩm' },
    { to: '/about', label: 'Giới thiệu' },
    { to: '/contact', label: 'Liên hệ' }
  ];

  const customerService = [
    { to: '/privacy', label: 'Chính sách bảo mật' },
    { to: '/terms', label: 'Điều khoản sử dụng' },
    { to: '/shipping', label: 'Chính sách vận chuyển' },
    { to: '/return', label: 'Chính sách đổi trả' }
  ];

  const categories = [
    { to: '/category/dress', label: 'Váy đầm' },
    { to: '/category/tops', label: 'Áo blouse' },
    { to: '/category/pants', label: 'Quần tây' },
    { to: '/category/accessories', label: 'Phụ kiện' }
  ];

  const socialLinks = [
    { href: 'https://facebook.com/savani', icon: FaFacebook, label: 'Facebook', color: 'hover:text-blue-500' },
    { href: 'https://instagram.com/savani', icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-500' },
    { href: 'https://twitter.com/savani', icon: FaTwitter, label: 'Twitter', color: 'hover:text-blue-400' }
  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://specials-images.forbesimg.com/imageserve/661987c8e81ff4fa6d5d72cf/FO041624-001/1440x0.jpg?fit=scale")`, repeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'
          }}></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  SAVANI
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Thời trang cao cấp dành cho phái đẹp. Khám phá vẻ đẹp tinh tế và phong cách riêng của bạn cùng SAVANI.
                </p>

                {/* Newsletter Signup */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-white">Đăng ký nhận tin</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                      Đăng ký
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-white">Kết nối với chúng tôi</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`group relative p-3 bg-gray-800/50 rounded-full border border-gray-700 transition-all duration-300 hover:scale-110 hover:bg-gray-700/50 ${social.color}`}
                        aria-label={social.label}
                      >
                        <social.icon size={20} />
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          {social.label}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white relative">
                Liên kết nhanh
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white relative">
                Danh mục
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={category.to}
                      className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white relative">
                Liên hệ
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-300">
                  <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                  <span>123 Đường ABC, Quận 1, TP.HCM, Việt Nam</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <FaPhone className="text-green-400 flex-shrink-0" size={16} />
                  <span>0123 456 789</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <FaEnvelope className="text-purple-400 flex-shrink-0" size={16} />
                  <span>contact@savani.com</span>
                </li>
              </ul>

              {/* Customer Service */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold mb-3 text-gray-200">Hỗ trợ khách hàng</h5>
                <ul className="space-y-2">
                  {customerService.map((service, index) => (
                    <li key={index}>
                      <Link
                        to={service.to}
                        className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                      >
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 mt-12 pt-8">
            <div className="flex flex-col items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400">
                <span>&copy; 2024 SAVANI. Tất cả quyền được bảo lưu.</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-400">
                <span>Được tạo với</span>
                <FaHeart className="text-red-500 animate-pulse" size={14} />
                <span>tại Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-5 p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={16} />
        </button>
      )}
    </>
  );
}

export default Footer;