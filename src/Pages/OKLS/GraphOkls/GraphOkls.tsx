import { useEffect, useRef, useState } from "react";

interface IData {
  name: string;
  value: number;
}

interface IProps {
  data: IData[];
  barColor?: string;
  backgroundColor?: string;
  axisColor?: string;
  textColor?: string;
}

export const GraphOkls = (props: IProps) => {
  const { 
    data, 
    barColor = "#4285F4", 
    backgroundColor = "#F7F8FA",
    axisColor = "#333",
    textColor = "#666"
  } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const containerWidth = canvasRef.current.parentElement.clientWidth;
        setDimensions({
          width: containerWidth,
          height: 400,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Рисуем фон
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Рассчитываем параметры графика
    const values = data.map(item => item.value);
    const maxValue = Math.max(...values);
    const barCount = data.length;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const graphWidth = dimensions.width - margin.left - margin.right;
    const graphHeight = dimensions.height - margin.top - margin.bottom;

    // Рисуем оси
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    
    // Вертикальная ось (Y)
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + graphHeight);
    ctx.stroke();

    // Горизонтальная ось (X)
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + graphHeight);
    ctx.lineTo(margin.left + graphWidth, margin.top + graphHeight);
    ctx.stroke();

    // Рисуем шкалу Y (значения из value)
    ctx.fillStyle = textColor;
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = Math.round((maxValue / ySteps) * i);
      const y = margin.top + graphHeight - (i / ySteps) * graphHeight;
      
      // Линии сетки
      ctx.strokeStyle = "#ddd";
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + graphWidth, y);
      ctx.stroke();

      // Подписи значений
      ctx.fillStyle = textColor;
      ctx.fillText(value.toString(), margin.left - 10, y);
    }

    // Рисуем шкалу X (наименования из name)
    ctx.fillStyle = textColor;
    ctx.font = "10px";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Рассчитываем размеры и позиции столбцов
    const barWidth = graphWidth / barCount * 0.5;
    const barSpacing = graphWidth / barCount * 0.5;

    data.forEach((item, i) => {
      const x = margin.left + i * (barWidth + barSpacing) + barSpacing/2;
      
      // Подписи категорий
      ctx.fillText(
        item.name, 
        x + barWidth/2, 
        margin.top + graphHeight + 10
      );
      
      // Столбцы
      const barHeight = (item.value / maxValue) * graphHeight;
      const y = margin.top + graphHeight - barHeight;
      
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
    });

  }, [data, dimensions, barColor, backgroundColor, axisColor, textColor]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: "100%" }}
    />
  );
};