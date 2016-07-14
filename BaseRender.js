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

    $.base('plugin','renderFill',function(){
        var args=Array.prototype.slice.call(arguments);

        return(this.each(function(){
            if(args.length>0) {
                if (typeof(args[0]) === 'object') {
                    var html=$(this).html();
                    var exp=new RegExp(/\{\{[a-zA-Z0-9]+\}\}/g);
                    var match=html.match(exp);

                    if(match){
                        for(var i in match){
                            var expr=match[i].substr(2,match[i].length-4);
                            var body=Base.get(args[0],expr);

                            body=body||'';

                            html=html.replace(match[i],body);
                        }
                    }

                    $(this).html(html);
                }
            }
        }));
    });



})(Base,jQuery);
