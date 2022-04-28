const fetchProducts = async (item) => {
  // seu código aqui
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
