const stopWords = require('../utils/stopWords.js');
const extractKeywords = (title = "", description = "") => {
    // Combine title and description into one text
    const text = `${title} ${description}`.toLowerCase();
  
    // Remove punctuation and split by spaces
    const words = text
      .replace(/[^\w\s]/gi, "") // Remove punctuation
      .split(/\s+/) // Split into words
      .filter((word) => word.length > 3); // Filter out short words (e.g., "is", "a")
  
    // Remove common stop words
    const filteredWords = words.filter((word) => !stopWords.includes(word));
  
    // Count occurrences of each word
    const wordFrequency = {};
    filteredWords.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  
    // Sort words by frequency and return the top keywords
    const sortedKeywords = Object.keys(wordFrequency).sort(
      (a, b) => wordFrequency[b] - wordFrequency[a]
    );
  
    return sortedKeywords.slice(0, 10); // Return the top 10 keywords
  };
  
  module.exports = extractKeywords;