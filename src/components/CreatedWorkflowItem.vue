<template>
  <div
    class="tw-ring tw-ring-orange-500/30 tw-rounded-md">
    <div>
      <div class="tw-flex tw-justify-between tw-p-2 tw-bg-orange-200/5">
        <h3 class="tw-text-lg"><strong>{{ workflow.name }}</strong></h3>
        <v-icon
          @click="foldTrigger = !foldTrigger"
          class="tw-cursor-pointer tw-text-black">
          {{ !foldTrigger ? "mdi-unfold-less-horizontal" : "mdi-unfold-more-horizontal"  }}
        </v-icon>
      </div>
      <hr class="tw-border-orange-500/30">
      <div class="tw-p-3 tw-text-center">
        <template v-if="!foldTrigger">
          <div class="tw-text-start tw-truncate tw-space-y-1">
            <h4>Trigger name: <span class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl">{{ workflow.trigger.name }}</span></h4>
            <h4>slug: <span class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl">{{ workflow.trigger.slug }}</span></h4>
            <pre class="tw-text-xs">{{ {parameters: workflow.trigger.parameters} }}</pre>
          </div>
        </template>
        <template v-else>
          <v-icon class="!tw-text-5xl tw-text-gray-300">mdi-dots-horizontal</v-icon>
        </template>
      </div>
    </div>
    <div>
      <hr class="tw-border-orange-500/30">
      <div class="tw-flex tw-justify-between tw-p-2 tw-bg-orange-200/5">
        <h3 class="tw-text-lg">Steps</h3>
        <v-icon
          @click="foldSteps = !foldSteps"
          class="tw-cursor-pointer tw-text-black">
          {{ !foldSteps ? "mdi-unfold-less-horizontal" : "mdi-unfold-more-horizontal"  }}
        </v-icon>
      </div>
      <hr class="tw-border-orange-500/30">
      <div class="tw-p-3 tw-text-center">
        <template v-if="!foldSteps">
          <div v-for="step in workflow.steps" class="tw-text-start tw-truncate tw-space-y-1">
            <h4>Step name: <span class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl">{{ step.name }}</span></h4>
            <h4>Function: <span class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl">{{ step.function }}</span></h4>
            <h4>Function_id: <span class="tw-bg-primary tw-p-1 tw-px-2 tw-text-white tw-rounded-xl">{{ step.function_id }}</span></h4>
            <pre class="tw-text-xs">{{ {parameters: step.parameters} }}</pre>
          </div>
        </template>
        <template v-else>
          <v-icon class="!tw-text-5xl tw-text-gray-300">mdi-dots-horizontal</v-icon>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  workflow: any;
}>();

const foldTrigger = ref(true)
const foldSteps = ref(true)
</script>