import {Transform} from 'node:stream'

export const skip = (n) => {
	let count = 0
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			if (count++ >= n) {
				this.push(chunk)
			}
			callback()
		},
	})
}
