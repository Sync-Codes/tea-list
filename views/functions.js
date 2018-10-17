// Inject Loading Page
$('body').append(`<!-- Loader -->
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
    </div>`)

$(function() {
  $('[data-toggle="popover"]').popover({
    html: true,
    trigger: "hover"
  });
  $('[data-toggle="tooltip"]').tooltip()
  $('body').toggleClass('loaded');
})
// End Injection

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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

function logout() {
  document.cookie = 'bearer=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

function invalid(element) {
  $(element).addClass('is-invalid');
}

function forceLogin() {
  location.replace('https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds')
}

function enableDarkMode() {
  $('body').css('background-color', '#2C2F33').css('color', 'white');
  $('.jumbotron').css('background-color', '#2C2F33').css('color', 'white');
  $('.card').css('background-color', '#2C2F33').css('color', 'white');
  $('.card-text').css('background-color', '#2C2F33').css('color', '#99AAB5')
  $('.btn').removeClass('btn-outline-elegant');
}

function disableDarkMode() {
  $('body').css('background-color', 'white').css('color', '#2C2F33');
  $('.jumbotron').css('background-color', 'white').css('color', '#2C2F33');
  $('.card').css('background-color', 'white').css('color', '#2C2F33');
  $('.card-text').css('background-color', 'white');
  $('.btn').addClass('btn-outline-elegant');
}

function toggleDarkMode() {
  if (getCookie('darkmode') === 'true') {
    disableDarkMode();
    document.cookie = 'darkmode=false';
  } else {
    enableDarkMode();
    document.cookie = 'darkmode=true';
  }
}

// Fetch dark or light mode
if (getCookie('darkmode') === 'false') disableDarkMode();
else enableDarkMode(), document.cookie = 'darkmode=true';

function goto(id) {
  window.location = `https://tea-list.glitch.me/${id}`;
}

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}