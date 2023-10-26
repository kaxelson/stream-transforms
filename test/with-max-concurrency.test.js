import {describe, expect, jest, test} from '@jest/globals'

import * as R from 'ramda'

import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {setTimeout} from 'node:timers/promises'

import * as T from '../src/index.js'

describe('withMaxConcurrency', () => {
	test('withMaxConcurrency', async () => {
		let concurrency = 0
		const fn = jest.fn()
		await pipeline([
			Readable.from(R.range(0, 100)),
			T.withMaxConcurrency(10)(async x => {
				concurrency++
				await setTimeout(Math.ceil(Math.random() * 100))
				fn(x, concurrency--)
			}),
			T.sink()
		])
		expect(fn).toHaveBeenCalledTimes(100)

		const maxConcurrency = Math.max(...fn.mock.calls.map(c => c[1]))
		expect(maxConcurrency).toBe(10)
	})
})
