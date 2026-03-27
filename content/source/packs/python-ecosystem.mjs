import {
  codeExercise,
  createConcept,
  flashcard,
  mcq,
  projectCheckpoint,
  shortAnswer
} from "../helpers.mjs";

export default [
  createConcept({
    id: "packages_databases_and_web",
    title: "Packages, databases, and web interaction",
    summary:
      "Work with Python's wider ecosystem by installing packages, storing structured data, and making controlled requests to external systems.",
    tags: ["pip", "databases", "web", "apis", "ecosystem"],
    prerequisites: ["functions_and_modules", "files_and_exceptions"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: [
          "Installing Packages With Pip",
          "Creating and Modifying PDF Files",
          "Working With Databases",
          "Interacting With the Web"
        ]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Working with APIs"]
      }
    ],
    items: [
      flashcard({
        id: "pip-role",
        prompt: "What is `pip` used for in a Python workflow?",
        answer:
          "It installs and manages external Python packages so your project can use libraries beyond the standard library.",
        hints: ["Think dependency management."]
      }),
      mcq({
        id: "api-definition",
        prompt: "What is an API in everyday programming terms?",
        choices: [
          {
            id: "a",
            label: "A defined interface for requesting and exchanging functionality or data."
          },
          { id: "b", label: "A special kind of Python loop." },
          { id: "c", label: "A database backup file." },
          { id: "d", label: "A chart annotation style." }
        ],
        correctChoiceId: "a",
        hints: ["Think contract, not syntax sugar."],
        explanation:
          "An API is an agreed-upon interface that lets one piece of software use data or behavior from another."
      }),
      shortAnswer({
        id: "database-benefit",
        prompt: "Why would you use a database instead of a plain text file for some applications?",
        acceptedAnswers: [
          "structured queries",
          "reliable storage",
          "relationships and indexing"
        ],
        hints: ["Think querying, scale, and structure."],
        explanation:
          "Databases help when data needs structure, querying, indexing, relationships, or multi-user reliability."
      }),
      projectCheckpoint({
        id: "external-system-checklist",
        prompt:
          "Before adding a third-party package or API to a learning app, what should you check?",
        checklist: [
          "Is the dependency trustworthy and maintained?",
          "What data shape and failure modes should I expect?",
          "How will I test the integration without breaking the core app?"
        ],
        reflection:
          "External tools accelerate development, but they also add operational and maintenance responsibilities."
      })
    ]
  }),
  createConcept({
    id: "scientific_computing_and_interfaces",
    title: "Scientific computing and interfaces",
    summary:
      "Use numerical libraries and graphical interfaces when the task calls for them, while keeping the underlying program structure clear.",
    tags: ["numpy", "graphing", "gui", "interfaces"],
    prerequisites: ["variables_strings_numbers", "visualization_storytelling"],
    sourceAnchors: [
      {
        bookId: "python_basics",
        keywords: ["Scientific Computing and Graphing", "Graphical User Interfaces"]
      },
      {
        bookId: "principles_data_science",
        keywords: ["Data Science with Python", "Visualizing Data"]
      }
    ],
    items: [
      flashcard({
        id: "numpy-strength",
        prompt: "Why is NumPy often preferred over raw Python loops for numeric arrays?",
        answer:
          "It provides efficient array operations and mathematical tools that are faster and more expressive for numerical work.",
        hints: ["Think vectorized numerical computation."]
      }),
      shortAnswer({
        id: "gui-event-loop",
        prompt: "What is the role of an event loop in a graphical interface?",
        acceptedAnswers: [
          "respond to user actions",
          "listen for events and update the UI",
          "handle clicks and redraws"
        ],
        hints: ["Think waiting for user actions."]
        ,
        explanation:
          "A GUI event loop waits for input events and routes them to the code that updates the interface."
      }),
      codeExercise({
        id: "numpy-mean",
        prompt:
          "Use NumPy to create an array from `[2, 4, 6, 8]` and print its mean.",
        starterCode:
          "import numpy as np\nvalues = [2, 4, 6, 8]\n# create the array and print the mean\n",
        solutionCode:
          "import numpy as np\nvalues = [2, 4, 6, 8]\narr = np.array(values)\nprint(arr.mean())\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == '5.0', 'The mean should be 5.0.'\n__grade_result__ = {'passed': True, 'message': 'Your NumPy array computation is correct.'}\n",
        packages: ["numpy"],
        rubric: ["Creates a NumPy array", "Uses an array method to compute the mean"]
      })
    ]
  })
];
