// Define a control point type
interface Point {
    x: number;
    y: number;
}

// Define a node with id and coordinates
interface Node {
    id: number;
    x: number;
    y: number;
}

interface Offset {
    x: number;
    y: number;
}

export class Edge {
    private from: number;
    private to: number;
    private ctrls: Point[];
    private bezier: boolean;

    constructor(from: number, to: number, ctrls: Point[] = [], bezier: boolean = true) {
        this.from = from;
        this.to = to;
        this.ctrls = ctrls;
        this.bezier = bezier;
    }

    draw(
        ctx: CanvasRenderingContext2D,
        nodes: Node[],
        offset: Offset,
        showControlPoints: boolean
    ): void {
        const fromNode = nodes.find(n => n.id === this.from);
        const toNode = nodes.find(n => n.id === this.to);
        if (!fromNode || !toNode) return;

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x - offset.x, fromNode.y - offset.y);

        if (this.bezier && this.ctrls.length > 0) {
            if (this.ctrls.length === 1) {
                ctx.quadraticCurveTo(
                    this.ctrls[0].x - offset.x,
                    this.ctrls[0].y - offset.y,
                    toNode.x - offset.x,
                    toNode.y - offset.y
                );
            } else if (this.ctrls.length === 2) {
                ctx.bezierCurveTo(
                    this.ctrls[0].x - offset.x,
                    this.ctrls[0].y - offset.y,
                    this.ctrls[1].x - offset.x,
                    this.ctrls[1].y - offset.y,
                    toNode.x - offset.x,
                    toNode.y - offset.y
                );
            } else {
                const pts = [fromNode, ...this.ctrls, toNode];
                for (let i = 0; i < pts.length - 1; i++) {
                    ctx.lineTo(pts[i + 1].x - offset.x, pts[i + 1].y - offset.y);
                }
            }
        } else {
            ctx.lineTo(toNode.x - offset.x, toNode.y - offset.y);
        }
        ctx.stroke();

        if (showControlPoints && this.ctrls.length > 0) {
            this.ctrls.forEach(p => {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(p.x - offset.x, p.y - offset.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }

    toJSON() {
        return {
            from: this.from,
            to: this.to,
            bezier: this.bezier,
            ctrls: this.ctrls.map(p => ({ x: p.x, y: p.y }))
        };
    }
}
