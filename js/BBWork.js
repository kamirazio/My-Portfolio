
var WORK_MODEL = Backbone.Model.extend({
  defaults: {
    // nid: "nid",
    // index: 0,
    // slide_num: 0,
    // title: "title",
    // category: "category",
    // description: "*",
    // achievement: "",
    // situation:"",
    // role: "role",
    // member:"member",
    // to: "*",
    // from: "*",

    // visibility: false,
    // display: true,
  }
});

var WORK_MODEL_VIEW = Backbone.View.extend({
  tagName: "div",
  className: "mark fadein",
  template: _.template(app.getTemplate('work_list')),
  events: {
    'click': 'check'
  },
  initialize: function(){
    this.listenTo(this.model, 'change:visibility', this.toggle_visibility);
    // this.check()
  },
  check: function(){
    console.log(this.model);
  },
  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    this.render_work();
    // this.toggle_display();

    this.$el.addClass(this.model.get("category"));
    var order = this.model.get("order");
    this.$el.addClass("order_"+order);

    if(order>=0){
      this.$(".condition").css({
        "marginTop": order*75
      });
    }
    return this;
  },
  toggle_display: function(){

    if(!this.model.get("display")){
      this.$el.hide();
    }
  },
  toggle_visibility: function(){

    var i = this.model.get("id");

    if( this.model.get("visibility") ){
      $('.work img').eq(i).animate({
          "marginLeft": "0"
      },1500);

    }else{
      $('.work img').eq(i).animate({
          "marginLeft": "-100%"
      });
    }
  },
  render_work: function(){
    // var y_top = (2016 - parseInt(time_to[0]))*240;
    var top = parseInt(12-this.model.get('to')[1])*20;
    this.$el.css({
      // "height":(y_height + m_height) + "px",
      "top": top+ "px",
      // "left": this.model.get('value'),
      // "display": "none"
    });
  },
  render_note: function(){

  },
  openSlide: function(){
    console.log("openSlideshow");

    var modal_v = new MODAL_MODEL_VIEW({
      model: this.model,
    });

    // $('body').append(modal_v);
    $('#myModal').modal('show');
    $(".carousel").carousel({
      interval: false,
      pause: "hover"
    });
  }
});

var WORK_LIST = Backbone.Collection.extend({
  model: WORK_MODEL
});

var WORK_LIST_VIEW = Backbone.View.extend({
  el: '#work_list',
  col : WORK_LIST,
  initialize: function(){
    this.col = new WORK_LIST();
    this.col.fetch({
      dataType : 'json',
      url: 'json/work_list.json',
      error: $.proxy(this.error, this),
      success: $.proxy(this.renderWork, this)
    });

  },
  renderWork: function() {
    _(this.col.models).each(function(model, i){
      model.set({
        "id": i
      });
      var model_v = new WORK_MODEL_VIEW({
        model: model,
      });
      var target = $(".timelist").find("[data-year='" + model.get('to')[0] + "']");
      $(target).find('.'+'edubox').append(model_v.render().el);
    }, this);
  },
  error: function() {
    console.log('fail to get data');
  }
});