import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, Leaf, ArrowLeft } from "lucide-react";

interface ReuseIdea {
  title: string;
  description: string;
  benefits: string[];
  difficulty: "Fácil" | "Médio" | "Difícil";
}

const reuseDatabase: Record<string, ReuseIdea[]> = {
  "garrafa pet": [
    {
      title: "Vaso para Plantas",
      description: "Corte a garrafa ao meio e faça furos no fundo para drenagem",
      benefits: ["Reduz lixo plástico", "Economiza dinheiro em vasos", "Promove jardinagem"],
      difficulty: "Fácil"
    },
    {
      title: "Organizador de Escritório",
      description: "Corte e decore para guardar canetas, lápis e materiais",
      benefits: ["Organiza espaço", "Reutiliza material", "Personalização criativa"],
      difficulty: "Fácil"
    },
    {
      title: "Comedouro para Pássaros",
      description: "Faça aberturas laterais e pendure no jardim",
      benefits: ["Ajuda animais", "Decoração natural", "Educação ambiental"],
      difficulty: "Médio"
    }
  ],
  "caixa de papelão": [
    {
      title: "Organizador de Gavetas",
      description: "Corte em tamanhos adequados para separar objetos pequenos",
      benefits: ["Organização eficiente", "Evita compra de organizadores", "100% reciclável"],
      difficulty: "Fácil"
    },
    {
      title: "Casa de Brinquedo",
      description: "Construa casas, carros ou castelos para crianças",
      benefits: ["Estimula criatividade", "Brincadeira sustentável", "Economia familiar"],
      difficulty: "Médio"
    }
  ],
  "pneu": [
    {
      title: "Jardim Suspenso",
      description: "Pinte e pendure para plantar flores ou temperos",
      benefits: ["Aproveitamento total", "Jardim vertical", "Visual moderno"],
      difficulty: "Médio"
    },
    {
      title: "Balanço Infantil",
      description: "Prenda com cordas resistentes em árvores ou estruturas",
      benefits: ["Diversão para crianças", "Exercício físico", "Segurança com reutilização"],
      difficulty: "Difícil"
    }
  ],
  "lata": [
    {
      title: "Porta-lápis Decorativo",
      description: "Remova rótulos, lixe e decore com tinta ou tecido",
      benefits: ["Organização", "Decoração personalizada", "Evita descarte de metal"],
      difficulty: "Fácil"
    },
    {
      title: "Horta Vertical",
      description: "Faça furos para drenagem e plante ervas aromáticas",
      benefits: ["Produção de alimentos", "Economia no supermercado", "Temperos frescos"],
      difficulty: "Médio"
    }
  ]
};

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Fácil": return "text-blue-400";
    case "Médio": return "text-yellow-400";
    case "Difícil": return "text-red-400";
    default: return "text-white";
  }
}

export function ReuseItemPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ReuseIdea[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);

    // Simula delay de busca
    setTimeout(() => {
      const searchLower = searchTerm.toLowerCase().trim();
      let foundResults: ReuseIdea[] = [];

      // Busca por correspondência exata ou parcial
      Object.entries(reuseDatabase).forEach(([key, ideas]) => {
        if (key.includes(searchLower) || searchLower.includes(key)) {
          foundResults = [...foundResults, ...ideas];
        }
      });

      // Se não encontrar, busca por palavras-chave genéricas
      if (foundResults.length === 0) {
        if (searchLower.includes("plástico") || searchLower.includes("garrafa")) {
          foundResults = reuseDatabase["garrafa pet"] || [];
        } else if (searchLower.includes("papel") || searchLower.includes("caixa")) {
          foundResults = reuseDatabase["caixa de papelão"] || [];
        } else if (searchLower.includes("metal") || searchLower.includes("alumínio")) {
          foundResults = reuseDatabase["lata"] || [];
        }
      }

      setResults(foundResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleBack = () => {
    setSearchTerm("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 mt-16">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reaproveitamento Inteligente
            </h1>
            <p className="text-white/80">
              Descubra maneiras criativas de dar nova vida aos seus objetos
            </p>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Digite o item que você quer reaproveitar (ex: garrafa pet, caixa de papelão, pneu...)"
                  className="bg-white/5 border-white/30 text-white placeholder:text-white/60 pr-12"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Resultados */}
        {hasSearched && (
          <div className="space-y-6">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white/80">Buscando ideias sustentáveis...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Encontramos {results.length} ideia{results.length > 1 ? 's' : ''} para "{searchTerm}"
                  </h2>
                  <p className="text-white/70">
                    Escolha a que mais combina com você e comece a transformar!
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((idea, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                      <CardHeader className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                          <span className={`text-sm font-medium ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                        </div>
                        
                        <CardTitle className="text-white text-xl mb-3">
                          {idea.title}
                        </CardTitle>
                        
                        <p className="text-white/80 text-sm mb-4 leading-relaxed">
                          {idea.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-medium text-sm">Benefícios:</span>
                          </div>
                          <ul className="space-y-1">
                            {idea.benefits.map((benefit, bIndex) => (
                              <li key={bIndex} className="text-white/70 text-sm flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                  <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Nenhuma ideia encontrada
                  </h3>
                  <p className="text-white/70 mb-4">
                    Não encontramos sugestões para "{searchTerm}". Tente termos como:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.keys(reuseDatabase).map((item) => (
                      <button
                        key={item}
                        onClick={() => setSearchTerm(item)}
                        className="bg-blue-600/30 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600/50 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial - sugestões */}
        {!hasSearched && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Transforme o que você não usa mais!
              </h3>
              <p className="text-white/80 mb-6">
                Digite acima qualquer item que você quer reaproveitar e descubra formas criativas e sustentáveis de dar uma nova vida a ele.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(reuseDatabase).map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchTerm(item)}
                    className="bg-blue-600/20 text-white p-3 rounded-xl hover:bg-blue-600/40 transition-all duration-300 text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}