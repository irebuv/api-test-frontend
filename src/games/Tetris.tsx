import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

interface Block {
    x: number;
    y: number;
}

type Cell = 0 | TetrominoType;

type Board = Cell[][];

interface Piece {
    type: TetrominoType;
    rotation: number;
    x: number;
    y: number;
}

const COLS = 13;
const ROWS = 22;
const EMPTY: Cell = 0;
const START_SPEED = 1000;

const TETROMINO_TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
const TETROMINOS: Record<TetrominoType, Block[][]> = {
    I: [
        // rotation 0
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
        ],
        // rotation 1
        [
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
        ],
        // rotation 2
        [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ],
        // rotation 3
        [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
        ],
    ],
    O: [
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
    ],
    T: [
        [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ],
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ],
        [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ],
    ],
    S: [
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
        ],
        [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
        ],
        [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ],
    ],
    Z: [
        [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ],
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
        ],
        [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
        ],
    ],
    J: [
        [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ],
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
        ],
        [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
        ],
    ],
    L: [
        [
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ],
        [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
        ],
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
        ],
        [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ],
    ],
};

const COLORS: Record<Cell, string> = {
    0: "#020617", // background
    I: "#06b6d4",
    O: "#eab308",
    T: "#8b5cf6",
    S: "#22c55e",
    Z: "#ef4444",
    J: "#3b82f6",
    L: "#f97316",
};

function createEmptyBoard(): Board {
    return Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => EMPTY)
    );
}

function randomTetrominoType(): TetrominoType {
    const idx = Math.floor(Math.random() * TETROMINO_TYPES.length);
    return TETROMINO_TYPES[idx];
}

function createPiece(): Piece {
    const type = randomTetrominoType();
    return {
        type,
        rotation: 0,
        x: Math.floor(COLS / 2) - 1,
        y: 0,
    };
}

function getBlocks(piece: Piece): Block[] {
    const { type, rotation, x, y } = piece;
    const shape = TETROMINOS[type][rotation];
    return shape.map((p) => ({
        x: p.x + x,
        y: p.y + y,
    }));
}

function isValidPosition(board: Board, piece: Piece): boolean {
    const blocks = getBlocks(piece);
    return blocks.every((b) => {
        if (b.x < 0 || b.x >= COLS || b.y >= ROWS) return false;
        if (b.y < 0) return true;
        return board[b.y][b.x] === EMPTY;
    });
}

function mergePiece(board: Board, piece: Piece) {
    const newBoard = board.map((row) => [...row]);
    const blocks = getBlocks(piece);
    for (const b of blocks) {
        if (b.y >= 0 && b.y < ROWS && b.x >= 0 && b.x < COLS) {
            newBoard[b.y][b.x] = piece.type;
        }
    }
    return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
    let cleared = 0;
    const newBoard = board.filter((row) => {
        const full = row.every((cell) => cell !== EMPTY);
        if (full) cleared += 1;
        return !full;
    });
    while (newBoard.length < ROWS) {
        newBoard.unshift(Array.from({ length: COLS }, () => EMPTY));
    }
    return { board: newBoard, cleared };
}

