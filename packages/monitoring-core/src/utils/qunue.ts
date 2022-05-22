export class Queue {
  items: any
  constructor() {
    this.items = new WeakMap()
    this.items.set(this, [])
  }
  enqueue(element: any) {
    let q = this.items.get(this)
    q.push(element)
  }
  dequeue() {
    let q = this.items.get(this)
    return q.shift()
  }
  front() {
    let q = this.items.get(this)
    return q[0]
  }
  isEmpty() {
    let q = this.items.get(this)
    return q.length === 0
  }
  size() {
    let q = this.items.get(this)
    return q.length
  }
  print() {
    let q = this.items.get(this)
    console.log(q.toString())
  }
}
