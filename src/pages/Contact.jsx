import { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle, Clock, Instagram, Facebook } from 'lucide-react';
import InputField from '../components/InputField';

function Contact() {
  const [formData, setFormData] = useState({
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen pt-[65px]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Liên hệ với SAVANI
          </h2>
          <p className="opacity-90 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy kết nối với chúng tôi ngay hôm nay!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-blue-900 h-fit">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Thông tin liên hệ
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Địa chỉ showroom</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Đường ABC, Quận 1, TP.HCM</p>
                    <p className="text-gray-600 dark:text-gray-400">Tầng 2-3, Building Fashion Center</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hotline</h3>
                    <p className="text-gray-600 dark:text-gray-400">0123 456 789</p>
                    <p className="text-gray-600 dark:text-gray-400">1900 1234 (miễn phí)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">contact@savani.com</p>
                    <p className="text-gray-600 dark:text-gray-400">support@savani.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                    <p className="text-gray-600 dark:text-gray-400">Thứ 2 - Thứ 7: 9:00 - 21:00</p>
                    <p className="text-gray-600 dark:text-gray-400">Chủ nhật: 10:00 - 20:00</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-pink-100 hover:bg-pink-200 rounded-lg flex items-center justify-center transition-colors">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-blue-900">
              <h2 className="text-2xl font-bold mb-2">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Tin nhắn *"
                  placeholder=""
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  type="textarea"
                  rows={3}
                  required
                />

                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi tin nhắn
                </button>
              </form>
            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-2xl p-6 border border-blue-100 dark:border-blue-900 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Tư vấn miễn phí</h3>
                <p className="opacity-90">
                  Đội ngũ stylist chuyên nghiệp sẽ tư vấn phong cách phù hợp nhất cho bạn
                </p>
              </div>

              <div className="rounded-2xl p-6 border border-blue-100 dark:border-blue-900 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Dịch vụ VIP</h3>
                <p className="opacity-90">
                  Trải nghiệm mua sắm riêng tư với dịch vụ chăm sóc khách hàng đặc biệt
                </p>
              </div>

              <div className="rounded-2xl p-6 border border-blue-100 dark:border-blue-900 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Chính sách đổi trả linh hoạt</h3>
                <p className="opacity-90">
                  Đổi trả sản phẩm dễ dàng trong vòng 7 ngày nếu bạn không hoàn toàn hài lòng
                </p>
              </div>

              <div className="rounded-2xl p-6 border border-blue-100 dark:border-blue-900 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Giao hàng nhanh chóng</h3>
                <p className="opacity-90">
                  Đơn hàng sẽ được xử lý và giao đến tận tay bạn chỉ trong 1–3 ngày làm việc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section Placeholder */}
      <div className="bg-gray-50 dark:bg-black py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Vị trí showroom
          </h2>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl p-4">
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <iframe
                title="Bản đồ showroom SAVANI"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4611.322519227983!2d105.76402637599145!3d21.033876887601473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0bf0f1742f%3A0xe820ab53e8c05841!2zS8O9IFTDumMgWMOhIE3hu7kgxJDDrG5o!5e1!3m2!1svi!2sus!4v1759949692714!5m2!1svi!2sus"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[450px] rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;