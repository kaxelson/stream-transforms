import * as R from 'ramda'

import {Transform} from 'node:stream'

export const onFinish = (fn: () => any) => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			// pass through chunks
			this.push(chunk)
			callback()
		},
		flush(callback) {
			// execute supplied function on stream close
			Promise.resolve()
				.then(() => fn())
				.then(result => {
					// push the result if there is one
					if (R.isNotNil(result)) {
						this.push(result)
					}
					callback()
				})
		}
	})
}
