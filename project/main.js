document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "ddcaac8f1ddf45b28293a2b14d8ff03f";
    const newsList = document.getElementById("news-list");
    const headline = document.getElementById("headline");
    const bitcoinLink = document.getElementById("bitcoin-link");
    const latestNewsLink = document.getElementById("latest-news-link");
    const techNewsLink = document.getElementById("tech-news-link");
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
    let currentCountryPage = 1;
    const pageSize = 30;
    let currentUrl = "";
    let showImages = true;
    const countriesPerPage = 9;

    const countries = [
        { code: "ae", name: "UAE" }, { code: "ar", name: "Argentina" }, { code: "at", name: "Austria" }, 
        { code: "au", name: "Australia" }, { code: "be", name: "Belgium" }, { code: "bg", name: "Bulgaria" }, 
        { code: "br", name: "Brazil" }, { code: "ca", name: "Canada" }, { code: "ch", name: "Switzerland" }, 
        { code: "cn", name: "China" }, { code: "co", name: "Colombia" }, { code: "cu", name: "Cuba" }, 
        { code: "cz", name: "Czech Republic" }, { code: "de", name: "Germany" }, { code: "eg", name: "Egypt" }, 
        { code: "fr", name: "France" }, { code: "gb", name: "UK" }, { code: "gr", name: "Greece" }, 
        { code: "hk", name: "Hong Kong" }, { code: "hu", name: "Hungary" }, { code: "id", name: "Indonesia" }, 
        { code: "ie", name: "Ireland" }, { code: "il", name: "Israel" }, { code: "in", name: "India" }, 
        { code: "it", name: "Italy" }, { code: "jp", name: "Japan" }, { code: "kr", name: "South Korea" }, 
        { code: "lt", name: "Lithuania" }, { code: "lv", name: "Latvia" }, { code: "ma", name: "Morocco" }, 
        { code: "mx", name: "Mexico" }, { code: "my", name: "Malaysia" }, { code: "ng", name: "Nigeria" }, 
        { code: "nl", name: "Netherlands" }, { code: "no", name: "Norway" }, { code: "nz", name: "New Zealand" }, 
        { code: "ph", name: "Philippines" }, { code: "pl", name: "Poland" }, { code: "pt", name: "Portugal" }, 
        { code: "ro", name: "Romania" }, { code: "rs", name: "Serbia" }, { code: "ru", name: "Russia" }, 
        { code: "sa", name: "Saudi Arabia" }, { code: "se", name: "Sweden" }, { code: "sg", name: "Singapore" }, 
        { code: "si", name: "Slovenia" }, { code: "sk", name: "Slovakia" }, { code: "th", name: "Thailand" }, 
        { code: "tr", name: "Turkey" }, { code: "tw", name: "Taiwan" }, { code: "ua", name: "Ukraine" }, 
        { code: "us", name: "USA" }, { code: "ve", name: "Venezuela" }
    ];

    const createCountryButtons = () => {
        const countryButtonsContainer = document.getElementById("country-buttons");
        countryButtonsContainer.innerHTML = "";

        const startIndex = (currentCountryPage - 1) * countriesPerPage;
        const endIndex = startIndex + countriesPerPage;
        const currentCountries = countries.slice(startIndex, endIndex);

        currentCountries.forEach((country) => {
            const button = document.createElement("button");
            button.id = `${country.code}-news-button`;
            button.dataset.countryCode = country.code;
            button.textContent = `${country.name} News`;
            button.classList.add("p-2", "bg-blue-500", "text-white", "rounded", "shadow", "m-2");
            button.addEventListener("click", handleCountryNewsClick);
            countryButtonsContainer.appendChild(button);
        });

        updatePaginationButtons();
    };

    const updatePaginationButtons = () => {
        const prevButton = document.getElementById("prev-button");
        const nextButton = document.getElementById("next-button");

        prevButton.disabled = currentCountryPage === 1;
        nextButton.disabled = currentCountryPage === Math.ceil(countries.length / countriesPerPage);
    };

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
                if (!data.articles || data.articles.length === 0) {
                    newsList.innerHTML = `<p>No news articles found.</p>`;
                    return;
                }

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
                        <p class="text-gray-400 text-sm">${publishedAt}</p>
                        ${showImages ? `<img src="${article.urlToImage || ""}" alt="Article Image" class="mt-2 w-full h-auto rounded" />` : ""}
                    `;

                    listItem.innerHTML = articleContent;
                    container.appendChild(listItem);
                });

                if (append) {
                    newsList.appendChild(container);
                } else {
                    newsList.innerHTML = "";
                    newsList.appendChild(container);
                }

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
        currentPage = 1;
        const countryCode = event.target.dataset.countryCode;
        const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;
        showImages = false;
        fetchNews(url, `${countryCode.toUpperCase()} News`);
    };

    bitcoinLink.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = 1;
        const url = `https://newsapi.org/v2/everything?q=bitcoin&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
        showImages = true;
        fetchNews(url, "Bitcoin News");
    });

    latestNewsLink.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = 1;
        const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`;
        showImages = true;
        fetchNews(url, "Latest News (BBC)");
    });

    techNewsLink.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = 1;
        const url = `https://newsapi.org/v2/everything?domains=techcrunch.com,thenextweb.com&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
        showImages = true;
        fetchNews(url, "Tech News");
    });

    showMoreButton.addEventListener("click", () => {
        currentPage++;
        const url = `${currentUrl}&page=${currentPage}`;
        fetchNews(url, headline.textContent, true);
    });

    document.getElementById("prev-button").addEventListener("click", () => {
        if (currentCountryPage > 1) {
            currentCountryPage--;
            createCountryButtons();
        }
    });

    document.getElementById("next-button").addEventListener("click", () => {
        if (currentCountryPage < Math.ceil(countries.length / countriesPerPage)) {
            currentCountryPage++;
            createCountryButtons();
        }
    });

    createCountryButtons();

    const url = `https://newsapi.org/v2/top-headlines?country=za&apiKey=${apiKey}`;
    fetchNews(url, "SA Top Headlines");
});
