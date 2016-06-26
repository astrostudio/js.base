(function(Base){
    Base.Locale={};
    Base.Locale.language='';
    Base.Locale.__strings={};
    Base.Locale.get=function(space,alias,language){
        language=language||Base.Locale.language;

        if(!(language in Base.Locale.__strings)) {
            return (alias);
        }

        if(!(space in Base.Locale.__strings[language])){
            return(alias);
        }

        if(!(alias in Base.Locale.__strings[language][space])){
            return(alias);
        }

        return(Base.Locale.__strings[language][space][alias]);
    };
    Base.Locale.set=function(){
        var args=Array.prototype.slice.call(arguments);
        var argc=args.length;

        if(argc==0) {
            return;
        }

        if(typeof(args[0])==='object'){
            var language=argc>1?args[1]:Base.Locale.language;

            Base.Locale.__strings[language]=args[0];

            return;
        }

        if(args==1){
            return;
        }

        if(typeof(args[1])==='object'){
            var language=argc>2?args[2]:Base.Locale.language;

            if((!(language in Base.Locale.__strings))){
                Base.Locale.__strings[language]={};
            }

            if(!(args[0] in Base.Locale.__strings[language])){
                Base.Locale.__strings[language][args[0]]={};
            }

            Base.Locale.__strings[language][args[0]]=args[1];

            return;
        }

        if(argc==2){
            return;
        }

        if(typeof(args[2])==='object'){
            var language=argc>3?args[3]:Base.Locale.language;

            if((!(language in Base.Locale.__strings))){
                Base.Locale.__strings[language]={};
            }

            if(!(args[1] in Base.Locale.__strings[language])){
                Base.Locale.__strings[language][args[0]][args[1]]={};
            }

            Base.Locale.__strings[language][args[0]][args[1]]=args[2];

            return;
        }

        if(argc==3){
            return;
        }

        var language=argc>4?args[4]:Base.Locale.language;

        if((!(language in Base.Locale.__strings))){
            Base.Locale.__strings[language]={};
        }

        if(!(args[1] in Base.Locale.__strings[language])){
            Base.Locale.__strings[language][args[0]][args[1]]={};
        }

        Base.Locale.__strings[language][args[0]][args[1]]=args[2];
    };

})(Base);