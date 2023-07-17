const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");
const countryContainer = document.querySelector(".country-container");

// Available options
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "Politics",
  "Business",
  "Education"
];

let country = "in"; // Default country
let requestURL;

// Create cards from data
const generateUI = (articles) => {
  for (let item of articles) {
    let card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `<div class="news-image-container">
      <img src="${
        item.urlToImage ||
        "https://png.pngtree.com/png-vector/20191127/ourmid/pngtree-error-page-not-found-concept-illustration-flat-design-with-people-this-png-image_2038499.jpg"
      }" alt="" />
    </div>
    <div class="news-content">
      <div class="news-title">${item.title}</div>
      <div>
        Published At - ${item.publishedAt}<br/>
        Author - ${item.author}<br/>
        Source - ${item.source.name}
      </div>
      <div class="news-description">
        ${item.description || item.content || ""}
      </div>
      <a href="${item.url}" target="_blank" class="view-button">Read More</a>
    </div>`;
    container.appendChild(card);
  }
};

// News API Call
const getNews = async () => {
  container.innerHTML = "";
  let response = await fetch(requestURL);
  if (!response.ok) {
    alert("Data unavailable at the moment. Please try again later");
    return false;
  }
  let data = await response.json();
  generateUI(data.articles);
};

// Category Selection
const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  e.target.classList.add("active");
  getNews();
};

// Options Buttons
const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${
      i == "general" ? "active" : ""
    }" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

// Country Selection
const selectCountry = (e) => {
  country = e.target.value;
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${apiKey}`;
  getNews();
};

// Fetch all countries from News API
const fetchCountries = async () => {
  const url = `https://newsapi.org/v2/sources?apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const uniqueCountries = Array.from(new Set(data.sources.map((source) => source.country)));
  return uniqueCountries;
};
const fetchCountryName = async (countryCode) => {
  const url = `https://restcountries.com/v2/alpha/${countryCode}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.name;
};
// Display country options
const displayCountryOptions = async () => {
  const selectElement = document.createElement("select");
  selectElement.addEventListener("change", selectCountry);

  const countries = await fetchCountries();
  countries.forEach(async (countryCode) => {
    const countryName = await fetchCountryName(countryCode);
    const optionElement = document.createElement("option");
    optionElement.value = countryCode;
    optionElement.textContent = countryName;
    selectElement.appendChild(optionElement);
  });

  const countryWrapper = document.createElement("div");
  countryWrapper.classList.add("country-wrapper");
  countryWrapper.appendChild(selectElement);

  countryContainer.appendChild(countryWrapper);
};



// Initialize the app
const init = () => {
  optionsContainer.innerHTML = "";
  getNews();
  createOptions();
};

// On window load
window.onload = () => {
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${apiKey}`;
  init();
  displayCountryOptions();
};
