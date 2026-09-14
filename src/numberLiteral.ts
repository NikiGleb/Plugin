/*
 * Проверяет, является ли слово корректным числовым литералом.
 * Допустимые формы: двоичная, восьмеричная, шестнадцатеричная и десятичная.
 */
export function checkNumber(word: string): boolean {
    const pattern = /^(0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+|[0-9]+)$/;
    return pattern.test(word);
}

/*
 * Определяет систему счисления литерала по его префиксу.
 * Вызывается только для строк, уже прошедших проверку checkNumber.
 */
export function formatNumber(line: string): string {
    if (line[0] === '0' && line[1] === 'b') {
        return "2"
    }
    if (line[0] === '0' && line[1] === 'o') {
        return "8"
    }
    if (line[0] === '0' && line[1] === 'x') {
        return "16"
    }
    return "10"
}

/*
 * Структура для хранения числа во всех поддерживаемых системах счисления.
 * Также содержит информацию о системе счисления, в которой число записано изначально.
 */
export interface ConvertationNumber {
    bin: string;
    oct: string;
    dec: string;
    hex: string;
    base: string;
}

/*
 * Переводит число во все поддерживаемые системы счисления.
 */
export function parseNumber(num: string): ConvertationNumber {
    const value = BigInt(num);

    return {
        bin: '0b' + value.toString(2),
        oct: '0o' + value.toString(8),
        dec: value.toString(10),
        hex: '0x' + value.toString(16),
        base: formatNumber(num),
    };
}
