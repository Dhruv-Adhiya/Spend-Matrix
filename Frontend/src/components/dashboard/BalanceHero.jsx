import PropTypes from 'prop-types';
import { GlassCard } from '../ui/GlassCard';
import { useSettings } from '../../context/SettingsContext';
import './BalanceHero.css';

export function BalanceHero({ balance, income, expense }) {
  const { formatCurrency } = useSettings();
  return (
    <GlassCard className="balance-hero" padding="large">
      <div className="balance-hero-content">
        <span className="balance-label">Total Balance</span>
        <h2 className="balance-amount">{formatCurrency(balance)}</h2>
        
        <div className="balance-context">
          <div className="context-item income">
            <span className="context-label">Monthly Income</span>
            <span className="context-value">+{formatCurrency(income)}</span>
          </div>
          <div className="context-divider"></div>
          <div className="context-item expense">
            <span className="context-label">Monthly Expense</span>
            <span className="context-value">-{formatCurrency(expense)}</span>
          </div>
        </div>
      </div>
      <div className="balance-hero-glow"></div>
    </GlassCard>
  );
}

BalanceHero.propTypes = {
  balance: PropTypes.number.isRequired,
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired,
};
