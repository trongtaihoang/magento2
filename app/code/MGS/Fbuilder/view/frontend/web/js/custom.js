if (typeof(WEB_URL) == 'undefined') {
	if (typeof(BASE_URL) !== 'undefined') {
		var WEB_URL_AJAX = BASE_URL;
	}else{
		pubUrlAjax = require.s.contexts._.config.baseUrl;
		arrUrlAjax = pubUrlAjax.split('pub/');
		var WEB_URL_AJAX = arrUrlAjax[0];
	}
}

require([
	'jquery',
	'waypoints',
	'mgslightbox'
], function(jQuery){
	(function($) {
		$.fn.appear = function(fn, options) {

			var settings = $.extend({

				//arbitrary data to pass to fn
				data: undefined,

				//call fn only on the first appear?
				one: true,

				// X & Y accuracy
				accX: 0,
				accY: 0

			}, options);

			return this.each(function() {

				var t = $(this);

				//whether the element is currently visible
				t.appeared = false;

				if (!fn) {

					//trigger the custom event
					t.trigger('appear', settings.data);
					return;
				}

				var w = $(window);

				//fires the appear event when appropriate
				var check = function() {

					//is the element hidden?
					if (!t.is(':visible')) {

						//it became hidden
						t.appeared = false;
						return;
					}

					//is the element inside the visible window?
					var a = w.scrollLeft();
					var b = w.scrollTop();
					var o = t.offset();
					var x = o.left;
					var y = o.top;

					var ax = settings.accX;
					var ay = settings.accY;
					var th = t.height();
					var wh = w.height();
					var tw = t.width();
					var ww = w.width();

					if (y + th + ay >= b &&
						y <= b + wh + ay &&
						x + tw + ax >= a &&
						x <= a + ww + ax) {

						//trigger the custom event
						if (!t.appeared) t.trigger('appear', settings.data);

					} else {

						//it scrolled out of view
						t.appeared = false;
					}
				};

				//create a modified fn with some additional logic
				var modifiedFn = function() {

					//mark the element as visible
					t.appeared = true;

					//is this supposed to happen only once?
					if (settings.one) {

						//remove the check
						w.unbind('scroll', check);
						var i = $.inArray(check, $.fn.appear.checks);
						if (i >= 0) $.fn.appear.checks.splice(i, 1);
					}

					//trigger the original fn
					fn.apply(this, arguments);
				};

				//bind the modified fn to the element
				if (settings.one) t.one('appear', settings.data, modifiedFn);
				else t.bind('appear', settings.data, modifiedFn);

				//check whenever the window scrolls
				w.scroll(check);

				//check whenever the dom changes
				$.fn.appear.checks.push(check);

				//check now
				(check)();
			});
		};

		//keep a queue of appearance checks
		$.extend($.fn.appear, {

			checks: [],
			timeout: null,

			//process the queue
			checkAll: function() {
				var length = $.fn.appear.checks.length;
				if (length > 0) while (length--) ($.fn.appear.checks[length])();
			},

			//check the queue asynchronously
			run: function() {
				if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
				$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
			}
		});

		//run checks when these methods are called
		$.each(['append', 'prepend', 'after', 'before', 'attr',
			'removeAttr', 'addClass', 'removeClass', 'toggleClass',
			'remove', 'css', 'show', 'hide'], function(i, n) {
			var old = $.fn[n];
			if (old) {
				$.fn[n] = function() {
					var r = old.apply(this, arguments);
					$.fn.appear.run();
					return r;
				}
			}
		});
		
		$(document).ready(function(){
			$("[data-appear-animation]").each(function() {
				$(this).addClass("appear-animation");
				if($(window).width() > 767) {
					$(this).appear(function() {

						var delay = ($(this).attr("data-appear-animation-delay") ? $(this).attr("data-appear-animation-delay") : 1);

						if(delay > 1) $(this).css("animation-delay", delay + "ms");
						$(this).addClass($(this).attr("data-appear-animation"));
						$(this).addClass("animated");

						setTimeout(function() {
							$(this).addClass("appear-animation-visible");
						}, delay);

					}, {accX: 0, accY: -150});
				} else {
					$(this).addClass("appear-animation-visible");
				}
			});
			
			/* Progress Bar */
			$('.mgs-progressbar .progress').css("width",
				function() {
					return $(this).attr("aria-valuenow") + "%";
				}
			)
			
			/* Progress Circle */
			$('.mgs-progress-circle').each(function(){
				var progressPercent = $(this).attr('progress-to');
				$(this).attr('data-progress', progressPercent);
			});
			
			/* Init first tab when ajax active */
			$('.tab-title-ajax').each(function(){
				$(this).find('a').click();
			});
			
		});
		
		
	})(jQuery);
});

