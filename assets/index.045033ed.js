import{r as G,o as w,c as y,a as l,b as f,w as U,u as P,G as O,p as A,d as B,e as b,F as oe,t as ae,f as g,g as W,h as E,i as C,v as se,j as ne,k as ie,l as le,s as I,m as T,n as K,q as j,x as re,y as ue,z as ce,A as de,B as me,C as he,D as pe}from"./vendor.6cf98e60.js";const _e=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerpolicy&&(i.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?i.credentials="include":t.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}};_e();var fe="/fourier-transform-visualization/logo.png";var F=(e,o)=>{for(const[s,a]of o)e[s]=a;return e};const ve=e=>(A("data-v-226dd509"),e=e(),B(),e),ge={class:"navbar is-spaced has-shadow",role:"navigation","aria-label":"main navigation"},be={class:"navbar-menu is-active"},we={class:"navbar-start"},ye=ve(()=>l("img",{class:"navbar-item",src:fe},null,-1)),xe=b("Fourier Magnitude Spectrum"),Ve=b("Fourier Series"),$e={class:"navbar-end"},Me={class:"navbar-item is-expanded"},Ie={class:"columns is-mobile is-centered"},Fe=b(" Watch "),Se=b(" Star "),ke={setup(e){return(o,s)=>{const a=G("router-link");return w(),y("nav",ge,[l("div",be,[l("div",we,[ye,f(a,{class:"navbar-item",to:"/"},{default:U(()=>[xe]),_:1}),f(a,{class:"navbar-item",to:"/series"},{default:U(()=>[Ve]),_:1})]),l("div",$e,[l("div",Me,[l("div",Ie,[f(P(O),{href:"https://github.com/igormandello/fourier-transform-visualization/subscription","data-icon":"octicon-eye","data-size":"large","data-show-count":"true","aria-label":"Watch igormandello/fourier-transform-visualization on GitHub",class:"column is-narrow"},{default:U(()=>[Fe]),_:1}),f(P(O),{href:"https://github.com/igormandello/fourier-transform-visualization","data-icon":"octicon-star","data-size":"large","data-show-count":"true","aria-label":"Star igormandello/fourier-transform-visualization on GitHub",class:"column is-narrow"},{default:U(()=>[Se]),_:1})])])])])])}}};var Ne=F(ke,[["__scopeId","data-v-226dd509"]]);const ze={},Ce=e=>(A("data-v-34fe3d60"),e=e(),B(),e),Le={class:"footer"},Ue=Ce(()=>l("div",{class:"content has-text-centered"},[l("p",null,[b(" Created by "),l("a",{href:"https://github.com/igormandello",rel:"noopener",target:"__blank"},"Igor Mandello"),b(". The source code is licensed "),l("a",{href:"http://opensource.org/licenses/mit-license.php",rel:"noopener",target:"__blank"},"MIT"),b(". ")])],-1)),Ae=[Ue];function Be(e,o){return w(),y("footer",Le,Ae)}var De=F(ze,[["render",Be],["__scopeId","data-v-34fe3d60"]]);const He={setup(e){return(o,s)=>{const a=G("router-view");return w(),y(oe,null,[f(Ne),f(a,{class:"content"}),f(De)],64)}}};const Ge={class:"column field is-one-fifth-desktop"},Pe={class:"label"},je={class:"tag is-primary"},qe=["min","max","step"],Re={props:{modelValue:String,label:String,min:String,max:String,step:String},emits:["update:modelValue","change"],setup(e,{emit:o}){const a=ae(e,"modelValue"),t=g(a.value);return W(t,i=>o("update:modelValue",i)),(i,c)=>(w(),y("div",Ge,[l("label",Pe,[b(E(e.label)+": ",1),l("span",je,E(P(a)),1)]),C(l("input",{"onUpdate:modelValue":c[0]||(c[0]=p=>t.value=p),class:"slider is-circle is-primary",type:"range",min:e.min,max:e.max,step:e.step,onChange:c[1]||(c[1]=p=>i.$emit("change",p))},null,40,qe),[[se,t.value]])]))}};var L=F(Re,[["__scopeId","data-v-4249f443"]]);const Oe=e=>(A("data-v-3f360b39"),e=e(),B(),e),We={class:"file is-centered is-boxed"},Ee={class:"file-label"},Te={class:"file-cta"},Ke={class:"file-icon"},Xe=Oe(()=>l("span",{class:"file-label"},"Choose an image...",-1)),Ye={props:{width:Number,height:Number},emits:["imageLoaded"],setup(e,{emit:o}){const s=e,{width:a,height:t}=ne(s);function i(c){const p=c.target.files;if(!p||!p[0])return;const h=new FileReader;h.onload=d=>{const r=document.createElement("img");r.src=d.target.result,r.onload=()=>{const n=document.createElement("canvas");n.width=a.value,n.height=t.value;const _=n.getContext("2d");ie(_,r,0,0,n.width,n.height,{objectFit:"contain"});const x=_.getImageData(0,0,n.width,n.height);o("imageLoaded",x)}},h.readAsDataURL(p[0])}return(c,p)=>{const h=G("FontAwesomeIcon");return w(),y("div",We,[l("label",Ee,[l("input",{class:"file-input",type:"file",accept:"image/png, image/jpeg",onchange:i}),l("span",Te,[l("span",Ke,[f(h,{icon:"upload"})]),Xe])])])}}};var Je=F(Ye,[["__scopeId","data-v-3f360b39"]]);function Qe(e,o,s,a,t){const i=Math.abs(o-e),c=Math.abs(a-s),p=e<o?1:-1,h=s<a?1:-1;let d=i-c,r=e,n=s;for(;t(r,n),!(r===o&&n===a);){const _=2*d;_>-c&&(d-=c,r+=p),_<i&&(d+=i,n+=h)}}const Ze=["width","height"],X={props:{width:Number,height:Number},emits:["drawPoint","finishedDrawing","update:context"],setup(e,{emit:o}){const s=g(null),a=g(!1);let t=null;function i(d){if(!a.value)return;const{x:r,y:n}=h(d);t&&Qe(r,t.x,n,t.y,(_,x)=>o("drawPoint",_,x)),t={x:r,y:n},o("drawPoint",r,n)}function c(d){const{x:r,y:n}=h(d);o("drawPoint",r,n),o("finishedDrawing")}function p(){!a.value||(a.value=!1,t=null,o("finishedDrawing"))}function h(d){return{x:Math.floor(d.target.width*d.offsetX/d.target.clientWidth),y:Math.floor(d.target.height*d.offsetY/d.target.clientHeight)}}return le(()=>{o("update:context",s.value.getContext("2d"))}),(d,r)=>(w(),y("canvas",{ref:(n,_)=>{_.canvas=n,s.value=n},width:e.width,height:e.height,onClick:c,onMousemove:i,onMousedown:r[0]||(r[0]=n=>a.value=!0),onMouseup:p,onMouseleave:p},null,40,Ze))}};function et(e,o,s,a,t,i){const c=s<a||s>t,p=s>a&&s<t;return!i&&c||i&&p?{realValue:0,imaginaryValue:0}:{realValue:e,imaginaryValue:o}}function tt(e,o,s){const a=1/(1+Math.pow(o/e,4));return{high:Number.isNaN(a)?1:a,low:1/(1+Math.pow(e/s,2))}}function ot(e,o,s){const a=1-Math.exp(-(e*e/(2*o*o)));return{high:Number.isNaN(a)?1:a,low:Math.exp(-(e*e/(2*s*s)))}}function Y(e){return(o,s,a,t,i,c)=>{const p=c?a-t:a,{high:h,low:d}=e(p,t,i);return{realValue:o*d*h,imaginaryValue:s*d*h}}}const at=Y(tt),st=Y(ot),nt={ideal:et,butterworth:at,gaussian:st};function it(e){const o=[];for(let t=0;t<e.data.length;t+=4){if(e.data[t+3]===0){o.push([1,0]);continue}const i=(e.data[t]+e.data[t+1]+e.data[t+2])/(255*3);o.push([i,0])}const s=I.array(o).reshape(e.width,e.height,2),a=I.fft(s).tolist();K(a);for(let t=0;t<e.height;t++)K(a[t]);return I.array(a)}function lt(e){const o=e.tolist();T(o);for(let a=0;a<e.shape[0];a++)T(o[a]);const s=I.array(o);return I.ifft(s).reshape(-1).tolist()}function rt(e,o,s,a,t,i){const c=e.shape[0],p=e.shape[1];let h=0;const d=[];for(let r=0;r<c;r++)for(let n=0;n<p;n++){const _=Math.sqrt(Math.pow(n-p/2,2)+Math.pow(r-c/2,2)),x=e.get(r,n,0),S=e.get(r,n,1),{realValue:k,imaginaryValue:v}=nt[o](x,S,_,s,a,t);e.set(r,n,0,k),e.set(r,n,1,v);const D=Math.sqrt(k*k+v*v),N=Math.log(D);if(N>h&&(h=N),i.get(r,n)){d.push(0),e.set(r,n,0,0),e.set(r,n,1,0);continue}d.push(N)}return{maxMag:h,magnitudesList:d}}function J(e,o,s){e.data[o]=s,e.data[o+1]=s,e.data[o+2]=s,e.data[o+3]=255}const Q=e=>(A("data-v-6d84c2d3"),e=e(),B(),e),ut={class:"section container is-max-widescreen"},ct={key:0,class:"columns is-centered mb-4"},dt={class:"column is-one-quarter"},mt={key:1,class:"columns is-multiline is-centered is-variable is-6 mt-4"},ht={class:"column field is-flex is-align-items-center is-justify-content-center"},pt={class:"radio mr-4"},_t=b(" Ideal "),ft={class:"radio mr-4"},vt=b(" Butterworth "),gt={class:"radio"},bt=b(" Gaussian "),wt={class:"column field is-narrow"},yt=Q(()=>l("label",{class:"label"},"Invert Filter",-1)),xt=Q(()=>l("label",{for:"invert"},null,-1)),Vt={class:"columns box canvas px-0 py-0"},$t={setup(e){const o=g(!1),s=g("0"),a=g("400"),t=g(!1),i=g("1.5"),c=g("10"),p=g("0"),h=g("ideal"),d=g(null),r=g(null),n=512,_=512;let x=null,S=I.zeros([n,_]);W(h,v);function k($){o.value=!0,x=it($),v()}function v(){const $=x.clone(),{maxMag:m,magnitudesList:u}=rt($,h.value,s.value,a.value,t.value,S),M=lt($),V=new ImageData(n,_),q=new ImageData(n,_);for(let z=0;z<n*_;z++){const R=z*4,ee=u[z]*255/m;J(q,R,ee);const H=Math.floor(Math.pow(M[z*2],1/i.value)*255),te=H<0||H<=p.value?0:H;J(V,R,te)}r.value.putImageData(V,0,0),d.value.putImageData(q,0,0)}function D($,m){const u=c.value;for(let M=-u;M<u;M++)for(let V=-u;V<u;V++)Math.sqrt(M*M+V*V)>u||S.set(M+m,V+$,1)}function N(){S=I.zeros([n,_]),v()}return($,m)=>(w(),y("section",ut,[o.value?(w(),y("div",mt,[f(L,{modelValue:s.value,"onUpdate:modelValue":m[0]||(m[0]=u=>s.value=u),class:"is-one-third-tablet",label:"Minimum Radius",min:"0",max:"400",step:"1",onChange:v},null,8,["modelValue"]),f(L,{modelValue:a.value,"onUpdate:modelValue":m[1]||(m[1]=u=>a.value=u),class:"is-one-third-tablet",label:"Maximum Radius",min:"0",max:"400",step:"1",onChange:v},null,8,["modelValue"]),f(L,{modelValue:i.value,"onUpdate:modelValue":m[2]||(m[2]=u=>i.value=u),class:"is-one-third-tablet",label:"Gamma",min:"0.1",max:"3",step:"0.1",onChange:v},null,8,["modelValue"]),f(L,{modelValue:c.value,"onUpdate:modelValue":m[3]||(m[3]=u=>c.value=u),class:"is-half-tablet",label:"Brush size",min:"5",max:"50",step:"1"},null,8,["modelValue"]),f(L,{modelValue:p.value,"onUpdate:modelValue":m[4]||(m[4]=u=>p.value=u),class:"is-half-tablet",label:"Minimum value",min:"0",max:"255",step:"1",onChange:v},null,8,["modelValue"]),l("div",ht,[l("label",pt,[C(l("input",{"onUpdate:modelValue":m[5]||(m[5]=u=>h.value=u),value:"ideal",type:"radio",name:"filterType"},null,512),[[j,h.value]]),_t]),l("label",ft,[C(l("input",{"onUpdate:modelValue":m[6]||(m[6]=u=>h.value=u),value:"butterworth",type:"radio",name:"filterType"},null,512),[[j,h.value]]),vt]),l("label",gt,[C(l("input",{"onUpdate:modelValue":m[7]||(m[7]=u=>h.value=u),value:"gaussian",type:"radio",name:"filterType"},null,512),[[j,h.value]]),bt])]),l("div",wt,[yt,C(l("input",{id:"invert","onUpdate:modelValue":m[8]||(m[8]=u=>t.value=u),type:"checkbox",class:"switch is-rounded is-small",onChange:v},null,544),[[re,t.value]]),xt]),l("div",{class:"column field is-narrow is-flex is-align-items-center is-justify-content-center"},[l("button",{onClick:N,class:"button is-primary"},"Clear Mask")])])):(w(),y("div",ct,[l("div",dt,[f(Je,{onImageLoaded:k,width:n,height:_})])])),l("div",Vt,[f(X,{context:d.value,"onUpdate:context":m[9]||(m[9]=u=>d.value=u),class:"column px-0 py-0",width:n,height:_,onDrawPoint:D,onFinishedDrawing:v},null,8,["context"]),f(X,{context:r.value,"onUpdate:context":m[10]||(m[10]=u=>r.value=u),class:"column px-0 py-0",width:n,height:_},null,8,["context"])])]))}};var Mt=F($t,[["__scopeId","data-v-6d84c2d3"]]);const It={},Ft={class:"section"},St=l("h1",{class:"title"},"Coming soon...",-1),kt=[St];function Nt(e,o){return w(),y("section",Ft,kt)}var zt=F(It,[["render",Nt]]);const Ct=[{path:"/",name:"Visualization",component:Mt},{path:"/series",name:"Series",component:zt}],Lt=ue({history:ce("/fourier-transform-visualization/"),routes:Ct}),Z=de(He).use(Lt);me.add(he);Z.component("FontAwesomeIcon",pe);Z.mount("#app");
