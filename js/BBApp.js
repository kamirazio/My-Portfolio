var APP_MODEL = Backbone.Model.extend({
	defaults: {
		"is_in_top_page": true,
		"author": "KAMIRAZIO",
		// "chart": false,
		// "scroll": 0,
		"current_page": null,
		"navi": "close",
	}
});

var APP_VIEW = Backbone.View.extend({
	el: $('.wrap'),
	navi_status: "close",
	// template0: _.template(app.getTemplate('menu')),
	template1: _.template(app.getTemplate('top')),
	template2: _.template(app.getTemplate('about')),
	template_portfolio1: _.template(app.getTemplate('portfolio1')),
	template_portfolio2: _.template(app.getTemplate('portfolio2')),
	template4: _.template(app.getTemplate('profile')),
	template5: _.template(app.getTemplate('history')),
	template6: _.template(app.getTemplate('bottom')),
	window_h: null,
	window_w: null,
	window_pos: null,
	// work_index: null,
	// work_pos: null,
	// work_length: null,
	// timeing: 100,
	page_pos_tops: [],
	// page_list:["tops","works","about","profile","history","footer"],
	page_list: [],
	// template: _.template(app.getTemplate('menu')),
	events: {
		// 'click .top-btn': 'gotoTop',
		'click .work_thumb.modal-trigger': 'openModal'
	},
	initialize: function () {
		this.model = new APP_MODEL();
		$("#tops").append(this.template1());
		$("#about").append(this.template2());
		$("#portfolio1").append(this.template_portfolio1());
		$("#portfolio2").append(this.template_portfolio2());
		$("#profile").append(this.template4());
		$("#history").append(this.template5());
		$("#footer").append(this.template6());

		window.navi_v = new NAVI_MODEL_VIEW();
		window.items_v = new JOB_LIST_VIEW();
		window.works_v = new WORK_LIST_VIEW();
		window.portfolio_v = new PORTFOLIO_LIST_VIEW();

		this.listenTo(this.model, 'change:current_page', this.pageChange);
		this.listenTo(this.model, 'change:is_in_top_page', this.setTopPageEffect);
		this.listenTo(this.model, 'change:is_in_top_page', this.animationCntrol);
		// this.set_window();
		this.render();

		// ---- Event Listener : watching resize + scroll
		$(window).resize(function () {
			app_v.set_window();
		});
		// watching scroll
		$(window).scroll(function () {
			app_v.scroll_window();
		});
	},

	set_window: function () {
		console.log("window resized");
		this.window_h = window.innerHeight;
		this.window_w = window.innerWidth;
		$('#tops.section').height(this.window_h);
		$('#screen').height(this.window_h);
		$('.canvas').width(this.window_w);

		$('#about.section').css('minHeight', this.window_h - this.window_h * 0.25);

		var section_list = [];
		var section_position_list = [];
		$('.section').each(function () {
			section_list.push($(this).attr("id"));
			section_position_list.push($(this).offset().top);
		});
		this.page_list = section_list;
		this.page_pos_tops = section_position_list;
		// initMetaball();
		console.log(section_list);
		console.log(section_position_list);
		this.scroll_window();
	},

	getPageByTopPosition: function (_current_top_pos) {
		this.page_pos_tops;
		for (var i = 0; i < this.page_pos_tops.length; i++) {
			if (this.page_pos_tops[i] <= _current_top_pos) {
				if (this.page_pos_tops[i + 1] >= _current_top_pos) {
					this.model.set('current_page', i);
					continue;
				}
			}
		}
	},

	render: function () {
		$(".header_panel").addClass("header_panel");
		$(".m_menu").addClass("m_menu");
		$("#header").addClass("show--in");
		$('canvas').fadeIn(3000);
		// $('#about').height(this.window_h-200);
		// this.renderChart();
		// this.typewrite();
	},

	pageChange: function () {
		var c_page = this.model.get('current_page');
		console.log(this.page_list[c_page]);

		switch (this.page_list[c_page]) {
			case 'tops':
				console.log("---- TOPS");
				this.model.set('is_in_top_page', true);
				$('.black_bg').addClass('white--change');
				break;

			case 'about':
				console.log("---- Profile : Black");
				this.model.set('is_in_top_page', false);
				$(".black_bg").removeClass('white--change');
				$("#timeline_header").removeClass('margin_0');
				// this.renderChart();
				break;
			case 'profile':
				console.log("---- Profile : Black");
				this.model.set('is_in_top_page', false);
				$(".black_bg").removeClass('white--change');
				$("#timeline_header").removeClass('margin_0');
				this.renderChart();
				break;

			case 'portfolio1':
			case 'portfolio2':
				this.model.set('is_in_top_page', false);
				$('.black_bg').addClass('white--change');
				$("#timeline_header").removeClass('margin_0');
				break;

			case 'history':
				console.log("---- HISTORY : white");
				this.model.set('is_in_top_page', false);
				$(".black_bg").addClass('white--change');
				$("#timeline_header").addClass('margin_0');
				break;

			case 'footer':
				console.log("Footer");
				this.model.set('is_in_top_page', false);
				$("#timeline_header").removeClass('margin_0');
				break;
		}
	},

	setTopPageEffect: function () {
		var circle = $('<i></i>', {
			'class': 'fa fa-dot-circle'
		});
		var triangle = $('<i></i>', {
			'class': 'fas fa-play'
		});
		if (this.model.get('is_in_top_page')) {
			$("#navi1").empty().append(circle);
			$(".spacer_anim, #header").removeClass("show--minimize");
			$("#navi3, #navi4").fadeIn(1000);
			$(".mycanvas, #header2").removeClass("black--change");
		} else {
			$("#navi1").empty().append(triangle);
			$(".spacer_anim, #header").addClass("show--minimize");
			$("#navi1 i").removeClass('fa-dot-circle').addClass('fa-play');
			$("#navi3, #navi4").fadeOut(1000);
		}
	},

	animationCntrol: function () {
		if (this.model.get('is_in_top_page')) {
			window.navi_v.showCanvas();
		} else {
			try {
				lifegame_clear();
			} catch (err) {}
			try {
				nodeloop_clear();
			} catch (err) {}
		}
	},

	openModal: function (e) {
		// console.log("---- openModal");
		// ---- TODO: move this logic into Portfolio
		e.preventDefault();
		var id = parseInt(e.currentTarget.dataset.workId);
		var results = _.where(portfolio_v.col.models, {
			"id": id
		});
		// console.log(results);
		var modal_v = new PORTFOLIO_MODEL_VIEW({
			model: results[0],
		});

		var size = this.window_h > 500 ? this.window_h : 500;
		$('#myModal .modal-dialog')
			.empty()
			.append(modal_v.render().el)
			.width(size + 'px');

		$('#myModal .carousel-inner .item')
			.css({
				'minHeight': size - 200 + 'px',
				'height': 'auto'
			})

		// $('.modal-dialog').append(modal_v);
		$('#myModal').modal('show');
		$(".carousel").carousel({
			interval: false,
			pause: "hover"
		});
	},

	scroll_window: function () {
		var scroll_top = $(window).scrollTop();
		var window_h = $(window).height();
		this.getPageByTopPosition(scroll_top + window_h * 2 / 3);

		// elements fadein ====================================//
		$('.fadein,.fadeup,.fadein_r,.fadein_l').each(function () {
			var elemPos = $(this).offset().top;
			if (scroll_top > elemPos - window_h + 200) {
				$(this).addClass('scroll--in');
			} else {
				$(this).removeClass('scroll--in');
			}
		});

		// up and down ====================================//
		// var current_page = this.model.get('current_page');
		// if(scroll_top > this.model.get('scroll')){

		// console.log("▽");
		// console.log("scroll:"+ (scroll));
		// var fire_pos = this.page_pos_tops[current_page + 1] + this.window_h/2;
		// console.log("FIRE:::"+fire_pos);
		// if(scroll_top > fire_pos){
		//   this.target = this.page_list[current_page + 1];
		//   this.model.set('current_page',current_page + 1);
		//   console.log(this.target);
		// }
		// }else{

		// console.log("▲");
		// console.log("scroll:"+ scroll);

		//   var fire_pos = this.page_pos_tops[current_page] + this.window_h;
		//   if(scroll < fire_pos){
		//     this.target = this.page_list[current_page - 1];
		//     this.model.set('current_page',current_page - 1);
		//     console.log(this.target);
		//   }
		// }
		//1コマ前のスクロールポジションを得る
		// this.model.set("scroll",scroll_top);
	},

	renderChart: function () {
		var data3 = [{
			value: 55,
			color: "#FFF",
			label: "Front-end"
		}, {
			value: 30,
			color: "#fb6d6d",
			label: "Back-end"
		}, {
			value: 15,
			color: "#999",
			label: "Data-mining"
		}];

		var data1 = [{
			value: 45,
			color: "#FFF",
			label: "Interaction Design",
		}, {
			value: 35,
			color: "#fb6d6d",
			label: "Graphic Design"
		}, {
			value: 10,
			color: "#999",
			label: "User Experience Design"
		}, {
			value: 10,
			color: "#ffd15b",
			label: "other"
		}];

		var data2 = [{
			value: 50,
			color: "#FFF",
			label: "Web Engineering"
		}, {
			value: 35,
			color: "#fb6d6d",
			label: "Educatioanl Engineering"
		}, {
			value: 10,
			color: "#999",
			label: "Gamification"
		}, {
			value: 5,
			color: "#ffd15b",
			label: "Design Strategy"
		}];

		var options = {
			segmentShowStroke: false,
			// 中央の円のカットの大きさ
			percentageInnerCutout: 70,
			animation: true,
			animationSteps: 100,
			animationEasing: "easeOutQuad",
			// 回転で表示するアニメーションの有無
			animateRotate: true,
			// 中央から拡大しながら表示するアニメーションの有無
			//animateScale : true,
			// アニメーション終了後に実行する処理
			// animation: false の時にも実行されるようです
			// e.g. onAnimationComplete : function() {alert('complete');}
			//onAnimationComplete : null
		}

		var ctx1 = document.getElementById("chart1").getContext("2d");
		var ctx2 = document.getElementById("chart2").getContext("2d");
		var ctx3 = document.getElementById("chart3").getContext("2d")

		ctx1.canvas.width = ctx1.canvas.height = ctx2.canvas.width = ctx2.canvas.height = ctx3.canvas.width = ctx3.canvas.height = 150;

		var myDoughnut1 = new Chart(ctx1).Doughnut(data1, options);
		var myDoughnut2 = new Chart(ctx2).Doughnut(data2, options);
		var myDoughnut3 = new Chart(ctx3).Doughnut(data3, options);
		// myDoughnut1.destroy();
	},
});