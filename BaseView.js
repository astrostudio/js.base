(function(Base,$){
    Base.View=Base.extend({
        constructor: function(element,options){
            Base.call(this,options);

            this.element=element;
            this.listeners=new Base.Listeners(this);

            $(this.element).data('base-view',this);
        },
        render: function(){
            var $element=$(this.element);

            if(this.data){
                var data=Base.evaluate(this.data);

                if(typeof(data)==='object') {
                    $element.base('render',data);
                }
            }

            this.listeners.update('render');
        },
        getData: function(){
            var data={};

            return($(this.element).base('data','auto'));
        },
        setData: function(data){
            this.data=data;
            this.render();
        }
    },{
        __classPrefix: 'base-'
    });

    Base.List=Base.View.extend({
        constructor: function(element,options){
            Base.View.call(this,element,options);

            this.multiselect=this.multiselect||false;
            this.selectable=this.selectable||false;

            $(this.element).addClass('base-list');
        },
        render: function(){
            var self=this;
            var $element=$(this.element);

            $element.html('');

            if(this.data){
                var data=Base.evaluate(this.data);

                for(var i in data){
                    var $item=this.renderItem(data[i]);

                    $item.data('base-item',data[i]);
                    $item.addClass('base-item');

                    if(this.selectable) {
                        $item.click(function (e) {
                            var $this = $(this);
                            var item = $this.data('base-item');

                            var accept = true;
                            var select = !$this.hasClass('base-active');

                            if (typeof(self.beforeSelect) === 'function') {
                                accept = self.beforeSelect.call(self, $this, item, select, e);
                            }

                            if (accept) {
                                if (select) {
                                    if (!self.multiselect) {
                                        $(self.element).find('.base-item').removeClass('base-active');
                                    }

                                    $this.addClass('base-active');
                                }
                                else {
                                    $this.removeClass('base-active');
                                }
                            }

                            if (typeof(self.afterSelect) === 'function') {
                                self.afterSelect.call(self, $this, item, select, e);
                            }

                            if (typeof(self.select) === 'function') {
                                self.select.call(self, $this, item, select, e);
                            }
                        });
                    }

                    $element.append($item);
                }
            }
        },
        renderItem: function(item){
            if(item.render){
                return(Base.evaluate(item.render));
            }

            if(this.template){
                var $item=$(Base.evaluate(this.template));

                $item.base('render',item);

                return($item);
            }

            return($('<li></li>'));
        },
        active: function(delimiter){
            if(this.multiselect){
                var actives=[];

                $(this.element).find('.base-item.base-active').each(function(){
                    actives.push($(this).data('base-item'));
                });

                return(actives);
            }

            return($(this.element).find('.base-item.base-active').first().data('base-item'));
        }
    },{
        __class: 'base-list'
    });


    Base.Browser=Base.List.extend({
        constructor: function(element,options){
            Base.List.call(this,element,options);

            this.params= $.extend({},{
                page: 1,
                limit: 10
            },this.params||{});
            this.multiselect=this.multiselect||false;

            $(this.element).addClass('base-browser');

            this.reload();
        },
        reload: function(params){
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
                    self.items=data.rows;
                    self.setData(self.rows);
                    self.listeners.update('reload');
                }
            });
        }
    },{
        __class: 'base-browser'
    });

    Base.Browser.Pager=Base.View.extend({
        constructor: function(element,browser,options){
            Base.View.call(this,element,options);
            var self=this;

            this.navs= $.extend({},Base.Browser.Pager.defaultNavs,this.navs||{});

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

            var $pager=$(this.element);

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

            $pager.find('.'+Base.Browser.__class+'-page').keydown(function(e){
                if(e.keyCode==13){
                    self.browser.reload({page:$(this).val()});
                }
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
        }
    },{
        defaultNavs: {
            page: 'base-pager-page',
            sorter: 'base-pager-sorter',
            filter: 'base-pager-filter',
            limit: 'base-pager-limit',
            search: 'base-pager-search',
            pages: 'base-pager-pages',
            count: 'base-pager-count'
        }
    });

    Base.Form=Base.View.extend({
        constructor: function(element,options){
            Base.call(this,element,options);
        },
        load: function(url,params){
            var self=this;

            Base.Api.get(url,params,function(response){
                if(!response.ok()){
                    return;
                }

                self.setData(response.data);

                self.listeners.update('load',response.data);
            });
        },
        save: function(url,data){
            var self=this;
            var $element=$(this.element);

            data=data||{};

            data= $.extend({},data,this.getData());

            Base.Api.post(url,data,function(response){
                if(!response.ok()){
                    if(response.errors){
                        for(var name in response.errors){
                            $element.find('[base-error="'+name+'"]').html(response.errors[name]);
                        }
                    }
                }

                self.listeners.update('save',response);
            });
        }
    });

})(Base,jQuery);