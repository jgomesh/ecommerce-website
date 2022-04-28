const saveCartItems = (html) => localStorage.setItem('cartItems', JSON.stringify(html));

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
