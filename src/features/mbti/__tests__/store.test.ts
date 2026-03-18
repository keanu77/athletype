import { describe, it, expect, beforeEach, vi } from "vitest";
import { questions } from "@/data/questions";

// Mock Zustand persist middleware to be a pass-through (no actual localStorage)
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    persist: (fn: unknown) => fn,
    createJSONStorage: () => undefined,
  };
});

// Import store after mock
const { useMBTIStore } = await import("../store");

describe("MBTIStore", () => {
  beforeEach(() => {
    useMBTIStore.getState().reset();
  });

  describe("initial state", () => {
    it("should start at question index 0", () => {
      expect(useMBTIStore.getState().currentIndex).toBe(0);
    });

    it("should have empty answers", () => {
      expect(Object.keys(useMBTIStore.getState().answers)).toHaveLength(0);
    });

    it("should not be completed", () => {
      expect(useMBTIStore.getState().isCompleted).toBe(false);
    });

    it("should have null result", () => {
      expect(useMBTIStore.getState().result).toBeNull();
    });
  });

  describe("setAnswer", () => {
    it("should store an answer for a question", () => {
      useMBTIStore.getState().setAnswer("ei-1", "A");
      expect(useMBTIStore.getState().answers["ei-1"]).toBe("A");
    });

    it("should overwrite a previous answer", () => {
      useMBTIStore.getState().setAnswer("ei-1", "A");
      useMBTIStore.getState().setAnswer("ei-1", "B");
      expect(useMBTIStore.getState().answers["ei-1"]).toBe("B");
    });

    it("should not affect other answers", () => {
      useMBTIStore.getState().setAnswer("ei-1", "A");
      useMBTIStore.getState().setAnswer("sn-1", "B");
      expect(useMBTIStore.getState().answers["ei-1"]).toBe("A");
      expect(useMBTIStore.getState().answers["sn-1"]).toBe("B");
    });
  });

  describe("navigation", () => {
    it("nextQuestion should increment index", () => {
      useMBTIStore.getState().nextQuestion();
      expect(useMBTIStore.getState().currentIndex).toBe(1);
    });

    it("prevQuestion should decrement index", () => {
      useMBTIStore.getState().nextQuestion();
      useMBTIStore.getState().nextQuestion();
      useMBTIStore.getState().prevQuestion();
      expect(useMBTIStore.getState().currentIndex).toBe(1);
    });

    it("prevQuestion should not go below 0", () => {
      useMBTIStore.getState().prevQuestion();
      expect(useMBTIStore.getState().currentIndex).toBe(0);
    });

    it("nextQuestion should not go beyond last question", () => {
      for (let i = 0; i < questions.length + 5; i++) {
        useMBTIStore.getState().nextQuestion();
      }
      expect(useMBTIStore.getState().currentIndex).toBe(questions.length - 1);
    });

    it("goToQuestion should set specific index", () => {
      useMBTIStore.getState().goToQuestion(10);
      expect(useMBTIStore.getState().currentIndex).toBe(10);
    });

    it("goToQuestion should reject invalid indices", () => {
      useMBTIStore.getState().goToQuestion(-1);
      expect(useMBTIStore.getState().currentIndex).toBe(0);

      useMBTIStore.getState().goToQuestion(questions.length);
      expect(useMBTIStore.getState().currentIndex).toBe(0);
    });
  });

  describe("computed values", () => {
    it("getCurrentQuestion should return correct question", () => {
      const q = useMBTIStore.getState().getCurrentQuestion();
      expect(q).toBe(questions[0]);
    });

    it("getProgress should reflect current position", () => {
      const progress = useMBTIStore.getState().getProgress();
      expect(progress.current).toBe(1);
      expect(progress.total).toBe(questions.length);
      expect(progress.percent).toBe(0);
    });

    it("canGoNext should be false without an answer", () => {
      expect(useMBTIStore.getState().canGoNext()).toBe(false);
    });

    it("canGoNext should be true after answering current question", () => {
      const q = useMBTIStore.getState().getCurrentQuestion()!;
      useMBTIStore.getState().setAnswer(q.id, "A");
      expect(useMBTIStore.getState().canGoNext()).toBe(true);
    });

    it("canGoPrev should be false at first question", () => {
      expect(useMBTIStore.getState().canGoPrev()).toBe(false);
    });

    it("canGoPrev should be true after advancing", () => {
      useMBTIStore.getState().nextQuestion();
      expect(useMBTIStore.getState().canGoPrev()).toBe(true);
    });
  });

  describe("finishTest", () => {
    it("should compute a valid result with full answers", () => {
      questions.forEach((q) => {
        useMBTIStore.getState().setAnswer(q.id, "A");
      });

      useMBTIStore.getState().finishTest();
      const state = useMBTIStore.getState();

      expect(state.isCompleted).toBe(true);
      expect(state.result).not.toBeNull();
      expect(state.result!.type).toBe("ESTJ");
      expect(state.result!.scores.EI).toBeDefined();
      expect(state.result!.scores.SN).toBeDefined();
      expect(state.result!.scores.TF).toBeDefined();
      expect(state.result!.scores.JP).toBeDefined();
    });

    it("should handle partial answers gracefully", () => {
      useMBTIStore.getState().setAnswer("ei-1", "A");
      useMBTIStore.getState().finishTest();

      const state = useMBTIStore.getState();
      expect(state.isCompleted).toBe(true);
      expect(state.result).not.toBeNull();
      expect(state.result!.type).toHaveLength(4);
    });
  });

  describe("reset", () => {
    it("should clear all state after finishing test", () => {
      questions.forEach((q) => {
        useMBTIStore.getState().setAnswer(q.id, "A");
      });
      useMBTIStore.getState().finishTest();

      useMBTIStore.getState().reset();
      const state = useMBTIStore.getState();

      expect(state.currentIndex).toBe(0);
      expect(Object.keys(state.answers)).toHaveLength(0);
      expect(state.result).toBeNull();
      expect(state.isCompleted).toBe(false);
    });
  });

  describe("full flow integration", () => {
    it("should complete the entire test flow", () => {
      const store = useMBTIStore.getState;

      // Answer all 28 questions, alternating A and B
      questions.forEach((q, i) => {
        store().setAnswer(q.id, i % 2 === 0 ? "A" : "B");
        if (i < questions.length - 1) {
          store().nextQuestion();
        }
      });

      // Verify progress
      expect(store().getProgress().percent).toBe(100);

      // Finish test
      store().finishTest();
      expect(store().isCompleted).toBe(true);

      const result = store().result!;
      expect(result.type).toHaveLength(4);
      expect(result.type).toMatch(/^[EI][SN][TF][JP]$/);

      // Verify scores structure
      for (const dim of ["EI", "SN", "TF", "JP"] as const) {
        const score = result.scores[dim];
        expect(score.percentA + score.percentB).toBe(100);
        expect(score.scoreA + score.scoreB).toBe(7);
      }

      // Reset and verify clean state
      store().reset();
      expect(store().currentIndex).toBe(0);
      expect(store().result).toBeNull();
    });
  });
});
