(function(Base){
    //Base.required('Base.Listeners');

    Base.Timer=function(interval,listener){
        var this_=this;

        this.interval=interval;
        this.listeners=new Base.Listeners(this);
        
        if(typeof(listener)==='function'){
            this.listeners.append(listener);
        }
        
        this.__interval=false;
        this.start=function(){
            this.stop();
            this.__interval=setInterval(function(){
                this_.listeners.update();
            },this.interval);
        };
        this.stop=function(){
            if(this.__interval){
                clearInterval(this.__interval);
                this.__interval=false;
            }
        };
    };
})(Base);