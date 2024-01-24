<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      @update:modelValue="(value: boolean)=>emits('update:modelValue', value)"
      fullscreen :scrim="false">
      <div class="tw-bg-white tw-px-3 tw-py-2 tw-relative tw-z-10 tw-border-b">
        <div class="tw-text-primary tw-max-w-[600px] tw-mx-auto tw-text-xl tw-flex tw-justify-between">
          <h2 class="tw-font-bold">Create a Workflow</h2>
          <v-icon
            class="tw-cursor-pointer"
            @click="closeDialog" >
            mdi-close
          </v-icon>
        </div>
      </div>

      <v-card
        id="workflows"
        class="!tw-bg-gray-50 !tw-py-12 !tw-px-4
        !tw-flex !tw-flex-col sm:!tw-items-center !tw-gap-[72px]">
        <WorkflowItem
          :step="trigger!"
          :isTrigger="true"
          :isLastStep="steps.length === 0"
          @add-step="addStep"
        />
        <WorkflowItem
          v-for="(step,i) in steps" :key="i"
          :step="step"
          :isTrigger="false"
          :isLastStep="i+1 === steps.length"
          @add-step="addStep"
          @remove-step="removeStep"
        />

        <button
          v-if="canCreateWorkflow"
          @click="createWorkflow"
          class="tw-w-full sm:tw-w-[600px] tw-bg-primary tw-text-white tw-py-4 tw-rounded-md
          tw-font-medium hover:tw-ring-4 tw-ring-primary/30 transition-all tw-duration-300"
          :disabled="creatingWorkflow">
          <template v-if="!creatingWorkflow">Create! </template>
          <v-progress-circular
            v-else
            indeterminate
            color="white"
            size="20"
            width="2"
          >
          </v-progress-circular>
        </button>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import WorkflowItem from '@/components/WorkflowItem.vue';
import { useTriggerStore } from '@/stores/triggers';
import { useFunctionsStore } from '@/stores/functions';
import { useWorkflowStore } from '@/stores/workflow';
import { useRouter } from 'vue-router';
import { toast } from "vue3-toastify";

const props = defineProps<{
  modelValue?: boolean
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const triggerStore = useTriggerStore()
// prevent fetching triggers repeatedly
if(!triggerStore.hasTriggers) triggerStore.fetchTriggers()
const functionsStore = useFunctionsStore()
if(!functionsStore.hasFunctions) functionsStore.fetchFunctions()


const dialog = ref(props.modelValue)
const modelValueRef = computed(()=>props.modelValue)
watch(modelValueRef, value => {
  dialog.value = value
  emits('update:modelValue', value)
})
const router = useRouter()
const closeDialog = () => {
  let shouldClose:boolean = true
  if(workflowStore.isWorkflowFormDirty) shouldClose = confirm('Are you sure you want to close this dialog? Any unsaved changes will be lost.')
  if(!shouldClose) return
  dialog.value = false
  emits('update:modelValue', false)
  router.replace({query: {}})
  workflowStore.clearWorkflowCreation()
}

const workflowStore = useWorkflowStore()
const trigger = computed(()=>workflowStore.workflows.trigger)
const steps = computed(()=>workflowStore.workflows.steps)
const addStep = () => {
  workflowStore.createNextStep()
  const workflows = document.getElementById('workflows')
  setTimeout(()=>{
    // scroll to bottom
    workflows?.scrollTo({
      top: workflows.scrollHeight,
      behavior: 'smooth'
    })
  })
}
const removeStep = (localId: string) => workflowStore.removeStep({localId})

const canCreateWorkflow = computed(()=>(
  workflowStore.isAddedStepsCompleted &&
  workflowStore.isTriggerCompleted &&
  workflowStore.hasSteps
))
const creatingWorkflow = computed(()=>workflowStore.creatingWorkflow)
const createWorkflow = async() => {
  const id = toast.loading("creating your workflow...", {
    position: toast.POSITION.TOP_RIGHT,
  });
  workflowStore.createWorkflow().then(() => {
    toast.update(id, {
      render: "workflow created",
      type: "success",
      isLoading: false,
    })
    dialog.value = false
    setTimeout(() => emits('update:modelValue', false));
    router.replace({query: {}})
    workflowStore.clearWorkflowCreation()
  }).catch((err) => {
    toast.update(id, {
      render: "workflow creation failed",
      type: "error",
      isLoading: false,
    });
  })
}
</script>