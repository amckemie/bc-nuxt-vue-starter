<template>
  <div id="cart">
    <transition name="fade" mode="out-in">
      <div v-if="cartCount > 0" key="my-cart" class="my-cart">
        <h3 class="my-cart__total-items">
          Total items: {{ cartCount }}
        </h3>
        <div class="collected-product-list">
          <transition-group name="fade" tag="div">
            <SfCollectedProduct
              v-for="product in products"
              :key="product.id"
              v-model="product.qty"
              :image="product.image"
              :title="product.title"
              :regular-price="product.price.regular | price"
              :special-price="product.price.special | price"
              class="collected-product"
              @click:remove="removeHandler(product)"
            >
              <template #configuration>
                <div class="collected-product__properties">
                  <SfProperty
                    v-for="(property, key) in product.configuration"
                    :key="key"
                    :name="property.name"
                    :value="property.value"
                  />
                </div>
              </template>
              <template #actions>
                <div class="collected-product__actions">
                  <SfButton class="sf-button--text product__action">
                    Save for later
                  </SfButton>
                  <SfButton class="sf-button--text product__action">
                    Add to compare
                  </SfButton>
                </div>
              </template>
            </SfCollectedProduct>
          </transition-group>
        </div>
        <SfProperty class="sf-property--full-width my-cart__total-price">
          <template #name>
            <span class="sf-property__name">TOTAL</span>
          </template>
          <template #value>
            <SfPrice :regular="totalPrice | price" class="sf-price--big" />
          </template>
        </SfProperty>
        <SfButton class="sf-button--full-width">
          Go to checkout
        </SfButton>
      </div>
      <div v-else key="empty-cart" class="empty-cart">
        <div class="empty-cart__banner">
          <img
            src="@storefront-ui/shared/icons/empty_cart.svg"
            alt=""
            class="empty-cart__icon"
          >
          <h3 class="empty-cart__label">
            Your bag is empty
          </h3>
          <p class="empty-cart__description">
            Looks like you haven’t added any items to the bag yet. Start
            shopping to fill it in.
          </p>
        </div>
        <SfButton class="sf-button--full-width color-secondary">
          Start shopping
        </SfButton>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import '@storefront-ui/vue/styles.scss'
import {
  SfButton,
  SfProperty,
  SfPrice,
  SfCollectedProduct
} from '@storefront-ui/vue'
export default {
  name: 'Cart',
  components: {
    SfButton,
    SfProperty,
    SfPrice,
    SfCollectedProduct
  },
  filters: {
    price: (price) => {
      if (!price) {
        return
      }
      return `$${price}`
    }
  },
  async asyncData ({ params }) {
    const result = await axios({
      method: 'POST',
      url: 'https://kari-morars-store.mybigcommerce.com/graphql',
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJlYXQiOjIxMzM0NDM2NjEsInN1Yl90eXBlIjoyLCJ0b2tlbl90eXBlIjoxLCJjb3JzIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJjaWQiOjEsImlhdCI6MTU4MjYxNTM2Mywic3ViIjoidGl5N3Fncm54NWIxbzAzcTRzcmJ2MXR6aXltNTlrZiIsInNpZCI6MTAwMDk5MDM1OSwiaXNzIjoiQkMifQ.GoN-AmBQXWGS_xA6GUaKI_OcxPH8mPIQLhbElBaH4gTBv4o1jb_xTKl3D1dwZZsSO8QKspPjlSE-ousLRnX2tA'
      },
      data: {
        query: `
          query LookUpUrl {
            site {
              route(path: "/smith-journal-13/") {
                node {
                  __typename
                  ... on Product {
                    id 
                    entityId
                    name
                    description
                    defaultImage {
                      url640wide: url(width: 640)
                    }
                    images {
                      edges {
                        node {
                          mobile: url(width: 400, height: 400)
                          desktop: url(width: 600, height: 600)
                          big: url(width: 1200, height: 1200)
                        }
                      }
                    }
                    brand {
                      name
                    }
                    path
                    prices {
                      price {
                        value
                        currencyCode
                      }
                      salePrice {
                        value
                        currencyCode
                      }
                    }
                    reviewSummary {
                      numberOfReviews
                      summationOfRatings
                    }
                  }
                }
              }
            }
          }
        `
      }
    })
    const productData = result.data.data.site.route.node
    // debugger
    productData.imageList = productData.images.edges.map((t) => {
      return {
        mobile: { url: t.node.mobile },
        desktop: { url: t.node.desktop },
        big: { url: t.node.big }
      }
    })
    return { product: productData }
  },
  computed: {
    ...mapGetters(['cartCount']),
    totalPrice () {
      return 20 * 10.00
      // return this.products
      //   .reduce((totalPrice, product) => {
      //     const price = product.price.special
      //       ? product.price.special
      //       : product.price.regular
      //     const summary = parseFloat(price).toFixed(2) * product.qty
      //     return totalPrice + summary
      //   }, 0)
      //   .toFixed(2)
    }
  },
  methods: {
    removeHandler (product) {
      const products = [...this.products]
      this.products = products.filter(element => element.id !== product.id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
#cart {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font-family: $body-font-family-secondary;
    font-size: $font-size-big-mobile;
    font-weight: $body-font-weight-secondary;
  }
  &__total-price {
    margin-bottom: $spacer-big;
  }
}
.collected-product-list {
  flex: 1;
  margin: $spacer-big - $spacer-big;
}
.collected-product {
  margin: $spacer-big 0;
  &__properties {
    margin-top: $spacer-big;
  }
  &__actions {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
    @at-root.collected-product:hover & {
      @include for-desktop {
        opacity: 1;
      }
    }
  }
}
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__icon {
    width: 18.125rem;
    height: 12.3125rem;
    margin-left: 60%;
    @include for-desktop {
      margin-left: 50%;
    }
  }
  &__label,
  &__description {
    line-height: 1.6;
    text-align: center;
  }
  &__label {
    margin-top: $spacer-extra-big;
    font-size: $font-size-big-mobile;
    @include for-desktop {
        font-size: $font-size-big-desktop;
    }
  }
  &__description {
    margin-top: $spacer-big;
  }
}
.sf-collected-product {
  max-width: none;
}
</style>
