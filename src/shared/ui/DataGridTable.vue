<template>
	<ag-grid-vue
		@grid-ready="emit('onGridReady', $event)"
		:columnDefs="columnDefs"
		:default-col-def="{ flex: 1 }"
		:autoGroupColumnDef="autoGroupColumnDef"
		:groupDefaultExpanded="0"
		:undoRedoCellEditing="true"
		:treeData="true"
		:getDataPath="getDataPath"
		:rowData="treeStore.getAll()"
		:getRowId="getRowId"
		style="height: 100%"
	/>
</template>

<script setup lang="ts">
import { watch, ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
	CellStyleModule,
	ClientSideRowModelModule,
	type ColDef,
	type GetDataPath,
	type GetRowIdFunc,
	type GetRowIdParams,
	type GridApi,
	type GridReadyEvent,
	ModuleRegistry,
	TextEditorModule,
	UndoRedoEditModule,
	ValidationModule,
} from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import DataGridCell from './DataGridCell.vue'
import { TreeStore } from '../model'
ModuleRegistry.registerModules([
	ClientSideRowModelModule,
	TreeDataModule,
	TextEditorModule,
	ValidationModule,
	CellStyleModule,
	UndoRedoEditModule,
])
// API для работы с таблицей данных
const { isEditable = false, treeStore } = defineProps<{
	isEditable?: boolean
	treeStore: TreeStore
}>()

const emit = defineEmits<{
	(e: 'onGridReady', params: GridReadyEvent): void
	(e: 'redrawRows'): void
	(e: 'removeNode', id: string | number): void
	(e: 'addNode', id: string | number): void
	(e: 'updateData'): void
}>()

// А вот тут особенность библиотеки id всегда должен быть строкой иначе wanning
const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
	return String(params.data.id)
})

const columnDefs = ref<ColDef[]>([
	{
		headerName: '№ п\\п',
		valueGetter: 'node.rowIndex + 1',
		maxWidth: 100,
	},
	{
		field: 'label',
		headerName: 'Наименование',
		editable: () => isEditable,
		cellStyle: () => {
			return { fontWeight: 'bold' }
		},
		minWidth: 280,
		sort: 'asc',
	},
])

const autoGroupColumnDef = ref<ColDef>({
	headerName: 'Категория',
	cellRenderer: DataGridCell,
	cellStyle: { 'font-weight': 'bold' },
	cellRendererParams: (params: any) => {
		return {
			isEditable: () => isEditable,
			onAddNodeClick: () => {
				emit('addNode', params.data.id)
				params.api.setRowNodeExpanded(params.node, true, false)
			},
			onRemoveNodeClick: () => {
				emit('removeNode', params.data.id)
			},
		}
	},
})

const getDataPath = ref<GetDataPath>(data => {
	const getAllParents = treeStore.getAllParents(data.id).map(item => {
		return item.id.toString()
	})
	return getAllParents
})
</script>
