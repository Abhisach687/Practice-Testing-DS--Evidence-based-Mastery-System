import {
  bugFix,
  codeExercise,
  createConcept,
  flashcard,
  mcq,
  predictOutput,
  shortAnswer
} from "../helpers.mjs";

export default [
  createConcept({
    id: "functions_and_modules",
    title: "Functions and modules",
    summary:
      "Break logic into reusable units with clear parameters, return values, and module boundaries.",
    tags: ["python", "functions", "modules", "abstraction"],
    prerequisites: ["conditionals_and_loops"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Functions and Loops", "Modules and Packages"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Functions", "Storing Your Functions in Modules"]
      },
      {
        bookId: "mit_python",
        keywords: ["FUNCTIONS, SCOPING, AND ABSTRACTION", "MODULES AND FILES"]
      }
    ],
    workedExample: true,
    items: [
      flashcard({
        id: "return-vs-print",
        prompt: "What is the difference between returning a value and printing a value?",
        answer:
          "Returning sends a value back to the caller for reuse; printing only displays text to the user.",
        hints: ["Think reuse versus display."]
      }),
      shortAnswer({
        id: "parameter-purpose",
        prompt: "Why are parameters useful in a function definition?",
        acceptedAnswers: [
          "they let you pass different inputs",
          "they make the function reusable",
          "inputs to a function"
        ],
        hints: ["A hard-coded function is much less flexible."],
        explanation:
          "Parameters make a function reusable by letting callers supply different inputs without rewriting the body."
      }),
      predictOutput({
        id: "function-call-trace",
        prompt: "Predict the output.",
        code: "def scale(value, factor=2):\n    return value * factor\n\nprint(scale(5))\nprint(scale(5, 3))",
        acceptedAnswers: ["10\n15"],
        hints: ["Remember the default value for `factor`."],
        explanation:
          "The first call uses the default factor 2, and the second overrides it with 3."
      }),
      codeExercise({
        id: "module-style-helper",
        prompt:
          "Define a function `is_even(number)` that returns `True` when the input is even and `False` otherwise.",
        starterCode: "# define is_even here\n",
        solutionCode:
          "def is_even(number):\n    return number % 2 == 0\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert 'is_even' in ns, 'Define a function named is_even.'\nassert ns['is_even'](4) is True\nassert ns['is_even'](5) is False\n__grade_result__ = {'passed': True, 'message': 'Your function returns the right boolean values.'}\n",
        rubric: ["Returns booleans", "Uses the input parameter"]
      })
    ]
  }),
  createConcept({
    id: "files_and_exceptions",
    title: "Files and exceptions",
    summary:
      "Read and write files safely, and handle failures in ways that preserve signal instead of hiding bugs.",
    tags: ["python", "files", "exceptions", "io"],
    prerequisites: ["functions_and_modules"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["File Input and Output"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Files and Exceptions", "Reading from a File", "Writing to a File"]
      },
      {
        bookId: "mit_python",
        keywords: ["MODULES AND FILES", "EXCEPTIONS AND ASSERTIONS"]
      }
    ],
    items: [
      flashcard({
        id: "with-statement",
        prompt: "Why is `with open(...)` usually better than `open(...)` alone?",
        answer:
          "It guarantees that the file is cleaned up promptly, even if an error occurs while you are working with it.",
        hints: ["Think automatic cleanup."]
      }),
      mcq({
        id: "exception-when",
        prompt:
          "Which situation is the best use of a `try`/`except` block?",
        choices: [
          {
            id: "a",
            label: "Handling a file that might not exist when the user provides the path."
          },
          { id: "b", label: "Avoiding all debugging forever." },
          { id: "c", label: "Replacing every `if` statement in your codebase." },
          { id: "d", label: "Making a list immutable." }
        ],
        correctChoiceId: "a",
        hints: ["Use exceptions when failure is possible and expected."],
        explanation:
          "File access can fail for reasons outside your control, so catching the specific error lets you respond cleanly."
      }),
      shortAnswer({
        id: "specific-except",
        prompt: "Why should you catch specific exceptions instead of using a bare `except`?",
        acceptedAnswers: [
          "to avoid hiding unrelated bugs",
          "specific errors are safer",
          "bare except hides problems"
        ],
        hints: ["Think debugging quality."],
        explanation:
          "Specific exceptions preserve useful failures and make it much easier to understand what actually went wrong."
      }),
      codeExercise({
        id: "safe-divide",
        prompt:
          "Write a function `safe_divide(a, b)` that returns `a / b`, but returns the string `'cannot divide by zero'` when `b` is zero.",
        starterCode: "# define safe_divide here\n",
        solutionCode:
          "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 'cannot divide by zero'\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert ns['safe_divide'](8, 2) == 4\nassert ns['safe_divide'](8, 0) == 'cannot divide by zero'\n__grade_result__ = {'passed': True, 'message': 'Your function handles zero division correctly.'}\n",
        rubric: ["Handles the normal case", "Handles division by zero cleanly"]
      })
    ]
  }),
  createConcept({
    id: "debugging_testing_assertions",
    title: "Debugging, testing, and assertions",
    summary:
      "Read failures, isolate bugs, and write tests that protect behavior as programs grow.",
    tags: ["python", "debugging", "testing", "assertions"],
    prerequisites: ["files_and_exceptions"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Finding and Fixing Code Bugs"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Testing Your Code"]
      },
      {
        bookId: "mit_python",
        keywords: ["TESTING AND DEBUGGING", "EXCEPTIONS AND ASSERTIONS"]
      }
    ],
    items: [
      flashcard({
        id: "failing-test-value",
        prompt: "Why is a failing test useful even though it feels like bad news?",
        answer:
          "It gives you a precise, repeatable signal that behavior is wrong and tells you when the bug is actually fixed.",
        hints: ["Think feedback loop, not punishment."]
      }),
      bugFix({
        id: "fix-average",
        prompt:
          "The function should return the arithmetic mean of a list of numbers. Fix the bug.",
        starterCode:
          "def average(values):\n    return sum(values) / (len(values) - 1)\n",
        solutionCode:
          "def average(values):\n    return sum(values) / len(values)\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert round(ns['average']([2, 4, 6]), 2) == 4.0\nassert round(ns['average']([10, 20]), 2) == 15.0\n__grade_result__ = {'passed': True, 'message': 'You corrected the mean calculation.'}\n",
        hints: ["Check the denominator.", "The count of items should match the list length."],
        rubric: ["Uses the true list length"]
      }),
      mcq({
        id: "assert-purpose",
        prompt: "What is an assertion best used for?",
        choices: [
          { id: "a", label: "Documenting and checking assumptions that should always be true." },
          { id: "b", label: "Replacing all user-facing error handling." },
          { id: "c", label: "Installing packages from the internet." },
          { id: "d", label: "Formatting CSV files." }
        ],
        correctChoiceId: "a",
        hints: ["Assertions are about programmer assumptions."],
        explanation:
          "Assertions are a compact way to state invariants and catch impossible states during development."
      }),
      shortAnswer({
        id: "minimal-repro",
        prompt: "What is a minimal reproducible example, and why does it help debugging?",
        acceptedAnswers: [
          "small example that still shows the bug",
          "reproduce the bug in a tiny case",
          "small repeatable failing case"
        ],
        hints: ["Shrink the problem until the bug still survives."],
        explanation:
          "A minimal reproducible example removes noise, making the bug easier to reason about and easier for others to help with."
      })
    ]
  }),
  createConcept({
    id: "objects_and_classes",
    title: "Objects and classes",
    summary:
      "Model state and behavior with classes, instances, and inheritance without overcomplicating simple data.",
    tags: ["python", "oop", "classes", "instances"],
    prerequisites: ["functions_and_modules"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Object-Oriented Programming (OOP)"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Classes", "Inheritance"]
      },
      {
        bookId: "mit_python",
        keywords: ["CLASSES AND OBJECT-ORIENTED PROGRAMMING", "PLOTTING AND MORE ABOUT CLASSES"]
      }
    ],
    items: [
      flashcard({
        id: "class-vs-instance",
        prompt: "What is the difference between a class and an instance?",
        answer:
          "A class is the blueprint that defines attributes and behavior; an instance is one concrete object created from that blueprint.",
        hints: ["Blueprint versus specific object."]
      }),
      predictOutput({
        id: "method-call-output",
        prompt: "Predict the output.",
        code: "class Counter:\n    def __init__(self, start):\n        self.value = start\n\n    def bump(self):\n        self.value += 1\n        return self.value\n\nc = Counter(4)\nprint(c.bump())\nprint(c.bump())",
        acceptedAnswers: ["5\n6"],
        hints: ["The object keeps state between method calls."],
        explanation:
          "Each call mutates `self.value`, so the counter increments from 4 to 5 and then to 6."
      }),
      shortAnswer({
        id: "init-purpose",
        prompt: "What is the role of `__init__` in a class?",
        acceptedAnswers: [
          "initialize instance attributes",
          "set up a new object",
          "constructor-like setup"
        ],
        hints: ["Think first-time setup for each new instance."],
        explanation:
          "`__init__` runs when an instance is created and is typically used to assign its starting attributes."
      }),
      codeExercise({
        id: "book-class",
        prompt:
          "Create a class `Book` with attributes `title` and `pages`, and a method `is_long()` that returns `True` when pages are at least 300.",
        starterCode: "# define Book here\n",
        solutionCode:
          "class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n\n    def is_long(self):\n        return self.pages >= 300\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nbook = ns['Book']('Python Patterns', 320)\nassert book.title == 'Python Patterns'\nassert book.pages == 320\nassert book.is_long() is True\nassert ns['Book']('Short Notes', 120).is_long() is False\n__grade_result__ = {'passed': True, 'message': 'Your class models state and behavior correctly.'}\n",
        rubric: ["Stores both attributes", "Returns the right boolean"]
      })
    ]
  })
];
