import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const questions = [
  {
    id: 1,
    question: "Vad motiverar dig mest i ditt arbete?",
    options: [
      { text: "Att skapa synliga resultat", professions: ["Snickare", "Målare"] },
      { text: "Att lösa tekniska problem", professions: ["Elektriker", "VVS"] },
      { text: "Att arbeta utomhus", professions: ["Trädgård", "Markarbeten"] },
      { text: "Att hjälpa människor", professions: ["Städ", "Montering"] },
    ],
  },
  {
    id: 2,
    question: "Hur skulle du beskriva din arbetsstil?",
    options: [
      { text: "Noggrann och detaljorienterad", professions: ["Elektriker", "Målare"] },
      { text: "Praktisk och hands-on", professions: ["Snickare", "VVS"] },
      { text: "Flexibel och anpassningsbar", professions: ["Montering", "Flytt"] },
      { text: "Strukturerad och metodisk", professions: ["Trädgård", "Markarbeten"] },
    ],
  },
  {
    id: 3,
    question: "Vilken arbetsmiljö föredrar du?",
    options: [
      { text: "Inomhus med precision", professions: ["Elektriker", "Målare"] },
      { text: "Varierande projekt", professions: ["Snickare", "Montering"] },
      { text: "Utomhus i naturen", professions: ["Trädgård", "Markarbeten"] },
      { text: "Fysiskt aktivt", professions: ["Flytt", "VVS"] },
    ],
  },
  {
    id: 4,
    question: "Vad är viktigast för dig på en arbetsplats?",
    options: [
      { text: "Utvecklingsmöjligheter", professions: ["Elektriker", "VVS"] },
      { text: "Kreativ frihet", professions: ["Snickare", "Målare"] },
      { text: "Teamwork", professions: ["Montering", "Flytt"] },
      { text: "Flexibilitet", professions: ["Trädgård", "Städ"] },
    ],
  },
  {
    id: 5,
    question: "Hur ser din ideala arbetsdag ut?",
    options: [
      { text: "Problemlösning och felsökning", professions: ["Elektriker", "VVS"] },
      { text: "Bygga och skapa", professions: ["Snickare", "Markarbeten"] },
      { text: "Förvandla utrymmen", professions: ["Målare", "Trädgård"] },
      { text: "Hålla saker i ordning", professions: ["Städ", "Montering"] },
    ],
  },
];

export const CareerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (professions: string[], optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers, professions];
      setAnswers(newAnswers);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }, 300);
  };

  const getRecommendedProfession = () => {
    const professionCount: { [key: string]: number } = {};
    answers.flat().forEach((prof) => {
      professionCount[prof] = (professionCount[prof] || 0) + 1;
    });
    const sorted = Object.entries(professionCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "Snickare";
  };

  const getMatchPercentage = () => {
    const total = answers.flat().length;
    const topCount = Math.max(
      ...Object.values(
        answers.flat().reduce((acc, prof) => {
          acc[prof] = (acc[prof] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      )
    );
    return Math.round((topCount / total) * 100);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedOption(null);
  };

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Hitta ditt drömjobb</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Är du redo för <span className="text-primary">Fixco?</span>
          </h2>
          <p className="text-muted-foreground">
            Svara på 5 snabba frågor och upptäck vilket yrke som passar dig bäst
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Fråga {currentQuestion + 1} av {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-2 mb-6">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < currentQuestion
                        ? 'bg-primary'
                        : i === currentQuestion
                        ? 'bg-primary ring-2 ring-primary/30'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Question card */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="bg-card border border-border rounded-xl p-8 shadow-sm"
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center text-foreground">
                  {questions[currentQuestion].question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.professions, index)}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        selectedOption === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            selectedOption === index
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {selectedOption === index && (
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-8 md:p-12 text-center shadow-sm"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                Du är en perfekt match!
              </h3>

              <p className="text-muted-foreground mb-2">
                Baserat på dina svar rekommenderar vi:
              </p>
              <div className="text-4xl font-bold text-primary mb-1">
                {getRecommendedProfession()}
              </div>
              <p className="text-lg font-semibold text-primary/80 mb-8">
                {getMatchPercentage()}% Match
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={scrollToForm}>
                  Ansök nu
                </Button>
                <Button size="lg" variant="outline" onClick={resetQuiz}>
                  Gör om quiz
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
