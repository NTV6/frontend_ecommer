function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 mt-[74px]">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Liên hệ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Thông tin liên hệ</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              <strong className="text-gray-900 dark:text-white">Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Điện thoại:</strong> 0123 456 789
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Email:</strong> contact@savani.com
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Gửi tin nhắn cho chúng tôi</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</label>
              <input
                type="text"
                id="name"
                className="mt-1 h-8 pl-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-gray-500 dark:focus:border-blue-300 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              />

            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 h-8 pl-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-gray-500 dark:focus:border-blue-300 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tin nhắn</label>
              <textarea
                id="message"
                rows="4"
                className="mt-1 pl-2 pt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-gray-500 dark:focus:border-blue-300 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gray-900 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-600"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;