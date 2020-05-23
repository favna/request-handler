import ava from 'ava';
import { RequestHandler } from '../src';
import { get, getAll, getThrows, getAllThrows, allSettled, getAllNulls } from './lib/mock';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => { };

ava('fields', (test): void => {
	test.plan(2);

	const rh = new RequestHandler(get, getAll);
	test.is(rh.getFn, get);
	test.is(rh.getAllFn, getAll);
});

ava('get', async (test): Promise<void> => {
	const rh = new RequestHandler(get, getAll);
	const value = await rh.push('Hello');
	test.deepEqual(value, { id: 'Hello', value: 0 });
});

ava('get(Duplicated)', async (test): Promise<void> => {
	test.plan(3);

	const rh = new RequestHandler(get, getAll);
	const values = await Promise.all(['Hello', 'Hello', 'Hello'].map(key => rh.push(key)));
	test.deepEqual(values[0], { id: 'Hello', value: 0 });
	test.deepEqual(values[1], { id: 'Hello', value: 0 });
	test.deepEqual(values[2], { id: 'Hello', value: 0 });
});

ava('getMultiple(Sequential)', async (test): Promise<void> => {
	test.plan(2);

	const rh = new RequestHandler(get, getAll);
	test.deepEqual(await rh.push('Hello'), { id: 'Hello', value: 0 });
	test.deepEqual(await rh.push('World'), { id: 'World', value: 1 });
});

ava('getMultiple(Parallel)', async (test): Promise<void> => {
	test.plan(3);

	const rh = new RequestHandler(get, getAll);
	const values = await Promise.all(['Hello', 'World', 'Foo'].map(key => rh.push(key)));
	test.deepEqual(values[0], { id: 'Hello', value: 0 });
	test.deepEqual(values[1], { id: 'World', value: 1 });
	test.deepEqual(values[2], { id: 'Foo', value: 2 });
});

ava('getMultiple(Parallel | Partial)', async (test): Promise<void> => {
	test.plan(3);

	const rh = new RequestHandler(get, getAll);
	const values = await Promise.all(['Hello', 'World', 'Test3'].map(key => rh.push(key)));
	test.deepEqual(values[0], { id: 'Hello', value: 0 });
	test.deepEqual(values[1], { id: 'World', value: 1 });
	test.deepEqual(values[2], null);
});

ava('getMultiple(Parallel | Nulls)', async (test): Promise<void> => {
	test.plan(3);

	const rh = new RequestHandler(get, getAllNulls);
	const values = await Promise.all(['Hello', 'World', 'Test3'].map(key => rh.push(key)));
	test.deepEqual(values[0], { id: 'Hello', value: 0 });
	test.deepEqual(values[1], { id: 'World', value: 1 });
	test.deepEqual(values[2], null);
});

ava('get(Throws)', async (test): Promise<void> => {
	const rhThrows = new RequestHandler(getThrows, getAllThrows);
	await test.throwsAsync(() => rhThrows.push('Test3'), { message: "Key 'Test3' does not exist." });
});

ava('getMultiple(Throws | Sequential)', async (test): Promise<void> => {
	test.plan(2);

	const rhThrows = new RequestHandler(getThrows, getAllThrows);
	test.deepEqual(await rhThrows.push('Hello'), { id: 'Hello', value: 0 });
	await test.throwsAsync(() => rhThrows.push('Test3'), { message: "Key 'Test3' does not exist." });
});

ava('getMultiple(Throws | Parallel)', async (test): Promise<void> => {
	test.plan(3);

	const rhThrows = new RequestHandler(getThrows, getAllThrows);
	const keys = ['Hello', 'World', 'Test3'];
	const values = await allSettled(keys.map(key => rhThrows.push(key)));
	test.deepEqual(values[0], { status: 'fulfilled', value: { id: 'Hello', value: 0 } });
	test.deepEqual(values[1], { status: 'rejected', reason: new Error("Key 'Test3' does not exist.") });
	test.deepEqual(values[2], { status: 'rejected', reason: new Error("Key 'Test3' does not exist.") });
});

ava('wait', async (test): Promise<void> => {
	const rh = new RequestHandler(get, getAll);

	let counter = 1;
	rh.push('Hello').finally(() => --counter);
	await rh.wait();
	test.deepEqual(counter, 0);
});

ava('wait(Empty)', async (test): Promise<void> => {
	const rh = new RequestHandler(get, getAll);
	await test.notThrowsAsync(() => rh.wait());
});

ava('wait(Throws)', async (test): Promise<void> => {
	const rh = new RequestHandler(getThrows, getAllThrows);

	let counter = 1;
	rh.push('Test3').catch(noop).finally(() => --counter);
	await rh.wait();
	test.deepEqual(counter, 0);
});

ava('wait(Multiple)', async (test): Promise<void> => {
	const rh = new RequestHandler(get, getAll);

	let counter = 2;
	rh.push('Hello').finally(() => --counter);
	rh.push('World').finally(() => --counter);
	await rh.wait();
	test.deepEqual(counter, 0);
});

ava('wait(Multiple | Duplicated)', async (test): Promise<void> => {
	const rh = new RequestHandler(get, getAll);

	let counter = 3;
	rh.push('Hello').finally(() => --counter);
	rh.push('Hello').finally(() => --counter);
	rh.push('World').finally(() => --counter);
	await rh.wait();
	test.deepEqual(counter, 0);
});

ava('wait(Multiple | Throws)', async (test): Promise<void> => {
	const rh = new RequestHandler(getThrows, getAllThrows);

	let counter = 3;
	rh.push('Test3').catch(noop).finally(() => --counter);
	rh.push('Hello').finally(() => --counter);
	rh.push('World').finally(() => --counter);
	await rh.wait();
	test.deepEqual(counter, 0);
});
