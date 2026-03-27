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
    id: "regression_and_model_validation",
    title: "Regression and model validation",
    summary:
      "Fit predictive relationships carefully, separate signal from overfitting, and validate models on data they have not already seen.",
    tags: ["regression", "validation", "modeling"],
    prerequisites: ["dataframes_and_cleaning", "sampling_inference_hypothesis"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: [
          "Regression Analysis",
          "Validating Your Model",
          "Machine Learning in Regression Analysis"
        ]
      }
    ],
    items: [
      flashcard({
        id: "train-test-split",
        prompt: "Why do we keep training data separate from test data?",
        answer:
          "So we can estimate how well the model generalizes to unseen data instead of only measuring how well it memorized the training set.",
        hints: ["Think honest evaluation."]
      }),
      mcq({
        id: "overfitting-signal",
        prompt: "Which pattern most strongly suggests overfitting?",
        choices: [
          {
            id: "a",
            label: "Very low training error but much worse validation error."
          },
          { id: "b", label: "Both training and validation error are high." },
          { id: "c", label: "The dataset contains column names." },
          { id: "d", label: "The target variable is numeric." }
        ],
        correctChoiceId: "a",
        hints: ["Look for memorization without generalization."],
        explanation:
          "Overfitting often appears when a model fits the training set extremely well but fails to transfer to held-out data."
      }),
      shortAnswer({
        id: "residual-meaning",
        prompt: "What is a residual in regression?",
        acceptedAnswers: [
          "actual minus predicted",
          "prediction error for one observation",
          "difference between observed and predicted"
        ],
        hints: ["Think one-point error, not overall loss."],
        explanation:
          "A residual is the difference between the observed outcome and the model's predicted outcome for a single case."
      }),
      codeExercise({
        id: "simple-linreg",
        prompt:
          "Use scikit-learn to fit a linear regression model on the small dataset below and print the prediction for `x = 6` rounded to one decimal place.",
        starterCode:
          "from sklearn.linear_model import LinearRegression\nX = [[1], [2], [3], [4], [5]]\ny = [2, 4, 6, 8, 10]\n# fit the model and print the prediction for 6\n",
        solutionCode:
          "from sklearn.linear_model import LinearRegression\nX = [[1], [2], [3], [4], [5]]\ny = [2, 4, 6, 8, 10]\nmodel = LinearRegression()\nmodel.fit(X, y)\nprediction = model.predict([[6]])[0]\nprint(round(prediction, 1))\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == '12.0', 'Expected the linear trend to predict 12.0 for x = 6.'\n__grade_result__ = {'passed': True, 'message': 'Your regression pipeline predicts the linear trend correctly.'}\n",
        packages: ["scikit-learn"],
        rubric: ["Fits before predicting", "Uses the trained model for inference"]
      })
    ]
  }),
  createConcept({
    id: "time_series_forecasting",
    title: "Time series and forecasting",
    summary:
      "Respect ordering in time-dependent data, separate trend from noise, and evaluate forecasts against appropriate baselines.",
    tags: ["time-series", "forecasting", "evaluation"],
    prerequisites: ["regression_and_model_validation"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Time Series and Forecasting", "Forecast Evaluation Methods"]
      }
    ],
    items: [
      flashcard({
        id: "time-order-matters",
        prompt: "Why should time series splits respect chronological order?",
        answer:
          "Because future values should not leak into model training when you are trying to predict those future values.",
        hints: ["Think leakage from the future."]
      }),
      shortAnswer({
        id: "seasonality",
        prompt: "What does seasonality mean in a time series?",
        acceptedAnswers: [
          "repeating pattern over a fixed period",
          "regular cycle",
          "periodic structure"
        ],
        hints: ["Think recurring structure, not one-time trend."],
        explanation:
          "Seasonality is a predictable repeating pattern tied to a fixed interval such as day, week, month, or year."
      }),
      mcq({
        id: "forecast-baseline",
        prompt:
          "What is the main reason to compare a forecasting model against a simple baseline such as `last value`?",
        choices: [
          { id: "a", label: "To verify that the complex model actually adds value." },
          { id: "b", label: "Because baselines are always optimal." },
          { id: "c", label: "To avoid using any evaluation metric." },
          { id: "d", label: "Because time series never contain noise." }
        ],
        correctChoiceId: "a",
        hints: ["A fancy model should beat something simple."],
        explanation:
          "If a complex model cannot beat a strong simple baseline, the extra complexity is usually not justified."
      }),
      codeExercise({
        id: "naive-forecast",
        prompt:
          "Write a function `naive_forecast(series)` that returns a list containing the last observed value repeated once for the next step.",
        starterCode: "# define naive_forecast here\n",
        solutionCode:
          "def naive_forecast(series):\n    return [series[-1]]\n",
        tests:
          "ns = {}\nexec(user_code, ns)\nassert ns['naive_forecast']([3, 5, 7]) == [7]\nassert ns['naive_forecast']([10]) == [10]\n__grade_result__ = {'passed': True, 'message': 'Your naive forecast returns the last observed value.'}\n",
        rubric: ["Uses the last observation", "Returns a forecast container"]
      })
    ]
  }),
  createConcept({
    id: "machine_learning_classification",
    title: "Machine learning classification",
    summary:
      "Train classifiers, interpret confusion-matrix tradeoffs, and choose metrics that match the real cost of mistakes.",
    tags: ["machine-learning", "classification", "metrics"],
    prerequisites: ["regression_and_model_validation"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["What Is Machine Learning?", "Classification Using Machine Learning"]
      },
      {
        bookId: "mit_python",
        keywords: ["A QUICK LOOK AT MACHINE LEARNING", "CLASSIFICATION METHODS"]
      }
    ],
    items: [
      flashcard({
        id: "precision-vs-recall",
        prompt: "What is the core difference between precision and recall?",
        answer:
          "Precision focuses on how many predicted positives are correct, while recall focuses on how many actual positives were found.",
        hints: ["Predicted positives versus actual positives."]
      }),
      mcq({
        id: "confusion-matrix",
        prompt: "Which metric becomes especially important when missing a real positive case is costly?",
        choices: [
          { id: "a", label: "Recall" },
          { id: "b", label: "Precision only because it is always best" },
          { id: "c", label: "Accuracy regardless of class balance" },
          { id: "d", label: "The chart title" }
        ],
        correctChoiceId: "a",
        hints: ["Think false negatives."],
        explanation:
          "When missing real positives is expensive, recall matters because it tracks how many positives you successfully catch."
      }),
      shortAnswer({
        id: "class-imbalance",
        prompt: "Why can accuracy be misleading on an imbalanced dataset?",
        acceptedAnswers: [
          "majority class can dominate",
          "a trivial model can look good",
          "rare class gets ignored"
        ],
        hints: ["Imagine 99% negatives and 1% positives."],
        explanation:
          "A model can achieve high accuracy by predicting only the majority class while completely failing on the minority class."
      }),
      codeExercise({
        id: "logistic-regression",
        prompt:
          "Fit a logistic regression classifier on the tiny dataset below and print the prediction for `[3]`.",
        starterCode:
          "from sklearn.linear_model import LogisticRegression\nX = [[0], [1], [2], [4], [5]]\ny = [0, 0, 0, 1, 1]\n# fit and print the prediction for [3]\n",
        solutionCode:
          "from sklearn.linear_model import LogisticRegression\nX = [[0], [1], [2], [4], [5]]\ny = [0, 0, 0, 1, 1]\nmodel = LogisticRegression().fit(X, y)\nprint(int(model.predict([[3]])[0]))\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() in {'0', '1'}, 'Prediction should be a class label.'\n__grade_result__ = {'passed': True, 'message': 'Your classifier trains and predicts successfully.'}\n",
        packages: ["scikit-learn"],
        rubric: ["Creates a classifier", "Fits before predicting"]
      })
    ]
  }),
  createConcept({
    id: "clustering_and_unsupervised",
    title: "Clustering and unsupervised learning",
    summary:
      "Group similar observations without labels and stay skeptical about whether the discovered groups are meaningful or artifacts.",
    tags: ["machine-learning", "clustering", "unsupervised"],
    prerequisites: ["dataframes_and_cleaning"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Other Machine Learning Techniques", "Classification Using Machine Learning"]
      },
      {
        bookId: "mit_python",
        keywords: ["CLUSTERING"]
      }
    ],
    items: [
      flashcard({
        id: "unsupervised-definition",
        prompt: "What makes clustering an unsupervised learning task?",
        answer:
          "The algorithm is not given target labels and must organize the observations using patterns in the inputs alone.",
        hints: ["No ground-truth class column."]
      }),
      shortAnswer({
        id: "kmeans-caveat",
        prompt: "Why should you be cautious when interpreting clusters from k-means?",
        acceptedAnswers: [
          "clusters may be imposed by the algorithm",
          "depends on k and scaling",
          "not proof of real groups"
        ],
        hints: ["Think modeling assumption versus reality."],
        explanation:
          "K-means will always partition the data, but that does not guarantee the clusters represent real underlying categories."
      }),
      codeExercise({
        id: "kmeans-fit",
        prompt:
          "Fit a 2-cluster k-means model to the points below and print the number of cluster centers.",
        starterCode:
          "from sklearn.cluster import KMeans\nX = [[0, 0], [0, 1], [4, 4], [4, 5]]\n# fit a two-cluster model and print how many centers it learned\n",
        solutionCode:
          "from sklearn.cluster import KMeans\nX = [[0, 0], [0, 1], [4, 4], [4, 5]]\nmodel = KMeans(n_clusters=2, random_state=0, n_init='auto').fit(X)\nprint(len(model.cluster_centers_))\n",
        tests:
          "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(user_code, {})\nassert buf.getvalue().strip() == '2', 'The fitted model should report two centers.'\n__grade_result__ = {'passed': True, 'message': 'Your clustering model fit the requested number of clusters.'}\n",
        packages: ["scikit-learn"],
        rubric: ["Creates a KMeans model", "Fits to the provided points"]
      }),
      projectCheckpoint({
        id: "cluster-audit",
        prompt:
          "After generating clusters for customers, what would you inspect before turning them into a business policy?",
        checklist: [
          "Check whether the clusters are stable under scaling or random seed changes.",
          "Inspect whether the features encode bias or proxies for protected traits.",
          "Confirm that the segments support a useful action."
        ],
        reflection:
          "A cluster is only valuable when it is stable, understandable, and connected to a responsible downstream decision."
      })
    ]
  }),
  createConcept({
    id: "deep_learning_and_ai_foundations",
    title: "Deep learning and AI foundations",
    summary:
      "Understand neural-network building blocks and keep the emphasis on what the model is optimizing, not on memorizing buzzwords.",
    tags: ["deep-learning", "ai", "neural-networks"],
    prerequisites: ["machine_learning_classification"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Deep Learning and AI Basics", "Introduction to Neural Networks", "Backpropagation"]
      }
    ],
    items: [
      flashcard({
        id: "layer-intuition",
        prompt: "In simple terms, what does a hidden layer do in a neural network?",
        answer:
          "It learns intermediate representations that help transform raw inputs into features useful for the final prediction.",
        hints: ["Think useful internal features."]
      }),
      mcq({
        id: "epoch-meaning",
        prompt: "What is one training epoch?",
        choices: [
          { id: "a", label: "One full pass through the training data." },
          { id: "b", label: "A single neuron in the output layer." },
          { id: "c", label: "The validation metric after deployment." },
          { id: "d", label: "A clustering hyperparameter." }
        ],
        correctChoiceId: "a",
        hints: ["Think dataset exposure, not model architecture."],
        explanation:
          "An epoch is one complete pass through the training dataset during optimization."
      }),
      shortAnswer({
        id: "loss-function",
        prompt: "Why does a model need a loss function during training?",
        acceptedAnswers: [
          "to measure how wrong predictions are",
          "objective for optimization",
          "guides parameter updates"
        ],
        hints: ["Training needs a target to minimize."],
        explanation:
          "The loss function quantifies prediction error so the optimization process knows how to adjust the parameters."
      }),
      projectCheckpoint({
        id: "ai-use-case-check",
        prompt:
          "Before choosing a deep learning approach, what questions should you ask about the problem and the data?",
        checklist: [
          "Do I have enough labeled data for this task?",
          "Is a simpler baseline good enough?",
          "Can I explain, validate, and monitor the system responsibly?"
        ],
        reflection:
          "Deep learning should be chosen because the problem demands it, not because it sounds more advanced."
      })
    ]
  }),
  createConcept({
    id: "data_ethics_and_reporting",
    title: "Data ethics and reporting",
    summary:
      "Treat privacy, fairness, transparency, and communication quality as part of the analysis itself rather than as polish added at the end.",
    tags: ["ethics", "reporting", "communication", "fairness"],
    prerequisites: ["visualization_storytelling", "machine_learning_classification"],
    sourceAnchors: [
      {
        bookId: "principles_data_science",
        keywords: ["Ethics Throughout the Data Science Cycle", "Reporting Results"]
      }
    ],
    items: [
      flashcard({
        id: "ethics-cycle",
        prompt: "Why should ethics be considered across the whole data science cycle instead of only at deployment?",
        answer:
          "Bias, privacy loss, and misuse can enter during collection, cleaning, modeling, visualization, and reporting, so waiting until the end is too late.",
        hints: ["Think lifecycle, not final checkpoint."]
      }),
      mcq({
        id: "reporting-best-practice",
        prompt: "Which reporting habit most improves trust?",
        choices: [
          { id: "a", label: "State assumptions, limitations, and uncertainty clearly." },
          { id: "b", label: "Hide weak results to keep the story cleaner." },
          { id: "c", label: "Report only one metric with no context." },
          { id: "d", label: "Avoid documenting data provenance." }
        ],
        correctChoiceId: "a",
        hints: ["Trust grows when caveats are visible."],
        explanation:
          "Transparent reporting includes assumptions, uncertainty, limitations, and provenance so others can judge the work responsibly."
      }),
      shortAnswer({
        id: "fairness-question",
        prompt: "Name one fairness question you should ask before deploying a model.",
        acceptedAnswers: [
          "who is harmed by errors",
          "does performance differ across groups",
          "are there biased proxies"
        ],
        hints: ["Think uneven impact across groups."],
        explanation:
          "A useful fairness check asks whether errors or benefits are distributed unevenly across meaningful groups."
      }),
      projectCheckpoint({
        id: "executive-summary",
        prompt:
          "Imagine you must brief a non-technical stakeholder on an analysis. What belongs in a strong executive summary?",
        checklist: [
          "The main finding and the action it supports.",
          "The uncertainty or risk around that finding.",
          "What data and methods shaped the result.",
          "What should happen next."
        ],
        reflection:
          "A strong summary is brief, decision-oriented, and honest about limitations."
      })
    ]
  }),
  createConcept({
    id: "pcc_game_architecture",
    title: "Project capstone: interactive game architecture",
    summary:
      "Use the arcade-game chapters as a systems-design capstone for loops, state updates, events, classes, and progressive refactoring.",
    tags: ["capstone", "projects", "architecture", "python-crash-course"],
    prerequisites: ["objects_and_classes", "conditionals_and_loops"],
    sourceAnchors: [
      {
        bookId: "python_crash_course",
        keywords: ["A Ship That Fires Bullets", "Aliens!", "Scoring"]
      }
    ],
    items: [
      flashcard({
        id: "game-loop",
        prompt: "What does a game loop repeatedly do?",
        answer:
          "It processes input, updates the game state, and redraws the scene over and over until the program ends.",
        hints: ["Input, update, render."]
      }),
      shortAnswer({
        id: "state-separation",
        prompt: "Why is it helpful to separate rendering code from state-update code in a game project?",
        acceptedAnswers: [
          "easier to reason about",
          "cleaner architecture",
          "separates responsibilities"
        ],
        hints: ["Think maintenance and debugging."],
        explanation:
          "Separating update and rendering responsibilities makes the code easier to debug, test, and extend."
      }),
      projectCheckpoint({
        id: "game-retro",
        prompt:
          "If you were planning the arcade project from scratch, what subsystems would you define first?",
        checklist: [
          "Input handling and event dispatch.",
          "World state: player, enemies, bullets, score.",
          "Update rules for movement and collisions.",
          "Rendering and feedback."
        ],
        reflection:
          "Thinking in subsystems helps a toy project scale into a maintainable architecture."
      })
    ]
  }),
  createConcept({
    id: "pcc_data_visualization_projects",
    title: "Project capstone: data visualization workflows",
    summary:
      "Treat the project chapters on generated data, downloads, and APIs as a workflow for moving from raw inputs to meaningful visual output.",
    tags: ["capstone", "projects", "visualization", "apis"],
    prerequisites: ["visualization_storytelling", "dataframes_and_cleaning"],
    sourceAnchors: [
      {
        bookId: "python_crash_course",
        keywords: ["Generating Data", "Downloading Data", "Working with APIs"]
      }
    ],
    items: [
      flashcard({
        id: "workflow-order",
        prompt: "What is the usual order from raw external data to a publishable chart?",
        answer:
          "Acquire the data, inspect it, clean or reshape it, choose the right visual encoding, then annotate the takeaway.",
        hints: ["Think pipeline, not one command."]
      }),
      shortAnswer({
        id: "api-risk",
        prompt: "What is one reason API data needs extra validation before charting it?",
        acceptedAnswers: [
          "schema may change",
          "missing fields",
          "unexpected values"
        ],
        hints: ["External data can drift."],
        explanation:
          "API payloads can change or contain missing and malformed values, so validation prevents silent downstream errors."
      }),
      projectCheckpoint({
        id: "viz-project-brief",
        prompt:
          "Outline a mini project that uses downloaded data to answer one concrete question with a chart.",
        checklist: [
          "Name the question.",
          "State the data source.",
          "Describe the cleaning step.",
          "Choose the chart and why it fits."
        ],
        reflection:
          "A good project brief ties the data source, analysis step, and visual output to one focused question."
      })
    ]
  }),
  createConcept({
    id: "pcc_web_app_workflow",
    title: "Project capstone: web app workflow",
    summary:
      "Use the Django project arc as a capstone for user-centered features, data ownership, styling, and deployment thinking.",
    tags: ["capstone", "web", "deployment", "product-thinking"],
    prerequisites: ["files_and_exceptions", "data_ethics_and_reporting"],
    sourceAnchors: [
      {
        bookId: "python_crash_course",
        keywords: [
          "Getting Started with Django",
          "User Accounts",
          "Styling and Deploying an App"
        ]
      }
    ],
    items: [
      flashcard({
        id: "app-loop",
        prompt: "What are the main layers in a simple web app workflow?",
        answer:
          "Routes or views receive requests, application logic handles the task, data is stored or retrieved, and templates or components render the response.",
        hints: ["Request, logic, data, response."]
      }),
      shortAnswer({
        id: "user-data-ownership",
        prompt: "Why is user-data ownership a design concern, not just a database concern?",
        acceptedAnswers: [
          "permissions affect the whole product flow",
          "users should only access their own data",
          "authorization shapes the interface"
        ],
        hints: ["Think product behavior, not just storage."],
        explanation:
          "Ownership affects routing, visibility, permissions, and trust throughout the user experience."
      }),
      projectCheckpoint({
        id: "deployment-checklist",
        prompt:
          "Before deploying a small learning app, what should be checked besides whether it runs on your laptop?",
        checklist: [
          "Error handling and useful logs.",
          "Environment configuration and secrets management.",
          "User-facing performance and accessibility.",
          "Backup or restore strategy for important data."
        ],
        reflection:
          "Deployment quality depends on operability, not just whether the first page loads."
      })
    ]
  })
];
