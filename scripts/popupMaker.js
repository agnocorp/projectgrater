let icons = new Map();
icons.set("Email", mail)

function createPopup(title,body,type) {
	let div = document.createElement("div");
	div.id = "popup";
	
	let flex = document.createElement("div");
	div.append(flex)
	
	let icon = document.createElement("span");
	icon.classList.add("material-symbols-outlined");
	icon.textContent = icons.get(type);
	flex.append(icon)
	
	let heading = document.createElement("h1");
	heading.textContent = title;
	flex.append(heading);
	
	let para = document.createElement("p");
	para.textContent = body;
	div.append(para);
	
	document.append(div);
}