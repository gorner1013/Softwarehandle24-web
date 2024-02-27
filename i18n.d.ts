import type { Global } from './dictionary/global'
import type { Home } from './dictionary/home'
import type { Login } from './dictionary/login'
import type { Register } from './dictionary/register'
import type { Recover } from './dictionary/recover'
import type { Account } from './dictionary/account'
import type { Cart } from './dictionary/cart'
import type { Checkout } from './dictionary/checkout'
import type { Order } from './dictionary/order'
import type { Search } from './dictionary/search'
import type { Pages } from './dictionary/pages'
import type { Frontends } from './dictionary/frontends'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    global: Global
    home: Home
    login: Login
    register: Register
    recover: Recover
    account: Account
    cart: Cart
    checkout: Checkout
    order: Order
    search: Search
    pages: Pages
    frontends: Frontends
  }
}

