document.getElementById("payForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get form values
  const jobTitle = document.getElementById("jobTitle").value;

  const selectedOption = document.getElementById("jobTitle").value;
  //   const jobTitleId = selectedOption.getAttribute("id");
  const wages = parseFloat(document.getElementById("wage").value);
  const timeUnit = document.getElementById("time").value;
  const hours = parseInt(document.getElementById("hours").value);

  // Perform calculation
  const wageComputed = calculateWage(wages, timeUnit, hours);

  // Display result
  displayResult(jobTitle, wages, timeUnit, hours, wageComputed);
});

function calculateWage(wages, timeUnit, hours) {
  let wageComputed;
  switch (timeUnit) {
    case "year":
      wageComputed = wages / 52 / hours; // Assuming 52 weeks in a year
      break;
    case "month":
      wageComputed = wages / 4 / hours; // Assuming 4 weeks in a month
      break;
    case "week":
      wageComputed = wages / hours;
      break;
    case "hour":
      wageComputed = wages * hours;
      break;
    default:
      wageComputed = 0;
  }
  return wageComputed.toFixed(2);
}

function displayResult(
  jobTitle,
  //   jobTitleId,
  wages,
  timeUnit,
  hours,
  wageComputed
) {
  const resultSection = document.getElementById("resultSection");
  const resultDiv = document.getElementById("result");

  // Prepare result message
  const resultMessage = `
           <div class="main-result">
                <a href="vacancies.html" target="_blank"><p class="remove-bold">Job <span style="font-weight:bold;">${jobTitle}</span></p></a>
                <p class="remove-bold">Working <span style="font-weight:bold;"> ${hours}</span> hours a week for <span style="font-weight:bold;">${wages}</span> per <span style="font-weight:bold;"> ${timeUnit}</span> breaks down into:</p>

                <table>
                  <tr>
                      <td class="adim">£${parseFloat(wageComputed).toFixed(
                        2
                      )}</td>
                      <td>per hour</td>
                  </tr>

                  <tr>
                      <td class="adim">£${(
                        parseFloat(wageComputed) * hours
                      ).toFixed(2)}</td>
                      <td>per week</td>
                  </tr>

                  <tr>
                      <td class="adim">£${(
                        parseFloat(wageComputed) *
                        hours *
                        4
                      ).toFixed(2)}</td>
                      <td>per month</td>
                  </tr>
                  
                  <tr>
                      <td class="adim">£${(
                        parseFloat(wageComputed) *
                        hours *
                        52
                      ).toFixed(2)}</td>
                      <td>per year</td>
                  </tr>
              </table>


            </div>
        `;

  // Append result message to result section
  resultDiv.innerHTML += resultMessage;

  // Show result section
  resultSection.style.display = "block";
}

fetch("jobs.json")
  .then((response) => response.json())
  .then((data) => {
    // Process the data and create the select options
    createSelectOptions(data);
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });

function createSelectOptions(data) {
  const selectElement = document.getElementById("jobTitle");

  // Clear any existing options
  selectElement.innerHTML = "";

  // Create a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select an option";
  selectElement.add(defaultOption);

  // Create options from the data
  data.forEach((item) => {
    const option = document.createElement("option");
    option.id = item.id;
    option.value = item.title;
    option.text = item.title;
    selectElement.add(option);
  });
}
