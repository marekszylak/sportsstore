import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
import OrdersModule from "./orders";
Vue.use(Vuex);
// const testData = [];
// for (let i = 1; i <= 10; i++) {
//   testData.push({
//     id: i, name:`Produkt #${i}`, category: `Kategoria ${i % 3}`,
//     description: `To jest Produkt #${i}`, price: i * 50
//   })
// }
const baseUrl = 'http://localhost:3500'
const productsUrl = `${baseUrl}/products`
const categoriesUrl = `${baseUrl}/categories`
export default new Vuex.Store({
  strict: true,
  modules: {
    cart: CartModule,
    orders: OrdersModule 
  },
  state: {
    // products: testData,
    // productsTotal: testData.length,
    products: [],
    categoriesData: [],
    productsTotal: 0,
    currentPage: 1,
    pageSize: 4,
    currentCategory: 'Wszystkie'
  },
  getters: {
    productsFilteredByCategory: state => state.products.filter( p => state.currentCategory == 'Wszystkie' ||
      p.category == state.currentCategory),
    processedProducts: (state, getters) => {
      let index = (state.currentPage - 1) * state.pageSize
      return getters.productsFilteredByCategory.slice(index, index + state.pageSize)
    },
    pageCount: (state, getters) => Math.ceil(getters.productsFilteredByCategory.length / state.pageSize),
    // categories: state => ['Wszystkie', ...new Set(state.products.map(p =>p.category).sort())]
    categories: state => ['Wszystkie', ...state.categoriesData]
  },
  mutations: {
    setCurrentPage(state, page) {
      state.currentPage = page
    },
    setPageSize(state, size) {
      state.pageSize = size
      state.currentPage = 1
    },
    setCurrentCategory(state, category) {
      state.currentCategory = category
      state.currentPage = 1
    },
    setData(state, data) {
      state.products = data.prodData
      state.productsTotal = data.prodData.length
      state.categoriesData = data.catData
    }
  },
  actions: {
    async getData(context) {
      let prodData = (await Axios.get(productsUrl)).data
      let catData = (await Axios.get(categoriesUrl)).data
      context.commit("setData", {prodData, catData})
    }
  }
})