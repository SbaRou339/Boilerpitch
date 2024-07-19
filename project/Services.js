

const apiKey = 'ddcaac8f1ddf45b28293a2b14d8ff03f';
const query = 'bitcoin';

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
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
