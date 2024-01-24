<template>
  <nav class="tw-bg-black-1 tw-text-sm">
    <ul class="tw-h-full tw-flex tw-flex-col tw-justify-between">
      <div>
        <li v-for="item in navItems" :key="item.name">
          <router-link
            :to="item.path"
            class="tw-flex tw-items-center tw-justify-between tw-gap-2
            tw-p-2 tw-rounded-md tw-bg-transparent
            hover:tw-bg-white/5 tw-transition-colors tw-duration-200"
            :class="{'!tw-bg-white/10': isActive(item.path)}">
            <v-icon
              class="tw-text-white/30"
              :class="{'!tw-text-white': isActive(item.path)}">
              {{ item.icon }}
            </v-icon>
            <span
              class="tw-flex-grow tw-text-white/80"
              :class="{'!tw-text-white': isActive(item.path)}">
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </div>

      <div>
        <li @click="authStore.logout">
          <button
            class="tw-flex tw-items-center tw-justify-between tw-gap-2
            tw-p-2 tw-rounded-md tw-bg-transparent tw-w-full
            hover:tw-bg-white/5 tw-transition-colors tw-duration-200">
            <v-icon class="tw-text-white/30">mdi-logout</v-icon>
            <span class="tw-flex-grow tw-text-white/80 tw-text-left">logout</span>
          </button>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  navItems: {
    name: string
    path: string
    icon: string
  }[]
}>()

const route = useRoute()
const router = useRouter()

const isActive = computed(()=>(path:string)=>route.path === path)
const authStore = useAuthStore()
</script>