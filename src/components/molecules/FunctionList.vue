<template>
  <ul class="tw-grid sm:tw-grid-cols-2 tw-gap-2">
    <li
      v-for="(function_,i) in functions" :key="i"
      @click="props.actions.onSelect(function_)"
      class="tw-px-3 tw-py-2 tw-bg-gray-100 hover:tw-bg-slate-200
      active:tw-bg-slate-300 tw-cursor-pointer tw-text-base tw-rounded-md">
      {{ function_.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useFunctionsStore } from '@/stores/functions';
import type { Function } from '@/types/workflow';

const props = defineProps<{
  actions: {
    onSelect: (function_: Function) => void
  }
}>()

const functionStore = useFunctionsStore()
const functions = functionStore.functions
</script>