import {Transform} from 'node:stream'

export const withMaxConcurrency = (maxConcurrency) => (fn) => {
	let nextPromiseId = 1
	let activeCount = 0
	let activePromises = {}
	let blockedCallback = null
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const promiseId = nextPromiseId++
			Promise.resolve()
			.then(() => {
				const p = fn(chunk)
				activePromises[promiseId.toString()] = p
				activeCount++
				// console.log('max concurrency active count: ', activeCount)
				if (activeCount < maxConcurrency) {
					callback()
				} else {
					// console.log('max concurrency blocking')
					blockedCallback = callback
				}
				return p
			})
			.then(result => {
				this.push(result)
				delete activePromises[promiseId.toString()]
				activeCount--
				// console.log('max concurrency active count: ', activeCount)
				if (activeCount < maxConcurrency && blockedCallback) {
					// console.log('max concurrency releasing')
					blockedCallback()
					blockedCallback = null
				}
			})
		},
		flush(callback) {
			const remainingPromises = Object.values(activePromises)
			// console.log('max concurrency remaining at flush: ', remainingPromises.length)
			Promise.all(remainingPromises).then(() => callback())
		}
	})
}
