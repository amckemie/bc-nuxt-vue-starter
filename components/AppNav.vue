<template>
  <header>
    <h1>Skyline Ivy</h1>
    <nav>
      <ul>
        <li>
          <nuxt-link exact to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/products">All Products</nuxt-link>
        </li>
        <li>
          <div class="carttotal" v-if="cartCount > 0">{{ cartCount }}</div>
          <nuxt-link to="/cart">Cart</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['cartCount'])
  }
}
</script>
