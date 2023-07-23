// Show the modal when the button is clicked
function ShowPopup(modalId, title, contenetSelector)
{
    // Choose the div you want to display in the modal (e.g., divContent1)
    var selectedDivContent = $(contenetSelector)[0].outerHTML;

    // Set the content of the modal with the selected div's content
    $("#" + modalId + " .modal-body").html(selectedDivContent);
    $("#" + modalId + " " + contenetSelector).css("display", "block");
    $("#" + modalId + " .modal-title").html(title);
    
    // Show the modal
    $("#" + modalId).modal("show");
}

//event handlers============================================================
$(document).on('click', 'hidden.bs.modal', function () {
    $(".modal .modal-body").html('');
})
// Hide the modal when the close button on top is clicked
// https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
$(document).on('click', ".modal .close", function () {
    const modalElement = $(this).closest(".modal");
    modalElement.modal("hide");
});

// Hide the modal when the close button is clicked
$(document).on('click', ".modal .modal-footer .btn-secondary", function () {
    const modalElement = $(this).closest(".modal");
    modalElement.modal("hide");
});