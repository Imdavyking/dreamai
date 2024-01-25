<template>
  <div class="">
    <div v-if="showNotice" class="tw-block tw-p-3">
      <SeedPhraseNotice
        class="tw-block tw-w-full"
        :is-dismissable="true"
        :type-details="cryptoAccountType"
        @showNotice="(show: boolean) => showNotice = show"
      />
    </div>

    <div
      class="tw-bg-gradient-to-r tw-from-orange-500/10 tw-to-transparent tw-p-5 tw-space-y-4"
    >
      <h1 class="tw-text-3xl">
        Automate your tasks by <strong>creating a workflow</strong>
      </h1>
      <button
        @click="showWorkflowCreation = true"
        class="tw-p-2 tw-px-3 tw-bg-primary tw-rounded-lg tw-text-white tw-ring-4 tw-ring-transparent hover:tw-ring-white tw-transition-all tw-duration-300"
      >
        Create workflow
      </button>
    </div>
    <WorkflowCreation v-model="showWorkflowCreation" />

    <div class="tw-p-5 tw-mt-3">
      <h2 class="tw-font-medium tw-text-lg tw-mb-2">
        All your workflows would be listed below
      </h2>
      <div class="tw-flex tw-flex-col tw-gap-10">
        <template v-if="!fetchingWorkflows && (workflows || []).length">
          <CreatedWorkflowItem
            v-for="(workflow, i) in workflows"
            :key="i"
            :name="workflow.name"
            :workflow="workflow"
          />
        </template>
        <template v-if="fetchingWorkflows">
          <div
            class="tw-border-4 tw-border-dashed tw-rounded-xl tw-h-60 tw-flex tw-flex-col tw-items-center tw-justify-center"
          >
            <v-icon class="!tw-text-2xl tw-text-gray-400 tw-animate-spin"
              >mdi-loading</v-icon
            >
            <p class="tw-text-gray-600 tw-font-medium">Fetching workflows...</p>
          </div>
        </template>
        <template v-if="!fetchingWorkflows && (workflows || []).length === 0">
          <div
            v-if="(workflows || []).length === 0"
            class="tw-border-4 tw-border-dashed tw-rounded-xl tw-h-60 tw-flex tw-flex-col tw-items-center tw-justify-center"
          >
            <v-icon class="!tw-text-7xl tw-text-gray-400">mdi-bat</v-icon>
            <p class="tw-text-gray-600 tw-font-medium">
              No workflows created yet
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SeedPhraseNotice from "@/components/SeedPhraseNotice.vue";
import WorkflowCreation from "@/components/WorkflowCreation.vue";
import CreatedWorkflowItem from "@/components/CreatedWorkflowItem.vue";
import { useWorkflowStore } from "@/stores/workflow";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { AccountType } from "@/types/auth";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const showNotice = ref(true);
const showWorkflowCreation = ref(false);

onMounted(() => {
  // if query is found then user probably refreshed the page
  const workflowQuery = route?.query || {};
  Object.entries(workflowQuery).forEach(([key]) => {
    // TODO: properly wait for network to fetch triggers and functions before showing workflow creation
    if (key.includes("step"))
      setTimeout(() => (showWorkflowCreation.value = true), 1000);
  });
});

const workflowStore = useWorkflowStore();
const workflows = ref<any[]>([]);
const fetchingWorkflows = ref(false);
onMounted(() => {
  fetchingWorkflows.value = true;
  workflowStore
    .fetchWorkflows()
    .then((data) => {
      workflows.value = data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      fetchingWorkflows.value = false;
    });
});

const authStore = useAuthStore();
const accountTypes = ref<AccountType[]>([]);
const cryptoAccountType = computed(() =>
  accountTypes.value.find((item) => item.name === "Crypto")
);
onMounted(() => {
  authStore
    .fetchAccountTypes()
    .then((res) => {
      accountTypes.value = res;
    })
    .catch((err) => {
      toast.error("failed to fetch account types");
    });
});
</script>
