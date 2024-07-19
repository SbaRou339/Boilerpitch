document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "ddcaac8f1ddf45b28293a2b14d8ff03f";
  const newsList = document.getElementById("news-list");
  const headline = document.getElementById("headline");
  const saNewsButton = document.getElementById("sa-news-button");
  const usNewsButton = document.getElementById("us-news-button");
  const deNewsButton = document.getElementById("de-news-button");
  const chNewsButton = document.getElementById("ch-news-button");
  const jpNewsButton = document.getElementById("jp-news-button");
  const bitcoinLink = document.getElementById("bitcoin-link");
  const latestNewsLink = document.getElementById("latest-news-link");
  const showMoreButton = document.createElement("button");
  showMoreButton.textContent = "Show More";
  showMoreButton.classList.add(
    "p-2",
    "bg-blue-500",
    "text-white",
    "rounded",
    "shadow",
    "mt-4"
  );
  let currentPage = 1;
  const pageSize = 5;
  let currentUrl = "";
  let showImages = true;

  /**
   * Fetches news articles from the News API and displays them on the page.
   *
   * @param {string} url - The URL of the News API endpoint.
   * @param {string} title - The title of the news section.
   * @param {boolean} [append=false] - Whether to append the fetched news or replace the existing news.
   */
  const fetchNews = (url, title, append = false) => {
    currentUrl = url;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        // Clear previous news only if not appending
        if (!append) {
          newsList.innerHTML = "";
          headline.textContent = title;
        }

        const container = document.createElement("div");
        container.classList.add(
          "grid",
          "grid-cols-1",
          "md:grid-cols-2",
          "gap-4"
        );

        // Loop through each article and create a list item for it
        data.articles.forEach((article) => {
          const listItem = document.createElement("li");
          listItem.classList.add(
            "p-4",
            "border",
            "border-gray-300",
            "rounded",
            "bg-white",
            "shadow-sm"
          );

          const articleContent = `
          <h3 class="text-lg font-semibold"><a href="${article.url}" target="_blank" class="text-blue-500 hover:underline">${article.title}</a></h3>
          <p class="text-gray-700">${article.description || ""}</p>
          <p class="text-gray-500 text-sm">By ${article.author || "Unknown author"}</p>
          ${showImages ? `<img src="${article.urlToImage || ""}" alt="Article Image" class="mt-2 w-full h-auto rounded" />` : ""}
        `;

          listItem.innerHTML = articleContent;
          container.appendChild(listItem);
        });

        // Append or replace the news list on the page
        if (append) {
          newsList.appendChild(container);
        } else {
          newsList.innerHTML = "";
          newsList.appendChild(container);
        }

        // Show or hide the "Show More" button
        if (data.articles.length === pageSize) {
          newsList.appendChild(showMoreButton);
        } else {
          showMoreButton.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  saNewsButton.addEventListener("click", () => {
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?country=za&apiKey=${apiKey}`;
    showImages = false;
    fetchNews(url, "South Africa News");
  });

  usNewsButton.addEventListener("click", () => {
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    showImages = false;
    fetchNews(url, "US News");
  });

  deNewsButton.addEventListener("click", () => {
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?country=de&apiKey=${apiKey}`;
    showImages = false;
    fetchNews(url, "Germany News");
  });

  chNewsButton.addEventListener("click", () => {
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=${apiKey}`;
    showImages = false;
    fetchNews(url, "China News");
  });

  jpNewsButton.addEventListener("click", () => {
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${apiKey}`;
    showImages = false;
    fetchNews(url, "Japan News");
  });

  bitcoinLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/everything?q=bitcoin&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    showImages = true;
    fetchNews(url, "Bitcoin News");
  });

  latestNewsLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    currentPage = 1; // Reset current page for new fetch
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`;
    showImages = true;
    fetchNews(url, "Latest News (BBC)");
  });

  showMoreButton.addEventListener("click", () => {
    currentPage++;
    const url = `${currentUrl}&page=${currentPage}`;
    fetchNews(url, headline.textContent, true);
  });

  // Initial fetch for Bitcoin News on page load
  const url = `https://newsapi.org/v2/everything?q=bitcoin&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
  fetchNews(url, "Bitcoin News");
});
