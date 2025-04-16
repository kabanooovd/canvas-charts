import { useEffect, useRef, useState } from "react";

interface IData {
  name: string;
  value: number;
}

interface IProps {
  data: IData[];
  maxY?: number;
  barColor?: string;
  backgroundColor?: string;
  axisColor?: string;
  textColor?: string;
  topFillColor?: string;
  valueLabelColor?: string;
  yStep?: number;
}

export const GraphOkls = (props: IProps) => {
  const { 
    data, 
    maxY = 14,
    barColor = "#4285F4", 
    backgroundColor = "#F7F8FA",
    axisColor = "#333",
    textColor = "#666",
    topFillColor = "#bbbfc7",
    valueLabelColor = "#fff",
    yStep = 2
  } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  const generateYSteps = (max: number, step: number) => {
    const steps = [];
    for (let i = 0; i <= max; i += step) {
      steps.push(i);
    }
    return steps;
  };

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
    if (!canvas || dimensions.width === 0 || !data.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    const barCount = data.length;
    const margin = { top: 40, right: 20, bottom: 40, left: 50 };
    const graphWidth = dimensions.width - margin.left - margin.right;
    const graphHeight = dimensions.height - margin.top - margin.bottom;

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + graphHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + graphHeight);
    ctx.lineTo(margin.left + graphWidth, margin.top + graphHeight);
    ctx.stroke();

    const yStepValues = generateYSteps(maxY, yStep);

    ctx.fillStyle = textColor;
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    yStepValues.forEach((value) => {
      const y = margin.top + graphHeight - (value / maxY) * graphHeight;
      
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + graphWidth, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText(value.toString(), margin.left - 10, y);
    });

    ctx.fillStyle = textColor;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const barWidth = Math.max(20, graphWidth / (barCount * 1.8));
    const barSpacing = (graphWidth - barCount * barWidth) / (barCount + 1);

    data.forEach((item, i) => {
      const x = margin.left + barSpacing + i * (barWidth + barSpacing);
      
      ctx.fillText(
        item.name, 
        x + barWidth/2, 
        margin.top + graphHeight + 15
      );
      
      const barHeight = Math.max(1, (item.value / maxY) * graphHeight);
      const y = margin.top + graphHeight - barHeight;
      
      const topFillHeight = ((maxY - item.value) / maxY) * graphHeight;
      const topFillY = margin.top + graphHeight - barHeight - topFillHeight;
      
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      ctx.fillStyle = topFillColor;
      ctx.fillRect(x, topFillY, barWidth, topFillHeight);

      ctx.fillStyle = valueLabelColor;
      ctx.font = "bold 12px Arial";
      ctx.textBaseline = "bottom";
      ctx.textAlign = "center";
      
      const labelY = y - 8;
      ctx.fillText(item.value.toString(), x + barWidth/2, labelY);
    });

  }, [data, dimensions, barColor, backgroundColor, axisColor, textColor, maxY, topFillColor, valueLabelColor, yStep]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: "100%", display: 'block' }}
    />
  );
};