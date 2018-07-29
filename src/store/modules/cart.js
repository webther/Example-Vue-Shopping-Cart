// state
const state = {
  cartItems: []
};

// getters
const getters = {
  getCartItems: (state, getters, rootState) => {
    return state.cartItems.map(({ itemId, quantity }) => {
      const product = rootState.products.allProducts.find(
        product => product.pid === itemId
      );
      return {
        itemId: product.pid,
        title: product.title,
        price: product.price,
        quantity: quantity,
        inventory: product.inventory
      };
    });
  },

  getCartTotal: (state, getters) => {
    return getters.getCartItems.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  }
};

// actions
const actions = {
  addItemToCart({ state, commit }, product) {
    if (product.inventory > 0) {
      const cartItem = state.cartItems.find(
        item => item.itemId === product.pid
      );
      if (!cartItem) {
        commit("addItemToCart", { itemId: product.pid });
      } else {
        commit("incrementQuantityByCartItem", { itemId: product.pid });
      }
      // remove 1 item from stock
      commit(
        "products/decrementInventoryByProduct",
        { pid: product.pid },
        { root: true }
      );
    }
  },
  removeItemFromCart({ state, commit, rootState }, cartItem) {
    commit("removeItemFromCart", { itemId: cartItem.itemId });
    commit(
      "products/restockInventoryByProduct",
      { pid: cartItem.itemId, quantity: cartItem.quantity },
      { root: true }
    );
  },
  incrementQuantityByCartItem({ state, commit, rootState }, { itemId }) {
    const cartItem = state.cartItems.find(item => item.itemId === itemId);
    if (cartItem) {
      commit("incrementQuantityByCartItem", { itemId: itemId });
      commit(
        "products/decrementInventoryByProduct",
        { pid: itemId },
        { root: true }
      );
    }
  },
  decrementQuantityByCartItem({ state, commit, rootState }, { itemId }) {
    const cartItem = state.cartItems.find(item => item.itemId === itemId);
    if (cartItem) {
      commit("decrementQuantityByCartItem", { itemId: itemId });
      commit(
        "products/incrementInventoryByProduct",
        { pid: itemId },
        { root: true }
      );
    }
  }
};

// mutations
const mutations = {
  addItemToCart(state, { itemId }) {
    state.cartItems.push({
      itemId: itemId,
      quantity: 1
    });
  },
  removeItemFromCart(state, { itemId }) {
    const cartItem = state.cartItems.find(item => item.itemId === itemId);
    if (cartItem) {
      state.cartItems.splice(state.cartItems.indexOf(cartItem), 1);
    }
  },

  incrementQuantityByCartItem(state, { itemId }) {
    const cartItem = state.cartItems.find(item => item.itemId === itemId);
    if (cartItem) {
      cartItem.quantity++;
    }
  },

  decrementQuantityByCartItem(state, { itemId }) {
    const cartItem = state.cartItems.find(item => item.itemId === itemId);
    if (cartItem) {
      cartItem.quantity--;
      if (cartItem.quantity === 0) {
        state.cartItems.splice(state.cartItems.indexOf(cartItem), 1);
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
