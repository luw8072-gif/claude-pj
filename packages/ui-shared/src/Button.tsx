import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary: 'btnPrimary',
  secondary: 'btnSecondary',
  ghost: 'btnGhost',
  danger: 'btnDanger',
};

const sizeStyles: Record<string, string> = {
  sm: 'btnSm',
  md: 'btnMd',
  lg: 'btnLg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
