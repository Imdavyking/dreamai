<template>
  <div class="">
    <div class="tw-space-y-4">
      <div
        class="tw-bg-gradient-to-r tw-from-orange-500/10 tw-to-transparent tw-p-5 tw-space-y-4"
      >
        <h1 class="tw-text-3xl">
          View <strong>History</strong> of your workflow Runs
        </h1>
      </div>

      <section class="tw-py-1 tw-p-5">
        <div class="tw-w-full tw-xl:w-8/12 tw-mb-12 tw-xl:mb-0 tw-mx-auto">
          <div
            class="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-break-words tw-w-full tw-mb-6 tw-rounded"
          >
            <div class="tw-rounded-t tw-mb-0 tw-py-3 tw-border-0">
              <div class="tw-flex tw-flex-wrap tw-items-center">
                <div
                  class="tw-relative tw-w-full tw-max-w-full tw-flex-grow tw-flex-1"
                >
                  <h3 class="tw-font-bold tw-text-base tw-text-blueGray-700">
                    Workflow Runs
                  </h3>
                </div>
                <div
                  class="tw-relative tw-w-full tw-px-4 tw-max-w-full tw-flex-grow tw-flex-1 tw-text-right"
                >
                  <!-- <button
                    class="tw-bg-indigo-500 tw-text-white tw-active:bg-indigo-600 tw-text-xs tw-font-bold tw-uppercase tw-px-3 tw-py-1 tw-rounded tw-outline-none tw-focus:outline-none tw-mr-1 tw-mb-1 tw-ease-linear tw-transition-all tw-duration-150"
                    type="button"
                  >
                    See all
                  </button> -->
                </div>
              </div>
            </div>

            <div class="tw-block tw-w-full tw-overflow-x-auto">
              <table
                v-if="!fetchingRuns && runs.length > 0"
                class="tw-items-center tw-bg-transparent tw-w-full tw-border-collapse"
              >
                <thead>
                  <tr>
                    <th
                      class="tw-bg-blueGray-50 tw-text-blueGray-500 tw-align-middle tw-border tw-border-solid tw-border-gray-300 tw-py-3 tw-text-xs tw-uppercase tw-border-l-0 tw-border-r-0 tw-whitespace-nowrap tw-font-semibold tw-text-left"
                    >
                      Workflow name
                    </th>
                    <th
                      class="tw-px-6 tw-bg-blueGray-50 tw-text-blueGray-500 tw-align-middle tw-border tw-border-solid tw-border-gray-300 tw-py-3 tw-text-xs tw-uppercase tw-border-l-0 tw-border-r-0 tw-whitespace-nowrap tw-font-semibold tw-text-left"
                    >
                      Steps
                    </th>
                    <th
                      class="tw-px-6 tw-bg-blueGray-50 tw-text-blueGray-500 tw-align-middle tw-border tw-border-solid tw-border-gray-300 tw-py-3 tw-text-xs tw-uppercase tw-border-l-0 tw-border-r-0 tw-whitespace-nowrap tw-font-semibold tw-text-left"
                    >
                      Status
                    </th>
                    <th
                      class="tw-px-6 tw-bg-blueGray-50 tw-text-blueGray-500 tw-align-middle tw-border tw-border-solid tw-border-gray-300 tw-py-3 tw-text-xs tw-uppercase tw-border-l-0 tw-border-r-0 tw-whitespace-nowrap tw-font-semibold tw-text-left"
                    >
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="run in runs" :key="run._id">
                    <th
                      class="tw-border-t-0 tw-align-middle tw-border-l-0 tw-border-r-0 tw-text-xs tw-whitespace-nowrap tw-py-4 tw-text-left tw-text-blueGray-700"
                    >
                      <router-link :to="`/history/${run._id}`">
                        {{ run.flow_name }}
                      </router-link>
                    </th>
                    <td
                      class="tw-border-t-0 tw-px-6 tw-align-middle tw-border-l-0 tw-border-r-0 tw-text-xs tw-whitespace-nowrap tw-py-4"
                    >
                      {{ run.steps.length }}
                    </td>
                    <td
                      class="tw-border-t-0 tw-px-6 tw-align-center tw-border-l-0 tw-border-r-0 tw-text-xs tw-whitespace-nowrap tw-py-4"
                    >
                      {{ run.success_step ? "Success" : "Failed" }}
                    </td>
                    <td
                      class="tw-border-t-0 tw-px-6 tw-align-middle tw-border-l-0 tw-border-r-0 tw-text-xs tw-whitespace-nowrap tw-py-4"
                    >
                      <i
                        class="tw-fas tw-fa-arrow-up tw-text-emerald-500 tw-mr-4"
                      ></i>
                      {{ run.created_at }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                v-else-if="fetchingRuns"
                class="tw-border-4 tw-border-dashed tw-rounded-xl tw-h-60 tw-flex tw-flex-col tw-items-center tw-justify-center"
              >
                <v-icon class="!tw-text-2xl tw-text-gray-400 tw-animate-spin"
                  >mdi-loading</v-icon
                >
                <p class="tw-text-gray-600 tw-font-medium">
                  Fetching workflow history...
                </p>
              </div>

              <div
                v-if="!fetchingRuns && (runs || []).length === 0"
                class="tw-border-4 tw-border-dashed tw-rounded-xl tw-h-60 tw-flex tw-flex-col tw-items-center tw-justify-center"
              >
                <v-icon class="!tw-text-7xl tw-text-gray-400">mdi-bat</v-icon>
                <p class="tw-text-gray-600 tw-font-medium">
                  No workflows executed yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from "@/stores/workflow";
import type { WorkflowHistory } from "@/types/workflow";
import { ref, onMounted } from "vue";

const runs = ref<WorkflowHistory[]>([]);

const workflowStore = useWorkflowStore();
const fetchingRuns = ref(true);
onMounted(() => {
  fetchingRuns.value = true;
  workflowStore
    .fetchWorkflowHistory()
    .then((res) => {
      console.log(res);
      runs.value = res;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      fetchingRuns.value = false;
    });
});
</script>
