import {Transform} from 'node:stream'

export type Options = {
	logFinal: boolean
	logEvery: number
	label: string
	onCount: (label: string, count: number) => void,
	filter: (chunk: any) => boolean
}

export const count = (options: Partial<Options>) => {
	const activeOptions: Options = Object.assign({
		logFinal: true,
		logEvery: 0,
		label: 'count',
		onCount: (label: string, count: number) => {},
		filter: (chunk: any) => true
	}, options)
	let count = 0
	let logPending = false
	return new Transform({
		objectMode: true,
		transform(chunk, encoding, callback) {
			if (activeOptions.filter(chunk)) {
				count++
				logPending = true
				if (activeOptions.logEvery > 0 && count % activeOptions.logEvery === 0) {
					console.log(activeOptions.label, count)
					logPending = false
				}
				activeOptions.onCount(activeOptions.label, count)
			}
			this.push(chunk)
			callback()
		},
		flush(callback) {
			if (logPending && activeOptions.logFinal) {
				console.log(activeOptions.label, count)
			}
			callback()
		}
	})
}
