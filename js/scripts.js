/*
 * SCRIPTS
 *
 * Made 2013 Rashid Shamsudinov (rash2x).
 * www.rash2x.ru
 */

// includes
$(function(){
	$(".field").on({
		focus: function(e){ $(e.delegateTarget).addClass("focus"); },
		blur : function(e){ if($(this).val()=='') $(e.delegateTarget).removeClass("focus"); }
	}, 'input');

	$("#register-field-password").passField();

	var form = $("#main-form");
	
	form.submit(function(){
		var formValidate = new Validate();
		
		$("input", form).each(function(){  
			formValidate.init(this, 1);
		});

		var title = $(".page-head h3");
		
		if(formValidate.getStatus() == 0) {
			var title = $(".page-head h3");

			$(".page-head").find(".alert").add(title).remove();
			$(".page-head").append(getAlert(formValidate.errorMessage[0].outerHTML, 0));
			
			return false;
		} else {
			// если все ок у меня, кидает сюда ( к тебе ), тут ajax, при success !return false
		}
		
	});

	$("#gift-form").giftForm();

	$("#donate-form").donateForm();

	$("#gift-pers-list input[type='radio']").radio();

	$("#donate-list input[type='radio']").radioDonate();

	$("#donate-list .donate-count-wrapper").customDonate()

	$(".tooltip").tooltip();

	$("#promo-gift-submit").on('click', function(){
		$.ajax({
			url: "url",
			data: {
				id: $("input[type='radio']:checked", form).val()
			},
			success: function(data){
				if(data.status) {
					window.location.href = 'gift_items.html'
				} else {
					var head = $("<div class='page-head'></div>");
					var alert = getAlert(data.message, 0);
					head.html(alert).prepend(".content-inner");
				}
			}
		});

		return false;
	})

});

$.fn.giftForm = function(){
	var form = $(this),
		timer,
		user = $("#gift-field-user"),
		userValue = user.val(),
		list = $("#gift-pers-list"),
		errorMessage,
		giftMessage = $(".page-head").html();


	//удалить при ajax
	var data = {
		"status": 1,
		"message": "erro",
		"roles": [
			{
				"Id":1024,
				"Name":"Mr.Hyde",
				"Used":1
			},
			{
				"Id":1025,
				"Name":"Doc"
			},
			{
				"Id":1026,
				"Name":"Doc."
			},
			{
				"Id":1028,
				"Name":"Mr. Hyde"
			},
			{
				"Id":1029,
				"Name":"root"
			},
			{
				"Id":1030,
				"Name":"rооt"
			}
		]};

	user.on({
		'keyup': function(){
			if(user.val() == userValue) return false;
			clearTimeout(timer);

			timer = setTimeout(function(){
				if(user.val() != '') setStatus(data);
				else setDefault();
			}, 1000);
		},
		'change blur' : function(){
			if(user.val() == userValue) return false;
			clearTimeout(timer);
			if(user.val() != '') setStatus(data);
			else setDefault();
		},
		'focus' : function(){ userValue = user.val(); }
	});

	function setDefault(){
		$("#gift-submit").prop("disabled", true);
		user.parent().add($("#gift-step1"), $("#gift-step2")).removeClass("success error");
		$(".page-head").html(giftMessage);
		$("#gift-step2").fadeOut(300, function(){
			list.html('');
		});
	}

	function setStatus(data) {
		if(data.status) {
			$(".page-head").html(giftMessage);
			user.parent().add($("#gift-step1")).removeClass("error").addClass("success");
			$("#gift-step2").fadeIn(300);

			list.html('');

			$.each(data.roles, function(){
				var obj = this;
				var li = $("<li/>");
				var radio = $("<input type='radio' name='gift-pers' id='gift-pers-"+obj.Id+"' value='"+obj.Id+"'>");
				var label = $("<label for='gift-pers-"+obj.Id+"'>"+obj.Name+"</label>");

				if(obj.Used) radio.add(label).addClass("gift-used");

				li.append(radio, label).appendTo(list);

				radio.radio().on('change', function(){
					var radio = $(this);
					var obj = radio.parents("li");

					$(".gift-used").parents("li").removeClass("error").find(".gift-pers-error-message").remove();
					$("li", list).add("#gift-step2").removeClass("success error");
				
					if(radio.hasClass("gift-used")) {
						obj.append('<div class="gift-pers-error-message">Этот персонаж уже получил подарок!</div>').add("#gift-step2").addClass("error");
						$("#gift-submit").prop("disabled", true);
					} else {
						obj.add("#gift-step2").addClass("success");
						$("#gift-submit").prop("disabled", false);
					}

				});
			});
		} else {
			$("#gift-step2").fadeOut(300).removeClass("success error");
			$("#gift-submit").prop("disabled", true);

			user.parent().add($("#gift-step1")).removeClass("success").addClass("error");

			errorMessage = getAlert(data.message, 0);
			$(".page-head").html(errorMessage);
		}

		// $.ajax({
		// 	url: "url",
		// 	data: {
		// 		value: user.val()
		// 	},
		// 	dataType: "json",
		// 	success: function(data){
		// 		if(data.status) {
		// 			$(".page-head").html(giftMessage);
		// 			user.parent().add($("#gift-step1")).removeClass("error").addClass("success");
		// 			$("#gift-step2").fadeIn(300);

		// 			var list = $("#gift-pers-list");
		// 			list.html('');

		// 			$.each(data.roles, function(){
		// 				var obj = this;
		// 				var li = $("<li/>");
		// 				var radio = $("<input type='radio' name='gift-pers' id='gift-pers-"+obj.Id+"'>");
		// 				var label = $("<label for='gift-pers-"+obj.Id+"'>"+obj.Name+"</label>");

		// 				if(obj.Used) radio.addClass("gift-used");

		// 				li.append(radio, label).appendTo(list);

		// 				radio.radio().on('change', function(){
		// 					var radio = $(this);
		// 					var obj = radio.parents("li");

		// 					$(".gift-used").parents("li").removeClass("error").find(".gift-pers-error-message").remove();
		// 					$("li", list).add("#gift-step2").removeClass("success error");
						
		// 					if(radio.hasClass("gift-used")) {
		// 						obj.append('<div class="gift-pers-error-message">Этот персонаж уже получил подарок!</div>').add("#gift-step2").addClass("error");
		// 						$("#gift-submit").prop("disabled", true);
		// 					} else {
		// 						obj.add("#gift-step2").addClass("success");
		// 						$("#gift-submit").prop("disabled", false);
		// 					}

		// 				});
		// 			});
		// 		} else {
		// 			$("#gift-step2").fadeOut(300).removeClass("success error");
		// 			$("#gift-submit").prop("disabled", true);

		// 			user.parent().add($("#gift-step1")).removeClass("success").addClass("error");

		// 			errorMessage = getAlert(data.message, 0);
		// 			$(".page-head").html(errorMessage);
		// 		}
		// 	};
		// })
	}

	
	$("#gift-submit").on('click', function(){
		$.ajax({
			url: "url",
			data: {
				id: $("#promo-field-gift").val()
			},
			success: function(data){
				if(data.status) {
					window.location.href = 'gift_success.html'
				} else {
					var alert = getAlert(data.message, 0);
					$(".page-head").html(alert);
				}
			}
		});

		return false;
	})
	

};

