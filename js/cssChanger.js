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
            $('#primaryCss').attr('href', cssFile);
            console.log(cssFile);
        });
    });
