(function(Base,$){
    
    if(!$.base){
        alert('BaseQuery.js required');
    }

    /*
    $x.base('render','<span></span>');
    $x.base('render','<span>%XYZ%</span>',{xyz:'text'});
    $x.base('render','<span>#XYZ#</span>',{xyz:'text'},'#');
    $x.base('render','<span class="xyz"></span>',{xyz:'text'},{xyz:'.xyz'});
    $x.base('render',{xyz:'text'});
    $x.base('render',{xyz:'text'},'#');
    $x.base('render',{xyz:'text'},{xyz:'.xyz'});
    */
    
    $.base('plugin','render',function(){
        var args=Array.prototype.slice.call(arguments);

        return(this.each(function(){
            var dat=null;
            var map=null;
            var sep='%';
            
            if(args.length>0){
                if(typeof(args[0])==='string'){
                    $(this).html(args[0]);

                    if(args.length>1){
                        if(typeof(args[1])==='object'){
                            dat=args[1];
                            
                            if(args.length>2){
                                if(typeof(args[2])==='object'){
                                    map=args[2];
                                }
                                else if(typeof(args[2])==='string'){
                                    sep=args[2];
                                }
                            }
                        }
                    }
                }
                else if(typeof(args[0])==='object'){
                    dat=args[0];
                    
                    if(args.length>1){
                        if(typeof(args[1])==='object'){
                            map=args[1];
                        }
                        else if(typeof(args[1])==='string'){
                            sep=args[1];
                        }
                    }
                }
                
                if(dat){
                    if(map){
                        for(var key in map){
                            if(key in dat){
                                $(this).find(map[key]).html(dat[key]);
                            }
                        }
                    }
                    else {
                        $(this).find('*').contents().each(function(){
                            if(this.nodeType===3){
                                this.data=Base.render($(this).text(),dat,sep);
                            }
                        });
                        
                        $(this).contents().each(function(){
                            if(this.nodeType==3){
                                this.data=Base.render($(this).text(),dat,sep);
                            }
                        });
                    }
                }
            }
        }));
    });

})(Base,jQuery);
