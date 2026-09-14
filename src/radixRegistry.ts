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
    
    private getIndex(base: number): number{
        let left = 0, right = this.addedSystems.length - 1
        while (left <= right){
            let mid = (left + right) / 2
            if (this.addedSystems[mid].base === base){
                return mid
            }
            else if (this.addedSystems[mid].base < base){
                left = mid + 1
            }
            else{
                right = mid
            }
        }
        return left
    }

    add(system: RadixSystem){
        this.addedSystems.splice(this.getIndex(system.base) - 1, 0, system)
    }

    remove(system: RadixSystem){
        this.addedSystems.splice(this.getIndex(system.base), 1);
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