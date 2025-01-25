import type { TTreeItem } from '../types'

/**
 * Класс для управления деревом элементов.
 */
export class TreeStore {
	private items: Map<string | number, TTreeItem>
	private childrenMap: Map<string | number, TTreeItem[]>
	private parentMap: Map<string | number, string | number | null>

	/**
	 * Конструктор класса TreeStore.
	 * @param {TTreeItem[]} items - Массив элементов дерева.
	 */
	constructor(items: TTreeItem[]) {
		this.items = new Map()
		this.childrenMap = new Map()
		this.parentMap = new Map()
		this.initializeMaps(items)
	}

	/**
	 * Инициализирует карты элементов, дочерних элементов и родительских элементов.
	 * @private
	 * @param {TTreeItem[]} items - Массив элементов дерева.
	 */

	private initializeMaps(items: TTreeItem[]): void {
		const seen = new Set<string | number>()
		for (const item of items) {
			if (!seen.has(item.id)) {
				seen.add(item.id)
				this.items.set(item.id, item)
				this.parentMap.set(item.id, item.parent)
				if (item.parent !== null) {
					if (!this.childrenMap.has(item.parent)) {
						this.childrenMap.set(item.parent, [])
					}
					this.childrenMap.get(item.parent)!.push(item)
				}
			}
		}
	}
	/**
	 * Возвращает все элементы дерева.
	 * @returns {TTreeItem[]} - Массив всех элементов дерева.
	 */
	getAll(): TTreeItem[] {
		return Array.from(this.items.values())
	}

	/**
	 * Возвращает элемент по его id.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem | undefined} - Элемент или undefined, если элемент не найден.
	 */
	getItem(id: string | number): TTreeItem | undefined {
		return this.items.get(id)
	}

	/**
	 * Возвращает все дочерние элементы для данного id.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem[]} - Массив дочерних элементов.
	 */
	getChildren(id: string | number): TTreeItem[] {
		return this.childrenMap.get(id) || []
	}

	/**
	 * Возвращает всех потомков для данного id.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem[]} - Массив всех потомков.
	 */
	getAllChildren(id: string | number): TTreeItem[] {
		const result: TTreeItem[] = []
		const stack: TTreeItem[] = this.getChildren(id)
		while (stack.length > 0) {
			const current = stack.pop()!
			result.push(current)
			stack.push(...(this.childrenMap.get(current.id) || []).reverse())
		}
		return result
	}

	/**
	 * Возвращает всех родителей для данного id, начиная с самого элемента и до корневого элемента.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem[]} - Массив всех родителей в правильном порядке.
	 */
	getAllParents(id: string | number): TTreeItem[] {
		const result: TTreeItem[] = []
		let currentId: string | number | null = id

		while (currentId !== null) {
			const item = this.getItem(currentId)
			if (item) {
				result.push(item)
				currentId = item.parent // Переходим к родительскому элементу
			} else {
				break
			}
		}
		result.reverse() // Переворачиваем массив, чтобы родители были в правильном порядке
		return result
	}

	/**
	 * Добавляет новый элемент в дерево.
	 * @param {TTreeItem} item - Новый элемент.
	 */
	addItem(item: TTreeItem): void {
		if (!this.items.has(item.id)) {
			this.items.set(item.id, item)
			this.parentMap.set(item.id, item.parent)
			if (item.parent !== null) {
				if (!this.childrenMap.has(item.parent)) {
					this.childrenMap.set(item.parent, [])
				}
				this.childrenMap.get(item.parent)!.push(item)
			}
		}
	}

	/**
	 * Удаляет элемент из дерева и всех его потомков.
	 * @param {string | number} id - Идентификатор элемента.
	 */
	removeItem(id: string | number): void {
		const item = this.getItem(id)
		if (item) {
			// Рекурсивно удаляем всех дочерних элементов
			const children = this.getChildren(id)
			children.forEach(child => this.removeItem(child.id))
			// Удаляем сам элемент
			this.items.delete(id)
			this.parentMap.delete(id)
			if (this.childrenMap.has(id)) {
				this.childrenMap.delete(id)
			}
			// Обновляем список дочерних элементов родителя
			const parentId = item.parent
			if (parentId !== null) {
				const siblings = this.childrenMap.get(parentId)
				if (siblings) {
					this.childrenMap.set(
						parentId,
						siblings.filter(sibling => sibling.id !== id)
					)
				}
			}
		}
	}

	/**
	 * Обновляет существующий элемент в дереве.
	 * @param {TTreeItem} updatedItem - Обновленный элемент.
	 */
	updateItem(updatedItem: TTreeItem): void {
		const item = this.getItem(updatedItem.id)
		if (item) {
			const oldParent = item.parent
			item.parent = updatedItem.parent
			item.label = updatedItem.label
			this.parentMap.set(updatedItem.id, updatedItem.parent)

			if (oldParent !== null) {
				const oldChildren = this.childrenMap.get(oldParent)
				if (oldChildren) {
					this.childrenMap.set(
						oldParent,
						oldChildren.filter(child => child.id !== updatedItem.id)
					)
				}
			}

			if (updatedItem.parent !== null) {
				if (!this.childrenMap.has(updatedItem.parent)) {
					this.childrenMap.set(updatedItem.parent, [])
				}
				this.childrenMap.get(updatedItem.parent)!.push(item)
			}
		}
	}
}
