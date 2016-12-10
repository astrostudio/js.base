(function(Base,$){
    var plugins={};
    var options={};

    Base.Ajax={
        options: {
            dataType: 'html',
            async: true
        },
        url: '',
        __ajax: function(args,options){
            options= $.extend({},Base.Ajax.options,options);

            var i=Base.arg(args,1,'string');

            if(i>=0){
                options.url=args[i];
            }

            i=Base.arg(args,1,'object');

            if(i>=0){
                options.data=args[i];
            }

            i=Base.arg(args,2,'object');

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
        },
        ajax: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{}));
        },
        get: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{type: 'GET',async: false}));
        },
        post: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{type: 'POST',async: false}));
        },
        put: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{type: 'PUT',async: false}));
        },
        delete: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{type: 'DELETE',async: false}));
        },
        json: function(){
            var args=Array.prototype.slice.call(arguments);

            return(Base.Ajax.__ajax(args,{type: 'POST',dataType: 'json'}));
        },
        Form: {
            data: function (form,data) {
                var formData = new FormData();

                data = data || {};

                for (var key in data) {
                    formData.append(key, data[key]);
                }

                $(form).find('textarea[name],input[name],select[name]').each(function () {
                    var name=$(this).attr('name');
                    var value;

                    if ($(this).attr('type') != 'file') {
                        value=$(this).val();
                    }
                    else {
                        value=$(this)[0].files[0];
                    }

                    if(value){
                        formData.append(name,value);
                    }
                    else {
                        formData.append(name,value);
                    }
                });

                return (formData);
            }
        }
    };

    Base.Api=Base.extend({
        constructor: function(url,options){
            Base.call(this,options);

            this.url=url;
            this.listeners=new Base.Listeners(this);
        },
        ajax: function(url,data,type,callback,options){
            var self=this;

            return(Base.Api.ajax(this.url+url,data,type,function(response){
                Base.calback(callback,self,[response]);

                self.listeners.update(response);
            },options));
        },
        get: function(url,data,callback,options){
            return(this.ajax(url,data,'GET',callback,options));
        },
        post: function(url,data,callback,options){
            return(this.ajax(url,data,'POST',callback,options));
        },
        put: function(url,data,callback,options){
            return(this.ajax(url,data,'PUT',callback,options));
        },
        delete: function(url,data,callback,options){
            return(this.ajax(url,data,'DELETE',callback,options));
        },
        patch: function(url,data,callback,options){
            return(this.ajax(url,data,'PATCH',callback,options));
        }
    },{
        Response: Base.extend({
            constructor: function(data,textStatus,jqXHR){
                Base.call(this);

                this.data=data;
                this.textStatus=textStatus;
                this.jqXHR=jqXHR;
            },
            ok: function(){
                var status=this.status();

                return((status>=200) && (status<300));
            },
            status: function(){
                return(this.jqXHR.status);
            },
            message: function(){
                return((this.data && this.data.message)?this.data.message:null);
            }
        }),
        url: '',
        listeners: new Base.Listeners(Base.Api),
        ajax: function(url,data,type,callback,options){
            return(Base.Ajax.ajax(Base.Api.url+url,data,$.extend({},{
                type: type,
                async: true,
                dataType: 'json'
            },options),function(data,textStatus,jqXHR){
                var response=new Base.Api.Response(data,textStatus,jqXHR);

                Base.callback(callback,Base.Api,[response]);

                Base.Api.listeners.update(response);
            }));
        },
        get: function(url,data,callback,options){
            return(Base.Api.ajax(url,data,'GET',callback,options));
        },
        post: function(url,data,callback,options){
            return(Base.Api.ajax(url,data,'POST',callback,options));
        },
        put: function(url,data,callback,options){
            return(Base.Api.ajax(url,data,'PUT',callback,options));
        },
        delete: function(url,data,callback,options){
            return(Base.Api.ajax(url,data,'DELETE',callback,options));
        },
        patch: function(url,data,callback,options){
            return(Base.Api.ajax(url,data,'PATCH',callback,options));
        },
        submit: function(form,url,callback) {
            var data = Base.Ajax.Form.data(form);

            return (Base.Api.ajax(url, data, 'POST', callback, {
                processData: false,
                enctype: 'multipart/form-data',
                contentType: false
            }));
        }
    });

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

    $.base('plugin','render',function(){
        var args=Array.prototype.slice.call(arguments);

        if(args.length==0){
            return(this);
        }

        if(typeof(args[0])==='object'){
            var data=args[0];
            var map=false;
            var type='html';

            if(args.length>1){
                if(typeof(args[1])==='object'){
                    map=args[1];

                    if((args.length>2) && (typeof(args[2])==='string')){
                        type=args[2];
                    }
                }
                else if(typeof(args[1])==='string'){
                    type=args[1];
                }
            }

            if(map){
                return(this.each(function(){
                    var $this=$(this);

                    for(var key in map){
                        switch(type){
                            case 'html':
                                $this.find(key).html(Base.get(data,map[key]));

                                break;
                            case 'value':
                                $this.find(key).val(Base.get(data,map[key]));

                                break;
                            case 'text':
                                $this.find(key).text(Base.get(data,map[key]));

                                break;
                            case 'auto':
                                var $item=$this.find(key);

                                if($item.is('input,select,textarea')){
                                    $item.val(Base.get(data,map[key]));
                                }
                                else {
                                    $item.html(Base.get(data,map[key]));
                                }

                                break;
                        }
                    }
                }));
            }

            return(this.find('[base-path]').each(function(){
                var $this=$(this);
                var path=$this.attr('base-path');

                if(path){
                    switch(type){
                        case 'html':
                            $this.html(Base.get(data,path));

                            break;
                        case 'value':
                            $this.val(Base.get(data,path));

                            break;
                        case 'text':
                            $this.text(Base.get(data,path));

                            break;
                        case 'auto':
                            if($this.is('input,select,textarea')){
                                $this.val(Base.get(data,path));
                            }
                            else {
                                $this.html(Base.get(data,path));
                            }

                            break;
                    }
                }
            }));
        }

        return(this);
    });

    $.base('plugin','data',function(){
        var args=Array.prototype.slice.call(arguments);
        var data={};
        var map=false;
        var type='html';

        if(args.length==0){
            return(this);
        }

        if(typeof(args[0])==='object') {
            var map = args[0];

            if (args.length > 1) {
                if (typeof(args[1]) === 'string') {
                    type = args[1];
                }
            }
        }

        if(map){
            this.each(function(){
                var $this=$(this);

                for(var key in map){
                    switch(type){
                        case 'html':
                            data=Base.set(data,map[key],$this.find(key).html());

                            break;
                        case 'value':
                            data=Base.set(data,map[key],$this.find(key).val());

                            break;
                        case 'text':
                            data=Base.set(data,map[key],$this.find(key).text());

                            break;
                        case 'auto':
                            var $item=$this.find(key);

                            if($item.is('input,select,textarea')){
                                data=Base.set(data,map[key],$item.val());
                            }
                            else {
                                data=Base.set(data,map[key],$item.html());
                            }

                            break;
                    }
                }
            });
        }

        this.find('[base-path]').each(function(){
            var $this=$(this);
            var path=$this.attr('base-path');

            if(path){
                switch(type){
                    case 'html':
                        data=Base.set(data,path,$this.html());

                        break;
                    case 'value':
                        data=Base.set(data,path,$this.val());

                        break;
                    case 'text':
                        data=Base.set(data,path,$this.text());

                        break;
                    case 'auto':
                        if($this.is('input,select,textarea')){
                            if($this.is('input') && $this.is('[type="file"]')){
                                data=Base.set(data,path,$(this)[0].files[0]);
                            }
                            else {
                                data = Base.set(data, path, $this.val());
                            }
                        }
                        else {
                            data=Base.set(data,path,$this.html());
                        }

                        break;
                }
            }
        });

        return(data);
    });

})(Base,jQuery);