console.log('connected');


  $(document).ready(() => {
  $(".dropdown-button").dropdown();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
  });

var counter = 0;
var limit = 10;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          newdiv.innerHTML = "Player " + (counter + 1) + " <br><input type='text' name='signupPlayers["+ counter +"][name]'> - # of Matches Won <input type='number' name='signupPlayers["+ counter +"][points]'>";
          document.getElementById(divName).appendChild(newdiv);



          counter++;

     }
}
