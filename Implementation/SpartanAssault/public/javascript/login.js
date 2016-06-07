var i = 0;
window.onload = function(){ 
	document.getElementById("container_login_button").onclick = function() {
		showHideLogin();
	};
};

function showHideLogin() {
	if (i == 0) {
		$('#container_login').css('opacity','1');
		i = 1;
	}
	else {
		$('#container_login').css('opacity','0');
		i = 0;
	}
}