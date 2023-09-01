import {EOL} from 'node:os'
import {Transform} from 'node:stream'

export const line = (separator = EOL) => {
	let partial = ''
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			const lines = (partial + chunk).split(separator)
			partial = lines.pop()
			for (const line of lines) {
				this.push(line)
			}
			callback()
		},
		flush(callback) {
			if (partial.length > 0) {
				this.push(partial)
				partial = ''
			}
			callback()
		}
	})
}
