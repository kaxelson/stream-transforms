import NodeCache from 'node-cache'
import * as R from 'ramda'

import {Transform} from 'node:stream'

export const dedup = (keyfn = R.identity) => {
	const cache = new NodeCache()
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const key = keyfn(chunk)
			if (!cache.has(key)) {
				this.push(chunk)
				cache.set(key, key)
			}
			callback()
		}
	})
}
