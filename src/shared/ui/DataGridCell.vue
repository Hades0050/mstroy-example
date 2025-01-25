<template>
	<div class="ag-cell-value ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-focus" aria-colindex="1"
		aria-expanded="true" style="width: 100%">
		<span :class="[
			'ag-cell-wrapper ag-cell-expandable ag-row-group',
			`ag-row-group-indent-${params.node?.level}`,
		]" :style="`--ag-indentation-level: ${params.node?.level}`">
			<div v-if="params.node?.allChildrenCount">
				<span :class="[
					!isExpandedNode ? 'ag-group-contracted' : 'ag-group-expanded ',
				]" @click.stop="expandNode()"><span :class="[
					'ag-icon',
					!isExpandedNode ? 'ag-icon-tree-closed' : 'ag-icon-tree-open',
				]"></span></span>
			</div>
			<div class="editing-mode-cells">
				<span class="ag-group-value" data-ref="eValue">
					{{ params.node?.allChildrenCount ? 'Группа' : 'Элемент' }}
				</span>
				<div v-if="params?.isEditable()">
					<button class="primary-button material-icons" @click.stop="params.onAddNodeClick">
						add
					</button>
					<button class="danger-button material-icons" @click.stop="params.onRemoveNodeClick">
						close
					</button>
				</div>
			</div>
		</span>
	</div>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'
import { ref } from 'vue'
import type { TTreeItem } from '../types'
const { params } = defineProps<{
	params: ICellRendererParams<TTreeItem, string | number, any> & any
}>()
const isExpandedNode = ref(params.node?.expanded)
const expandNode = () => {
	if (params.node) {
		isExpandedNode.value = !params.node.expanded
		params.api.setRowNodeExpanded(params.node, isExpandedNode.value, false)
	}
}
</script>

<style scoped></style>
