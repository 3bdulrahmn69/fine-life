'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Modal from './modal';
import TransactionForm from './transaction-form';
import { TransactionFormData, Transaction } from '../../types/transaction';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingTransaction?: Transaction | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  editingTransaction,
}: TransactionModalProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: TransactionFormData) => {
    if (!session) return;

    try {
      setIsSubmitting(true);

      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      const response = editingTransaction
        ? await fetch(`/api/transactions/${editingTransaction._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
          })
        : await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
          });

      if (response.ok) {
        onSuccess?.();
        onClose();
      } else {
        const error = await response.json();
        console.error('Transaction error:', error);
        alert(error.message || 'Failed to save transaction');
      }
    } catch (error) {
      console.error('Transaction submission error:', error);
      alert('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      size="lg"
    >
      <TransactionForm
        initialData={editingTransaction || undefined}
        currency="USD"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
