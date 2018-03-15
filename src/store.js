import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    deckId: '',
    hand: [],
    dealer: [],
  },
  getters: {
    deck: state => state.deck,
    hand: state => state.hand,
    dealer: state => state.dealer,
  },
  mutations: {
    setDeckId (state, id) {
      state.deckId = id;
      console.log("@setDeckId: " + state.deckId);
    },
  },
  actions: {
    start(context) {
      console.log("Start new game");
      axios.post('/api/items').then(response => {
        console.log("grabbing response.data");
        console.log(response.data.deck_id);
        context.commit('setDeckId', response.data.deck_id);
        return true;
      }).catch(err => {

      })
    },
  }
});