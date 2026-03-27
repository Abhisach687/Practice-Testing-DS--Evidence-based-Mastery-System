import pythonBasics from "./python-basics.mjs";
import pythonCrashCourse from "./python-crash-course.mjs";
import mitPython from "./mit-python.mjs";
import principlesDataScience from "./principles-data-science.mjs";

export const books = [
  pythonBasics,
  pythonCrashCourse,
  mitPython,
  principlesDataScience
];

export const booksById = Object.fromEntries(books.map((book) => [book.id, book]));
