import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";

const GRID = 16;
const ROUND_SEC = 30;
const STEP_MS = 700;

export default function WhackAMole() {
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ROUND_SEC);
    const [score, setScore] = useState(0);
    const [best, setBest] = useLocalStorage<number>("wam_best", 0);
    const [moleIndex, setMoleIndex] = useState<number | null>(null);

    const tickRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const spawnRef = useRef<() => void>(() => {});

    const cells = useMemo(() => Array.from({ length: GRID }, (_, i) => i), []);

    function start() {
        setScore(0);
        setTimeLeft(ROUND_SEC);
        setRunning(true);
    }
    function stop() {
        setRunning(false);
        setMoleIndex(null);
        if (tickRef.current) {
            window.clearInterval(tickRef.current);
            tickRef.current = null;
        }
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setBest((prev) => (score > prev ? score : prev));
    }

    useEffect(() => {
        if (!running) return;

        let active = true;

        spawnRef.current = () => {
            if (!active) return;
            setMoleIndex(Math.floor(Math.random() * GRID));
            const randomDelay = 200 + Math.random() * 600;
            tickRef.current = window.setTimeout(spawnRef.current, randomDelay);
        };

        spawnRef.current();

        timerRef.current = window.setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    setTimeout(stop, 0);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => {
            active = false;
            if (tickRef.current) clearTimeout(tickRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [running]);

    function handleHit(i: number) {
        if (!running) return;

        const isHit = i === moleIndex;
        setScore((s) => isHit ? s + 1 : (s > 0) ? s - 1 : s);

        setMoleIndex(null);

        if (tickRef.current) {
            clearTimeout(tickRef.current);
            tickRef.current = null;
        }

        const clickDelayMs = 200 + Math.random() * 1800;
        tickRef.current = window.setTimeout(() => {
            spawnRef.current();
        }, clickDelayMs);
    }

    return (
        <div className="mx-auto max-w-xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-semibold">Whack-a-Mole</div>
                <div className="flex gap-3">
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                        {" "}
                        ⏱ {timeLeft}s
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                        {" "}
                        ⭐ {score}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                        {" "}
                        🏆 {best}
                    </span>
                </div>
            </div>

            <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
            >
                {cells.map((i) => {
                    const active = i === moleIndex && running;
                    return (
                        <button
                            key={i}
                            onClick={() => handleHit(i)}
                            className={[
                                "aspect-square rounded-2xl border transition-transform duration-100 !cursor-pointer",
                                active
                                    ? "bg-amber-300 border-amber-400 scale-[1.02]"
                                    : "bg-gray-100 hover:bg-gray-200",
                            ].join(" ")}
                            aria-label={active ? "Mole! Hit!" : "Empty hole"}
                        >
                            <div className="flex h-full items-center justify-center text-2xl">
                                {active ? "🐹" : "—"}
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Hit to 🐹 as much as possible for {ROUND_SEC} sec
                </div>
                {running ? (
                    <Button onClick={stop} className="!cursor-pointer">
                        Stop
                    </Button>
                ) : (
                    <Button onClick={start} className="!cursor-pointer">
                        Start
                    </Button>
                )}
            </div>
        </div>
    );
}
