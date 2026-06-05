const emailList = document.getElementById("emailList");
var emails = {}

const url = window.location.search;
const urlParams = new URLSearchParams(url);

function addEmail(author, recipients, timestamp, subject, body, read, num){

	
	let emailDiv = document.createElement("div");
	if (read) {
		emailDiv.classList.add("read");
	}
	emailDiv.classList.add("email")
	emailDiv.id = num;
	
	let headingDiv = document.createElement("div");
	
	let authorH3 = document.createElement("h3");
		authorH3.textContent = author;
		emailDiv.append(authorH3);
	let subjectH4 = document.createElement("h4");
		subjectH4.textContent = subject;
		headingDiv.append(subjectH4);
	let timestampP = document.createElement("p");
		const options = {
			timeZone: "UTC",
			hour12: true,
			month: "long",
			day: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			calendar: "gregory"
		}
		timestampP.textContent = new Intl.DateTimeFormat("en-us", options).format(new Date(timestamp));
		headingDiv.append(timestampP);
	emailDiv.append(headingDiv);
		
	let bodyP = document.createElement("p");
		bodyP.innerHTML = body;
		emailDiv.append(bodyP);
		
	emailList.append(emailDiv);
}

function makeHeader(source){
	let headingDiv = document.createElement("div");
	headingDiv.classList.add("heading");
	
	if (source.reply){
		headingDiv.classList.add("replyHeading");
	}
	
	let authorP = document.createElement("p");
		authorP.textContent = "From: " + source.author + " (" + source.authoremail + ")";
		headingDiv.append(authorP);
	let recipientP = document.createElement("p");
		let recipText = "";
		if (source.recipemails.length > 0){
			for (const recip in source.recipients){
				recipText = recipText + source.recipients[recip] + " (" + source.recipemails[recip] + "), ";
			}
			recipText = recipText.substring(0, recipText.length-2);
		}else{
			recipText = source.recipients[0];
		}
		recipientP.textContent = "To: " + recipText;
		headingDiv.append(recipientP);
	let timestampP = document.createElement("p");
		const options = {
			timeZone: "UTC",
			hour12: true,
			month: "long",
			day: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			calendar: "gregory",
			weekday: "long"
		}
		timestampP.textContent = new Intl.DateTimeFormat("en-us", options).format(new Date(source.date));
		headingDiv.append(timestampP);
		
	return headingDiv;
}

function makeBody(source){
	let bodyDiv = document.createElement("div");
	let parsedBody = source.body.match(/(.*?)<br>/gm);
	let finalBody = ""
	for (const line in parsedBody){
		finalBody = finalBody + "<p>" + parsedBody[line].replace(/<br>/, "") + "</p>";
	}
	bodyDiv.innerHTML = finalBody;
	bodyDiv.classList.add("body");
	
	return bodyDiv;
}

function viewEmail() {
	if (!this.classList.contains("read")){
		this.classList.add("read");
	}
	
	if (urlParams.get('e')){
		history.pushState(null, "", "?e="+this.id);
	}else{
		history.replaceState(null, "", "?e="+this.id);
	}
	
	
	oldViewing = document.getElementsByClassName("viewing")[0];
	if (oldViewing){
		oldViewing.classList.remove("viewing");
	} 
	this.classList.add("viewing");
	
	
	//history.replaceState(null, "", )
	
	openedEmail = emails[Number(this.id)];
	let emailViewerOuter = document.getElementsByClassName("emailViewer")[0];
	emailViewerOuter.innerHTML = "";
	let emailViewer = document.createElement("div");
		emailViewer.classList.add("emailViewBG");
		
	emailViewer.append(makeHeader(openedEmail));

	
	let subjectH2 = document.createElement("h2");
		subjectH2.textContent = openedEmail.subject;
	emailViewer.append(subjectH2);
	
	if (openedEmail.preceding){
		precedingDiv = document.createElement("div");
		precedingDiv.innerHTML = openedEmail.preceding;
		emailViewer.append(precedingDiv);
	}
	
	emailViewer.append(makeBody(openedEmail));
	
	if (openedEmail.replies) {
		for (const replyNum in openedEmail.replies){
			let reply = emails[openedEmail.replies[replyNum]];
			let replyDiv = document.createElement("div");
				replyDiv.id = openedEmail.replies[replyNum].toString();
			replyDiv.append(makeHeader(reply));
			
			if (reply.preceding){
				precedingDiv = document.createElement("div");
				precedingDiv.innerHTML = reply.preceding;
				replyDiv.append(precedingDiv);
			}
			
			replyDiv.append(makeBody(reply));
			
			emailViewer.append(replyDiv);
		}
	}
	
	emailViewerOuter.append(emailViewer);
	
}

async function populateList(){
	const requestURL = "json/emails.json";
	
	const request = new Request(requestURL);
	
	const response = await fetch(request);
	const emailJson = await response.json();
	emails = await emailJson.emails;
	
	let emailNum = 0;
	
	for (const email of emails) {
		if (!email.reply){
			addEmail(email.author, email.recipients, email.date, email.subject, email.body, email.read, emailNum);
			document.getElementById(emailNum.toString()).addEventListener("click", viewEmail);
		}
		emailNum = emailNum + 1;
	}
	
	const viewing = urlParams.get('e');
	if (viewing){
		if (!emails[viewing].reply){
			document.getElementById(viewing).click();
		}else{
			
			document.getElementById(emails[viewing].reply).click();
			document.getElementById(viewing).scrollIntoView({behavior: "smooth", block: "top", container: "nearest"})
		}
		
	}
}

populateList();