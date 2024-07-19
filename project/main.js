document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "ddcaac8f1ddf45b28293a2b14d8ff03f";
    const newsList = document.getElementById("news-list");
    const headline = document.getElementById("headline");
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
    const pageSize = 6;
    let currentUrl = "";
    let showImages = true;

    const countries = [
        "ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu",
        "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in",
        "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz",
        "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th",
        "tr", "tw", "ua", "us", "ve", "za"
    ];

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
                // Check if there are any articles
                if (!data.articles || data.articles.length === 0) {
                    newsList.innerHTML = `<p>No news articles found.</p>`;
                    return;
                }

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

                    const publishedAt = moment(article.publishedAt).fromNow();
                    const articleContent = `
                        <h3 class="text-lg font-semibold"><a href="${article.url}" target="_blank" class="text-blue-500 hover:underline">${article.title}</a></h3>
                        <p class="text-gray-700">${article.description || ""}</p>
                        <p class="text-gray-500 text-sm">By ${article.author || "Unknown author"}</p>
                        <p class="text-gray-400 text-xs">Published ${publishedAt}</p>
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

    const handleCountryNewsClick = (event) => {
        currentPage = 1; // Reset current page for new fetch
        const countryCode = event.target.dataset.countryCode;
        const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;
        showImages = false;
        fetchNews(url, `${countryCode.toUpperCase()} News`);
    };

    countries.forEach((country) => {
        const button = document.getElementById(`${country}-news-button`);
        if (button) {
            button.dataset.countryCode = country;
            button.addEventListener("click", handleCountryNewsClick);
        }
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

    // Initial fetch for Tech Crunch News on page load
    const url = `https://newsapi.org/v2/everything?q=bitcoin&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    fetchNews(url, "Top Headlines");
});
