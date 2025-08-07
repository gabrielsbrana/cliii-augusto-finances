import React from "react";

export function CliiiLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  // Criar 153 pontos dispostos em formato triangular
  const createTrianglePoints = () => {
    const points = [];
    const rows = 17; // Número de linhas para formar um triângulo com ~153 pontos
    let pointCount = 0;
    
    for (let row = 0; row < rows && pointCount < 153; row++) {
      const pointsInRow = row + 1;
      for (let col = 0; col < pointsInRow && pointCount < 153; col++) {
        const x = (col - row / 2) * 1.2 + 8; // Centralizar horizontalmente
        const y = row * 1.0 + 1; // Espaçamento vertical
        points.push({ x, y, id: pointCount });
        pointCount++;
      }
    }
    
    return points.slice(0, 153); // Garantir exatamente 153 pontos
  };

  const points = createTrianglePoints();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size * 0.85}
        viewBox="0 0 16 14"
        fill="none"
        className="financial-gradient rounded-sm p-1"
        style={{ filter: 'drop-shadow(0 0 8px hsl(var(--secondary) / 0.3))' }}
      >
        {points.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="0.08"
            fill="hsl(var(--secondary))"
            className="animate-pulse"
            style={{
              animationDelay: `${point.id * 0.01}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </svg>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground">Cliii</span>
        <span className="text-xs text-muted-foreground -mt-1">Augusto</span>
      </div>
    </div>
  );
}