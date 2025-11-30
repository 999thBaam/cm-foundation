import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from 'lucide-react';

const FlashcardViewer = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState(flashcards);

    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                No flashcards available for this chapter yet.
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrevious = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleShuffle = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleReset = () => {
        setCards(flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'hard':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Flashcards</h3>
                    <p className="text-sm text-slate-500">
                        {currentIndex + 1} / {cards.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleShuffle}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                        title="Shuffle cards"
                    >
                        <Shuffle size={16} />
                        Shuffle
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                        title="Reset order"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                </div>
            </div>

            {/* Flashcard */}
            <div className="relative h-80 perspective-1000">
                <motion.div
                    className="w-full h-full cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    {/* Front of card (Question) */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-medium text-primary-100 uppercase tracking-wide">
                                    Question
                                </span>
                                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(currentCard.difficulty)}`}>
                                    {currentCard.difficulty}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-white leading-relaxed">
                                {currentCard.question}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-primary-100">
                                Click to reveal answer
                            </p>
                        </div>
                    </div>

                    {/* Back of card (Answer) */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-xl p-8 flex flex-col justify-between"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                                    Answer
                                </span>
                                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(currentCard.difficulty)}`}>
                                    {currentCard.difficulty}
                                </span>
                            </div>
                            <p className="text-xl text-white leading-relaxed">
                                {currentCard.answer}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-400">
                                Click to see question
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={handlePrevious}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cards.length <= 1}
                >
                    <ChevronLeft size={20} className="text-slate-700" />
                </button>

                <div className="flex gap-2">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsFlipped(false);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-primary-500 w-8'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cards.length <= 1}
                >
                    <ChevronRight size={20} className="text-slate-700" />
                </button>
            </div>

            {/* Hint */}
            <div className="text-center">
                <p className="text-sm text-slate-500">
                    Use arrow keys or click the card to flip
                </p>
            </div>
        </div>
    );
};

export default FlashcardViewer;
