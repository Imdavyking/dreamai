<template>
  <div>
    <div
      ref="tab"
      v-for="(tab, i) in tab_list"
      :key="i"
      @click="handleTabClicks(tab)"
      class="sm:w-auto text-center sm:text-left"
    >
      <slot
        name="tab"
        :tab="tab"
        :index="i"
        :is_active="active_tab === tab.slug"
      ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  defineComponent,
} from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<{
  tab_list: any[]
  value: string | undefined
  auto_add_query?: boolean
  query_name?: string
}>(), {
  auto_add_query: true,
  query_name: "tab",
})
const emits = defineEmits(["model-value", "tab-click"]);

const router = useRouter();
const active_tab = ref(props.value); // update model value and emit tab-click event
// remove all ' ' and make lowercase
const serialize_query = (query:string) => query.replace(/ /g, "_");
const handleTabClicks = (tab:any) => {
  if (!tab.slug) return;
  active_tab.value = tab.slug;
  // add query to url
  if (props.auto_add_query) {
    router.push({
      query: {
        // router query
        ...router.currentRoute.value.query,
        [props.query_name]: serialize_query(tab.slug),
      },
    });
  }
  emits("model-value", tab.slug);
  emits("tab-click", tab.slug);
};
// set tab from query param
const { [props.query_name]: tab_q } = router.currentRoute.value.query;
if (tab_q) {
  props.tab_list.forEach((tab:any) => {
    if (serialize_query(tab.slug) === tab_q) {
      active_tab.value = tab_q;
      emits("model-value", tab_q);
    }
  });
}
// if query is not set && model value is not set, set model value to first tab
if (!tab_q && !props.value) {
  active_tab.value = props.tab_list[0]?.slug || "";
  emits("model-value", props.tab_list[0]?.slug || "");
}
// // for when tab lists are asynchronously loaded, watch tab_list prop
const tabListPropRef = computed(() => props.tab_list);
const unwatch = watch(tabListPropRef, async (newVal, oldVal) => {
  const isEqual =
    JSON.stringify({ ...newVal }) === JSON.stringify({ ...oldVal });
  if (!!newVal.length && !isEqual) {
    active_tab.value = props.tab_list[0]?.slug || "";
    emits("model-value", props.tab_list[0]?.slug || "");
    handleTabClicks(props.tab_list[0]);
  }
});

// for when tab links aren't used for navigation, watch value
const valuePropRef = computed(() => props.value);
watch(valuePropRef, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleTabClicks(newVal);
  }
});
// for when the back button is used for navigation, watch query
watch(
  () => router.currentRoute.value.query,
  (newVal, oldVal) => {
    if (newVal[props.query_name] !== oldVal[props.query_name]) {
      props.tab_list.forEach((tab:any) => {
        if (serialize_query(tab.slug) === newVal[props.query_name]) {
          active_tab.value = tab.slug;
          emits("model-value", tab.slug);
        }
      });
    }
  },
  { deep: true }
);
</script>
