function padNumber(_num: number): string {
    const num = Math.floor(_num);
    return num < 10 ? '0' + num : num.toString();
}
export function secondsToTime(duration: number) {
    if (duration) {
        const seconds = padNumber(duration % 60);
        const minutes = padNumber(duration / 60);
        const hours = padNumber(duration / 60 / 60);

        if (hours !== '00') return `${hours}h${minutes}m${seconds}s`;
        else return `${minutes}m${seconds}s`;
    }
}
