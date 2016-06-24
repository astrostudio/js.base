(function(Base,$){
    if(!$.base){
        alert('BaseQuery.js required');
    }

    Base.Ajax={};

    Base.Ajax.options={
        dataType: 'html',
        async: true
    };

    Base.Ajax.url='';

    Base.Ajax.__item=function(args,i,type){
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

    Base.Ajax.__ajax=function(args,options){
        options= $.extend({},Base.Ajax.options,options);

        var i=Base.Ajax.__item(args,1,'string');

        if(i>=0){
            options.url=args[i];
        }

        i=Base.Ajax.__item(args,1,'object');

        if(i>=0){
            options.data=args[i];
        }

        i=Base.Ajax.__item(args,2,'object');

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
            options.url=Base.Ajax.url+options.url;
        }

        /*console.log(options);*/

        if(options.async){
            options.success=function(data,textStatus,jqXHR){
                for(var i in callbacks){
                    callbacks[i].call(this,data,textStatus,jqXHR);
                }
            };

            return($.ajax(options));
        }

        var result=null;

        options.success=function(data,textStatus,jqXHR){
            result=data;

            for(var i in callbacks){
                callbacks[i].call(this,data,textStatus,jqXHR);
            }
        };

        $.ajax(options);

        return(result);
    };

    Base.Ajax.ajax=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{}));
    };

    Base.Ajax.get=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{type:'GET','async':false}));
    };

    Base.Ajax.put=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{type:'PUT',async:false}));
    };

    Base.Ajax.post=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{type:'POST',async:false}));
    };

    Base.Ajax.delete=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{type:'DELETE',async:false}));
    };

    Base.Ajax.json=function(){
        var args=Array.prototype.slice.call(arguments);

        return(Base.Ajax.__ajax(args,{type:'POST',dataType:'json'}));
    };

})(Base,jQuery);