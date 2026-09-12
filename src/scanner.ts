export function checkNumber(line: string): boolean{
    const pattern = /[1-9]+[0-9]*/;
    if (pattern.test(line)){
        return true
    }
    else{
        return false
    }
}

export function formatNumber(line: string): string{
    const banSymbols = ['.', ',', 'e'];
    if (banSymbols.some((symbol) => line.includes(symbol))) {
        return "-1"
    }
    if (line[0] === '0' && line[1] === 'b'){
        return "2"
    }
    if (line[0] === '0' && line[1] === 'o'){
        return "8"
    }
    if (line[0] === '0' && line[1] === 'x'){
        return "16"
    }
    return "10"
}
