import { Sparkles, Award, Users, TrendingUp } from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-[65px]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Thương hiệu thời trang cao cấp #1 Việt Nam
            </div>
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6">
              SAVANI
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nơi phong cách gặp gỡ đẳng cấp, tạo nên những khoảnh khắc thời trang đáng nhớ cho phái đẹp
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Câu chuyện của chúng tôi
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
            <p className="text-lg text-gray-700 leading-relaxed">
              SAVANI là thương hiệu thời trang cao cấp hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm thời trang dành cho phái đẹp.
              Với sứ mệnh mang đến những bộ trang phục đẳng cấp và phong cách, SAVANI luôn không ngừng sáng tạo và cập nhật xu hướng thời trang mới nhất.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Chúng tôi tự hào về chất lượng sản phẩm và dịch vụ khách hàng xuất sắc,
              cùng với đội ngũ nhân viên chuyên nghiệp luôn sẵn sàng tư vấn và hỗ trợ quý khách hàng.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl transform rotate-6"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tầm nhìn</h3>
                <p className="text-gray-600">
                  Trở thành biểu tượng thời trang hàng đầu, định hình phong cách cho phụ nữ Việt Nam hiện đại
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất lượng cao cấp</h3>
              <p className="text-gray-600 leading-relaxed">
                Mỗi sản phẩm được tuyển chọn kỹ lưỡng với chất liệu cao cấp và công nghệ may đột phá
              </p>
            </div>
          </div>

          <div className="group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Xu hướng mới nhất</h3>
              <p className="text-gray-600 leading-relaxed">
                Luôn cập nhật những xu hướng thời trang quốc tế và tạo ra phong cách riêng biệt
              </p>
            </div>
          </div>

          <div className="group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dịch vụ tận tâm</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ tư vấn chuyên nghiệp, hiểu rõ nhu cầu và phong cách của từng khách hàng
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Khám phá bộ sưu tập mới nhất
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Hãy để SAVANI đồng hành cùng bạn trong hành trình tạo nên phong cách thời trang độc đáo và đẳng cấp
            </p>
            <button className="bg-white text-rose-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Xem bộ sưu tập →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;