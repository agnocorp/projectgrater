let emailList = document.getElementsByClassName("emailList");

function addEmail(author, recipients, timestamp, subject, body, read){
	let emailDiv = document.createElement("div");
	let subjectH3 = document.createElement("h3");
		subjectH3.textContent = subject;
		emailDiv.append(subjectH3);
}

async function populateList(){
	const requestURL = "json/emails.json";
	
	const request = new Request(requestURL);
	
	const response = await fetch(request);
	const emails = await response.json();
	
	for (const email of emails) {
		addEmail(email.author, email.recipients, email.date, email.subject, email.body, email.read);
	}
}

populateList();