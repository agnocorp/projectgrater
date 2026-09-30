
const pdfDiv = document.getElementById("pdfDiv");
const pdfViewer = document.getElementById("pdfViewer");

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
	const pageNumInput = document.getElementById("pageNumInput");
	
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

//pdfControls.onsubmit = "goToPage(1);";

const urlParams = new URLSearchParams(window.location.search);
let path = urlParams.get('f');
if (path){
	if (path == "A23B20D18C10E20B9"){
		alert("You're on the right track, but you're still missing a step...");
	}else{
		path = decodeURI(path);
		let url = "files/"+path;
		

		pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
			pdfDoc = pdfDoc_;
			
			if (pdfDoc){
				pageCount = pdfDoc.numPages;
				
				pdfDiv.innerHTML = "";
				
				for (let page = 1; page <= pageCount; page++){
				drawPage(page);
				}
				
				const page1 = document.getElementById("page1");
				if (page1 != null){
					let pdfControls = document.createElement("form");
						pdfControls.id = "pdfControls";
						pdfControls.onsubmit = "return false;";
					let pdfCInput = document.createElement("input");
						pdfCInput.type = "text";
						pdfCInput.id = "pageNumInput";
						pdfCInput.placeholder = 1;
						pdfControls.append(pdfCInput);
					let pdfCGo = document.createElement("button");
						pdfCGo.type = "submit";
						pdfCGo.textContent = "Go To Page";
						pdfControls.append(pdfCGo);
						
					pdfDiv.insertBefore(pdfControls, page1);
					pdfControls.addEventListener("submit", goToPage);
				}else{
					console.log("no page1");
				}
			}else{
				console.log("no pdf");
			}
		})
	}
}else{
	console.log("No file path provided!");
}