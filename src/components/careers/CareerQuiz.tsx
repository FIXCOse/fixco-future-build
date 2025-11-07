import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { flipIn, flipOut, burstIn } from "@/utils/scrollAnimations";

const questions = [
  {
    id: 1,
    question: "Vad motiverar dig mest i ditt arbete?",
    options: [
      { text: "Att skapa synliga resultat", professions: ["Snickare", "Målare"] },
      { text: "Att lösa tekniska problem", professions: ["Elektriker", "VVS"] },
      { text: "Att arbeta utomhus", professions: ["Trädgård", "Markarbeten"] },
      { text: "Att hjälpa människor", professions: ["Städ", "Montering"] }
    ]
  },
  {
    id: 2,
    question: "Hur skulle du beskriva din arbetsstil?",
    options: [
      { text: "Noggrann och detaljorienterad", professions: ["Elektriker", "Målare"] },
      { text: "Praktisk och hands-on", professions: ["Snickare", "VVS"] },
      { text: "Flexibel och anpassningsbar", professions: ["Montering", "Flytt"] },
      { text: "Strukturerad och metodisk", professions: ["Trädgård", "Markarbeten"] }
    ]
  },
  {
    id: 3,
    question: "Vilken arbetsmiljö föredrar du?",
    options: [
      { text: "Inomhus med precision", professions: ["Elektriker", "Målare"] },
      { text: "Varierande projekt", professions: ["Snickare", "Montering"] },
      { text: "Utomhus i naturen", professions: ["Trädgård", "Markarbeten"] },
      { text: "Fysiskt aktivt", professions: ["Flytt", "VVS"] }
    ]
  },
  {
    id: 4,
    question: "Vad är viktigast för dig på en arbetsplats?",
    options: [
      { text: "Utvecklingsmöjligheter", professions: ["Elektriker", "VVS"] },
      { text: "Kreativ frihet", professions: ["Snickare", "Målare"] },
      { text: "Teamwork", professions: ["Montering", "Flytt"] },
      { text: "Flexibilitet", professions: ["Trädgård", "Städ"] }
    ]
  },
  {
    id: 5,
    question: "Hur ser din ideala arbetsdag ut?",
    options: [
      { text: "Problemlösning och felsökning", professions: ["Elektriker", "VVS"] },
      { text: "Bygga och skapa", professions: ["Snickare", "Markarbeten"] },
      { text: "Förvandla utrymmen", professions: ["Målare", "Trädgård"] },
      { text: "Hålla saker i ordning", professions: ["Städ", "Montering"] }
    ]
  }
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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 300);
  };

  const getRecommendedProfession = () => {
    const professionCount: { [key: string]: number } = {};
    answers.flat().forEach(prof => {
      professionCount[prof] = (professionCount[prof] || 0) + 1;
    });
    
    const sorted = Object.entries(professionCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "Snickare";
  };

  const getMatchPercentage = () => {
    const total = answers.flat().length;
    const topCount = Math.max(...Object.values(
      answers.flat().reduce((acc, prof) => {
        acc[prof] = (acc[prof] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    ));
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
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Hitta ditt drömjobb</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Är du redo för Fixco?</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground">
            Svara på 5 snabba frågor och upptäck vilket yrke som passar dig bäst
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Fråga {currentQuestion + 1} av {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  className="origin-left"
                >
                  <Progress value={progress} className="h-2" />
                </motion.div>
              </div>

              <motion.div
                key={currentQuestion}
                initial={{ 
                  opacity: 0, 
                  rotateY: -90,
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  rotateY: 0,
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  rotateY: 90,
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className="p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(option.professions, index)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          selectedOption === index
                            ? 'border-primary bg-primary/10 scale-95'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            selectedOption === index
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`}>
                            {selectedOption === index && (
                              <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-base font-medium">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              variants={burstIn}
              initial="hidden"
              animate="visible"
            >
              <GlassCard className="p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>Du är en perfekt match!</GradientText>
                </h3>

                <div className="mb-8">
                  <p className="text-xl text-muted-foreground mb-4">
                    Baserat på dina svar rekommenderar vi:
                  </p>
                  <div className="text-5xl font-bold mb-2">
                    <GradientText gradient="rainbow">
                      {getRecommendedProfession()}
                    </GradientText>
                  </div>
                  <p className="text-2xl text-primary font-semibold">
                    {getMatchPercentage()}% Match
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={scrollToForm} className="text-lg">
                    Ansök nu
                  </Button>
                  <Button size="lg" variant="outline" onClick={resetQuiz}>
                    Gör om quiz
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Vi ser fram emot din ansökan! 🎉
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
