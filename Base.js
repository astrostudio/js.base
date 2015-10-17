var Base;

(function(){
    Base={};

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
        
        var apath=path.split(sep);
        
        for(var key in apath){
            if(!(data instanceof Object)){
                return(false);
            }
            
            if(!(apath[key] in data)){
                return(false);
            }
                
            data=data[apath[key]];
        }
        
        return(true);
    };
    
    Base.get=function(data,path,def,sep){
        sep=sep||'.';
        
        if(!path){
            return(data);
        }
        
        var apath=path.split(sep);
        
        for(var key in apath){
            if(!(data instanceof Object)){
                return(def);
            }
            
            if(!(apath[key] in data)){
                return(def);
            }
            
            if(data[apath[key]]==null){
                return(def);
            }
                
            data=data[apath[key]];
        }
        
        return(data);
    };
    
    Base.set=function(data,path,value,sep){
        sep=sep||'.';
        data=data||{};
        
        if(!path){
            return(data);
        }
        
        var apath=path.split(sep);
        var key0=null;
        var data0=null;
        var data1=data;
        
        for(var key in apath){
            if(!(data1 instanceof Object)){                
                return(data);
            }
            
            if(!(apath[key] in data1)){
                data1[apath[key]]={};
            }
                
            data0=data1;
            key0=apath[key];
            
            data1=data1[apath[key]];
        }
        
        if(data0 && key0){
            data0[key0]=value;
        }
        
        return(data);
    };
    
    Base.remove=function(data,path,sep){
        sep=sep||'.';
        
        if(!path){
            return(data);
        }
        
        var apath=path.split(sep);
        var key0=null;
        var data0=null;
        
        for(var key in apath){
            if(!(data instanceof Object)){
                return(data);
            }
            
            if(!(apath[key] in data)){
                return(data);
            }
                
            data0=data;
            key0=apath[key];
            
            data=data[apath[key]];
        }
        
        if(data0 && key0){
            delete data0[key0];
        }
        
        return(data);
    };
    
})();