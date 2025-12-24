import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    const correct = questions[currentQuestion].correct === selectedOption;
    setShowFeedback(true);
    if (correct) setScore(score + 1);

    if (correct) {
       // Optional sound effect here
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
      if (score / questions.length > 0.8) {
         confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
         });
      }
      onComplete(score);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100">
        <div className="text-4xl mb-4">
           {score / questions.length > 0.8 ? '🎉' : '📚'}
        </div>
        <h3 className="text-2xl font-bold text-[#0033A0] mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 mb-6">You scored {score} out of {questions.length}</p>
        <button
           onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setIsFinished(false);
              setSelectedOption(null);
              setShowFeedback(false);
           }}
           className="text-[#0033A0] font-medium hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedOption === question.correct;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <span className="font-semibold text-gray-700">Question {currentQuestion + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
             <div
               key={i}
               className={`w-2 h-2 rounded-full ${i === currentQuestion ? 'bg-[#0033A0]' : i < currentQuestion ? 'bg-green-500' : 'bg-gray-300'}`}
             />
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
             let stateClass = "border-gray-200 hover:bg-gray-50";
             if (showFeedback) {
                if (index === question.correct) stateClass = "border-green-500 bg-green-50 text-green-700";
                else if (index === selectedOption) stateClass = "border-red-300 bg-red-50 text-red-700";
                else stateClass = "border-gray-100 opacity-50";
             } else if (selectedOption === index) {
                stateClass = "border-[#0033A0] bg-blue-50 text-[#0033A0]";
             }

             return (
               <button
                 key={index}
                 onClick={() => handleOptionSelect(index)}
                 className={`w-full text-left p-4 rounded-lg border-2 transition-all ${stateClass}`}
                 disabled={showFeedback}
               >
                 <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showFeedback && index === question.correct && <Check size={20} className="text-green-600" />}
                    {showFeedback && index === selectedOption && index !== question.correct && <X size={20} className="text-red-500" />}
                 </div>
               </button>
             );
          })}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
             <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                <span className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect.'}</span> {question.explanation}
             </p>
          </motion.div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 flex justify-end">
        {!showFeedback ? (
           <button
             onClick={handleSubmit}
             disabled={selectedOption === null}
             className="px-6 py-2 bg-[#0033A0] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
           >
             Submit Answer
           </button>
        ) : (
           <button
             onClick={handleNext}
             className="px-6 py-2 bg-[#0033A0] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
           >
             {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={16} />
           </button>
        )}
      </div>
    </div>
  );
};

const ArrowRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default Quiz;
