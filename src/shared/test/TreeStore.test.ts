import { beforeEach, describe, expect, it } from 'vitest'

import type { TTreeItem } from '../types'
import { TreeStore } from '../model'

describe('TreeStore', () => {
	let treeStore: TreeStore
	let items: TTreeItem[]

	beforeEach(() => {
		items = [
			{ id: 1, parent: null, label: 'Item 1' },
			{ id: '2', parent: 1, label: 'Item 2' },
			{ id: 3, parent: 1, label: 'Item 3' },
			{ id: 4, parent: '2', label: 'Item 4' },
			{ id: 5, parent: '2', label: 'Item 5' },
			{ id: 6, parent: '2', label: 'Item 6' },
			{ id: 7, parent: 4, label: 'Item 7' },
			{ id: 8, parent: 4, label: 'Item 8' },
		]
		treeStore = new TreeStore(items)
	})

	it('getAll should return all items', () => {
		expect(treeStore.getAll()).toHaveLength(items.length)
		expect(treeStore.getAll()).toEqual(expect.arrayContaining(items))
	})

	it('getItem should return the correct item', () => {
		expect(treeStore.getItem(1)).toEqual({
			id: 1,
			parent: null,
			label: 'Item 1',
		})
		expect(treeStore.getItem('2')).toEqual({
			id: '2',
			parent: 1,
			label: 'Item 2',
		})
	})

	it('getChildren should return the correct children', () => {
		expect(treeStore.getChildren(1)).toEqual(
			expect.arrayContaining([
				{ id: '2', parent: 1, label: 'Item 2' },
				{ id: 3, parent: 1, label: 'Item 3' },
			])
		)
		expect(treeStore.getChildren('2')).toEqual(
			expect.arrayContaining([
				{ id: 4, parent: '2', label: 'Item 4' },
				{ id: 5, parent: '2', label: 'Item 5' },
				{ id: 6, parent: '2', label: 'Item 6' },
			])
		)
	})

	it('getAllChildren should return all descendants', () => {
		expect(treeStore.getAllChildren('2')).toEqual(
			expect.arrayContaining([
				{ id: 4, parent: '2', label: 'Item 4' },
				{ id: 5, parent: '2', label: 'Item 5' },
				{ id: 6, parent: '2', label: 'Item 6' },
				{ id: 7, parent: 4, label: 'Item 7' },
				{ id: 8, parent: 4, label: 'Item 8' },
			])
		)
	})

	it('getAllParents should return all ancestors in correct order', () => {
		expect(treeStore.getAllParents(7)).toEqual([
			{ id: 1, parent: null, label: 'Item 1' },
			{ id: '2', parent: 1, label: 'Item 2' },
			{ id: 4, parent: '2', label: 'Item 4' },
			{ id: 7, parent: 4, label: 'Item 7' },
		])
	})

	it('addItem should add a new item', () => {
		treeStore.addItem({ id: 9, parent: 1, label: 'Item 9' })
		expect(treeStore.getItem(9)).toEqual({ id: 9, parent: 1, label: 'Item 9' })
		expect(treeStore.getChildren(1)).toContainEqual({
			id: 9,
			parent: 1,
			label: 'Item 9',
		})
		expect(treeStore.getAll()).toContainEqual({
			id: 9,
			parent: 1,
			label: 'Item 9',
		})
	})

	it('removeItem should remove an item', () => {
		// Убедитесь, что элемент с id 3 существует в дереве
		const item = { id: 3, parent: 1, label: 'Item 3' }
		treeStore.addItem(item)

		treeStore.removeItem(3)
		expect(treeStore.getItem(3)).toBeUndefined()
		expect(treeStore.getChildren(1)).not.toContainEqual(item)
		expect(treeStore.getAll()).not.toContainEqual(item)
	})

	it('updateItem should update an existing item', () => {
		treeStore.updateItem({ id: '2', parent: 1, label: 'Updated Item 2' })
		expect(treeStore.getItem('2')).toEqual({
			id: '2',
			parent: 1,
			label: 'Updated Item 2',
		})
		expect(treeStore.getChildren(1)).toContainEqual({
			id: '2',
			parent: 1,
			label: 'Updated Item 2',
		})
		expect(treeStore.getAll()).toContainEqual({
			id: '2',
			parent: 1,
			label: 'Updated Item 2',
		})
	})

	it('should handle duplicate ids', () => {
		const duplicateItems = [
			{ id: 1, parent: null, label: 'Item 1' },
			{ id: 1, parent: null, label: 'Duplicate Item 1' },
		]
		const treeStoreWithDuplicates = new TreeStore(duplicateItems)
		expect(treeStoreWithDuplicates.getAll()).toEqual(
			expect.arrayContaining([{ id: 1, parent: null, label: 'Item 1' }])
		)
	})
})
