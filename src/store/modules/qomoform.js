import { defineStore } from "pinia";

export const useQomoformStore = defineStore("qomoform", {
  state: () => {
    return {
      defaultFields: []
    };
  },
  actions: {
    updateDefaultFields(newVal) {
      this.defaultFields = newVal;
    }
  }
});
