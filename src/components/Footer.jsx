import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors border-t border-blue-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SAVANI</h3>
            <p className="text-gray-400">
              Thời trang cao cấp dành cho phái đẹp
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Trang chủ</Link></li>
              <li><Link to="/san-pham" className="text-gray-400 hover:text-white">Sản phẩm</Link></li>
              <li><Link to="/gioi-thieu" className="text-gray-400 hover:text-white">Giới thiệu</Link></li>
              <li><Link to="/lien-he" className="text-gray-400 hover:text-white">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
              <li>Điện thoại: 0123 456 789</li>
              <li>Email: contact@savani.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SAVANI. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;