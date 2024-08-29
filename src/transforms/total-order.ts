import * as R from 'ramda'

import {Transform} from 'node:stream'

export const totalOrder = (indexFn: (x: any) => number, initialIndex = 0) => {
	let deferred: Record<number, any> = {}
	let nextIndex = initialIndex
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const chunkIndex = parseInt(indexFn(chunk).toString())
			if (R.type(chunkIndex) !== 'Number' || chunkIndex < 0 || deferred[chunkIndex]) {
				throw new Error(`indexFn must return a unique integer >= 0, value was ${chunkIndex}`)
			}
			if (chunkIndex === nextIndex) {
				this.push(chunk)
				nextIndex++
				while (deferred[nextIndex]) {
					this.push(deferred[nextIndex])
					delete deferred[nextIndex]
					nextIndex++
				}
			} else {
				deferred[chunkIndex] = chunk
			}
			callback()
		},
		flush(callback) {
			if (!R.isEmpty(deferred)) {
				throw new Error('there was an unexpected gap in index values')
			}
			callback()
		}
	})
}
