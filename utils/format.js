export function formatEuro (amount) {
  if (!amount) return '';
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function formatNumber (number, digits = 2) {
  if (!number) return '';
  return parseFloat(number).toFixed(digits);
}

export function ucfirst (string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatLicensePlate (string) {
  if (!string) return '';

  const platesTypesRegex = [
    { type: 'old', regex: /[A-Z]{2}-[0-9]{3}-[A-Z]{2}/ },
    { type: 'new', regex: /[A-Z]{2}[0-9]{3}[A-Z]{2}/ },
  ];

  const plateType = platesTypesRegex.find(({ regex }) => regex.test(string));

  if (!plateType) return string;

  const { type } = plateType;

  if (type === 'old') {
    const [first, second, third] = string.split('-');
    return `${first} ${second} ${third}`;
  } else if (type === 'new') {
    const [first, second, third] = string.match(/.{1,2}/g);
    return `${first} ${second} ${third}`;
  }
}

export function formatPriceAsIntegerAndDecimal (price) {
  if (!price) return { integer: '...', decimal: '...'}
  const [integer, decimal] = price.toString().split('.');
  return {
    integer,
    decimal: decimal || '00',
  };
}

export function uppercase (string) {
  if (!string) return '';
  return string?.toUpperCase();
}

export function formatDate (date, showHoursAndMinutes = false) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR') + (showHoursAndMinutes ? ' - ' + new Date(date).toLocaleTimeString('fr-FR') : '');
}