$.fn.donateForm = function(){
	var form = $(this),
		timer,
		user = $("#donate-field-name"),
		userValue = user.val(),
		list = $("#donate-list"),
		errorMessage,
		donateMessage = $(".page-head").html();


	//удалить при ajax
	var data = {
		"status": 1,
		"message": "erro",
		"roles": [
			{
				"Name":"Mr.Hyde",

				"Id":1024,
				"cost": 100,
				"price": 7
			},
			{
				"Name":"Doc",

				"Id":1025,
				"cost": 1000,
				"price": 75,
				"freeMoney": 500,
				"until" : "25.03.2013",
				
			},
			{
				"Name":"Doc.",

				"Id":1026,
				"cost":5000,
				"price":750,
				"discount":25
			},
			{
				"Name":"Mr. Hyde",

				"Id":1028,
				"price":750,
				"freeMoney": 500,
			}
		]};

	user.on({
		'keyup': function(){
			if(user.val() == userValue) return false;
			clearTimeout(timer);

			timer = setTimeout(function(){
				if(user.val() != '') setStatus(data);
				else setDefault();
			}, 1000);
		},
		'change blur' : function(){
			if(user.val() == userValue) return false;
			clearTimeout(timer);
			if(user.val() != '') setStatus(data);
			else setDefault();
		},
		'focus' : function(){ userValue = user.val(); }
	});

	function setDefault(){
		$("#donate-submit").prop("disabled", true);
		$("#donate-step1 .merchant").show();
		user.parent().add($("#donate-step1"), $("#donate-step2")).removeClass("success error");
		$(".page-head").html(donateMessage);
		$('#donate-list .ui-radio-wrap > input').prop('checked', false).siblings().removeClass("check");
		$('#donate-list li.success').removeClass('success');
		$("#donate-step2").hide()
			.removeClass('success');
	}

	function setStatus(data) {
		if(data.status) {
			$(".page-head").html(donateMessage);
			$("#donate-step1 .merchant").hide();
			user.parent().add($("#donate-step1")).removeClass("error").addClass("success");
			$("#donate-step2").fadeIn(300, function () {
				$(this).removeClass('hide');
			});

			$('#donate-list > li > label').each(function (i, label) {
				var id = 'donate-' + data.roles[i].Id,
					cost = data.roles[i].cost || 'error',
					price = data.roles[i].price || 'error',
					freeMoney = data.roles[i].freeMoney || 'error',
					date = data.roles[i].until || 'error',
					discount = data.roles[i].discount || 'error',

					radio = $(this).parent().find('.ui-radio-wrap > input');

				$(this).find('.cost .val').text(cost);
				$(this).find('.price .val').text(price);
				$(this).find('.until .free .val').text(freeMoney);
				$(this).find('.until .date .val').text(date);
				$(this).find('.discount .val').text(discount);

				radio.on('change', function () {
					$("#donate-submit").prop("disabled", false);
					$("#donate-step2").addClass('success');
					$(this).parents('li').addClass('success')
						.siblings().removeClass('success');
				});

			});

		} else {
			$("#donate-step2").fadeOut(300, function () {
				$(this).removeClass("success error");
			});
			$("#donate-submit").prop("disabled", true);

			user.parent().add($("#donate-step1")).removeClass("success").addClass("error");

			errorMessage = getAlert(data.message, 0);
			$(".page-head").html(errorMessage);
		}

	}
	
	$("#donate-submit").on('click', function(){
		$.ajax({
			url: "url",
			data: {
				id: $("#promo-field-gift").val() /* WTF!? */
			},
			success: function(data){
				if(data.status) {
					window.location.href = 'complete_donate.html'
				} else {
					var alert = getAlert(data.message, 0);
					$(".page-head").html(alert);
				}
			}
		});

		return false;
	});
};
$.fn.radio = function(){
	return this.each(function(){
		var radio = $(this);
		var button = $("<div class='ui-radio'/>");
		var label = $("label[for='"+radio.attr("id")+"']");
		var otherRadio;

		radio.wrap("<div class='ui-radio-wrap'></div>").hide();
		var wrap = radio.parent(".ui-radio-wrap");
		
		button.appendTo(wrap);

		label.add(button).on({
			'mouseenter' : function(){ button.addClass("hover"); },
			'mouseleave' : function(){ button.removeClass("hover"); }
		});

		label.add(button).on('click', function(){
			radio.change();
		});

		radio.on('change', function(){
			otherRadio = $("input[name='"+radio.attr('name')+"']");
			otherRadio.prop('checked', false).siblings().removeClass("check");
			
			if(!radio.prop('checked')) {
				radio.prop('checked', true);
				button.addClass("check");
			}
		})

	});
};
$.fn.radioDonate = function(){
	return this.each(function(){
		var radio = $(this);
		var button = $("<div class='ui-radio'/>");
		var label = $("label[for='"+radio.attr("id")+"']");
		var otherRadio;

		var wrap = radio.parent(".ui-radio-wrap");
		
		button.appendTo(wrap);

		label.add(button).on({
			'mouseenter' : function(){ button.addClass("hover"); },
			'mouseleave' : function(){ button.removeClass("hover"); }
		});

		label.add(button).on('click', function(){
			radio.change();
		});

		radio.on('change', function(){
			otherRadio = $("input[name='"+radio.attr('name')+"']");
			otherRadio.prop('checked', false).siblings().removeClass("check");
			
			if(!radio.prop('checked')) {
				radio.prop('checked', true);
				button.addClass("check");
			}
		})

	});
};
$.fn.customDonate = function(){
	var container = $(this),
		field = $(this).find('input'),

		minValue = container.find('input').data('min'),
		maxValue = container.find('input').data('max'),
		step = container.find('input').data('step'),
		factor = 0.3261,
		inputValue;

	container.find('input').on('focus', function (event) {
		inputValue =  $(this).val();
	})

	.on('blur', function (event) {
		if ($(this).val() === '') {
			$(this).val(inputValue);
		}

		$(this).attr('value', $(this).val())
		.parent().removeClass('focus');

		var resultingVal = $(this).val();
		
		saveValue(resultingVal);
		calculate(resultingVal);
	})

	.on('keydown', function (event) {
		var isDigit = /\d/.test(String.fromCharCode(event.keyCode)),

			BACKSPACE = 8;

		if (!isDigit && !(event.keyCode === BACKSPACE)) {
			return false;
		}
	})

	.on('change', function (event) {
		if ($(this).val() < minValue) {
			$(this).attr('value', minValue);
			$(this).val(minValue);
		}
		else if ($(this).val() > maxValue) {
			$(this).attr('value', maxValue);
			$(this).val(maxValue);

		} else {
			$(this).attr('value', $(this).val());
		}

		var resultingVal = $(this).val();
		
		saveValue(resultingVal);
		calculate(resultingVal);
	});

	container.find('.cout-controller.less').on('click', function (event) {
		var currentVal = (field.val())|0,
			resultingVal = currentVal - step;
			
		if (resultingVal < minValue) {
			resultingVal = minValue;
		}

		saveValue(resultingVal);
		calculate(resultingVal);
	});

	container.find('.cout-controller.next').on('click', function (event) {
		var currentVal = (field.val())|0,
			resultingVal = currentVal + step;

		if (resultingVal > maxValue) {
			resultingVal = maxValue;
		}

		saveValue(resultingVal);
		calculate(resultingVal);
	});

	function saveValue (resultingVal) {
		field.val(resultingVal)
			.attr('value', resultingVal);

		$('input#' + container.parents('label').attr('for')).attr('value', resultingVal);

		field.parent().addClass('success');
	}

	function calculate (resultingVal) {
		var resultCost = resultingVal * factor;

		container.parent().find('.price .val').text(resultCost);
	}
};
(function($, undefined) {

	var tooltips = [],
		mouse = 0;

	$.fn.tooltip = function(){
		return this.each(function(){
			var self = this,
				obj = $(this);

			self.wrap = $("<div class='tooltip-wrap'></div>");
			self.pos = obj.offset();

			tooltips.push(self);
			createTooltip(obj, self);

			obj.on({
				'mouseenter touchstart' : function(){
					mouse = 1;
					showTooltip(self);
					return false;
				},
				'mouseleave' : function(){
					mouse = 0;
					setTimeout(function(){
						if(mouse == 0) hideTooltip(null);
					}, 1000);
				},
				'click' : function(){ return false; }
			});
		});

		function createTooltip(obj, self){
			var html = $(obj).data('tooltip');
			$(self.wrap).html(html).appendTo("body").on({
				'mouseenter touchstart' : function () {
					mouse = 1;
				},
				'mouseleave' : function () {
					mouse = 0;
					console.log('ok');
					setTimeout(function(){
						if(mouse == 0) hideTooltip(null);
					}, 1000);
				}
			});
			setPos(self);
		};

		function setPos(obj){
			var left = $(obj).offset().left - ($(obj.wrap).outerWidth()-$(obj).outerWidth())/2,
				top = $(obj).offset().top - $(obj.wrap).outerHeight() - 50;

			$(obj.wrap).css({
				top: top,
				left: left,
				opacity: 0
			}).hide();
		};

		function showTooltip(obj) {

			setPos(obj);
			hideTooltip(obj);

			$(obj.wrap).show().stop().animate({
				top: $(obj).offset().top - $(obj.wrap).outerHeight() - 20,
				opacity: 1
			});
		}

		function hideTooltip(obj) {
			$.each(tooltips, function(){
				var tooltip = this,
					wrap = obj?obj.wrap:false;

				console.log($(tooltip).offset().top, $(tooltip.wrap).outerHeight());

				$(tooltip.wrap).not(wrap).stop().animate({
					top: $(tooltip).offset().top - $(tooltip.wrap).outerHeight() - 50,
					opacity: 0
				}, function(){ $(this).hide().addClass("tooltip-hide"); })

			});
		}
	}



})(window.jQuery);


