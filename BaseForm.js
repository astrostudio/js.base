(function(Base,$){

    if(!Base.View){
        alert('BaseView required!');
    }

    Base.Form=function(id,options){
        Base.View.prototype.constructor.call(this,id, $.extend({},{
            items: {}
        },options||{}));

        $('#'+this.id).addClass(Base.Form.__class);
    };
    Base.extend(Base.Form,Base.View);
    Base.Form.prototype.render=function(){
        var $form=$('#'+this.id);

        for(var key in this.items){
            var $item=this.items[key].render();

            $form.append($item);
        }
    };
    Base.Form.prototype.getData=function(data){
        data=data||{};

        for(var key in this.items){
            this.items[key].getData(data);
        }
    };
    Base.Form.prototype.setData=function(data){
        data=data||{};

        for(var key in this.items){
            this.items[key].setData(data);
        }
    };
    Base.Form.prototype.setErrors=function(errors){

    };
    Base.Form.prototype.submit=function(){
        var self=this;
        var data=this.data||{};

        this.getData(data);

        if(this.url){
            Base.Api.ajax(this.url,data,this.type || 'post',function(response){
                if(response.ok()){
                    self.setData(response.data);

                    return;
                }

                if(response.errors){
                    self.setError(response.errors);
                }
            });
        }
    };

    Base.Form.__class='base-form';

    Base.Form.Item=function(id,options){
        Base.View.prototype.constructor.call(this,id,options);

        $('#'+this.id).addClass(Base.Form.Item.__class);
    };
    Base.extend(Base.Form.Item,Base.View);

    Base.Form.Item.__class='base-form-item';

})(Base,jQuery);
