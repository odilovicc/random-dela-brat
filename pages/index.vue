<script setup lang="ts">
import AppButton from "~/components/ui/AppButton.vue";
import PrimeDialog from "primevue/dialog";
import { type FormField, FormFieldType, ValidationRuleType } from "~/types/form";
import PrimeToast from "primevue/toast";
import type { IAnyObject } from "~/types/helpers";
import ConfettiExplosion from "vue-confetti-explosion";
import { useToast } from "primevue/usetoast";

const isAddWillingVisible = ref(false);
const hasRolled = ref(false);
const userWillings = ref<any>([]);
const toast = useToast();
const isLoading = ref(false)
const wonResult = ref<any>(null); // Храним выбранную "делишку"
const userWillsFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      key: "willing",
      label: "Твоя делишка",
      validationRules: [ValidationRuleType.REQUIRED],
    },
  ],
]);

function onAddWilling(fields: IAnyObject) {
  userWillings.value.push({
    ...fields,
    id: Date.now() + Math.random().toString(36).substr(2, 9),
  });
  toast.add({
    summary: "Все четко брат)",
    life: 3000,
    severity: "success",
  });
  isAddWillingVisible.value = false;
}

function letThePlaySound() {
  hasRolled.value = false;
  setTimeout(() => {
    hasRolled.value = true;
  }, 3400);
  const baraban = new Audio("/resources/mp3/baraban-drop.mp3");
  baraban.play();
}

function checkTheCard() {
  isLoading.value = true
  letThePlaySound();
  wonResult.value = null
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * userWillings.value.length);
    wonResult.value = userWillings.value[randomIndex];
    isLoading.value = false
  }, 3400)
}

function clearWillings() {
  userWillings.value = []

  if(wonResult.value) wonResult.value = null
}
</script>

<template>
  <div class="willings-wrapper">
    <div class="willings-header">
      <AppButton
        @click="isAddWillingVisible = true"
        label="А давай добавим свои делишки :)"
        prefix-icon="plus"
      />
      <AppButton
        label="Давай почистим, хули не?"
        @click="clearWillings"
        class="ml-3"
        v-if="userWillings.length > 0"
      />
    </div>
    <div class="willings-cards-container" v-if="userWillings.length">
      <div
        class="willings-card-container"
        v-for="card in userWillings"
        :key="card.id"
      >
        <h1 class="willings-card-title">{{ card.willing }}</h1>
      </div>
      <AppButton
        label="Теперь крутиииим..."
        v-if="userWillings.length >= 3"
        @click="checkTheCard"
        :disabled="isLoading"
        :loading="isLoading"
      />
    </div>
    <div class="willings-result-title">
      И твоя делишка-а-а-а-а-а!!!
    </div>
    <div class="willings-result" v-if="wonResult">
      <div class="willings-result-card willings-card-container">
        {{ wonResult.willing }}
        <ConfettiExplosion
          v-if="hasRolled"
          :particle-count="150"
          :duration="3000"
          :colors="['#FFC107', '#2196F3', '#4CAF50', '#F44336']"
        />
      </div>
    </div>
  </div>

  <PrimeDialog
    :visible="isAddWillingVisible"
    :modal="true"
    class="min-w-[50rem]"
  >
    <template #default>
      <AppForm :fields="userWillsFields" :submit-action="onAddWilling">
        <template #footer="{ submitAction }">
          <AppButton label="Тыкай чтобы добавить брат" @click="submitAction" />
        </template>
      </AppForm>
    </template>
  </PrimeDialog>

  <PrimeToast />
</template>
<style src="~/assets/stylus/pages/index.styl"></style>
