/**
 * Async handler to wrap async functions and catch errors
 * This eliminates the need for try/catch blocks in route handlers
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - Express middleware function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
