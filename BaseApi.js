(function(Base){
    if(!Base.Ajax){
        alert('BaseAjax.js required');
    }

    if(!Base.Listeners){
        alert('Base.Listeners required');
    }

    Base.Api=function(url){
        this.url=url;
        this.listeners=Base.Listeners(this);
    };
    Base.Api.prototype.ajax=function(type,url,params,callback){
        var self=this;

        return(Base.Api.ajax(type,self.url+'/'+url,params,function(){
            var args=Array.prototype.slice.call(arguments);

            self.listeners.update.apply(self,args);

            if(typeof(callback)==='function'){
                callback.apply(self,args);
            }
        }));
    };
    Base.Api.prototype.get=function(action,params,callback){
        return(this.ajax('GET',action,params,callback));
    };
    Base.Api.prototype.post=function(action,params,callback){
        return(this.ajax('POST',action,params,callback));
    };
    Base.Api.prototype.put=function(action,params,callback){
        return(this.ajax('PUT',action,params,callback));
    };
    Base.Api.prototype.delete=function(action,params,callback){
        return(this.ajax('DELETE',action,params,callback));
    };

    Base.Api.url='/api';
    Base.Api.listeners=new Base.Listeners();
    Base.Api.ajax=function(type,url,params,callback){
        return(Base.Ajax.ajax(Base.Api.url+url,params,{
            type: type,
            async: true,
            dataType: 'json'
        },function(){
            var args=Array.prototype.slice.call(arguments);

            if(typeof(callback)==='function'){
                callback.apply(Base.Api,args);
            }

            Base.Api.listeners.update.apply(self,args);
        }));
    };
    Base.Api.get=function(url,params,callback){
        return(Base.Api.ajax('GET',url,params,callback));
    };
    Base.Api.post=function(url,params,callback){
        return(Base.Api.ajax('POST',url,params,callback));
    };
    Base.Api.put=function(url,params,callback){
        return(Base.Api.ajax('PUT',url,params,callback));
    };
    Base.Api.delete=function(url,params,callback){
        return(Base.Api.ajax('DELETE',url,params,callback));
    };

})(Base);