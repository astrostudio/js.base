var Base;

(function(){
    Base=function(){
        if(arguments[0] && typeof(arguments[0])==='object'){
            this.extend(arguments[0]);
        }
    };
    Base.prototype.extend=function(source,value){
        if(typeof(source)==='object'){
            var extend=Base.prototype.extend;

            for(var key in source){
                extend.call(this,key,source[key]);
            }
        }
        else if(arguments.length>1){
            this[source]=value;
        }

        return(this);
    };
    Base.extend=function(define,statics,n){
        var proto=new this;
        var extend=Base.prototype.extend;

        proto.extend(define);

        var constructor=proto.constructor;
        var child=function(){
            constructor.apply(this,arguments);
        };

        child.prototype=proto;

        extend.call(child,this);

        child.extend=this.extend;

        statics=statics||{};

        extend.call(child,statics);

        return(child);
    };

    Base.arg=function(args,i,type){
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

    Base.required=function(path){
        if(!Base.has(Base,path)){
            alert(path+' required');
        }
    };
    
    Base.replace=function(s,src,trg){
        return(s.replace(new RegExp(src,'g'),trg));
    };
    
    Base.render=function(view,params,delimiter){
        delimiter=delimiter||'%';
        
        for(id in params){
            view=Base.replace(view,delimiter+id+delimiter,params[id]);
        }
        
        return(view);
    };

    Base.cookie=function(name,value,time,domain){
        if(null!=value){
            if(!time){
                var time=new Date();
      
                time.setMonth(time.getMonth() + 12);
            }
            
            if(!domain){
                domain=document.domain;
            }
            
            document.cookie=name+'='+escape(value)+';'+'expires='+time+';'+'domain='+domain+';path=/';

            return;
        }
        
        var cookies={};
        
        if(document.cookie!=''){
            items=document.cookie.split('; ');
            
            for(var i=0;i<items.length;++i){
                var x=items[i].split('=');
                
                cookies[x[0]]=x[1];
            }
        }
        
        if(cookies[name]){
            return(unescape(cookies[name]));
        }
        
        return(null);
    };
    
    Base.has=function(data,path,sep){
        sep=sep||'.';
        
        if(!path){
            return(data);
        }

        if(typeof(path)=='string') {
            path = path.split(sep);
        }
        
        for(var key in path){
            if(!(data instanceof Object)){
                return(false);
            }
            
            if(!(path[key] in data)){
                return(false);
            }
                
            data=data[path[key]];
        }
        
        return(true);
    };
    
    Base.get=function(data,path,def,sep){
        sep=sep||'.';
        
        if(!path){
            return(data);
        }

        if(typeof(path)==='string') {
            path = path.split(sep);
        }

        for(var key in path){
            if(!(data instanceof Object)){
                return(def);
            }
            
            if(!(path[key] in data)){
                return(def);
            }
            
            if(data[path[key]]==null){
                return(def);
            }
                
            data=data[path[key]];
        }
        
        return(data);
    };
    
    Base.set=function(data,path,value,sep){
        sep=sep||'.';
        data=data||{};
        
        if(!path){
            return(data);
        }

        if(typeof(path)==='string') {
            path = path.split(sep);
        }

        var key0=null;
        var data0=null;
        var data1=data;
        
        for(var key in path){
            if(!(data1 instanceof Object)){                
                return(data);
            }
            
            if(!(path[key] in data1)){
                data1[path[key]]={};
            }
                
            data0=data1;
            key0=path[key];
            
            data1=data1[path[key]];
        }
        
        if(data0 && key0){
            data0[key0]=value;
        }
        
        return(data);
    };

    Base.__flatten=function(data,sep){
        var result={};

        for(var key in data){
            if(!(data[key] instanceof Object)){
                result[key]=data[key];
            }
            else {
                var r=Base.__flatten(data[key],sep);

                for(var k in r){
                    result[key+sep+k]=r[k];
                }
            }
        }

        return(result);
    };

    Base.flatten=function(data,path,sep){
        return(Base.__flatten(Base.get(data,path,sep),sep));
    };

    Base.path2name=function(prefix,path,sep){
        sep=sep||'.';

        if(typeof(path)==='string'){
            path=path.split(sep);
        }

        var name=prefix;

        if(path.length>0){
            for(var i in path) {
                name+='['+path[i]+']';
            }
        }

        return(name);
    };

    Base.remove=function(data,path,sep){
        sep=sep||'.';
        
        if(!path){
            return(data);
        }

        if(typeof(path)==='string') {
            path = path.split(sep);
        }

        var key0=null;
        var data0=null;
        
        for(var key in path){
            if(!(data instanceof Object)){
                return(data);
            }
            
            if(!(path[key] in data)){
                return(data);
            }
                
            data0=data;
            key0=path[key];
            
            data=data[path[key]];
        }
        
        if(data0 && key0){
            delete data0[key0];
        }
        
        return(data);
    };

    Base.callback=function(callback,context,args){
        if(!callback){
            return;
        }

        if(typeof(callback)==='function'){
            Base.callback([callback],context,args);

            return;
        }

        for(var i in callback){
            callback[i].apply(context,args);
        }
    };

    Base.uniqid=function (prefix, en) {
        var result;

        prefix=prefix||'';
        en=en||false;

        this.seed = function (s, w) {
            s = parseInt(s, 10).toString(16);
            return w < s.length ? s.slice(s.length - w) : (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
        };

        result = prefix + this.seed(parseInt(new Date().getTime() / 1000, 10), 8) + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

        if (en) {
            result += (Math.random() * 10).toFixed(8).toString();
        }

        return(result);
    };

    Base.evaluate=function(data,params,value){
        if(!data){
            return(value);
        }

        if(typeof(data)==='function'){
            return(data.apply(this,params));
        }

        return(data);
    };

    Base.Listeners=Base.extend({
        constructor: function(context){
            Base.call(this);

            this.context=context;
            this.items=[];
            this.updating=false;
        },
        append: function(listener){
            this.items.push(listener);
        },
        remove: function(listener){
            var i=this.items.indexOf(listener);

            if(i>=0){
                this.items.splice(i,1);
            }
        },
        update: function(){
            if(!this.updating){
                this.updating=true;

                for(var key in this.items){
                    this.items[key].apply(this.context,arguments);
                }

                this.updating=false;
            }
        }
    });

    Base.Timer=Base.extend({
        constructor: function(interval,callback){
            Base.call(this);

            this.interval=interval;
            this.listeners=new Base.Listeners(this);

            if(callback){
                this.listeners.append(callback);
            }

            this.__interval=false;
        },
        start: function(){
            var self=this;

            this.stop();
            this.__interval=setInterval(function(){
                self.listeners.update();
            },this.interval);
        },
        stop: function(){
            if(this.__interval){
                clearInterva(this.__interval);

                this.__interval=false;
            }
        },
        update: function(){
            this.listeners.update();
        }
    });

    Base.Locale=Base.extend({
        constructor: function(values){
            Base.call(this);

            this.values=values||{};
        },
        get: function(locale,space,alias,value){
            if(!locale){
                return(this.values);
            }

            if(!space){
                return(Base.get(this.values,[locale],{}));
            }

            if(!alias){
                return(Base.get(this.values,[locale,space]));
            }

            return(Base.get(this.values,[locale,space,alias],value));
        },
        set: function(locale,space,alias,value){
            if(typeof(locale)==='object'){
                this.values=locale;

                return(true);
            }

            if(typeof(locale)!=='string'){
                return(false);
            }

            if(!space){
                return(Base.remove(this.values,[locale]));
            }

            if(typeof(space)==='object'){
                return(Base.set(this.values,[locale],space));
            }

            if(typeof(space)!=='string'){
                return(false);
            }

            if(!alias){
                return(Base.remove(this.values,[locale,space]));
            }

            if(typeof(alias)==='object'){
                return(Base.set(this.values,[locale,space],alias));
            }

            if(typeof(alias)!=='string'){
                return(false);
            }

            if(!values){
                return(Base.remove(this.values,[locale,space,alias]));
            }

            if(value){
                return(Base.set(this.values,[locale,space,alias],value));
            }

            return(Base.remove(this.values,[locale,space,alias]));
        }
    },{
        __locale: 'pl',
        getInstance: function(){
            if(!Base.Locale.__instance){
                Base.Locale.__instance=new Base.Locale()
            }

            return(Base.Locale.__instance);
        },
        getLocale: function(){
            return(Base.Locale.__locale);
        },
        setLocale: function(locale){
            Base.Locale.__locale=locale;
        },
        get: function(space,alias,value,locale){
            return(Base.Locale.getInstance().get(locale||Base.Locale.__locale,space,alias,value));
        },
        set: function(space,alias,value,locale){
            return(Base.Locale.getInstance().set(locale||Base.Locale.__locale,space,alias,value));
        }
    });

})();