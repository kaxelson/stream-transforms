import {v4 as uuidv4} from 'uuid'

import {Transform} from 'node:stream'

export const withMaxConcurrency = (maxConcurrency) => (fn) => {
	let activeCount = 0
	let promises = {}

	const execute = async (chunk, callback, transform) => {
		const p = fn(chunk)
		activeCount++
		// console.log('(max concurrency) active count before await: ', activeCount)
		if (activeCount < maxConcurrency) {
			callback()
			callback = null
		} else {
			// console.log('(max concurrency) blocking')
		}
		const result = await p
		transform.push(result)
		activeCount--
		// console.log('(max concurrency) active count after await: ', activeCount)
		if (activeCount < maxConcurrency && callback) {
			// console.log('(max concurrency) releasing')
			callback()
		}
		return result
	}

	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const promiseId = uuidv4()
			const p = execute(chunk, callback, this)
			promises[promiseId] = p
			p.then(() => delete promises[promiseId])
		},
		flush(callback) {
			// console.log('(max concurrency) concurrency at flush: ', activeCount)
			Promise.all(Object.values(promises)).then(() => {
				promises = []
				callback()
			})
		}
	})
}

