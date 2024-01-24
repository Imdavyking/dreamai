<template>
  <div class="tw-relative">
    <div
      class="tw-min-h-[100dvh] tw-flex tw-items-center tw-justify-center tw-max-w-2xl tw-mx-auto tw-p-6 sm:tw-p-10"
    >
      <div class="tw-space-y-10">
        <div class="tw-text-center">
          <h1 class="tw-text-5xl sm:tw-text-6xl tw-font-bold">
            <span class="tw-relative tw-z-10">Automate your work using</span>
            <span
              class="before:tw-block before:tw-absolute before:-tw-inset-1 before:-tw-skew-y-3 before:tw-bg-white tw-border-2 tw-border-black tw-relative tw-inline-block"
            >
              <span class="tw-relative tw-text-primary">Dream AI.</span>
            </span>
          </h1>
        </div>

        <div class="tw-bg-white tw-p-3 sm:tw-p-6 tw-border">
          <div>
            <h2 class="tw-text-3xl tw-font-bold">Welcome back!</h2>
            <form @submit.prevent="handleLogin" class="tw-mt-4 tw-text-xl">
              <label class="tw-relative tw-block">
                <span class="tw-absolute tw-text-base tw-pl-3 tw-pt-1"
                  >Enter your email</span
                >
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                />
              </label>

              <label class="tw-relative tw-mt-4 tw-flex tw-items-center">
                <span class="tw-absolute tw-top-0 tw-text-base tw-pl-3 tw-pt-1"
                  >Enter your password</span
                >
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="******"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                />
                <v-icon
                  @click="() => (showPassword = !showPassword)"
                  :class="[
                    showPassword ? '!tw-text-black' : '!tw-text-gray-300',
                  ]"
                  class="!tw-absolute !tw-right-0 !tw-mx-3 tw-bg-gray-100 !tw-rounded-2xl"
                >
                  {{ showPassword ? "mdi-eye-outline" : "mdi-eye-off-outline" }}
                </v-icon>
              </label>

              <button
                class="tw-w-full tw-bg-primary tw-text-white tw-py-4 tw-mt-10 tw-rounded-md tw-font-medium hover:tw-ring-4 tw-ring-primary/30 transition-all tw-duration-300"
                :disabled="logingIn"
              >
                <template v-if="!logingIn"> Login </template>
                <v-progress-circular
                  v-else
                  indeterminate
                  color="white"
                  size="20"
                  width="2"
                >
                </v-progress-circular>
              </button>
              <p class="tw-mt-2 tw-text-sm">
                Don't have an account?
                <router-link to="/register" class="tw-text-primary tw-font-bold"
                  >Register</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";

const form = ref({
  email: "",
  password: "",
});
const showPassword = ref(false);

const router = useRouter();
const logingIn = ref(false);
const authStore = useAuthStore();
const handleLogin = async () => {
  logingIn.value = true;
  const id = toast.loading("login you in...", {
    position: toast.POSITION.TOP_RIGHT,
  });
  await authStore
    .login(form.value)
    .then(() => {
      toast.update(id, {
        render: "login successful",
        type: "success",
        isLoading: false,
      });
      router.push("/");
    })
    .catch((err) => {
      return toast.update(id, {
        render: err?.response?.data ?? "login failed",
        type: "error",
        isLoading: false,
      });
    })
    .finally(() => {
      logingIn.value = false;
      setTimeout(() => toast.remove(id), 1000);
    });
};
</script>
