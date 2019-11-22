
var MODAL_MODEL_VIEW = Backbone.View.extend({

  tagName: "div",
  className: "model",
  template: _.template(app.getTemplate('modal')),
  events: {
    // 'click': 'openSlide'
  },
  initialize: function(){
    this.model = new WORK_MODEL();
    // this.listenTo(this.model, 'change:visibility', this.toggle_visibility);
    // this.check();
    this.render();
  },
  check: function(){
    console.log(this.model);
  },
  render: function() {
      $('body > #model_wrapper').empty();
      var html = this.template(this.model.toJSON());
      // this.$el.html(html);
      $('body > #model_wrapper').append(html);
      // this.render_work();
    // return this;
  }
});
