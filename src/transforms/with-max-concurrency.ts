import {randomUUID} from 'node:crypto'
import {Transform, type TransformCallback} from 'node:stream'

export const withMaxConcurrency = (maxConcurrency: number) => (fn: (x: any) => any) => {
	let activeCount = 0
	let promises: Record<string, Promise<any>> = {}

	const execute = async (chunk: any, callback: TransformCallback, transform: Transform) => {
		let activeCallback: TransformCallback | undefined = callback
		const p = fn(chunk)
		activeCount++
		if (activeCount < maxConcurrency) {
			activeCallback()
			activeCallback = undefined
		}
		const result = await p
		transform.push(result)
		activeCount--
		if (activeCount < maxConcurrency && activeCallback) {
			activeCallback()
		}
		return result
	}

	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const promiseId = randomUUID()
			const p = execute(chunk, callback, this)
			promises[promiseId] = p
			p.then(() => delete promises[promiseId])
		},
		flush(callback) {
			Promise.all(Object.values(promises)).then(() => {
				promises = {}
				callback()
			})
		}
	})
}

