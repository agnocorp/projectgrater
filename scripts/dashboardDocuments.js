
//const files = new Map();
//files.set("meetingNotes1", { name: "Meeting Notes 10/9", preview: "yabba dabba do", url: "#"});
//files.set("meetingNotes2", { name: "Meeting Notes 10/16", preview: "yabba dabba do", url: "#"});
//files.set("meetingNotes3", { name: "Meeting Notes 10/23", preview: "yabba dabba do", url: "#"});
//files.set("budgetProposal", { name: "Budget Proposal", preview: "Good morning Arrow...I have faxed you a budget request for 500 million Bux...Please approve it...Thanks", url: "#"});
//files.set("incidentReport", { name: "Incident 4PR Report 10/8", preview: "As of incident 4PR, under no circumstances should an employee refer to Protograft as anything other than he/him while in the same room as it. Doing so will lead to immediate disciplinary action, if possible. The cause of the undesirable behavior when using the incorrect pronouns has yet to be found.", url: "#"});
//files.set("experimentLog", { name: "GRATER-1 Experiment 037 Log", preview: "i stabbed it with needles and it seemed pretty upset. Result: Success", url: "#"});

//const defaultpfp = "assets/images/defaultpfp.svg";
//const defaultPfpAlt = "A default profile picture";

//const people = new Map();
//people.set("Arrow", {pfp: defaultpfp, pfpAlt: defaultPfpAlt, url: "#"});
//people.set("M. Glass", {pfp: defaultpfp, pfpAlt: defaultPfpAlt, url: "#"});
//people.set("Clockwork", {pfp: defaultpfp, pfpAlt: defaultPfpAlt, url: "#"});


function addDocument(parentElement, file, author, time, date, defaultpfp){
	let pfpUrl;
	let pfpAlt;
	
	if (author.pfp === "defaultpfp"){
		pfpUrl = defaultpfp.url;
		pfpAlt = defaultpfp.alt;
	} //else use values in author object (WIP)
	
	let fileDiv = document.createElement("div");
	let previewElement = document.createElement("a");
		previewElement.href = file.url;
		previewElement.className = "filepreview";	
		previewElement.textContent = file.preview; //Potentially replace this with images later
		
		fileDiv.append(previewElement);
		
	
	let h2Element = document.createElement("h2");
	let h2aElement = document.createElement("a");
		h2aElement.href = file.url;
		h2aElement.textContent = file.name;
		
		h2Element.append(h2aElement);
		fileDiv.append(h2Element);
		
	let pElement = document.createElement("p");
	let pImgElement = document.createElement("img");
		pImgElement.src = pfpUrl;
		pImgElement.alt = pfpAlt;
	let pImgAElement = document.createElement("a");
		pImgAElement.href = author.url;
		pImgAElement.append(pImgElement);
	let pAElement = document.createElement("a");
		pAElement.href = author.url;
		pAElement.className = "personname";
		pAElement.textContent = author.name;
		
		pElement.append(pImgAElement, "Edited by ", pAElement, " on ", date, " at ", time);
		fileDiv.append(pElement);
		
		parentElement.append(fileDiv);
}

const fileHolder = document.getElementById("recentfiles");

//addDocument(fileHolder, "meetingNotes3", "Arrow", "10/23 3:40 PM");
//addDocument(fileHolder, "meetingNotes2", "Arrow", "10/16 3:55 PM");
//addDocument(fileHolder, "meetingNotes1", "Arrow", "10/9 3:42 PM");
//addDocument(fileHolder, "incidentReport", "Clockwork", "10/8 9:32 AM");
//addDocument(fileHolder, "experimentLog", "Arrow", "10/1 4:15 PM");
//addDocument(fileHolder, "budgetProposal", "M. Glass", "9/29 10:34 AM");


async function populateDocs(){
	const requestURL = "json/documents.json";
	
	const request = new Request(requestURL);

	const response = await fetch(request);
	const documentJson = await response.json();
	
	const files = await documentJson.files;
	const people = await documentJson.people;
	const defaultpfp = await documentJson.defaultpfp;
	
	//console.log(people.find(({ name }) => name === files[0].author));
	
	for (const file of files) {
		let author = people.find(({ name }) => name === file.author);
		const options1 = {
			timeZone: "UTC",
			hour12: true,
			hour: "numeric",
			minute: "2-digit"
		}
		const options2 = {
			timeZone: "UTC",
			hour12: true,
			month: "2-digit",
			day: "2-digit"
		}

		let time = new Intl.DateTimeFormat("en-us", options1).format(new Date(file.date));
		let date = new Intl.DateTimeFormat("en-us", options2).format(new Date(file.date));
		addDocument(fileHolder, file, author, time, date, defaultpfp); //ITS UGLY ITS HACKY DONT LOOK DONT LOOK
	}
}

populateDocs();

