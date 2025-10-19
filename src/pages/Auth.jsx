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
import AddressAutocomplete from '../components/AddressAutocomplete';

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

      const token = await user.getIdToken();

      try {
        if (!isLogin) {
          await authService.signup({
            token,
            full_name: fullName,
            email: user.email,
            phone_number: phoneNumber,
            address: address,
            date_of_birth: dateOfBirth,
            profile_picture: ''
          });
        }
      } catch (signupError) {
        // Nếu lỗi từ API signup
        if (signupError.response?.data?.message) {
          // Xóa tài khoản Firebase nếu đăng ký thất bại
          await user.delete();
          throw new Error(signupError.response.data.message);
        }
        throw signupError;
      }

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
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      console.error('Auth error:', error);
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
        case 'auth/invalid-credential':
          errorMessage = 'Đăng nhập thất bại';
          break;
        default:
          // Nếu là lỗi từ API của chúng ta
          errorMessage = error.message;
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

      const token = await user.getIdToken();

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
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 pt-[65px]">
      <div className="max-w-6xl mx-auto flex flex-1">
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
          {/* Fashion Images Grid */}
          <div className="relative z-10 flex flex-col justify-center items-center px-8 w-full">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=500&fit=crop"
                  alt="Fashion 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop"
                  alt="Fashion 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop"
                  alt="Fashion 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop"
                  alt="Fashion 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-5">
            <div>
              <h2 className="text-center text-4xl font-bold text-gray-900">
                {isForgotPassword ? 'Quên mật khẩu' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </h2>
              <p className="mt-3 text-center text-sm text-gray-700">
                {isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}
              </p>
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
                    <div className="flex gap-3">
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
                    </div>
                    <AddressAutocomplete
                      placeholder="Địa chỉ"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : (isForgotPassword ? 'Gửi email đặt lại mật khẩu' : (isLogin ? 'Đăng nhập' : 'Đăng ký'))}
              </button>

              {isLogin && (
                <>
                  <div className="relative">
                    {/* <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div> */}
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-gray-600">
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

              <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
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
      </div>
    </div>
  );
}

export default Auth;