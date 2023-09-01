import {Transform} from 'node:stream'

export const splitEvery = groupSize => {
	let group = []
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			group.push(chunk)
			if (group.length >= groupSize) {
				this.push(group)
				group = []
			}
			callback()
		},
		flush(callback) {
			if (group.length > 0) {
				this.push(group)
				group = []
			}
			callback()
		}
	})
}
