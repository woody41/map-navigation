// main.ts

import {Node} from "./node";
import {Edge} from "./edge";
import {generateUUID} from "./functions"

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let img: HTMLImageElement | null = null;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDraggingMap = false;
let isDraggingNode = false;
let dragStartX = 0;
let dragStartY = 0;
let nextNumber = 0;
let selectedNode: Node | null = null;

type RefPoint = {
    imgX: number;
    imgY: number;
    mapX: number;
    mapY: number;
};

type MapPoint = {
    x: number;
    y: number;
};

let refPoints: RefPoint[] = [
    {imgX: 546, imgY: 684, mapX: -2467, mapY: 2331},
    {imgX: 5448, imgY: 5470, mapX: 2323, mapY: -2339}
];

let points: Node[] = [];

function renderRefPointsForm() {
    const container = document.getElementById('pointsForm')!;
    container.innerHTML = '';
    refPoints.forEach((p, i) => {
        container.insertAdjacentHTML('beforeend', `
      <div>
        <strong>${String.fromCharCode(65 + i)}:</strong>
        <input type="number" id="imgX${i}" value="${p.imgX}" />
        <input type="number" id="imgY${i}" value="${p.imgY}" />
        <input type="number" id="mapX${i}" value="${p.mapX}" />
        <input type="number" id="mapY${i}" value="${p.mapY}" />
      </div>
    `);
    });
}

function updateRefPointsFromForm() {
    refPoints.forEach((p, i) => {
        p.imgX = parseFloat((document.getElementById(`imgX${i}`) as HTMLInputElement).value);
        p.imgY = parseFloat((document.getElementById(`imgY${i}`) as HTMLInputElement).value);
        p.mapX = parseFloat((document.getElementById(`mapX${i}`) as HTMLInputElement).value);
        p.mapY = parseFloat((document.getElementById(`mapY${i}`) as HTMLInputElement).value);
    });
    drawScene();
}

function imgToMap(x: number, y: number): { mapX: number; mapY: number } {
    const scaleX = (refPoints[1].mapX - refPoints[0].mapX) / (refPoints[1].imgX - refPoints[0].imgX);
    const scaleY = (refPoints[1].mapY - refPoints[0].mapY) / (refPoints[1].imgY - refPoints[0].imgY);
    return {
        mapX: refPoints[0].mapX + (x - refPoints[0].imgX) * scaleX,
        mapY: refPoints[0].mapY + (y - refPoints[0].imgY) * scaleY
    };
}

export function mapToImg(mapX: number, mapY: number): { imgX: number; imgY: number } {
    const scaleX = (refPoints[1].imgX - refPoints[0].imgX) / (refPoints[1].mapX - refPoints[0].mapX);
    const scaleY = (refPoints[1].imgY - refPoints[0].imgY) / (refPoints[1].mapY - refPoints[0].mapY);
    return {
        imgX: refPoints[0].imgX + (mapX - refPoints[0].mapX) * scaleX,
        imgY: refPoints[0].imgY + (mapY - refPoints[0].mapY) * scaleY
    };
}

function drawScene() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    if (img) ctx.drawImage(img, 0, 0);

    ctx.fillStyle = 'green';
    ctx.font = `${14 / scale}px sans-serif`;
    refPoints.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.imgX, p.imgY, 8 / scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(String.fromCharCode(65 + i), p.imgX, p.imgY - 12 / scale);
    });

    ctx.fillStyle = 'red';
    points.forEach(p => {
        p.draw(ctx, mapToImg(p.x, p.y), scale);
    });

    updateJSON();
}

function updateJSON() {
    (document.getElementById('jsonOutput') as HTMLTextAreaElement).value = JSON.stringify(points, null, 2);
}

(document.getElementById('fileInput') as HTMLInputElement).addEventListener('change', e => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        img = new Image();
        img.onload = () => {
            points = [];
            scale = 1;
            offsetX = 0;
            offsetY = 0;
            drawScene();
        };
        img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const prevScale = scale;
    scale *= e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.1, Math.min(10, scale));
    offsetX = mouseX - (mouseX - offsetX) * (scale / prevScale);
    offsetY = mouseY - (mouseY - offsetY) * (scale / prevScale);
    drawScene();
});

canvas.addEventListener('mousedown', e => {
    if (e.ctrlKey) return;

    const imgX = (e.offsetX - offsetX) / scale;
    const imgY = (e.offsetY - offsetY) / scale;
    const { mapX, mapY } = imgToMap(imgX, imgY);

    if (e.shiftKey) {
        const radius = 8 / scale;

        for (const point of points) {
            const dx = point.x - mapX;
            const dy = point.y - mapY;
            if (Math.sqrt(dx * dx + dy * dy) < radius) {
                selectedNode = point;
                isDraggingNode = true;
                break;
            }
        }
    } else {
        isDraggingMap = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    }
});


canvas.addEventListener('mousemove', e => {
    if (isDraggingMap) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        offsetX += dx;
        offsetY += dy;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        drawScene();
    } else if (isDraggingNode && selectedNode) {
        const imgX = (e.offsetX - offsetX) / scale;
        const imgY = (e.offsetY - offsetY) / scale;
        const { mapX, mapY } = imgToMap(imgX, imgY);
        selectedNode.x = mapX;
        selectedNode.y = mapY;
        drawScene();
    }
});


canvas.addEventListener('mouseup', () => {
    isDraggingMap = false;
    isDraggingNode = false;
    selectedNode = null;
});

canvas.addEventListener('mouseleave', () => {
    isDraggingMap = false;
    isDraggingNode = false;
    selectedNode = null;
});

canvas.addEventListener('click', e => {
    if (!img || isDraggingMap) return;
    if (!e.ctrlKey) return;  // only proceed if CTRL key is held

    const imgX = (e.offsetX - offsetX) / scale;
    const imgY = (e.offsetY - offsetY) / scale;
    const {mapX, mapY} = imgToMap(imgX, imgY);
    const newPoint = new Node(generateUUID(), parseFloat(mapX.toFixed(2)), parseFloat(mapY.toFixed(2)));
    points.push(newPoint);
    drawScene();
});


(document.getElementById('updateBtn') as HTMLButtonElement).addEventListener('click', updateRefPointsFromForm);

renderRefPointsForm();
drawScene();

(document.getElementById('jsonOutput') as HTMLTextAreaElement).addEventListener('input', () => {
    try {
        const raw = (document.getElementById('jsonOutput') as HTMLTextAreaElement).value;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            if (parsed.every(p => typeof p.x === 'number' && typeof p.y === 'number')) {
                points = parsed.map(p => new Node("test", p.x, p.y));
                drawScene();
            }
        }
    } catch {
        // Silently ignore invalid JSON
    }
});
