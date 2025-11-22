import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useMemo, useRef, useState } from "react";

type Cell = { x: number; y: number };
type Dir = { x: number; y: number };

const GRID = 30;
const START_SPEED = 160;
const MIN_SPEED = 80;
const SPEED_STEP = 5;

const START_SNAKE: Cell[] = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
];

function same(a: Cell, b: Cell) {
    return a.x === b.x && a.y === b.y;
}
function inBounds(c: Cell) {
    return c.x >= 0 && c.x < GRID && c.y >= 0 && c.y < GRID;
}

function randFreeCell(occupied: Set<string>): Cell {
    while (true) {
        const c = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
        };
        if (!occupied.has(`${c.x},${c.y}`)) return c;
    }
}

export default function Snake() {
    const [running, setRunning] = useState(false);
    const [snake, setSnake] = useState<Cell[]>(START_SNAKE);
    const [dir, setDir] = useState<Dir>({ x: 1, y: 0 });
    const [food, setFood] = useState<Cell>({ x: 12, y: 10 });
    const [score, setScore] = useState(0);
    const [best, setBest] = useLocalStorage<number>("snake_best", 0);
    const [speed, setSpeed] = useState(START_SPEED);

    const dirRef = useRef(dir);
    const runningRef = useRef(running);
    const dirQueue = useRef<Dir[]>([]);

    dirRef.current = dir;
    runningRef.current = running;

    const occupied = useMemo(() => {
        const s = new Set<string>();
        for (const c of snake) s.add(`${c.x},${c.y}`);
        return s;
    }, [snake]);

    function start() {
        if (!running) setRunning(true);
    }

    function pause() {
        setRunning(false);
    }

    function reset() {
        setRunning(false);
        setSnake(START_SNAKE);
        setDir({ x: 1, y: 0 });
        setScore(0);
        setSpeed(START_SPEED);
        setFood(randFreeCell(new Set(START_SNAKE.map((c) => `${c.x},${c.y}`))));
    }

    useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
        let next: Dir | null = null;

        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                next = { x: 0, y: -1 };
                break;
            case "ArrowDown":
            case "KeyS":
                next = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
            case "KeyA":
                next = { x: -1, y: 0 };
                break;
            case "ArrowRight":
            case "KeyD":
                next = { x: 1, y: 0 };
                break;
            default:
                return; 
        }

        dirQueue.current.push(next);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
}, []);

    useEffect(() => {
        if (!running) return;

        const tick = () => {
            let newDir = dirRef.current;

            if (dirQueue.current.length > 0) {
                const candidate = dirQueue.current.shift()!;

                if (
                    !(
                        candidate.x + newDir.x === 0 &&
                        candidate.y + newDir.y === 0
                    )
                ) {
                    newDir = candidate;
                    dirRef.current = candidate;
                    setDir(candidate);
                }
            }

            setSnake((prev) => {
                const head = prev[0];
                const nextHead: Cell = {
                    x: head.x + newDir.x, 
                    y: head.y + newDir.y, 
                };

                if (
                    !inBounds(nextHead) ||
                    prev.some((seg) => same(seg, nextHead))
                ) {
                    setBest((b) => (score > b ? score : b));
                    setRunning(false);
                    return prev;
                }

                const ate = same(nextHead, food);
                const newSnake = [nextHead, ...prev];

                if (!ate) newSnake.pop();
                else {
                    setScore((s) => s + 1);
                    const occ = new Set(newSnake.map((c) => `${c.x},${c.y}`));
                    setFood(randFreeCell(occ));
                    setSpeed((ms) => Math.max(MIN_SPEED, ms - SPEED_STEP));
                }

                return newSnake;
            });
        };

        const id = window.setInterval(tick, speed);
        return () => clearInterval(id);
    }, [running, speed, food, score]);

    const cells = useMemo(
        () =>
            Array.from({ length: GRID * GRID }, (_, i) => {
                const x = i % GRID;
                const y = Math.floor(i / GRID);
                return { x, y };
            }),
        []
    );

    const head = snake[0];

    const touchTurn = (next: Dir) => {
        const cur = dirRef.current;
        if (cur.x + next.x === 0 && cur.y + next.y === 0) return;
        setDir(next);
    };

    return (
        <div className="mx-auto max-w-[800px] p-6 select-none">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-semibold">Snake</div>
                <div className="flex gap-2 text-sm">
                    <span className="rounded bg-gray-100 px-2 py-1">
                        ⭐ {score}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1">
                        🏆 {best}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1">
                        ⚡ {speed}ms
                    </span>
                </div>
            </div>
            <div
                className="rounded-2xl border bg-white p-2 shadow-sm"
                style={{
                    aspectRatio: "1 / 1",
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID}, 1fr)`,
                    gap: 2,
                }}
            >
                {cells.map((c) => {
                    const isHead = same(c, head);
                    const isBody = !isHead && snake.some((seg) => same(seg, c));
                    const isFood = same(c, food);
                    return (
                        <div
                            key={`${c.x},${c.y}`}
                            className={[
                                "rounded-md",
                                isHead
                                    ? "bg-emerald-600"
                                    : isBody
                                    ? "bg-emerald-400"
                                    : isFood
                                    ? "bg-rose-400"
                                    : "bg-gray-100",
                            ].join(" ")}
                            style={{ width: "100%", height: "100%" }}
                        />
                    );
                })}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
                {running ? (
                    <Button onClick={pause} className="cursor-pointer">
                        Pause
                    </Button>
                ) : (
                    <Button onClick={start} className="cursor-pointer">
                        Start
                    </Button>
                )}
                <Button
                    onClick={reset}
                    variant="outline"
                    className="cursor-pointer"
                >
                    Reset
                </Button>
                <div className="hidden gap-2 sm:flex">
                    <Button
                        onClick={() => touchTurn({ x: 0, y: -1 })}
                        className="cursor-pointer"
                    >
                        ↑
                    </Button>
                    <Button
                        onClick={() => touchTurn({ x: -1, y: 0 })}
                        className="cursor-pointer"
                    >
                        ←
                    </Button>
                    <Button
                        onClick={() => touchTurn({ x: 1, y: 0 })}
                        className="cursor-pointer"
                    >
                        →
                    </Button>
                    <Button
                        onClick={() => touchTurn({ x: 0, y: 1 })}
                        className="cursor-pointer"
                    >
                        ↓
                    </Button>
                </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                Use: arrows / WASD. You can't turn to 180°.
            </p>
        </div>
    );
}