function setLocation(url) {
    require([
        'jquery'
    ], function (jQuery) {
        (function () {
            window.location.href = url;
        })(jQuery);
    });
}

require([
	'jquery',
	'Magento_Ui/js/modal/modal'
], function( $, modal ) {
	$(document).ready(function(){
		$('button.mgs-modal-popup-button').click(
			function(){
				id = $(this).attr('data-button-id');
				var popupContent = $('#mgs_modal_container_'+id).html();
				if ($('#modal_popup_'+id).length) {
					var options = {
						type: 'popup',
						responsive: true,
						innerScroll: true,
						title: '',
						modalClass: 'mgs-modal modal-'+id,
						buttons: []
					};
					var newsletterPopup = modal(options, $('#modal_popup_'+id));
					$('#modal_popup_'+id).trigger('openModal');
					
					$('.modal-'+id+' .pop-sletter-title').insertBefore('.modal-'+id+' .modal-header button');
					$('.modal-'+id+' .action-close').click(function(){
						$('.modal-'+id+' .modal-header .pop-sletter-title').remove();
						setTimeout(function(){ $('.modals-wrapper .modal-'+id).remove(); $('#mgs_modal_container_'+id).html(popupContent) }, 500);
					});
				}
			}
		);
	});
});

function getAjaxProductCollection(catId, attribute, blockType, productNum, blockId, useSlider, perrowDefault, perrowTablet, perrowMobile, numberRow, slideBy, hideName, hideReview, hidePrice, hideAddcart, hideAddwishlist, hideAddcompare, autoPlay, stopAuto, nav, dot, isLoop, hideNav, navTop, navPos, pagPos, isRtl, slideMargin, activeCatLink, CatLink){
	require([
		"jquery",
		"mlazyload"
	], function($){
		if(catId!=''){
			var $contentContainer = $('#'+catId.toString() + blockId.toString());
		}else{
			var $contentContainer = $('#'+attribute.toString() + blockId.toString());
		}
		var tabContent = $contentContainer.html();
		if(tabContent.trim() == ''){
			$contentContainer.addClass('div-loading');
			var requestUrl = WEB_URL_AJAX+'fbuilder/index/ajax';
			$.ajax({
				url: requestUrl,
				data:{
					category_id: catId,
					attribute_type: attribute,
					block_type: blockType,
					limit: productNum,
					block_id: blockId,
					use_slider: useSlider,
					perrow: perrowDefault,
					perrow_tablet: perrowTablet,
					perrow_mobile: perrowMobile,
					number_row: numberRow,
					slide_by: slideBy,
					hide_name:hideName,
					hide_review:hideReview,
					hide_price:hidePrice,
					hide_addcart:hideAddcart,
					hide_addwishlist:hideAddwishlist,
					hide_addcompare:hideAddcompare,
					autoplay: autoPlay,
					stop_auto: stopAuto,
					navigation: nav,
					pagination: dot,
					loop: isLoop,
					hide_nav: hideNav,
					nav_top: navTop,
					navigation_position: navPos,
					pagination_position: pagPos,
					rtl: isRtl,
					slide_margin: slideMargin,
					use_catlink: activeCatLink,
					cat_link: CatLink
				},
				success: function(data) {
						if(data!=''){
							$contentContainer.append(data);
							$contentContainer.removeClass('div-loading');
							$("img.lazy").unveil(25, function(){
								var self = $(this);
								setTimeout(function(){
									self.removeClass('lazy');
									self.parents('.parent_lazy').addClass('lazy_loaded');
								}, 0);
							});
						}
						
					}
			   });
			}
		}
	);
}
