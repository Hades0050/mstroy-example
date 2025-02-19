<template>
	<div style="height: 90vh">
		<!-- Панель управления таблицей данных -->
		<DataGridTopPanel
			v-model:edit-mode="isEdit"
			@undo="undo()"
			@redo="redo()"
		/>
		<!-- Таблица данных с поддержкой редактирования -->
		<DataGridTable
			:is-editable="isEdit"
			:tree-store="treeStore"
			@remove-node="removeNode"
			@add-node="addNode"
			@update-data="updateDate"
			@on-grid-ready="onGridReady"
			@redraw-rows="redrawRows"
		/>
	</div>
</template>

<script setup lang="ts">
import DataGridTable from './DataGridTable.vue'
import DataGridTopPanel from './DataGridTopPanel.vue'
import type { GridApi, GridReadyEvent } from 'ag-grid-community'
import { ref, shallowRef, watch } from 'vue'
import { TreeStore } from '../model'
import { uidv4 } from '../helpers'
import { dataItems } from '../mocks'
// import {  largeTree } from '../mocks'

// Создаем экземпляр TreeStore с начальными данными
const treeStore = new TreeStore(dataItems)
// Прогонка на большом объеме данных
// const treeStore = new TreeStore(largeTree)

// Режим редактирования
const isEdit = ref(false)

// API для работы с таблицей данных
const gridApi = shallowRef<GridApi | null>(null)

// Наблюдаем за изменением режима редактирования и перерисовываем строки таблицы
watch(
	() => isEdit.value,
	() => {
		gridApi.value!.redrawRows()
	}
)

// Обработчик события готовности таблицы
const onGridReady = (params: GridReadyEvent) => {
	gridApi.value = params.api
}

// Перерисовывает строки таблицы (нужно для динамического изменения данных и форматирования категории так как происходи перерасчет дочерних элементов)
const redrawRows = () => {
	gridApi.value!.redrawRows()
}

// Отменяет последнее изменение
const undo = () => {
	gridApi.value!.undoCellEditing()
}

// Повторяет отмененное изменение
const redo = () => {
	gridApi.value!.redoCellEditing()
}

// Удаляет узел из дерева
const removeNode = (id: string | number) => {
	treeStore.removeItem(id)
	updateDate()
	redrawRows()
}

// Добавляет новый узел в дерево
const addNode = (id: string | number) => {
	treeStore.addItem({
		id: uidv4(),
		label: `Новый Айтем`,
		parent: id,
	})
	updateDate()
	redrawRows()
}

// Обновляет данные таблицы
const updateDate = () => {
	gridApi.value!.setGridOption('rowData', treeStore.getAll())
}
</script>
