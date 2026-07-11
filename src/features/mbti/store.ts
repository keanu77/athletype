'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AnswerMap, Answer, ScoringResult } from './types';
import { calculateMBTI } from './scoring';
import { questions } from '@/data/questions';

interface MBTIStore {
  // State
  currentIndex: number;
  answers: AnswerMap;
  result: ScoringResult | null;
  isCompleted: boolean;

  // Actions
  setAnswer: (questionId: string, answer: Answer) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishTest: () => void;
  reset: () => void;

  // Getters (computed)
  getCurrentQuestion: () => typeof questions[0] | null;
  getProgress: () => { current: number; total: number; percent: number };
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
}

const initialState = {
  currentIndex: 0,
  answers: {} as AnswerMap,
  result: null as ScoringResult | null,
  isCompleted: false,
};

export const useMBTIStore = create<MBTIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        }));
      },

      goToQuestion: (index) => {
        if (index >= 0 && index < questions.length) {
          set({ currentIndex: index });
        }
      },

      nextQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex < questions.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      prevQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },

      finishTest: () => {
        const { answers } = get();
        const result = calculateMBTI(answers);
        set({ result, isCompleted: true });
      },

      reset: () => {
        set(initialState);
      },

      getCurrentQuestion: () => {
        const { currentIndex } = get();
        return questions[currentIndex] || null;
      },

      getProgress: () => {
        const { currentIndex, answers } = get();
        const answeredCount = Object.keys(answers).length;
        return {
          current: currentIndex + 1,
          total: questions.length,
          percent: Math.round((answeredCount / questions.length) * 100),
        };
      },

      canGoNext: () => {
        const { currentIndex, answers } = get();
        const currentQuestion = questions[currentIndex];
        return currentQuestion ? !!answers[currentQuestion.id] : false;
      },

      canGoPrev: () => {
        const { currentIndex } = get();
        return currentIndex > 0;
      },
    }),
    {
      name: 'athletype-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        answers: state.answers,
        result: state.result,
        isCompleted: state.isCompleted,
      }),
    }
  )
);

export default useMBTIStore;
