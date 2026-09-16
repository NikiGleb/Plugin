import { toRadix, ConvertationNumber  } from './numberLiteral';

export function formatInSystem(system: RadixSystem, num: ConvertationNumber): string {
    return system.prefix + toRadix(num.digits, num.base, String(system.base));
}

export interface RadixSystem {
    base: number;
    label: string;
    prefix: string;
}

export class RadixRegistry{
    readonly addedSystems: RadixSystem[] = []

    constructor(initial: RadixSystem[]) {
        for (const system of initial) {
            this.add(system);
        }
    }
    
    private indexOf(base: number): number {
        let left = 0;
        let right = this.addedSystems.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.addedSystems[mid].base === base) {
                return mid;
            }
            if (this.addedSystems[mid].base < base){
                left = mid + 1;
            }
            else{ 
                right = mid - 1;
            }
        }
        return -1;
    }

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

    has(base: number): boolean{
        return this.indexOf(base) !== -1
    }

    add(system: RadixSystem){
        if (!this.has(system.base)) {
            this.addedSystems.splice(this.indexIn(system.base), 0, system)
        }
    }

    remove(base: string){
        this.addedSystems.splice(this.indexOf(Number(base)), 1);
    }

    list(): RadixSystem[]{
        return this.addedSystems;
    }
}

export function createDefaultRegistry(): RadixRegistry {
    return new RadixRegistry([
        { base: 2, label: 'BIN', prefix: '0b' },
        { base: 8, label: 'OCT', prefix: '0o' },
        { base: 10, label: 'DEC', prefix: '' },
        { base: 16, label: 'HEX', prefix: '0x' }
    ]);
}