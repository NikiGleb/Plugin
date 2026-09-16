/*
 * Определяет ConvertationNumber для литерала под курсором за один вызов:
 * 1) если есть префикс (0b/0o/0x) — база берётся из него;
 * 2) если префикса нет, но рядом валидный // radix: N — база из комментария;
 * 3) иначе — обычная десятичная запись (база 10).
 * Вызывается один раз при наведении, результат используется везде дальше.
 */
export function resolveConvertationNumber(word: string, line: string, afterChar: number): ConvertationNumber {
    const prefixBase = formatNumber(word);
    if (prefixBase !== '10') {
        return parseNumber(word);
    }

    const commentBase = findCommentRadix(line, afterChar);
    if (commentBase !== null && isValidInBase(word, commentBase)) {
        return parseNumberAs(word, commentBase);
    }

    return parseNumber(word);
}
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

export function findCommentRadix(line: string, afterChar: number): null | number{
    const pattern = /\/\/\s*radix\s*:\s*(\d+)/i
    const rest = line.slice(afterChar);
    const match = pattern.exec(rest);

    if (!match) {
        return null;
    }

    const base = Number(match[1]);
    if (!Number.isInteger(base) || base < 2 || base > 36) {
        return null;
    }

    return base;
}


export function isValidInBase(word: string, base: number): boolean{
    for (const symb of word){
        if (getId(symb) >= base){
            return false
        }
    }
    return true
}

export function parseNumberAs(word: string, base: number): ConvertationNumber {
    return {
        digits: word.toLowerCase(),
        base: String(base),
    };
}
/*
 * Структура для хранения числа во всех поддерживаемых системах счисления.
 * Также содержит информацию о системе счисления, в которой число записано изначально.
 */
export interface ConvertationNumber {  
    digits: string;
    base: string;
}

export function getDigitsBody(word: string): string {
    const base = formatNumber(word);
    const body = base === '10' ? word : word.slice(2);
    return body.toLowerCase();
}

export function parseNumber(num: string): ConvertationNumber {
    return {
        digits: getDigitsBody(num),
        base: formatNumber(num),
    };
}

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
function getId(symb: string){
    let id = 0;
    while(DIGITS[id]!==symb){
        id++;
    }
    return id;
}
export function toRadix(startNum: string, startBase: string, endBase: string){
    let num10: number = 0;
    let endNum: string ='';

    for(const symb of startNum){
        num10 = num10 * Number(startBase) + getId(symb);
    }

    if (num10 === 0){
        return '0'
    }

    while (num10 > 0){
        const rest = num10 % Number(endBase);
        endNum += DIGITS[rest];
        num10 = Math.floor(num10 / Number(endBase));
    }

    return endNum.split('').reverse().join('');
}
