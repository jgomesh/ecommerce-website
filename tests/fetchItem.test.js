require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  // implemente seus testes aqui
  test('Verifica de fetchItem é uma função', async () => {
    expect(fetchItem).toBeDefined();
  })

  test('Verifica se o fetch da função fetchfetchItem é chamado', async () => {
    await fetchItem('MLB1607748387')
    expect(fetch).toHaveBeenCalled();
  })

  test('Verifica se o fetch da função fetchProdutcts esta chamando o endpoint correto', async () => {
    await fetchItem('MLB1607748387')
    const url = `https://api.mercadolibre.com/items/MLB1607748387`
    expect(fetch).toHaveBeenCalledWith(url);
  })

  test('Verifica se o fetch da função fetchItem esta chamando o endpoint correto', async () => {
    const data = await fetchItem('MLB1615760527')
    expect(item).toEqual(data);
  })

  test('Verifica se da um erro quando não dão nenhum parametro', async () => {
    try {
      await fetchItem();
    } catch (e) {
      expect(e.message).toMatch('You must provide an url');
    }
  })
});
