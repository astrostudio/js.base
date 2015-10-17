(function(Base,$){
    
    if(!$.base){
       // alert('BaseQuery.js required');
    }

    var slotActions={};
    
    slotActions.init=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
       
        return(this.each(function(){
            var $this=$(this);

            $this.find('a.'+slotClass+'-init').each(function(){
                $this.base('slot','ajax',{url:$(this).attr('href')});
            });
        }));
    };
    
    slotActions.get=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
        var $slot=$(this).base('slot').first();
        
        return($slot.data(slotClass));
    };
    
    slotActions.ajax=function(){
        var args=Array.prototype.slice.call(arguments);
        
        return(this.each(function(){
            var $slot=$(this).base('slot');
            
            if($slot.size()>0){                
                var options={};
                
                if(args.length>0){
                    options=args[0];
                }
                
                options=$.extend({
                    async: false,
                    context: $slot,
                    type: 'GET',
                    beforeSend: baseSlotHandlers.send,
                    error: baseSlotHandlers.error,
                    success: baseSlotHandlers.success,
                    complete: baseSlotHandlers.complete,
                    timeout: 15000
                },options);
                
                $.ajax(options);
            }
        }));
    };
    
    slotActions.load=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
        var args=Array.prototype.slice.call(arguments);
        
        return(this.each(function(){
            var $slot=$(this).base('slot');
            
            if($slot.size()>0){
                var slot=$slot.base('slot','get');
                var url='/';
                var callbacks=null;
                var options={};
                
                if(slot){
                    if(typeof(slot.url)==='string'){
                        url=slot.url;
                    }
                }
                
                if(args.length>0){
                    var i=0;
                    
                    if(typeof(args[0])==='string'){
                        url=args[0];
                        
                        ++i;
                    }
                    
                    while(i<args.length){
                        if(typeof(args[i])==='object'){
                            options=$.extend(options,args[i]);
                        }
                        else if(typeof(args[i])==='function'){
                            callbacks.push(args[i]);
                        }
                        
                        ++i;
                    }
                }
                
                options=$.extend({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    success: function(data){
                        $(this).html(data);
                        
                        for(var i in callbacks){
                            callbacks[i].call(this);
                        }
                    }
                });
                
                $slot.base('slot','ajax',options);
            }
        }));
    };
    
    slotActions.post=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
        var args=Array.prototype.slice.call(arguments);
        
        return(this.each(function(){
            var $slot=$(this).base('slot');
            
            if($slot.size()>0){
                var slot=$slot.base('slot','get');
                var url='/';
                var callbacks=null;
                var data=null;
                var options={};
                
                if(slot){
                    if(typeof(slot.url)==='string'){
                        url=slot.url;
                    }

                    if(typeof(slot.data)==='object'){
                        data=slot.data;
                    }
                }
                
                if(args.length>0){
                    var i=0;
                    
                    if(typeof(args[0])==='string'){
                        url=args[0];

                        ++i;
                        
                        if(args.length>1){
                            if(typeof(args[1])==='object'){
                                data=args[1];
                                
                                ++i;
                            }
                        }                        
                    }
                    else if(typeof(args[0])==='object'){
                        data=args[0];
                        
                        ++i;
                    }
                    
                    while(i<args.length){
                        if(typeof(args[i])==='object'){
                            options=$.extend(options,args[i]);
                        }
                        else if(typeof(args[i])==='function'){
                            callbacks.push(args[i]);
                        }
                        
                        ++i;
                    }
                }
                
                options=$.extend({
                    url: url,
                    type: 'POST',
                    dataType: 'html',
                    success: function(data){
                        $(this).html(data);
                        
                        for(var i in callbacks){
                            callbacks[i].call(this);
                        }
                    }
                });
                
                $slot.base('slot','ajax',options);
            }
        }));
    };

    slotActions.json=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
        var args=Array.prototype.slice.call(arguments);
        
        return(this.each(function(){
            var $slot=$(this).base('slot');
            
            if($slot.size()>0){
                var slot=$slot.base('slot','get');
                var url='/';
                var callbacks=null;
                var data=null;
                var options={};
                
                if(slot){
                    if(typeof(slot.url)==='string'){
                        url=slot.url;
                    }

                    if(typeof(slot.data)==='object'){
                        data=slot.data;
                    }
                }
                
                if(args.length>0){
                    var i=0;
                    
                    if(typeof(args[0])==='string'){
                        url=args[0];

                        ++i;
                        
                        if(args.length>1){
                            if(typeof(args[1])==='object'){
                                data=args[1];
                                
                                ++i;
                            }
                        }                        
                    }
                    else if(typeof(args[0])==='object'){
                        data=args[0];
                        
                        ++i;
                    }
                    
                    while(i<args.length){
                        if(typeof(args[i])==='object'){
                            options=$.extend(options,args[i]);
                        }
                        else if(typeof(args[i])==='function'){
                            callbacks.push(args[i]);
                        }
                        
                        ++i;
                    }
                }
                
                options=$.extend({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    success: function(data){
                        for(var i in callbacks){
                            callbacks[i].call(this,data);
                        }
                    }
                });
                
                $slot.base('slot','ajax',options);
            }
        }));
    };
    
    slotActions.link=function(){
        return(this.filter('a').each(function(){
            $(this).click(function(e){
                e.preventDefault();
                
                var $this=$(this);   
                var target=$(this).attr('data-target');
                
                if(target){
                    $(target).base('slot','ajax',{url: $this.attr('href')});
                }
                else {
                    $this.base('slot','ajax',{url: $this.attr('href')});
                }
            });
        }));
    };
    
    slotActions.form=function(){
        return(this.filter('form').each(function(){
            $(this).submit(function(e){
                e.preventDefault();
                
                var $this=$(this);
                var target=$(this).attr('data-target');

                if(target){
                    $(target).base('slot','ajax',{url: $this.attr('action'),data: $this.serialize(),type:$this.attr('method')});
                }
                else {
                    $this.base('slot','ajax',{url: $this.attr('action'),data: $this.serialize(),type:$this.attr('method')});
                }
            });
        }));
    };
    
    slotActions.render=function(){
        var slotClass=$.base('options','slotClass')||'base-slot';
        
        return(this.each(function(){
            var slot=$(this).data(slotClass);
            
            if(slot){
                if(typeof(slot.render)==='function'){
                    slot.render.apply(this);
                }
            }
        }));
    };
    
    $.base('options','slotClass','base-slot');
    $.base('options','slotActions',slotActions);
    
    var baseSlotHandlers={
        send: function(jqXHR, settings) {
            var slotClass=$.base('options','slotClass')||'base-slot';

            $(this).append('<div class="'+slotClass+'-mask"></div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var slotClass=$.base('options','slotClass')||'base-slot';
            var msg = jqXHR.status + ' ' + jqXHR.statusText;

            $(this).find('.'+slotClass+'-mask').remove();
            $(this).html('Slot temporary inactive');
        },
        success: function(data, textStatus, jqXHR) {
            var slotClass=$.base('options','slotClass')||'base-slot';
            
            $(this).find('.'+slotClass+'-mask').remove();
            $(this).html(data);
            $(this).find('.'+slotClass+'-link').base('slot','link');
            $(this).find('.'+slotClass+'-form').base('slot','form');
            
            $(this).trigger(slotClass+'.reload');
        },
        complete: function(jqXHR, textStatus) {
        }
    };
    
    $.base('plugin','slot',function(){
        var slotClass=$.base('options','slotClass')||'base-slot';        
        var args=Array.prototype.slice.call(arguments);
        
        if(args.length==0){
            var $slot=this.filter('.'+slotClass).first();
            
            if($slot.size()>0){
                return($slot);
            }
            
            return(this.first().parents('.'+slotClass).first());                    
        }
        
        if(typeof(args[0])==='object'){
            return(this.each(function(){
                var slot=$(this).data(slotClass);
                
                slot=$.extend(slot||{},args[0]);
                
                $(this).data(slotClass,slot);                
                $(this).base('slot','render');
            }));
        }
        
        if(typeof(args[0])==='string'){
            var action=$.base('options','slotActions.'+args[0]);
            
            if(action){
                return(action.apply(this,Array.prototype.slice.call(args,1)));
            }
        }
                        
        return(this);
    });
    
})(Base,jQuery);