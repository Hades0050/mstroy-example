import type { TTreeItem } from '../types'

function generateLargeTree(size: number): TTreeItem[] {
	const items: TTreeItem[] = []
	for (let i = 1; i <= size; i++) {
		const parent = i % 10 === 0 ? null : Math.floor(i / 10)
		items.push({ id: i, parent: parent, label: `Item ${i}` })
	}
	return items
}

const size = 1000000
export const largeTree = generateLargeTree(size)
