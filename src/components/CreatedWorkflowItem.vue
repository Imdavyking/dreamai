<template>
  <div class="tw-ring tw-ring-orange-500/30 tw-rounded-md">
    <div>
      <div class="tw-flex tw-justify-between tw-p-2 tw-bg-orange-200/5">
        <h3 class="tw-text-lg">
          <strong>{{ workflow.name }}</strong>
        </h3>
        <v-icon
          @click="foldTrigger = !foldTrigger"
          class="tw-cursor-pointer tw-text-black"
        >
          {{
            !foldTrigger
              ? "mdi-unfold-less-horizontal"
              : "mdi-unfold-more-horizontal"
          }}
        </v-icon>
      </div>
      <hr class="tw-border-orange-500/30" />
      <div class="tw-p-3 tw-text-center">
        <template v-if="!foldTrigger">
          <div class="tw-text-start tw-truncate tw-space-y-1">
            <h4>
              Trigger name:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ workflow.trigger.name }}</span
              >
            </h4>
            <h4>
              slug:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ workflow.trigger.slug }}</span
              >
            </h4>
            <pre class="tw-text-xs">{{
              { parameters: workflow.trigger.parameters }
            }}</pre>
          </div>
        </template>
        <template v-else>
          <v-icon class="!tw-text-5xl tw-text-gray-300"
            >mdi-dots-horizontal</v-icon
          >
        </template>
      </div>
    </div>
    <div>
      <hr class="tw-border-orange-500/30" />
      <div class="tw-flex tw-justify-between tw-p-2 tw-bg-orange-200/5">
        <h3 class="tw-text-lg">Steps</h3>

        <v-icon
          @click="foldSteps = !foldSteps"
          class="tw-cursor-pointer tw-text-black"
        >
          {{
            !foldSteps
              ? "mdi-unfold-less-horizontal"
              : "mdi-unfold-more-horizontal"
          }}
        </v-icon>
      </div>
      <hr class="tw-border-orange-500/30" />
      <div class="tw-p-3 tw-text-center">
        <template v-if="!foldSteps">
          <div
            v-for="step in workflow.steps"
            class="tw-text-start tw-truncate tw-space-y-1"
          >
            <h4>
              Step name:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ step.name }}</span
              >
            </h4>
            <h4>
              Function:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ step.function }}</span
              >
            </h4>
            <h4>
              Function_id:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ step.function_id }}</span
              >
            </h4>
            <pre class="tw-text-xs">{{ { parameters: step.parameters } }}</pre>
          </div>
        </template>
        <template v-else>
          <v-icon class="!tw-text-5xl tw-text-gray-300"
            >mdi-dots-horizontal</v-icon
          >
        </template>
      </div>
    </div>
    <div>
      <hr class="tw-border-orange-500/30" />
      <div class="tw-flex tw-justify-between tw-p-2 tw-bg-orange-200/5">
        <h3 class="tw-text-lg">Outputs</h3>

        <v-icon
          @click="foldOutputs = !foldOutputs"
          class="tw-cursor-pointer tw-text-black"
        >
          {{
            !foldOutputs
              ? "mdi-unfold-less-horizontal"
              : "mdi-unfold-more-horizontal"
          }}
        </v-icon>
      </div>
      <hr class="tw-border-orange-500/30" />
      <div class="tw-p-3 tw-text-center">
        <template v-if="!foldOutputs">
          <div
            v-for="outP in outPut"
            class="tw-text-start tw-truncate tw-space-y-1"
          >
            <h4>
              Flow name:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ outP.flow_name }}</span
              >
            </h4>
            <h4>
              Completed:
              <span
                class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl"
                >{{ outP.completed }}</span
              >
            </h4>

            <h4>
              Ouputs:
              <pre class="tw-text-xs">{{ { results: outP.outputs } }}</pre>
            </h4>
          </div>
        </template>
        <template v-else>
          <v-icon class="!tw-text-5xl tw-text-gray-300"
            >mdi-dots-horizontal</v-icon
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { OutputType } from "@/types/auth";
const outPut = ref<OutputType[]>([]);
const props = defineProps<{
  workflow: any;
}>();
import { useAuthStore } from "../stores/auth";
import { BASE_URL } from "../router/index";

const foldTrigger = ref(true);
const foldSteps = ref(true);
const foldOutputs = ref(true);
import axios from "axios";
onMounted(() => {
  fetchRuns();
});

async function fetchRuns(): Promise<OutputType[]> {
  const authstore = useAuthStore();
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/v1/flows/runs`,
        authstore.getAuthHeader
      );

      outPut.value = data.data;

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
}
</script>
