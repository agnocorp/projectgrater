let icons = new Map();
icons.set("Email", "mail")

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
	view.textContent = "View";
	view.addEventListener("click", viewEmail);
	view.emailNum = num;
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
		
	createPopup("New Message from " + email.authoremail,email.subject,email.body,"Email",viewEmail,num);
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
	emailState = storage.getItem("hBWwY");
	if (!(emailState == "true")){
		loadEmailPopup(0);
	}
} else {
	alert("Your browser does not support localStorage! This is probably because it's too old or an unusual browser. This website needs localStorage to function, so try switching to a more modern browser!");
}