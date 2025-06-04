export function generateUUID(): string {
    // Return a RFC4122 version 4 compliant UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 70% of viewport width and 100% of viewport height
    const targetWidth = Math.floor(vw * 0.7);
    const targetHeight = vh;

    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;

    // Set actual drawing resolution
    canvas.width = targetWidth;
    canvas.height = targetHeight;
}
