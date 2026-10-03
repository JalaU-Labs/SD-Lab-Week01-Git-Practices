import { greet, renderGreeting } from '../src/js/main.js';

describe('greet function', () => {
    test('returns a greeting with the provided name', () => {
        expect(greet('Diego')).toBe('Hello, Diego! Have a great day! Welcome!');
    });

    test('returns a generic greeting when name is empty', () => {
        expect(greet('')).toBe('Hello, stranger!');
    });

    test('returns a generic greeting when name is not a string', () => {
        expect(greet(123)).toBe('Hello, stranger!');
        expect(greet(null)).toBe('Hello, stranger!');
        expect(greet(undefined)).toBe('Hello, stranger!');
    });
});

describe('renderGreeting function', () => {
    test('updates the text content of the element', () => {
        document.body.innerHTML = '<p id="test-greeting"></p>';
        const element = document.getElementById('test-greeting');
        renderGreeting(element, 'Diego');
        expect(element.textContent).toBe('Hello, Diego! Have a great day! Welcome!');
    });

    test('throws an error when element is not provided', () => {
        expect(() => renderGreeting(null, 'Diego')).toThrow('Element is required');
    });
});
