self.addEventListener("mouseup", () => {
	const selection = self.getSelection();
	if (selection && selection.type != "Caret") {
		console.log(selection.toString());
	}
});
