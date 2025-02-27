<template>
  <form @submit.prevent="handleSubmit" class="app-form-container">
    <div v-for="(row, rowIndex) in fields" :key="rowIndex" class="app-form-row">
      <div v-for="(field, colIndex) in row" :key="colIndex" class="app-form-col">
        <AppFormField
          :label="field.label"
          :class="field.class"
          :error="field.error"
        >
          <component
            :is="getFieldComponent(field.type)"
            v-model="formData[field.key]"
            v-bind="field.params"
            @input="validateField(field)"
            :error="field.error"
            :disabled="props.formLoading"
          />
        </AppFormField>
      </div>
    </div>
    <!-- Используем слот footer с submitAction -->
    <slot
      name="footer"
      :submit-action="handleSubmit"
      :disabled="props.formLoading"
      :loading="props.formLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import AppFormField from "./FormField.vue";
import AppFormInputText from "./AppFormInputText.vue";
import AppFormInputPassword from "./AppFormInputPassword.vue";
import AppFormSelect from "./AppFormSelect.vue";
import AppFormNumber from "./AppFormNumber.vue";
import { FormFieldType, ValidationRuleType, type FormField, type IAppForm } from "~/types/form";

// Пропсы формы
const props = defineProps<{
  fields: FormField[][];
  submitAction: (formData: Record<string, any>) => void;
  formLoading?: boolean;
}>();

// Реактивные данные формы
const formData = reactive<Record<string, any>>({});

// Инициализация данных формы
props.fields.flat().forEach((field) => {
  switch (field.type) {
    case FormFieldType.SELECT:
      formData[field.key] = null; // По умолчанию для SELECT
      break;
    case FormFieldType.NUMBER:
      formData[field.key] = 0; // По умолчанию для NUMBER
      break;
    default:
      formData[field.key] = ""; // По умолчанию для других типов
  }
});

// Правила валидации
const validationRules = {
  [ValidationRuleType.REQUIRED]: (value: any) =>
    !!value || "Это обязательное поле",
  [ValidationRuleType.EMAIL]: (value: string) =>
    /\S+@\S+\.\S+/.test(value) || "Неверная почта",
  [ValidationRuleType.PASSWORD]: (value: string) =>
    value.length >= 6 || "Пароль должен содержать не менее 6 символов",
};

// Валидация полей
const validateField = (field: FormField) => {
  let error = null;

  if (field.validationRules) {
    for (const ruleType of field.validationRules) {
      const validationFunction = validationRules[ruleType];
      if (validationFunction) {
        error = validationFunction(formData[field.key]);
        if (typeof error === "string") {
          field.error = error;
          return;
        }
      }
    }
  }

  field.error = null;
};

// Обработка отправки формы
const handleSubmit = () => {
  props.fields.flat().forEach(validateField);

  const isValid = props.fields.flat().every((field) => !field.error);
  if (isValid) {
    props.submitAction({ ...formData }); // Отправляем данные формы родителю
  } else {
    console.log("Please fix the validation errors");
  }
};

// Определяем компонент в зависимости от типа поля
const getFieldComponent = (type: FormFieldType) => {
  switch (type) {
    case FormFieldType.TEXT:
      return AppFormInputText;
    case FormFieldType.PASSWORD:
      return AppFormInputPassword;
    case FormFieldType.SELECT:
      return AppFormSelect;
    case FormFieldType.NUMBER:
      return AppFormNumber;
    default:
      return AppFormInputText;
  }
};
</script>
