import { Button } from "@/components/ui/button";
import WhackAMole from "./WhackAMole";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Snake from "./Snake";
import Tetris from "./Tetris";

const GAMES = [
    {
        id: "snake",
        label: "🐍 Snake",
        Component: Snake,
    },
    {
        id: "mole",
        label: "🐹 Whack-a-Mole",
        Component: WhackAMole,
    },
    {
        id: "tetris",
        label: "🧱 Tetris", 
        Component: Tetris,
    }
] as const;

type GameId = (typeof GAMES)[number]["id"];

export default function GamesController() {
    const [activeId, setActiveId] = useLocalStorage<GameId | null>("active_game", null);

    const activeGame = GAMES.find((g) => g.id === activeId);

    return (
        <div className="p-6 max-w-[900px] mx-auto">
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {GAMES.map((game) => (
                    <Button
                        key={game.id}
                        className="!cursor-pointer"
                        onClick={() => setActiveId(game.id)}
                        variant={activeId === game.id ? "solid" : "outline"}
                    >
                        {game.label}
                    </Button>
                ))}{" "}
                <Button
                    className="!cursor-pointer"
                    onClick={() => setActiveId(null)}
                    variant={activeId === null ? "solid" : "outline"}
                >
                    ❌ Close
                </Button>
            </div>
             {activeGame && <activeGame.Component />}
        </div>
    );
}
