import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const features = [
  {
    icon: '💸',
    title: 'Track Every Transaction',
    desc: 'Log income and expenses instantly. Filter, search, and export your full transaction history anytime.',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Beautiful charts break down your spending by category, payment source, and time period.',
  },
  {
    icon: '🎯',
    title: 'Smart Budgets',
    desc: 'Set monthly budgets per category and get real-time alerts before you overspend.',
  },
  {
    icon: '🔁',
    title: 'Recurring Transactions',
    desc: 'Automate subscriptions and bills. Never miss a recurring payment again.',
  },
  {
    icon: '🔔',
    title: 'Instant Notifications',
    desc: 'Stay informed with alerts for budget limits, large transactions, and account activity.',
  },
  {
    icon: '📁',
    title: 'Export Reports',
    desc: 'Download your financial data as CSV or PDF for taxes, audits, or personal records.',
  },
];

const stats = [
  { value: '10K+', label: 'Transactions Tracked' },
  { value: '500+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '0', label: 'Hidden Fees' },
];

export default function LandingPage() {
  const { token, user } = useAuth();
  if (token) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-bold text-indigo-600">Spend Matrix</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Personal Finance Made Simple
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Let's Start Tracking <br />
            <span className="text-indigo-600">Your Transactions</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Spend Matrix gives you a crystal-clear picture of where your money goes — with smart budgets,
            visual analytics, and real-time alerts all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all hover:shadow-indigo-200 hover:shadow-xl"
            >
              Get Started →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span className="ml-4 text-indigo-200 text-xs">spendmatrix.app/dashboard</span>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Income', value: '$4,250', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Total Expenses', value: '$2,840', color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'Net Savings', value: '$1,410', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Budget Used', value: '67%', color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((card) => (
              <div key={card.label} className={`${card.bg} rounded-xl p-4 text-left`}>
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Recent Transactions</p>
              {[
                { name: 'Grocery Store', cat: 'Food', amount: '-$85.20', color: 'text-red-500' },
                { name: 'Salary Deposit', cat: 'Income', amount: '+$2,500', color: 'text-green-600' },
                { name: 'Netflix', cat: 'Entertainment', amount: '-$15.99', color: 'text-red-500' },
              ].map((tx) => (
                <div key={tx.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{tx.name}</p>
                    <p className="text-xs text-gray-400">{tx.cat}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.color}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-indigo-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to master your money</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From daily expense logging to long-term financial planning — Spend Matrix has you covered.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all bg-gray-50 hover:bg-white"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="text-base font-semibold text-gray-800 mt-3 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Get started in 3 simple steps</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up for free in under a minute. No credit card required.' },
              { step: '02', title: 'Add your transactions', desc: 'Log expenses and income manually or set up recurring entries.' },
              { step: '03', title: 'Gain financial clarity', desc: 'View analytics, track budgets, and make smarter money decisions.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your finances?</h2>
          <p className="text-indigo-200 mb-8">
            Join hundreds of users who trust Spend Matrix to manage their money every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-indigo-400 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">💰</span>
          <span className="text-white font-bold">Spend Matrix</span>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Spend Matrix. All rights reserved.</p>
      </footer>
    </div>
  );
}
