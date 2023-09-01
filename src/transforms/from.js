import {Transform} from 'node:stream'

export const from = (fn) => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			Promise.resolve()
				.then(() => fn(chunk))
				.then(result => {
					this.push(result)
					callback()
				})
		}
	})
}
