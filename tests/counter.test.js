import { createCounter, renderCounter } from '../src/js/counter.js';

describe('createCounter', () => {
    test('starts with the given initial value', () => {
        const counter = createCounter(5);
        expect(counter.getValue()).toBe(5);
    });

    test('defaults to 0 when no initial value is given', () => {
        const counter = createCounter();
        expect(counter.getValue()).toBe(0);
    });

    test('increments the counter', () => {
        const counter = createCounter();
        counter.increment();
        counter.increment();
        expect(counter.getValue()).toBe(2);
    });

    test('decrements the counter', () => {
        const counter = createCounter(3);
        counter.decrement();
        expect(counter.getValue()).toBe(2);
    });

    test('resets the counter to the initial value', () => {
        const counter = createCounter(1);
        counter.increment();
        counter.increment();
        counter.reset();
        expect(counter.getValue()).toBe(1);
    });

    test('throws when initial value is not a number', () => {
        expect(() => createCounter('a')).toThrow('Initial value must be a valid number');
        expect(() => createCounter(NaN)).toThrow('Initial value must be a valid number');
    });
});

describe('renderCounter', () => {
    test('updates the text content of the element', () => {
        document.body.innerHTML = '<span id="counter-display"></span>';
        const element = document.getElementById('counter-display');
        renderCounter(element, 7);
        expect(element.textContent).toBe('7');
    });

    test('throws when element is not provided', () => {
        expect(() => renderCounter(null, 5)).toThrow('Element is required');
    });
});