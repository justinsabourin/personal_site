var ROUTES = ['about', 'portfolio', 'resume', 'contact']
var ROUTES = {
  'about' : {
    index: 1,
    name: 'about',
  },
  'portfolio' : {
    index: 2,
    name: 'portfolio',
    subroutes: {
      'webeditor': {
        name: 'webeditor',
        index: 1
      },
      'photogallery': {
        name: 'photogallery',
        index: 2
      },
      'storeadmin': {
        name: 'storeadmin',
        index: 3
      },
      'calculator': {
        name: 'calculator',
        index: 4
      },
      'simon': {
        name: 'simon',
        index: 5
      },
      'tictactoe': {
        name: 'tictactoe',
        index: 6
      },
      'pomodoro': {
        name: 'pomodoro',
        index: 7
      },
      'weather': {
        name: 'weather',
        index: 8
      },
      'personalsite': {
        name: 'personalsite',
        index: 9
      }
    }
  },
  'contact' : {
    name: 'contact',
    index: 4
  },
  'resume' : {
    name: 'resume',
    index: 3
  },
}
var currentRoute = {
  index: 1,
  name: 'about',
  sub: undefined
};




$(document).ready(function(){
  
  var match = location.pathname.match(/\/([a-zA-Z]*)(\/([a-zA-Z]*))*/);

  var route = ROUTES[match[1]] || ROUTES['about'];
  currentRoute.index = route.index;
  currentRoute.name = route.name;
  if (route.subroutes && match[3] && route.subroutes[match[3]]) {
    route = route.subroutes[match[3]];
    currentRoute.sub = {
      index: route.index,
      name: route.name
    }
  }
  // SET NAV
  var button = $(`nav span:nth-child(${currentRoute.index})`);
  button.siblings('.page-button').removeClass('active');
  button.addClass('active');
  $('.slider').css({
    left: button.position().left,
    width: button.width()
  });
  // SET PAGE
  onPathChange();

  $('.page-button').click(function(e) {
    var target = $(e.target);
    if (currentRoute.name === target.text()) return;
    target.siblings('.page-button').removeClass('active');
    target.addClass('active');
    $('.slider').animate({
      left: target.position().left,
      width: target.width()
    }, 700);
    
    var node = $(`#${currentRoute.name}`);

    node.animate({
      left: '-100vw'
    }, 800, null, function() {
      // go to next
      
      var route = ROUTES[target.text()] || ROUTES['about'];
      currentRoute = {
        index: route.index,
        name: route.name
      }

      window.history.pushState(currentRoute, null, `/${target.text()}`);
      onPathChange();
      node.css({left: 0});
    })
  });
  

  function onPathChange(animate=false) {
    
    if (currentRoute.name === 'portfolio') {
      if (isEmpty($('#portfolio'))) {
        $('#portfolio').load('/portfolio.html', function() {

          if (currentRoute.sub) {
            var target = $(`.portfolio-item:nth-child(${currentRoute.sub.index})`);
            var parent = target.parent();
            target.addClass('preview-expand');
            parent.addClass('portfolio-page-with-preview'); 
          }
  
          $('.expand-btn').click(function(e) {
            var target = $(this).parent().parent();
            var parent = target.parent();
            target.siblings().removeClass('preview-expand');
            if (target.hasClass('preview-expand')) { 
              target.removeClass('preview-expand');
              parent.removeClass('portfolio-page-with-preview');
              currentRoute.sub = undefined;
              window.history.pushState(currentRoute, null, '/portfolio');
            } else { 
              target.addClass('preview-expand');
              parent.addClass('portfolio-page-with-preview');
              $("html, body").stop().animate({scrollTop:0}, 500, 'swing');

              var targetIndex = target.index() + 1;
              var targetName = Object.values(ROUTES['portfolio'].subroutes).find(route => route.index === targetIndex).name;
              currentRoute.sub = {
                index: route.index,
                name: route.name
              }
              window.history.pushState(currentRoute, null, `/portfolio/${targetName}`);
            }
          })
        });
      } else {
        if (currentRoute.sub) {
          var target = $(`.portfolio-item:nth-child(${currentRoute.sub.index})`);
          var parent = target.parent();
          target.addClass('preview-expand');
          parent.addClass('portfolio-page-with-preview'); 
        } else {
          $('.portfolio-page').removeClass('portfolio-page-with-preview').children().removeClass('preview-expand');
        }
      }
      
    }
    var page = $(`#${currentRoute.name}`);
    page.siblings().addClass('page');
    page.removeClass('page');

  }

  window.onpopstate = function(event) {
    currentRoute = event.state;
    onPathChange();
  };
  
});

function isEmpty( el ){
  return !$.trim(el.html())
}