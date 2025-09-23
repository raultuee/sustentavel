import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

const quizQuestions = [
	{
		question: "Qual é a principal causa do efeito estufa?",
		options: [
			"Desmatamento das florestas",
			"Emissão de gases como CO2 e metano",
			"Poluição dos oceanos",
			"Uso excessivo de água",
		],
		correct: 1,
	},
	{
		question: "Quanto tempo leva para uma sacola plástica se degradar na natureza?",
		options: [
			"5 a 10 anos",
			"50 a 100 anos",
			"200 a 400 anos",
			"1000 a 1500 anos",
		],
		correct: 2,
	},
	{
		question: "O que significa o termo 'pegada ecológica'?",
		options: [
			"Área de floresta preservada por pessoa",
			"Quantidade de lixo produzido por indivíduo",
			"Medida do impacto das atividades humanas no meio ambiente",
			"Número de árvores plantadas por ano",
		],
		correct: 2,
	},
	{
		question: "Qual fonte de energia é considerada mais sustentável?",
		options: [
			"Energia nuclear",
			"Carvão mineral",
			"Energia solar",
			"Gás natural",
		],
		correct: 2,
	},
	{
		question: "Qual é o principal benefício da compostagem?",
		options: [
			"Reduz o uso de água",
			"Transforma resíduos orgânicos em adubo natural",
			"Elimina completamente o lixo",
			"Gera energia elétrica",
		],
		correct: 1,
	},
	{
		question: "O que são os 3 Rs da sustentabilidade?",
		options: [
			"Reciclar, Reutilizar, Renovar",
			"Reduzir, Reutilizar, Reciclar",
			"Recuperar, Renovar, Reciclar",
			"Reduzir, Renovar, Recuperar",
		],
		correct: 1,
	},
	{
		question: "Qual setor consome mais água no Brasil?",
		options: [
			"Uso doméstico",
			"Indústria",
			"Agropecuária",
			"Comércio",
		],
		correct: 2,
	},
	{
		question: "O que é biodiversidade?",
		options: [
			"Variedade de climas em uma região",
			"Quantidade de água disponível no planeta",
			"Diversidade de espécies de seres vivos",
			"Tipos diferentes de solo",
		],
		correct: 2,
	},
	{
		question: "Qual é o principal gás responsável pela destruição da camada de ozônio?",
		options: [
			"Dióxido de carbono (CO2)",
			"Metano (CH4)",
			"Clorofluorcarbono (CFC)",
			"Óxido nitroso (N2O)",
		],
		correct: 2,
	},
	{
		question: "O que caracteriza um desenvolvimento sustentável?",
		options: [
			"Crescimento econômico sem limites",
			"Preservação total da natureza sem desenvolvimento",
			"Equilíbrio entre crescimento econômico, social e ambiental",
			"Uso apenas de tecnologias antigas",
		],
		correct: 2,
	},
];

type GameState = "start" | "countdown" | "playing" | "finished";

