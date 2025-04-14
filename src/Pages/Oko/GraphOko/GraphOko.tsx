import { useEffect, useRef, useState } from "react";

interface IData {
  name: string;
  value: number;
}

interface IProps {
  backgroundColor?: string;
  data: IData[];
}

export const GraphOko = (props: IProps) => {
  const { backgroundColor = "#F7F8FA", data = [] } = props;
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
    if (!canvas || dimensions.width === 0 || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Calculate max value (min is fixed at 0)
    const maxValue = Math.max(...data.map(item => item.value), 1); // Ensure at least 1

    // Padding and dimensions for the graph
    const padding = 40;
    const graphWidth = dimensions.width - padding * 2;
    const graphHeight = dimensions.height - padding * 2;

    // Draw grid lines
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (for Y axis)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = dimensions.height - padding - (i * graphHeight) / ySteps;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(dimensions.width - padding, y);
      ctx.stroke();
    }
    
    // Vertical grid lines (for X axis)
    data.forEach((_, index) => {
      const x = padding + (index * graphWidth) / (data.length - 1 || 1);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, dimensions.height - padding);
      ctx.stroke();
    });

    // Draw X and Y axes
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Y axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, dimensions.height - padding);
    // X axis
    ctx.moveTo(padding, dimensions.height - padding);
    ctx.lineTo(dimensions.width - padding, dimensions.height - padding);
    ctx.stroke();

    // Draw X axis labels (using data.name)
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    data.forEach((item, index) => {
      const x = padding + (index * graphWidth) / (data.length - 1 || 1);
      ctx.fillText(item.name, x, dimensions.height - padding + 10);
    });

    // Draw Y axis labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= ySteps; i++) {
      const value = (i * maxValue) / ySteps;
      const y = dimensions.height - padding - (i * graphHeight) / ySteps;
      ctx.fillText(value.toFixed(0), padding - 10, y);
    }

    // Calculate all points first
    const points = data.map((item, index) => {
      const x = padding + (index * graphWidth) / (data.length - 1 || 1);
      const y =
        dimensions.height -
        padding -
        (item.value / maxValue) * graphHeight;
      return { x, y };
    });

    // Draw connecting lines
    if (points.length > 1) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = "red";
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [dimensions, backgroundColor, data]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: "100%" }}
    />
  );
};