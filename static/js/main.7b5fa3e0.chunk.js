(this.webpackJsonpjsGist=this.webpackJsonpjsGist||[]).push([[0],{108:function(e,t,a){},109:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(42),i=a.n(o),s=(a(58),a(1)),c=a.n(s),l=a(3),u=a(13),d=a(2),m=a(8),h=a(4),p=a(5);function v(e){return r.a.createElement("input",{type:"text",onChange:function(t){e.onChange(t.target.value)},placeholder:e.placeholder,value:e.value})}var g=a(7);function f(e,t){for(var a=new URL(e),n=new URLSearchParams(a.search),r=0,o=Object.entries(t);r<o.length;r++){var i=Object(g.a)(o[r],2),s=i[0],c=i[1];void 0===c?n.delete(s):n.set(s,c)}return a.search=n.toString(),a.href}function b(e){var t=f(window.location.href,e);window.history.replaceState({},"",t.href)}var E=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handleMessage=function(t){var a=t.data,n=a.type,r=a.data;switch(n){case"resize":e.iframeRef.current.style.height="".concat(r.height,"px")}},e.iframeRef=r.a.createRef(),e}return Object(m.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("message",this.handleMessage)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("message",this.handleMessage)}},{key:"shouldComponentUpdate",value:function(e){return e.disqusId!==this.disqusId}},{key:"render",value:function(){var e=this.props,t=e.disqusId,a=f("https://jsgist.devcomments.org/comments.html",{disqusId:t,title:e.title});return r.a.createElement("div",null,t?r.a.createElement("iframe",{ref:this.iframeRef,title:"comments",src:a}):[])}}]),a}(r.a.Component);function w(e){return r.a.createElement("div",{className:"comments"},r.a.createElement("hr",null),e.disqusId?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"comment-notes"},"Use ",r.a.createElement("b",null,"<pre><code>"),"code goes here",r.a.createElement("b",null,"</code></pre>")," for code blocks"),r.a.createElement(E,{disqusId:e.disqusId,title:e.title})):[])}var y=a(12),k=a(6),j=a(28),S="/*bug-in-github-api-content-can-not-be-empty*/";function O(e){var t=JSON.parse(e.files["jsGist.json"].content);return t.files=Object.entries(e.files).filter((function(e){return"jsGist.json"!==Object(g.a)(e,1)[0]})).map((function(e){var t=Object(g.a)(e,2),a=t[0],n=t[1];return{name:a,content:n.content.startsWith(S)?n.content.substr(S.length):n.content}})).concat(t.files||[]),t}function x(e){return C.apply(this,arguments)}function C(){return(C=Object(l.a)(c.a.mark((function e(t){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.github.com/gists/".concat(t));case 2:return a=e.sent,e.next=5,a.json();case 5:return n=e.sent,e.abrupt("return",{data:O(n),rawData:n});case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function N(e,t){var a=e.files.reduce((function(e,t){return e[t.name]={content:t.content.trim()?t.content:"".concat(S).concat(t.content)},e}),{}),n=Object(k.a)({},e),r={};return a["jsGist.json"]=r,Object.keys(a).length===e.files.length+1?delete n.files:a={"jsGist.json":r},r.content=JSON.stringify(n),Object(k.a)({files:a,description:e.name,public:!e.settings.private},t&&{gist_id:t})}var z=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).pat="",e.user={},e.unAuthorizedOctokit=new j.a({userAgent:"jsGist v0.0.1"}),e}return Object(m.a)(a,[{key:"_updateUserData",value:function(e){var t=function(e){return e&&e.owner?{name:e.owner.login,avatarURL:e.owner.avatar_url}:void 0}(e);if(t){Object.assign(this.user,t);var a=new Event("userdata");a.data=Object(k.a)({},this.user),this.dispatchEvent(a)}}},{key:"setPat",value:function(e){e!==this.pat&&(this.pat=e,this.authorizedOctokit=new j.a({auth:e,userAgent:"jsGist v0.0.1"}))}},{key:"getUserGists",value:function(){var e=Object(l.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.authorizedOctokit.paginate(this.authorizedOctokit.gists.list);case 2:return t=e.sent,e.abrupt("return",t.filter((function(e){return!!e.files["jsGist.json"]})));case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getAnonGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a,n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x(t);case 2:return a=e.sent,n=a.data,r=a.rawData,this._updateUserData(r),e.abrupt("return",{data:n,rawData:r});case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getUserGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.octokit.gists.get({gist_id:t});case 2:return a=e.sent,this._updateUserData(a.data),e.abrupt("return",O(a.data));case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"createGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=N(t),e.next=3,this.authorizedOctokit.gists.create(a);case 3:return n=e.sent,this._updateUserData(n.data),e.abrupt("return",{id:n.data.id,name:n.data.description,date:n.data.updated_at});case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateGist",value:function(){var e=Object(l.a)(c.a.mark((function e(t,a){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=N(a,t),e.next=3,this.authorizedOctokit.gists.update(n);case 3:return r=e.sent,e.abrupt("return",{id:r.data.id,name:r.data.description,date:r.data.updated_at});case 5:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"octokit",get:function(){return this.authorizedOctokit||this.unAuthorizedOctokit}}]),a}(Object(y.a)(EventTarget)),I=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;Object(d.a)(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).handleKeyDown=function(t){27===t.keyCode&&e.props.onClose()},e}return Object(m.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("keydown",this.handleKeyDown)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this.handleKeyDown)}},{key:"render",value:function(){var e=this.props,t=e.title,a=e.children,n=e.onClose;return r.a.createElement("div",{onClick:n,className:"dialog"},r.a.createElement("div",{tabIndex:"-1",onClick:function(e){e.stopPropagation()}},r.a.createElement("div",{className:"dialog-heading"},r.a.createElement("div",{className:"dialog-title"},t),r.a.createElement("div",{className:"dialog-close"},r.a.createElement("button",{onClick:n},"X"))),r.a.createElement("div",{className:"dialog-content"},a)))}}]),a}(r.a.Component);function L(e){var t=e.onClose;return r.a.createElement(I,{title:"jsGist",onClose:t},r.a.createElement("div",{className:"markdown"},r.a.createElement("p",null,"Add your test cases, click ",r.a.createElement("code",null,"Run"),"."),r.a.createElement("h2",null,"Contribute, Fix, Enhance!"),r.a.createElement("p",null,r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/greggman/jsgist"},"https://github.com/greggman/jsgist")),r.a.createElement("p",null,"Also see ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://jsbenchit.org"},"jsbenchit.org")),r.a.createElement("h2",null,"Saving"),r.a.createElement("p",null,"You can save your tests in multiple ways."),r.a.createElement("ol",null,r.a.createElement("li",null,"To a github gist using a ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"},"Personal Access Token"),r.a.createElement("p",null,"Be sure to give the token ",r.a.createElement("b",null,"ONLY GIST")," permissions. Paste it into the save as UI click ",r.a.createElement("code",null,"Save to new gist"),". Be sure to keep a copy of it somewhere so you can use if you clear your browser's storage or switch machines or browser. This site is a static site. The token is saved in the browser only.")),r.a.createElement("li",null,"Save it manually into github",r.a.createElement("p",null,"Copy the JSON. Go to github. Create a new gist. Name the file",r.a.createElement("code",null,"jsGist.json"),' Paste the JSON in. Pick "Create public gist".'),r.a.createElement("p",null,"Note the id in the URL after you create the gist."),r.a.createElement("p",null,"Create a url in the form ",r.a.createElement("code",null,"https://jsgist.org/?src=<gist_id>--"),"."),r.a.createElement("p",null,"Example: ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://jsgist.org/?src=bad0a8491bd6614e729ff01cc14089c9"},"https://jsbenchit.org/?src=bad0a8491bd6614e729ff01cc14089c9"))),r.a.createElement("li",null,"Save it manually somewhere else.",r.a.createElement("p",null,"If there's some other service that will provide a string via http get then copy and save the JSON there then create a URL in the form of ",r.a.createElement("code",null,"https://jsgist.org/?src=<url>"),". Note: you will have to escape the URL although if just paste it into your browser it will likely do the conversion for you.")),r.a.createElement("li",null,"Save it as a bookmark or link",r.a.createElement("p",null,"In the SaveAs dialog there's a link that contains all the data for your benchmark.")))))}var G=/([a-z])([A-Z])/g,P=function(e,t,a){return"".concat(t,"-").concat(a)},A=function(e){return e.replace(G,P).toLowerCase()};function R(){for(var e=[],t=arguments.length,a=new Array(t),n=0;n<t;n++)a[n]=arguments[n];for(var r=0,o=a;r<o.length;r++){var i=o[r];if("string"===typeof i)e.push(i);else for(var s=0,c=Object.entries(i);s<c.length;s++){var l=Object(g.a)(c[s],2),u=l[0],d=l[1];d&&e.push(A(u))}}return e.join(" ")}var U=a(22),D=a.n(U),M=a(18),T=a(46),_=(new D.a).compile(T),J={};function V(e){var t=J[e]||{subscriptions:new Set};return J[e]=t,t}function q(e,t){var a=V(e);return void 0!==t&&(a.value=t),a}function K(e){return J[e].value}function W(e,t){var a=J[e];if(!a)throw new Error("no such track value: ".concat(e));a.value=t;var n,r=Object(u.a)(a.subscriptions.keys()),o=Object(M.a)(r);try{for(o.s();!(n=o.n()).done;){(0,n.value)(t,e)}}catch(i){o.e(i)}finally{o.f()}}function F(e,t){V(e).subscriptions.add(t)}var Y={name:"My jsGist",settings:{},files:[{name:"index.html",content:""},{name:"index.css",content:""},{name:"index.js",content:""}]};function X(){var e="".concat(window.location.origin,"/resources/images/logo.svg");return JSON.parse(JSON.stringify({name:"jsGist",settings:{},files:[{name:"index.html",content:""},{name:"index.css",content:"\n          html, body {\n            margin: 0;\n            width: 100%;\n            height: 100%;\n            background-image: url(".concat(e,");\n            background-size: contain contain;\n            background-position: center center;\n            background-repeat: no-repeat no-repeat;\n          }\n          @media (prefers-color-scheme: dark) {\n            html {\n              background: #222;\n            }\n          }\n        ")},{name:"index.js",content:""}]}))}var B=JSON.parse(JSON.stringify(Y));function H(){W("dataVersion",K("dataVersion")+1)}function $(e){!function(e){if(!_(e))throw new Error("data not valid:\n".concat(_.errors.map((function(e){return"".concat(e.message,": ").concat(e.dataPath)}))))}(e),B=e,H(),W("updateVersion",K("updateVersion")+1)}_(B)||console.log(_.errors),q("dataVersion",0),q("updateVersion",0);var Z={type:"object",properties:{name:{type:"string"},date:{type:"string"}},required:["name","date"]},Q={$schema:"http://json-schema.org/schema#",type:"object",additionalProperties:Z},ee=new D.a,te=ee.compile(Q),ae=ee.compile(Z);function ne(){try{var e=JSON.parse(localStorage.getItem("jsGist-gists"));if(!te(e))throw localStorage.removeIem("jsGist-gists"),new Error;return e}catch(t){return{}}}function re(e,t,a){var n={name:t,date:a};if(!ae(n))throw new Error("gist not valid:\n".concat(ae.errors.map((function(e){return"".concat(e.message,": ").concat(e.dataPath)}))));var r=Object(k.a)({},K("gists"));r[e]=n,W("gists",r),oe(r)}function oe(e){localStorage.setItem("jsGist-gists",JSON.stringify(e))}function ie(e){if(!te(e))throw new Error("gists not valid:\n".concat(ae.errors.map((function(e){return"".concat(e.message,": ").concat(e.dataPath)}))));W("gists",e),oe(e)}function se(e){!function(e,t){V(e).subscriptions.delete(t)}("gists",e)}q("gists",ne()),window.addEventListener("storage",(function(e){"gists"===e.key&&W("gists",ne())}));var ce=function(){},le=function(e){return new Promise((function(t){return setTimeout(t,e)}))};var ue=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handlePATChange=function(t){var a=t.target.value;e.setState({pat:a}),localStorage.setItem("pat",a)},e.handleSubmit=function(t){t.preventDefault(),e.loadGists()},e.handleNewGists=function(t){e.setState({gists:t})},e.loadGists=function(){var t=Object(l.a)(c.a.mark((function t(a){var n,r,o,i,s;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({loading:!0}),n=e.props,r=n.addError,o=n.github,i=e.state.pat,o.setPat(i),t.prev=4,t.next=7,o.getUserGists();case 7:return s=t.sent,ie(s.reduce((function(e,t){return e[t.id]={name:t.description,date:t.updated_at},e}),{})),b({loggedIn:!0}),t.next=13,le();case 13:b({loggedIn:void 0}),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(4),r("could not load gists: ".concat(t.t0));case 19:e.setState({loading:!1});case 20:case"end":return t.stop()}}),t,null,[[4,16]])})));return function(e){return t.apply(this,arguments)}}(),e.state={loading:!1,pat:localStorage.getItem("pat")||"",gists:K("gists")},e}return Object(m.a)(a,[{key:"componentDidMount",value:function(){document.body.addEventListener("submit",this.handleSubmit),F("gists",this.handleNewGists)}},{key:"componentWillUnmount",value:function(){document.body.removeEventListener("submit",this.handleSubmit),se(this.handleNewGists)}},{key:"render",value:function(){var e=this.state,t=e.pat,a=e.gists,n=e.loading,o=!!t&&!n,i=Object.entries(a).map((function(e){var t=Object(g.a)(e,2),a=t[0],n=t[1];return{id:a,name:n.name,date:n.date}})).sort((function(e,t){return t.date<e.date?-1:t.date>e.date?1:0}));return r.a.createElement("div",null,r.a.createElement("form",null,r.a.createElement("div",{className:"save-as-gist-pat"},r.a.createElement("div",null,"Personal Access Token:\xa0"),r.a.createElement("div",null,r.a.createElement("input",{type:"text",name:"username",value:"unused",style:{display:"none"},onChange:ce}),r.a.createElement("input",{type:"password",name:"password",value:t,placeholder:"personal access token",onChange:this.handlePATChange}))),r.a.createElement("p",null,r.a.createElement("button",{type:"submit",className:R({disabled:!o})},i.length?"Reload":"Load"," Your Gists"))),r.a.createElement("p",null,r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/settings/tokens"},"Create a Personal Access Token")," with only ",r.a.createElement("b",null,"gist")," permissions. Paste it above. Note: This is a static website. Your person access token is stored only locally in your browser and only accessible by this domain."),i.length?r.a.createElement("table",{className:"gists"},r.a.createElement("tbody",null,i.map((function(e,t){return r.a.createElement("tr",{key:"g".concat(t)},r.a.createElement("td",null,r.a.createElement("a",{href:"".concat(window.location.origin,"?src=").concat(encodeURIComponent(e.id))},e.name)),r.a.createElement("td",null,e.date.substring(0,10)))})))):[])}}]),a}(r.a.Component),de=a(47),me=(a(98),a(99),a(100),a(40),a(41),a(101),a(103),a(104),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):{}),he=function(){},pe=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(e){var n;Object(d.a)(this,a),n=t.call(this,e);var r=e.value,o=e.hackKey;return n.state={value:r,hackKey:o},n}return Object(m.a)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.options,n=void 0===a?{}:a,o=t.onValueChange,i=void 0===o?he:o,s=this.state.value,c=me.matches;return r.a.createElement(de.Controlled,{value:s,options:Object(k.a)({mode:"javascript",scrollbarStyle:"overlay",theme:c?"material":"eclipse"},n.editor&&n.editor),onBeforeChange:function(t,a,n){e.setState({value:n})},onChange:function(e,t,a){i(a)}})}}],[{key:"getDerivedStateFromProps",value:function(e,t){return t.hackKey!==e.hackKey?{hackKey:e.hackKey,value:e.value}:null}}]),a}(r.a.Component);function ve(e){var t=Object(n.useState)(""),a=Object(g.a)(t,2),o=a[0],i=a[1];return r.a.createElement("div",null,r.a.createElement("div",{style:{height:"100px"}},r.a.createElement(pe,{value:o,onValueChange:i})),r.a.createElement("p",null,r.a.createElement("button",{onClick:function(){var t=e.onLoad,a=e.addError;try{$(JSON.parse(o)),t()}catch(n){a("bad json: ".concat(n))}}},"Load JSON")))}function ge(e){var t=Object(n.useState)(""),a=Object(g.a)(t,2),o=a[0],i=a[1];function s(){return(s=Object(l.a)(c.a.mark((function t(){var a,n,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.addError,n=e.onLoad,t.prev=1,t.next=4,fetch(o);case 4:return r=t.sent,t.next=7,r.json();case 7:$(t.sent),n(),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(1),a("could not load url: ".concat(t.t0));case 15:case"end":return t.stop()}}),t,null,[[1,12]])})))).apply(this,arguments)}return r.a.createElement("div",null,r.a.createElement(v,{value:o,onChange:i,placeholder:"url-to-json"}),r.a.createElement("p",null,r.a.createElement("button",{onClick:function(){return s.apply(this,arguments)}},"Load URL")))}function fe(e){var t=e.heading,a=e.children;return r.a.createElement("div",{className:"section"},r.a.createElement("div",{className:"section-heading"},t),r.a.createElement("div",{className:"section-content"},a))}function be(e){var t=e.data,a=e.github,n=e.onLoad,o=e.onClose,i=e.addError;return r.a.createElement(I,{title:"Load",onClose:o},r.a.createElement(fe,{heading:"Load Gist"},r.a.createElement(ue,{github:a,data:t,onLoad:n,addError:i})),r.a.createElement(fe,{heading:"Load URL"},r.a.createElement(ge,{data:t,onLoad:n,addError:i})),r.a.createElement(fe,{heading:"Load JSON"},r.a.createElement(ve,{data:t,onLoad:n,addError:i})))}var Ee=a(27),we=a(29),ye=new TextEncoder,ke=new TextDecoder,je=function(e){return e.startsWith("cb64,")||e.startsWith("b64,")};function Se(e){var t=e.startsWith("cb64,"),a=t?"cb64,":"b64,",n=e.substr(a.length).replace(/-/g,"+").replace(/_/g,"/"),r=new Uint8Array(Object(Ee.decode)(n)),o=t?Object(we.b)(r):r,i=ke.decode(o);return JSON.parse(i)}var Oe=/^[a-z0-9]+$/i,xe=function(e){return Oe.test(e)};function Ce(e,t){return Ne.apply(this,arguments)}function Ne(){return(Ne=Object(l.a)(c.a.mark((function e(t,a){var n,r,o,i,s;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!xe(t)){e.next=9;break}return e.next=3,a.getAnonGist(t);case 3:return n=e.sent,r=n.data,o=n.rawData,e.abrupt("return",{data:r,id:t,rawData:o});case 9:if(!je(t)){e.next=13;break}return e.abrupt("return",{data:Se(t)});case 13:return e.next=15,fetch(t);case 15:return i=e.sent,e.next=18,i.json();case 18:return s=e.sent,e.abrupt("return",{data:s});case 20:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ze=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).handlePATChange=function(t){var a=t.target.value;e.setState({pat:a}),localStorage.setItem("pat",a)},e.handleSubmit=function(t){t.preventDefault(),e.saveFn()},e.markToSaveNewGist=function(){e.saveFn=e.saveNew},e.markToUpdateGist=function(){e.saveFn=e.saveOverExisting},e.saveNew=Object(l.a)(c.a.mark((function t(){var a,n,r,o,i,s,l,u,d,m,h,p;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({saving:!0}),a=e.props,n=a.data,r=a.github,o=a.addError,i=a.onSave,s=a.onClose,l=e.state.pat,u=!1,r.setPat(l),t.prev=5,t.next=8,r.createGist(n);case 8:d=t.sent,m=d.id,h=d.name,p=d.date,re(m,h,p),i(m),u=!0,t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),o("could not create gist: ".concat(t.t0));case 20:if(e.setState({saving:!1}),!u){t.next=27;break}return b({loggedIn:!0}),t.next=25,le();case 25:b({loggedIn:void 0}),s();case 27:case"end":return t.stop()}}),t,null,[[5,17]])}))),e.saveOverExisting=Object(l.a)(c.a.mark((function t(){var a,n,r,o,i,s,l,u,d,m,h,p;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({saving:!0}),a=e.props,n=a.data,r=a.gistId,o=a.github,i=a.addError,s=a.onClose,l=e.state.pat,u=!1,o.setPat(l),t.prev=5,t.next=8,o.updateGist(r,n);case 8:d=t.sent,m=d.id,h=d.name,p=d.date,re(m,h,p),u=!0,t.next=19;break;case 16:t.prev=16,t.t0=t.catch(5),i("could not update gist: ".concat(t.t0));case 19:e.setState({saving:!1}),u&&s();case 21:case"end":return t.stop()}}),t,null,[[5,16]])}))),e.state={saving:!1,pat:localStorage.getItem("pat")||""},e}return Object(m.a)(a,[{key:"componentDidMount",value:function(){document.body.addEventListener("submit",this.handleSubmit)}},{key:"componentWillUnmount",value:function(){document.body.removeEventListener("submit",this.handleSubmit)}},{key:"render",value:function(){var e=this.state,t=e.pat,a=e.saving,n=this.props.gistId,o=t&&n;return r.a.createElement("div",null,r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("div",{className:"save-as-gist-pat"},r.a.createElement("div",null,"Personal Access Token:\xa0"),r.a.createElement("div",null,r.a.createElement("input",{type:"text",name:"username",value:"unused",style:{display:"none"},onChange:ce}),r.a.createElement("input",{type:"password",name:"password",value:t,placeholder:"personal access token",onChange:this.handlePATChange}))),r.a.createElement("p",null,r.a.createElement("button",{type:"submit",className:R({disabled:!t||a}),"data-type":"new",onClick:this.markToSaveNewGist},"Save to new Gist"),r.a.createElement("button",{className:R({disabled:!o||a}),type:"submit","data-type":"update",onClick:this.markToUpdateGist},"Update Existing Gist")),r.a.createElement("p",null,r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/settings/tokens"},"Create a Personal Access Token")," with only ",r.a.createElement("b",null,"gist")," permissions. Paste it above. Note: This is a static website. Your person access token is stored only locally in your browser and only accessible by this domain.")))}}]),a}(r.a.Component);function Ie(e){var t=e.data;return r.a.createElement("div",null,r.a.createElement("div",null,"Copy the text below, paste into the load ui or put somewhere on the net and make your own URL with ",r.a.createElement("code",null,window.location.origin,"?src=url-to-json"),"."),r.a.createElement("pre",{style:{userSelect:"all"}},JSON.stringify(t)),r.a.createElement("div",null,r.a.createElement("a",{href:"".concat(window.location.origin,"?src=").concat(encodeURIComponent("".concat(window.location.origin,"/example.json")))},"Example")))}function Le(e){var t=function(e){var t=JSON.stringify(e),a=ye.encode(t),n=Object(we.a)(a),r=n.length<a.length,o=Object(Ee.encode)(r?n:a).replace(/\+/g,"-").replace(/\//g,"_");return"".concat(r?"cb64,":"b64,").concat(o)}(e.data),a="".concat(window.location.origin,"?src=").concat(encodeURIComponent(t));return r.a.createElement("div",null,r.a.createElement("div",null,"Copy / bookmark the link below"),r.a.createElement("a",{className:"bookmark",href:a,target:"_blank",rel:"noopener noreferrer"},a))}function Ge(e){var t=e.gistId;return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("p",null,"You can embed a jsGist by creating an iframe pointing to"," ",r.a.createElement("code",null,"jsgist.org/embed.html?src=<src>")," "," where"," ",r.a.createElement("code",null,"<src>")," "," is one of the forms above."),t?r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"For example:"),r.a.createElement("pre",null,r.a.createElement("code",null,'<iframe src="https://jsgist.org/embed.html?src=',t,'" ></iframe>'))):[],r.a.createElement("p",null)))}function Pe(e){var t=e.data,a=e.github,n=e.gistId,o=e.onSave,i=e.onClose,s=e.addError;return r.a.createElement(I,{title:"Save As",onClose:i},r.a.createElement(fe,{heading:"Save As Gist"},r.a.createElement(ze,{gistId:n,github:a,data:t,onClose:i,onSave:o,addError:s})),r.a.createElement(fe,{heading:"Save As URL"},r.a.createElement(Le,{data:t})),r.a.createElement(fe,{heading:"Save As JSON"},r.a.createElement(Ie,{data:t})),r.a.createElement(fe,{heading:"Embedding"},r.a.createElement(Ge,{gistId:n})))}var Ae=a(48),Re=a.n(Ae),Ue=a(49),De=a.n(Ue),Me=a(50),Te=a.n(Me);function _e(e){var t=e.children,a=e.onChange,n=e.selected;return r.a.createElement("div",{className:R({radioSelected:n}),onClick:a},t)}function Je(e){var t=e.selectedNdx,a=e.onChange,n=e.children,o=0,i=r.a.Children.map(n,(function(e){if(!r.a.isValidElement(e))return null;var n=o===t,i=o;return o+=1,r.a.cloneElement(e,{selected:n,onChange:function(){return a(i)}})}));return r.a.createElement("div",{class:"radio"},i)}function Ve(e){var t=e.onClose;return r.a.createElement(I,{title:"Settings",onClose:t},r.a.createElement(Je,{selectedNdx:0,onChange:function(e){console.log(e)}},r.a.createElement(_e,null,r.a.createElement("img",{style:{height:"2em"},src:Re.a,alt:"vertical"})),r.a.createElement(_e,null,r.a.createElement("img",{style:{height:"2em"},src:De.a,alt:"horizontal"})),r.a.createElement(_e,null,r.a.createElement("img",{style:{height:"2em"},src:Te.a,alt:"2x2"}))))}var qe=a(9),Ke=a(52);function We(e,t){var a=e/t|0,n=e%t,r=new Array(t).fill(a);if(0===n)return r;if(n<=t/2|0){var o=t/n|0,i=o/2|0;return r.map((function(e,t){return e+(t%o===i?1:0)}))}var s=t/(t-n)|0,c=s/2|0;return r.map((function(e,t){return e+(1-(t%s===c?1:0))}))}var Fe=function(e){return"horizontal"===e?{dimension:"width",clientAxis:"clientX",position:"left",positionEnd:"right",clientSize:"clientWidth",style:{width:"100%",display:"flex"}}:{dimension:"height",clientAxis:"clientY",position:"top",positionEnd:"bottom",clientSize:"clientHeight",style:{height:"100%"}}};function Ye(e){var t=e.startSizes,a=e.currentSizes,n=e.prevPaneNdx,r=e.gutterSize,o=e.minSize,i=e.deltaPX,s=e.outerSizePX,c=a.length,l=We((c-1)*r,c),d=n+1,m=Math.ceil(t[n]*s)-l[n],h=m+(Math.ceil(t[d]*s)-l[d]),p=Math.min(Math.max(o,m+i),h-o),v=h-p;return[].concat(Object(u.a)(a.slice(0,n)),[(p+l[n])/s,(v+l[d])/s],Object(u.a)(a.slice(n+2,a.length)))}var Xe=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(e){var n;Object(d.a)(this,a),(n=t.call(this,e))._setSizes=function(e){n.setState({sizes:e})},n.handleMouseUp=function(){document.removeEventListener("mousemove",n.handleMouseMove),document.removeEventListener("mouseup",n.handleMouseUp),n.setState({dragging:!1})},n.handleMouseMove=function(e){var t=n.props,a=t.gutterSize,r=void 0===a?10:a,o=t.direction,i=void 0===o?"horizontal":o,s=t.minSize,c=void 0===s?10:s,l=t.computeNewSizesFn,u=void 0===l?Ye:l,d=t.onSetSizes,m=t.sizes,h=n.state,p=h.prevPaneNdx,v=h.mouseStart,g=h.startSizes,f=h.sizes,b=d||n._setSizes,E=d?m:f,w=Fe(i),y=w.clientAxis,k=w.clientSize;b(u({startSizes:g,currentSizes:E,prevPaneNdx:p,gutterSize:r,minSize:c,deltaPX:e[y]-v,outerSizePX:n.elementRef.current[k]}))},n.handleMouseDown=function(e){var t=n.props.direction,a=Fe(void 0===t?"horizontal":t).clientAxis;document.addEventListener("mousemove",n.handleMouseMove),document.addEventListener("mouseup",n.handleMouseUp);var r=(Array.prototype.indexOf.call(e.target.parentElement.children,e.target)-1)/2;n.setState({startSizes:n.state.sizes.slice(),mouseStart:e[a],prevPaneNdx:r,dragging:!0})},n.recomputeSizes=function(){var e=n.state.sizes,t=n.props,a=(t.minSize,t.direction),o=(t.gutterSize,Fe(a).clientSize),i=r.a.Children.count(n.props.children),s=i<e.length?function(e){var t=e.reduce((function(e,t){return e+t}),0);return e.map((function(e){return e/t}))}(e.slice(0,i)):function(e,t,a,n,r){return new Array(t).fill(1/t)}(0,i,0,0,n.elementRef.current.parentElement[o]);n._setSizes(s)};var o=r.a.Children.count(e.children),i=1/o;return n.state={sizes:new Array(o).fill(i)},n.elementRef=r.a.createRef(),n}return Object(m.a)(a,[{key:"componentDidUpdate",value:function(){var e=this.props,t=e.children,a=e.onSetSizes,n=this.state.sizes;if(!a){var o=r.a.Children.count(t);n.length!==o&&setTimeout(this.recomputeSizes)}}},{key:"render",value:function(){var e=this,t=this.props,a=t.children,n=t.direction,o=void 0===n?"horizontal":n,i=t.gutterSize,s=void 0===i?10:i,c=t.sizes,l=t.onSetSizes,u=(t.minSize,Object(Ke.a)(t,["children","direction","gutterSize","sizes","onSetSizes","minSize"])),d=this.state,m=d.dragging,h=d.prevPaneNdx,p=d.sizes,v=Fe(o),g=v.dimension,f=v.style,b=l?c:p,E=r.a.Children.count(a),w=s*(E-1),y=Object(qe.a)({},g,"".concat(s,"px")),j=We(w,E),S=0,O=!0,x=[];return r.a.Children.forEach(a,(function(t,a){if(!r.a.isValidElement(t))return null;O||x.push(r.a.createElement("div",{key:"gutter".concat(x.length),className:"gutter gutter-".concat(o," ").concat(m&&S===h+1?"gutter-dragging":""),style:y,onMouseDown:e.handleMouseDown}));var n=Object(k.a)(Object(k.a)({},t.props.style),{},Object(qe.a)({},g,"calc(".concat(100*b[S],"% - ").concat(j[S],"px)")));x.push(r.a.cloneElement(t,Object(k.a)({key:"pane".concat(x.length),style:n},t.props))),O=!1,++S})),r.a.createElement("div",Object.assign({className:"split",ref:this.elementRef,style:Object(k.a)(Object(k.a)(Object(k.a)({},this.props.style),f),m&&{userSelect:"none"})},u),x)}}]),a}(r.a.Component),Be=a(51),He=a.n(Be);function $e(e){var t=e.value,a=e.hackKey,n=e.heading,o=e.extra,i=void 0===o?[]:o,s=e.options,c=void 0===s?{}:s,l=e.onValueChange;return r.a.createElement("div",{className:"code-area",style:e.style},r.a.createElement("div",{className:"expander"},n),r.a.createElement("div",{className:R("hidee")},r.a.createElement(pe,{hackKey:a,value:t,options:c,onValueChange:l}),i))}function Ze(e){var t,a=e.title,n=e.hackKey,o=r.a.createElement("div",{style:{width:"100%"}},a),i=He.a.lookup(a)||("javascript"===a.toLowerCase()?"application/javascript":"application/octet-stream"),s=Object(k.a)(Object(k.a)({},e.options),{},{editor:Object(k.a)(Object(k.a)({},(null===(t=e.options)||void 0===t?void 0:t.editor)&&e.options.editor),{},{mode:i})});return r.a.createElement($e,Object.assign({key:n},e,{options:s,heading:o}))}var Qe=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).handleMessage=function(e){var t=e.data,a=t.type,r=t.data,o=n.handlers[a];o&&o(r)},n.runnerRef=r.a.createRef(),n.handlers={log:function(){},gimmeDaCodez:function(){n.iframe.contentWindow.postMessage({type:"run",data:n.data},"*")}},n}return Object(m.a)(a,[{key:"componentDidMount",value:function(){var e=this;(0,this.props.registerRunnerAPI)({run:function(t,a){e.data=t,e.removeIFrame();var n=document.createElement("iframe");e.iframe=n,n.src="https://jsgistrunner.devcomments.org/runner.html",a&&(n.style.background="none"),e.runnerRef.current.appendChild(n)}}),window.addEventListener("message",this.handleMessage)}},{key:"removeIFrame",value:function(){this.iframe&&(this.iframe.remove(),this.iframe=void 0)}},{key:"componentWillUnmount",value:function(){this.removeIFrame(),window.removeEventListener("message",this.handleMessage)}},{key:"render",value:function(){return r.a.createElement("div",{className:"runner",ref:this.runnerRef})}}]),a}(r.a.Component);a(108);var et=function(){return[]},tt=window.matchMedia("(prefers-color-scheme: dark)"),at=function(){var e=window.location,t=Object.fromEntries(new URLSearchParams(e.search).entries()).src;return t?"".concat(encodeURIComponent(t)):""},nt=function(e){Object(h.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(d.a)(this,a),(e=t.call(this)).addMsg=function(t,a){switch(a){case"error":console.error(t);break;default:console.log(t)}e.setState({messages:[{msg:t,className:a}].concat(Object(u.a)(e.state.messages))}),setTimeout((function(){e.setState({messages:e.state.messages.slice(0,e.state.messages.length-1)})}),5e3)},e.addInfo=function(t){return e.addMsg(t,"info")},e.addError=function(t){return e.addMsg(t,"error")},e.closeDialog=function(){e.setState({dialog:et})},e.registerRunnerAPI=function(t){e.runnerAPI=t,e.handleStop()},e.handleNew=Object(l.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:window.location.href=window.location.origin;case 1:case"end":return e.stop()}}),e)}))),e.handleRun=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:localStorage.setItem("jsGist-backup",JSON.stringify({href:window.location.href,data:B})),e.runnerAPI.run(B);case 2:case"end":return t.stop()}}),t)}))),e.handleStop=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.runnerAPI.run(X(),!0);case 1:case"end":return t.stop()}}),t)}))),e.handleSave=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({dialog:e.renderSave});case 1:case"end":return t.stop()}}),t)}))),e.handleSettings=function(){e.setState({dialog:e.renderSettings})},e.handleHelp=function(){e.setState({dialog:e.renderHelp})},e.handleLoad=function(){e.setState({dialog:e.renderLoad})},e.handleOnLoad=Object(l.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({dialog:et}),e.handleRun();case 2:case"end":return t.stop()}}),t)}))),e.handleOnSave=function(t){window.history.pushState({},"","".concat(window.location.origin,"?src=").concat(t)),e.setState({gistId:t})},e.handleAbort=function(){e.abort()},e.renderHelp=function(){return r.a.createElement(L,{onClose:e.closeDialog})},e.renderSettings=function(){return r.a.createElement(Ve,{onClose:e.closeDialog})},e.renderLoad=function(){return r.a.createElement(be,{onLoad:e.handleOnLoad,onClose:e.closeDialog,addError:e.addError,github:e.github})},e.renderSave=function(){var t=B;return r.a.createElement(Pe,{onSave:e.handleOnSave,onClose:e.closeDialog,addError:e.addError,github:e.github,gistId:e.state.gistId,data:t})},e.state={path:window.location.pathname,disqusId:at(),dark:tt.matches,loading:!1,dialog:et,dataVersion:0,gistId:"",pat:localStorage.getItem("pat"),messages:[],userData:{}},e.github=new z,e}return Object(m.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.github.addEventListener("userdata",(function(t){e.setState({userData:t.data})})),q("path",window.location.pathname),F("path",(function(t){window.history.pushState({},"",t),e.setState({path:t,disqusId:at()})})),F("dataVersion",(function(t){e.setState({dataVersion:t})})),F("updateVersion",(function(t){e.setState({updateVersion:t})})),tt.addEventListener("change",(function(){e.setState({dark:tt.matches})}));var t=Object.fromEntries(new URLSearchParams(window.location.search).entries()),a=localStorage.getItem("jsGist-backup"),n=!1;if(a){try{var r=JSON.parse(a);r.href===window.location.href&&($(r.data),n=!0,this.addInfo("loaded backup from local storage"))}catch(o){console.log("bad backup")}localStorage.removeItem("jsGist-backup")}!n&&t.src&&this.loadData(t.src)}},{key:"loadData",value:function(){var e=Object(l.a)(c.a.mark((function e(t){var a,n,r,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0}),a=!0,e.prev=2,e.next=5,Ce(t,this.github);case 5:n=e.sent,r=n.data,o=n.id,$(r),o&&this.setState({gistId:t}),e.next=17;break;case 12:e.prev=12,e.t0=e.catch(2),a=!1,console.warn(e.t0),this.addError("could not load jsGist: src=".concat(t," ").concat(e.t0));case 17:this.setState({loading:!1}),a&&this.handleRun();case 19:case"end":return e.stop()}}),e,this,[[2,12]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=B,t=this.state,a=t.loading,n=t.dialog,o=t.updateVersion,i=t.userData,s=[];return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"head"},r.a.createElement("div",null,r.a.createElement("img",{src:"/resources/images/logo.svg",alt:"logo"}),"jsGist.org",r.a.createElement("span",{className:"beta"},"(alpha)")),r.a.createElement("div",null,r.a.createElement("a",{href:"https://github.com/greggman/jsgist/"},r.a.createElement("img",{alt:"github",src:"/resources/images/octocat-icon.svg"})))),r.a.createElement("div",{className:"top"},r.a.createElement("div",{className:"left"},r.a.createElement("div",{className:"name"},r.a.createElement(v,{value:e.name,onChange:function(e){return t=e,B.name=t,void H();var t}}),r.a.createElement("div",{className:"username"},r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/".concat(i.name)},i.name)),i.avatarURL?r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/".concat(i.name)},r.a.createElement("img",{className:"avatar",src:i.avatarURL,alt:"avatar"})):[])),r.a.createElement("div",{className:"right"},r.a.createElement("button",{tabIndex:"1",onClick:this.handleRun},"Run"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleStop},"Stop"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleSave},"Save"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleNew},"New"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleLoad},"Load"),r.a.createElement("button",{tabIndex:"1",onClick:this.handleHelp,title:"help"},"?"))),a?[]:r.a.createElement("div",{className:"bottom"},r.a.createElement(Xe,{direction:"horizontal",minSize:0},r.a.createElement("div",{className:"left"},r.a.createElement("div",{className:"codes"},r.a.createElement(Xe,{direction:"vertical",minSize:0},e.files.map((function(e,t){return r.a.createElement(Ze,{key:"ca".concat(t),hackKey:o,desc:"filename",title:e.name,value:e.content,onTitleChange:function(e){return function(e,t){B.files[e].name=t,H()}(t,e)},onValueChange:function(e){return function(e,t){B.files[e].content=t,H()}(t,e)},extra:s})}))))),r.a.createElement("div",{className:"right"},r.a.createElement(Qe,{registerRunnerAPI:this.registerRunnerAPI}))))),r.a.createElement(w,{disqusId:at(),title:e.name}),n(),r.a.createElement("div",{className:"messages"},this.state.messages.map((function(e,t){var a=e.msg,n=e.className;return r.a.createElement("div",{className:n,key:"err".concat(t)},a)}))))}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(nt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},46:function(e){e.exports=JSON.parse('{"$schema":"http://json-schema.org/schema#","type":"object","properties":{"name":{"type":"string"},"settings":{"type":"object"},"files":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"content":{"type":"string"}},"required":["content","name"]}}},"required":["name","settings","files"]}')},48:function(e,t,a){e.exports=a.p+"static/media/vertical-layout.f248a432.svg"},49:function(e,t,a){e.exports=a.p+"static/media/horizontal-layout.e3f3298b.svg"},50:function(e,t,a){e.exports=a.p+"static/media/two-by-two-layout.23605ce8.svg"},53:function(e,t,a){e.exports=a(109)},58:function(e,t,a){}},[[53,1,2]]]);
//# sourceMappingURL=main.7b5fa3e0.chunk.js.map