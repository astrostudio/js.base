(function($,Base){
    if(!Base.Listeners){
        alert('Base.Listeners required');
    }
    
    Base.Browser=function(id,options){
        this.id=id;
        this.listeners=new Base.Listeners(this);
        
        if(typeof(options)==='object'){
            for(var i in options){
                this[i]=options[i];
            }
        }
        
        this.redraw=function(){
            var $browser=$('#'+this.id);
            var this_=this;
            
            $browser.html('');
            
            for(var i in this.rows){
                var $row=$(this.render(this.rows[i]));
                
                $row.click(function(e){
                    if(typeof(this_.select)==='function'){
                        this_.select.call(this_,this_.rows[i],e);
                    }
                });

                $browser.append($row);
            }
        };

        this.reload=function(options){
            if(typeof(options)=='object'){
                $.extend(this,options);
            }
            
            if(typeof(this.url)=='undefined'){
                return(false);
            }
            
            this.page=this.page||1;
            this.limit=this.limit||10;
            this.sorter=this.sorter||'';
            this.direction=this.direction||'';
            this.search=this.search||'';
            
            var url=this.url+'?page='+this.page+'&rows='+this.limit+'&sidx='+this.sorter+'&sord='+this.direction+'&_filter='+this.search;
            
            if(typeof(this.params)=='object'){
                for(var i in this.params){
                    url+='&'+i+'='+this.params[i];
                }
            }
            
            var this_=this;
            
            $.getJSON(url,function(data){
                if(typeof(data)==='object'){
                    this_.rows=data.rows||[];
                    this_.page=data.page||1;
                    this_.page=parseInt(this_.page);
                    this_.total=data.total||0;
                    this_.pages=this_.total>0?Math.ceil(this_.total/this_.limit):0;
                    this_.redraw();
                    this_.listeners.update('reload');                    
                }
            });            
        };
        
        this.render=function(row){
            if(typeof(this.template)!=='undefined'){
                return(Base.render(this.template,row));
            }
            
            if(typeof(row.label)!=='undefined'){
                return(row.label);
            }
            
            return($('<div>'+JSON.stringify(row)+'</div>'));
        };
        
        $.extend(this,options);        
        
        $('#'+this.id).data('baseBrowser',this);
        
        this.reload();
    };
    
    Base.Browser.classPrefix='base-browser';
    Base.Browser.Pager=function(id,browser){
        var this_=this;
        
        this.id=id;
        this.browser=browser;
        this.browser.listeners.append(function(){
            console.log(this);
            $pager.find('input.'+Base.Browser.classPrefix+'-page').val(this.page);
            $pager.find('.'+Base.Browser.classPrefix+'-page').html(this.page);
            $pager.find('.'+Base.Browser.classPrefix+'-sorter').val(this.sorter);
            $pager.find('.'+Base.Browser.classPrefix+'-limit').val(this.limit);
            $pager.find('.'+Base.Browser.classPrefix+'-pages').html(this.pages);
            $pager.find('.'+Base.Browser.classPrefix+'-total').html(this.total);
        });
        
        var $pager=$('#'+this.id);
        
        $pager.find('.'+Base.Browser.classPrefix+'-first').click(function(e){
            e.preventDefault();
            
            this_.browser.reload({page:1});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-prev').click(function(e){
            e.preventDefault();
            
            if(this_.browser.page>1){
                this_.browser.reload({page:this_.browser.page-1});
            }
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-next').click(function(e){
            e.preventDefault();
            
            if(this_.browser.page<this_.browser.pages){
                this_.browser.reload({page:this_.browser.page+1});
            }
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-last').click(function(e){
            e.preventDefault();
            
            this_.browser.reload({page:this_.browser.pages});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-page').click(function(e){
            e.preventDefault();
            
            this_.browser.reload({page:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-direction').click(function(e){
            e.preventDefault();
            
            this_.browser.reload({direction:this_.browser.direction=='dsc'?'asc':'dsc'});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-sorter').change(function(){
            this_.browser.reload({sorter:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-filter').change(function(){
            this_.browser.reload({filter:$(this).val()});
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-limit').change(function(){
            this_.browser.reload({limit:$(this).val()});
        });

        $pager.find('.'+Base.Browser.classPrefix+'-search').keydown(function(e){
            if(e.keyCode==13){
                this_.browser.reload({search:$(this).val()});
            }
        });
        
        $pager.find('.'+Base.Browser.classPrefix+'-form').submit(function(e){
            e.preventDefault();
            
            var s=$pager.find('.'+Base.Browser.classPrefix+'-search').val();
            
            if(s){            
                this_.browser.reload({search:s});
            }
        });
                
        $pager.data('baseBrowserPager',this);
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