(function(Base,$){
    var plugins={};
    var options={};

    Base.ajaxOptions={
        dataType: 'html',
        async: true
    };


    Base.url='';

    Base.__item=function(args,i,type){
        var j=0;
        var k=0;

        while(j<args.length){
            if(typeof(args[j])===type){
                ++k;

                if(k==i){
                    return(j);
                }
            }

            ++j;
        }

        return(-1);
    };

    Base.__ajax=function(args,options){
        options= $.extend({},Base.ajaxOptions,options);

        var i=Base.__item(args,1,'string');

        if(i>=0){
            options.url=args[i];
        }

        i=Base.__item(args,1,'object');

        if(i>=0){
            options.data=args[i];
        }

        i=Base.__item(args,2,'object');

        if(i>=0){
            options= $.extend(options,args[i]);
        }

        var callbacks=[];

        for(var i in args){
            if(typeof(args[i])==='function'){
                callbacks.push(args[i]);
            }
        }

        if(options.url){
            options.url=Base.url+options.url;
        }

        console.log(options);

        if(options.async){
            options.success=function(data,textStatus,jqXHR){
                for(var i in callbacks){
                    callbacks[i].call(this,data);
                }
            };

            return($.ajax(options));
        }

        var result=null;

        options.success=function(data,textStatus,jqXHR){
            result=data;

            for(var i in callbacks){
                callbacks[i].call(this,data);
            }
        };

        $.ajax(options);

        return(result);
    };

    Base.ajax=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.__ajax(args,{}));
    };

    Base.load=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.__ajax(args,{type:'GET','async':false}));
    };
    
    Base.post=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.__ajax(args,{type:'POST',async:false}));
    };

    Base.json=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.__ajax(args,{type:'POST',dataType:'json'}));
    };
        
    $.base=function(action,name,value){
        if(action=='plugin'){
            if(typeof(name)==='undefined'){
                return;
            }
            
            if(typeof(value)==='function'){
                plugins[name]=value;
            }
            
            if(name in plugins){
                return(plugins[name]);
            }
            
            return;
        }
        
        if(action=='options'){
            if(typeof(name)==='object'){
                options=$.extend(options,name);
                
                return(options);
            }
            
            if(typeof(name)==='string'){
                if(typeof(value)==='undefined'){
                    return(Base.get(options,name));
                }
                
                Base.set(options,name,value);
            }
        }
    };
    
    $.fn.base=function(){
        if(arguments.length>0){
            if(typeof arguments[0]=='Object'){
                options=$.extend(options,arguments[0]);
                
                return(this);
            }
            
            var plugin=arguments[0];
            
            if(plugin in plugins){
                return(plugins[plugin].apply(this,Array.prototype.slice.call(arguments,1)));
            }                        
        }
        
        return(this);
    };
})(Base,jQuery);