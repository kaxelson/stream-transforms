import {Transform} from 'node:stream'

export const filter = (fn) => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			Promise.resolve()
				.then(() => fn(chunk))
				.then(result => {
					if (result) {
						this.push(chunk)
					}
					callback()
				})
		},
	})
}
