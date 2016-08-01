(function(Base,$){

    Base.View=function(element,options){
        this.element=element;
        this.data=null;
        this.listeners=new Base.Listeners(this);

        $.extend(this,options||{});

        var $view=$(this.element);

        $view.addClass(Base.View.__class);
        $view.data(Base.View.__class,this);
    };
    Base.View.prototype.setData=function(data){
        this.data=data;
        this.render();
    };
    Base.View.prototype.render=function(){
        var self=this;
        var $view=$(this.element);

        $view.find('.'+Base.View.__class).each(function(){
            var path=$(this).attr('data-path');

            if(typeof(self.data)==='object') {
                if (path) {
                    if ($(this).is('input,select')) {
                        $(this).val(Base.get(self.data,path));
                    }
                    else{
                        $(this).html(Base.get(self.data,path));
                    }
                }
            }
        });

        this.listeners.update();
    };

    Base.View.__class='base-view';

})(Base,jQuery);