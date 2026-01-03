export function timeToString(time: string) {
    const date = new Date(time)
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        dateTime: date.toLocaleString(),
    }
}
