import {Transform} from 'node:stream'

export const splitOnChange = valueFn => {
	let group = []
	let value = null
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const chunkValue = valueFn(chunk)
			if (value === null) {
				value = chunkValue
			}
			if (value !== chunkValue) {
				this.push(group)
				group = []
				value = chunkValue
			}
			group.push(chunk)
			callback()
		},
		flush(callback) {
			if (group.length > 0) {
				this.push(group)
				group = []
				value = null
			}
			callback()
		}
	})
}
