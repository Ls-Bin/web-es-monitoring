export class Queue {
  items: any

  constructor() {
    this.items = new WeakMap()
    this.items.set(this, [])
  }

  enqueue(element: any) {
    const q = this.items.get(this)
    q.push(element)
  }

  dequeue() {
    const q = this.items.get(this)
    return q.shift()
  }

  front() {
    const q = this.items.get(this)
    return q[0]
  }

  isEmpty() {
    const q = this.items.get(this)
    return q.length === 0
  }

  size() {
    const q = this.items.get(this)
    return q.length
  }

  print() {
    const q = this.items.get(this)
    console.log(q.toString())
  }
}
