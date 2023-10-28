const progressBar = document.querySelector(".CircularProgressbar-path");
const countdownElement = document.querySelector(".countdown");
let countdownInterval;

function updateProgress() {
  progressBar.style.transition = "none";
  progressBar.style.strokeDashoffset = "0";

  setTimeout(() => {
    progressBar.style.transition = "stroke-dashoffset 60s linear";
    progressBar.style.strokeDashoffset = "289.027px";
  }, 10);

  let countdown = 60;
  countdownElement.textContent = countdown;

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      setTimeout(() => {
        progressBar.style.transition = "none";
        progressBar.style.strokeDashoffset = "0";
      }, 10);
    }
  }, 1000);
}

async function fetchData() {
  try {
    const response = await fetch("/api/tickers");
    const data = await response.json();

    const tableBody = document.getElementById("cryptoTable");
    const selectElement = document.getElementById("cryptoSelector2");

    tableBody.innerHTML = "";
    selectElement.innerHTML = "";

    let rowNumber = 1;

    const firstCrypto = data[0];

    document.getElementById("tickerName").textContent = firstCrypto.name;
    document.getElementById("sellPrice").textContent = firstCrypto.sell;
    document.getElementById("lastPrice").textContent = firstCrypto.last;
    document.getElementById("baseUnit").textContent = firstCrypto.base_unit;
    document.getElementById("volume").textContent = firstCrypto.volume;
    document.getElementById("buyPrice").textContent = firstCrypto.buy;

    data.forEach((crypto) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${rowNumber}</td>
              <td>${crypto.name}</td>
              <td> ₹ ${formatValue(crypto.last)}</td>
              <td class="${"green-text"}"> ₹ ${formatValue(crypto.buy)}</td>
              <td class="${"red-text"}"> ₹ ${formatValue(crypto.sell)}</td>
              <td> ₹ ${crypto.volume}</td>
              <td>${crypto.base_unit}</td>
          `;
      tableBody.appendChild(row);

      const option = document.createElement("option");
      option.value = crypto.base_unit;
      option.textContent = crypto.base_unit;
      selectElement.appendChild(option);

      rowNumber++;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function formatValue(value) {
  if (Math.abs(value) < 0.0000001) {
    return value.toFixed(10);
  } else {
    return value.toFixed(7);
  }
}

function updateProgressAndFetchData() {
  updateProgress();
  fetchData();
}

updateProgressAndFetchData();

setInterval(updateProgressAndFetchData, 60000);

window.addEventListener("load", fetchData);

const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

function enableDarkMode() {
  body.classList.add("dark-mode");
  localStorage.setItem("darkMode", "true");
}

function disableDarkMode() {
  body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", "false");
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

const isDarkMode = localStorage.getItem("darkMode") === "true";

if (isDarkMode) {
  enableDarkMode();
} else {
  disableDarkMode();
}
