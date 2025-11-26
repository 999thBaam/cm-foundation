import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const Practice = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What is the chemical formula for water?",
            options: ["H₂O", "CO₂", "O₂", "H₂O₂"],
            correct: 0
        },
        {
            id: 2,
            question: "Which of the following is a sign of a chemical reaction?",
            options: ["Change in shape", "Change in color", "Change in size", "Change in position"],
            correct: 1
        },
        {
            id: 3,
            question: "What does the Law of Conservation of Mass state?",
            options: [
                "Mass can be created",
                "Mass can be destroyed",
                "Mass is neither created nor destroyed",
                "Mass always increases"
            ],
            correct: 2
        }
    ];

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        setShowResult(true);
        if (index === questions[currentQuestion].correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizComplete(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizComplete(false);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (quizComplete) {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-lg p-12 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete! 🎉</h1>
                    <p className="text-lg text-slate-600 mb-8">
                        You scored <span className="font-bold text-green-600">{score}</span> out of <span className="font-bold">{questions.length}</span>
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handleRestart} className="btn btn-primary flex items-center gap-2">
                            <RotateCcw size={18} />
                            Try Again
                        </button>
                        <button className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors">
                            Back to Chapter
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-sm font-medium text-slate-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 lg:p-12"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        {questions[currentQuestion].question}
                    </h2>

                    <div className="space-y-3 mb-8">
                        {questions[currentQuestion].options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === questions[currentQuestion].correct;
                            const showCorrect = showResult && isCorrect;
                            const showIncorrect = showResult && isSelected && !isCorrect;

                            return (
                                <motion.button
                                    key={index}
                                    whileHover={!showResult ? { scale: 1.02 } : {}}
                                    whileTap={!showResult ? { scale: 0.98 } : {}}
                                    onClick={() => !showResult && handleAnswer(index)}
                                    disabled={showResult}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between ${showCorrect
                                            ? 'border-green-500 bg-green-50 text-green-900'
                                            : showIncorrect
                                                ? 'border-red-500 bg-red-50 text-red-900'
                                                : isSelected
                                                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                        }`}
                                >
                                    <span>{option}</span>
                                    {showCorrect && <CheckCircle size={24} className="text-green-600" />}
                                    {showIncorrect && <XCircle size={24} className="text-red-600" />}
                                </motion.button>
                            );
                        })}
                    </div>

                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end"
                        >
                            <button onClick={handleNext} className="btn btn-primary flex items-center gap-2">
                                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                                <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Practice;
