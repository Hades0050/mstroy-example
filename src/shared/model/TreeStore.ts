import type { TTreeItem } from '../types'

/**
 * Интерфейс для управления деревом элементов.
 */
interface ITreeStore {
	getAll(): TTreeItem[]
	getItem(id: string | number): TTreeItem | undefined
	getChildren(id: string | number): TTreeItem[]
	getAllChildren(id: string | number): TTreeItem[]
	getAllParents(id: string | number): TTreeItem[]
	addItem(item: TTreeItem): void
	removeItem(id: string | number): void
	updateItem(updatedItem: TTreeItem): void
}

/**
 * Класс для управления деревом элементов.
 */
export class TreeStore implements ITreeStore {
	private items: Map<string | number, TTreeItem> = new Map()
	private childrenMap: WeakMap<TTreeItem, Set<string | number>> = new WeakMap()
	private allChildrenCache: Map<string | number, TTreeItem[]> = new Map()
	private allParentsCache: Map<string | number, TTreeItem[]> = new Map()

	/**
	 * Конструктор класса TreeStore.
	 * @param {TTreeItem[]} items - Массив элементов дерева.
	 */
	constructor(items: TTreeItem[]) {
		this.initializeStore(items)
	}

	/**
	 * Инициализирует карты элементов, дочерних элементов и родительских элементов.
	 * @private
	 * @param {TTreeItem[]} items - Массив элементов дерева.
	 */
	private initializeStore(items: TTreeItem[]): void {
		const seen = new Set<string | number>()
		items.forEach(item => {
			if (!seen.has(item.id)) {
				seen.add(item.id)
				this.items.set(item.id, item)
				if (item.parent !== null) {
					const parentItem = this.items.get(item.parent)
					if (parentItem) {
						if (!this.childrenMap.has(parentItem)) {
							this.childrenMap.set(parentItem, new Set())
						}
						this.childrenMap.get(parentItem)!.add(item.id)
					}
				}
			}
		})
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
		const item = this.items.get(id)
		if (!item) return []
		const childrenIds = this.childrenMap.get(item) || new Set()
		return Array.from(childrenIds)
			.map(childId => this.items.get(childId)!)
			.filter(Boolean)
	}

	/**
	 * Возвращает всех потомков для данного id.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem[]} - Массив всех потомков.
	 */
	getAllChildren(id: string | number): TTreeItem[] {
		if (this.allChildrenCache.has(id)) {
			return this.allChildrenCache.get(id)!
		}

		const result: TTreeItem[] = []
		const stack: TTreeItem[] = this.getChildren(id)
		const visited = new Set<string | number>()

		while (stack.length > 0) {
			const current = stack.pop()!
			if (!visited.has(current.id)) {
				visited.add(current.id)
				result.push(current)
				stack.push(...this.getChildren(current.id))
			}
		}

		this.allChildrenCache.set(id, result)
		return result
	}

	/**
	 * Возвращает всех родителей для данного id, начиная с самого элемента и до корневого элемента.
	 * @param {string | number} id - Идентификатор элемента.
	 * @returns {TTreeItem[]} - Массив всех родителей в правильном порядке.
	 */

	getAllParents(id: string | number): TTreeItem[] {
		if (this.allParentsCache.has(id)) {
			return this.allParentsCache.get(id)!
		}
		const result: TTreeItem[] = []
		let currentId: string | number | null = id
		while (currentId !== null) {
			const item = this.items.get(currentId)
			if (item) {
				result.unshift(item)
				currentId = item.parent
			} else {
				break
			}
		}

		this.allParentsCache.set(id, result)
		return result
	}

	/**
	 * Добавляет новый элемент в дерево.
	 * @param {TTreeItem} item - Новый элемент.
	 */
	addItem(item: TTreeItem): void {
		if (!this.items.has(item.id)) {
			this.items.set(item.id, item)
			if (item.parent !== null) {
				const parentItem = this.items.get(item.parent)
				if (parentItem) {
					if (!this.childrenMap.has(parentItem)) {
						this.childrenMap.set(parentItem, new Set())
					}
					this.childrenMap.get(parentItem)!.add(item.id)
				}
			}
			this.clearCaches()
		}
	}

	/**
	 * Удаляет элемент из дерева.
	 * @param {string | number} id - Идентификатор элемента.
	 */
	removeItem(id: string | number): void {
		const itemToRemove = this.items.get(id)
		if (itemToRemove) {
			const stack = [itemToRemove]
			while (stack.length > 0) {
				const current = stack.pop()!
				this.items.delete(current.id)
				const children = this.childrenMap.get(current)
				if (children) {
					children.forEach(childId => {
						const childItem = this.items.get(childId)
						if (childItem) stack.push(childItem)
					})
					this.childrenMap.delete(current)
				}
			}
			if (itemToRemove.parent !== null) {
				const parentItem = this.items.get(itemToRemove.parent)
				if (parentItem) {
					this.childrenMap.get(parentItem)?.delete(id)
				}
			}
			this.clearCaches()
		}
	}

	/**
	 * Обновляет существующий элемент в дереве.
	 * @param {TTreeItem} updatedItem - Обновленный элемент.
	 */
	updateItem(updatedItem: TTreeItem): void {
		const item = this.items.get(updatedItem.id)
		if (item) {
			const oldParent = item.parent
			if (oldParent !== updatedItem.parent) {
				if (oldParent !== null) {
					const oldParentItem = this.items.get(oldParent)
					if (oldParentItem) {
						this.childrenMap.get(oldParentItem)?.delete(updatedItem.id)
					}
				}
				if (updatedItem.parent !== null) {
					const newParentItem = this.items.get(updatedItem.parent)
					if (newParentItem) {
						if (!this.childrenMap.has(newParentItem)) {
							this.childrenMap.set(newParentItem, new Set())
						}
						this.childrenMap.get(newParentItem)!.add(updatedItem.id)
					}
				}
			}
			Object.assign(item, updatedItem)
			this.clearCaches()
		}
	}

	/**
	 * Очищает кэши всех потомков и родителей.
	 * @private
	 */
	private clearCaches(): void {
		this.allChildrenCache.clear()
		this.allParentsCache.clear()
	}
}
