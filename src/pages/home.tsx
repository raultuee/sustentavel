import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ellipsis } from "lucide-react";

export function Home() {
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

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900">
      {/* Canvas do céu estrelado */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block", zIndex: 0 }}
      />
      
      {/* Conteúdo principal */}
      <div className="relative z-10 p-4 flex flex-col items-center justify-center gap-4 min-h-screen">
        <div className="w-full flex justify-start max-w-4xl">
          <h1 className="font-bold text-3xl tracking-tight text-white drop-shadow-lg">
            {getSaudacao()}! Vamos tornar o mundo mais sustentável?
          </h1>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 max-w-4xl">
          <a href="/quiz">
            <Card className=" p-3 rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
              <CardHeader className="flex flex-col items-center justify-center h-full text-center relative">
                <CardTitle className="text-white text-xl transform group-hover:-translate-y-4 transition-transform duration-500">
                  Questões: Sustentabilidade
                </CardTitle>
                <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                  Teste seu conhecimento sustentável por meio de quizzes.
                </p>
              </CardHeader>
            </Card>
          </a>
          <Card className=" p-3 rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative">
              <CardTitle className="text-white text-xl mb-3 transform group-hover:-translate-y-4 transition-transform duration-500">
              Pesquisar: Como reutilizar?
              </CardTitle>
              <Input
              className="text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed border-[#124E2A] placeholder:text-white"
              placeholder="Escreva o item que deseja reutilizar"
              />
            </CardHeader>
          </Card>
            <Card className="col-span-2 w-full rounded-xl p-3 bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-0">
              <CardTitle className="text-white text-xl">
                <Ellipsis />
              </CardTitle>
            </CardHeader>
            </Card>
        </div>
      </div>
    </div>
  );
}