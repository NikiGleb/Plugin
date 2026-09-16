"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadixRegistry = void 0;
exports.formatInSystem = formatInSystem;
exports.createDefaultRegistry = createDefaultRegistry;
const numberLiteral_1 = require("./numberLiteral");
function formatInSystem(system, num) {
    return system.prefix + (0, numberLiteral_1.toRadix)(num.digits, num.base, String(system.base));
}
class RadixRegistry {
    addedSystems = [];
    constructor(initial) {
        for (const system of initial) {
            this.add(system);
        }
    }
    indexOf(base) {
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
    indexIn(base) {
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
    has(base) {
        return this.indexOf(base) !== -1;
    }
    add(system) {
        if (!this.has(system.base)) {
            this.addedSystems.splice(this.indexIn(system.base), 0, system);
        }
    }
    remove(base) {
        this.addedSystems.splice(this.indexOf(Number(base)), 1);
    }
    list() {
        return this.addedSystems;
    }
}
exports.RadixRegistry = RadixRegistry;
function createDefaultRegistry() {
    return new RadixRegistry([
        { base: 2, label: 'BIN', prefix: '0b' },
        { base: 8, label: 'OCT', prefix: '0o' },
        { base: 10, label: 'DEC', prefix: '' },
        { base: 16, label: 'HEX', prefix: '0x' }
    ]);
}
