import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type TDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";
type TPosition = { x: number; y: number };

interface IProps {
    setScore: Dispatch<SetStateAction<number>>
}

export const SnakeCanvas = (props: IProps) => {
    const { setScore } = props
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [_, setScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    // Игровые константы
    const GRID_SIZE = 20; // размер 1й ясейки в пикселях
    const TICK_SPEED = 100; // скр перехода 1й ячейки в пикселях

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // метод генерации еды в рандомном свободном месте
        const generateFood = (canvas: HTMLCanvasElement, snake: TPosition[]): TPosition => {
            const maxX: number = Math.floor(canvas.width / GRID_SIZE);
            const maxY: number = Math.floor(canvas.height / GRID_SIZE);
        
            // Исходное рандомное место
            let food: TPosition = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
            
            // цикл будет повторять итерации пока рандомная ячейка занята
            while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                food = {
                    x: Math.floor(Math.random() * maxX),
                    y: Math.floor(Math.random() * maxY)
                };
            }
        
            return food;
        };

        const drawGame = (
            ctx: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement,
            snake: TPosition[],
            food: TPosition
        ): void => {
            // Очистка canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Отрисовка змейки
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#4CAF50" : "#8BC34A"; // Голова темнее
                ctx.fillRect(
                    segment.x * GRID_SIZE,
                    segment.y * GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE
                );
    
                ctx.strokeStyle = "#689F38";
                ctx.strokeRect(
                    segment.x * GRID_SIZE,
                    segment.y * GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE
                );
            });
    
            // Отрисовка еды
            ctx.fillStyle = "#FF5722";
            ctx.beginPath();
            ctx.arc(
                food.x * GRID_SIZE + GRID_SIZE / 2,
                food.y * GRID_SIZE + GRID_SIZE / 2,
                GRID_SIZE / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
    
            // Отрисовка сетки (опционально)
            ctx.strokeStyle = "#E0E0E0";
            for (let i = 0; i < canvas.width; i += GRID_SIZE) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += GRID_SIZE) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        };

        // Устанавливаем правильные размеры canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const snake: TPosition[] = [{ x: 10, y: 10 }]; // Исходные величина змейки (ее длина)
        let food: TPosition = generateFood(canvas, snake); // Исходные коордиты еды для змейки
        let direction: TDirection = "RIGHT"; // Исходное направление движения змейки
        let nextDirection: TDirection = "RIGHT"; // Следующее (планируемое направление змейки)
        let gameLoop: number; // timerId

        // Обработка нажатий клавиш
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!gameStarted) {
                setGameStarted(true);
                return;
            }
            // Проверки внутри нужны для предотвращения противоположного направления
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") nextDirection = "UP";
                    break;
                case "ArrowDown":
                    if (direction !== "UP") nextDirection = "DOWN";
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") nextDirection = "LEFT";
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") nextDirection = "RIGHT";
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Основной игровой цикл
        const startGame = (): void => {
            gameLoop = setInterval(() => {
                if (!gameStarted || gameOver) return;

                direction = nextDirection;

                // Двигаем змейку по координатам в зависимости от направления
                const head: TPosition = { ...snake[0] };
                switch (direction) {
                    case "UP":
                        head.y -= 1;
                        break;
                    case "DOWN":
                        head.y += 1;
                        break;
                    case "LEFT":
                        head.x -= 1;
                        break;
                    case "RIGHT":
                        head.x += 1;
                        break;
                }

                // Проверка на столкновение с собой или стеной
                if (
                    head.x < 0 ||
                    head.y < 0 ||
                    head.x >= canvas.width / GRID_SIZE ||
                    head.y >= canvas.height / GRID_SIZE ||
                    snake.some(segment => segment.x === head.x && segment.y === head.y)
                ) {
                    setGameOver(true);
                    clearInterval(gameLoop);
                    return;
                }

                // Добавляем новую голову
                snake.unshift(head);

                // Проверка на съедение еды
                if (head.x === food.x && head.y === food.y) {
                    setScore(prev => prev + 1);
                    food = generateFood(canvas, snake);
                } else {
                    // Удаляем хвост, если не съели еду
                    snake.pop();
                }

                // Отрисовка игры
                drawGame(ctx, canvas, snake, food);
            }, TICK_SPEED);
        };

        startGame();

        // Очистка
        return () => {
            clearInterval(gameLoop);
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [gameStarted, gameOver])
    
    return (
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid red", width: '80vw', height: '80vh' }}
        />
      );
}