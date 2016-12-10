(function(Base,$){
    Base.List=Base.Object.extend({
        constructor: function(element,options){
            Base.Object.call(this,options);
        },
        items: function(){
            if(this.items){
                return(this.items);
            }

            if(this.url){
                Base.Api.get(this.url,this.params||{},function(response){
                    if(!response.ok()){
                        return(false);
                    }

                    return(response.data);
                });
            }

            return([]);
        },
        render: function(){
            var items=this.items();
            var $element=$(this.element);

            $element.html('');

            for(var i in items){
                var $item=this.renderItem(items[i]);

                $element.append($item);
            }
        },
        renderItem: function(item){
            if(item.render && typeof(item.redner)==='function'){
                return(item.render());
            }

            var template=this.template || '<li></li>';

            return($(template));
        }
    });
})(Base,jQuery);