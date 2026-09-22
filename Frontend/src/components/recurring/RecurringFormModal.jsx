import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../ui/Modal';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';
import { GlassButton } from '../ui/GlassButton';
import './RecurringFormModal.css';

export const RecurringFormModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category_id: '',
    amount: '',
    description: '',
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    payment_source: 'online'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type || 'expense',
          category_id: initialData.category_id || '',
          amount: initialData.amount || '',
          description: initialData.description || '',
          frequency: initialData.frequency || 'monthly',
          start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
          end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
          payment_source: initialData.payment_source || 'online'
        });
      } else {
        setFormData({
          type: 'expense',
          category_id: '',
          amount: '',
          description: '',
          frequency: 'monthly',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          payment_source: 'online'
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData, amount: Number(formData.amount) };
      if (!submitData.end_date) delete submitData.end_date; // Don't send empty end_date string
      
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);
  const categoryOptions = filteredCategories.map(c => ({ value: c.id, label: c.name }));

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const paymentSourceOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online' },
    { value: 'credit_card', label: 'Credit Card' }
  ];

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Recurring Rule" : "Add Recurring Rule"}
    >
      <form onSubmit={handleSubmit} className="recurring-form">
        <div className="form-row">
          <GlassSelect
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
          />
          <GlassSelect
            label="Category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            options={[{ value: '', label: 'Select Category' }, ...categoryOptions]}
            error={errors.category_id}
          />
        </div>

        <div className="form-row">
          <GlassInput
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            placeholder="0.00"
            icon="₹"
          />
          <GlassSelect
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            options={frequencyOptions}
          />
        </div>

        <GlassInput
          label="Description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="e.g., Netflix Subscription, Rent"
        />

        <div className="form-row">
          <GlassInput
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            error={errors.start_date}
          />
          <GlassInput
            label="End Date (Optional)"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            error={errors.end_date}
          />
        </div>

        <GlassSelect
          label="Payment Source"
          name="payment_source"
          value={formData.payment_source}
          onChange={handleChange}
          options={paymentSourceOptions}
        />

        <div className="form-actions">
          <GlassButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </GlassButton>
          <GlassButton type="submit" variant="primary" isLoading={isSubmitting}>
            {initialData ? 'Update Rule' : 'Create Rule'}
          </GlassButton>
        </div>
      </form>
    </Modal>
  );
};

RecurringFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  categories: PropTypes.array.isRequired
};
