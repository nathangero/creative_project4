import Vue from 'vue'
import Router from 'vue-router'
import Blackjack from '@/components/Blackjack'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Blackjack',
      component: Blackjack
    }
  ]
})
