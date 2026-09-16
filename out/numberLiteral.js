"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConvertationNumber = resolveConvertationNumber;
exports.toRadix = toRadix;
// Одна регулярка на все формы префикса; группа захвата в каждой
// альтернативе сразу даёт цифры без префикса — не нужен отдельный slice.
const NUMBER_PATTERN = /^(?:0[bB]([01]+)|0[oO]([0-7]+)|0[xX]([0-9a-fA-F]+)|([0-9]+))$/;
const RADIX_COMMENT_PATTERN = /\/\/\s*radix\s*:\s*(\d+)/i;
/*
 * Единственная публичная точка входа для работы с числами под курсором.
 * Определяет, является ли word числом, и если да — возвращает его как
 * ConvertationNumber с правильной базой:
 * 1) если есть префикс (0b/0o/0x) — база и цифры берутся прямо из regex-групп;
 * 2) если префикса нет, но рядом валидный // radix: N — база из комментария;
 * 3) иначе — обычная десятичная запись (база 10).
 * Если word вообще не число — возвращает null.
 */
function checkBasePrefix(word) {
    if (word.length <= 2) {
        return null;
    }
    if (word[0] === '0' && word[1] === 'b')
        return '2';
    if (word[0] === '0' && word[1] === 'o')
        return '8';
    if (word[0] === '0' && word[1] === 'x')
        return '16';
    return null;
}
function resolveConvertationNumber(word, line, afterChar) {
    const match = NUMBER_PATTERN.exec(word);
    if (!match) {
        return null;
    }
    if (checkBasePrefix(word) !== null) {
        return { digits: word.slice(2).toLowerCase(), base: String(checkBasePrefix(word)) };
    }
    // Префикса нет — смотрим, нет ли рядом комментария // radix: N.
    const commentBase = tryGetCommentBase(word, line, afterChar);
    if (commentBase !== null) {
        return { digits: word.toLowerCase(), base: String(commentBase) };
    }
    // Ни того, ни другого — обычная десятичная запись.
    return { digits: word.toLowerCase(), base: '10' };
}
/*
 * Переводит запись числа из одной произвольной системы счисления в другую
 * вручную, методом накопления в десятичное значение и обратного деления.
 */
function toRadix(startNum, startBase, endBase) {
    let num10 = 0;
    let endNum = '';
    for (const symb of startNum) {
        num10 = num10 * Number(startBase) + getId(symb);
    }
    if (num10 === 0) {
        return '0';
    }
    while (num10 > 0) {
        const rest = num10 % Number(endBase);
        endNum += DIGITS[rest];
        num10 = Math.floor(num10 / Number(endBase));
    }
    return endNum.split('').reverse().join('');
}
/*
 * Ищет справа от числа комментарий "// radix: N" и сразу проверяет,
 * что цифры числа допустимы в этой системе счисления. Возвращает
 * найденную базу или null, если комментария нет либо он некорректен.
 */
function tryGetCommentBase(word, line, afterChar) {
    const rest = line.slice(afterChar);
    const match = RADIX_COMMENT_PATTERN.exec(rest);
    if (!match) {
        return null;
    }
    const base = Number(match[1]);
    if (!Number.isInteger(base) || base < 2 || base > 36) {
        return null;
    }
    for (const symb of word) {
        if (getId(symb) >= base) {
            return null;
        }
    }
    return base;
}
/* Алфавит цифр: индекс символа в этой строке — его числовое значение. */
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
/* Находит позицию символа symb в алфавите DIGITS — его "цифровое значение". */
function getId(symb) {
    let id = 0;
    while (DIGITS[id] !== symb) {
        id++;
    }
    return id;
}
