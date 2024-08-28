// (c) [2024] [Knute Axelson]
// All Rights reserved

import {Transform} from 'node:stream'
import * as R from 'ramda'

export const totalOrder = (indexFn, initialIndex = 0) => {
	let deferred = {}
	let nextIndex = initialIndex
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const chunkIndex = parseInt(indexFn(chunk))
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
