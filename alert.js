function showAlert(t)
{
    const $alert = document.querySelector(".alertarea_in");
    $alert.innerHTML = "<div>" + t + "</div>";

    $(".alertarea_in").finish();

    $(".alertarea_in").animate({opacity: '1'}, 0);
    $(".alertarea_in").animate({opacity: '1'}, 100);
    $(".alertarea_in").animate({opacity: '0'}, 900);
}