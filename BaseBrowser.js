(function($,Base){
    if(!Base.Listeners){
        alert('Base.Listeners required');
    }

    Base.Browser=function(id,options) {
        options= $.extend({},options||{});

        this.id = id;
        this.listeners = new Base.Listeners(this);
        this.params= $.extend({},{
            page: 1,
            limit: 10
        },options.params||{});

        $.extend(this,options);

        var $browser=$('#'+this.id);

        $browser.addClass(Base.Browser.__class);
        $browser.data(Base.Browser.__class, this);

        this.reload();
    };
    Base.Browser.prototype.redraw=function(){
        var self=this;
        var $browser=$('#'+this.id);

        $browser.html('');

        for(var i in this.rows){
            var $row=$(this.render(this.rows[i]));

            $row.addClass(Base.Browser.__class+'-row');
            $row.data(Base.Browser.__class+'-row',this.rows[i]);

            $row.click(function(e){
                var $this=$(this);
                var row=$this.data(Base.Browser.__class+'-row');

                $this.parents(Base.Browser.__class).first().find('.'+Base.Browser.__class+'-row').removeClass(Base.Browser.__class+'-active');
                $this.addClass(Base.Browser.__class+'-active');

                if(typeof(self.select)==='function'){
                    self.select.call(self,$this,row,e);
                }
            });

            $browser.append($row);
        }
    };
    Base.Browser.prototype.reload=function(params){
        params= $.extend({},{
            page: 1,
            limit: 10
        },this.params||{},params||{});

        if(typeof(this.url)=='undefined'){
            return(false);
        }

        this.params=params;

        var self=this;

        $.getJSON(this.url,params,function(data){
            if(typeof(data)==='object'){
                self.rows=data.rows||[];
                self.params.page=data.page||1;
                self.params.page=parseInt(self.params.page);
                self.count=data.count||0;
                self.pages=self.count>0?Math.ceil(self.count/self.params.limit):0;
                self.params.sorter=data.sorter;
                self.params.filter=data.filter;
                self.params.search=data.search;
                self.redraw();
                self.listeners.update('reload');
            }
        });
    };
    Base.Browser.prototype.render=function(row){
        if(typeof(this.template)!=='undefined'){
            return(Base.render(this.template,row));
        }

        if(typeof(row.label)!=='undefined'){
            return(row.label);
        }

        return($('<div>'+JSON.stringify(row)+'</div>'));
    };
    Base.Browser.prototype.active=function(){
        return($('#'+this.id).find('.'+Base.Browser.__class+'-row.'+Base.Browser.__class+'-active').first().data(Base.Browser.__class+'-row'));
    };

    Base.Browser.__class='base-browser';
    Base.Browser.Pager=function(id,browser){
        var self=this;
        
        this.id=id;
        this.browser=browser;
        this.browser.listeners.append(function(){
            $pager.find('input.'+Base.Browser.__class+'-page').val(this.params.page);
            $pager.find('.'+Base.Browser.__class+'-page').html(this.params.page);
            $pager.find('.'+Base.Browser.__class+'-sorter').val(this.params.sorter);
            $pager.find('.'+Base.Browser.__class+'-filter').val(this.params.filter);
            $pager.find('.'+Base.Browser.__class+'-limit').val(this.params.limit);
            $pager.find('.'+Base.Browser.__class+'-search').val(this.params.search);
            $pager.find('.'+Base.Browser.__class+'-pages').html(this.pages);
            $pager.find('.'+Base.Browser.__class+'-count').html(this.count);
        });
        
        var $pager=$('#'+this.id);

        $pager.addClass(Base.Browser.__class+'-pager');
        $pager.data(Base.Browser.__class+'-pager',this);
        
        $pager.find('.'+Base.Browser.__class+'-first').click(function(e){
            e.preventDefault();
            
            self.browser.reload({page:1});
        });
        
        $pager.find('.'+Base.Browser.__class+'-prev').click(function(e){
            e.preventDefault();
            
            if(self.browser.params.page>1){
                self.browser.reload({page:self.browser.params.page-1});
            }
        });
        
        $pager.find('.'+Base.Browser.__class+'-next').click(function(e){
            e.preventDefault();
            
            if(self.browser.params.page<self.browser.pages){
                self.browser.reload({page:self.browser.params.page+1});
            }
        });
        
        $pager.find('.'+Base.Browser.__class+'-last').click(function(e){
            e.preventDefault();
            
            self.browser.reload({page:self.browser.pages});
        });
        
        $pager.find('.'+Base.Browser.__class+'-page').click(function(e){
            e.preventDefault();
            
            self.browser.reload({page:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.__class+'-sorter').change(function(){
            self.browser.reload({sorter:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.__class+'-filter').change(function(){
            self.browser.reload({filter:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.__class+'-limit').change(function(){
            self.browser.reload({limit:$(this).val()});
        });

        $pager.find('.'+Base.Browser.__class+'-search').keydown(function(e){
            if(e.keyCode==13){
                self.browser.reload({search:$(this).val()});
            }
        });
        
        $pager.find('.'+Base.Browser.__class+'-form').submit(function(e){
            e.preventDefault();
            
            var s=$pager.find('.'+Base.Browser.__class+'-search').val();
            
            if(s){            
                self.browser.reload({search:s});
            }
        });

        $pager.find('form').submit(function(e){
            e.preventDefault();
        });
    };
    
    Base.Browser.set=function(id,options){
        $('#'+id).html('<div id="'+id+'-pager"></div><table id="'+id+'-table"></table>');
        $('#'+id+'-table').jqGrid($.extend({
            datatype: 'json',
            height: "100%",
            pager: $('#'+id+'-pager'),
            toppager: true,
            rowNum: 5,
            toolbar:[true,'top'],
            rowList: [5,10,20,50,100],
            reload: true,
            autowidth: true,
            viewrecords: true,
            sortorder: 'desc',
            afterInsertRow: function(rowId,rowData,row){
                $('#'+rowId).data('jqgrid-row',row);
            },
            loadComplete: function() { },
            toolbar: [true, 'top'],
            searchrules: {search: false},
        },options));
        
        $(window).resize(function(){
            $('#'+id+'-table').jqGrid('setGridWidth',$('#'+id).width(),true);
        });
    };
    
})(jQuery,Base);