function Validate() {
	
	var self = this;
	this.errors = 1;
	this.errorMessage = $("<ul/>");
	this.fields = [];
	
	this.init = function(obj, launch){
		this.obj = obj;
		this.classes = ["error", "success"]; // классы состояний
		this.fieldError = false;
		
		if($(obj).is(":checkbox") || $(obj).is(":radio") || $(obj).is(":hidden")) return false;

		this.checkField();
		this.fields.push($(this.obj));
	};
	
	// функция отдает количество ошибок
	this.getStatus = function(){
		var status = 1;

		$.each($(this.fields), function(){
			if($(this).parent().hasClass("error")) status = 0;
		});

		return status;
	};
	
	// проверка полей на ошибки
	this.checkField = function() {
		// тут объявляем нужные переменные
		this.value = $(this.obj).val();
		this.type = $(this.obj).data('type');
		this.required = $(this.obj).data('required');
		
		//regExp для разных типов
		var email = new RegExp("[0-9a-z_]+@[0-9a-z_^.]+\\.[a-z]{2,3}", 'i');
		
		// проверяем валидацию поля
		if(this.value=="") this.setState(0, ("Заполните пожалуйста поле - <b>"+$(this.obj).attr('placeholder')+"</b>")); // если поле пустое и оно обязательно для заполнения
		else { // для всех остальных случаев
			switch(this.type) {
				case "mail" : 
					if (!email.test(this.value)) this.setState(0, ("Неправильно заполнено поле - <b>"+$(this.obj).attr('placeholder')+"</b>"));
					else this.setState(1, "");
				break;
				case "text" :
					this.setState(1, "");
				break;
			}
		}
	};
	
	this.setState = function(status, message) {
		// 1 - все хорошо, 0 - найдена ошибка

		if (status==0) $(this.obj).parent().addClass("error");
		else $(this.obj).parent().removeClass("error");

		var error = $("<li/>", { html: message }).appendTo(self.errorMessage);
	};
};


function getAlert(content, status, title){
	var alertWrap = $('<div class="alert"><div class="alert-wrap">'+content+'</div></div>');
	
	switch(status) {
		case 0 : alertWrap.addClass("alert-error"); break;
		case 1 : alertWrap.addClass("alert-success"); break;
	}

	if(title) alerWrap.append("<div class='alert-title'>"+title+"</div>");

	return alertWrap;
}

/* ------------------------------------------------
 * jCountdown Plugin for jQuery JavaScript Library
 * v 1.1.1 02/12/2012
 * http://codecanyon.net/user/ufoufoufo
 * Copyright (c) 2012
*/

