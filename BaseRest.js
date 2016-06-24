(function(Base,$){
    if(!Base.Ajax){
        alert('BaseAjax.js required');
    }

    if(!Base.Listeners){
        alert('Base.Listeners required');
    }

    Base.Rest=function(prefix){
        this.prefix=prefix;
        this.listeners=new Base.Listeners(this);
    };
    Base.Rest.prototype.ajax=function(url,params,type,callback,options){
        var self=this;

        return(Base.Rest.ajax(this.prefix+url,params,type,function(response){
            Base.calback(callback,self,[response]);

            self.listeners.update(response);
        },options));
    };
    Base.Rest.prototype.get=function(url,params,callback){
        return(this.ajax(url,params,'GET',callback));
    };
    Base.Rest.prototype.post=function(url,params,callback){
        return(this.ajax(url,params,'POST',callback));
    };
    Base.Rest.prototype.put=function(url,params,callback){
        return(this.ajax(url,params,'PUT',callback));
    };
    Base.Rest.prototype.delete=function(url,params,callback){
        return(this.ajax(url,params,'DELETE',callback));
    };
    Base.Rest.prototype.patch=function(url,params,callback){
        return(this.ajax(url,params,'PATCH',callback));
    };

    Base.Rest.Response=function(data,textStatus,jqXHR){
        this.data=data;
        this.textStatus=textStatus;
        this.jqXHR=jqXHR;
    };
    Base.Rest.Response.prototype.ok=function(){
        var status=this.status();

        return((status>=200) && (status<300))
    };
    Base.Rest.Response.prototype.status=function(){
        return(this.jqXHR.status);
    };
    Base.Rest.Response.prototype.message=function(){
        return((this.data && this.data.message)?this.data.message:null);
    };
    Base.Rest.prefix='';
    Base.Rest.listeners=new Base.Listeners(Base.Rest);
    Base.Rest.ajax=function(url,params,type,callback,options){
        return(Base.Ajax.ajax(Base.Rest.prefix+url,params,{
            type: type,
            async: true,
            dataType: 'json'
        },function(data,textStatus,jqXHR){
            var response=new Base.Rest.Response(data,textStatus,jqXHR);

            Base.callback(callback,Base.Rest,[response]);

            Base.Rest.listeners.update(response);
        }));
    };
    Base.Rest.get=function(url,params,callback){
        return(Base.Rest.ajax(url,params,'GET',callback));
    };
    Base.Rest.post=function(url,params,callback){
        return(Base.Rest.ajax(url,params,'POST',callback));
    };
    Base.Rest.put=function(url,params,callback){
        return(Base.Rest.ajax(url,params,'PUT',callback));
    };
    Base.Rest.delete=function(url,params,callback){
        return(Base.Rest.ajax(url,params,'DELETE',callback));
    };
    Base.Rest.patch=function(url,params,callback){
        return(Base.Rest.ajax(url,params,'PATCH',callback));
    };

})(Base,jQuery);