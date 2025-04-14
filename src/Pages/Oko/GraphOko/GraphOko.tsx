import React, { useRef, useEffect } from 'react';

interface ScaleValue {
  name: string;
  value: number;
}

interface DiagnosisChart {
  name: string;
  datasets: {
    "Пациент": ScaleValue[];
    "Норма": ScaleValue[];
  };
}

interface IProps {
  data: DiagnosisChart;
  width?: number;
  height?: number;
}

export const GraphOko = (props: IProps) => {
  const { data, width = 800, height = 600} = props
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxValue = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройки
    const margin = { top: 60, right: 40, bottom: 80, left: 180 }; // Увеличен left margin
    const chartWidth = width - margin.left - margin.right;
    const barHeight = 25;
    const gapBetweenBars = 15;
    const barPairGap = 5;

    // Очистка
    ctx.clearRect(0, 0, width, height);

    // Ось X
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left + chartWidth, margin.top);
    ctx.stroke();

    // Метки шкалы
    const scaleSteps = [0, 10, 15, 20, 25, 40, 50];
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    scaleSteps.forEach(value => {
      const x = margin.left + (value / maxValue) * chartWidth;
      ctx.fillText(value.toString(), x, margin.top - 10);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + 5);
      ctx.stroke();
    });

    // Ось Y - с переносами длинных слов
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    data.datasets["Пациент"].forEach((item, index) => {
      const y = margin.top + 30 + index * (barHeight * 2 + gapBetweenBars);
      
      // Разбиваем длинные названия на части
      const maxChars = 16; // Максимум символов в одной строке
      const nameParts = [];
      for (let i = 0; i < item.name.length; i += maxChars) {
        nameParts.push(item.name.substring(i, i + maxChars));
      }
      
      // Рисуем каждую часть
      nameParts.forEach((part, i) => {
        ctx.fillText(part, margin.left - 10, y + barHeight / 2 + (i * 15));
      });
    });

    // Бары
    data.datasets["Пациент"].forEach((_, index) => {
      const y = margin.top + 30 + index * (barHeight * 2 + gapBetweenBars);

      // Бар нормы
      const normalValue = data.datasets["Норма"][index]?.value || 0;
      const normalWidth = (normalValue / maxValue) * chartWidth;
      ctx.fillStyle = '#2E79FF';
      ctx.fillRect(margin.left, y, normalWidth, barHeight);
      ctx.fillStyle = '#000';
      ctx.textAlign = 'left';
      if (normalValue > 0) {
        ctx.fillText(normalValue.toString(), margin.left + normalWidth + 5, y + barHeight / 2 + 5);
      }

      // Бар пациента
      const patientValue = data.datasets["Пациент"][index]?.value || 0;
      const patientWidth = (patientValue / maxValue) * chartWidth;
      ctx.fillStyle = 'orange';
      ctx.fillRect(margin.left, y + barHeight + barPairGap, patientWidth, barHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(patientValue.toString(), margin.left + patientWidth + 5, y + barHeight * 1.5 + 5 + barPairGap);
    });
  }, [data, width, height]);

  return <canvas 
    ref={canvasRef} 
    width={width} 
    height={height}
    style={{ backgroundColor: '#F7F8FA' }}
  />
};