import { useState, useEffect, useCallback } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { recurringService } from '../../services/recurringService';
import api from '../../services/api';
import { RecurringTable } from '../../components/recurring/RecurringTable';
import { RecurringFormModal } from '../../components/recurring/RecurringFormModal';
import { GlassButton } from '../../components/ui/GlassButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import './RecurringPage.css';

export const RecurringPage = () => {
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await recurringService.getAllRecurring();
      setRules(res.data || res);
    } catch (err) {
      toast.error('Failed to load recurring rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  }, []);

  useEffect(() => {
    fetchRules();
    fetchCategories();
  }, [fetchRules, fetchCategories]);

  const handleOpenForm = (rule = null) => {
    setSelectedRule(rule);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRule(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedRule) {
        await recurringService.updateRecurring(selectedRule.id, data);
        toast.success('Recurring rule updated');
      } else {
        await recurringService.createRecurring(data);
        toast.success('Recurring rule created');
      }
      handleCloseForm();
      fetchRules();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save rule');
    }
  };

  const handleOpenConfirm = (rule) => {
    setSelectedRule(rule);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedRule(null);
  };

  const handleDelete = async () => {
    if (!selectedRule) return;
    try {
      await recurringService.deleteRecurring(selectedRule.id);
      toast.success('Recurring rule deleted');
      handleCloseConfirm();
      fetchRules();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete rule');
    }
  };

  return (
    <div className="recurring-page">
      <div className="recurring-header">
        <div>
          <h1 className="page-title">Recurring Transactions</h1>
          <p className="page-subtitle">
            Manage your automated transaction tracking. The backend system runs these rules on schedule based on the frequency.
          </p>
        </div>
        <GlassButton icon={Plus} variant="primary" onClick={() => handleOpenForm()}>
          Add New Rule
        </GlassButton>
      </div>

      <div className="recurring-content">
        {isLoading ? (
          <div className="recurring-loader">
            <Spinner size="large" />
          </div>
        ) : rules.length === 0 ? (
          <div className="recurring-empty">
            <EmptyState
              title="No Recurring Rules"
              description="You have not set up any automated tracking rules yet. Create one to let the system log regular expenses or income for you."
              icon="calendar"
              actionButton={
                <GlassButton icon={Plus} variant="primary" onClick={() => handleOpenForm()}>
                  Create Rule
                </GlassButton>
              }
            />
          </div>
        ) : (
          <RecurringTable 
            rules={rules} 
            onEdit={handleOpenForm} 
            onDelete={handleOpenConfirm} 
          />
        )}
      </div>

      <RecurringFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={selectedRule}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="Delete Recurring Rule"
        message={`Are you sure you want to delete the automated rule for "${selectedRule?.description}"? This will stop future executions.`}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};
