<template>
  <div class="tw-relative">
    <div
      class="tw-min-h-[100dvh] tw-flex tw-items-center tw-justify-center tw-max-w-2xl tw-mx-auto tw-p-6 sm:tw-p-10"
    >
      <div class="tw-space-y-10">
        <div class="tw-text-center">
          <h1 class="tw-text-5xl sm:tw-text-6xl tw-font-bold">
            <span class="tw-relative tw-z-10"
              >Join us in automating your work using</span
            >
            <span
              class="before:tw-block before:tw-absolute before:-tw-inset-1 before:-tw-skew-y-3 before:tw-bg-white tw-border-2 tw-border-black tw-relative tw-inline-block"
            >
              <span class="tw-relative tw-text-primary">Dream AI.</span>
            </span>
          </h1>
        </div>

        <div class="tw-bg-white tw-p-3 sm:tw-p-6 tw-border">
          <div>
            <h2 class="tw-text-3xl tw-font-bold">Create an account</h2>
            <form @submit.prevent="handleRegister" class="tw-mt-4 tw-text-xl">
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

              <div class="tw-mt-4 tw-flex tw-gap-4">
                <label class="tw-relative tw-w-full">
                  <span class="tw-absolute tw-text-base tw-pl-3 tw-pt-1"
                    >Enter firstname</span
                  >
                  <input
                    v-model="form.firstname"
                    type="text"
                    name="firstname"
                    placeholder="Arya"
                    :required="true"
                    class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                  />
                </label>
                <label class="tw-relative tw-w-full">
                  <span class="tw-absolute tw-text-base tw-pl-3 tw-pt-1"
                    >Enter lastname</span
                  >
                  <input
                    v-model="form.lastname"
                    type="text"
                    name="lastname"
                    placeholder="Stark"
                    :required="true"
                    class="tw-w-full tw-bg-gray-100 tw-p-3 tw-pt-7 tw-rounded-md tw-outline-black"
                  />
                </label>
              </div>

              <label class="tw-relative tw-mt-4 tw-flex tw-items-center">
                <span class="tw-absolute tw-top-0 tw-text-base tw-pl-3 tw-pt-1"
                  >Create password</span
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
                :disabled="registering"
              >
                <template v-if="!registering"> Join us </template>
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
                Already own an account?
                <router-link to="/login" class="tw-text-primary tw-font-bold"
                  >Login</router-link
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
  firstname: "",
  lastname: "",
});
const showPassword = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const registering = ref(false);
const handleRegister = async () => {
  registering.value = true;
  const id = toast.loading("registering you...", {
    position: toast.POSITION.TOP_RIGHT,
  });
  await authStore
    .register(form.value)
    .then(() => {
      toast.update(id, {
        render: "registration successful",
        type: "success",
        isLoading: false,
      });
      router.push("/login");
    })
    .catch((err) => {
      toast.update(id, {
        render: err.message || "registration failed",
        type: "error",
        isLoading: false,
      });
    })
    .finally(() => {
      setTimeout(() => toast.remove(id), 1000);
      registering.value = false;
    });
};
</script>
