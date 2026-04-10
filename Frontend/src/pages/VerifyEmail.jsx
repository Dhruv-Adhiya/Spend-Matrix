import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }
    authAPI
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully. You can now log in.');
      })
      .catch((err) => {
        const error = err.response?.data?.error || '';
        if (error === 'Email is already verified.') {
          setStatus('success');
          setMessage('Your email is already verified. You can log in.');
        } else {
          setStatus('error');
          setMessage(error || 'Verification failed. The link may have expired.');
        }
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        {status === 'loading' && <p className="text-gray-500 text-sm">Verifying your email...</p>}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Email Verified</h1>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-4">✕</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h1>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
