(function(Base,$){
    var plugins={};
    var options={};

    Base.ajaxOptions={
        async: true
    };
    
    Base.load=function(url,arg1,arg2,arg3){
        var options=$.extend({},Base.ajaxOptions);
        
        options.url=url;
        options.async=false;
        options.type='GET';
        
        if(typeof(arg1)==='string'){
            options.dataType=arg1;
            
            if(typeof(arg2)==='function'){
                options.async=true;
                options.success=arg2;
                
                if(typeof(arg3)==='object'){
                    options=$.extend(options,arg3);
                }
            }
            else if(typeof(arg2)==='object'){
               options=$.extend(options,arg2);
            }
        }
        else if(typeof(arg1)==='function'){
            options.async=true;
            options.success=arg1;

            if(typeof(arg2)==='object'){
               options=$.extend(options,arg2);
            }
        }
        else if(typeof(arg1)==='object'){
            options=$.extend(options,arg1);
        }
        
        if(options.async){
            return($.ajax(options));
        }
        
        var result=null;
        
        options.success=function(response){
            result=response;
        };
        
        $.ajax(options);
        
        return(result);
    };

    Base.post=function(url,arg1,arg2,arg3,arg4){
        var options=$.extend({},Base.ajaxOptions);
        
        options.url=url;
        options.async=false;
        options.type='POST';        
        
        if(typeof(arg1)==='string'){
            options.dataType=arg1;
            
            if(typeof(arg2)==='function'){
                options.async=true;
                options.success=arg2;
                
                if(typeof(arg3)==='object'){
                    options=$.extend(options,arg3);
                }
            }
            else if(typeof(arg2)==='object'){
                options=$.extend(options,arg2);
            }
        }
        else if(typeof(arg1)==='object'){
            options.data=arg1;
            
            if(typeof(arg2)==='string'){
                options.dataType=arg1;
                
                if(typeof(arg3)==='function'){
                    options.async=true;
                    options.success=arg3;
                    
                    if(typeof(arg4)==='object'){
                        options=$.extend(options,arg4);
                    }
                }
                else if(typeof(arg3)==='object'){
                    options=$.extend(options,arg3);
                }
            }
            else if(typeof(arg2)==='function'){
                options.async=true;
                options.success=arg2;
            }
            else if(typeof(arg2)==='object'){
                options=$.extend(options,arg2);
            }
        }
        else if(typeof(arg1)==='function'){
            options.async=true;
            options.success=arg1;
            
            if(typeof(arg2)==='object'){
                options=$.extend(options,arg2);
            }
        }
        
        if(options.async){
            return($.ajax(options));
        }
        
        var result=null;
        
        options.success=function(response){
            result=response;
        };
        
        $.ajax(options);
        
        return(result);
    };

    Base.json=function(url,arg1,arg2,arg3){
        var options=$.extend({},Base.ajaxOptions);
        
        options.url=url;
        options.async=false;
        options.type='POST';
        options.dataType='json';
        
        if(typeof(arg1)==='object'){
            options.data=arg1;
            
            if(typeof(arg2)==='function'){
                options.async=true;
                options.success=arg2;
                
                if(typeof(arg3)==='object'){
                    options=$.extend(options,arg3);
                }
            }
            else if(typeof(arg2)==='object'){
                options=$.extend(options,arg2);
            }
        }
        else if(typeof(arg1)==='function'){
            options.async=true;
            options.success=arg1;
            
            if(typeof(arg2)==='object'){
                options=$.extend(options,arg2);
            }
        }
        
        if(options.async){
            return($.ajax(options));
        }
        
        var result=null;
        
        options.success=function(response){
            result=response;
        };
        
        $.ajax(options);
        
        return(result);
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
        
        return;
    }
    
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