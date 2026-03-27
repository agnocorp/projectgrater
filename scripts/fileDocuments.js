
const pdfDiv = document.getElementById("pdfDiv");
const pdfControls = document.getElementById("pdfControls");
const pageNumInput = document.getElementById("pageNumInput");

const { pdfjsLib } = globalThis;
  
var pageCount = null
var pdfDoc = null

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
  
function drawPage(num) {
	let canvas = document.createElement("canvas");
	canvas.id = "page" + num.toString();
	pdfDiv.append(canvas);
	
	pdfDoc.getPage(num).then(function(page){
		console.log(page);
		let viewport = page.getViewport({scale: 2});
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		
		var context = canvas.getContext('2d');
		
		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
		
		//await renderTask.promise;
	})
}

function goToPage() {
	event.preventDefault();
	
	var num = null;
	
	if (pageNumInput.value != null){
		num = pageNumInput.value;
	}else{
		num = 1;
	}
	const options = {
		behavior: "smooth",
		block: "start",
		container: "nearest"
	}
	
	console.log(pageNumInput.value);
	const targetPage = document.getElementById("page" + num);
	
	targetPage.scrollIntoView(options);
	
	console.log(pageCount + "controls");
}

pdfControls.addEventListener("submit", goToPage);

//pdfControls.onsubmit = "goToPage(1);";

let url = "assets/documents/meetingNotes1.pdf";

pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
	pdfDoc = pdfDoc_;
	pageCount = pdfDoc.numPages;
	
	for (let page = 1; page <= pageCount; page++){
		drawPage(page);
	}
	
	const page1 = document.getElementById("page1");
	if (page1 != null){
		pdfDiv.insertBefore(pdfControls, page1);
	}else{
		console.log("no page1");
	}
	
})