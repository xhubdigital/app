export default {
  cartItems: '0 itens | 1 item | {count} itens',
  notAuthenticatedWarning: 'Utilize o botão abaixo para acessar sua conta ou ' +
    'se cadastrar para finalizar seu pedido.',
  notifications: {
    storeClosedError: {
      message: 'A loja está fechada',
      caption: 'Não foi possível realizar seu pedido pois a loja está fechada',
    },
    itemOutOfStockError: {
      message: 'Item sem estoque',
      caption: 'Algum produto ou complemento do seu carrinho não está ' +
        'disponível.',
    },
    complementOptionDisabledError: {
      message: 'Item do complemento indispoível',
      caption: 'Um complemento no produto {product} não está disponível no ' +
        'momento. Por favor, remova o produto do carrinho e adicione ' +
        'novamente.',
    },
    makeOrderGenericError: {
      message: 'Erro ao realizar pedido',
      caption: 'Não conseguimos realizar o seu pedido agora.',
    },
  },
};
