function showAlert(t)
{
    const $alert = document.querySelector(".alertarea_in");
    $alert.innerHTML = "<div>" + t + "</div>";

    $(".alertarea_in").finish().fadeTo();
    
    $(".alertarea_in").fadeTo(0, 1);
    $(".alertarea_in").fadeTo(100, 1);
    $(".alertarea_in").fadeTo(900, 0);
}