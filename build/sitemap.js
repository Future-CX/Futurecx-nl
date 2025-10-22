const fs = require('fs');
const configureLogger = require('./logger');
const log = configureLogger('Sitemap');
let path = require('path');
let date = new Date().toISOString().split('T')[0];
let domain = 'https://www.futurecx.nl/';

const GenerateSitemap = async () => {
  //let XmlSitemap = require('xml-sitemap')
  let sitemap = '';

  log.info(`Generating Sitemap...`);

  sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  fromDir('.', /\.html$/, function (filename, datetime) {
    //log.info('-- found: ', filename)

    filename = filename.replace(/\\/g, '/');
    datetime = datetime.toISOString().split('T')[0];

    sitemap += getSitemapUrl(domain + filename, datetime);
  });

  sitemap += '</urlset>';

  fs.writeFileSync('sitemap.xml', sitemap);

  log.success(`Sitemap Generated`);
};

function getSitemapUrl(location, datetime) {
  let url = '\t<url>\n' + `\t\t<loc>${location}</loc>\n` + `\t\t<lastmod>${datetime}</lastmod>\n` + '\t</url>\n';
  return url;
}

function fromDir(startPath, filter, callback) {
  //log.info('Searching in ' + startPath + '/')

  if (!fs.existsSync(startPath)) {
    log.info('no dir ', startPath);
    return;
  }

  // filter unwanted directories
  let ignoredDirectories = ['.git', '.github', 'assets', 'build', 'components', 'docs', 'node_modules', 'pages', 'src'];
  if (ignoredDirectories.includes(startPath)) {
    //log.info('ignored ', startPath + '/')
    return;
  }

  let ignoredFiles = ['blog-single.html', '.old.html', 'assets', 'build', 'components', 'docs', 'node_modules', 'pages', 'src'];

  let files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    let filename = path.join(startPath, files[i]);
    log.info('filename ', startPath + '/' + filename);

    // check if part of the filename is in the ignored files
    if (ignoredFiles.some((ignoredFile) => filename.includes(ignoredFile))) {
      continue;
    }

    let stat = fs.lstatSync(filename);
    let datetime = stat.mtime;
    //log.info('Stats ', stat.mtime)
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback); //recurse
    } else if (filter.test(filename)) callback(filename, datetime);
  }
}

GenerateSitemap();
