// European number and currency formatting utilities

export const formatCurrency = (amount: number, showCents = true): string => {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  return formatter.format(amount);
};

export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercent = (value: number, decimals = 2): string => {
  return `${formatNumber(value, decimals)}%`;
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `€${formatNumber(amount / 1_000_000, 1)}M`;
  }
  if (amount >= 1_000) {
    return `€${formatNumber(amount / 1_000, 0)}K`;
  }
  return formatCurrency(amount, false);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getTimeRemaining = (endDatetime: string): { hours: number; minutes: number; seconds: number; expired: boolean } => {
  const now = new Date().getTime();
  const end = new Date(endDatetime).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
};

export const formatTimeRemaining = (endDatetime: string): string => {
  const { hours, minutes, expired } = getTimeRemaining(endDatetime);
  
  if (expired) return 'Ended';
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  }
  
  return `${hours}h ${minutes}m left`;
};

export const getTimeSince = (dateString: string): string => {
  const now = new Date().getTime();
  const date = new Date(dateString).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};
