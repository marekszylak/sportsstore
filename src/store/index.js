import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
import OrdersModule from "./orders";
import AuthModule from "./auth";
Vue.use(Vuex);
// const testData = [];
// for (let i = 1; i <= 10; i++) {
//   testData.push({
//     id: i, name:`Produkt #${i}`, category: `Kategoria ${i % 3}`,
//     description: `To jest Produkt #${i}`, price: i * 50
//   })
// }
// const baseUrl = 'http://localhost:3500'
const baseUrl = '/api'
const productsUrl = `${baseUrl}/products`
const categoriesUrl = `${baseUrl}/categories`
export default new Vuex.Store({
  // strict: true,
  strict: false,
  modules: {
    cart: CartModule,
    orders: OrdersModule,
    auth: AuthModule
  },
  state: {
    // products: testData,
    // productsTotal: testData.length,

    categoriesData: [],
    pages: [],
    serverPageCount: 0,
    // products: [],
    // productsTotal: 0,
    currentPage: 1,
    pageSize: 4,
    currentCategory: "Wszystkie",
    searchTerm: '',
    showSearch: false
  },
  getters: {
    // productsFilteredByCategory: state => state.products.filter( p => state.currentCategory == 'Wszystkie' ||
    //   p.category == state.currentCategory),
    // processedProducts: (state, getters) => {
    processedProducts: (state) => {
      // let index = (state.currentPage - 1) * state.pageSize
      // return getters.productsFilteredByCategory.slice(index, index + state.pageSize)
      return state.pages[state.currentPage]
    },
    // pageCount: (state, getters) => Math.ceil(getters.productsFilteredByCategory.length / state.pageSize),
    pageCount: (state) => state.serverPageCount,
    // categories: state => ['Wszystkie', ...new Set(state.products.map(p =>p.category).sort())]
    categories: state => ['Wszystkie', ...state.categoriesData],
    productById: (state) => (id) => { 
      return state.pages[state.currentPage].find(p => p.id == id)
    }
  },
  mutations: {
    _setCurrentPage(state, page) {
      state.currentPage = page
    },
    _setPageSize(state, size) {
      state.pageSize = size
      state.currentPage = 1
    },
    _setCurrentCategory(state, category) {
      state.currentCategory = category
      state.currentPage = 1
    },
    // setData(state, data) {
    //   state.products = data.prodData
    //   state.productsTotal = data.prodData.length
    //   state.categoriesData = data.catData
    // }
    addPage(state, page) {
      for (let i = 0; i < page.pageCount; i++) {
        Vue.set(state.pages, page.number + i, 
                page.data.slice(i * state.pageSize, 
                (i * state.pageSize) + state.pageSize))
      }
    },
    clearPages(state) {
      state.pages.splice(0, state.pages.length)
    },
    setCategories(state, categories) {
      state.categoriesData = categories
    },
    setPageCount(state, count) {
      state.serverPageCount = Math.ceil(Number(count) / state.pageSize)
    },
    setShowSearch(state, show) {
      state.showSearch = show
    },
    setSearchTerm(state, term) {
      state.searchTerm = term
      state.currentPage = 1
    },
    _addProduct(state, product) {
      state.pages[state.currentPage].unshift(product)
    },
    _updateProduct(state, product) {
      let page = state.pages[state.currentPage]
      let index = page.findIndex(p => p.id == product.id)
      Vue.set(page, index, product)
    }
  },
  actions: {
    async getData(context) {
      // let prodData = (await Axios.get(productsUrl)).data
      // let catData = (await Axios.get(categoriesUrl)).data
      // context.commit("setData", {prodData, catData})
      await context.dispatch("getPage", 2)
      context.commit("setCategories", (await Axios.get(categoriesUrl)).data)
    },
    async getPage(context, getPageCount = 1) {
      let url = `${productsUrl}?_page=${context.state.currentPage}`
              + `&_limit=${context.state.pageSize * getPageCount}`
      if (context.state.currentCategory != "Wszystkie") {
        url += `&category=${context.state.currentCategory}`
      }
      if (context.state.searchTerm != "") {
        url += `&q=${context.state.searchTerm}`
      }
      let response = await Axios.get(url)
      context.commit("setPageCount", response.headers['x-total-count'])
      context.commit("addPage", { number: context.state.currentPage,
                                  data: response.data,
                                  pageCount: getPageCount })
    },
    async addProduct(context, product) {
      let data = (await context.getters.authenticatedAxios.post(productsUrl, product)).data
      product.id = data.id
      this.commit("_addProduct", product)
    },
    async removeProduct(context, product) {
      await context.getters.authenticatedAxios.delete(`${productsUrl}/${product.id}`)
      context.commit('clearPages')
      context.dispatch('getPage', 1)
    },
    async updateProduct(context, product) {
      await context.getters.authenticatedAxios.put(`${productsUrl}/${product.id}`, product)
      context.commit('_updateProduct', product)
    },
    setCurrentPage(context, page) {
      context.commit("_setCurrentPage", page)
      if (!context.state.pages[page]) {
        context.dispatch("getPage")
      }
    },
    setPageSize(context, size) {
      context.commit("clearPages")
      context.commit("_setPageSize", size)
      context.dispatch("getPage", 2)
    },
    setCurrentCategory(context, category) {
      context.commit("clearPages")
      context.commit("_setCurrentCategory", category)
      context.dispatch("getPage", 2)
    },
    search(context, term) {
      context.commit("setSearchTerm", term)
      context.commit("clearPages")
      context.dispatch("getPage", 2)
    },
    clearSearchTerm(context) {
      context.commit("setSearchTerm", '')
      context.commit("clearPages")
      context.dispatch("getPage", 2)
    }
  }
})