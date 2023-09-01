import {Transform} from 'node:stream'

export const tap = (fn) => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			Promise.resolve()
				.then(() => fn(chunk))
				.then(result => {
					this.push(chunk)
					callback()
				})
		}
	})
}
