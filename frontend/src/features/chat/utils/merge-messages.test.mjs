import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mergeMessages } from './merge-messages.ts';

const message = id => ({ id, payload: `message-${id}`, timestamp: 100 });

test('history and live events merge without duplicates or losing new messages', () => {
    const history = [message(3), message(4)];
    const live = [message(4), message(5)];
    assert.deepEqual(mergeMessages(history, live).map(item => item.id), [3, 4, 5]);
    assert.deepEqual(history.map(item => item.id), [3, 4]);
});

test('older pages preserve order even with equal timestamps and missing IDs', () => {
    assert.deepEqual(mergeMessages([message(20)], [message(1), message(8)])
        .map(item => item.id), [1, 8, 20]);
});

test('empty final page retains existing messages', () => {
    assert.deepEqual(mergeMessages([], [message(1)]), [message(1)]);
    assert.deepEqual(mergeMessages([], []), []);
});
