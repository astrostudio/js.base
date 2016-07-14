(function(Base,$){

    Base.View=function(id){
        this.id=id;
        this.data=null;
        this.listeners=new Base.Listeners(this);

        var $view=$('#'+id);

        $view.addClass(Base.View.prefix+'view');
    };
    Base.View.prototype.setData=function(data){
        this.data=data;
        this.render();
    };
    Base.View.prototype.render=function(){
        var self=this;
        var $view=$('#'+this.id);

        $view.find('.'+Base.View.prefix+'view').each(function(){
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

    Base.View.prefix='base-';

})(Base,jQuery);