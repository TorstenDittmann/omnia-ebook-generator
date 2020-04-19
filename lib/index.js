(() => {
    const fs = require("fs");
    const EJS = require("ejs");
    const JSZIP = require("jszip");
    const { v4: UUID } = require("uuid");


    const EBook = class {
        constructor(options, content) {
            const defaultOptions = {
                id: UUID(),
                title: "no title",
                description: "no description",
                publisher: "anonymous",
                author: "anonymous",
                tocTitle: "Table Of Contents",
                date: new Date().toISOString(),
                lang: "en"
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
                return data;
            });
            this.container = new JSZIP();
            this.container.file("mimetype", "application/epub+zip");
        }
        render() {
            const templateConfig = {
                rmWhitespace: true
            }
            EJS.renderFile("../templates/toc.ncx.ejs", {
                ...this.options,
                content: this.content
            }, templateConfig, (err, data) => {
                this.container.file("OEBPS/toc.ncx", data)
            });

            EJS.renderFile("../templates/epub3/toc.xhtml.ejs", {
                ...this.options,
                content: this.content
            }, templateConfig, (err, data) => {
                this.container.file("OEBPS/toc.xhtml", data)
            });

            EJS.renderFile("../templates/epub3/content.opf.ejs", {
                ...this.options,
                content: this.content
            }, templateConfig, (err, data) => {
                this.container.file("OEBPS/content.opf", data)
            });

            this.content.forEach(chapter => {
                EJS.renderFile("../templates/epub3/chapter.xhtml.ejs", {
                    ...this.options,
                    ...chapter
                }, templateConfig, (err, data) => {
                    this.container.file(chapter.href, data);
                })
            });
            if (this.options.cover) {
                this.container.file(`OEBPS/cover.${this.options.cover.extension}`, this.options.cover.data, { base64: true });
            }
            this.container.file("OEBPS/style.css", fs.readFileSync("../templates/template.css"));
            this.container.file("META-INF/container.xml",
                `<?xml version="1.0" encoding="UTF-8" ?>
                    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
                    <rootfiles>
                        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
                    </rootfiles>
                </container>`);
        }
        save() {
            this.container
                .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                .pipe(fs.createWriteStream('out.epub'))
                .on('finish', function () {
                    console.log("out.zip written.");
                });
        }

        get base64() {
            return (async () => {
                return await this.container.generateAsync({ type: "base64" });
            })
        }
        get blob() {
            return (async () => {
                return await this.container.generateAsync({ type: "blob" });
            })
        }

    }
    module.exports = EBook;
}).call(this);