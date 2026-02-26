// Утилита для преобразования чисел в слова на русском языке
export const numberToWords = (num) => {
  if (!num || num === 0) return 'ноль';

  const ones = [
    '', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять',
    'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
    'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
  ];

  const tens = [
    '', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'
  ];

  const hundreds = [
    '', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'
  ];

  const thousands = [
    '', 'одна тысяча', 'две тысячи', 'три тысячи', 'четыре тысячи', 'пять тысяч', 
    'шесть тысяч', 'семь тысяч', 'восемь тысяч', 'девять тысяч'
  ];

  if (num < 20) {
    return ones[num];
  }

  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  }

  if (num < 1000) {
    return hundreds[Math.floor(num / 100)] + 
           (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
  }

  if (num < 10000) {
    const thousandPart = Math.floor(num / 1000);
    const remainder = num % 1000;
    
    let result = '';
    if (thousandPart === 1) result = 'одна тысяча';
    else if (thousandPart === 2) result = 'две тысячи';
    else if (thousandPart < 5) result = ones[thousandPart] + ' тысячи';
    else result = ones[thousandPart] + ' тысяч';
    
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder);
    }
    
    return result;
  }

  if (num < 1000000) {
    const thousandPart = Math.floor(num / 1000);
    const remainder = num % 1000;
    
    let result = numberToWords(thousandPart) + ' тысяч';
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder);
    }
    
    return result;
  }

  if (num < 1000000000) {
    const millionPart = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    
    let result = numberToWords(millionPart);
    if (millionPart === 1) result += ' миллион';
    else if (millionPart < 5) result += ' миллиона';
    else result += ' миллионов';
    
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder);
    }
    
    return result;
  }

  return num.toString(); // Для очень больших чисел
};

// Функция для форматирования валюты с текстовым представлением
export const formatCurrencyWithWords = (amount, currency = 'сом') => {
  if (!amount) return `0 ${currency} (ноль ${currency})`;
  
  const formatted = amount.toLocaleString();
  const words = numberToWords(amount);
  
  return `${formatted} ${currency} (${words} ${currency})`;
};

// Функция для получения правильного окончания для валюты
export const getCurrencyEnding = (amount) => {
  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'сом';
  }
  
  if (lastDigit === 1) return 'сом';
  if (lastDigit >= 2 && lastDigit <= 4) return 'сома';
  return 'сом';
};