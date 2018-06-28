var fetch = require('node-fetch');
var fs = require('fs');
var prefixer = require('postcss-prefix-selector');
var postcss = require('postcss');
var minimist = require('minimist');

var css_dir="stylesheets";

if(!fs.existsSync(css_dir)){
    fs.mkdirSync(css_dir);
}

var ua_schemes = Array.from([{uri: "https://hg.mozilla.org/mozilla-central/raw-file/681eb7dfa324dd50403c382888929ea8b8b11b00/layout/style/res/html.css", name: "mozilla-ua-stylesheet.css" },
    {uri: "https://raw.githubusercontent.com/chromium/chromium/master/third_party/blink/renderer/core/css/html.css", name: "webkit-ua-stylesheet.css"}]);

ua_schemes.map((ua_scheme)=>fetch(ua_scheme.uri).then((res)=> res.text()).then((css)=>{
        fs.writeFile(css_dir+"/"+ua_scheme.name, css, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The "+ua_scheme.name+" was saved!");

            fs.readFile(css_dir+"/"+ua_scheme.name, 'utf8', function(err, data){
    if (err){
        throw err;
    }
                var lines = Array.from(data.split("\n"));
                lines = lines.filter((line)=> !line.startsWith("%if") && !line.startsWith("%endif"))
                fs.writeFile(css_dir+"/"+ua_scheme.name, lines.join("\n"), function(err, data ){
        var arguments_obj = minimist(process.argv.slice(2));
        console.log(arguments_obj);
        if(arguments_obj.prefix){
            
                console.log("apply prefix to selector for "+ ua_scheme.name);
                const css = fs.readFileSync(css_dir+"/"+ua_scheme.name, "utf8")
         
        const out = postcss().use(prefixer({
          prefix: arguments_obj.prefix
        })).process(css).css
            fs.writeFileSync(css_dir+"/"+ua_scheme.name, out);
        }
    });
});

 
});
}).then((r)=> {


}));
