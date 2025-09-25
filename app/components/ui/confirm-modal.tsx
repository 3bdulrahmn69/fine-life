import React from 'react';
import { FiX, FiAlertTriangle, FiTrash2, FiCheck } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: FiTrash2,
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    confirmButton:
      'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    border: 'border-destructive/30',
  },
  warning: {
    icon: FiAlertTriangle,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    confirmButton: 'bg-warning hover:bg-warning/90 text-warning-foreground',
    border: 'border-warning/30',
  },
  info: {
    icon: FiAlertTriangle,
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    confirmButton: 'bg-info hover:bg-info/90 text-info-foreground',
    border: 'border-info/30',
  },
  success: {
    icon: FiCheck,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    confirmButton: 'bg-success hover:bg-success/90 text-success-foreground',
    border: 'border-success/30',
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const styles = variantStyles[variant];
  const IconComponent = icon ? null : styles.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-primary-card rounded-xl shadow-2xl border border-primary-border max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-border">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.iconBg}`}
            >
              {icon ||
                (IconComponent && (
                  <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                ))}
            </div>
            <h2 className="text-xl font-semibold text-primary-foreground">
              {title}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 hover:bg-primary-accent/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-5 h-5 text-primary-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-primary-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-primary-border bg-primary-card/50">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-primary-border text-primary-foreground rounded-lg hover:bg-primary-card/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton} min-w-[80px] flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
