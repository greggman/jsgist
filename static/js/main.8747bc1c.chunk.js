(this.webpackJsonpjsGist=this.webpackJsonpjsGist||[]).push([[0],{104:function(e,t,a){},105:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(39),s=a.n(o),i=(a(55),a(1)),c=a.n(i),l=a(5),u=a(13),d=a(2),h=a(6),m=a(3),p=a(4);function g(e){return r.a.createElement("input",{type:"text",onChange:function(t){e.onChange(t.target.value)},placeholder:e.placeholder,value:e.value})}var v=function(e){return JSON.stringify(e.replace(/</g,"(").replace(/>/g,")"))},f=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handleMessage=function(t){var a=t.data,n=a.type,r=a.data;switch(n){case"resize":console.log("-got resize msg from comments.js--"),e.iframeRef.current.style.height="".concat(r.height,"px")}},e.iframeRef=r.a.createRef(),e}return Object(h.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("message",this.handleMessage)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("message",this.handleMessage)}},{key:"shouldComponentUpdate",value:function(e){return e.disqusId!==this.disqusId}},{key:"makeBlobURL",value:function(){this.disqusId=this.props.disqusId;var e=window.location.origin,t='\n    <html>\n      <link href="'.concat(e,'/comments.css" rel="stylesheet">\n      <body>\n        <script src="').concat(e,'/comments.js" type="module"><\/script>\n        <div id="disqus_thread"></div>\n        <script type="text/javascript">\n      /**\n       *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.\n       *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables\n       */\n      \n      var disqus_config = function () {\n          this.page.url = \'').concat(window.location.origin).concat(this.disqusId,"';\n          this.page.identifier = '").concat(v(this.disqusId),"';\n          this.page.title = '").concat(v(this.props.title),"';\n      };\n      \n      (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW\n          if (window.location.hostname.indexOf(\"jsgist.org\") < 0) {\n              return;\n          }\n\n          var d = document, s = d.createElement('script');\n          \n          s.src = '//").concat(this.props.disqusShortName,'.disqus.com/embed.js\';  // IMPORTANT: Replace EXAMPLE with your forum shortname!\n          \n          s.setAttribute(\'data-timestamp\', +new Date());\n          (d.head || d.body).appendChild(s);\n      })();\n        <\/script>\n        <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>\n      </body>\n    </html>\n    '),a=new Blob([t],{type:"text/html"});return URL.createObjectURL(a)}},{key:"render",value:function(){return r.a.createElement("iframe",{ref:this.iframeRef,title:"comments",src:this.makeBlobURL(),sandbox:"allow-scripts"})}}]),a}(r.a.Component);function b(e){return r.a.createElement("div",{className:"comments"},r.a.createElement("hr",null),e.disqusId?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"comment-notes"},"Use ",r.a.createElement("b",null,"<pre><code>"),"code goes here",r.a.createElement("b",null,"</code></pre>")," for code blocks"),r.a.createElement(f,{disqusId:e.disqusId,disqusShortName:e.disqusShortName,title:e.title})):[])}var E=a(8),y=a(9),w=a(49);function k(e,t){var a=e/t|0,n=e%t,r=new Array(t).fill(a);if(0===n)return r;if(n<=t/2|0){var o=t/n|0,s=o/2|0;return r.map((function(e,t){return e+(t%o===s?1:0)}))}var i=t/(t-n)|0,c=i/2|0;return r.map((function(e,t){return e+(1-(t%i===c?1:0))}))}var S=function(e){return"horizontal"===e?{dimension:"width",clientAxis:"clientX",position:"left",positionEnd:"right",clientSize:"clientWidth",style:{width:"100%",display:"flex"}}:{dimension:"height",clientAxis:"clientY",position:"top",positionEnd:"bottom",clientSize:"clientHeight",style:{height:"100%"}}};function j(e){var t=e.startSizes,a=e.currentSizes,n=e.prevPaneNdx,r=e.gutterSize,o=e.minSize,s=e.deltaPX,i=e.outerSizePX,c=a.length,l=k((c-1)*r,c),d=n+1,h=Math.ceil(t[n]*i)-l[n],m=h+(Math.ceil(t[d]*i)-l[d]),p=Math.min(Math.max(o,h+s),m-o),g=m-p;return[].concat(Object(u.a)(a.slice(0,n)),[(p+l[n])/i,(g+l[d])/i],Object(u.a)(a.slice(n+2,a.length)))}var O=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(e){var n;Object(d.a)(this,a),(n=t.call(this,e))._setSizes=function(e){n.setState({sizes:e})},n.handleMouseUp=function(){document.removeEventListener("mousemove",n.handleMouseMove),document.removeEventListener("mouseup",n.handleMouseUp),n.setState({dragging:!1})},n.handleMouseMove=function(e){var t=n.props,a=t.gutterSize,r=void 0===a?10:a,o=t.direction,s=void 0===o?"horizontal":o,i=t.minSize,c=void 0===i?10:i,l=t.computeNewSizesFn,u=void 0===l?j:l,d=t.onSetSizes,h=t.sizes,m=n.state,p=m.prevPaneNdx,g=m.mouseStart,v=m.startSizes,f=m.sizes,b=d||n._setSizes,E=d?h:f,y=S(s),w=y.clientAxis,k=y.clientSize;b(u({startSizes:v,currentSizes:E,prevPaneNdx:p,gutterSize:r,minSize:c,deltaPX:e[w]-g,outerSizePX:n.elementRef.current[k]}))},n.handleMouseDown=function(e){var t=n.props.direction,a=S(void 0===t?"horizontal":t).clientAxis;document.addEventListener("mousemove",n.handleMouseMove),document.addEventListener("mouseup",n.handleMouseUp);var r=(Array.prototype.indexOf.call(e.target.parentElement.children,e.target)-1)/2;n.setState({startSizes:n.state.sizes.slice(),mouseStart:e[a],prevPaneNdx:r,dragging:!0})},n.recomputeSizes=function(){var e=n.state.sizes,t=n.props,a=(t.minSize,t.direction),o=(t.gutterSize,S(a).clientSize),s=r.a.Children.count(n.props.children),i=s<e.length?function(e){var t=e.reduce((function(e,t){return e+t}),0);return e.map((function(e){return e/t}))}(e.slice(0,s)):function(e,t,a,n,r){return new Array(t).fill(1/t)}(0,s,0,0,n.elementRef.current.parentElement[o]);n._setSizes(i)};var o=r.a.Children.count(e.children),s=1/o;return n.state={sizes:new Array(o).fill(s)},n.elementRef=r.a.createRef(),n}return Object(h.a)(a,[{key:"componentDidUpdate",value:function(){var e=this.props,t=e.children,a=e.onSetSizes,n=this.state.sizes;if(!a){var o=r.a.Children.count(t);n.length!==o&&setTimeout(this.recomputeSizes)}}},{key:"render",value:function(){var e=this,t=this.props,a=t.children,n=t.direction,o=void 0===n?"horizontal":n,s=t.gutterSize,i=void 0===s?10:s,c=t.sizes,l=t.onSetSizes,u=(t.minSize,Object(w.a)(t,["children","direction","gutterSize","sizes","onSetSizes","minSize"])),d=this.state,h=d.dragging,m=d.prevPaneNdx,p=d.sizes,g=S(o),v=g.dimension,f=g.style,b=l?c:p,j=r.a.Children.count(a),O=i*(j-1),N=Object(y.a)({},v,"".concat(i,"px")),x=k(O,j),C=0,z=!0,I=[];return r.a.Children.forEach(a,(function(t,a){if(!r.a.isValidElement(t))return null;z||I.push(r.a.createElement("div",{key:"gutter".concat(I.length),className:"gutter gutter-".concat(o," ").concat(h&&C===m+1?"gutter-dragging":""),style:N,onMouseDown:e.handleMouseDown}));var n=Object(E.a)(Object(E.a)({},t.props.style),{},Object(y.a)({},v,"calc(".concat(100*b[C],"% - ").concat(x[C],"px)")));I.push(r.a.cloneElement(t,Object(E.a)({key:"pane".concat(I.length),style:n},t.props))),z=!1,++C})),r.a.createElement("div",Object.assign({className:"split",ref:this.elementRef,style:Object(E.a)(Object(E.a)(Object(E.a)({},this.props.style),f),h&&{userSelect:"none"})},u),I)}}]),a}(r.a.Component),N=a(12),x=a(7),C=a(27);function z(e){var t=JSON.parse(e.files["jsGist.json"].content);return t.files=Object.entries(e.files).filter((function(e){return"jsGist.json"!==Object(x.a)(e,1)[0]})).map((function(e){var t=Object(x.a)(e,2);return{name:t[0],content:t[1].content}})).concat(t.files||[]),t}function I(e,t){var a=e.files.reduce((function(e,t){return e[t.name]={content:t.content},e}),{}),n=Object(E.a)({},e),r={};return a["jsGist.json"]=r,Object.keys(a).length===e.files.length+1?delete n.files:a={"jsGist.json":r},r.content=JSON.stringify(n),Object(E.a)({description:e.name,public:!e.settings.private,files:a},t&&{gist_id:t})}var L=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).pat="",e.user={},e.unAuthorizedOctokit=new C.a({userAgent:"jsGist v0.0.1"}),e}return Object(h.a)(a,[{key:"_updateUserData",value:function(e){if(e.owner){this.user.name=e.owner.login,this.user.avatarURL=e.owner.avatar_url;var t=new Event("userdata");t.data=Object(E.a)({},this.user),this.dispatchEvent(t)}}},{key:"setPat",value:function(e){e!==this.pat&&(this.pat=e,this.authorizedOctokit=new C.a({auth:e,userAgent:"jsGist v0.0.1"}))}},{key:"getUserGists",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.authorizedOctokit.paginate(this.authorizedOctokit.gists.list);case 2:return t=e.sent,e.abrupt("return",t.filter((function(e){return!!e.files["jsGist.json"]})));case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getUserGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.octokit.gists.get({gist_id:t});case 2:return a=e.sent,this._updateUserData(a.data),e.abrupt("return",z(a.data));case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAnonGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.github.com/gists/".concat(t));case 2:return a=e.sent,e.next=5,a.json();case 5:return n=e.sent,this._updateUserData(n),e.abrupt("return",z(n));case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"createGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.authorizedOctokit.gists.create(I(t));case 2:return a=e.sent,this._updateUserData(a.data),e.abrupt("return",a.data.id);case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t,a){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.authorizedOctokit.gists.update(I(a,t));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"octokit",get:function(){return this.authorizedOctokit||this.unAuthorizedOctokit}}]),a}(Object(N.a)(EventTarget)),R=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;Object(d.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).handleKeyDown=function(t){27===t.keyCode&&e.props.onClose()},e}return Object(h.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("keydown",this.handleKeyDown)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this.handleKeyDown)}},{key:"render",value:function(){var e=this.props,t=e.title,a=e.children,n=e.onClose;return r.a.createElement("div",{onClick:n,className:"dialog"},r.a.createElement("div",{tabIndex:"-1",onClick:function(e){e.stopPropagation()}},r.a.createElement("div",{className:"dialog-heading"},r.a.createElement("div",{className:"dialog-title"},t),r.a.createElement("div",{className:"dialog-close"},r.a.createElement("button",{onClick:n},"X"))),r.a.createElement("div",{className:"dialog-content"},a)))}}]),a}(r.a.Component);function A(e){var t=e.onClose;return r.a.createElement(R,{title:"jsGist",onClose:t},r.a.createElement("div",{className:"markdown"},r.a.createElement("p",null,"Add your test cases, click ",r.a.createElement("code",null,"Run"),"."),r.a.createElement("h2",null,"Contribute, Fix, Enhance!"),r.a.createElement("p",null,r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/greggman/jsgist"},"https://github.com/greggman/jsgist")),r.a.createElement("p",null,"Also see ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://jsbenchit.org"},"jsbenchit.org")),r.a.createElement("h2",null,"Saving"),r.a.createElement("p",null,"You can save your tests in multiple ways."),r.a.createElement("ol",null,r.a.createElement("li",null,"To a github gist using a ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"},"Personal Access Token"),r.a.createElement("p",null,"Be sure to give the token ",r.a.createElement("b",null,"ONLY GIST")," permissions. Paste it into the save as UI click ",r.a.createElement("code",null,"Save to new gist"),". Be sure to keep a copy of it somewhere so you can use if you clear your browser's storage or switch machines or browser. This site is a static site. The token is saved in the browser only.")),r.a.createElement("li",null,"Save it manually into github",r.a.createElement("p",null,"Copy the JSON. Go to github. Create a new gist. Name the file",r.a.createElement("code",null,"jsGist.json"),' Paste the JSON in. Pick "Create public gist".'),r.a.createElement("p",null,"Note the id in the URL after you create the gist."),r.a.createElement("p",null,"Create a url in the form ",r.a.createElement("code",null,"https://jsgist.org/?src=<gist_id>--"),"."),r.a.createElement("p",null,"Example: ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://jsgist.org/?src=bad0a8491bd6614e729ff01cc14089c9"},"https://jsbenchit.org/?src=bad0a8491bd6614e729ff01cc14089c9"))),r.a.createElement("li",null,"Save it manually somewhere else.",r.a.createElement("p",null,"If there's some other service that will provide a string via http get then copy and save the JSON there then create a URL in the form of ",r.a.createElement("code",null,"https://jsgist.org/?src=<url>"),". Note: you will have to escape the URL although if just paste it into your browser it will likely do the conversion for you.")),r.a.createElement("li",null,"Save it as a bookmark or link",r.a.createElement("p",null,"In the SaveAs dialog there's a link that contains all the data for your benchmark.")))))}var U=/([a-z])([A-Z])/g,D=function(e,t,a){return"".concat(t,"-").concat(a)},M=function(e){return e.replace(U,D).toLowerCase()};function T(){for(var e=[],t=arguments.length,a=new Array(t),n=0;n<t;n++)a[n]=arguments[n];for(var r=0,o=a;r<o.length;r++){var s=o[r];if("string"===typeof s)e.push(s);else for(var i=0,c=Object.entries(s);i<c.length;i++){var l=Object(x.a)(c[i],2),u=l[0],d=l[1];d&&e.push(M(u))}}return e.join(" ")}var G=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handlePATChange=function(t){var a=t.target.value;e.setState({pat:a}),localStorage.setItem("pat",a)},e.loadGists=function(){var t=Object(l.a)(c.a.mark((function t(a){var n,r,o,s,i;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({loading:!0}),n=e.props,r=n.addError,o=n.github,s=e.state.pat,o.setPat(s),t.prev=4,t.next=7,o.getUserGists();case 7:i=t.sent,e.setState({gists:i.map((function(e){return e}))}),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(4),r("could not load gists: ".concat(t.t0));case 14:e.setState({loading:!1});case 15:case"end":return t.stop()}}),t,null,[[4,11]])})));return function(e){return t.apply(this,arguments)}}(),e.state={loading:!1,pat:localStorage.getItem("pat")||"",gists:[]},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this.state,t=e.pat,a=e.gists,n=e.loading,o=!!t&&!n;return r.a.createElement("div",null,r.a.createElement("div",{className:"save-as-gist-pat"},r.a.createElement("div",null,"Personal Access Token:\xa0"),r.a.createElement("div",null,r.a.createElement("input",{type:"password",value:t,placeholder:"personal access token",onChange:this.handlePATChange}))),r.a.createElement("p",null,r.a.createElement("button",{className:T({disabled:!o}),onClick:this.loadGists},"Load Your Gists")),r.a.createElement("p",null,r.a.createElement("a",{href:"https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token"},"Create a Personal Access Token")," with only ",r.a.createElement("b",null,"gist")," permissions. Paste it above. Note: This is a static website. Your person access token is stored only locally in your browser and only accessible by this domain."),a.length?r.a.createElement("table",{className:"gists"},r.a.createElement("tbody",null,a.map((function(e,t){return r.a.createElement("tr",{key:"g".concat(t)},r.a.createElement("td",null,r.a.createElement("a",{href:"".concat(window.location.origin,"?src=").concat(encodeURIComponent(e.id))},e.description)),r.a.createElement("td",null,e.updated_at.substring(0,10)))})))):[])}}]),a}(r.a.Component),P=a(43),q=(a(63),a(64),a(65),a(30),a(66),a(69),a(70),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):{}),J=function(){},V=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(e){var n;Object(d.a)(this,a),n=t.call(this,e);var r=e.value,o=e.hackKey;return n.state={value:r,hackKey:o},n}return Object(h.a)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.options,n=void 0===a?{}:a,o=t.onValueChange,s=void 0===o?J:o,i=this.state.value,c=q.matches;return r.a.createElement(P.Controlled,{value:i,options:Object(E.a)({mode:"javascript",scrollbarStyle:"overlay",theme:c?"material":"eclipse"},n.editor&&n.editor),onBeforeChange:function(t,a,n){e.setState({value:n})},onChange:function(e,t,a){s(a)}})}}],[{key:"getDerivedStateFromProps",value:function(e,t){return t.hackKey!==e.hackKey?{hackKey:e.hackKey,value:e.value}:null}}]),a}(r.a.Component),_=a(18),B=a(44),K=a.n(B),W=a(45),H=(new K.a).compile(W),F={};function Y(e){var t=F[e]||{subscriptions:new Set};return F[e]=t,t}function X(e,t){var a=Y(e);return void 0!==t&&(a.value=t),a}function $(e){return F[e].value}function Q(e,t){var a=F[e];if(!a)throw new Error("no such track value: ".concat(e));a.value=t;var n,r=Object(u.a)(a.subscriptions.keys()),o=Object(_.a)(r);try{for(o.s();!(n=o.n()).done;){(0,n.value)(t,e)}}catch(s){o.e(s)}finally{o.f()}}function Z(e,t){Y(e).subscriptions.add(t)}var ee={name:"My jsGist",settings:{},files:[{name:"index.html",content:""},{name:"index.css",content:""},{name:"index.js",content:""}]};function te(){var e="".concat(window.location.origin,"/resources/images/logo.svg");return JSON.parse(JSON.stringify({name:"jsGist",settings:{},files:[{name:"index.html",content:""},{name:"index.css",content:"\n          html, body {\n            margin: 0;\n            width: 100%;\n            height: 100%;\n            background-image: url(".concat(e,");\n            background-size: contain contain;\n            background-position: center center;\n            background-repeat: no-repeat no-repeat;\n          }\n          @media (prefers-color-scheme: dark) {\n            html {\n              background: #222;\n            }\n          }\n        ")},{name:"index.js",content:""}]}))}var ae=JSON.parse(JSON.stringify(ee));function ne(){Q("dataVersion",$("dataVersion")+1)}function re(e){!function(e){if(!H(e))throw new Error("data not valid:\n".concat(H.errors.map((function(e){return"".concat(e.message,": ").concat(e.dataPath)}))))}(e),ae=e,ne(),Q("updateVersion",$("updateVersion")+1)}function oe(e){var t=Object(n.useState)(""),a=Object(x.a)(t,2),o=a[0],s=a[1];return r.a.createElement("div",null,r.a.createElement("div",{style:{height:"100px"}},r.a.createElement(V,{value:o,onValueChange:s})),r.a.createElement("p",null,r.a.createElement("button",{onClick:function(){var t=e.onLoad,a=e.addError;try{re(JSON.parse(o)),t()}catch(n){a("bad json: ".concat(n))}}},"Load JSON")))}function se(e){var t=Object(n.useState)(""),a=Object(x.a)(t,2),o=a[0],s=a[1];function i(){return(i=Object(l.a)(c.a.mark((function t(){var a,n,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.addError,n=e.onLoad,t.prev=1,t.next=4,fetch(o);case 4:return r=t.sent,t.next=7,r.json();case 7:re(t.sent),n(),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(1),a("could not load url: ".concat(t.t0));case 15:case"end":return t.stop()}}),t,null,[[1,12]])})))).apply(this,arguments)}return r.a.createElement("div",null,r.a.createElement(g,{value:o,onChange:s,placeholder:"url-to-json"}),r.a.createElement("p",null,r.a.createElement("button",{onClick:function(){return i.apply(this,arguments)}},"Load URL")))}function ie(e){var t=e.heading,a=e.children;return r.a.createElement("div",{className:"section"},r.a.createElement("div",{className:"section-heading"},t),r.a.createElement("div",{className:"section-content"},a))}function ce(e){var t=e.data,a=e.github,n=e.onLoad,o=e.onClose,s=e.addError;return r.a.createElement(R,{title:"Load",onClose:o},r.a.createElement(ie,{heading:"Load Gist"},r.a.createElement(G,{github:a,data:t,onLoad:n,addError:s})),r.a.createElement(ie,{heading:"Load URL"},r.a.createElement(se,{data:t,onLoad:n,addError:s})),r.a.createElement(ie,{heading:"Load JSON"},r.a.createElement(oe,{data:t,onLoad:n,addError:s})))}H(ae)||console.log(H.errors),X("dataVersion",0),X("updateVersion",0);var le=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handlePATChange=function(t){var a=t.target.value;e.setState({pat:a}),localStorage.setItem("pat",a)},e.onSaveNew=Object(l.a)(c.a.mark((function t(){var a,n,r,o,s,i,l,u,d;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({saving:!0}),a=e.props,n=a.data,r=a.github,o=a.addError,s=a.onSave,i=a.onClose,l=e.state.pat,u=!1,r.setPat(l),t.prev=5,t.next=8,r.createGist(n);case 8:d=t.sent,s(d),u=!0,t.next=16;break;case 13:t.prev=13,t.t0=t.catch(5),o("could not create gist: ".concat(t.t0));case 16:e.setState({saving:!1}),u&&i();case 18:case"end":return t.stop()}}),t,null,[[5,13]])}))),e.onSaveOverExisting=Object(l.a)(c.a.mark((function t(){var a,n,r,o,s,i,l,u;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({saving:!0}),a=e.props,n=a.data,r=a.gistId,o=a.github,s=a.addError,i=a.onClose,l=e.state.pat,u=!1,o.setPat(l),t.prev=5,t.next=8,o.updateGist(r,n);case 8:u=!0,t.next=14;break;case 11:t.prev=11,t.t0=t.catch(5),s("could not update gist: ".concat(t.t0));case 14:e.setState({saving:!1}),u&&i();case 16:case"end":return t.stop()}}),t,null,[[5,11]])}))),e.state={saving:!1,pat:localStorage.getItem("pat")||""},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this.state.pat,t=this.props.gistId,a=e&&t;return r.a.createElement("div",null,r.a.createElement("div",{className:"save-as-gist-pat"},r.a.createElement("div",null,"Personal Access Token:\xa0"),r.a.createElement("div",null,r.a.createElement("input",{type:"password",value:e,placeholder:"personal access token",onChange:this.handlePATChange}))),r.a.createElement("p",null,r.a.createElement("button",{className:T({disabled:!e}),onClick:this.onSaveNew},"Save to new Gist"),r.a.createElement("button",{className:T({disabled:!a}),onClick:this.onSaveOverExisting},"Update Existing Gist")),r.a.createElement("p",null,r.a.createElement("a",{href:"https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token"},"Create a Personal Access Token")," with only ",r.a.createElement("b",null,"gist")," permissions. Paste it above. Note: This is a static website. Your person access token is stored only locally in your browser and only accessible by this domain."))}}]),a}(r.a.Component);function ue(e){var t=e.data;return r.a.createElement("div",null,r.a.createElement("div",null,"Copy the text below, paste into the load ui or put somewhere on the net and make your own URL with ",r.a.createElement("code",null,window.location.origin,"?src=url-to-json"),"."),r.a.createElement("pre",{style:{userSelect:"all"}},JSON.stringify(t)),r.a.createElement("div",null,r.a.createElement("a",{href:"".concat(window.location.origin,"?src=").concat(encodeURIComponent("".concat(window.location.origin,"/example.json")))},"Example")))}var de=a(26),he=a(28),me=new TextEncoder,pe=new TextDecoder,ge=function(e){return e.startsWith("cb64,")||e.startsWith("b64,")};function ve(e){var t=e.startsWith("cb64,"),a=t?"cb64,":"b64,",n=e.substr(a.length).replace(/-/g,"+").replace(/_/g,"/"),r=new Uint8Array(Object(de.decode)(n)),o=t?Object(he.b)(r):r,s=pe.decode(o);return JSON.parse(s)}function fe(e){var t=function(e){var t=JSON.stringify(e),a=me.encode(t),n=Object(he.a)(a),r=n.length<a.length,o=Object(de.encode)(r?n:a).replace(/\+/g,"-").replace(/\//g,"_");return"".concat(r?"cb64,":"b64,").concat(o)}(e.data),a="".concat(window.location.origin,"?src=").concat(encodeURIComponent(t));return r.a.createElement("div",null,r.a.createElement("div",null,"Copy / bookmark the link below"),r.a.createElement("a",{className:"bookmark",href:a,target:"_blank",rel:"noopener noreferrer"},a))}function be(e){var t=e.data,a=e.github,n=e.gistId,o=e.onSave,s=e.onClose,i=e.addError;return r.a.createElement(R,{title:"Save As",onClose:s},r.a.createElement(ie,{heading:"Save As Gist"},r.a.createElement(le,{gistId:n,github:a,data:t,onClose:s,onSave:o,addError:i})),r.a.createElement(ie,{heading:"Save As URL"},r.a.createElement(fe,{data:t})),r.a.createElement(ie,{heading:"Save As JSON"},r.a.createElement(ue,{data:t})))}var Ee=a(46),ye=a.n(Ee),we=a(47),ke=a.n(we),Se=a(48),je=a.n(Se);function Oe(e){var t=e.children,a=e.onChange,n=e.selected;return r.a.createElement("div",{className:T({radioSelected:n}),onClick:a},t)}function Ne(e){var t=e.selectedNdx,a=e.onChange,n=e.children,o=0,s=r.a.Children.map(n,(function(e){if(!r.a.isValidElement(e))return null;var n=o===t,s=o;return o+=1,r.a.cloneElement(e,{selected:n,onChange:function(){return a(s)}})}));return r.a.createElement("div",{class:"radio"},s)}function xe(e){var t=e.onClose;return r.a.createElement(R,{title:"Settings",onClose:t},r.a.createElement(Ne,{selectedNdx:0,onChange:function(e){console.log(e)}},r.a.createElement(Oe,null,r.a.createElement("img",{style:{height:"2em"},src:ye.a,alt:"vertical"})),r.a.createElement(Oe,null,r.a.createElement("img",{style:{height:"2em"},src:ke.a,alt:"horizontal"})),r.a.createElement(Oe,null,r.a.createElement("img",{style:{height:"2em"},src:je.a,alt:"2x2"}))))}function Ce(e){var t=e.value,a=e.hackKey,n=e.heading,o=e.extra,s=void 0===o?[]:o,i=e.options,c=void 0===i?{}:i,l=e.onValueChange;return r.a.createElement("div",{className:"code-area",style:e.style},r.a.createElement("div",{className:"expander"},n),r.a.createElement("div",{className:T("hidee")},r.a.createElement(V,{hackKey:a,value:t,options:c,onValueChange:l}),s))}function ze(e){var t=e.title,a=e.hackKey,n=r.a.createElement("div",{style:{width:"100%"}},t);return r.a.createElement(Ce,Object.assign({key:a},e,{heading:n}))}function Ie(e,t){var a,n=Object(_.a)(t);try{var r=function(){var t=a.value,n=e.find((function(e){return e.name.toLowerCase().endsWith(t.toLowerCase())}));if(n)return{v:n}};for(n.s();!(a=n.n()).done;){var o=r();if("object"===typeof o)return o.v}}catch(s){n.e(s)}finally{n.f()}return""}function Le(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];return e.find((function(e){return e.name.toLowerCase()===t.toLowerCase}))||Ie(e,n)}var Re=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).divRef=r.a.createRef(),n}return Object(h.a)(a,[{key:"shouldComponentUpdate",value:function(e,t){return e.data!==this.oldData}},{key:"makeBlobURL",value:function(){this.oldData=this.props.data;var e=JSON.parse(this.props.data).files,t=Le(e,"index.html","html"),a=Le(e,"index.js","js","js","javascript"),n=Le(e,"index.css","css"),r=window.location.origin,o="\n    <".concat("script",' type="module" src="',r,'/console-wrapper.js"></',"script",">\n    <style>\n    ").concat(n.content,"\n    </style>\n    <body>\n    ").concat(t.content,"\n    </body>\n    <","script",' type="module">\n    ').concat(a.content,"\n    </","script",">\n    "),s=new Blob([o],{type:"text/html"});return URL.createObjectURL(s)}},{key:"render",value:function(){var e=this.makeBlobURL(),t=this.props.blank;return r.a.createElement("div",{className:"runner",ref:this.divRef},r.a.createElement("iframe",{title:"runner",sandbox:"allow-scripts",src:e,style:Object(E.a)({},t&&{background:"none"})}))}}]),a}(r.a.Component),Ae=(a(104),/^[a-z0-9]+$/i);var Ue=function(){return[]},De=window.matchMedia("(prefers-color-scheme: dark)"),Me=function(){var e=window.location,t=Object.fromEntries(new URLSearchParams(e.search).entries()).src;return t?"".concat(e.origin).concat(e.pathname,"?src=").concat(encodeURIComponent(t)):""},Te=function(e){Object(m.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).addMsg=function(t,a){e.setState({messages:[{msg:t,className:a}].concat(Object(u.a)(e.state.messages))}),setTimeout((function(){e.setState({messages:e.state.messages.slice(0,e.state.messages.length-1)})}),5e3)},e.addInfo=function(t){return e.addMsg(t,"info")},e.addError=function(t){return e.addMsg(t,"error")},e.closeDialog=function(){e.setState({dialog:Ue})},e.handleNew=Object(l.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:window.location.href=window.location.origin;case 1:case"end":return e.stop()}}),e)}))),e.handleRun=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:localStorage.setItem("backup",JSON.stringify({href:window.location.href,data:ae})),e.setState({runningData:JSON.stringify(ae),blank:!1});case 2:case"end":return t.stop()}}),t)}))),e.handleStop=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({runningData:JSON.stringify(te()),blank:!0});case 1:case"end":return t.stop()}}),t)}))),e.handleSave=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({dialog:e.renderSave});case 1:case"end":return t.stop()}}),t)}))),e.handleSettings=function(){e.setState({dialog:e.renderSettings})},e.handleHelp=function(){e.setState({dialog:e.renderHelp})},e.handleLoad=function(){e.setState({dialog:e.renderLoad})},e.handleOnLoad=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({dialog:Ue}),e.handleRun();case 2:case"end":return t.stop()}}),t)}))),e.handleOnSave=function(t){window.history.pushState({},"","".concat(window.location.origin,"?src=").concat(t)),e.setState({dialog:Ue,gistId:t})},e.handleAbort=function(){e.abort()},e.renderHelp=function(){return r.a.createElement(A,{onClose:e.closeDialog})},e.renderSettings=function(){return r.a.createElement(xe,{onClose:e.closeDialog})},e.renderLoad=function(){return r.a.createElement(ce,{onLoad:e.handleOnLoad,onClose:e.closeDialog,addError:e.addError,github:e.github})},e.renderSave=function(){var t=ae;return r.a.createElement(be,{onSave:e.handleOnSave,onClose:e.closeDialog,addError:e.addError,github:e.github,gistId:e.state.gistId,data:t})},e.state={path:window.location.pathname,disqusId:Me(),dark:De.matches,loading:!1,dialog:Ue,dataVersion:0,gistId:"",pat:localStorage.getItem("pat"),runningData:JSON.stringify(te()),blank:!0,messages:[],userData:{}},e.github=new L,e}return Object(h.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.github.addEventListener("userdata",(function(t){e.setState({userData:t.data})})),X("path",window.location.pathname),Z("path",(function(t){window.history.pushState({},"",t),e.setState({path:t,disqusId:Me()})})),Z("dataVersion",(function(t){e.setState({dataVersion:t})})),Z("updateVersion",(function(t){e.setState({updateVersion:t})})),De.addEventListener("change",(function(){e.setState({dark:De.matches})}));var t=Object.fromEntries(new URLSearchParams(window.location.search).entries()),a=localStorage.getItem("backup"),n=!1;if(a){try{var r=JSON.parse(a);r.href===window.location.href&&(re(r.data),n=!0,this.addInfo("loaded backup from local storage"))}catch(o){console.log("bad backup")}localStorage.removeItem("backup")}!n&&t.src&&this.loadData(t.src)}},{key:"loadData",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.setState({loading:!0}),a=!0,e.prev=2,r=t,!Ae.test(r)){e.next=11;break}return e.next=6,this.github.getAnonGist(t);case 6:re(e.sent),this.setState({gistId:t}),e.next=23;break;case 11:if(!ge(t)){e.next=16;break}re(ve(t)),e.next=23;break;case 16:return e.next=18,fetch(t);case 18:return n=e.sent,e.next=21,n.json();case 21:re(e.sent);case 23:e.next=30;break;case 25:e.prev=25,e.t0=e.catch(2),a=!1,console.warn(e.t0),this.addError("could not load jsGist: src=".concat(t," ").concat(e.t0));case 30:this.setState({loading:!1}),a&&this.handleRun();case 32:case"end":return e.stop()}var r}),e,this,[[2,25]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=ae,t=this.state,a=t.loading,n=t.blank,o=t.dialog,s=t.disqusId,i=t.runningData,c=t.updateVersion,l=t.userData,u=[];return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"head"},r.a.createElement("div",null,r.a.createElement("img",{src:"/resources/images/logo.svg",alt:"logo"}),"jsGist.org",r.a.createElement("span",{className:"beta"},"(alpha)")),r.a.createElement("div",null,r.a.createElement("a",{href:"https://github.com/greggman/jsgist/"},r.a.createElement("img",{alt:"github",src:"/resources/images/octocat-icon.svg"})))),r.a.createElement("div",{className:"top"},r.a.createElement("div",{className:"left"},r.a.createElement("div",{className:"name"},r.a.createElement(g,{value:e.name,onChange:function(e){return t=e,ae.name=t,void ne();var t}}),r.a.createElement("div",{className:"username"},l.name),l.avatarURL?r.a.createElement("img",{className:"avatar",src:l.avatarURL,alt:"avatar"}):[])),r.a.createElement("div",{className:"right"},r.a.createElement("button",{tabIndex:"1",onClick:this.handleRun},"Run"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleStop},"Stop"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleSave},"Save"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleNew},"New"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleLoad},"Load"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleHelp,title:"help"},"?"))),a?[]:r.a.createElement("div",{className:"bottom"},r.a.createElement(O,{direction:"horizontal",minSize:0},r.a.createElement("div",{className:"left"},r.a.createElement("div",{className:"codes"},r.a.createElement(O,{direction:"vertical",minSize:0},e.files.map((function(e,t){return r.a.createElement(ze,{key:"ca".concat(t),hackKey:c,desc:"filename",title:e.name,value:e.content,onTitleChange:function(e){return function(e,t){ae.files[e].name=t,ne()}(t,e)},onValueChange:function(e){return function(e,t){ae.files[e].content=t,ne()}(t,e)},extra:u})}))))),r.a.createElement("div",{className:"right"},r.a.createElement(Re,{data:i,blank:n}))))),r.a.createElement(b,{disqusId:s,disqusShortName:"jsgist",title:e.name}),o(),r.a.createElement("div",{className:"messages"},this.state.messages.map((function(e,t){var a=e.msg,n=e.className;return r.a.createElement("div",{className:n,key:"err".concat(t)},a)}))))}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Te,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},45:function(e){e.exports=JSON.parse('{"$schema":"http://json-schema.org/schema#","type":"object","properties":{"name":{"type":"string"},"settings":{"type":"object"},"files":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"content":{"type":"string"}},"required":["content","name"]}}},"required":["name","settings","files"]}')},46:function(e,t,a){e.exports=a.p+"static/media/vertical-layout.f248a432.svg"},47:function(e,t,a){e.exports=a.p+"static/media/horizontal-layout.e3f3298b.svg"},48:function(e,t,a){e.exports=a.p+"static/media/two-by-two-layout.23605ce8.svg"},50:function(e,t,a){e.exports=a(105)},55:function(e,t,a){}},[[50,1,2]]]);
//# sourceMappingURL=main.8747bc1c.chunk.js.map