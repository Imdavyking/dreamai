<template>
  <div
    class="!tw-ring tw-ring-primary/60 !tw-rounded-lg sm:tw-w-[600px]
    tw-relative tw-bg-white">
    <div class="tw-flex tw-justify-between tw-items-center tw-p-3">
      <h3 class="tw-font-mono tw-text-lg tw-truncate">
        {{
          isTrigger ?
            `${ step?.name && (activeStepStage==='step_form' || activeStepStage==='created')
              ? step?.name : 'Trigger'}` :
            `${step?.name && (activeStepStage==='step_form' || activeStepStage==='created')
              ? step?.name : 'Step'}`
        }}
      </h3>

      <div class="tw-space-x-3">
        <v-icon
          v-if="!isTrigger"
          @click="handleRemoveStep"
          class="tw-cursor-pointer !tw-text-primary/50 hover:!tw-text-black">
          mdi-delete
        </v-icon>

        <v-icon
          v-if="activeStepStage==='created'"
          @click="activeStepStage = phantomTabsForStepCreationStage[1]"
          class="tw-cursor-pointer !tw-text-primary/50 hover:!tw-text-black">
          mdi-layers-edit
        </v-icon>
      </div>
    </div>
    <hr>
    <div class="tw-text-3xl tw-p-3">
      <!-- this is not rendered anywhere, just the state it generates is needed -->
      <Tabs
        :tab_list="phantomTabsForStepCreationStage"
        :value="activeStepStage"
        :query_name="'step_stage_' + localId"
        @model-value="($event:any) => activeStepStage = $event"
      />
      <div v-if="activeStepStage === 'step_selection'">
        <TriggerList
          v-if="isTrigger"
          :actions="{ onSelect: handleStoreTriggerStep }"
        />
        <div v-else>
          <FunctionList :actions="{ onSelect: handleStoreFunctionStep }" />
        </div>
      </div>

      <div v-else-if="activeStepStage === 'step_form'">
        <button
          @click="onBack"
          class="tw-text-sm tw-px-2 tw-py-1 tw-bg-gray-200 hover:tw-bg-gray-300 tw-rounded-md tw-flex tw-gap-2 tw-items-center"
        >
          <v-icon>mdi-arrow-left</v-icon>
          <span>back</span>
        </button>

        <div class="tw-mt-3">
          <ReturnsForm
            :fields="formToReturn!"
            :on-submit="handleFormSubmit"
          />
        </div>
      </div>

      <div v-else-if="activeStepStage==='created'">
        <div class="tw-text-xl tw-flex tw-flex-col tw-items-center tw-gap-2">
          <v-icon class="tw-text-emerald-500">mdi-check</v-icon>
          <span class="tw-text-xl tw-font-medium">Step ready</span>
        </div>
      </div>
    </div>

    <div
      v-show="canAddStep || hasSteps"
      :class="[
        {
          'after:tw-absolute after:tw-top-full after:tw-w-px after:tw-bg-orange-500 after:tw-h-[72px]':
            !isLastStep,
        },
      ]"
      class="tw-absolute tw-inset-x-0 tw-bottom-0 tw-flex tw-justify-center"
    >
      <button
        @click="emits('add-step')"
        :class="[
          { '!tw-flex': isLastStep && canAddStep },
          { 'before:tw-absolute before:tw-bottom-full before:tw-w-px before:tw-bg-orange-500 before:tw-h-[20px]': canAddStep || hasSteps },
        ]"
        class="tw-absolute tw-top-[20px] tw-bg-gray-200 hover:tw-bg-gray-300 tw-rounded-lg tw-transition-colors tw-duration-300 tw-p-1 tw-hidden tw-justify-center"
      >
        <v-icon>mdi-plus</v-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TriggerList from "@/components/molecules/TriggerList.vue";
import FunctionList from "@/components/molecules/FunctionList.vue";
import Tabs from "@/components/Tabs.vue";
import ReturnsForm from "@/components/molecules/ReturnsForm.vue";
import type {
  Trigger,
  Function,
  WorkflowTriggerData,
  WorkflowFunctionData,
  TriggerParameter,
  FunctionParameter,
} from "@/types/workflow";
import { useWorkflowStore } from "@/stores/workflow";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  step: WorkflowTriggerData | WorkflowFunctionData | undefined;
  isTrigger: boolean;
  isLastStep: boolean;
}>();

type StepOutput = { name: string; type: string };

const emits = defineEmits<{
  (e: 'add-step'): void,
  (e: 'remove-step', localId: string): void,
}>()

const localId = ref(props?.step?.localId ?? new Date().toJSON());
const canAddStep = computed(
  () => !!props?.step?.canAddNextStep || props.isTrigger
); // if it's a trigger, it can always add a step
const hasSteps = ref(!props.isLastStep);

const activeStepStage = ref();
const phantomTabsForStepCreationStage = [
  {
    name: "step selection",
    slug: "step_selection",
  },
  {
    name: "step form",
    slug: "step_form",
  },
  {
    name: "created",
    slug: "created",
  },
];

const workflowStore = useWorkflowStore();
const handleStoreTriggerStep = (trigger: Trigger) => {
  workflowStore.setSelectedTriggerStep({ trigger, localId: localId.value });
  activeStepStage.value = phantomTabsForStepCreationStage[1];
};

const handleStoreFunctionStep = (function_: Function) => {
  workflowStore.setSelectedFunctionStep({ function_, localId: localId.value });
  activeStepStage.value = phantomTabsForStepCreationStage[1];
};

const formToReturn = computed(() => {
  const stepInfo = props.isTrigger
    ? workflowStore.getTrigger
    : workflowStore.getStep(localId.value);
  // if formData is available, it means that the step has been created
  return (
    (stepInfo?.formData as (TriggerParameter | FunctionParameter)[] | null) ??
    workflowStore.getTriggerOrFunctionById({
      _id: stepInfo?._id ?? "",
      isTrigger: props.isTrigger,
    })?.parameters
  );
});

const isDirty = computed(()=>props.step?.formData !== null)
const onBack = () => {
  let proceed:boolean = true;
  if(isDirty.value) proceed = confirm('These form data will be cleared. Are you sure you want to proceed?')
  if(!proceed) return
  activeStepStage.value=phantomTabsForStepCreationStage[0]
}
const router = useRouter();
const route = useRoute();
const handleRemoveStep = () => {
  const res = confirm('Are you sure you want to remove this step?')
  if(!res) return
  // remove the query param for this step
  const allQueries = {...route.query}
  delete allQueries['step_stage_' + localId.value]
  router.replace({query: allQueries})
  setTimeout(()=>emits('remove-step', localId.value))
}

const handleFormSubmit = (formData: any) => {
  workflowStore.updateStep({localId: localId.value, data: formData, isTrigger: props.isTrigger})
  activeStepStage.value=phantomTabsForStepCreationStage[2]
}
</script>
