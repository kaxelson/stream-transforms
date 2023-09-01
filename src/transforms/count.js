import {Transform} from 'node:stream'

export const count = (options) => {
	options = Object.assign({
		logFinal: true,
		logEvery: 0,
		label: 'count',
		onCount: (label, count) => {},
		filter: chunk => true
	}, options)
	let count = 0
	let logPending = false
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			if (options.filter(chunk)) {
				count++
				logPending = true
				if (options.logEvery > 0 && count % options.logEvery === 0) {
					console.log(options.label, count)
					logPending = false
				}
				options.onCount(options.label, count)
			}
			this.push(chunk)
			callback()
		},
		flush(callback) {
			if (logPending && options.logFinal) {
				console.log(options.label, count)
			}
			callback()
		}
	})
}