jQuery.fn.extend({jCountdown:function(){var B=function(b){this._target=b;this._width=50;this._height=64;this._frame=1;this._totalFrames=15;this._fps=24;this._intervalId=-1;this._value=0;this.stop=function(){clearInterval(this._intervalId)};this.update=function(a){if(a){this.frame(1);this.stop();var b=this;this._intervalId=setInterval(function(){b.frame()==b.totalFrames()?(clearInterval(b._intervalId),b.onFinish()):b.frame(b.frame()+1)},Math.ceil(1E3/this.fps()))}else this.frame(this.totalFrames())}; this.value=function(a,b){if(void 0==a)return this._value;this._value=a;this.update(b)};this.onFinish=function(){};this.destroy=function(){this.stop();this._target=null};this.width=function(a){if(void 0==a)return this._width;this._width=a};this.height=function(a){if(void 0==a)return this._height;this._height=a};this.frame=function(a){if(void 0==a)return this._frame;this._frame=a;var a=-(9-this.value())*this.width(),b=-(this.frame()-1)*this.height();this._target.children(".text").css("background-position", a+"px "+b+"px")};this.totalFrames=function(a){if(void 0==a)return this._totalFrames;this._totalFrames=a};this.fps=function(a){if(void 0==a)return this._fps;this._fps=a};this.update(!1)},C=function(b){this._target=b;this._width=50;this._height=64;this._frame=1;this._totalFrames=15;this._fps=24;this._intervalId=-1;this._value=0;this.stop=function(){clearInterval(this._intervalId)};this.update=function(a){if(a){this.frame(1);this.stop();var b=this;this._intervalId=setInterval(function(){b.frame()==b.totalFrames()? (clearInterval(b._intervalId),b.onFinish()):b.frame(b.frame()+1)},Math.ceil(1E3/this.fps()))}else this.frame(this.totalFrames())};this.value=function(a,b){if(void 0==a)return this._value;this._value=a;this.update(b)};this.onFinish=function(){};this.destroy=function(){this.stop();this._target=null};this.width=function(a){if(void 0==a)return this._width;this._width=a};this.height=function(a){if(void 0==a)return this._height;this._height=a};this.frame=function(a){if(void 0==a)return this._frame;this._frame= a;a=-((1+this.value())*this.height())+Math.sin((this.frame()-1)/(this.totalFrames()-1)*Math.PI/2)*this.height();this._target.children(".text").css("background-position","0px "+a+"px")};this.totalFrames=function(a){if(void 0==a)return this._totalFrames;this._totalFrames=a};this.fps=function(a){if(void 0==a)return this._fps;this._fps=a};this.update(!1)},D=function(b){this._target=b;this._height=this._width=60;this._frame=1;this._totalFrames=15;this._fps=24;this._intervalId=-1;this._value=0;this.stop= function(){clearInterval(this._intervalId)};this.update=function(a){if(a){this.frame(1);this.stop();var b=this;this._intervalId=setInterval(function(){b.frame()==b.totalFrames()?(clearInterval(b._intervalId),b.onFinish()):b.frame(b.frame()+1)},Math.ceil(1E3/this.fps()))}else this.frame(this.totalFrames())};this.value=function(a,b){if(void 0==a)return this._value;this._value=a;this.update(b)};this.onFinish=function(){};this.destroy=function(){this.stop();this._target=null};this.width=function(a){if(void 0== a)return this._width;this._width=a};this.height=function(a){if(void 0==a)return this._height;this._height=a};this.frame=function(a){if(void 0==a)return this._frame;this._frame=a;a=this.value()+1;9<a&&(a=0);var b=this.frame()/this.totalFrames(),c;0.4<=b&&0.6>=b?c=0:0.4>=b?c=1-b/0.4:0.6<=b&&(c=(b-0.6)/0.4);a=-(0.5<b?this.value():a)*this.height();a-=3*(1-c);this._target.children(".text").css("background-position","0px "+a+"px").css("opacity",c);this._target.children(".cover").css("opacity",c)};this.totalFrames= function(a){if(void 0==a)return this._totalFrames;this._totalFrames=a};this.fps=function(a){if(void 0==a)return this._fps;this._fps=a};this.update(!1)},E=function(b){this._target=b;this._height=this._width=60;this._heightSmall=this._widthSmall=42;this._frame=1;this._totalFrames=15;this._fps=24;this._intervalId=-1;this._value=0;this.stop=function(){clearInterval(this._intervalId)};this.update=function(a){if(a){this.frame(1);this.stop();var b=this;this._intervalId=setInterval(function(){b.frame()== b.totalFrames()?(clearInterval(b._intervalId),b.onFinish()):b.frame(b.frame()+1)},Math.ceil(1E3/this.fps()))}else this.frame(this.totalFrames())};this.value=function(a,b){if(void 0==a)return this._value;this._value=a;this.update(b)};this.onFinish=function(){};this.destroy=function(){this.stop();this._target=null};this.width=function(a){if(void 0==a)return this._width;this._width=a};this.height=function(a){if(void 0==a)return this._height;this._height=a};this.frame=function(a){if(void 0==a)return this._frame; this._frame=a;var a=-this.value()*this.height(),b=Math.sin((this.frame()-1)/(this.totalFrames()-1)*Math.PI/2);0<b&&0.001>b?b=0:0>b&&-0.001<b&&(b=0);this._target.children(".text").css("background-position","0px "+a+"px").css("opacity",b)};this.totalFrames=function(a){if(void 0==a)return this._totalFrames;this._totalFrames=a};this.fps=function(a){if(void 0==a)return this._fps;this._fps=a};this.update(!1)},y=function(){this._days=[];this._hours=[];this._minutes=[];this._seconds=[];this._tickId=-1;this._tickDelay= 100;this._timeText="";this._timeZone=0;this._time=null;this.checkTime=function(b){var a=new Date;if(this._time.getTime()<a.getTime()+6E4*a.getTimezoneOffset()){for(a=0;a<this._days.length;a++)this._days[a].value(0);for(a=0;a<this._hours.length;a++)this._hours[a].value(0);for(a=0;a<this._minutes.length;a++)this._minutes[a].value(0);for(a=0;a<this._seconds.length;a++)this._seconds[a].value(0);this.stop();this.onFinish();return!0}var c=this.timeFormat(this._time.getTime()-(a.getTime()+6E4*a.getTimezoneOffset()), this._days.length,this._hours.length,this._minutes.length,this._seconds.length).split("");if(!isNaN(this._time)){for(a=0;a<this._days.length;a++){var d=parseInt(c.shift(),10);d!=this._days[a].value()&&this._days[a].value(d,b)}for(a=0;a<this._hours.length;a++)d=parseInt(c.shift(),10),d!=this._hours[a].value()&&this._hours[a].value(d,b);for(a=0;a<this._minutes.length;a++)d=parseInt(c.shift(),10),d!=this._minutes[a].value()&&this._minutes[a].value(d,b);for(a=0;a<this._seconds.length;a++)d=parseInt(c.shift(), 10),d!=this._seconds[a].value()&&this._seconds[a].value(d,b)}return!1};this.textFormat=function(b,a,c){for(b=b.toString();b.length<a;)b=c+b;b.length>a&&(b=b.substr(b.length-a,a));return b};this.timeFormat=function(b,a,c,d,e){var b=Math.floor(b/1E3),f=b%60,g=Math.floor(b%3600/60),h=Math.floor(b%86400/3600);return this.textFormat(Math.floor(b/86400),a,"0")+this.textFormat(h,c,"0")+this.textFormat(g,d,"0")+this.textFormat(f,e,"0")};this.start=function(){this.stop();for(var b=0;b<this._days.length;b++)this._days[b].update(); for(b=0;b<this._hours.length;b++)this._hours[b].update();for(b=0;b<this._minutes.length;b++)this._minutes[b].update();for(b=0;b<this._seconds.length;b++)this._seconds[b].update();if(!this.checkTime(!1)){var a=this;this._tickId=setInterval(function(){a.checkTime(!0)},this._tickDelay)}};this.stop=function(){for(var b=0;b<this._days.length;b++)this._days[b].stop();for(b=0;b<this._hours.length;b++)this._hours[b].stop();for(b=0;b<this._minutes.length;b++)this._minutes[b].stop();for(b=0;b<this._seconds.length;b++)this._seconds[b].stop(); clearInterval(this._tickId)};this.onFinish=function(){};this.destroy=function(){for(var b=0;b<this._days.length;b++)this._days[b].destroy();for(b=0;b<this._hours.length;b++)this._hours[b].destroy();for(b=0;b<this._minutes.length;b++)this._minutes[b].destroy();for(b=0;b<this._seconds.length;b++)this._seconds[b].destroy();this._days=[];this._hours=[];this._minutes=[];this._seconds=[];this.stop()};this.items=function(b,a,c,d){this._days=b;this._hours=a;this._minutes=c;this._seconds=d};this.timeText= function(b){if(void 0==b)return this._timeText;this._timeText=b;this.time(this.timeText(),this.timeZone())};this.timeZone=function(b){if(void 0==b)return this._timeZone;this._timeZone=b;this.time(this.timeText(),this.timeZone())};this.time=function(b,a){this._timeText=b;this._timeZone=a;var c=this._timeText.split("/").join(" ").split(":").join(" ").split(" "),d=parseInt(c[0],10),e=parseInt(c[1],10)-1,f=parseInt(c[2],10),g=parseInt(c[3],10),h=parseInt(c[4],10)-60*this._timeZone,c=parseInt(c[5],10); this._time=new Date(d,e,f,g,h,c,0);this.start()}},v=function(){return q.data("countdown")},t=function(){void 0!=v()&&(v().destroy(),q.removeData("countdown"))};if(0<arguments.length){var q=this,m=v();if(1==arguments.length&&"object"==typeof arguments[0]){void 0!=m&&(t(),q.children().remove());var e=arguments[0];void 0==v()?(m=new y,q.data("countdown",m),m=v()):m=void 0;var j=parseInt(jQuery.browser.version,10),y="string"==typeof e.timeText?e.timeText:"",t=parseFloat(e.timeZone);isNaN(t)&&(t=0);var i= "string"==typeof e.style?e.style.toLowerCase():"";switch(i){case "flip":break;case "slide":break;case "crystal":break;case "metal":break;default:i="flip"}var k="string"==typeof e.color?e.color.toLowerCase():"";switch(k){case "black":break;case "white":break;default:k="black"}var d=parseInt(e.width,10);10<=d||(d=0);var n=parseInt(e.textGroupSpace,10);0<=n||(n=15);var p=parseInt(e.textSpace,10);0<p||(p=0);var u=!1!=e.reflection,r=parseFloat(e.reflectionOpacity);0<r?100<r&&(r=100):r=10;var l=parseInt(e.reflectionBlur, 10);0<l?10<l&&(l=10):l=0;var g=2<parseInt(e.dayTextNumber,10)?parseInt(e.dayTextNumber,10):2,h=!1!=e.displayDay,A=!1!=e.displayHour,z=!1!=e.displayMinute,x=!1!=e.displaySecond,w=!1!=e.displayLabel,e="function"==typeof e.onFinish?e.onFinish:function(){},c,f="",s="";c='<div class="jCountdown">';if(h){c+='<div class="group day'+(!A&&!z&&!x?" lastItem":"")+'">';for(h=0;h<g;h++){f=" item"+(h+1);s=h==g-1?" lastItem":"";c+='<div class="container'+f+s+'">';if("slide"==i||"crystal"==i||"metal"==i)c+='<div class="cover"></div>'; c+='<div class="text"></div>';c+="</div>"}w&&(c+='<div class="label"></div>');c+="</div>"}if(A){c+='<div class="group hour'+(!z&&!x?" lastItem":"")+'">';for(h=0;2>h;h++){f=" item"+(h+1);s=1==h?" lastItem":"";c+='<div class="container'+f+s+'">';if("slide"==i||"crystal"==i||"metal"==i)c+='<div class="cover"></div>';c+='<div class="text"></div>';c+="</div>"}w&&(c+='<div class="label"></div>');c+="</div>"}if(z){c+='<div class="group minute'+(!x?" lastItem":"")+'">';for(h=0;2>h;h++){f=" item"+(h+1);s= 1==h?" lastItem":"";c+='<div class="container'+f+s+'">';if("slide"==i||"crystal"==i||"metal"==i)c+='<div class="cover"></div>';c+='<div class="text"></div>';c+="</div>"}w&&(c+='<div class="label"></div>');c+="</div>"}if(x){c+='<div class="group second lastItem">';for(h=0;2>h;h++){f=" item"+(h+1);s=1==h?" lastItem":"";c+='<div class="container'+f+s+'">';if("slide"==i||"crystal"==i||"metal"==i)c+='<div class="cover"></div>';c+='<div class="text"></div>';c+="</div>"}w&&(c+='<div class="label"></div>'); c+="</div>"}q.html(c+"</div>");g=q.children(".jCountdown");g.addClass(i);g.addClass(k);g.children(".group").css("margin-right",n+"px");g.children(".group.lastItem").css("margin-right","0px");g.children(".group").children(".container").css("margin-right",p+"px");g.children(".group").children(".container.lastItem").css("margin-right","0px");u&&!(jQuery.browser.msie&&10>j)&&(reflectionObject=g.clone(),reflectionObject.addClass("reflection"),w&&reflectionObject.addClass("displayLabel"),100!=r&&reflectionObject.css("opacity", r/100),0!=l&&reflectionObject.addClass("blur"+l),g=g.add(reflectionObject));f=jQuery('<div class="jCountdownContainer"></div>');f.append(g);q.append(f);0!=d&&(k=jQuery('<div class="jCountdownScale"></div>'),k.append(g),f.append(k),n=k.width(),p=k.height(),d/=n,u=-(1-d)*n/2,r=-(1-d)*p/2,l="scale("+d+")",f.width(n*d),f.height(p*d),jQuery.browser.msie&&8>=j?k.css("zoom",d):(k.css("transform",l).css("-moz-transform",l).css("-webkit-transform",l).css("-o-transform",l).css("-ms-transform",l),k.css("left", u).css("top",r)));j="";d=0;k=[];n=[];p=[];u=[];f=function(){};switch(i){case "flip":f=B;break;case "slide":f=C;break;case "crystal":f=E;break;case "metal":f=D}d=1;for(j=".group.day>.container.item";g.find(j+d).length;)k.push(new f(g.find(j+d))),d++;d=1;for(j=".group.hour>.container.item";g.find(j+d).length;)n.push(new f(g.find(j+d))),d++;d=1;for(j=".group.minute>.container.item";g.find(j+d).length;)p.push(new f(g.find(j+d))),d++;d=1;for(j=".group.second>.container.item";g.find(j+d).length;)u.push(new f(g.find(j+ d))),d++;m.items(k,n,p,u);m.onFinish=e;m.time(y,t)}else if("string"==typeof arguments[0]&&void 0!=m)switch(arguments[0]){case "stop":m.stop();break;case "start":m.start();break;case "destroy":t(),q.children().remove()}}return this}});


