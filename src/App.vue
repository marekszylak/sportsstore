<template>
  <!-- <store/> -->
  <router-view/>
</template>

<script>
// import Store from './components/Store.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    // Store
  },
  created() {
    this.getData()
    this.initializeCart(this.$store)
  },
  methods: {
    ...mapActions({
      getData: "getData",
      initializeCart: "cart/initializeCart"
    })
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
