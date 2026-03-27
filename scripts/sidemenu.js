const sideMenu = document.getElementById("sideMenu");
const openButton = document.getElementById("sideMenuOpener");
const closeButton = document.getElementById("sideMenuCloser");
const sideMenuClosed = document.getElementById("sideMenuClosed");


function openMenu(){
	sideMenu.style.display = "grid";
	sideMenuClosed.style.display = "none";
}

function closeMenu(){
	sideMenu.style.display = "none";
	sideMenuClosed.style.display = "grid	";
}