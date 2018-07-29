import commerce from "../../api/commerce";

// state
const state = {
  allProducts: []
};

// getters
const getters = {
  getAllProducts: state => {
    return state.allProducts;
  }
};

// actions
const actions = {
  getAllProducts({ commit }) {
    commerce.getProducts(products => {
      commit("setProducts", products);
    });
  }
};

// mutations
const mutations = {
  setProducts(state, products) {
    state.allProducts = products;
  },

  incrementInventoryByProduct(state, { pid }) {
    const product = state.allProducts.find(product => product.pid === pid);
    if (product) {
      product.inventory++;
    }
  },

  decrementInventoryByProduct(state, { pid }) {
    const product = state.allProducts.find(product => product.pid === pid);
    if (product) {
      product.inventory--;
    }
  },

  restockInventoryByProduct(state, { pid, quantity }) {
    const product = state.allProducts.find(product => product.pid === pid);
    if (product) {
      product.inventory += quantity;
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
