(function(Base,$){
    if(!Base.Ajax){
        alert('BaseAjax.js required');
    }

    if(!Base.Listeners){
        alert('Base.Listeners required');
    }

    Base.Api=function(prefix){
        this.prefix=prefix;
        this.listeners=new Base.Listeners(this);
    };
    Base.Api.prototype.ajax=function(url,params,type,callback,options){
        var self=this;

        return(Base.Api.ajax(this.prefix+url,params,type,function(response){
            Base.calback(callback,self,[response]);

            self.listeners.update(response);
        },options));
    };
    Base.Api.prototype.get=function(url,params,callback){
        return(this.ajax(url,params,'GET',callback));
    };
    Base.Api.prototype.post=function(url,params,callback){
        return(this.ajax(url,params,'POST',callback));
    };
    Base.Api.prototype.put=function(url,params,callback){
        return(this.ajax(url,params,'PUT',callback));
    };
    Base.Api.prototype.delete=function(url,params,callback){
        return(this.ajax(url,params,'DELETE',callback));
    };
    Base.Api.prototype.patch=function(url,params,callback){
        return(this.ajax(url,params,'PATCH',callback));
    };

    Base.Api.Response=function(data,textStatus,jqXHR){
        this.data=data;
        this.textStatus=textStatus;
        this.jqXHR=jqXHR;
    };
    Base.Api.Response.prototype.ok=function(){
        var status=this.status();

        return((status>=200) && (status<300))
    };
    Base.Api.Response.prototype.status=function(){
        return(this.jqXHR.status);
    };
    Base.Api.Response.prototype.message=function(){
        return((this.data && this.data.message)?this.data.message:null);
    };
    Base.Api.prefix='';
    Base.Api.listeners=new Base.Listeners(Base.Api);
    Base.Api.ajax=function(url,params,type,callback,options){
        return(Base.Ajax.ajax(Base.Api.prefix+url,params,{
            type: type,
            async: true,
            dataType: 'json'
        },function(data,textStatus,jqXHR){
            var response=new Base.Api.Response(data,textStatus,jqXHR);

            Base.callback(callback,Base.Api,[response]);

            Base.Api.listeners.update(response);
        }));
    };
    Base.Api.get=function(url,params,callback){
        return(Base.Api.ajax(url,params,'GET',callback));
    };
    Base.Api.post=function(url,params,callback){
        return(Base.Api.ajax(url,params,'POST',callback));
    };
    Base.Api.put=function(url,params,callback){
        return(Base.Api.ajax(url,params,'PUT',callback));
    };
    Base.Api.delete=function(url,params,callback){
        return(Base.Api.ajax(url,params,'DELETE',callback));
    };
    Base.Api.patch=function(url,params,callback){
        return(Base.Api.ajax(url,params,'PATCH',callback));
    };
    Base.Api.submit=function(form,url,callback){
        return(Base.Ajax.Form.post(form,Base.Api.prefix+url,{dataType: 'json'}, callback));
    };

})(Base,jQuery);