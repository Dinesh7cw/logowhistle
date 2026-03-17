const fetch = require('node-fetch');
fetch('http://localhost:1337/api/blog-posts?populate=featuredImage&pagination[limit]=1')
  .then(r => r.json())
  .then(j => console.log(JSON.stringify(j, null, 2)))
  .catch(err => console.error(err));
