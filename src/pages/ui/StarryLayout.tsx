import { useEffect, useRef, ReactNode } from "react";

interface StarryLayoutProps {
  children: ReactNode;
}

export function StarryLayout({ children }: StarryLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    let animationFrameId: number;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
    }));

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function animate() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.closePath();

        star.x += star.dx;
        star.y += star.dy;

        // Rebote nas bordas
        if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900">
      {/* Canvas do céu estrelado */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block", zIndex: 0 }}
      />
      
      {/* Conteúdo das páginas */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Exemplo de como usar em suas páginas:

// Home.tsx simplificado
export function HomeSimplified() {
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4 min-h-screen">
      <h1 className="font-bold text-4xl tracking-tight text-white drop-shadow-lg">
        {getSaudacao()}!
      </h1>
      <div className="w-full flex gap-4 max-w-4xl">
        <div className="w-1/2 p-3 h-[250px] rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full text-center relative">
            <h2 className="text-white text-xl mb-4 transform group-hover:-translate-y-4 transition-transform duration-500">
              Questões: Sustentabilidade
            </h2>
            <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
              Teste seu conhecimento sustentável por meio de quizzes.
            </p>
          </div>
        </div>
        <div className="w-1/2 p-3 h-[250px] rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-white">
          <div className="p-4">
            <h2 className="text-white text-xl">Questões: Sustentabilidade</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exemplo de outra página
export function AboutPage() {
  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4 min-h-screen">
      <h1 className="font-bold text-4xl tracking-tight text-white drop-shadow-lg">
        Sobre Nós
      </h1>
      <div className="max-w-2xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-white">
        <p className="text-lg leading-relaxed">
          Esta é uma página de exemplo mostrando como o layout estrelado pode ser usado em diferentes seções do seu aplicativo.
        </p>
      </div>
    </div>
  );
}

// Exemplo de como usar o layout
export function App() {
  return (
    <StarryLayout>
      <HomeSimplified />
      {/* ou <AboutPage /> ou qualquer outro componente */}
    </StarryLayout>
  );
}