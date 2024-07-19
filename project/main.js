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
      // Process the data here
      data.articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});
