// project\main.js

document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'ddcaac8f1ddf45b28293a2b14d8ff03f';
  const query = 'bitcoin';
  const newsList = document.getElementById('news-list');

  fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      data.articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.classList.add('p-4', 'border', 'border-gray-300', 'rounded', 'bg-white', 'shadow-sm', 'mb-4');
        
        const articleContent = `
          <h3 class="text-lg font-semibold"><a href="${article.url}" target="_blank" class="text-blue-500 hover:underline">${article.title}</a></h3>
          <p class="text-gray-700">${article.description || ''}</p>
          <p class="text-gray-500 text-sm">By ${article.author || 'Unknown author'}</p>
          <img src="${article.urlToImage || ''}" alt="Article Image" class="mt-2 w-full h-auto rounded" />
        `;
        
        listItem.innerHTML = articleContent;
        newsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});
