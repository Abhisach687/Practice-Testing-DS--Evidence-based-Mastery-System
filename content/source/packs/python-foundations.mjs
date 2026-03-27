import {
  codeExercise,
  codeTrace,
  createConcept,
  flashcard,
  mcq,
  predictOutput,
  shortAnswer
} from "../helpers.mjs";

export default [
  createConcept({
    id: "python_environment_and_execution",
    title: "Python environment and execution",
    summary:
      "Set up Python, understand the interpreter, and move confidently between scripts, terminals, and quick experiments.",
    tags: ["python", "setup", "cli", "syntax"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Setting Up Python", "Your First Python Program"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Chapter 1: Getting Started", "Running a Hello World Program"]
      },
      {
        bookId: "mit_python",
        keywords: ["GETTING STARTED", "INTRODUCTION TO PYTHON"]
      }
    ],
    workedExample: true,
    items: [
      flashcard({
        id: "interpreter-role",
        prompt: "What job does the Python interpreter do when you run a script?",
        answer:
          "It reads Python source code, checks the syntax, and executes the statements in order inside a Python runtime.",
        hints: [
          "Think about the layer between your `.py` file and the operating system."
        ],
        rubric: ["Mentions execution", "Mentions reading/parsing code"]
      }),
      mcq({
        id: "script-vs-repl",
        prompt:
          "Which option is the best fit for quickly testing one expression before editing a longer program?",
        choices: [
          { id: "a", label: "Open the Python REPL and try the expression there." },
          { id: "b", label: "Rewrite the entire project from scratch." },
          { id: "c", label: "Only use a debugger and never run code directly." },
          { id: "d", label: "Delete your environment and reinstall Python." }
        ],
        correctChoiceId: "a",
        hints: ["Look for the tool with the fastest feedback loop."],
        explanation:
          "The REPL is ideal for tiny experiments, while scripts are better once the logic deserves to be saved and rerun."
      }),
      shortAnswer({
        id: "traceback-purpose",
        prompt: "What is a traceback trying to tell you after a crash?",
        acceptedAnswers: ["where the error happened", "stack of calls", "error message"],
        hints: [
          "It gives location and context, not just the final exception name."
        ],
        explanation:
          "A traceback shows the chain of calls that led to the failure and usually points to the most useful file and line to inspect first."
      }),
      codeExercise({
        id: "greeting-script",
        prompt:
          "Write a script that stores your name in `learner_name` and prints two lines: `Hello, <name>!` and `Ready to practice Python.`",
        starterCode: "learner_name = \"\"\n# print the two required lines below\n",
        solutionCode:
          "learner_name = \"Ava\"\nprint(f\"Hello, {learner_name}!\")\nprint(\"Ready to practice Python.\")\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\noutput = [line.strip() for line in buf.getvalue().strip().splitlines()]\nassert len(output) == 2, 'Print exactly two lines.'\nassert output[0].startswith('Hello, '), 'First line should greet the learner.'\nassert output[1] == 'Ready to practice Python.', 'Second line should match exactly.'\n__grade_result__ = {'passed': True, 'message': 'Your script prints the required greeting.'}\n",
        rubric: [
          "Uses a variable",
          "Prints two lines",
          "Keeps the second line exact"
        ]
      })
    ]
  }),
  createConcept({
    id: "variables_strings_numbers",
    title: "Variables, strings, and numbers",
    summary:
      "Use names to store values, transform strings, and choose numeric operators that match the task.",
    tags: ["python", "strings", "numbers", "variables"],
    prerequisites: ["python_environment_and_execution"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Strings and String Methods", "Numbers and Math"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Variables and Simple Data Types", "Strings", "Numbers"]
      },
      {
        bookId: "mit_python",
        keywords: ["INTRODUCTION TO PYTHON", "SOME SIMPLE NUMERICAL PROGRAMS"]
      }
    ],
    workedExample: true,
    items: [
      flashcard({
        id: "f-string-purpose",
        prompt: "Why are f-strings useful when building output?",
        answer:
          "They let you embed variable values and expressions directly inside a readable string template.",
        hints: ["Think about mixing text with computed values."]
      }),
      predictOutput({
        id: "string-method-output",
        prompt: "Predict the exact output.",
        code: "topic = 'data science'\nprint(topic.title())\nprint(topic.replace(' ', '-'))",
        acceptedAnswers: ["Data Science\ndata-science"],
        hints: ["Remember that `.title()` capitalizes each word."],
        explanation:
          "The first line title-cases both words, and the second replaces the space with a hyphen."
      }),
      mcq({
        id: "division-choice",
        prompt: "Which expression returns the remainder when 17 is divided by 5?",
        choices: [
          { id: "a", label: "17 / 5" },
          { id: "b", label: "17 // 5" },
          { id: "c", label: "17 % 5" },
          { id: "d", label: "17 ** 5" }
        ],
        correctChoiceId: "c",
        hints: ["Think modulo."],
        explanation:
          "`%` returns the remainder, `//` returns the floor quotient, and `/` returns floating-point division."
      }),
      codeExercise({
        id: "receipt-line",
        prompt:
          "Create variables `item`, `price`, and `quantity`, then print one line in the form `tea x3 = 13.50` using an f-string.",
        starterCode:
          "item = 'tea'\nprice = 4.5\nquantity = 3\n# print the formatted line\n",
        solutionCode:
          "item = 'tea'\nprice = 4.5\nquantity = 3\ntotal = price * quantity\nprint(f\"{item} x{quantity} = {total:.2f}\")\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nns = {}\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, ns)\noutput = buf.getvalue().strip()\nassert output == 'tea x3 = 13.50', 'Expected the exact formatted receipt line.'\n__grade_result__ = {'passed': True, 'message': 'Your formatted output looks correct.'}\n",
        rubric: ["Computes total", "Uses fixed decimal formatting"]
      })
    ]
  }),
  createConcept({
    id: "collections_and_iteration",
    title: "Collections and iteration",
    summary:
      "Model grouped data with lists, tuples, and dictionaries, then iterate through those structures without losing track of the shape.",
    tags: ["python", "lists", "tuples", "dictionaries", "loops"],
    prerequisites: ["variables_strings_numbers"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Tuples, Lists, and Dictionaries", "Functions and Loops"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Introducing Lists", "Working with Lists", "Dictionaries"]
      },
      {
        bookId: "mit_python",
        keywords: ["STRUCTURED TYPES AND MUTABILITY"]
      }
    ],
    items: [
      flashcard({
        id: "list-vs-tuple",
        prompt: "What is the practical difference between a list and a tuple?",
        answer:
          "Lists are mutable and meant to change over time; tuples are fixed-size records that are typically treated as immutable.",
        hints: ["Focus on mutability and intention."]
      }),
      codeTrace({
        id: "dict-loop-trace",
        prompt: "What keys are printed, in order?",
        code: "scores = {'python': 8, 'sql': 7, 'stats': 9}\nfor topic, score in scores.items():\n    if score >= 8:\n        print(topic)",
        acceptedAnswers: ["python\nstats"],
        hints: ["Only topics with scores 8 or higher survive the filter."],
        explanation:
          "The loop visits each key-value pair, and only `python` and `stats` meet the threshold."
      }),
      shortAnswer({
        id: "slice-meaning",
        prompt: "What does `items[1:4]` return from a list?",
        acceptedAnswers: [
          "index 1 through 3",
          "a new list from index 1 up to but not including 4",
          "elements 1 to 3"
        ],
        hints: ["Python slices exclude the stop index."],
        explanation:
          "The slice creates a new list starting at index 1 and stopping before index 4."
      }),
      codeExercise({
        id: "inventory-total",
        prompt:
          "Given the `inventory` dictionary below, compute and print the total item count across all categories.",
        starterCode:
          "inventory = {'books': 4, 'pens': 6, 'notebooks': 5}\n# print the total count\n",
        solutionCode:
          "inventory = {'books': 4, 'pens': 6, 'notebooks': 5}\nprint(sum(inventory.values()))\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == '15', 'The total inventory count should be 15.'\n__grade_result__ = {'passed': True, 'message': 'You aggregated the dictionary values correctly.'}\n",
        rubric: ["Uses dictionary values", "Produces a single numeric result"]
      })
    ]
  }),
  createConcept({
    id: "conditionals_and_loops",
    title: "Conditionals and loops",
    summary:
      "Control program flow with boolean tests, `if` branches, `while` loops, and loop guards that stop at the right time.",
    tags: ["python", "conditionals", "while", "for", "control-flow"],
    prerequisites: ["collections_and_iteration"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Conditional Logic and Control Flow", "Functions and Loops"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["if Statements", "User Input and while Loops"]
      },
      {
        bookId: "mit_python",
        keywords: ["INTRODUCTION TO PYTHON"]
      }
    ],
    items: [
      flashcard({
        id: "guard-clause",
        prompt: "What problem does a loop guard solve?",
        answer:
          "It defines the condition for continuing or stopping so a loop does useful work without running forever.",
        hints: ["Think termination and safety."]
      }),
      mcq({
        id: "elif-purpose",
        prompt:
          "When is `elif` better than writing several separate `if` statements?",
        choices: [
          {
            id: "a",
            label: "When the branches are mutually exclusive and only one should run."
          },
          { id: "b", label: "When you want every branch to always execute." },
          { id: "c", label: "When you are defining a list." },
          { id: "d", label: "When you need to install a package." }
        ],
        correctChoiceId: "a",
        hints: ["Look for exactly-one-path logic."],
        explanation:
          "`elif` expresses an ordered chain of mutually exclusive checks, which is clearer and safer than separate `if` blocks."
      }),
      predictOutput({
        id: "while-countdown",
        prompt: "Predict the printed output.",
        code: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint('done')",
        acceptedAnswers: ["3\n2\n1\ndone"],
        hints: ["The loop prints before it decrements."],
        explanation:
          "The loop runs while `count` is positive, so it prints 3, 2, 1, then exits and prints `done`."
      }),
      codeExercise({
        id: "password-attempts",
        prompt:
          "Write a loop that checks `attempts` one by one and prints `locked` as soon as an attempt equals `'open-sesame'`. If none match, print `access denied` once.",
        starterCode:
          "attempts = ['hello', 'letmein', 'open-sesame']\n# write your loop here\n",
        solutionCode:
          "attempts = ['hello', 'letmein', 'open-sesame']\nfor attempt in attempts:\n    if attempt == 'open-sesame':\n        print('locked')\n        break\nelse:\n    print('access denied')\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == 'locked', 'Expected the successful branch to print locked.'\n__grade_result__ = {'passed': True, 'message': 'Your loop stops on the correct password.'}\n",
        rubric: ["Uses a branch", "Stops once the condition is met"]
      })
    ]
  })
];
