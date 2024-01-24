<template>
  <ul class="tw-grid sm:tw-grid-cols-2 tw-gap-2">
    <li
      v-for="(trigger,i) in triggers" :key="i"
      @click="props.actions.onSelect(trigger)"
      class="tw-px-3 tw-py-2 tw-bg-gray-100 hover:tw-bg-slate-200
      active:tw-bg-slate-300 tw-cursor-pointer tw-text-base tw-rounded-md">
      {{ trigger.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useTriggerStore } from '@/stores/triggers';
import type { Trigger } from '@/types/workflow';

const props = defineProps<{
  actions: {
    onSelect: (trigger: Trigger) => void
  }
}>()

const triggerStore = useTriggerStore()
const triggers = triggerStore.triggers
</script>