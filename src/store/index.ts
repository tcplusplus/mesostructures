import { Dataset } from '@/classes/dataset';
import { createStore } from 'vuex';

export default createStore({
  state: {
    currentDataset: Dataset.loadTestSet(),
  },
  getters: {
  },
  mutations: {
    updateDataset(state, dataset) {
      state.currentDataset = dataset;
    },
  },
  actions: {
    updateDataset(context, dataset: Dataset) {
      context.commit('updateDataset', dataset);
    },
  },
  modules: {
  },
});
