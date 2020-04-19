const EBook = require('./index')

const ebook = new EBook({},
  [
    {
      title: 'About the author',
      data: '<h2>Charles Lutwidge Dodgson</h2>'
    },
    {
      title: 'Down the Rabbit Hole',
      data: '<p>Alice was beginning to get very tired...</p>'
    }
  ])

ebook.render()
ebook.base64().then(data => {
  console.log(data)
})
