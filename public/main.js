// Get the elements
var dropZone = document.getElementById("drop_zone");
var fileInput = document.getElementById("fileInput");

// Add event listeners
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", handleFileSelect, false);
dropZone.addEventListener(
	"click",
	function () {
		fileInput.click();
	},
	false
);
fileInput.addEventListener("change", handleFileSelect, false);

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files;

	// Check if the files are from a drag event or a file input event
	if (evt.dataTransfer) {
		files = evt.dataTransfer.files; // FileList object.
	} else {
		files = evt.target.files;
	}

	// files is a FileList of File objects. List some properties.
	for (var i = 0, f; (f = files[i]); i++) {
		// Create a new FormData instance
		var formData = new FormData();

		// Add the file to the form data
		formData.append("file", f);

		// Send the form data to the server
		fetch("/upload", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.text())
			.then((result) => fileUploaded(result))
			.catch((error) => console.log("Error:", error));
	}
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = "copy";
}

function fileUploaded(path) {
	document.querySelector(".fileupload").classList.add("hide");
	document.querySelector(".uploaded").classList.remove("hide");
	document.getElementById(
		"linkBox"
	).textContent = `${window.location.href}${path}`;
}

document.querySelector("#linkBox").addEventListener("click", function (event) {
	event.preventDefault();
	navigator.clipboard
		.writeText(event.target.href)
		.then(() => {
			console.log("Link copied to clipboard");
		})
		.catch((err) => {
			console.error("Error in copying text: ", err);
		});
});
