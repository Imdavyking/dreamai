import { defineStore } from "pinia";
import axios from "axios";
import type { Function } from "@/types/workflow";
import { BASE_URL } from "../router/index";
export const useFunctionsStore = defineStore("functions", {
  state: () => ({
    functions: [] as Function[],
  }),
  getters: {
    hasFunctions: (state) => state.functions.length > 0,
  },
  actions: {
    async fetchFunctions(): Promise<Function[]> {
      const { data } = await axios.get(`${BASE_URL}/v1/functions`);
      this.functions = data?.data as Function[];
      return data?.data as Function[];
    },
  },
});
