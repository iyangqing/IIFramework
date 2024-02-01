namespace numas {
    /**
     * 堆实现
     * 堆作为优先级队列来使用
     * 默认的比较函数给出的是最小堆
     */
    export class Heap<T> {
        private data: T[] = [];
        /**
         * 构造函数
         * @param m_Compare 类型： (a: T, b: T) => number，当 a 排在 b 前面时，应当返回 -1
         */
        constructor(private m_Compare: (a: T, b: T) => number) { }
        private left(nodeIndex: number): number { return (2 * nodeIndex) + 1; }
        private right(nodeIndex: number): number { return (2 * nodeIndex) + 2; }
        private parent(nodeIndex: number): number {
            return nodeIndex % 2 == 0
            ? (nodeIndex - 2) / 2
            : (nodeIndex - 1) / 2;
        }

        /**
         * Adds the given element into the heap in O(logn)
         */
        Add(element: T) {
            this.data.push(element);
            this.siftUp(this.data.length - 1);
        }

        /**
         * Moves the node at the given index up to its proper place in the heap.
         * @param index The index of the node to move up.
         */
        private siftUp(index: number): void {
            let parent = this.parent(index);
            while (index > 0 && this.m_Compare(this.data[parent], this.data[index]) > 0) {
                [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
                index = parent;
                parent = this.parent(index);
            }
        }

        /**
         * Retrieves and removes the root element of this heap in O(logn)
         * - Returns root of the heap.
         * - Check size of the heap before ExtractRoot.
         */
        ExtractRoot(): T {
            console.assert(this.data.length > 0);
            const root = this.data[0];
            const last = this.data.pop();
            if (this.data.length > 0) {
                this.data[0] = last as T;
                this.siftDown(0);
            }
            return root;
        }

        /**
         * Moves the node at the given index down to its proper place in the heap.
         * @param nodeIndex The index of the node to move down.
         */
        private siftDown(nodeIndex: number): void {
            /** @returns the index containing the smaller value */
            const minIndex = (left: number, right: number) => {
                if (right >= this.data.length) {
                    if (left >= this.data.length) {
                        return -1;
                    } else {
                        return left;
                    }
                } else {
                    if (this.m_Compare(this.data[left], this.data[right]) <= 0) {
                        return left;
                    } else {
                        return right;
                    }
                }
            }

            let min = minIndex(this.left(nodeIndex), this.right(nodeIndex));

            while (
                min >= 0
                && this.m_Compare(this.data[nodeIndex], this.data[min]) > 0
            ) {
                [this.data[min], this.data[nodeIndex]] = [this.data[nodeIndex], this.data[min]];
                nodeIndex = min;
                min = minIndex(this.left(nodeIndex), this.right(nodeIndex));
            }
        }

        /**
         * Returns the number of elements in the heap in O(1)
         */
        get Count(): number { return this.data.length; }

        /**
         * Retrieves but does not remove the root element of this heap in O(1)
         * - Check Count before get Root.
         */
        get Root(): T {
            if (this.data.length > 0) {
                return this.data[0];
            } else {
                throw new Error('Check Count before get Root')
            }
        }
        Clear() { while(this.data.length > 0){ this.ExtractRoot() } }
    }
}
