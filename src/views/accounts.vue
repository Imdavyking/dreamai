<template>
  <div class="">
    <!-- v-if="showNotice" -->
    <!-- v-if="authStore.getAccounts.length === 0" -->
    <div v-if="showNotice" class="tw-block tw-p-3">
      <SeedPhraseNotice
        v-model="noticeModel"
        class="tw-block tw-w-full"
        :is-dismissable="false"
        :typeDetails="cryptoAccountType"
        @showNotice="(show: boolean) => showNotice = show"
      />
    </div>
    <!-- v-if="authStore.getAccounts.length === 0" -->
    <div
      class="tw-bg-gradient-to-r tw-from-orange-500/10 tw-to-transparent tw-p-5 tw-space-y-4"
    >
      <h1 class="tw-text-3xl">
        Lets <strong>Connect the accounts</strong> you need to automate your
        tasks
      </h1>
      <button
        id="account-type"
        class="tw-p-2 tw-px-3 tw-bg-primary tw-rounded-lg tw-text-white tw-ring-4 tw-ring-transparent hover:tw-ring-white tw-transition-all tw-duration-300"
      >
        Create account
      </button>

      <v-menu activator="#account-type" transition="slide-y-transition">
        <ul
          class="tw-bg-white tw-p-1 tw-mt-2 tw-rounded-lg tw-flex tw-flex-col tw-gap-1 tw-shadow-lg"
        >
          <li
            v-for="(item, index) in accountTypes"
            :key="index"
            :value="index"
            @click="handleSelectAccountType(item.name)"
            class="tw-p-2 tw-py-1 hover:tw-bg-primary/10 tw-rounded-md tw-cursor-pointer"
          >
            {{ item.name }}
          </li>
        </ul>
      </v-menu>
    </div>

    <div class="tw-p-5 tw-mt-3">
      <div class="">
        <h2 class="tw-font-medium tw-text-lg tw-mb-2">
          All your accounts would be listed below
        </h2>

        <div
          v-for="(account, i) in authStore.getAccounts"
          :key="i"
          class="tw-border-b tw-border-gray-300 last-of-type:tw-border-b-0 tw-bg-white tw-p-1"
        >
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-flex-wrap">
              <v-icon class="!tw-text-4xl !tw-text-orange-500"
                >mdi-text-account</v-icon
              >
              <div class="tw-text-lg tw-ml-3 sm:tw-flex tw-gap-4">
                <div>
                  <h2 class="tw-font-medium">
                    {{ account.name }}
                  </h2>
                  <p class="tw-text-gray-500 tw-text-sm">{{ account.type }}</p>
                </div>
                <!-- <p>gismozfexie@yahoo.com</p> -->
              </div>
            </div>
            <div class="tw-flex tw-items-center">
              <v-icon
                @click="handleDeleteAccount(account)"
                class="tw-cursor-pointer !tw-text-primary/50 hover:!tw-text-black"
              >
                mdi-delete
              </v-icon>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!hasAccounts"
        class="tw-border-4 tw-border-dashed tw-rounded-xl tw-h-60 tw-flex tw-flex-col tw-items-center tw-justify-center"
      >
        <v-icon class="!tw-text-7xl tw-text-gray-400">mdi-bat</v-icon>
        <p class="tw-text-gray-600 tw-font-medium">No accounts created yet</p>
      </div>
    </div>

    <v-dialog v-model="showCreationForm" width="500" persistent class="">
      <button>
        <v-icon
          @click="showCreationForm = false"
          class="tw-cursor-pointer tw-absolute -tw-top-4 tw-z-10 tw-rounded-full tw-bg-white !tw-h-10 !tw-w-10"
        >
          mdi-close
        </v-icon>
      </button>
      <v-card class="!tw-rounded-lg">
        <div class="tw-bg-white tw-p-3 sm:tw-p-6">
          <div>
            <h2 class="tw-text-xl tw-font-bold">
              Connect your {{ selectedAccountType }} account
            </h2>
            <form
              @submit.prevent="createAccount"
              class="tw-mt-4 tw-text-base tw-flex tw-flex-col tw-gap-3"
            >
              <label class="tw-relative tw-block">
                <span class="tw-absolute tw-text-base tw-pl-3 tw-pt-1">
                  Give Your Account a Name
                </span>
                <input
                  v-model="accountForm._name"
                  type="text"
                  name="account_name"
                  placeholder="Give Your Account a Name"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                />
              </label>

              <label
                class="tw-relative tw-block"
                v-for="prop in selectedAccount?.parameters"
              >
                <span class="tw-absolute tw-text-base tw-pl-3 tw-pt-1">
                  Enter your {{ prop.name }}:
                </span>
                <input
                  v-model="accountForm[prop.name]"
                  type="text"
                  :name="prop.name"
                  :placeholder="prop.hint"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                />
              </label>

              <button
                class="tw-w-full tw-bg-primary tw-text-white tw-py-4 tw-mt-10 tw-rounded-md tw-font-medium hover:tw-ring-4 tw-ring-primary/30 transition-all tw-duration-300"
                :disabled="creatingAccount"
              >
                <template v-if="!creatingAccount">Connect</template>
                <v-progress-circular
                  v-else
                  indeterminate
                  color="white"
                  size="20"
                  width="2"
                >
                </v-progress-circular>
              </button>
            </form>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import SeedPhraseNotice from "@/components/SeedPhraseNotice.vue";
