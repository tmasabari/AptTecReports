//from ruler library
app.addEventListener('input', (e) =>
{
	const input = e.target;
	const value = input.type === 'checkbox' ? (input.checked ? 1 : 0) : input.value;
	document.body.style.setProperty(input.name, value + (input.dataset.suffix || ''));
})