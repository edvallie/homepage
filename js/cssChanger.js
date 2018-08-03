function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeCss(file) {

    $('#primaryCss').attr('href', file);

}

$( document ).ready(function() {

        var style1 = document.getElementById('style1Div');
        var style2 = document.getElementById('style2Div');
        var style3 = document.getElementById('style3Div');
        var style4 = document.getElementById('style4Div');
        var style5 = document.getElementById('style5Div');
        style1Div.style.cursor = 'pointer';
        style2Div.style.cursor = 'pointer';
        style3Div.style.cursor = 'pointer';
        style4Div.style.cursor = 'pointer';
        style5Div.style.cursor = 'pointer';
        $(".colorPicker").click(function(e) {
            cssNumber = e.target.id.replace(/\D/g,'');
            cssFile = 'css/style_' + cssNumber + '.css';
            document.cookie = "cssFile=" + cssFile;
            changeCss(cssFile);
//            $('#primaryCss').attr('href', cssFile);
            console.log(cssFile);
        });
    });


