function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item  card';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  const priceText = createCustomElement('span', 'item__price', price)
  priceText.innerText = '$' + priceText.innerText
  section.appendChild(priceText);
  const button = createCustomElement('button', 'item__add btn btn-primary', 'Adicionar ao carrinho! ');
  button.innerHTML += '<i class="uil uil-plus-circle"></i>';
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// FUNÇÂO QUE PEGA TODOS OS PREÇOS NO CARRINHO
function returnTotalArray() {
  const totalPriceItens = document.querySelectorAll('.price-number');
  return totalPriceItens;
}
const cartContainer = document.querySelector('.cart__items'); 

let price = 0;
const totalPrice = document.querySelector('.total-price');
// FUNÇÂO QUE ATUALIZA O PREÇO
function attPrices() {
  const totalPriceItens = returnTotalArray(); // COLOCA TODOS OS ELEMENTOS EM UMA CONSTANTE
  const totalPriceArray = [];// ARRAY RESPONSAVEL POR GUARDAR OS PREÇOS COMO NUMEROS
  totalPriceItens.forEach((item) => totalPriceArray.push(item.innerText.replace(/,/g, '')));  // ESTRUTURA DE REPETIÇÃO QUE COLOCA CADA PREÇO DENTRO DO ARRAY VAZIO
  if (totalPriceItens.length === 0) {// SE NAO TIVER NADA DENTRO DO ARRAY O PREÇO É ZERO
    price = 0;
  } else {
    const totalPrices = totalPriceArray.reduce((acumulador, elementoAtual) => {// HOF reduce sendo usada para calcular o preço total somando os preços individuais
      const atual = parseFloat(acumulador, 10) + parseFloat(elementoAtual, 10);
      return atual;
    });
    price = parseFloat(totalPrices.toString().slice(0, 7));//CORTA AS CASAS DECIMAISS... NAO FUNCIONA COM NUMEROS MAIORES QUE 9999.00
  }
  totalPrice.innerText = `Total: $${price}`;//ATUALIZA O PREÇO NOO HTML
}

let clicked = false; //SETA O BOTAO COMO NAO CLICADO
const cartTitleContainer =  document.querySelector('.container-cartTitle');
const cartAtualContainer =  document.querySelector('.cart');
const iconCart = document.querySelector('.material-icons');

function showCart() {
  iconCart.style.color = 'white'
  if (clicked === false) {
    cartAtualContainer.style.display = 'flex'
    cartTitleContainer.style.width = '500px';
    cartAtualContainer.style.left = '60%';
    cartAtualContainer.style.top = '5px'; 
    clicked = true;
  } else {
    cartTitleContainer.style.width = '0px';
    cartAtualContainer.style.top = '-680px';
    cartTitleContainer.style.display = 'flex'
    clicked = false;
  }
}

iconCart.addEventListener('click', showCart); 
// FUNÇÂO QUE REMOVE O ITEM DO CARRINHO
function cartItemClickListener(event) {
  // coloque seu código aqui
  cartContainer.removeChild(event.target.parentNode);// REMOVE O ELEMENTO PAI DO ELEMENTO CLICADO ( O ICONE CLOSE)
  const cartHtml = cartContainer.innerHTML; // GUARDA O CONTEUDO HTML DO CONTAINER TOTAL DO CARRINHO
  saveCartItems(cartHtml); // SALVA NO LOCAL STORAGE
  attPrices();
}

