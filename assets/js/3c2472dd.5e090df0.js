"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[997],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),d=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=d(n),m=a,f=u["".concat(l,".").concat(m)]||u[m]||p[m]||o;return n?r.createElement(f,c(c({ref:t},s),{},{components:n})):r.createElement(f,c({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var d=2;d<o;d++)c[d]=n[d];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5862:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return p}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),c=["components"],i={updated_after:"10206adb0c4038cafc38ac7e28a4941bd989355c",dep:"src/index.ts",sidebar_position:3},l="CLI commands",d={unversionedId:"commands",id:"commands",title:"CLI commands",description:"doccheck --help",source:"@site/docs/commands.md",sourceDirName:".",slug:"/commands",permalink:"/doccheck/commands",draft:!1,editUrl:"https://github.com/krystofrezac/doccheck/tree/main/docs/docs/docs/commands.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{updated_after:"10206adb0c4038cafc38ac7e28a4941bd989355c",dep:"src/index.ts",sidebar_position:3},sidebar:"sidebar",previous:{title:"Getting started",permalink:"/doccheck/getting-started"}},s={},p=[{value:"<code>doccheck --help</code>",id:"doccheck---help",level:2},{value:"<code>doccheck check [file patterns..]</code>",id:"doccheck-check-file-patterns",level:2},{value:"<code>doccheck update [files..]</code>",id:"doccheck-update-files",level:2},{value:"<code>doccheck create [file]</code>",id:"doccheck-create-file",level:2}],u={toc:p};function m(e){var t=e.components,n=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"cli-commands"},"CLI commands"),(0,o.kt)("h2",{id:"doccheck---help"},(0,o.kt)("inlineCode",{parentName:"h2"},"doccheck --help")),(0,o.kt)("p",null,"List all available commands with options."),(0,o.kt)("h2",{id:"doccheck-check-file-patterns"},(0,o.kt)("inlineCode",{parentName:"h2"},"doccheck check [file patterns..]")),(0,o.kt)("p",null,"Check all files that match the pattern. The pattern uses the Unix bash globbing syntax, for details of the syntax see ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/mrmlnc/fast-glob#pattern-syntax"},"this"),"."),(0,o.kt)("h2",{id:"doccheck-update-files"},(0,o.kt)("inlineCode",{parentName:"h2"},"doccheck update [files..]")),(0,o.kt)("p",null,"Mark documentation files as up-to-date."),(0,o.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Use this command only after you updated the documentation, or you decided that it's already up-to-date. If you do not follow these rules, this tool will become useless."))),(0,o.kt)("h2",{id:"doccheck-create-file"},(0,o.kt)("inlineCode",{parentName:"h2"},"doccheck create [file]")),(0,o.kt)("p",null,"Create new documentation file."),(0,o.kt)("h1",{id:"global-options"},"Global options"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--git-dir")," ",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Path to git versioned directory (parent of .git). All absolute paths will be resolved from here."),(0,o.kt)("li",{parentName:"ul"},"default: ",(0,o.kt)("inlineCode",{parentName:"li"},"."))))))}m.isMDXComponent=!0}}]);