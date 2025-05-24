import React from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  status,
  className 
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-neutral-300',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      <div className={clsx(
        'flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-800',
        sizeClasses[size]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '';
              // Keep fallback to initials
            }}
          />
        ) : (
          <span className={clsx(
            'font-medium',
            {
              'text-xs': size === 'xs' || size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
            }
          )}>
            {getInitials(alt)}
          </span>
        )}
      </div>
      
      {status && (
        <span className={clsx(
          'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
          statusClasses[status],
          statusSizes[size]
        )} />
      )}
    </div>
  );
};

export default Avatar;