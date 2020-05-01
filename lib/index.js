(() => {
  const fs = require('fs')
  const path = require('path')
  const EJS = require('ejs')
  const JSZIP = require('jszip')
  const { v4: UUID } = require('uuid')

  const EBook = class {
    constructor (options, content) {
      const defaultOptions = {
        id: UUID(),
        title: 'no title',
        description: 'no description',
        publisher: 'anonymous',
        author: 'anonymous',
        tocTitle: 'Table Of Contents',
        date: new Date().toISOString(),
        lang: 'en',
        cover: false
      }
      this.options = {
        ...defaultOptions,
        ...options
      }
      this.content = content.map((data, index) => {
        data.id = index
        data = {
          ...data,
          id: index,
          order: index + 1,
          filename: `content_${index}.xhtml`,
          href: `OEBPS/content_${index}.xhtml`
        }
        return data
      })
      this.container = new JSZIP()
      this.container.file('mimetype', 'application/epub+zip')
    }

    render (template) {
      const defaultTemplate = {
        use: 'epub3',
        path: path.resolve(__dirname, '../templates/').toString(),
        ejs: {
          rmWhitespace: true
        }
      }

      template = {
        ...defaultTemplate,
        ...template
      }

      const config = require(path.join(template.path, template.use, 'config.json'))
      config.assets.forEach(asset => {
        this.container.file(`OEBPS/${asset}`, fs.readFileSync(path.join(template.path, template.use, asset)))
      })

      EJS.renderFile(path.join(template.path, template.use, 'toc.ncx.ejs'), {
        ...this.options,
        content: this.content
      }, template.ejs, (_err, data) => {
        this.container.file('OEBPS/toc.ncx', data)
      })

      EJS.renderFile(path.join(template.path, template.use, 'toc.xhtml.ejs'), {
        ...this.options,
        content: this.content
      }, template.ejs, (_err, data) => {
        this.container.file('OEBPS/toc.xhtml', data)
      })

      EJS.renderFile(path.join(template.path, template.use, 'content.opf.ejs'), {
        ...this.options,
        content: this.content
      }, template.ejs, (_err, data) => {
        this.container.file('OEBPS/content.opf', data)
      })

      this.content.forEach((chapter, index) => {
        EJS.renderFile(path.join(template.path, template.use, 'chapter.xhtml.ejs'), {
          ...this.options,
          ...chapter,
          number: (index + 1)
        }, template.ejs, (_err, data) => {
          this.container.file(chapter.href, data)
        })
      })
      if (this.options.cover) {
        this.container.file(`OEBPS/cover.${this.options.cover.extension}`, this.options.cover.data, { base64: true })
      }
      this.container.file('OEBPS/style.css', fs.readFileSync(path.join(template.path, template.use, 'template.css')))
      this.container.file('META-INF/container.xml',
        `<?xml version="1.0" encoding="UTF-8" ?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
                <rootfiles>
                    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
                </rootfiles>
            </container>`)
    }

    save (filename) {
      this.container
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(filename))
        .on('finish', function () {
          console.log(`${filename} generated.`)
        })
    }

    get base64 () {
      return async () => {
        return await this.container.generateAsync({ type: 'base64' })
      }
    }
  }
  module.exports = EBook
}).call(this)
