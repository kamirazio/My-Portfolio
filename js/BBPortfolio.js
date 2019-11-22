
var PORTFOLIO_MODEL = Backbone.Model.extend({
  defaults: {
    id: null,
    title: "title",
    // slide_num: 0,
    slides:[],
    // category: "category",
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

var PORTFOLIO_MODEL_VIEW = Backbone.View.extend({
  tagName: "div",
  className: "modal-dialog-wrapper",
  template: _.template(app.getTemplate('portfolio_modal')),
  events: {
    // 'click': 'openSlide'
  },
  initialize: function(){
    // this.listenTo(this.model, 'change:visibility', this.toggle_visibility);
    // this.check();
  },
  // check: function(){
  //   console.log(this.model);
  // },
  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
   
    // this.render_work();
    // this.toggle_display();
    // this.$el.addClass(this.model.get("category"));
    // var order = this.model.get("order");
    // this.$el.addClass("order_"+order);

    // if(order>=0){
    //   this.$(".condition").css({
    //     "marginTop": order*75
    //   });
    // }
    return this;
  },
  toggle_display: function(){
    if(!this.model.get("display")){
      this.$el.hide();
    }
  },
  // toggle_visibility: function(){

  //   var i = this.model.get("id");

  //   if( this.model.get("visibility") ){
  //     $('.work img').eq(i).animate({
  //         "marginLeft": "0"
  //     },1500);

  //   }else{
  //     $('.work img').eq(i).animate({
  //         "marginLeft": "-100%"
  //     });
  //   }
  // },
  // render_work: function(){
  //   var time_to = (this.model.get('to'));
  //   var y_top = (2016 - parseInt(time_to[0]))*240;
  //   var m_top = parseInt(time_to[1])*20;

  //   this.$el.css({
  //     // "height":(y_height + m_height) + "px",
  //     "top": (30+ y_top - m_top) + "px",
  //     // "left": this.model.get('value'),
  //     // "display": "none"
  //   });
  // },
  
});

var PORTFOLIO_LIST = Backbone.Collection.extend({
  model: PORTFOLIO_MODEL,
  url: 'json/portfolio_list.json',
});

var PORTFOLIO_LIST_VIEW = Backbone.View.extend({
  el: '.modal-dialog',
  col : PORTFOLIO_LIST,
  initialize: function(){
    this.col = new PORTFOLIO_LIST();
    this.col.fetch({
      error: $.proxy(this.error, this),
      success: $.proxy(this.render, this)
    });
  },
  render: function() {
    var i = 0;
    _(this.col.models).each(function(model){
        
          model.set({
            "id": i
          })
          i++;
          // // ---- Appending to modal
          // this.$el.append(model_v.render().el);
          $('.work_thumb').each(function(i, elm){
            $(elm).height($(elm).width()+'px');
          })
        
    }, this);

    app_v.set_window(); 
  },
  error: function() {
    console.log('error');
  },
}); //// ---- PORTFOLIO_LIST_VIEW