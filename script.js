var ROUTES = ['about', 'portfolio', 'resume', 'contact']
var currentRoute = 0;

$(document).ready(function(){
  
  currentRoute = ROUTES.indexOf(location.pathname.slice(1)) + 1 || 1;
  // SET NAV
  var button = $(`nav span:nth-child(${currentRoute})`);
  button.siblings('.page-button').removeClass('active');
  button.addClass('active');
  $('.slider').css({
    left: button.position().left,
    width: button.width()
  });
  // SET PAGE
  onPathChange(ROUTES[--currentRoute]);


  $('.page-button').click(function(e) {
    var target = $(e.target);
    if (ROUTES[currentRoute] === target.text()) return;
    target.siblings('.page-button').removeClass('active');
    target.addClass('active');
    $('.slider').animate({
      left: target.position().left,
      width: target.width()
    }, 700);
    
    var node = $(`#${ROUTES[currentRoute]}`);
    
    node.animate({
      left: '-100vw'
    }, 800, null, function() {
      // go to next
      // if (ROUTES[currentRoute] === 'portfolio') {
      //   $('#portfolio').empty();
      // }
      window.history.pushState(null, null, target.text());
      onPathChange(target.text());
      node.css({left: 0});
    })
  });
  

  function onPathChange(path, animate=false) {
    currentRoute = ROUTES.indexOf(path);
    if (currentRoute === -1) {
      currentRoute = 0;
    } else if (ROUTES[currentRoute] === 'portfolio' && isEmpty($('#portfolio'))) {
      $('#portfolio').load('/portfolio.html', function() {
        $('.expand-btn').click(function(e) {
          var target = $(this).parent().parent();
          var parent = target.parent();
          target.siblings().removeClass('preview-expand');
          if (target.hasClass('preview-expand')) { 
            target.removeClass('preview-expand');
            parent.removeClass('portfolio-page-with-preview');
          } else { 
            target.addClass('preview-expand');
            parent.addClass('portfolio-page-with-preview'); 
          }
        })
      });
    }
    var page = $(`#${ROUTES[currentRoute]}`);
    page.siblings().addClass('page');
    page.removeClass('page');

  }

  
});

function isEmpty( el ){
  return !$.trim(el.html())
}