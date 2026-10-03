import { createCounter, renderCounter } from './counter.js';

/**
 * Genera un saludo personalizado.
 * @param {string} name - Nombre de la persona.
 * @returns {string} Saludo completo.
 */
export function greet(name) {
    if (!name || typeof name !== 'string') {
        return 'Hello, stranger!';
    }
    return `Hello, ${name}! Have a great day! Welcome!`;
}

/**
 * Actualiza el contenido de un elemento del DOM con el saludo.
 * @param {HTMLElement} element - Elemento del DOM donde se mostrará el saludo.
 * @param {string} name - Nombre de la persona.
 */
export function renderGreeting(element, name) {
    if (!element) {
        throw new Error('Element is required');
    }
    element.textContent = greet(name);
}

// Inicialización en el navegador
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Greeting
        const greetingElement = document.getElementById('greeting-message');
        if (greetingElement) {
            renderGreeting(greetingElement, 'Diego');
        }

        // Counter
        const counterDisplay = document.getElementById('counter-display');
        if (counterDisplay) {
            const counter = createCounter(0);
            const updateDisplay = () => renderCounter(counterDisplay, counter.getValue());

            document.getElementById('increment-btn')?.addEventListener('click', () => {
                counter.increment();
                updateDisplay();
            });
            document.getElementById('decrement-btn')?.addEventListener('click', () => {
                counter.decrement();
                updateDisplay();
            });
            document.getElementById('reset-btn')?.addEventListener('click', () => {
                counter.reset();
                updateDisplay();
            });
        }
    });
}