export function Quiz() {
	const [gameState, setGameState] = useState<GameState>("start");
	const [currentQuestion, setCurrentQuestion] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [score, setScore] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(90);
	const [answered, setAnswered] = useState<boolean>(false);
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number>(3);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

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

	useEffect(() => {
		if (gameState === "playing" && timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && gameState === "playing") {
			setGameState("finished");
		}
	}, [timeLeft, gameState]);

	useEffect(() => {
		if (gameState === "countdown") {
			if (countdown > 0) {
				const timer = setTimeout(() => {
					setCountdown((prev) => prev - 1);
				}, 1000);
				return () => clearTimeout(timer);
			} else {
				playBackgroundMusic();
				setGameState("playing");
			}
		}
	}, [countdown, gameState]);

	const playBackgroundMusic = () => {
		const audio = new window.Audio("/música.mp3");
		audio.loop = true;
		audio.volume = 0.2;
		audio.play();
		setAudioElement(audio);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const startQuiz = () => {
		setGameState("countdown");
		setCountdown(3);
		setCurrentQuestion(0);
		setScore(0);
		setTimeLeft(90);
		setSelectedAnswer(null);
		setAnswered(false);
		setIsTransitioning(false);
	};

	const selectAnswer = (answerIndex: number) => {
		if (!answered && !isTransitioning) {
			setSelectedAnswer(answerIndex);
			setAnswered(true);

			if (answerIndex === quizQuestions[currentQuestion].correct) {
				setScore((prev) => prev + 1);
			}

			setTimeout(() => {
				if (currentQuestion < quizQuestions.length - 1) {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentQuestion((prev) => prev + 1);
						setSelectedAnswer(null);
						setAnswered(false);
						setIsTransitioning(false);
					}, 300);
				} else {
					setGameState("finished");
				}
			}, 2000);
		}
	};

	const restartQuiz = () => {
		if (audioElement) {
			audioElement.pause();
			audioElement.currentTime = 0;
		}
		setGameState("start");
	};

	const getAlternativeStyle = (index: number) => {
		if (!answered) {
			return "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white cursor-pointer";
		}
		if (index === quizQuestions[currentQuestion].correct) {
			return "bg-gradient-to-br from-green-500 to-green-600 text-white";
		}
		if (
			selectedAnswer === index &&
			index !== quizQuestions[currentQuestion].correct
		) {
			return "bg-gradient-to-br from-red-500 to-red-600 text-white";
		}
		return "bg-gradient-to-br from-green-600/50 to-green-700/50 text-white/70";
	};

	if (gameState === "start") {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center ">
				<h1 className="text-4xl font-bold tracking-tight text-white mb-4">
					Quiz: Sustentabilidade
				</h1>
				<p className="text-green-100 mb-8 text-lg text-center max-w-md">
					Teste seu conhecimento sobre sustentabilidade com 10 questões em 1
					minuto e 30 segundos!
				</p>
				<div className="flex gap-3">
					<Button
						className="bg-green-900 hover:bg-green-700 text-white rounded-full"
						size="lg"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="w-4 h-4 mr-2" /> Voltar
					</Button>
					<Button
						className="bg-white text-green-950 hover:bg-gray-200 rounded-full"
						size="lg"
						onClick={startQuiz}
					>
						Iniciar Quiz
					</Button>
				</div>
			</div>
		);
	}

	if (gameState === "countdown") {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center ">
				<div className="relative">
					{countdown > 0 ? (
						<div className="flex flex-col items-center">
							<div
								key={countdown}
								className="text-white text-9xl font-bold mb-4 animate-pulse transform transition-all duration-1000 scale-110"
								style={{
									animation: "bounce 1s ease-in-out, fadeInScale 1s ease-out",
								}}
							>
								{countdown}
							</div>
							<div className="text-white text-2xl font-semibold animate-pulse">
								Prepare-se...
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center">
							<div
								className="text-white text-6xl font-bold mb-4 animate-bounce"
								style={{
									animation: "fadeInScale 0.8s ease-out",
								}}
							>
								COMEÇAR!
							</div>
							<div className="text-green-400 text-xl font-semibold animate-pulse">
								Boa sorte! 🍃
							</div>
						</div>
					)}
				</div>
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
					<div
						className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400/30 rounded-full animate-ping"
						style={{ animationDelay: "0.5s" }}
					></div>
					<div
						className="absolute top-1/2 left-1/6 w-1 h-1 bg-green-300/40 rounded-full animate-ping"
						style={{ animationDelay: "1s" }}
					></div>
					<div
						className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/15 rounded-full animate-ping"
						style={{ animationDelay: "1.5s" }}
					></div>
				</div>
				<style>{`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
			</div>
		);
	}

	if (gameState === "finished") {
		const percentage = (score / quizQuestions.length) * 100;
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center ">
				<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
					<h2 className="text-3xl font-bold text-green-950 mb-4">
						Quiz Finalizado!
					</h2>
					<div className="text-6xl font-bold text-green-600 mb-2">{score}</div>
					<p className="text-xl text-gray-700 mb-4">
						de {quizQuestions.length} questões
					</p>
					<p className="text-lg text-gray-600 mb-6">
						Você acertou {percentage.toFixed(0)}% das questões!
					</p>
					<div className="flex gap-3 justify-center">
						<Button
							className="bg-green-900 hover:bg-green-600 text-white rounded-full"
							onClick={restartQuiz}
						>
							Tentar Novamente
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`w-full h-screen flex flex-col transition-opacity duration-300 ${
				isTransitioning ? "opacity-50" : "opacity-100"
			}`}
		>
			<div className="flex justify-between items-center px-8 py-6">
				<a
					className="bg-transparent hover:bg-green-800/50 text-white text-xl font-semibold px-0 cursor-pointer"
					onClick={restartQuiz}
				>
					Sair
				</a>
				<div className="text-white text-4xl font-bold">
					{formatTime(timeLeft)}
				</div>
			</div>
			<div className="flex-1 flex flex-col items-center justify-center px-8">
				<h2 className="text-white text-xl font-medium mb-12 text-center">
					{quizQuestions[currentQuestion].question}
				</h2>
				<div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
					{quizQuestions[currentQuestion].options.map((option, index) => (
						<div
							key={index}
							onClick={() => selectAnswer(index)}
							className={`
                relative h-32 rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer
                ${getAlternativeStyle(index)}
                ${!answered ? "hover:shadow-xl" : "cursor-default"}
              `}
						>
							{answered && index === quizQuestions[currentQuestion].correct && (
								<div className="absolute top-3 right-3">
									<Check className="w-6 h-6 text-white" />
								</div>
							)}
							<div className="text-center">
								<div className="text-base font-semibold mb-1">
									Alternativa {String.fromCharCode(65 + index)}
								</div>
								<div className="text-sm leading-relaxed">{option}</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex justify-center pb-8">
				<div className="flex gap-3">
					{Array.from({ length: quizQuestions.length }, (_, index) => (
						<div
							key={index}
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
								index < currentQuestion
									? "bg-green-500 text-white"
									: index === currentQuestion
									? "bg-white text-green-950"
									: "bg-white/30 text-white/70"
							}`}
						>
							{index + 1}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}