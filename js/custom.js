$(document).on('click','.navbar-collapse.in',function(e) {
	if( $(e.target).is('a') ) {
		$(this).collapse('hide');
	}
});

$(function () {
	$('#bs-example-navbar-collapse-1').on('shown.bs.collapse', function(e) {
		$('#my_dropdown').dropdown('toggle', 'open').hide();
		console.log('shown:', e);
	});
});


function spiderjam(mym, myd){
	document.write("<a href=mailto:"	+ mym + "&#64;" + myd + ">" + mym + "&#64;" + myd + "</a>");
}

function firefox() {
	var browser=navigator.userAgent.toLowerCase();
	if(browser.indexOf('firefox') > -1) {
		$('#bs-example-navbar-collapse-2').toggle();
	}
}

function reset_menus() {
	sizing($(window).width());
}

// Take action if the request on URI has internal link '#'
function internal_link() {
	var urlArray = window.location.href.split('#');
	if (urlArray.length == 2 && urlArray[1] != "") {
		switch (urlArray[1]) {
			case "intro":        $('#tab-1-content').show(); break;
			case "news":         $('#tab-2-content').show(); break;
			case "publications": $('#tab-3-content').show(); break;
			case "courses":      $('#tab-4-content').show(); break;
			case "awards":       $('#tab-5-content').show(); break;
			case "service":      $('#tab-6-content').show(); break;
			case "contact":      $('#tab-9-content').show(); break;
			default: break;
		}
	}
}

function sizing(windowWidth) {
    //alert(windowWidth);
    if(windowWidth < 1024){ // desktop size
    	$('.twittertop').hide();
    	$('.twitterlow').show();
    } else {
    	$('.twittertop').show();
    	$('.twitterlow').hide();
    }

    if(windowWidth <= 480){ // ipad:768, Nexus10:800, 480
        $('.allshow').hide(); //
        $('.noshow').show();
        $('.expandshow').show();
        $('.collapseshow').hide();
    } else {
    	$('.allshow').show();
    	$('.noshow').hide();
    	$('.expandshow').hide();
    	$('.collapseshow').hide();
    }
}

jQuery(document).ready(function($) {
	var windowWidth = $(window).width();
	$(window).resize(function(){
                                        // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
                                        if ($(window).width() != windowWidth) {
                                        	windowWidth = $(window).width();
                                        	sizing(windowWidth);
                                        }
                                    });
	sizing(windowWidth);
	internal_link();
});


// Google Site Search | Search box
(function() {
	var cx = '012777421281883581498:r3xp4rmwevw';
	var gcse = document.createElement('script');
	gcse.type = 'text/javascript';
	gcse.async = true;
	gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
	'//cse.google.com/cse.js?cx=' + cx;
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(gcse, s);
})();

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-70658068-1', 'auto');
ga('send', 'pageview');



// highlight menu items
$(document).ready(function(){
	$(window).on('scroll', function() {		
		$('.main_content_section').each(function() {			
			if($(window).scrollTop() >= $(this).offset().top) {				
				var id = $(this).attr('id');				
				var navLink = $('#main_menu ul a[href=#'+ id +'] li')				
				if(navLink.length){
					$('#main_menu ul li').removeClass('active');
					navLink.addClass('active');				
				}				
			}
		});
	});
});

//scroll to top
$(document).ready(function() {
	$('body').materialScrollTop({
    // OPTIONS HERE
});
});




//menu toggle


var isMenuOpen = false;
var lastWindowSize = 100000;

$(window).resize(function() {
	var windowSize = $(window).width();	
	if ( windowSize < 800 && lastWindowSize >= 800) {
		isMenuOpen = false;
		closeMenu();
	}else if( windowSize > 800 && lastWindowSize <= 800 ){
		isMenuOpen = true;
		openMenu();
	}

	lastWindowSize = windowSize;

});


$(document).ready(function(){
	$('#menu_toggle_button').click(function(){
		if(isMenuOpen){			
			closeMenu();
		}else{
			openMenu();			
		}
		isMenuOpen = !isMenuOpen;

	})
})

function closeMenu(){
	$('#main_menu').animate({
		marginLeft: -256
	},
	100
	)
}


function openMenu(){
	$('#main_menu').animate({
		marginLeft: 0
	},
	100
	)
}