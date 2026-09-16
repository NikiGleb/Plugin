import { toRadix, ConvertationNumber } from './numberLiteral';

/* Одна система счисления: основание, подпись для таблицы и префикс записи. */
export interface RadixSystem {
    base: number;
    label: string;
    prefix: string;
}

/*
 * Реестр систем счисления. Хранится как массив, отсортированный по
 * возрастанию основания — это позволяет искать, вставлять и удалять
 * системы двоичным поиском за O(log n).
 */
export class RadixRegistry {
    readonly addedSystems: RadixSystem[] = []

    constructor(initial: RadixSystem[]) {
        for (const system of initial) {
            this.add(system);
        }
    }

    /* Двоичный поиск индекса существующей системы. -1, если её нет. */
    private indexOf(base: number): number {
        let left = 0;
        let right = this.addedSystems.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.addedSystems[mid].base === base) {
                return mid;
            }
            if (this.addedSystems[mid].base < base) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return -1;
    }

    /* Двоичный поиск позиции вставки, чтобы массив остался отсортированным. */
    private indexIn(base: number): number {
        let left = 0;
        let right = this.addedSystems.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.addedSystems[mid].base < base) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        return left;
    }

    /* Есть ли уже в реестре система с таким основанием. */
    has(base: number): boolean {
        return this.indexOf(base) !== -1
    }

    /* Добавляет систему счисления, сохраняя сортировку. Дубли игнорируются. */
    add(system: RadixSystem) {
        if (!this.has(system.base)) {
            this.addedSystems.splice(this.indexIn(system.base), 0, system)
        }
    }

    /* Удаляет систему счисления по основанию. */
    remove(base: number) {
        this.addedSystems.splice(this.indexOf(base), 1);
    }

    /* Список всех систем счисления по возрастанию основания. */
    list(): RadixSystem[] {
        return this.addedSystems;
    }
}

/* Форматирует значение в заданной системе счисления, с префиксом. */
export function formatInSystem(system: RadixSystem, num: ConvertationNumber): string {
    return system.prefix + toRadix(num.digits, num.base, String(system.base));
}

/* Реестр по умолчанию: 4 стандартные системы счисления. */
export function createDefaultRegistry(): RadixRegistry {
    return new RadixRegistry([
        { base: 2, label: 'BIN', prefix: '0b' },
        { base: 8, label: 'OCT', prefix: '0o' },
        { base: 10, label: 'DEC', prefix: '' },
        { base: 16, label: 'HEX', prefix: '0x' }
    ]);
}