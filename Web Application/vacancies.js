fetch("http://127.0.0.1:5500/jobs.json")
  .then((response) => response.json())
  .then((data) => {
    const titleContainer = document.getElementById("titleContainer");
    let limiter = 0;
    data.forEach((item) => {
      limiter++;
      console.log(limiter);
      if (limiter < 10) {
        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = `<h3 data-id="${item.id}" class="title-head">${item.title}</h3>`;

        const detailDiv = document.createElement("div");
        detailDiv.setAttribute("data-id", item.id);
        detailDiv.setAttribute("class", "job-info");
        detailDiv.style.display = "none";
        detailDiv.innerHTML = `
                    <p>Company: ${item.company}</p>
                    <p>${item.summary}</p>
                    <p class="location">Location: ${item.location.location}</p>
                    <a href="${item.link}"><button class="view-post">View Posting</button></a>
                `;

        titleDiv.addEventListener("click", () => {
          const detailContent = document.querySelector(
            `div[data-id="${item.id}"]`
          );
          if (detailContent.style.display === "none") {
            detailContent.style.display = "block";
          } else {
            detailContent.style.display = "none";
          }
        });

        titleContainer.appendChild(titleDiv);
        titleContainer.appendChild(detailDiv);
      } else {
        return;
      }
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });

function searchVacancies() {
  // Get the search input value
  const keywords = document.getElementById("searchInput").value.trim();

  if (keywords !== "") {
    // Construct the API endpoint URL with the search query
    const apiUrl = `https://api.lmiforall.org.uk/api/v1/vacancies/search?keywords=${encodeURIComponent(
      keywords
    )}`;

    // Make an AJAX request
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data and display it in the result area
        displayResults(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}
let getTitle = "";
function displayResults(data) {
  const keywords = document.getElementById("searchInput").value.trim();
  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = ""; // Clear previous results

  // Check if there are any vacancies
  if (data.length === 0) {
    resultArea.innerHTML = "No vacancies found";
    return;
  }

  const titleDiv1 = document.createElement("div");
  titleDiv1.innerHTML = `<h3 class="show-vacancies">Showing search result of <span class="jobTitleDisplay">${keywords}</span></h3>`;

  resultArea.appendChild(titleDiv1);
  let counter = 0;
  data.forEach((item) => {
    if (counter < 10) {
      const titleDiv = document.createElement("div");
      titleDiv.innerHTML = `<h3 data-id="${item.id}" class="title-head"  onclick="getTasks('${item.title}_${item.id}_${item.link}')">${item.title}</h3><div id="${item.id}_su"></div>`;

      const detailDiv = document.createElement("div");
      detailDiv.setAttribute("data-id", item.id);
      detailDiv.setAttribute("class", "job-info");
      detailDiv.style.display = "none";
      detailDiv.innerHTML = `
                    <p>Company: ${item.company}</p>
                    <p>${item.summary}</p>
                    <p class="location">Location: ${item.location.location}</p>
                    <div id="${item.id}_su"></div>
                `;

      // titleDiv.addEventListener("click", () => {
      //   getTitle = item.title;
      //   const detailContent = document.querySelector(
      //     `div[data-id="${item.id}"]`
      //   );
      //   if (detailContent.style.display === "none") {
      //     detailContent.style.display = "block";
      //   } else {
      //     detailContent.style.display = "none";
      //   }
      // });

      resultArea.appendChild(titleDiv);
      // resultArea.appendChild(detailDiv);
      counter++;
    } else {
      // Break the loop when the counter reaches 10
      return;
    }
  });
}

let toggleState = false;

function getTasks(data) {
  let [title, id, link] = data.split("_");
  const divId = `${id}_su`; // Get the id of the div
  const divElement = document.getElementById(divId);
  toggleState = !toggleState;
  console.log(title, id);

  const apiUrl = `https://api.lmiforall.org.uk/api/v1/soc/search?q=${encodeURIComponent(
    title
  )}`;

  document.getElementById(`${id}_su`).style.display = "";
  if (toggleState) {
    const newDiv2 = document.createElement("div");

    const content = `
        <a href="${link}"><button class="view-post">View Posting</button></a>
    `;
    newDiv2.innerHTML = content;
    divElement.appendChild(newDiv2);
    // Make an AJAX request
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data and display it in the result area
        // displayResults(data);
        console.log(data);
        data.forEach((items) => {
          console.log(items);
          console.log(items.description);

          // Create the HTML content for each item
          const content = `
                    <div class="soc">
                        <p class="desc"><span>Title:</span> ${items.title}</p>
                        <p class="desc"><span>Description:</span> ${items.description}</p>
                        <p class="task"><span>Tasks:</span> ${items.tasks}</p>    
                    </div>
                `;

          // Create a new div element to hold the content
          const newDiv = document.createElement("div");
          newDiv.innerHTML = content;

          // Find the div element by id

          // Check if the div element exists
          if (divElement) {
            // Append the new div with content to the existing div
            divElement.appendChild(newDiv);
          } else {
            console.error(`Div element with id '${divId}' not found.`);
          }
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  } else {
    document.getElementById(`${id}_su`).innerHTML = "";
    document.getElementById(`${id}_su`).style.display = "none";
  }
}
