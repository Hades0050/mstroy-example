<template>
	<div class="editing-mode-header">
		<h2 class="primary-text-mode" @click.stop="editMode = !editMode">
			Режим: {{ editMode ? 'редактирование' : 'просмотр' }}
		</h2>
		<div v-if="editMode">
			<button class="undo-rendo-button  material-icons" @click="emits('undo')">
				undo
			</button>
			<button class="undo-rendo-button  material-icons" @click="emits('redo')">
				redo
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { EditableCallback } from 'ag-grid-community'

const emits = defineEmits<{
	(e: 'undo'): void
	(e: 'redo'): void
}>()
const editMode = defineModel<boolean | EditableCallback<any, any> | undefined>(
	'editMode',
	{ default: false }
)
</script>

<style scoped></style>
