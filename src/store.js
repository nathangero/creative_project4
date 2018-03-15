import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      hand: [],
      dealer: [],
  },
  getters: {
      hand: state => state.hand,
      dealer: state => state.dealer,
  },
  mutations: {
      setHand (state, hand) {
          state.hand = hand;
      },
      setDealer (state, dealer) {
        state.dealer = dealer;
      },
  },
  actions: {
    getItems(context) {
        console.log("getting items");
        axios.get("/api/items").then(response => {
          console.log(response.data);
          // context.commit('setHand', response.data);

          return true;
        }).catch(err => {
        });
      },
      addItem(context, item) {
        axios.post("/api/items", item).then(response => {
          return context.dispatch('getItems');
        }).catch(err => {
        });
      },
      updateItem(context, item) {
        axios.put("/api/items/" + item.id, item).then(response => {
          return true;
        }).catch(err => {
        });
      },
      deleteItem(context, item) {
        axios.delete("/api/items/" + item.id).then(response => {
      return context.dispatch('getItems');
        }).catch(err => {
        });
      }
  
  }
});