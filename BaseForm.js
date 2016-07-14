(function(Base,$){

    Base.Form=function(id,items,data){
        this.id=id;
        this.data={};
        this.items=items;
        this.listeners=new Base.Listeners(this);

        if(data){
            this.setData(data);
        }
    };
    Base.Form.prototype.getData=function(){
        var data=this.data;

        for(key in this.items){
            item.getData(data);
        }
    };
    Base.Form.prototype.setData=function(data){
        this.data=data;

        for(key in this.items){
            item.setData(data);
        }
    };
    Base.Form.prototype.get=function(path,def){
        return(Base.get(this.data,path,def));
    };
    Base.Form.prototype.set=function(path,value){
        Base.set(this.data,path,value);
    };
    Base.Form.prototype.render=function(){
        var $form=$('#'+this.id);

        $form.html('');

        for(var key in this.options.items){
            var item=this.options.items[key];
            var $item=item.render();

            $form.append($item);
        }
    };

    Base.Form.Item=function(){
    };
    Base.Form.Item.prototype.getData=function(data){
    };
    Base.Form.Item.prototype.setData=function(data){
    };
    Base.Form.Item.prototype.render=function(){
    };

    Base.Form.Input=function(options){
        $.extend(this,options|{});
    };
    Base.extend(Base.Form.Input,Base.Form.Item);
    Base.Form.Input.prototype.getData=function(data){
        if(this.path && this.input){
            Base.set(data,path,$(this.input).val());
        }
    };
    Base.Form.Input.prototype.setData=function(data){
        if(this.path && this.input){
            $(this.input).val(Base.get(data,this.path));
            $(this.input).change();
        }
    };
    Base.Form.Input.prototype.render=function(){
        var template=this.template||'<input />';
        var $input=$(template);

        return($input);
    };

})(Base,jQuery);
