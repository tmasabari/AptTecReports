addTags($(document)[0], '.ruler-x', '<li></li>', 50);
addTags($(document)[0], '.ruler-y', '<li></li>', 50);

//from ruler library
$(document).on('input', '.ruleEditor', function (eventData) { 
	const element = eventData.target;
	const value = element.type === 'checkbox' ? (element.checked ? 1 : 0) : element.value;
	document.body.style.setProperty(element.name, value + (element.dataset.suffix || ''));
});