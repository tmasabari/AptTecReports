// Show the modal when the button is clicked
function ShowPopup(modalId, title, contenetSelector, saveAction)
{
    if (saveAction)
        $(contenetSelector)[0].saveAction = saveAction;
    $(".modal .modal-footer .btn-primary").css("display", (saveAction) ? "block" : "none");
    // Choose the div you want to display in the modal (e.g., divContent1)
    //var selectedDivContent = $(contenetSelector)[0].outerHTML; 
    // Set the content of the modal with the selected div's content
    const parentSelector = "#" + modalId + " .modal-body";
    //$(parentSelector).html(selectedDivContent);
    $(contenetSelector).appendTo(parentSelector);  //appendTo will automagically remove it from it's previous location
    $("#" + modalId + " " + contenetSelector).css("display", "block");
    $("#" + modalId + " .modal-title").html(title);
    
    // Show the modal
    $("#" + modalId).modal("show");
}

//event handlers============================================================
$('.modal').on('hidden.bs.modal', function ()
{
    const modalElement = $(this).closest(".modal");
    var oldContent = modalElement.find('.modal-body').children(0)
    oldContent.hide();
    //$(".modal .modal-body").html(''); 
})
function hideModal(modalChildElement) {
    const modalElement = modalChildElement.closest(".modal");
    modalElement.modal("hide");
}
// Hide the modal when the close button on top is clicked
// https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
$(document).on('click', ".modal .close", function () {
    hideModal($(this));
});

// Hide the modal when the close button is clicked
$(document).on('click', ".modal .modal-footer .btn-secondary", function () {
    hideModal($(this));
});
// Perform action and Hide the modal when the Save button is clicked
$(document).on('click', ".modal .modal-footer .btn-primary", function ()
{
    const modalElement = $(this).closest(".modal");
    var contentElement = modalElement.find('.modal-body form[style*="display: block"]');
    
    contentElement[0].saveAction();

    hideModal($(this));
});