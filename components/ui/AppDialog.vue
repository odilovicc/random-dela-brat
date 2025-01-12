<template>
	<PDialog
		v-model:visible="visible"
		:modal="modal"
		:style="dialogStyle"
		:close-icon="closeIconClass"
		:header="title"
		:draggable="draggable"
		:resizable="resizable"
		v-bind="$attrs"
		@close="handleClose"
		ref="userDialog"
	>
		<slot></slot>
		<Divider class="mb-0" v-if="dividerFooter" />
		<template #footer>
			<slot
				name="footer"
				v-bind="{
					close: handleClose,
				}"
			></slot>
		</template>
	</PDialog>
</template>

<script setup lang="ts">

const PDialog = defineAsyncComponent(() => import("primevue/dialog"));
const props = withDefaults(
	defineProps<{
		title?: string;
		modal?: boolean;
		draggable?: boolean;
		resizable?: boolean;
		width?: string;
		dividerFooter?: boolean;
	}>(),
	{
		dividerFooter: true,
	},
);

const userDialog = ref()

const emit = defineEmits<{
	change: [key: string, visible: boolean];
}>();

const visible = ref(false);

const dialogStyle = computed(() => ({
	width: props.width || "50vw",
}));

const closeIconClass = computed(() => "pi pi-times");

const open = () => {
	visible.value = true;
	emit("change", "OPEN", visible.value);
};

const close = () => {
	visible.value = false;
	emit("change", "CLOSE", visible.value);
};

const handleClose = () => {
	userDialog.value.close()
};

defineExpose<IAppDialog>({
	open,
	close,
	testFunc: () => visible.value,
});
</script>
