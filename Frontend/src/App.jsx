import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PublicRoute } from './routes/PublicRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AuthProvider } from './context/AuthContext';

import { Suspense, lazy } from 'react';
import { Spinner } from './components/ui/Spinner';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CategoriesPage = lazy(() => import('./pages/categories/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const BudgetsPage = lazy(() => import('./pages/budgets/BudgetsPage').then(m => ({ default: m.BudgetsPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const RecurringPage = lazy(() => import('./pages/recurring/RecurringPage').then(m => ({ default: m.RecurringPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ExportPage = lazy(() => import('./pages/export/ExportPage').then(m => ({ default: m.ExportPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminTransactionsPage = lazy(() => import('./pages/admin/AdminTransactionsPage').then(m => ({ default: m.AdminTransactionsPage })));
const AdminRecurringPage = lazy(() => import('./pages/admin/AdminRecurringPage').then(m => ({ default: m.AdminRecurringPage })));
const AdminLogsPage = lazy(() => import('./pages/admin/AdminLogsPage').then(m => ({ default: m.AdminLogsPage })));

const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-glass)',
          }
        }} 
      />
      
      <AuthProvider>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}><Spinner size="large" /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><MainLayout><TransactionsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><MainLayout><CategoriesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><MainLayout><BudgetsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><MainLayout><AnalyticsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/recurring" element={<ProtectedRoute><MainLayout><RecurringPage /></MainLayout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute><MainLayout><ExportPage /></MainLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsersPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/transactions" element={<AdminRoute><AdminLayout><AdminTransactionsPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/recurring" element={<AdminRoute><AdminLayout><AdminRecurringPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/logs" element={<AdminRoute><AdminLayout><AdminLogsPage /></AdminLayout></AdminRoute>} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
