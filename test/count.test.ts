import {describe, expect, test, vi} from 'vitest'

import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'

import * as T from '../src/index.js'

describe('count', () => {
	test('count', async () => {
		const onCount = vi.fn()
		await pipeline([
			Readable.from(['x', 'y', 'z']),
			T.count({onCount}),
			T.sink()
		])
		expect(onCount).toHaveBeenCalledTimes(3)
		expect(onCount).toHaveBeenCalledWith('count', 1)
		expect(onCount).toHaveBeenCalledWith('count', 2)
		expect(onCount).toHaveBeenCalledWith('count', 3)
	})
})
