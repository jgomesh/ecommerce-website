require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  // implemente seus testes aqui

  test('Verifica de fetchProdutcts é uma função', async () => {
    expect(fetchProducts).toBeDefined();
  })

  test('Verifica se o fetch da função fetchProdutcts é chamado', async () => {
    await fetchProducts('computador')
    expect(fetch).toHaveBeenCalled();
  })

  test('Verifica se o fetch da função fetchProdutcts esta chamando o endpoint correto', async () => {
    await fetchProducts('computador')
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
    expect(fetch).toHaveBeenCalledWith(url);
  })

  test('Verifica se o fetch da função fetchProdutcts esta retornando o objeto correto', async () => {
    const data = await fetchProducts('computador')
    expect(computadorSearch).toEqual(data);
  })

  test('Verifica se da um erro quando não dão nenhum parametro', async () => {
    try {
      await fetchProducts();
    } catch (e) {
      expect(e.message).toMatch('You must provide an url');
    }
  })
});
