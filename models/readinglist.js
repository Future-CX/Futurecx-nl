let html = '';
let allData = [];
const categories = [];
const reads = [];
const learnings = [];
const readsandlearnings = [];

{
	$.getJSON('/models/readinglist.json')
		.done((data) => {
			allData = data;
			//console.log('Request Done.');
			//console.log(allData);
			//JSON.parse(allData);
			readAllCategories();
			readAllReads();
			readAllLearnings();
			buildReadingList();
		})
		.fail((jqxhr, textStatus, error) => {
			const err = `${textStatus}, ${error}`;
			console.log(`Request Failed: ${err}`);
		});
}

function buildReadingList(method) {
	//console.log('allData');
	//console.log(allData);

	const htmlCategoryOpener =
		'<section class="bg-secondary py-0"><div class="container my-2 py-md-2 py-lg-5"><div class="row"><div class="col-xl-4 col-md-5 text-center text-md-start pb-2 pb-md-0 mb-4 mb-md-0">';
	const htmlCategoryTitle = '<h2 class="pb-3 mb-1 mb-lg-2" data-toc-text="%title%">%title%</h2>';
	const htmlCategoryDescription = '<p class="fs-lg pb-3 mb-2 mb-lg-3">%description%</p></div>';
	const htmlCategoryReadsAndLearnings =
		'<div class="col-md-7 offset-xl-1"><div class="accordion" id="faq%id%"><div class="accordion-item border-0 rounded-3 shadow-sm mb-3"><h3 class="accordion-header" id="q1-heading"><button class="accordion-button shadow-none rounded-3"type="button"data-bs-toggle="collapse"data-bs-target="#q%id%1"aria-expanded="true"aria-controls="q%id%1">Interesting reads</button></h3><div id="q%id%1" class="accordion-collapse collapse show" aria-labelledby="q1-heading" data-bs-parent="#faq%id%"><div class="accordion-body fs-sm pt-0">%reads%</div></div></div><div class="accordion-item border-0 rounded-3 shadow-sm mb-3"><h3 class="accordion-header" id="q2-heading"><button class="accordion-button shadow-none rounded-3 collapsed"type="button"data-bs-toggle="collapse"data-bs-target="#q%id%2"aria-expanded="false"aria-controls="q%id%2">Courses</button></h3><div id="q%id%2" class="accordion-collapse collapse" aria-labelledby="q2-heading" data-bs-parent="#faq%id%"><div class="accordion-body fs-sm pt-0">%learnings%</div></div></div></div></div></div></div></section>';

	jQuery.each(categories, (i, category) => {
		html += htmlCategoryOpener;
		html += htmlCategoryTitle.replaceAll('%title%', category.title);
		html += htmlCategoryDescription.replaceAll('%description%', category.description);

		listofreads = '';
		jQuery.each(reads, (i, read) => {
			readhtml =
				'<p><a href="%link%" target="_blank" title="%description%">%title%</a><br/><i>by <strong>%author%</strong>, published on %date%</i></p>';
			if (read.category == category.title) {
				listofreads += readhtml
					.replaceAll('%title%', read.title)
					.replaceAll('%description%', read.description)
					.replaceAll('%link%', read.link)
					.replaceAll('%author%', read.author)
					.replaceAll('%date%', read.date);
			}
		});

		listoflearnings = '';
		jQuery.each(learnings, (i, learning) => {
			learninghtml =
				'<p><a href="%link%" target="_blank" title="%description%">%title%</a><br/><i>by <strong>%author%</strong>, published on %date%</i></p>';
			if (learning.category == category.title) {
				listoflearnings += learninghtml
					.replaceAll('%title%', learning.title)
					.replaceAll('%description%', learning.description)
					.replaceAll('%link%', learning.link)
					.replaceAll('%author%', learning.author)
					.replaceAll('%date%', learning.date);
			}
		});

		html += htmlCategoryReadsAndLearnings.replaceAll('%id%', i).replace('%reads%', listofreads).replace('%learnings%', listoflearnings);
	});

	//document.getElementById('readinglist').innerHTML = html;
}

function readAllCategories() {
	jQuery.each(allData.categories, (i, category) => {
		categories.push(category);
	});
	//console.log('categories');
	//console.log(categories);
}

function readAllReads() {
	jQuery.each(allData.reads, (i, read) => {
		reads.push(read);
		readsandlearnings.push(read);
	});
	//console.log('reads');
	//console.log(reads);
}
function readAllLearnings() {
	jQuery.each(allData.learnings, (i, learning) => {
		learnings.push(learning);
		readsandlearnings.push(learning);
	});
	//console.log('learnings');
	//console.log(learnings);
}
