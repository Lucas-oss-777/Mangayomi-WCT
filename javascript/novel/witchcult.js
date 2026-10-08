const mangayomiSources = [{
    "name": "Witch Cult Translations",
    "baseUrl": "https://witchculttranslation.com",
    "lang": "en",
    "isManga": false,
    "className": "WitchCultTranslations",
    "sourceCodeLanguage": 1,
    "version": "1.0.0"
}];

class WitchCultTranslations {
    async getPopular(page) {
        const client = new Client();
        const res = await client.get(`${this.baseUrl}table-of-contents/`);
        const doc = DOM.selector(res.body);
        const elements = doc.select("div.entry-content p a, div.entry-content li a");
        const novels = [];
        for (const element of elements) {
            const title = element.text;
            const link = element.attr("href");
            if (link.includes("/arc-") && !link.match(/chapter|part/i)) {
                novels.push({
                    "name": title.trim(),
                    "link": link,
                    "imageUrl": "https://witchculttranslation.comwp-content/uploads/2018/11/wct-logo-v2.png"
                });
            }
        }
        return { "list": novels, "hasNextPage": false };
    }
    async getLatest(page) { return await this.getPopular(page); }
    async search(query, page, filters) {
        const popular = await this.getPopular(page);
        const filtered = popular.list.filter(n => n.name.toLowerCase().includes(query.toLowerCase()));
        return { "list": filtered, "hasNextPage": false };
    }
    async getDetail(url) {
        const client = new Client();
        const res = await client.get(url);
        const doc = DOM.selector(res.body);
        const chapters = [];
        const elements = doc.select("div.entry-content p a, div.entry-content li a");
        for (const element of elements) {
            const title = element.text.trim();
            const link = element.attr("href");
            if (link && (link.includes("chapter") || link.includes("part") || title.match(/Chapter|Interlude|Phase/i))) {
                chapters.push({ "name": title || "Untitled Chapter", "url": link });
            }
        }
        return {
            "author": "Tappei Nagatsuki",
            "description": doc.select("header.entry-header h1.entry-title").text.trim() || "Re:Zero Web Novel Arc",
            "status": 0,
            "chapters": chapters.reverse() 
        };
    }
    async getPageList(url) {
        const client = new Client();
        const res = await client.get(url);
        const doc = DOM.selector(res.body);
        const paragraphs = doc.select("div.entry-content p");
        const storyLines = [];
        for (const p of paragraphs) {
            const text = p.text.trim();
            if (text.length > 0) { storyLines.push(text); }
        }
        return storyLines;
    }
}
