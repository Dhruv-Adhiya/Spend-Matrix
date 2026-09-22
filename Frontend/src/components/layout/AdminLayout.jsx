import PropTypes from 'prop-types';
import { MainLayout } from './MainLayout';
import { Icon } from '../ui/Icon';
import './AdminLayout.css';

export function AdminLayout({ children }) {
  return (
    <div className="admin-layout-wrapper">
      <div className="admin-banner">
        <Icon name="ShieldAlert" size={16} />
        <span>Admin Mode Active — You have elevated permissions</span>
      </div>
      <MainLayout>
        {children}
      </MainLayout>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
