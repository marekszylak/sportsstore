<template>
  <div class="float-right">
    <small>
      Twój koszyk:
      <span v-if="itemCount > 0">
        {{ itemCount }} elementy(ów) {{ totalPrice | currency }}
      </span>
      <span v-else>
        (pusty)
      </span>
      <router-link to="/cart" class="btn btn-sm bg-dark text-white"
                   v-bind:disabled="itemCount == 0">
        <i class="fa fa-shopping-cart"></i>
      </router-link>
    </small>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters({
      itemCount: "cart/itemCount",
      totalPrice: "cart/totalPrice"
    })
  }
}
</script>
