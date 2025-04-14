import { useEffect, useRef, useState } from "react";

interface IData {
  name: string;
  value: number;
}

interface IProps {
  backgroundColor?: string;
  data: IData[];
  padding?: number;
}

export const GraphOth = (props: IProps) => {
  const {
    backgroundColor = "#F7F8FA",
    data = [],
    padding = 40,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const containerWidth = canvasRef.current.parentElement.clientWidth;
        const calculatedHeight = Math.min(containerWidth * 9 / 16, 600);
        setDimensions({
          width: containerWidth,
          height: calculatedHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate max value (min is fixed at 0)
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    // Calculate label metrics
    ctx.font = "12px Arial";
    const labelMetrics = data.map((item) => ({
      width: ctx.measureText(item.name).width,
      name: item.name,
    }));
    const maxLabelWidth = Math.max(...labelMetrics.map((m) => m.width));

    // Calculate required space for labels (rotated -45 degrees)
    const labelAreaHeight = Math.max(maxLabelWidth * Math.sin(Math.PI / 4) + 20, 50);
    
    // Добавляем дополнительный отступ слева для Y axis labels
    const leftPadding = padding + 30; // Увеличиваем отступ слева на 30px

    // Main graph dimensions - adjust for rotated labels and left padding
    const graphWidth = width - leftPadding - padding - labelAreaHeight/2;
    const graphHeight = height - padding * 2 - labelAreaHeight;

    // Draw grid lines
    ctx.strokeStyle = "#EAEAEA";
    ctx.lineWidth = 1;
    
    // Vertical grid lines (from X axis labels)
    data.forEach((_, index) => {
      const x = leftPadding + (index * graphWidth) / (data.length - 1 || 1);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + graphHeight);
      ctx.stroke();
    });

    // Horizontal grid lines (from Y axis labels)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + graphHeight - (i * graphHeight) / ySteps;
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(leftPadding + graphWidth, y);
      ctx.stroke();
    }

    // Draw X and Y axes
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Y axis
    ctx.moveTo(leftPadding, padding);
    ctx.lineTo(leftPadding, padding + graphHeight);
    // X axis
    ctx.moveTo(leftPadding, padding + graphHeight);
    ctx.lineTo(leftPadding + graphWidth, padding + graphHeight);
    ctx.stroke();

    // Draw X axis labels (rotated -45 degrees)
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    const labelOffset = 20;

    data.map((item, index) => {
      const x = leftPadding + (index * graphWidth) / (data.length - 1 || 1);
      const y = padding + graphHeight + labelOffset;

      // Проверяем первую точку и добавляем дополнительный отступ если нужно
      const effectiveX = index === 0 ? Math.max(x, leftPadding + 10) : x;

      ctx.save();
      ctx.translate(effectiveX, y);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(item.name, 0, 0);
      ctx.restore();

      return { x: effectiveX, y };
    });

    // Draw Y axis labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= ySteps; i++) {
      const value = (i * maxValue) / ySteps;
      const y = padding + graphHeight - (i * graphHeight) / ySteps;
      ctx.fillText(value.toFixed(0), leftPadding - 10, y); // Используем leftPadding вместо padding
    }

    // Calculate points
    const points = data.map((item, index) => {
      const x = leftPadding + (index * graphWidth) / (data.length - 1 || 1);
      const y = padding + graphHeight - (item.value / maxValue) * graphHeight;
      return { x, y };
    });

    // Draw connecting lines
    if (points.length > 1) {
      ctx.strokeStyle = "#3366FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = "#3366FF";
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI); // small circles
      ctx.fill();
    });

  }, [dimensions, data, backgroundColor, padding]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};