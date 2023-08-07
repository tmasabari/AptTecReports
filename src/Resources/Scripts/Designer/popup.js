// Show the modal when the button is clicked
function ShowPopup(modalId, title, contenetSelector, primaryAction, successAction, dangerAction)
{
    if (primaryAction)
        $(contenetSelector)[0].primaryAction = primaryAction;
    $(".modal .modal-footer .btn-primary").css("display", (primaryAction) ? "block" : "none");

    if (successAction)
        $(contenetSelector)[0].successAction = successAction;
    $(".modal .modal-footer .btn-success").css("display", (successAction) ? "block" : "none");

    if (dangerAction)
        $(contenetSelector)[0].dangerAction = dangerAction;
    $(".modal .modal-footer .btn-danger").css("display", (dangerAction) ? "block" : "none");


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
$(document).on('click', ".modal .modal-footer .btn-light", function () {
    hideModal($(this));
});
// Perform save  action and Hide the modal when the Save button is clicked
$(document).on('click', ".modal .modal-footer .btn-primary", function () {
    invokeModalAction(this, "primaryAction", true);
});


// Perform print action and keep the modal when the Print button is clicked
$(document).on('click', ".modal .modal-footer .btn-success", function () {
    invokeModalAction(this, "successAction", false);
});

// Perform print action and keep the modal when the Print button is clicked
$(document).on('click', ".modal .modal-footer .btn-danger", function () {
    invokeModalAction(this, "dangerAction", true);
});

function invokeModalAction(source, method, isHideModal) {
    const modalElement = $(source).closest(".modal");
    var contentElement = modalElement.find('.modal-body form[style*="display: block"]');

    if ( (contentElement.length > 0) && typeof contentElement[0][method] === 'function') 
        contentElement[0][method]();

    if (isHideModal)
        hideModal($(source));
}