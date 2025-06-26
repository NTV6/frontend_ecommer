import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '../lib/firebase';
import { setUser } from '../store/authSlice';
import { authService } from '../services/api';
import { validatePhoneNumber } from '../utils';
import InputField from '../components/InputField';

function Auth() {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);
    setError(null);

    try {
      if (!isLogin && phoneNumber) {
        const { isValid, message } = validatePhoneNumber(phoneNumber);
        if (!isValid) {
          throw new Error(message);
        }
      }

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

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }

    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra';
      console.error('Auth error:', error);
      setError(error.message);
      toast.error(error.message);
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

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Lấy token từ user đã đăng nhập
      const token = await user.getIdToken();

      // Gửi thông tin lên server
      await authService.signup({
        token,
        full_name: user.displayName,
        email: user.email,
        phone_number: '',
        address: '',
        date_of_birth: '',
        profile_picture: user.photoURL
      });

      const response = await authService.getProfile();
      const userRole = response.data.data.role;

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        role: userRole,
        isAdmin: userRole === 'admin'
      }));

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (error) {
      let errorMessage = 'Đăng nhập Facebook thất bại';
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Email này đã được sử dụng với phương thức đăng nhập khác';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Lấy token từ user đã đăng nhập
      const token = await user.getIdToken();

      // Gửi thông tin lên server
      await authService.signup({
        token,
        full_name: user.displayName,
        email: user.email,
        phone_number: '',
        address: '',
        date_of_birth: '',
        profile_picture: user.photoURL
      });

      const response = await authService.getProfile();
      const userRole = response.data.data.role;

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        role: userRole,
        isAdmin: userRole === 'admin'
      }));

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (error) {
      let errorMessage = 'Đăng nhập Google thất bại';
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Email này đã được sử dụng với phương thức đăng nhập khác';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-950 dark:from-gray-950 dark:to-gray-100 py-16 px-4 sm:px-6 lg:px-8 mt-[65px]">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl transition duration-300">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isForgotPassword ? 'Quên mật khẩu' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </h2>
        </div>

        <form className="space-y-5" onSubmit={isForgotPassword ? handleForgotPassword : handleAuth}>
          <div className="space-y-3">
            <InputField
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-2"
            />

            {!isForgotPassword && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <HiEye className="w-5 h-5 text-gray-500 mt-1" /> : <HiEyeOff className="w-5 h-5 text-gray-500 mt-1" />}
                </button>
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <>
                <InputField
                  placeholder="Họ và tên"
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <InputField
                  placeholder="Số điện thoại"
                  type="tel"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <InputField
                  placeholder="Ngày sinh"
                  type="date"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <InputField
                  placeholder="Địa chỉ"
                  type="textarea"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
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

          {isLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loading}
                  className="w-1/2 flex items-center justify-center gap-2 py-2 px-4 bg-[#1877F2] hover:bg-[#0C63D4] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <FaFacebook className="w-7 h-7" />
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-1/2 flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <FcGoogle className="w-7 h-7" />
                  Google
                </button>
              </div>
            </>
          )}

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