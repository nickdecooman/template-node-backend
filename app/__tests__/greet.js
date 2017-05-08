import greet from '../src/greet';

test('greet World to print Hello World', async () => {
  expect(greet('World')).toBe('Hello World');
});