export default function Tetris() {
    const [running, setRunning] = useState(false);
    const [board, setBoard] = useState<Board>(() => createEmptyBoard());
    const [piece, setPiece] = useState<Piece>(() => createPiece());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [best, setBest] = useLocalStorage<number>("tetris_best", 0);
    const [speed, setSpeed] = useState(START_SPEED);

    const boardRef = useRef(board);
    const pieceRef = useRef(piece);

    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    useEffect(() => {
        pieceRef.current = piece;
    }, [piece]);

    const spawnNewPiece = useCallback((currentBoard: Board) => {
        const newPiece = createPiece();

        if (!isValidPosition(currentBoard, newPiece)) {
            setGameOver(true);
            setRunning(false);
            return { board: currentBoard, piece: newPiece };
        }

        setPiece(newPiece);
        return { board: currentBoard, piece: newPiece };
    }, []);

    const tick = useCallback(() => {
        if (!running || gameOver) return;

        setBoard((prevBoard) => {
            const currentPiece = pieceRef.current;
            let boardAfter = prevBoard;

            const movedDown = { ...currentPiece, y: currentPiece.y + 1 };

            if (isValidPosition(prevBoard, movedDown)) {
                setPiece(movedDown);
                return prevBoard;
            }

            boardAfter = mergePiece(prevBoard, currentPiece);

            const { board: clearedBoard, cleared } = clearLines(boardAfter);
            boardAfter = clearedBoard;

            if (cleared > 0) {
                setScore((prevScore) => {
                    const newScore = prevScore + cleared * 100;
                    setBest((prevBest) =>
                        newScore > prevBest ? newScore : prevBest
                    );
                    return newScore;
                });
                setSpeed((sp) => Math.max(150, sp - cleared * 5));
            }

            const { board: finalBoard, piece: newPiece } =
                spawnNewPiece(boardAfter);

            setPiece(newPiece);
            return finalBoard;
        });
    }, [running, gameOver, spawnNewPiece, setBest]);

    useEffect(() => {
        if (!running || gameOver) return;
        const id = setInterval(tick, speed);
        return () => clearInterval(id);
    }, [tick, running, gameOver, speed]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (gameOver) return;

            if (e.code === "KeyP") {
                setRunning((r) => !r);
                return;
            }

            if (!running) return;

            const landed = !isValidPosition(board, {
                ...piece,
                y: piece.y + 1,
            });

            if (landed) {
                return;
            }

            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                setPiece((prev: Piece) => {
                    const moved: Piece = { ...prev, x: prev.x - 1 };
                    return isValidPosition(board, moved) ? moved : prev;
                });
            }

            if (e.code === "ArrowRight" || e.code === "KeyD") {
                setPiece((prev: Piece) => {
                    const moved: Piece = { ...prev, x: prev.x + 1 };
                    return isValidPosition(board, moved) ? moved : prev;
                });
            }

            if (e.code === "ArrowDown" || e.code === "KeyS") {
                setPiece((prev: Piece) => {
                    const moved: Piece = { ...prev, y: prev.y + 1 };
                    return isValidPosition(board, moved) ? moved : prev;
                });
            }

            if (e.code === "ArrowUp" || e.code === "KeyW") {
                setPiece((prev: Piece) => {
                    const rotated: Piece = {
                        ...prev,
                        rotation: (prev.rotation + 1) % 4,
                    };
                    return isValidPosition(board, rotated) ? rotated : prev;
                });
            }

            if (e.code === "Space") {
                e.preventDefault();
                setPiece((prev: Piece) => {
                    let dropped: Piece = { ...prev };
                    while (
                        isValidPosition(board, {
                            ...dropped,
                            y: dropped.y + 1,
                        })
                    ) {
                        dropped = { ...dropped, y: dropped.y + 1 };
                    }
                    return dropped;
                });
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [board, piece, running, gameOver]);

    const displayBoard = board.map((row) => [...row]);
    const blocks = getBlocks(piece);
    for (const b of blocks) {
        if (b.y >= 0 && b.y < ROWS && b.x >= 0 && b.x < COLS) {
            displayBoard[b.y][b.x] = piece.type;
        }
    }

    const handleRestart = () => {
        setBoard(createEmptyBoard());
        setPiece(createPiece());
        setScore(0);
        setSpeed(START_SPEED);
        setGameOver(false);
        setRunning(true);
    };

    return (
        <div className="mx-auto max-w-[800px] p-6 select-none">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-semibold">Tetris</div>
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
            <div className="mb-1 flex items-center justify-between">
                <div
                    className="grid gap-[1px] p-1 rounded-2xl mx-auto relative bg-slate-800"
                    style={{
                        gridTemplateColumns: `repeat(${COLS}, 24px)`,
                        gridTemplateRows: `repeat(${ROWS}, 24px)`,
                    }}
                >
                    {gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-amber-100/40">
                            <span className="font-bold text-3xl text-shadow-cyan-600 text-purple-400">
                                Game Over
                            </span>
                        </div>
                    )}
                    {displayBoard.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                className="w-6 h-6"
                                style={{
                                    backgroundColor: COLORS[cell || 0],
                                    borderRadius: cell ? "4px" : "2px",
                                    boxShadow: cell
                                        ? "0 0 4px rgba(0,0,0,0.5)"
                                        : "none",
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
            <div style={{ minWidth: "160px" }}>
                <div style={{ marginBottom: "8px" }}>
                    Speed: {(speed / 1000).toFixed(2)}s
                </div>
                <button
                    onClick={handleRestart}
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: "#22c55e",
                        color: "#020617",
                        fontWeight: 600,
                        marginBottom: "12px",
                    }}
                >
                    {gameOver ? "Restart" : "Start"}
                </button>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        lineHeight: 1.5,
                    }}
                >
                    Controls:
                    <br />
                    ⬅ ➡ / A D — left / right
                    <br />
                    ⬇ / S — down
                    <br />
                    ⬆ / W — rotate
                    <br />
                    Space — hard drop
                    <br />P — pause
                </div>
            </div>
        </div>
    );
}
