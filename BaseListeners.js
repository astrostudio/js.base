(function(Base){
    Base.Listeners=function(context){
        this.context=context;
        this.items=[];
        this.updating=false;
        this.append=function(listener){
            this.items.push(listener);
        };
        this.remove=function(listener){
            var i=this.items.indexOf(listener);
            
            if(i>=0){
                this.items.splice(i,1);
            }
        };
        this.update=function(){
            if(!this.updating){
                this.updating=true;
                
                for(var key in this.items){
                    this.items[key].apply(this.context,arguments);
                }
                
                this.updating=false;
            }
        };
    };
})(Base);