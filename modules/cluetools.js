//IF YOU ARE LOOKING AT THIS FILE: This is not a clue!!!!!!!! 
//This code is used for checking correct answers to puzzles on the GRATER website. There will never be actual clues hidden here.
//The rest of the website though... well, who can say? Haha. Not me that's for sure. Guess you'll just have to find out.
//If you really want to brute force the puzzles I can't stop you, but please don't spoil them for other people. 
//I highly recommend solving the puzzles as intended bc its going to be way more fun!!! 
// - Ghosty

const passwords = new Map();
passwords.set("loginPswd", "dGVzdA==");
passwords.set("loginUser", "dGVzdA==");

export function passwordCheck(entry, key) {
	if (btoa(entry) === passwords.get(key)){
		return true;
	} else {
		return false;
	}
	
}
