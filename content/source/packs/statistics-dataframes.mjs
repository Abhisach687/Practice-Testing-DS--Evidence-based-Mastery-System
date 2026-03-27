import {
  codeExercise,
  createConcept,
  flashcard,
  mcq,
  predictOutput,
  shortAnswer
} from "../helpers.mjs";

export default [
  createConcept({
    id: "sampling_inference_hypothesis",
    title: "Sampling, inference, and hypothesis testing",
    summary:
      "Reason from samples to populations, build confidence intervals carefully, and interpret hypothesis tests without magical thinking.",
    tags: ["statistics", "sampling", "confidence", "hypothesis-testing"],
    prerequisites: ["simulation_probability"],
    sourceAnchors: [
      {
        bookId: "mit_python",
        keywords: [
          "SAMPLING AND CONFIDENCE",
          "UNDERSTANDING EXPERIMENTAL DATA",
          "RANDOMIZED TRIALS AND HYPOTHESIS CHECKING",
          "LIES, DAMNED LIES, AND STATISTICS"
        ]
      },
      {
        bookId: "principles_data_science",
        keywords: ["Inferential Statistics", "Hypothesis Testing", "Confidence Intervals"]
      }
    ],
    items: [
      flashcard({
        id: "sample-vs-population",
        prompt: "What is the difference between a sample and a population?",
        answer:
          "A population is the full group you care about; a sample is the subset you actually observe and measure.",
        hints: ["Think full target group versus observed subset."]
      }),
      mcq({
        id: "p-value-meaning",
        prompt: "Which statement is the best interpretation of a p-value?",
        choices: [
          {
            id: "a",
            label: "Assuming the null hypothesis were true, it measures how surprising data this extreme would be."
          },
          { id: "b", label: "It is the probability that the null hypothesis is false." },
          { id: "c", label: "It is the effect size in standardized units." },
          { id: "d", label: "It guarantees replication." }
        ],
        correctChoiceId: "a",
        hints: ["Condition on the null, not on the data alone."],
        explanation:
          "A p-value is about the extremeness of the data under the null model, not the probability that the null is false."
      }),
      shortAnswer({
        id: "confidence-interval",
        prompt: "Why does a larger sample usually produce a narrower confidence interval?",
        acceptedAnswers: [
          "less sampling variability",
          "more information reduces uncertainty",
          "standard error gets smaller"
        ],
        hints: ["Think uncertainty shrinking as evidence grows."],
        explanation:
          "Larger samples reduce the standard error, which usually narrows the interval around the estimate."
      }),
      codeExercise({
        id: "sample-mean",
        prompt:
          "Write a function `sample_mean(values)` that returns the arithmetic mean of a non-empty list of numbers.",
        starterCode: "# define sample_mean here\n",
        solutionCode:
          "def sample_mean(values):\n    return sum(values) / len(values)\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert ns['sample_mean']([2, 4, 6]) == 4\nassert ns['sample_mean']([10, 20]) == 15\n__grade_result__ = {'passed': True, 'message': 'Your mean function is correct.'}\n",
        rubric: ["Uses sum and count", "Returns numeric average"]
      })
    ]
  }),
  createConcept({
    id: "dataframes_and_cleaning",
    title: "DataFrames and data cleaning",
    summary:
      "Inspect tabular data, repair quality problems, and choose transformations that keep later analysis trustworthy.",
    tags: ["data-science", "pandas", "cleaning", "tabular-data"],
    prerequisites: ["collections_and_iteration", "files_and_exceptions"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Collecting and Preparing Data", "Data Science with Python", "Data Cleaning and Preprocessing"]
      },
      {
        bookId: "mit_python",
        keywords: ["EXPLORING DATA WITH PANDAS"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Downloading Data", "CSV File Format"]
      }
    ],
    items: [
      flashcard({
        id: "missing-data-first-step",
        prompt: "What is the first thing to do when you notice missing values in a dataset?",
        answer:
          "Inspect where they occur and decide whether they are expected, ignorable, imputable, or a sign of collection problems.",
        hints: ["Diagnose before you fix."]
      }),
      shortAnswer({
        id: "dataframe-benefit",
        prompt: "Why is a DataFrame more helpful than a raw list of rows for many analysis tasks?",
        acceptedAnswers: [
          "named columns",
          "column operations",
          "tabular operations"
        ],
        hints: ["Think labels and vectorized analysis."],
        explanation:
          "DataFrames add labeled columns, rich filtering, summaries, joins, and transformations that are awkward with plain nested lists."
      }),
      predictOutput({
        id: "describe-intuition",
        prompt: "What kind of information would `df.describe()` summarize for numeric columns?",
        code: "# conceptual question: no code to execute",
        acceptedAnswers: [
          "count mean std min max",
          "summary statistics",
          "descriptive statistics"
        ],
        hints: ["Think quick numeric profile."],
        explanation:
          "`describe()` gives a fast descriptive summary such as count, mean, spread, and common quantiles."
      }),
      codeExercise({
        id: "pandas-filter",
        prompt:
          "Use pandas to create a DataFrame from the records below and print the names of learners whose score is at least 80.",
        starterCode:
          "import pandas as pd\nrecords = [{'name': 'Ava', 'score': 78}, {'name': 'Bo', 'score': 83}, {'name': 'Cy', 'score': 91}]\n# write your code here\n",
        solutionCode:
          "import pandas as pd\nrecords = [{'name': 'Ava', 'score': 78}, {'name': 'Bo', 'score': 83}, {'name': 'Cy', 'score': 91}]\ndf = pd.DataFrame(records)\nfor name in df.loc[df['score'] >= 80, 'name']:\n    print(name)\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == 'Bo\\nCy', 'Expected the passing learners to print one per line.'\n__grade_result__ = {'passed': True, 'message': 'You filtered the DataFrame correctly.'}\n",
        packages: ["pandas"],
        rubric: ["Constructs a DataFrame", "Filters rows by a numeric rule"]
      })
    ]
  }),
  createConcept({
    id: "visualization_storytelling",
    title: "Visualization and data storytelling",
    summary:
      "Match chart types to analytical questions and communicate the real signal without misleading scales or clutter.",
    tags: ["visualization", "matplotlib", "communication"],
    prerequisites: ["dataframes_and_cleaning", "sampling_inference_hypothesis"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Visualizing Data", "Reporting Results"]
      },
      {
        bookId: "python_crash_course",
        keywords: ["Generating Data", "Downloading Data", "Working with APIs"]
      },
      {
        bookId: "mit_python",
        keywords: ["PLOTTING AND MORE ABOUT CLASSES", "RANDOM WALKS AND MORE ABOUT DATA VISUALIZATION"]
      }
    ],
    items: [
      flashcard({
        id: "chart-choice",
        prompt: "When is a scatter plot a better choice than a bar chart?",
        answer:
          "Use a scatter plot when you want to inspect the relationship between two numeric variables rather than compare a few category totals.",
        hints: ["Think variable types and relationships."]
      }),
      mcq({
        id: "misleading-axis",
        prompt: "Which choice is most likely to mislead a reader?",
        choices: [
          { id: "a", label: "Truncating an axis without clearly signaling the break." },
          { id: "b", label: "Labeling both axes clearly." },
          { id: "c", label: "Choosing a chart title that names the takeaway." },
          { id: "d", label: "Explaining the unit of measurement." }
        ],
        correctChoiceId: "a",
        hints: ["Look for the choice that distorts magnitude perception."],
        explanation:
          "Truncated axes can exaggerate apparent differences, especially when the break is not made explicit."
      }),
      shortAnswer({
        id: "annotation-value",
        prompt: "Why are annotations often useful on a chart?",
        acceptedAnswers: [
          "highlight important points",
          "guide interpretation",
          "explain unusual patterns"
        ],
        hints: ["Think attention and context."],
        explanation:
          "Annotations help the reader focus on the important event, outlier, or pattern instead of guessing what matters."
      }),
      codeExercise({
        id: "line-plot",
        prompt:
          "Create a line chart of the monthly values below using matplotlib and title it `Monthly Active Users`.",
        starterCode:
          "import matplotlib.pyplot as plt\nmonths = ['Jan', 'Feb', 'Mar']\nvalues = [120, 135, 150]\n# create the plot here\n",
        solutionCode:
          "import matplotlib.pyplot as plt\nmonths = ['Jan', 'Feb', 'Mar']\nvalues = [120, 135, 150]\nplt.plot(months, values)\nplt.title('Monthly Active Users')\nplt.xlabel('Month')\nplt.ylabel('Users')\nplt.gcf()\n",
        tests:
          "import matplotlib.pyplot as plt\nns = {}\nexec(user_code, ns)\nfig = plt.gcf()\nax = fig.axes[0]\nassert ax.get_title() == 'Monthly Active Users'\nassert len(ax.lines) == 1\n__grade_result__ = {'passed': True, 'message': 'Your chart has the expected title and a single line.'}\n",
        packages: ["matplotlib"],
        rubric: ["Creates a line plot", "Adds the required title"]
      })
    ]
  })
];
