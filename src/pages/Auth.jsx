import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '../lib/firebase';
import { setUser } from '../store/authSlice';
import { authService } from '../services/api';
import InputField from '../components/InputField';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || '/';

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      // Lấy token từ user đã đăng nhập
      const token = await user.getIdToken();

      // Nếu là đăng ký, gửi thông tin lên server
      if (!isLogin) {
        await authService.signup({
          token,
          full_name: fullName, // Tạm thời lấy phần trước @ làm tên
          email: user.email,
          phone_number: phoneNumber,
          address: address,
          date_of_birth: dateOfBirth,
          profile_picture: ''
        });
      }
      const response = await authService.getProfile();
      const userRole = response.data.data.role;
      console.log(" handleAuth userRole", userRole)

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        role: userRole,
        isAdmin: userRole === 'admin'
      }));

      // Redirect to the page they were trying to access, or admin panel for admin users
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email đã được sử dụng';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email đặt lại mật khẩu đã được gửi');
      setIsForgotPassword(false);
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8 mt-[74px]">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition duration-300">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isForgotPassword ? 'Quên mật khẩu' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={isForgotPassword ? handleForgotPassword : handleAuth}>
          <div className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <>
                <InputField type="text" placeholder="Họ và tên" value={fullName} onChange={setFullName} />
                <InputField type="tel" placeholder="Số điện thoại" value={phoneNumber} onChange={setPhoneNumber} />
                <InputField type="text" placeholder="Địa chỉ" value={address} onChange={setAddress} />
                <InputField type="date" value={dateOfBirth} onChange={setDateOfBirth} />
              </>
            )}

            <InputField type="email" placeholder="Email" value={email} onChange={setEmail} />

            {!isForgotPassword && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <HiEye className="w-5 h-5 text-gray-500" /> : <HiEyeOff className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : (isForgotPassword ? 'Gửi email đặt lại mật khẩu' : (isLogin ? 'Đăng nhập' : 'Đăng ký'))}
          </button>

          <div className="flex flex-col items-center space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {!isForgotPassword && (
              <button onClick={() => setIsLogin(!isLogin)} type="button" className="hover:underline">
                {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            )}
            {isLogin && !isForgotPassword && (
              <button onClick={() => setIsForgotPassword(true)} type="button" className="hover:underline">
                Quên mật khẩu?
              </button>
            )}
            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} type="button" className="hover:underline">
                Quay lại đăng nhập
              </button>
            )}
          </div>
        </form>
      </div>
    </div>

  );
}

export default Auth;