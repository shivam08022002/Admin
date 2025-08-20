import { toWords } from 'number-to-words';

export function convertToIndianWords(num) {
    if (num >= 1e7) {
      const crore = Math.floor(num / 1e7);
      const rest = num % 1e7;
      return toWords(crore) + ' Crore ' + (rest ? convertToIndianWords(rest) : '');
    } else if (num >= 1e5) {
      const lakh = Math.floor(num / 1e5);
      const rest = num % 1e5;
      return toWords(lakh) + ' Lakh ' + (rest ? convertToIndianWords(rest) : '');
    } else {
      return toWords(num);
    }
  }

  // Utility function to capitalize the first letter of each word
export function capitalizeEachWord(sentence) {
    if (!sentence) return '';
  
    // Replace hyphens and commas with spaces
    const formattedSentence = sentence.replace(/[-,]/g, ' ');
  
    // Split the sentence into words, capitalize each word, and join them back
    return formattedSentence
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  