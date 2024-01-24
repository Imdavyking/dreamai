<template>
  <div class="tw-h-[100svh]">
    <div class="tw-flex tw-h-full tw-overflow-x-hidden">
      <Nav
        :navItems="navItems"
        :class="{ 'tw-w-[220px] tw-min-w-[220px] tw-p-2':openMobileNav }"
        class="tw-w-0 tw-overflow-clip sm:tw-w-[220px] sm:tw-min-w-[220px]
        tw-transition-all tw-duration-300 sm:tw-p-2"
      />
      <main
        @click="openMobileNav=false"
        :class="{ 'tw-flex-none sm:tw-flex-auto':openMobileNav }"
        class="tw-min-h-[100svh] tw-max-w-2xl sm:tw-max-w-none
        tw-flex-grow tw-transition-all tw-duration-300 tw-overflow-y-auto">
        <div
          :class="{ 'tw-left-[220px]':openMobileNav }"
          class="sm:tw-hidden tw-flex tw-items-center tw-px-3 tw-h-14 tw-border-b tw-border-primary/30
          tw-fixed tw-top-0 tw-inset-x-0 tw-bg-white tw-text-xl tw-text-primary tw-z-20
          before:tw-absolute before:tw-inset-0 before:tw-bg-primary/10 before:tw-z-[-1]">
          <v-icon @click.stop="openMobileNav=!openMobileNav">mdi-menu</v-icon>
        </div>
        <div class="tw-pt-14 sm:tw-pt-0">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import { ref } from 'vue';
import { RouterView } from 'vue-router'

const openMobileNav = ref(false)
const navItems = [
  {
    name: 'Projects',
    path: '/',
    icon: 'mdi-package-variant-closed',
  },
  {
    name: 'Accounts',
    path: '/accounts',
    icon: 'mdi-key-variant',
  },
  {
    name: 'Run History',
    path: '/history',
    icon: 'mdi-view-list',
  },
  
]
</script>