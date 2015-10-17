(function(Base,$){

    Base.Form=function(id,items,options){
        this.items=items;
        
        this.render=function(){
            var $form=$('#'+this.id);
            
            $form.html('');
            
            for(var i in this.items){
                if(typeof(this.items[i].render)=='function'){
                    $form.append(this.items[i].render());
                }                               
            }
        };
        
        this.get=function(data){
            for(var i in this.items){
                if(typeof(this.items[i].get)=='function'){
                    this.items[i].get(data);
                }
            }
        };
        
        this.set=function(data){
            for(var i in this.items){
                if(typeof(this.items[i].set)=='function'){
                    this.items[i].set(data);
                }
            }
        };
        
        this.load=function(){
            var this_=this;
            
            if(typeof(this.url)!=='undefined'){
                $.getJSON(this.url,function(data){
                    if(typeof(this_.beforeLoad)=='function'){
                        this_.beforeLoad.call(this_,data);
                    }

                    if(typeof(data)=='object'){
                        this_.set(data);
                    }

                    if(typeof(this_.afterLoad)=='function'){
                        this_.afterLoad.call(this_,data);
                    }
                });
            }
        };
        
        this.save=function(){
            var this_=this;
            
            if(typeof(this.url)!=='undefined'){
                var data={};
                
                this.get(data);
                
                $.post(this.url,{data:data},function(data){
                    if(typeof(this_.beforeSave)=='function'){
                        this_.beforeSave.call(this_,data);
                    }
                    
                    if(typeof(data)=='object'){
                        this_.set(data);                                                
                    }
                    
                    if(typeof(this_.afterSafe)=='function'){
                        this_.afterSave.call(this_,data);
                    }
                });
            }
        };

        $.extend(this,options||{});
    };
    
    Base.Form.Item=function(options){
        this.render=function(){
            if(this.template){
                return(Base.render(this.template,this));
            }                        
        };
        
        this.get=function(data){
            if(typeof(this.path)!=='undefined'){
                if(typoef(this.value)!=='undefined'){
                    Base.set(data,path,this.value);
                }
            }
        };
        
        this.set=function(data){
            if(typeof(this.path)!=='undefined'){
                if(Base.has(data,this.path)){
                    this.value=Base.get(data,this.path);
                }
            }
        };

        $.extend(this,options||{});        
    };

})(Base,jQuery);
