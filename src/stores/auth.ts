import type { AccountPayload, AccountType, User } from "@/types/auth";
import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";
import { useWorkflowStore } from "./workflow";
import axios from "axios";

type AuthHeader = {
  headers: {
    Authorization: string;
  };
};
const cookies = useCookies(["user"]);
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: cookies.get<boolean>("isLoggedIn") || false,
    user: cookies.get<User>("user") || null,
    token: cookies.get<string>("token") || null,
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getAccounts: (state) => state.user?.accounts || [],
    hasPrivateKey: (state) => state.user?.hasSetPrivateKey || false,
    hasPrivateKeyLocal: (state) =>
      state.user.accounts.some((account) => account.type === "Crypto"),
    getAuthHeader: (state) => {
      return !!state.token
        ? {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        : ({} as AuthHeader | {});
    },
    getPseudoName: (state) => {
      return (state.user.email || "").split("@")?.[0] || "";
    },
  },
  actions: {
    register(payload: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    }) {
      return new Promise(async (resolve, reject) => {
        try {
          await axios.post("/v1/auth/register", payload);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    login(payload: { email: string; password: string }) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("data on");
          const { data } = (await axios.post("/v1/auth/login", payload)) as {
            data: {
              data: {
                access_token: string;
                user: User;
              };
            };
          };
          console.log("data off");
          console.log(data);
          const { access_token, user } = data?.data;
          cookies.set("isLoggedIn", true);
          cookies.set("user", user);
          cookies.set("token", access_token);
          this.isLoggedIn = true;
          this.user = user;
          this.token = access_token;
          resolve(data);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    logout() {
      this.isLoggedIn = false;
      cookies.remove("isLoggedIn");
      cookies.remove("user");
      cookies.remove("token");
      const workflowStore = useWorkflowStore();
      workflowStore.clearWorkflowCreation();
      setTimeout(() => window.location.reload());
    },
    async fetchAccountTypes(): Promise<AccountType[]> {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.get(
            "/v1/accounts/types",
            this.getAuthHeader
          );
          resolve(data.data);
        } catch (error) {
          reject(error);
        }
      });
    },
    createAccount(payload: AccountPayload) {
      return new Promise(async (resolve, reject) => {
        try {
          JSON.stringify(payload);
          const { data } = await axios.post(
            "/v1/accounts",
            payload,
            this.getAuthHeader
          );
          console.log({
            data,
          });
          cookies.set("user", {
            ...this.user,
            accounts: [...this.user.accounts, data.data],
          });
          this.user.accounts.push(data.data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteAccount({ accountId }: { accountId: string }) {
      return new Promise(async (resolve, reject) => {
        try {
          await axios.delete(`/v1/accounts/${accountId}`, this.getAuthHeader);
          const accounts = this.user.accounts.filter(
            (account) => account._id !== accountId
          );
          cookies.set("user", {
            ...this.user,
            accounts,
          });
          this.user.accounts = accounts;
          if (!this.hasPrivateKeyLocal) this.setHasPrivateKey(false);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    setHasPrivateKey(value: boolean) {
      this.user.hasSetPrivateKey = value;
      cookies.set("user", {
        ...this.user,
        hasSetPrivateKey: value,
      });
    },
  },
});
