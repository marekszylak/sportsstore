<template>
  <div class="container-fluid">
    <div class="row mt-2" v-for="c in categories" v-bind:key="c">
      <button class="btn btn-block"
      v-on:click="setCurrentCategory(c)"
      v-bind:class="c == currentCategory ? 'btn-primary' : 'btn-secondary'">
        {{ c }}
      </button>
    </div>
  </div>
</template>

<script>
// import { mapState, mapGetters, mapMutations } from "vuex"
import { mapState, mapGetters, mapActions } from "vuex"
export default {
  computed: {
    ...mapState(["currentCategory"]),
    ...mapGetters(["categories"])
  },
  methods: {
    // ...mapMutations(["setCurrentCategory"])
    ...mapActions(["setCurrentCategory"])
  }
}
</script>
