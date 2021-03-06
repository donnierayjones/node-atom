/*
 Documentation coming soon.
*/

var XML        = require('xml'),
    log        = require('logging').from(__filename);

function ATOM (options, items) {
    options = options || {};

    this.title          = options.title || 'Untitled ATOM Feed';
    this.id             = options.id;
    this.description    = options.description || '';
    this.feed_url       = options.feed_url;
    this.site_url       = options.site_url;
    this.image_url      = options.image_url;
    this.author         = options.author;
    this.items          = items || [];

    this.item = function (options) {
        options = options || {};
        var item = {
            id:             options.id,
            title:          options.title || 'No title',
            content:        options.content,
            guid:           options.guid,
            categories:     options.categories || [],
            author:         options.author,
            date:           options.date,
            updated:        options.updated,
            link:           options.link,
            alternate:      options.alternate
        };

        this.items.push(item);
        return this;
    };

    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                + XML(generateXML(this), indent);
    }

}

function ifTruePush(bool, array, data) {
    if (bool) {
        array.push(data);
    }
}

function generateXML (data){

    var feed =  [
            { _attr: {
                'xmlns':         'http://www.w3.org/2005/Atom',
                'xml:lang':      'en-US'
            } },
            { id:           data.id },
            { link:         { _attr: { type: 'text/html', rel: 'alternate', href: data.site_url } } },
            { link:         { _attr: { type: 'application/atom+xml', rel: 'self', href: data.feed_url } } },
            { title:        data.title },
            { updated: new Date().toISOString() }
        ];

     data.items.forEach(function(item) {
        var entry = [
                    { id:        item.id }
                ];
        ifTruePush(item.date,    entry, { published:    new Date(item.date).toISOString() });
        ifTruePush(item.updated, entry, { updated:      new Date(item.updated).toISOString() });
        ifTruePush(item.link,    entry, { link:         item.link  });
        ifTruePush(item.alternate,entry, { link:   item.alternate  });
        ifTruePush(item.title,   entry, { title:        item.title });
        ifTruePush(item.author,   entry, { author:        item.author });
        ifTruePush(item.content, entry, { content: item.content });
        //ifTruePush(item.description, entry, { content:  { _attr: { type: 'xhtml', 'xml:lang': 'en' }, _cdata: item.description } });
        //ifTruePush(item.author || data.author, entry, { 'dc:creator': { _cdata: item.author || data.author } });
        feed.push({ entry: entry });
    });

    return { feed: feed };
}



module.exports = ATOM;
