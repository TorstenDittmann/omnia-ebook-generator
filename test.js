const EBook = require('./index')

const ebook = new EBook({},
  [
    {
      title: 'About the author',
      data: '<h2>Charles Lutwidge Dodgson</h2>'
    },
    {
      title: 'Lorem ipsum dolor',
      data: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
    }
  ])

ebook.render({ use: 'epub3' })
ebook.save('out.epub')
