export default function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    if (args[0] === false) {
      clearTimeout(timeout);
      return new Promise(r => {});
    }
    return new Promise(resolve => {
      const later = function() {
        timeout = null;
        const res = func.apply(context, args);
        resolve(res);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    });
  };
}
