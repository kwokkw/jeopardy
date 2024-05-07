// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds(cat) {
  // Get a bunch of cat, shuffle them, then pick the first multiple things.
  let counter = cat.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = cat[counter];
    cat[counter] = cat[index];
    cat[index] = temp;
  }
  const length = 6;
  const catIds = [];
  for (let i = 0; i < length; i++) {
    catIds.push(cat[i].id);
  }
  return catIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
  const res = await axios.get(
    `https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`
  );

  const { title, clues } = res.data;
  const extractedData = clues.map((item) => ({
    question: item.question,
    answer: item.answer,
    showing: null,
  }));
  return {
    title: title,
    clues: extractedData,
  };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
  const res = await axios.get(
    "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
  );
  const ids = getCategoryIds(res.data);

  for (i = 0; i < ids.length; i++) {
    const item = await getCategory(ids[i]);
    categories.push(item);
  }

  const $headRow = $("<tr></tr>");
  for (let i = 0; i < categories.length; i++) {
    $headRow.append(`"<th>${categories[i].title}</th>"`);
  }
  $("thead").append($headRow);

  for (let i = 0; i < categories[0].clues.length; i++) {
    const $bodyRow = $("<tr></tr>");
    for (let j = 0; j < categories.length; j++) {
      const $td = $("<td>?</td>");
      $td.data("question", categories[j].clues[i].question);
      $td.data("answer", categories[j].clues[i].answer);
      $td.data("showing", categories[j].clues[i].showing);
      $bodyRow.append($td);
    }
    $("tbody").append($bodyRow);
  }

  $("tbody").on("click", "td", handleClick);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
  if ($(this).data("showing") === "answer") {
    return;
  } else if ($(this).data("showing") === "question") {
    $(this).html($(this).data("answer"));
    $(this).data("showing", "answer");
    $(this).css("background-color", "green");
  } else {
    $(this).html($(this).data("question"));
    $(this).data("showing", "question");
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
  const $spinner = $("<div></div>");
  $spinner.addClass("spinner");
  $("#start-btn").after($spinner);
  for (let i = 0; i < 7; i++) {
    $spinner.append("<div></div>");
  }

  $("#start-btn").text("loading...");
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
  $(".spinner").remove();
  $("#start-btn").text("restart");
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  // TODO
  showLoadingView();

  // make HTML table
  const $gameBoard = $("<table></table>");
  $gameBoard
    .attr("id", "jeopardy")
    .append($("<thead></thead>"))
    .append($("<tbody></tbody>"));

  $(".spinner").after($gameBoard);

  // TODO
  await fillTable();

  // TODO
  hideLoadingView();
}

/** On click of start / restart button, set up game. */
// TODO
$("#start-btn").on("click", setupAndStart);

// $(document).ready(function () {
//   /** On page load, add event handler for clicking clues */
//   // TODO
//   $("tbody").on("click", "td", function (e) {
//     console.log("clicked");
//   });
// });
