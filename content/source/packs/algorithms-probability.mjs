import {
  codeExercise,
  createConcept,
  flashcard,
  mcq,
  predictOutput,
  projectCheckpoint,
  shortAnswer
} from "../helpers.mjs";

export default [
  createConcept({
    id: "recursion_search_and_complexity",
    title: "Recursion, search, and complexity",
    summary:
      "Break problems into smaller subproblems, compare search strategies, and reason about how runtime grows as inputs scale.",
    tags: ["algorithms", "recursion", "search", "complexity"],
    prerequisites: ["functions_and_modules", "collections_and_iteration"],
    sourceAnchors: [
      {
        bookId: "mit_python",
        keywords: [
          "RECURSION AND GLOBAL VARIABLES",
          "A SIMPLISTIC INTRODUCTION TO ALGORITHMIC COMPLEXITY",
          "SOME SIMPLE ALGORITHMS AND DATA STRUCTURES"
        ]
      }
    ],
    items: [
      flashcard({
        id: "base-case",
        prompt: "Why does a recursive function need a base case?",
        answer:
          "The base case stops the recursive calls so the problem eventually terminates instead of expanding forever.",
        hints: ["Think termination, not elegance."]
      }),
      mcq({
        id: "binary-search-requirement",
        prompt: "What must be true before binary search is a valid strategy?",
        choices: [
          { id: "a", label: "The data must be sorted by the searched key." },
          { id: "b", label: "The data must be stored in a dictionary only." },
          { id: "c", label: "Every element must be unique." },
          { id: "d", label: "The list must contain strings." }
        ],
        correctChoiceId: "a",
        hints: ["Binary search depends on order."],
        explanation:
          "Without a sorted order, halving the search space does not tell you which side can be safely discarded."
      }),
      shortAnswer({
        id: "big-o-intuition",
        prompt: "In plain language, what does Big-O notation describe?",
        acceptedAnswers: [
          "how runtime grows with input size",
          "growth rate",
          "how performance scales"
        ],
        hints: ["It is about trend, not exact seconds."],
        explanation:
          "Big-O describes how the work required by an algorithm grows as the input gets larger."
      }),
      codeExercise({
        id: "recursive-countdown",
        prompt:
          "Write a recursive function `countdown(n)` that returns a list like `[3, 2, 1, 0]` when called with `3`.",
        starterCode: "# define countdown here\n",
        solutionCode:
          "def countdown(n):\n    if n == 0:\n        return [0]\n    return [n] + countdown(n - 1)\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert ns['countdown'](0) == [0]\nassert ns['countdown'](3) == [3, 2, 1, 0]\n__grade_result__ = {'passed': True, 'message': 'Your recursion shrinks toward the base case correctly.'}\n",
        rubric: ["Includes a base case", "Reduces the problem size"]
      })
    ]
  }),
  createConcept({
    id: "dynamic_programming_and_graphs",
    title: "Dynamic programming and graph thinking",
    summary:
      "Recognize overlapping subproblems, memoize repeated work, and model relationships as nodes plus edges.",
    tags: ["algorithms", "dynamic-programming", "graphs", "optimization"],
    prerequisites: ["recursion_search_and_complexity"],
    sourceAnchors: [
      {
        bookId: "mit_python",
        keywords: ["KNAPSACK AND GRAPH OPTIMIZATION PROBLEMS", "DYNAMIC PROGRAMMING"]
      }
    ],
    items: [
      flashcard({
        id: "memoization",
        prompt: "What problem does memoization solve?",
        answer:
          "It avoids recomputing the same subproblem by storing previously computed answers and reusing them later.",
        hints: ["Think repeated work."]
      }),
      shortAnswer({
        id: "graph-model",
        prompt: "What are the two basic ingredients of a graph model?",
        acceptedAnswers: ["nodes and edges", "vertices and edges"],
        hints: ["One part represents entities, the other relationships."],
        explanation:
          "Graphs represent entities as nodes (or vertices) and relationships between them as edges."
      }),
      codeExercise({
        id: "fib-memo",
        prompt:
          "Implement `fib(n, memo=None)` so it computes Fibonacci numbers using memoization.",
        starterCode: "# define fib here\n",
        solutionCode:
          "def fib(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    return memo[n]\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert ns['fib'](0) == 0\nassert ns['fib'](1) == 1\nassert ns['fib'](8) == 21\n__grade_result__ = {'passed': True, 'message': 'Your memoized Fibonacci function returns correct values.'}\n",
        rubric: ["Caches prior results", "Handles base cases"]
      }),
      projectCheckpoint({
        id: "knapsack-reflection",
        prompt:
          "You are choosing features for a small app under a time budget. How would a knapsack-style framing help you make that decision?",
        checklist: [
          "Identify the limited resource.",
          "List candidate items with value and cost.",
          "Explain why brute force becomes expensive as choices grow."
        ],
        reflection:
          "Knapsack thinking turns an ambiguous prioritization problem into an optimization problem with explicit tradeoffs."
      })
    ]
  }),
  createConcept({
    id: "simulation_probability",
    title: "Simulation, probability, and randomness",
    summary:
      "Use random processes to model uncertainty, estimate behavior with repeated trials, and connect simulations back to probability questions.",
    tags: ["probability", "simulation", "random", "monte-carlo"],
    prerequisites: ["variables_strings_numbers", "collections_and_iteration"],
    sourceAnchors: [
      {
        bookId: "mit_python",
        keywords: [
          "RANDOM WALKS AND MORE ABOUT DATA VISUALIZATION",
          "STOCHASTIC PROGRAMS, PROBABILITY, AND DISTRIBUTIONS",
          "MONTE CARLO SIMULATION"
        ]
      },
      {
        bookId: "principles_data_science",
        keywords: ["Probability Distributions", "Probability Theory"]
      }
    ],
    items: [
      flashcard({
        id: "monte-carlo-idea",
        prompt: "What is the main idea behind a Monte Carlo simulation?",
        answer:
          "Run many random trials of a process and use the aggregate results to estimate probabilities or expected behavior.",
        hints: ["Think repeated random experiments."]
      }),
      predictOutput({
        id: "random-choice-shape",
        prompt:
          "Suppose `results` stores 1,000 simulated coin flips coded as 0 or 1. What does `sum(results) / len(results)` estimate?",
        code: "# conceptual question: no code to execute",
        acceptedAnswers: [
          "the proportion of ones",
          "estimated probability of heads",
          "average outcome"
        ],
        hints: ["This is an average of binary outcomes."],
        explanation:
          "For 0/1 outcomes, the mean is the observed proportion of 1s, which estimates the event probability."
      }),
      mcq({
        id: "more-trials-effect",
        prompt: "What usually happens when you increase the number of simulation trials?",
        choices: [
          { id: "a", label: "Estimates tend to stabilize, though not perfectly." },
          { id: "b", label: "Randomness disappears completely." },
          { id: "c", label: "The probability law changes." },
          { id: "d", label: "The code becomes deterministic without a seed." }
        ],
        correctChoiceId: "a",
        hints: ["Think sampling noise."],
        explanation:
          "More trials reduce variance in the estimate, even though the process remains random."
      }),
      codeExercise({
        id: "coin-simulation",
        prompt:
          "Write a function `estimate_heads(trials)` that simulates fair coin flips and returns the estimated probability of heads.",
        starterCode: "import random\n\n# define estimate_heads here\n",
        solutionCode:
          "import random\n\ndef estimate_heads(trials):\n    heads = 0\n    for _ in range(trials):\n        heads += random.choice([0, 1])\n    return heads / trials\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nvalue = ns['estimate_heads'](200)\nassert 0 <= value <= 1, 'A probability estimate must stay between 0 and 1.'\nassert abs(value - 0.5) < 0.2, 'With 200 trials the estimate should usually be near 0.5.'\n__grade_result__ = {'passed': True, 'message': 'Your simulation returns a plausible probability estimate.'}\n",
        rubric: ["Uses repeated trials", "Returns a proportion"]
      })
    ]
  })
];
