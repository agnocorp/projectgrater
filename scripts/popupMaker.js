

let icons = new Map();
icons.set("Email", "mail");
icons.set("Notif", "error");

let page = document.currentScript.dataset.page;

function storageAvailable(type) { //stole this from MDN docs!
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function dismissPopup(){
	if (document.getElementById("popup")){
		document.getElementById("popup").remove();
	}else{
		console.log("no popup #Oops");
	}
}

function createPopup(subtitle,title,body,type,viewFunction,num) {
	let div = document.createElement("div");
	div.id = "popup";
	
	let flex = document.createElement("div");
	flex.classList.add("heading");
	
	let icon = document.createElement("span");
	icon.classList.add("material-symbols-outlined");
	icon.textContent = icons.get(type);
	flex.append(icon)
	
	let headings = document.createElement("div");
	
	let h4 = document.createElement("h4");
	let em = document.createElement("em");
	em.textContent = subtitle;
	h4.append(em);
	headings.append(h4);
	
	let h2 = document.createElement("h2");
	h2.textContent = title;
	headings.append(h2);
	
	flex.append(headings);
	div.append(flex)
	
	let para = document.createElement("p");
	para.innerHTML = body;
	div.append(para);
	
	let buttons = document.createElement("div");
	buttons.classList.add("buttons");
	
	let view = document.createElement("button");
	view.id = "view";
	switch(viewFunction){
		case "viewEmail":
			view.textContent = "View";
			view.addEventListener("click", viewEmail);
			view.emailNum = num;
			break;
		case "understand":
			view.textContent = "I Understand";
			view.addEventListener("click", dismissPopup);
			console.log("understand case");
			break;
		default: console.log("u fucked somethign up with this popups viewfunction yo");
	}
	
	buttons.append(view);
	
	let dismiss = document.createElement("button");
	dismiss.id = "dismiss";
	dismiss.textContent = "Dismiss";
	dismiss.onclick = dismissPopup;
	buttons.append(dismiss);
	div.append(buttons);
	
	
	document.body.append(div);
}

async function loadEmailPopup(num){
	const requestURL = "json/emails.json";
	
	const request = new Request(requestURL);
	
	const response = await fetch(request);
	const emailJson = await response.json();
	emails = await emailJson.emails;
	email = emails[num];
		
	createPopup("New Message from " + email.authoremail,email.subject,email.body,"Email","viewEmail",num);
}


function viewEmail(evt){
	console.log("Email or something");
	window.location.assign("./email.html?e=" + evt.currentTarget.emailNum);
	localStorage.setItem("hBWwY","true");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



if (storageAvailable("localStorage")){
	let storage = window.localStorage;
	switch(page){
		case "dashboard":
			emailState = storage.getItem("hBWwY");
			if (!(emailState == "true")){
				loadEmailPopup(0);
			}
			break;
		case "file":
			emailState = storage.getItem("TcINM");
			switch(emailState){
				case null:
					localStorage.setItem("TcINM",1);
					createPopup("notification","Do you understand?","Do you understand?","Notif","understand");
					break;
				case 1:
					localStorage.setItem("TcINM",2);
					createPopup("notification","...Do you understand?","Did you need to see a second time?","Notif","understand");
					break;
				case 2:
					localStorage.setItem("TcINM",3);
					createPopup("notification","...Is there confusion?","The words are simple enough.","Notif","understand");
					break;
				case 3:
					localStorage.setItem("TcINM",4);
					createPopup("notification","Surely this is unnecessary.","The words are simple enough.","Notif","understand");
					break;
			}
		default:
			console.log("popup missing page attribute");
	}
} else {
	alert("Your browser does not support localStorage! This is probably because it's too old or an unusual browser. This website needs localStorage to function, so try switching to a more modern browser!");
}