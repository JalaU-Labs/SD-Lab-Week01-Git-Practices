/**
 * Crea un contador con valor inicial.
 * @param {number} initialValue - Valor inicial del contador.
 * @returns {object} Objeto con métodos increment, decrement, reset, getValue.
 */
export function createCounter(initialValue = 0) {
    if (typeof initialValue !== 'number' || Number.isNaN(initialValue)) {
        throw new Error('Initial value must be a valid number');
    }
    let count = initialValue;
    return {
        increment: () => ++count,
        decrement: () => --count,
        reset: () => {
            count = initialValue;
            return count;
        },
        getValue: () => count
    };
}

/**
 * Actualiza el contenido de un elemento del DOM con el valor del contador.
 * @param {HTMLElement} element - Elemento del DOM.
 * @param {number} value - Valor a mostrar.
 */
export function renderCounter(element, value) {
    if (!element) {
        throw new Error('Element is required');
    }
    element.textContent = String(value);
}