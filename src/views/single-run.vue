<template>
  <div class="">
    <div
      class="tw-bg-gradient-to-r tw-from-primary/10 tw-to-transparent tw-p-5 tw-space-y-4"
    >
      <h1 class="tw-text-3xl">View Record of your workflow Run</h1>
    </div>
  </div>

  <section class="tw-p-6 tw-space-y-6" v-if="!!run">
    <h1 class="tw-text-2xl tw-font-semibold">Event Record</h1>
    <div class="tw-bg-white tw-rounded-lg tw-shadow-md">
      <div class="tw-flex tw-justify-between tw-items-center tw-p-4">
        <h2 class="tw-text-lg tw-font-semibold">Flow Information</h2>
      </div>
      <div class="tw-p-4 tw-space-y-2">
        <p class="tw-text-gray-600">Flow Name: {{ run?.flow_name }}</p>
        <p class="tw-text-gray-600">Created At: {{ run?.created_at }}</p>
      </div>
    </div>
    <div class="tw-bg-white tw-rounded-lg tw-shadow-md">
      <div class="tw-flex tw-justify-between tw-items-center tw-p-4">
        <h2 class="tw-text-lg tw-font-semibold">Trigger</h2>
      </div>
      <div class="tw-p-4 tw-space-y-2">
        <p class="tw-text-gray-600">Name: {{ run?.trigger?.name }}</p>
        <p class="tw-text-gray-600">Slug: {{ run?.trigger?.slug }}</p>
        <p class="tw-text-gray-600">Trigger Parameters</p>

        <!-- now list all the parameters the trigger used and value, flex them -->
        <p class="tw-text-gray-600 tw-mt-2">Parameters:</p>
        <div
          class="tw-flex tw-space-x-4 tw-items-center"
          v-for="param in run?.trigger.parameters"
        >
          <input
            class="tw-border tw-rounded tw-p-2 tw-w-1/2"
            placeholder="Key"
            type="text"
            :value="param.name"
            disabled
          /><input
            class="tw-border tw-rounded tw-p-2 tw-w-1/2"
            placeholder="Value"
            type="text"
            :value="JSON.stringify(param.value)"
          />
        </div>
      </div>
    </div>
    <div
      class="tw-bg-white tw-rounded-lg tw-shadow-md"
      v-for="step in run?.steps"
    >
      <div class="tw-flex tw-justify-between tw-items-center tw-p-4">
        <h2 class="tw-text-lg tw-font-semibold">{{ step.name }}</h2>
      </div>
      <div class="tw-p-4 tw-space-y-2">
        <p class="tw-text-gray-600">
          Status: {{ step.success ? "Successful" : "Failed" }}
        </p>
        <p class="tw-text-gray-600">Function: {{ step.function }}</p>
        <p class="tw-text-gray-600">Logs: {{ step.logs }}</p>
        <p class="tw-text-gray-600">Message: {{ step.message }}</p>

        <p class="tw-text-gray-600 tw-mt-2">Parameters:</p>
        <div
          class="tw-flex tw-space-x-4 tw-items-center"
          v-for="param in step.parameters"
        >
          <input
            class="tw-border tw-rounded tw-p-2 tw-w-1/2"
            placeholder="Key"
            type="text"
            :value="param.name"
            disabled
          /><input
            class="tw-border tw-rounded tw-p-2 tw-w-1/2"
            placeholder="Value"
            type="text"
            :value="JSON.stringify(param.value)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const run = ref<{
  _id: string;
  steps: {
    function: string;
    logs: string;
    message: string;
    name: string;
    success: boolean
    parameters: {
      name: string;
      value: any;
    }[];
  }[];
  flow_name: string;
  created_at: string;

  trigger: any;
} | null>(null);

// Access the 'id' parameter from the route
onMounted(() => {
  const token = authStore.token;
  const id = route.params.id;
  axios
    .get(`/v1/flows/runs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      run.value = res.data.data;
    });
});
</script>
