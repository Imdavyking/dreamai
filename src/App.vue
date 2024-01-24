<script setup lang="ts">
import { useRoute } from 'vue-router';
import { LayoutTypes } from '@/types/layouts';
import Default from '@/layouts/Default.vue';
import Empty from '@/layouts/Empty.vue';
import { computed } from 'vue';

const route = useRoute()
const layout = computed(() => {
  const layout = route?.meta?.layout
  if(!layout) return Default // Default layout which require auth
  if(layout === LayoutTypes.Default) return Default
  return Empty
})
</script>

<template>
  <component :is="layout" />
</template>