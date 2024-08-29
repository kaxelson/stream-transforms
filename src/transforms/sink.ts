import {Transform} from 'node:stream'

export const sink = () => {
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			callback()
		},
		flush(callback) {
			// console.log('sink finished')
			callback()
		}
	})
}
