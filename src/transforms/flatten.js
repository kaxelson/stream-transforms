import * as R from 'ramda'

import {Transform} from 'node:stream'

export const flatten = () => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			if (R.type(chunk) !== 'Array') {
				chunk = [chunk]
			}
			for (const x of chunk) {
				this.push(x)
			}
			callback()
		},
	})
}