function createCartItemElement({ sku, name, salePrice, image }) {// FUNCAO QUE CRIA O ELEMENTO DO CARRIO
  if(sku === undefined) {

  } else {
    const li = document.createElement('li');
    li.className = 'cart__item';  
    const texto1 = `<span class='name'>${name}</span><div class='price'>PRICE: $`;
    li.innerHTML = `<i class="uil uil-times icon"></i><img src='${image}' class='img-fluid cart__image'>${texto1}<span class='price-number'>${salePrice}</span></div><hr/ class='barra'>`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
}

// FUNÇÂO QUE CRIA A PARTE DOS PRODUTOS
const createProductsPage = async (produto) => {
  const items = await fetchProducts(produto); // CHAMA A API COM A FUNÇÂO CRIADA ANTERIORMENTE
  const itensSection = document.getElementsByClassName('items')[0]; // PREGA O PRIMEIRO ELEMENTO COM ESSA CLASSE
  itensSection.innerText = '';// APAGA O TEXTO CARREGANDO
  items.results.forEach((item) => {//ESTRUTURA DE REPETIÇÃO QUE PEGA CADA ITEM RECEBIDO DA API E USA A FUNCAO PARA CRIAR O ELEMENTO
    const { id: sku, title: name, thumbnail: image, price} = item;
    const productItemContainer = createProductItemElement({ sku, name, image, price });
    itensSection.appendChild(productItemContainer);
  });
  const productsButtons = document.querySelectorAll('.item');
  productsButtons.forEach((item) => {
    item.addEventListener('click', productInfo);
  });
};
// FUNCAO COLOCA O PRODUTO CLICADO NO CARRINHO
const productInfo = async (elemento) => {
  const id = elemento.target.parentNode.children[0].innerText; // PEGA O ID DO ELEMENTO CLICADO
  const item = await fetchItem(id);// FUNCAO QUE CHAMA A API COM SOMENTE O ITEM DO ID CHAMADO
  const { id: sku, title: name, price: salePrice, thumbnail: image } = item;
  const itemAdded = createCartItemElement({ sku, name, salePrice, image });// CRIA ELEMENTO HTML DO CARRINHO
  cartContainer.appendChild(itemAdded);
  const newIcons = document.querySelectorAll('.icon');// SELECIONA OS ICONS DE CLOSE PARA APAGAR O ITEM
  newIcons.forEach((item) => item.addEventListener('click',  cartItemClickListener));
  const cartHtml = cartContainer.innerHTML;
  saveCartItems(cartHtml);
  iconCart.style.color = 'red';
  attPrices();
};

const eraseButton = document.querySelector('.empty-cart');

function eraseCart() {
  price = 0;
  cartContainer.innerHTML = '';
  const cartHtml = cartContainer.innerHTML;
  saveCartItems(cartHtml);
  totalPrice.innerText = `Total: $${price}`;
}

eraseButton.addEventListener('click', eraseCart);

const changeProduct = async () => {
  const searchInput = document.querySelector('#search')
  const itensSection = document.getElementsByClassName('items')[0]; // PREGA O PRIMEIRO ELEMENTO COM ESSA CLASSE
  itensSection.innerHTML = "<div class='center loading'><div class='ring'></div><span class='loading-span'>carregando...</span></div>";// APAGA O TEXTO CARREGANDO
  const result = await createProductsPage(searchInput.value);
  return result
}

function loadingPage() {
  const loadingPage = document.querySelector('#teste');
  const main = document.querySelector('#main');
  const footer = document.querySelector('#footer');
  footer.style.display = 'none'
  main.style.display = 'none';
  cartAtualContainer.style.display = 'none'
  loadingPage.style.display = 'block';
  cartTitleContainer.style.width = '0px';
}

window.onload = async () => {
  // CRIANDO PARTE DOS PRODUTOS
  await createProductsPage('computador');
  const productsButtons = document.querySelectorAll('.item');
  productsButtons.forEach((item) => {
    item.addEventListener('click', productInfo);
  });
  const savedCartHtml = await JSON.parse(getSavedCartItems('cartItems'));
  const cartHtml = document.querySelector('.cart__items');
  cartHtml.innerHTML = savedCartHtml;
  // READICIONA O EVENT LISTENER DOS ELEMENTOS RECARREGADOS NA PAGINA
  const newItems = document.querySelectorAll('.cart__item');
  const newIcons = document.querySelectorAll('.icon');
  newItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  newIcons.forEach((item) => item.addEventListener('click',  cartItemClickListener));
  // ATUALIZA O PREÇO
  const searchIcon = document.querySelector('.color')
  searchIcon.addEventListener('click', () => changeProduct());
  const searchInput = document.querySelector('#search')
  searchInput.addEventListener("keypress", (event)=> {
    if (event.keyCode === 13) { // key code of the keybord key
      event.preventDefault();
      changeProduct();
    }
  });
  const finalize = document.querySelector('.empty-cart3');
  finalize.addEventListener('click', loadingPage)
  attPrices();
};
