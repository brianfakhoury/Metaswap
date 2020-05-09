function not_validate(url) {
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (pattern.test(url)) {
        return false;
    }
    alert(url + " is not a valid url link!");
    return true;

}

function checkform() {
    if (not_validate(document.getElementById("url").value)) {
        return false;
    } else if (not_validate(document.getElementById("imageURL").value)) {
        return false;
    }
    return true;
}

$(function () {
    $('.form-mini').submit(function (event) {
        event.preventDefault(); // Stops browser from navigating away from page
        var $inputs = $('.form-mini :input');

        // not sure if you wanted this, but I thought I'd add it. get an associative array of just the values.
        var data = {};
        $inputs.each(function () {
            data[this.name] = $(this).val();
        });

        console.log(data);
        // build a json object or do something with the form, store in data

        if (checkform()) {
            $.post('/api/create', data, function (resp) {
                $(".form-mini-container").empty();

                var link = document.createElement("a");
                var refreshButton = document.createElement("button");

                link.href = "https://link.metaswap.in/a/" + resp;
                link.innerHTML = link.href;

                refreshButton.innerHTML = "GO BACK";
                refreshButton.className = "form-last-row go-back";
                refreshButton.style = "margin-top: 50px";
                refreshButton.onclick = function () {
                    location.reload()
                };

                $(".form-mini-container").append(link);
                $(".form-mini-container").append(refreshButton);
            });
        }
    });
});
