import {Edge} from "./edge";
import {mapToImg} from "./main";

// Shared Offset type
interface Offset {
    x: number;
    y: number;
}

export class Node {
    private _edges: Edge[];
    private _y: number;
    private _x: number;
    private _id: string;

    constructor(id: string, x: number, y: number) {
        this._id = id;
        this._x = x;
        this._y = y;
        this._edges = [];
    }

    addEdge(edge: Edge): void {
        this._edges.push(edge);
    }

    draw(ctx: CanvasRenderingContext2D, offset: { imgX: number, imgY: number }, scale: number): void {
        const {imgX, imgY} = offset;
        ctx.beginPath();
        ctx.arc(imgX, imgY, 6 / scale, 0, Math.PI * 2);
        ctx.fill();
    }

    toJSON(): { id: string; x: number; y: number } {
        return {id: this._id, x: this._x, y: this._y};
    }

    get edges(): Edge[] {
        return this._edges;
    }

    set edges(value: Edge[]) {
        this._edges = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }
}
