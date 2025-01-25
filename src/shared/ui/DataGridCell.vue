<template>
	<div
		class="ag-cell-value ag-cell ag-cell-not-inline-editing ag-cell-normal-height"
		style="width: 100%"
		:aria-colindex="params.node?.level"
	>
		<span
			:class="[
				'ag-cell-wrapper  ',
				`ag-row-group-indent-${params.node?.level}`,
			]"
			:style="`--ag-indentation-level: ${params.node?.level}`"
		>
			<span v-if="params.node?.allChildrenCount">
				<span
					:class="[
						!isExpandedNode ? 'ag-group-contracted' : 'ag-group-expanded ',
					]"
					@click.stop="expandNode()"
					><span
						:class="[
							'ag-icon',
							!isExpandedNode ? 'ag-icon-tree-closed' : 'ag-icon-tree-open',
						]"
					></span
				></span>
			</span>
			<span class="editing-mode-cells">
				<span :style="params.node?.allChildrenCount ? 'font-weight:bold' : ''">
					{{ params.node?.allChildrenCount ? 'Группа' : 'Элемент' }}
				</span>
				<div v-if="params?.isEditable()">
					<button
						class="primary-button material-icons"
						@click.stop="params.onAddNodeClick"
					>
						add
					</button>
					<button
						class="danger-button material-icons"
						@click.stop="params.onRemoveNodeClick"
					>
						close
					</button>
				</div>
			</span>
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
