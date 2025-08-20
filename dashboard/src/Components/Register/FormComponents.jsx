import React, { forwardRef } from 'react';

// Compatibility wrapper for Form component
export const Form = forwardRef(({ onSubmit, children, ...props }, ref) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={ref} {...props}>
      {children}
    </form>
  );
});

Form.displayName = 'Form';

// Compatibility wrapper for Input component
export const Input = ({ validations, ...props }) => {
  // validations parameter is kept for compatibility but not used
  void validations; // Suppress unused variable warning
  return <input {...props} />;
};

// Compatibility wrapper for CheckButton component
export const CheckButton = forwardRef(({ children, ...props }, ref) => {
  return (
    <button type="button" ref={ref} {...props}>
 {children}
 </button>
 );
});

CheckButton.displayName = 'CheckButton';
