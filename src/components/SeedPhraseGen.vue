<template>
  <div class="tw-max-w-2xl tw-text-lg tw-text-center tw-flex tw-flex-col tw-gap-4">
    <h2 class="tw-text-4xl tw-font-mono tw-font-thin tw-text-center">Secure your seedphrase</h2>

    <p class="tw-opacity-40">
      A unique 12-word sequence is generated for you when you create an account.
    </p>
    <p>
      Don't lose your seed phrase. If you lose your seed phrase, you lose access to your account and can <strong>never</strong> get them back.
    </p>
    <p class="tw-opacity-40">
      This is your seed phrase. (1) Write down each position and word, for example,
      <code>1 - {{ seedPhrase[0] }}.</code> (2) Store the written seed phrase in a secure location such as a safe deposit box.
    </p>

    <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-5 tw-gap-y-3">
      <div
        v-for="(phrase, n) in seedPhrase" :key="phrase"
        class="tw-border tw-border-white/30 tw-rounded-md tw-select-none
        tw-bg-black/10 tw-text-sm tw-flex [&>*]:tw-px-3 [&>*]:tw-py-1">
        <span class="tw-w-11 tw-border-r tw-border-white/30">{{ n+1 }}</span>
        <span class="tw-flex-grow">{{ phrase }}</span>
      </div>
    </div>

    <button
      @click="nameKeyModal=true"
      class="tw-ring-1 tw-ring-white hover:tw-ring-4 tw-rounded-full
      tw-px-5 tw-py-1 tw-mt-10 tw-self-center tw-outline-none
      tw-transition-all tw-duration-300">
      I've written down my seed phrase
    </button>
    <button
      @click="onBack"
      class="tw-opacity-40 hover:tw-opacity-50 tw-px-5
      tw-self-center tw-outline-none">
      back
    </button>

    <v-dialog v-model="nameKeyModal" width="500" persistent class="">
      <v-card class="!tw-rounded-3xl">
        <div class="tw-bg-white tw-p-6">
          <h3>What do we call this key?</h3>
          <form @submit.prevent="confirm" class="tw-flex tw-gap-3 tw-mt-4">
            <label class="tw-relative tw-flex-1">
              <input
                v-model="keyName"
                type="text"
                name="apikeyName"
                id="apikeyName"
                placeholder="My Key"
                required
                class="tw-w-full tw-bg-gray-100 tw-p-3 tw-rounded-full tw-outline-none
                tw-ring tw-ring-primary/70 focus:tw-ring-primary"
              />
            </label>
            <button
              class="tw-bg-primary tw-text-white tw-py-2 tw-px-4 tw-rounded-full
              tw-font-medium hover:tw-ring-4 tw-ring-primary/30 transition-all tw-duration-300">
              Save
            </button>
          </form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ethers } from 'ethers';
import { computed, ref } from 'vue';

const props = defineProps<{
  onConfirm: ({privateKey, keyName}:{privateKey:string, keyName:string}) => void
  onBack: () => void
}>()

const wallet = ref()
const seedPhrase = computed(() => (wallet.value?.mnemonic?.phrase || '').split(' '))
const generateWallet = () => {
  wallet.value =  ethers.Wallet.createRandom()
}
generateWallet()

const confirm = () => {
  const mnemonicWallet = ethers.Wallet.fromPhrase(wallet.value?.mnemonic?.phrase);
  props.onConfirm({privateKey: mnemonicWallet.privateKey, keyName: keyName.value})
}

const nameKeyModal = ref(false)
const keyName = ref('')
</script>