/* -----------------------------------
 Pass*Field v1.1.0 
 * (c) 2013 Antelle
 * https://github.com/antelle/passfield/blob/master/MIT-LICENSE.txt
 */

(function(h,w,x,Z){var n=x.PassField={};n.Config={};n.CharTypes={DIGIT:"digits",LETTER:"letters",LETTER_UP:"letters_up",SYMBOL:"symbols",UNKNOWN:"unknown"};n.CheckModes={MODERATE:0,STRICT:1};n.Config={defaults:{pattern:"abcdef12",acceptRate:0.8,allowEmpty:!0,isMasked:!0,showToggle:!0,showGenerate:!0,showWarn:!0,showTip:!0,tipPopoverStyle:{},strengthCheckTimeout:500,validationCallback:null,blackList:[],locale:"",localeMsg:{},warnMsgClassName:"help-inline",errorWrapClassName:"a-error",allowAnyChars:!0,
checkMode:n.CheckModes.MODERATE,chars:{digits:"1234567890",letters:"abcdefghijklmnopqrstuvwxyzßабвгедёжзийклмнопрстуфхцчшщъыьэюяґєåäâáàéèêíìїóòöüúùý",letters_up:"ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГЕДЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯҐЄÅÄÂÁÀÉÈÊÍÌЇÓÒÖÜÚÙÝ",symbols:"@#$%^&*()-_=+[]{};:<>/?!"}},locales:{en:{lower:!0,msg:{pass:"password",and:"and",showPass:"Show password",hidePass:"Hide password",genPass:"Random password",passTooShort:"password is too short (min. length: {})",noCharType:"password must contain {}",
digits:"digits",letters:"letters",letters_up:"letters in UPPER case",symbols:"symbols",inBlackList:"password is in list of top used passwords",passRequired:"password is required",badChars:"password contains bad characters: “{}”",weakWarn:"weak",invalidPassWarn:"*",weakTitle:"This password is weak",generateMsg:"To generate a strong password, click {} button."}},de:{lower:!1,msg:{pass:"Passwort",and:"und",showPass:"Passwort anzeigen",hidePass:"Passwort verbergen",genPass:"Zufallspasswort",passTooShort:"Passwort ist zu kurz (Mindestlänge: {})",
noCharType:"Passwort muss {} enthalten",digits:"Ziffern",letters:"Buchstaben",letters_up:"Buchstaben in GROSSSCHRIFT",symbols:"Symbole",inBlackList:"Passwort steht auf der Liste der beliebtesten Passwörter",passRequired:"Passwort wird benötigt",badChars:"Passwort enthält ungültige Zeichen: “{}”",weakWarn:"Schwach",invalidPassWarn:"*",weakTitle:"Dieses Passwort ist schwach",generateMsg:"Klicken Sie auf den {}-Button, um ein starkes Passwort zu generieren."}},fr:{lower:!0,msg:{pass:"mot de passe",and:"et",
showPass:"Montrer le mot de passe",hidePass:"Cacher le mot de passe",genPass:"Mot de passe aléatoire",passTooShort:"le mot de passe est trop court (min. longueur: {})",noCharType:"le mot de passe doit contenir des {}",digits:"chiffres",letters:"lettres",letters_up:"lettres en MAJUSCULES",symbols:"symboles",inBlackList:"le mot de passe est dans la liste des plus utilisés",passRequired:"le mot de passe est requis",badChars:"le mot de passe contient des caractères incorrects: “{}”",weakWarn:"faible",
invalidPassWarn:"*",weakTitle:"Ce mot de passe est faible",generateMsg:"Pour créer un mot de passe fort cliquez sur le bouton."}},it:{lower:!1,msg:{pass:"password",and:"e",showPass:"Mostra password",hidePass:"Nascondi password",genPass:"Password casuale",passTooShort:"la password è troppo breve (lunghezza min.: {})",noCharType:"la password deve contenere {}",digits:"numeri",letters:"lettere",letters_up:"lettere in MAIUSCOLO",symbols:"simboli",inBlackList:"la password è nella lista delle password più usate",
passRequired:"è necessaria una password",badChars:"la password contiene caratteri non accettati: “{}”",weakWarn:"debole",invalidPassWarn:"*",weakTitle:"Questa password è debole",generateMsg:"Per generare una password forte, clicca sul tasto {}."}},ru:{lower:!0,msg:{pass:"пароль",and:"и",showPass:"Показать пароль",hidePass:"Скрыть пароль",genPass:"Случайный пароль",passTooShort:"пароль слишком короткий (мин. длина: {})",noCharType:"в пароле должны быть {}",digits:"цифры",letters:"буквы",letters_up:"буквы в ВЕРХНЕМ регистре",
symbols:"символы",inBlackList:"этот пароль часто используется в Интернете",badChars:"в пароле есть недопустимые символы: «{}»",weakWarn:"слабый",passRequired:"пароль обязателен",invalidPassWarn:"*",weakTitle:"Пароль слабый, его легко взломать",generateMsg:"Чтобы сгенерировать пароль, нажмите кнопку {}."}},ua:{lower:!0,msg:{pass:"пароль",and:"i",showPass:"Показати пароль",hidePass:"Сховати пароль",genPass:"Випадковий пароль",passTooShort:"пароль є занадто коротким (мiн. довжина: {})",noCharType:"пароль повинен містити {}",
digits:"цифри",letters:"букви",letters_up:"букви у ВЕРХНЬОМУ регістрі",symbols:"cимволи",inBlackList:"пароль входить до списку паролей, що використовуються найчастіше",passRequired:"пароль є обов'язковим",badChars:"пароль містить неприпустимі символи: «{}»",weakWarn:"слабкий",invalidPassWarn:"*",weakTitle:"Цей пароль є слабким",generateMsg:"Щоб ​​створити надійний пароль, натисніть кнопку {}."}},es:{lower:!0,msg:{pass:"contraseña",and:"y",showPass:"Mostrar contraseña",hidePass:"Ocultar contraseña",
genPass:"Contraseña aleatoria",passTooShort:"contraseña demasiado corta (longitud mín.: {})",noCharType:"la contraseña debe contener {}",digits:"dígitos",letters:"letras",letters_up:"letras en MAYÚSCULAS",symbols:"símbolos",inBlackList:"la contraseña está en la lista de las contraseñas más usadas",passRequired:"se requiere contraseña",badChars:"la contraseña contiene caracteres no permitidos: “{}”",weakWarn:"débil",invalidPassWarn:"*",weakTitle:"Esta contraseña es débil",generateMsg:"Para generar una contraseña segura, haga clic en el botón de {}."}},
el:{lower:!0,msg:{pass:"πρόσβασης",and:"και",showPass:"Προβολή κωδικού πρόσβασης",hidePass:"Απόκρυψη κωδικού πρόσβασης",genPass:"Τυχαίος κωδικός πρόσβασης",passTooShort:"ο κωδικός πρόσβασης είναι πολύ μικρός (ελάχιστο μήκος: {})",noCharType:"ο κωδικός πρόσβασης πρέπει να περιέχει {}",digits:"ψηφία",letters:"λατινικά γράμματα",letters_up:"λατινικά γράμματα με ΚΕΦΑΛΑΙΑ",symbols:"σύμβολα",inBlackList:"ο κωδικός πρόσβασης βρίσκεται σε κατάλογο δημοφιλέστερων κωδικών",passRequired:"απαιτείται κωδικός πρόσβασης",
badChars:"ο κωδικός περιέχει μη επιτρεπτούς χαρακτήρες: “{}”",weakWarn:"αδύναμος",invalidPassWarn:"*",weakTitle:"Αυτός ο κωδικός πρόσβασης είναι αδύναμος",generateMsg:"Για να δημιουργήσετε δυνατό κωδικό πρόσβασης, κάντε κλικ στο κουμπί {}."}}},blackList:"password 123456 12345678 abc123 qwerty monkey letmein dragon 111111 baseball iloveyou trustno1 1234567 sunshine master 123123 welcome shadow ashley football jesus michael ninja mustang password1 p@ssw0rd miss root secret".split(" "),generationChars:{digits:"1234567890",
letters:"abcdefghijklmnopqrstuvwxyz",letters_up:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"},dataAttr:"PassField.Field"};n.Field=function(b,f){function y(){a.genBtn&&(a.genBtn.style.display=U||G&&!V?"block":"none");a.maskBtn&&(a.maskBtn.style.display=U||G&&!W?"block":"none");if(d.showTip)if(a.tip)a.tip.style.display=J&&G?"block":"none";else if(J&&G){if(!K||L!=K){var e=h(a.mainInput).data("popover").options,c=e.animation;e.animation=!1;h(a.mainInput).popover("show");K=L;e.animation=c}}else K&&(K=null,h(a.mainInput).popover("hide"));
e=g.extend(M(s?a.mainInput:a.clearInput),X(s?a.mainInput:a.clearInput));c=l();a.maskBtn&&"none"!=a.maskBtn.style.display&&(c+=r(a.maskBtn,"width"),S(a.maskBtn,{top:e.top,left:e.left+e.width-c,height:e.height}));a.genBtn&&"none"!=a.genBtn.style.display&&(c+=r(a.genBtn,"width"),S(a.genBtn,{top:e.top,left:e.left+e.width-c,height:e.height}),a.genBtnInner.style.marginTop=Math.max(0,Math.round((e.height-19)/2))+"px");a.placeholder&&"none"!=a.placeholder.style.display&&S(a.placeholder,{top:e.top,left:e.left+
7,height:e.height});a.tip&&"none"!=a.tip.style.display&&S(a.tip,{left:e.left,top:e.top+e.height,width:e.width})}function l(){var e=r(s?a.mainInput:a.clearInput,"paddingRight");return Math.max(fa,e)}function ga(){(s?a.mainInput:a.clearInput).focus()}function z(e){var c="mouseover"===e.type;e=e.relatedTarget?e.relatedTarget:c?e.fromElement:e.toElement;if(!e||!e.id||!(0==e.id.indexOf(H+"btn")||e===a.mainInput||e===a.clearInput))U=c,y()}function $(){var e;e=s?a.clearInput.value=a.mainInput.value:a.mainInput.value=
a.clearInput.value;0<d.strengthCheckTimeout&&!J?(A&&clearTimeout(A),A=setTimeout(T,d.strengthCheckTimeout)):T();a.placeholder&&!e&&(a.placeholder.style.display="block");aa()}function aa(){if(a.passLengthChecker){var e=s?a.mainInput.value.replace(/./g,N.passSymbol):a.clearInput.value;E(a.passLengthChecker,e);var c=a.passLengthChecker.offsetWidth,c=c+r(a.mainInput,"paddingLeft"),b=0,d=0,k=X(s?a.mainInput:a.clearInput).width,e=!1,g=l();a.maskBtn&&(b=r(a.maskBtn,"width"),d=c>k-b-g,W!=d&&(e=!0,W=d));a.genBtn&&
(d=r(a.genBtn,"width"),c=c>k-b-d-g,V!=c&&(e=!0,V=c));e&&y()}}function ha(){a.placeholder&&(a.placeholder.style.display="none")}function ba(){O&&(clearTimeout(O),O=null);I&&(clearTimeout(I),I=null);G=!0;y()}function ia(){O=setTimeout(function(){O=null;G=!1;y();d.isMasked&&!I&&(I=setTimeout(function(){I=null;P(!0,!1)},1500))},100)}function P(e,c){c===Z&&(c=!0);e=e===Z?!s:!!e;var b=u(s?a.mainInput:a.clearInput,"display")||"block",d=e?a.clearInput:a.mainInput,k=e?a.mainInput:a.clearInput;a.maskBtn&&(E(a.maskBtn,
e?"abc":"&bull;&bull;&bull;"),a.maskBtn.title=e?p.msg.showPass:p.msg.hidePass);s!=e&&g.each("paddingRight width backgroundImage backgroundPosition backgroundRepeat backgroundAttachment border".split(" "),function(a){var e=d.style[a];e&&(k.style[a]=e)});var f;f="number"===typeof d.selectionStart&&"number"===typeof d.selectionEnd?{start:d.selectionStart,end:d.selectionEnd}:null;k.style.display=b;d.style.display="none";k.value=d.value;c&&(f&&("number"===typeof k.selectionStart&&"number"===typeof k.selectionEnd)&&
(k.selectionStart=f.start,k.selectionEnd=f.end),k.focus());a.mainInput.nextSibling!=a.clearInput&&C(a.mainInput,a.clearInput);s=e;aa();y()}function T(){A&&(clearTimeout(A),A=null);var e=s?a.mainInput.value:a.clearInput.value,c,b=Y(d.pattern,n.CharTypes.SYMBOL),f=Y(e,d.allowAnyChars?n.CharTypes.SYMBOL:n.CharTypes.UNKNOWN),k=[],h=0;g.each(b,function(a){h++;if(!f[a]){var e=p.msg[a];a==n.CharTypes.SYMBOL&&(a=d.chars[a],4<a.length&&(a=a.substring(0,4)),e=e+" ("+a+")");k.push(e)}});c=1-k.length/h;if(k.length){for(var j=
k[0],l=1;l<k.length;l++)j=l==k.length-1?j+(" "+p.msg.and+" "):j+", ",j+=k[l];k=[p.msg.noCharType.replace("{}",j)]}if(d.checkMode==n.CheckModes.MODERATE){var q=0;g.each(f,function(a){b[a]||q++});c+=q/h}j=e.length/d.pattern.length-1;0>j?(c+=j,k.push(p.msg.passTooShort.replace("{}",d.pattern.length.toString()))):d.checkMode==n.CheckModes.MODERATE&&(c+=j/h);0>c&&(c=0);1<c&&(c=1);c={strength:c,messages:k,charTypes:f};if(0==e.length)c={strength:d.allowEmpty?0:null,messages:[p.msg.passRequired]};else{!d.allowAnyChars&&
c.charTypes[n.CharTypes.UNKNOWN]&&(c={strength:null,messages:[p.msg.badChars.replace("{}",c.charTypes[n.CharTypes.UNKNOWN])]});delete c.charTypes;var z=!1;g.each(d.blackList,function(a){return a==e?(z=!0,!1):!0});z&&(c={strength:0,messages:[p.msg.inBlackList]})}if("function"===typeof d.validationCallback){var j=d.validationCallback(a.mainInput,c),m,t;j&&(j.messages&&g.isArray(j.messages))&&(m=j.messages);if(j&&Object.prototype.hasOwnProperty.call(j,"strength")&&("number"===typeof j.strength||null===
j.strength))t=j.strength;m&&m.length?(c.messages=m,c.strength=t):t&&t>c.strength&&(c.strength=t)}if(0==e.length&&d.allowEmpty)return ca(),F={strength:0},!0;if(null===c.strength||c.strength<d.acceptRate){m=c.strength;t=c.messages;j=c="";if(null===m)c=p.msg.invalidPassWarn,j=t[0].charAt(0).toUpperCase()+t[0].substring(1);else if(c=p.msg.weakWarn,j="",t)for(l=0;l<t.length;l++){var r=t[l].charAt(0);0==l?(j+=p.msg.weakTitle+": ",p.lower&&(r=r.toLowerCase())):(j+="<br/>",r=r.toUpperCase());(j+=r+t[l].substring(1))&&
"."!=j.charAt(j.length-1)&&(j+=".")}j&&"."!=j.charAt(j.length-1)&&(j+=".");F={strength:m,message:j};a.warnMsg&&(E(a.warnMsg,c),a.warnMsg.title=j,d.errorWrapClassName&&D(a.wrapper,d.errorWrapClassName,!0));d.showTip&&(m=j,a.genBtn&&(m+="<br/>"+p.msg.generateMsg.replace("{}",'<div class="'+(H+"btn-gen-help")+'"></div>')),L=m,a.tipBody&&E(a.tipBody,m));J=!0;y();return!1}ca();F={strength:c.strength};return!0}function ca(){if(a.warnMsg&&(E(a.warnMsg,""),a.warnMsg.title="",d.errorWrapClassName)){var e=
a.wrapper,c=d.errorWrapClassName;da(e,c,!0)&&(e.className=(" "+e.className+" ").replace(c+" ","").replace(/^\s+|\s+$/g,""))}L=null;J=!1;y()}function Y(a,c){for(var b={},f=0;f<a.length;f++){var k=a.charAt(f),l=c;g.each(d.chars,function(a,e){return 0<=e.indexOf(k)?(l=a,!1):!0});b[l]=(b[l]||"")+k}return b}function m(a,c,b){c.id&&(c.id=H+c.id+"-"+Q);c.className&&(c.className=H+c.className);return g.newEl(a,c,b)}function ea(a){try{return a.getBoundingClientRect()}catch(c){return{top:0,left:0}}}function M(a){var c=
a.ownerDocument;if(!c)return{top:0,left:0};a=ea(a);return{top:a.top+(x.pageYOffset||0)-(c.documentElement.clientTop||0),left:a.left+(x.pageXOffset||0)-(c.documentElement.clientLeft||0)}}function X(a){return{width:a.offsetWidth,height:a.offsetHeight}}function S(a,c){var b,d;c.height&&!isNaN(c.height)&&(a.style.height=c.height+"px",a.style.lineHeight=c.height+"px");c.width&&!isNaN(c.width)&&(a.style.width=c.width+"px");if(c.top||c.left)if("none"==u(a,"display"))a.style.top=c.top+"px",a.style.left=c.left+
"px";else{var k,g;g=M(a);k=u(a,"top")||0;d=u(a,"left")||0;if(-1<(k+d+"").indexOf("auto")){k={top:0,left:0};if("fixed"===u(a,"position"))d=ea(a);else{try{b=a.offsetParent}catch(f){}b||(b=w.documentElement);for(;b&&"html"!=b.nodeName.toLowerCase()&&"static"===u(b,"position");)b=b.offsetParent;b=b||w.documentElement;d=M(a);"html"!=b.nodeName.toLowerCase()&&(k=M(b));k.top+=r(b,"borderTopWidth");k.left+=r(b,"borderLeftWidth")}b=d.top-k.top-r(a,"marginTop");d=d.left-k.left-r(a,"marginLeft");k=b}else k=
parseFloat(k)||0,d=parseFloat(d)||0;c.top&&(a.style.top=c.top-g.top+k+"px");c.left&&(a.style.left=c.left-g.left+d+"px")}}function u(a,c){var b="function"===typeof x.getComputedStyle?x.getComputedStyle(a,null):a.currentStyle;return b?b[c]:null}function r(a,c){var b=u(a,c);if(!b)return 0;b=parseFloat(b);return isNaN(b)?0:b}function C(a,c){a.parentNode&&a.parentNode.insertBefore(c,a.nextSibling)}function E(a,c){try{a.innerHTML=c}catch(b){var d=w.createElement("c");for(d.innerHTML=c;a.firstChild;)a.removeChild(a.firstChild);
a.appendChild(d)}}function D(a,c,b){da(a,c,b)||(a.className=a.className+(a.className?" ":"")+(!0===b?c:H+c))}function da(a,c,b){c=" "+(!0===b?c:H+c)+" ";return-1<(" "+a.className+" ").replace(/[\n\t]/g," ").indexOf(c)}var R=n.Config,a={},d=g.extend({},R.defaults,f),s=!0,p,Q,A,O,I,J=!1,F=null,N,U=!1,G=!1,V=!1,W=!1,K=!1,L=null,H="a_pf-",fa=5;this.toggleMasking=function(a){P(a)};this.setPass=function(b){a.mainInput.value=b;a.clearInput.value=b;$()};this.validatePass=T;this.getPassValidationMessage=function(){return F?
F.message:null};this.getPassStrength=function(){return F?F.strength:-1};d.showGenerate&&!d.showToggle&&(d.isMasked=!1);d.blackList=(d.blackList||[]).concat(n.Config.blackList);"string"==typeof b&&(b=w.getElementById(b));a.mainInput=b;if(a.mainInput){var q=d.locale;!q&&navigator.language&&(q=navigator.language.replace(/\-.*/g,""));q&&(p=R.locales[q]);p&&(p=g.extend({},R.locales.en,p));p||(p=g.extend({},R.locales.en));d.localeMsg&&g.extend(p.msg,d.localeMsg);Q=a.mainInput.id;Q||(Q="i"+Math.round(1E5*
Math.random()),a.mainInput.id=Q);q=!0;"placeholder"in w.createElement("input")||(q=!1);var B=w.createElement("div");B.setAttribute("style","display:inline-block");B.style.paddingLeft=B.style.width="1px";w.body.appendChild(B);var v=2==B.offsetWidth,ja="inline-block"===u(B,"display");w.body.removeChild(B);B=0<=navigator.userAgent.indexOf("AppleWebKit")||0<=navigator.userAgent.indexOf("Opera")||0<=navigator.userAgent.indexOf("Firefox")&&0<=navigator.platform.indexOf("Mac")?"•":"●";N={placeholders:q,
boxModel:v,hasInlineBlock:ja,passSymbol:B};q=g.extend(M(a.mainInput),X(a.mainInput));q.top+=r(a.mainInput,"marginTop");a.wrapper=a.mainInput.parentNode;D(a.wrapper,"wrap");N.hasInlineBlock||D(a.wrapper,"wrap-no-ib");"static"==u(a.wrapper,"position")&&(a.wrapper.style.position="relative");a.clearInput=m("input",{type:"text",id:"txt-clear",className:"txt-clear",value:a.mainInput.value},{display:"none"});(v=a.mainInput.className)&&D(a.clearInput,v,!0);if(v=a.mainInput.style.cssText)a.clearInput.style.cssText=
v;g.each(["maxLength","size","placeholder"],function(b){var c=a.mainInput.getAttribute(b);c&&a.clearInput.setAttribute(b,c)});C(a.mainInput,a.clearInput);D(a.mainInput,"txt-pass");d.showWarn&&(a.warnMsg=m("div",{id:"warn",className:"warn"},{margin:"0 0 0 3px"}),d.warnMsgClassName&&D(a.warnMsg,d.warnMsgClassName,!0),C(a.clearInput,a.warnMsg));d.showToggle&&(a.maskBtn=m("div",{id:"btn-mask",className:"btn-mask",title:p.msg.showPass},{position:"absolute",margin:"0",padding:"0"}),D(a.maskBtn,"btn"),E(a.maskBtn,
"abc"),C(a.clearInput,a.maskBtn));d.showGenerate&&(a.genBtn=m("div",{id:"btn-gen",className:"btn-gen",title:p.msg.genPass},{position:"absolute",margin:"0",padding:"0"}),D(a.genBtn,"btn"),C(a.clearInput,a.genBtn),a.genBtnInner=m("div",{id:"btn-gen-i",className:"btn-gen-i",title:p.msg.genPass}),a.genBtn.appendChild(a.genBtnInner));d.showTip&&(d.tipPopoverStyle&&h&&"function"===typeof h.fn.popover?h(a.mainInput).popover(g.extend({title:null,placement:d.tipPopoverStyle.placement||function(a,c){var b=
h(c).position().top-h(x).scrollTop(),d=h(x).height()-b;return 300<d||d>b?"bottom":"top"}},d.tipPopoverStyle,{trigger:"manual",html:!0,content:function(){return L}})):(a.tip=m("div",{id:"tip",className:"tip"},{position:"absolute",margin:"0",padding:"0",width:q.width+"px"}),C(a.clearInput,a.tip),v=m("div",{id:"tip-arr-wrap",className:"tip-arr-wrap"}),a.tip.appendChild(v),v.appendChild(m("div",{id:"tip-arr",className:"tip-arr"})),v.appendChild(m("div",{id:"tip-arr-in",className:"tip-arr-in"})),a.tipBody=
m("div",{id:"tip-body",className:"tip-body"}),a.tip.appendChild(a.tipBody)));if(N.placeholders)!a.mainInput.getAttribute("placeholder")&&a.mainInput.getAttribute("data-placeholder")&&a.mainInput.setAttribute("placeholder",a.mainInput.getAttribute("data-placeholder"));else if(v=a.mainInput.getAttribute("placeholder")||a.mainInput.getAttribute("data-placeholder"))a.placeholder=m("div",{id:"placeholder",className:"placeholder"},{position:"absolute",margin:"0",padding:"0",height:q.height+"px",lineHeight:q.height+
"px"}),E(a.placeholder,v),C(a.clearInput,a.placeholder);N.passSymbol&&(a.passLengthChecker=m("div",{id:"len"},{position:"absolute",height:u(a.mainInput,"height"),top:"-10000px",left:"-10000px",display:"block",color:"transparent",border:"none"}),C(a.clearInput,a.passLengthChecker),setTimeout(function(){g.each("marginLeft fontFamily fontSize fontWeight fontStyle fontVariant".split(" "),function(b){var c=u(a.mainInput,b);c&&(a.passLengthChecker.style[b]=c)})},50));setTimeout(y,0);g.each([a.mainInput,
a.clearInput],function(b){g.attachEvent(b,"onkeyup",$);g.attachEvent(b,"onfocus",ba);g.attachEvent(b,"onblur",ia);g.attachEvent(b,"onmouseover",z);g.attachEvent(b,"onmouseout",z);a.placeholder&&g.attachEvent(b,"onkeydown",ha)});g.attachEvent(x,"onresize",y);a.maskBtn&&(g.attachEvent(a.maskBtn,"onclick",function(){P()}),g.attachEvent(a.maskBtn,"onmouseover",z),g.attachEvent(a.maskBtn,"onmouseout",z));a.genBtn&&(g.attachEvent(a.genBtn,"onclick",function(){var b="",c=Y(d.pattern,n.CharTypes.SYMBOL),
f=[];g.each(c,function(a,b){for(var c=0;c<b.length;c++)f.push(a)});f.sort(function(){return 0.7-Math.random()});g.each(f,function(a){var c=R.generationChars[a];c?d.chars[a]&&0>d.chars[a].indexOf(c)&&(c=d.chars[a]):c=d.chars[a];b+=g.selectRandom(c)});a.clearInput.value=a.mainInput.value=b;P(!1);A&&(clearTimeout(A),A=null);T();a.placeholder&&(a.placeholder.style.display="none")}),g.attachEvent(a.genBtn,"onmouseover",z),g.attachEvent(a.genBtn,"onmouseout",z));a.placeholder&&g.attachEvent(a.placeholder,
"onclick",ga);P(d.isMasked,!1);if("function"===typeof a.mainInput.hasAttribute&&a.mainInput.hasAttribute("autofocus")||a.mainInput.getAttribute("autofocus"))a.mainInput.focus(),ba();q=n.Config.dataAttr;h&&h(a.mainInput).data(q,this)}};var g={extend:function(){for(var b=arguments,f=1;f<b.length;f++)g.each(b[f],function(f,l){b[0][f]=g.isArray(b[0][f])||g.isArray(l)?b[0][f]?b[0][f].concat(l||[]):l:"object"===typeof b[0][f]&&"object"===typeof l&&null!==l?g.extend({},b[0][f],l):"object"===typeof l&&null!==
l?g.extend({},l):l});return b[0]},newEl:function(b,f,h){var l=w.createElement(b);f&&g.each(f,function(b,f){f&&(l[b]=f)});h&&g.each(h,function(b,f){f&&(l.style[b]=f)});return l},attachEvent:function(b,f,g){var l=b[f];b[f]=function(b){b||(b=x.event);g(b);"function"===typeof l&&l(b)}},each:function(b,f){if(g.isArray(b))for(var h=0;h<b.length&&!1!==f(b[h]);h++);else for(h in b)if(Object.prototype.hasOwnProperty.call(b,h)&&!1===f(h,b[h]))break},isArray:function(b){return"[object Array]"===Object.prototype.toString.call(b)},
selectRandom:function(b){var f=Math.floor(Math.random()*b.length);return g.isArray(b)?b[f]:b.charAt(f)},contains:function(b,f){if(!b)return!1;var h=!1;g.each(b,function(b){return b===f?(h=!0,!1):!0});return h}};h&&(h.fn.passField=function(b){return this.each(function(){new n.Field(this,b)})},h.fn.togglePassMasking=function(b){return this.each(function(){var f=h(this).data(n.Config.dataAttr);f&&f.toggleMasking(b)})},h.fn.setPass=function(b){return this.each(function(){var f=h(this).data(n.Config.dataAttr);
f&&f.setPass(b)})},h.fn.validatePass=function(){var b=!0;this.each(function(){var f=h(this).data(n.Config.dataAttr);f&&!f.validatePass()&&(b=!1)});return b},h.fn.getPassValidationMessage=function(){var b=this.first();return b&&(b=b.data(n.Config.dataAttr))?b.getPassValidationMessage():null},h.fn.getPassStrength=function(){var b=this.first();return b&&(b=b.data(n.Config.dataAttr))?b.getPassStrength():null});h&&h.validator&&jQuery.validator.addMethod("passfield",function(b,f){h(f).validatePass()},function(b,
f){return h(f).getPassValidationMessage()})})(window.jQuery,document,window);
