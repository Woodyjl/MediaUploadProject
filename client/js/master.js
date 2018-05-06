var script = document.createElement('script');

script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

$(function(){
  $("#upload").click(function(){
    window.location.href = "dataInput.html";
  });
});
