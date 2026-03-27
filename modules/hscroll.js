
filesElement = document.getElementById("recentfiles");


function hScroll(scrollElement){
	
	scrollElement.mouseIsOver = false;
	
	scrollElement.onmouseover = function()   {
      this.mouseIsOver = true;
   };
	scrollElement.onmouseout = function()   {
      this.mouseIsOver = false;
   }
	
	function handleScroll(scrollEvent){
		if (scrollElement.mouseIsOver && scrollElement.scrollWidth > scrollElement.clientWidth){
			
			event.preventDefault();
		
			requestAnimationFrame(()=> {
				const scrollAmount = scrollEvent.deltaY;
				
				scrollElement.scrollBy({ left : scrollAmount * 6, behavior : "smooth"})
			})
			
		}
	}

	window.addEventListener("wheel", handleScroll, {passive : false})
}

hScroll(filesElement);