import { useAuthStore } from "@/stores/auth";
import type { Account, AccountPayload, AccountType } from "@/types/auth";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();

const showNotice = ref(true);
const noticeModel = ref<boolean>();
const selectedAccountType = ref();
const accountTypes = ref<AccountType[]>([]);
const cryptoAccountType = computed(() =>
  accountTypes.value.find((item) => item.name === "Crypto")
);
const selectedAccount = computed(() => {
  return accountTypes.value.find(
    (item) => item.name === selectedAccountType.value
  );
});

onMounted(() => {
  authStore
    .fetchAccountTypes()
    .then((res) => {
      console.log(res);
      accountTypes.value = res;
    })
    .catch((err) => {
      toast.error("failed to fetch account types");
    });
});

const hasAccounts = computed(() => authStore.getAccounts.length > 0);
const handleDeleteAccount = (account: Account) => {
  authStore.deleteAccount({ accountId: account._id });
};

const handleSelectAccountType = (slug: string) => {
  selectedAccountType.value = slug;
  if (slug === "Crypto") return (noticeModel.value = true);
  showCreationForm.value = true;
};
const showCreationForm = ref(false);

const accountForm = ref({} as any);
const creatingAccount = ref(false);
const createAccount = async () => {
  creatingAccount.value = true;
  const accountname = selectedAccount.value?.name;
  const id = toast.loading("creating your " + accountname + " account", {
    position: toast.POSITION.TOP_RIGHT,
  });

  const data: AccountPayload = {
    name: accountForm.value._name,
    account_type_id: selectedAccount.value?._id!,
    account_type: selectedAccount.value?.name!,
    parameters:
      selectedAccount.value?.parameters.map((item: any) => {
        return {
          name: item.name,
          value: accountForm.value[item.name],
          type: item.type,
        };
      }) || [],
  };

  authStore
    .createAccount(data)
    .then(() => {
      toast.update(id, {
        render: "account created",
        type: "success",
        isLoading: false,
      });
      showCreationForm.value = false;
      // clear form
      accountForm.value = {
        _name: "",
      };
    })
    .catch((err) => {
      toast.update(id, {
        render: "account creation failed",
        type: "error",
        isLoading: false,
      });
      console.log(err);
    })
    .finally(() => {
      creatingAccount.value = false;
      setTimeout(() => toast.remove(id), 1000);
    });
};
</script>
