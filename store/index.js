export const state = () => ({
  cartUIStatus: 'idle',
  cart: []
})

export const getters = {
  featuredProducts: state => state.storedata.slice(0, 3),
  women: state => state.storedata.filter(el => el.gender === 'Female'),
  men: state => state.storedata.filter(el => el.gender === 'Male'),
  // cartCount: (state) => {
  //   console.log('In Cart Count')
  //   if (!state.cart.length) { return 0 }
  //   return state.cart.reduce((ac, next) => ac + next.quantity, 0)
  // },
  cartCount: (state) => {
    return (state.cart.length) ? state.cart.length : 0
  }
}

export const mutations = {
  updateCartUI: (state, payload) => {
    state.cartUIStatus = payload
  },
  // clearCart: (state) => {
  //   ;(state.cart = []), (state.cartUIStatus = 'idle')
  // },
  // ADD_TO_CART (state, productId) {
  //   console.log('Adding to cart')
  //   console.log(state.cart)
  //   state.cart.push(productId)
  // }
  ADD_TO_CART: (state, productId) => {
    // const itemfound = state.cart.find(el => el.id === payload)
    // console.log(itemfound)
    // itemfound
    //   ? (itemfound.quantity += payload.quantity)
    //   : state.cart.push(payload)
    console.log('Adding to cart')
    console.log(state.cart)
    state.cart.push(productId)
  }
}

export const actions = {
  addToCart (context, productId) {
    context.commit('ADD_TO_CART', productId)
  }
  // async postStripeFunction({ getters, commit }, payload) {
  //   commit("updateCartUI", "loading")

  //   try {
  //     await axios
  //       .post(
  //         "https://ecommerce-netlify.netlify.com/.netlify/functions/index",
  //         {
  //           stripeEmail: payload.stripeEmail,
  //           stripeAmt: Math.floor(getters.cartTotal * 100), //it expects the price in cents, as an integer
  //           stripeToken: "tok_visa", //testing token, later we would use payload.data.token
  //           stripeIdempotency: uuidv1() //we use this library to create a unique id
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json"
  //           }
  //         }
  //       )
  //       .then(res => {
  //         if (res.status === 200) {
  //           commit("updateCartUI", "success")
  //           setTimeout(() => commit("clearCart"), 5000)
  //         } else {
  //           commit("updateCartUI", "failure")
  //           // allow them to try again
  //           setTimeout(() => commit("updateCartUI", "idle"), 5000)
  //         }

  //         console.log(JSON.stringify(res, null, 2))
  //       })
  //   } catch (err) {
  //     console.log(err)
  //     commit("updateCartUI", "failure")
  //   }
  // }
}
