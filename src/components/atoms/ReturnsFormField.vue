<template>
  <label class="tw-text-base">
    <span class="tw-inline-block">{{ field?.hint ?? field.name }}</span>
    <template v-if="field.formElement === 'object'">
      <span
        @click="addKeyValue"
        type="button"
        class="tw-h-6 tw-w-6 tw-rounded-full tw-ml-3 tw-mb-2 tw-cursor-pointer"
      >
        <v-icon>mdi-plus</v-icon>
      </span>
      <div class="tw-flex tw-flex-col tw-gap-2">
        <div
          v-for="(each, i) in value"
          class="tw-flex tw-gap-2 tw-items-center"
        >
          <div class="tw-flex tw-w-full tw-gap-2">
            <div class="">
              <input
                v-model="each.key"
                type="text"
                placeholder="key"
                :class="elementClass"
                class="tw-w-full"
                :required="!!field?.optional ? false : true"
            />
              <details class="tw-text-sm">
                <summary>Select Variable from previous steps</summary>
                <vue-json-pretty
                  rootPath="flow"
                  :showSelectController="true"
                  :highlightSelectedNode="true"
                  selectableType="single"
                  :nodeSelectable="(_) => true"
                  :selectOnClickNode="true"
                  @selectedChange="((val:string) => each.key += `{{ ${val} }}`)"
                  :data="workflowStore.toJSON()"
                />
              </details>
            </div>
            <div class="">
              <input
                v-model="each.value"
                :type="field.formType"
                placeholder="value"
                :class="elementClass"
                class="tw-w-full"
                :required="!!field?.optional ? false : true"
            />
              <details class="tw-text-sm">
                <summary>Select Variable from previous steps</summary>
                <vue-json-pretty
                  rootPath="flow"
                  :showSelectController="true"
                  :highlightSelectedNode="true"
                  selectableType="single"
                  :nodeSelectable="(_) => true"
                  :selectOnClickNode="true"
                  @selectedChange="((val:string) => each.value += `{{ ${val} }}`)"
                  :data="workflowStore.toJSON()"
                />
              </details>
            </div>
          </div>
          <span
            @click="removeKeyValue(i)"
            v-if="value.length > 1"
            class="tw-h-6 tw-w-6 tw-rounded-full tw-cursor-pointer"
          >
            <v-icon>mdi-minus</v-icon>
          </span>
        </div>
      </div>
    </template>

    <template v-else-if="field.formElement === 'textarea'">
      <textarea
        v-model="value"
        :placeholder="field?.hint ?? field.name"
        :class="elementClass"
        class="tw-w-full tw-max-h-40 tw-min-h-[60px]"
        :required="!!field?.optional ? false : true"
      ></textarea>
    </template>

    <template v-else-if="field.formElement === 'select'">
      <select
        v-model="value"
        :placeholder="field?.hint ?? field.name"
        :class="elementClass"
        class="tw-w-full"
      >
        <option value="" disabled selected>Select {{ field.name }}</option>
        <option
          v-for="option in field.options"
          :key="option.name"
          :value="option.value"
        >
          {{ option.name }}
        </option>
      </select>
    </template>

    <template v-else-if="field.formType === 'checkbox'">
      <span :class="elementClass" class="tw-flex tw-gap-2 tw-items-center">
        <input
          v-model="value"
          :type="field.formType"
          :placeholder="field?.hint ?? field.name"
          :required="!!field?.optional ? false : true"
        />
        {{ field.name }}
      </span>
    </template>

    <template v-else-if="field.formElement === 'account'">
      <select
        v-model="value"
        :placeholder="field?.hint ?? field.name"
        :class="elementClass"
        class="tw-w-full"
        v-if="accounts.length > 0"
      >
        <option value="" disabled selected>Select {{ field.name }}</option>
        <option
          v-for="option in accounts"
          :key="option.name"
          :value="option._id"
        >
          {{ option.name }}
        </option>
      </select>
      <div class="tw-text-red-400" v-else>
        Please Add your {{ field.formAccountType }} account in account settings
      </div>
    </template>

    <template v-else-if="field.formType === 'radio'">
      <span :class="elementClass" class="tw-flex tw-gap-2 tw-items-center">
        <input
          v-model="value"
          :type="field.formType"
          :placeholder="field?.hint ?? field.name"
          :required="!!field?.optional ? false : true"
        />
        {{ field.name }}
      </span>
    </template>

    <template v-else>
      <input
        v-model="value"
        type="text"
        :placeholder="field?.hint ?? field.name"
        :class="elementClass"
        class="tw-w-full"
        :required="!!field?.optional ? false : true"
      />
      <!-- <div v-if="field.formType != 'object'"> -->
      <details class="tw-text-sm">
        <summary>Select Variable from previous steps</summary>
        <vue-json-pretty
          rootPath="flow"
          :showSelectController="true"
          :highlightSelectedNode="true"
          selectableType="single"
          :nodeSelectable="(_) => true"
          :selectOnClickNode="true"
          @selectedChange="selectedChange"
          :data="workflowStore.toJSON()"
        />
      </details>
      <!-- </div> -->
    </template>
  </label>
</template>

<script setup lang="ts">
// import css
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import type { TriggerParameter, FunctionParameter } from "@/types/workflow";
import { ref, watch, onMounted, reactive } from "vue";
import { useWorkflowStore } from "@/stores/workflow";
import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
const workflowStore = useWorkflowStore();
// console.log(JSON.stringify(workflowStore, null, 2));

const props = defineProps<{
  modelValue: any;
  field: TriggerParameter | FunctionParameter;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

// const activeInput = ref(HTMLInputElement);

const elementClass =
  "tw-ring-1 tw-ring-gray-300 tw-px-2 tw-py-1 tw-rounded-md tw-outline-none";

const value = ref(props.modelValue);
let accounts = ref([] as { name: string; _id: string }[]);
watch(
  value,
  (newValue) => {
    if (!newValue && props.field.formType !== "checkbox") return; // checkboxes would need to be able to be unchecked, thus newValue would be false
    emits("update:modelValue", newValue);
  },
  { immediate: true, deep: true }
);

const addKeyValue = () => value.value.push({ key: "", value: "" });
const removeKeyValue = (index: number) => value.value.splice(index, 1);

const selectedChange = (selected: any) => {
  console.log(selected);
  // type into the active input with {{ selected }}
  value.value += `{{ ${selected} }}`;
};
const authStore = useAuthStore();

onMounted(() => {
  const token = authStore.token;
  // fetch accounts if input type is account
  if (props.field.formElement === "account") {
    // fetch accounts using axios
    axios
      .get(`/v1/accounts?typeId=${props.field.formAccountTypeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        accounts.value = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
</script>
