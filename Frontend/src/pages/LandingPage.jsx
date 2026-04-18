import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const features = [
  { icon: '💸', title: 'Track Every Transaction', desc: 'Log income and expenses instantly. Filter, search, and export your full transaction history anytime.' },
  { icon: '📊', title: 'Visual Analytics', desc: 'Beautiful charts break down your spending by category, payment source, and time period.' },
  { icon: '🎯', title: 'Smart Budgets', desc: 'Set monthly budgets per category and get real-time alerts before you overspend.' },
  { icon: '🔁', title: 'Recurring Transactions', desc: 'Automate subscriptions and bills. Never miss a recurring payment again.' },
  { icon: '🔔', title: 'Instant Notifications', desc: 'Stay informed with alerts for budget limits, large transactions, and account activity.' },
  { icon: '📁', title: 'Export Reports', desc: 'Download your financial data as CSV or PDF for taxes, audits, or personal records.' },
];

const stats = [
  { value: '10K+', label: 'Transactions Tracked' },
  { value: '500+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '0', label: 'Hidden Fees' },
];

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up for free in under a minute. No credit card required.' },
  { step: '02', title: 'Add your transactions', desc: 'Log expenses and income manually or set up recurring entries.' },
  { step: '03', title: 'Gain financial clarity', desc: 'View analytics, track budgets, and make smarter money decisions.' },
];

const mockTx = [
  { name: 'Grocery Store', cat: 'Food', amount: '-₹85.20', red: true },
  { name: 'Salary Deposit', cat: 'Income', amount: '+₹2,500', red: false },
  { name: 'Netflix', cat: 'Entertainment', amount: '-₹15.99', red: true },
];

function useCountUpOnVisible(target) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          // parse numeric part from strings like "10K+", "500+", "99.9%", "0"
          const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
          if (!numeric) { setCount(target); return; }
          const suffix = target.replace(/[0-9.]/g, '');
          let start = 0;
          const duration = 1200;
          const step = numeric / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= numeric) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start * 10) / 10 + suffix);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, count };
}

function StatItem({ value, label }) {
  const { ref, count } = useCountUpOnVisible(value);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '2.75rem', color: '#fff' }}>
        {count || '0'}
      </p>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: 'rgba(255,255,255,0.70)', marginTop: 4 }}>{label}</p>
    </div>
  );
}

