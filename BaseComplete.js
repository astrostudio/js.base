(function(Base,$) {

    if(!$.base){
       // alert('BaseQuery.js required');
    }
    
    $.base('plugin','complete',function(options){
                
        return(this.each(function(){
            var $this=$(this);
            var $complete=$('#base-complete');

            $this.on('input',function(){
                var url=options.url;

                $complete.hide();
                $complete.html('');

                url=Base.replace(url,'%QUERY%',$this.val());
                url=Base.replace(url,'%LIMIT%',options.limit||20);
                
                Base.json(url,function(data){
                    for(var key in data){
                        var $item=$('<div data-value="'+data[key].value+'">'+data[key].label+'</div>');
                        
                        $item.click(function(){
                            $(options.input).val(data[key].value);
                        });
                        
                        $('#base-complete').append($item);
                    }
                    
                    var offset=$this.offset();
                    
                    $complete.css({left:offset.left,top:offset.top+$this.height()});
                    
                    $complete.show();
                });
            });
            
            $this.change(function(){
                $complete.hide();
            });
        }));
    });
    
    $(document).ready(function(){
        $('body').append('<div id="base-complete" style="width:100px;position:absolute;left:100px;top:100px;z-index:5000;background-color:red;display:none;">RAZDWA</div>');
    });
    
})(Base,jQuery);
