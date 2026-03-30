'use client';

// 1. Tambahkan import useEffect di sini
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSync } from 'react-icons/fa';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const VALID_EMAIL = '2889@gmail.com';
const VALID_PASSWORD = '241712889';

function generateCaptcha(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginChances, setLoginChances] = useState(3);
  
  // 2. Ubah inisialisasi state menjadi string kosong
  const [captcha, setCaptcha] = useState("");

  // 3. Tambahkan useEffect agar generate captcha hanya berjalan di sisi Client (Browser)
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captchaInput: '' }));
    setErrors(prev => ({ ...prev, captcha: undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginChances <= 0) {
      toast.error('Kesempatan login habis! Silakan reset terlebih dahulu.', {
        theme: 'dark',
        position: 'top-right',
      });
      return;
    }

    const newErrors: ErrorObject = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (formData.email !== VALID_EMAIL) {
      newErrors.email = `Email harus sesuai dengan NPM kamu (${VALID_EMAIL})`;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password !== VALID_PASSWORD) {
      newErrors.password = 'Password harus sesuai dengan NPM kamu';
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha tidak boleh kosong';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newChances = Math.max(0, loginChances - 1);
      setLoginChances(newChances);

      if (newChances === 0) {
        toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      } else {
        toast.error(`Login Gagal! Sisa kesempatan ${newChances}`, {
          theme: 'dark',
          position: 'top-right',
        });
      }
      refreshCaptcha(); // Opsional: refresh captcha setiap kali gagal login
      return;
    }

    // PERBAIKAN UTAMA: Gunakan localStorage dan key yang sama dengan Auth Guard di Home
    localStorage.setItem("isAuthenticated", "true");
    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    
    // PERBAIKAN: Beri sedikit delay agar localStorage tersimpan sempurna sebelum redirect
    setTimeout(() => {
      router.push('/home');
    }, 500);
  };

  const handleResetChances = () => {
    if (loginChances > 0) return;
    setLoginChances(3);
    setErrors({});
    refreshCaptcha();
    toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
  };

  const isSignInDisabled = loginChances <= 0;
  const isResetEnabled = loginChances <= 0;

  return (
    <AuthFromWrapper title="Login">
      <p className="text-center text-sm text-gray-500 -mt-6 mb-4">
        Sisa kesempatan: <span className="font-bold text-gray-700">{loginChances}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSignInDisabled}
            className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={isSignInDisabled}
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-blue-500 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={handleChange}
              disabled={isSignInDisabled}
              className="mr-2 h-4 w-4 rounded border-gray-300"
            />
            Ingat Saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Forgot Password?
          </Link>
        </div>

        {/* Captcha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded tracking-widest min-w-[100px] text-center">
              {captcha}
            </span>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh captcha"
            >
              <FaSync size={14} />
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            disabled={isSignInDisabled}
            className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isSignInDisabled}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-colors ${
            isSignInDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In
        </button>

        {/* Reset Kesempatan Button */}
        <button
          type="button"
          onClick={handleResetChances}
          disabled={!isResetEnabled}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-colors ${
            isResetEnabled
              ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;