function StatsBar() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)', padding: '52px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 300, height: 300, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', top: -100, right: -60, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
        {stats.map(s => <StatItem key={s.label} value={s.value} label={s.label} />)}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { token, user } = useAuth();
  if (token) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 68,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1.5px solid rgba(229,231,235,0.5)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
      }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeInLeft 0.4s ease both' }}>
            <span style={{ fontSize: 24 }}>💰</span>
            <span className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>Spend Matrix</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{
              fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 14, color: '#6B7280',
              padding: '8px 16px', borderRadius: 8, textDecoration: 'none', transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = ''; }}
            >Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(145deg, #F0F4FF 0%, #FEFEFF 40%, #F5F0FF 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '140px 24px 100px',
      }}>
        {/* Blobs */}
        <div className="blob-wrap">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        {/* Dot matrix */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.4, pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', marginBottom: 20,
            background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.20)',
            color: '#4F46E5', borderRadius: 999, padding: '6px 14px',
            fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            animation: 'fadeInUp 0s ease both',
          }}>✨ Personal Finance Made Simple</span>

          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800,
            lineHeight: 1.15, marginBottom: 20,
            animation: 'fadeInUp 0.08s ease both',
          }}>
            <span style={{ fontSize: '3.5rem', color: '#111827', display: 'block' }}>Let's Start Tracking</span>
            <span className="gradient-text" style={{ fontSize: '3.5rem', display: 'block' }}>Your Transactions</span>
          </h1>

          <p style={{
            fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '1.0625rem', color: '#6B7280',
            maxWidth: 520, margin: '0 auto', lineHeight: 1.65,
            animation: 'fadeInUp 0.16s ease both',
          }}>
            Spend Matrix gives you a crystal-clear picture of where your money goes — with smart budgets, visual analytics, and real-time alerts all in one place.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap', animation: 'fadeInUp 0.22s ease both' }}>
            <Link to="/register" className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 6px 20px rgba(79,70,229,0.35)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(79,70,229,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)'; }}
            >
              Get Started →
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none' }}>
              I Already Have an Account
            </Link>
          </div>
        </div>

        {/* Mock dashboard */}
        <div style={{
          maxWidth: 760, margin: '60px auto 0',
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(79,70,229,0.12)', borderRadius: 20,
          boxShadow: '0 20px 80px rgba(79,70,229,0.15), 0 0 0 1px rgba(255,255,255,0.5)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.5s 0.4s both',
        }}>
          {/* Browser chrome */}
          <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28CA42', display: 'inline-block' }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.65)', marginLeft: 12 }}>spendmatrix.app/dashboard</span>
          </div>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: 16, gap: 10 }}>
            {[
              { label: 'Total Income', value: '₹4,250', bg: '#ECFDF5', color: '#059669' },
              { label: 'Total Expenses', value: '₹2,840', bg: '#FEF2F2', color: '#DC2626' },
              { label: 'Net Savings', value: '₹1,410', bg: '#EEF2FF', color: '#4F46E5' },
              { label: 'Budget Used', value: '67%', bg: '#FFFBEB', color: '#D97706' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: 14 }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{c.label}</p>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: '1rem', color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>
          {/* Recent transactions */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ background: '#F8FAFF', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent Transactions</p>
              {mockTx.map((tx, i) => (
                <div key={tx.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < mockTx.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                  <div>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 13, color: '#111827' }}>{tx.name}</p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#9CA3AF' }}>{tx.cat}</p>
                  </div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 13, color: tx.red ? '#DC2626' : '#059669' }}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <StatsBar />

      {/* ── Features ── */}
      <section style={{ background: '#fff', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '2rem', color: '#111827', display: 'inline-block', position: 'relative' }}>
              Everything you need to master your money
              <span style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', height: 3, width: 60, background: 'linear-gradient(90deg, #4F46E5, #8B5CF6)', borderRadius: 2, display: 'block' }} />
            </h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '1rem', color: '#6B7280', maxWidth: 500, margin: '24px auto 0' }}>
              From daily expense logging to long-term financial planning — Spend Matrix has you covered.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card card-hover stagger-item"
                style={{ padding: 28, animation: 'fadeInUp 0.4s ease both', animationDelay: `${i * 0.05}s` }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{f.icon}</div>
                <h3 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginTop: 16 }}>{f.title}</h3>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.65, marginTop: 6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: 'linear-gradient(145deg, #F0F4FF 0%, #F5F0FF 100%)', padding: '88px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.4, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '2rem', color: '#111827', display: 'inline-block', position: 'relative' }}>
              Get started in 3 simple steps
              <span style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', height: 3, width: 60, background: 'linear-gradient(90deg, #4F46E5, #8B5CF6)', borderRadius: 2, display: 'block' }} />
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 30, left: '16%', right: '16%', borderTop: '2px dashed rgba(79,70,229,0.25)', pointerEvents: 'none' }} />
            {steps.map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: `${i * 0.1}s` }} className="stagger-item page-enter">
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  boxShadow: '0 6px 20px rgba(79,70,229,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff',
                  position: 'relative', zIndex: 1,
                  animation: 'pulse-glow 2s infinite',
                }}>{s.step}</div>
                <h3 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#111827', marginTop: 16 }}>{s.title}</h3>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6D28D9 60%, #3B82F6 100%)', padding: '88px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, top: -150, right: -100, border: '2px solid rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 250, height: 250, bottom: -80, left: -60, border: '2px solid rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '2.25rem', color: '#fff' }}>Ready to take control of your finances?</h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.75)', margin: '16px 0 32px' }}>
            Join hundreds of users who trust Spend Matrix to manage their money every day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: '#fff', color: '#4F46E5', padding: '13px 28px', borderRadius: 10,
              fontFamily: '"DM Sans", sans-serif', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >Create Account</Link>
            <Link to="/login" style={{
              background: 'transparent', color: '#fff', padding: '13px 28px', borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.5)',
              fontFamily: '"DM Sans", sans-serif', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0F172A', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>💰</span>
          <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Spend Matrix</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
          {['Privacy Policy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >{l}</a>
          ))}
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#475569' }}>© 2026 Spend Matrix. All rights reserved.</p>
      </footer>
    </div>
  );
}
