import"../index.js";/* empty css              */import{i as y,I as r,P as w,s as v}from"./passwords.ca46aa8c.js";/* empty css               */import{r as b,aX as h,bl as x,bc as V,bq as $,J as S,aO as k,aP as a,u as B,l as o,N as I,aZ as N,a_ as P,aT as C,bk as U}from"./arco.73db23e5.js";import{u as z}from"./loading.a8216e84.js";import{u as D}from"./vue.57427092.js";import"./vendor.7cd83524.js";/* empty css              *//* empty css              */const F={style:{display:"flex","justify-content":"flex-start",width:"100%"}},G={__name:"index",setup(L){const{t:p}=D(),{loading:u,setLoading:n}=z(),t=b({default_zone_id:null,login_white_list:[],proxy_white_list:[],proxy_users:[]}),d=async()=>{const{data:e}=await y();t.value=e},m=async()=>{try{n(!0),await v({...t.value}),C.success(p("portsetting.save.success"))}catch{}finally{n(!1)}};return d(),(e,l)=>{const i=U,_=h,c=x,g=V,f=$;return S(),k(f,{style:{width:"100%",padding:"22px"},loading:B(u)},{default:a(()=>[o(g,null,{default:a(()=>[o(c,{model:t.value,layout:"vertical",size:"large"},{default:a(()=>[o(i,{tooltip:e.$t("portsetting.set.admin.whitelist.ip"),label:e.$t("portsetting.admin.whitelist.ip")},{default:a(()=>[o(r,{modelValue:t.value.login_white_list,"onUpdate:modelValue":l[0]||(l[0]=s=>t.value.login_white_list=s)},null,8,["modelValue"])]),_:1},8,["tooltip","label"]),o(i,{tooltip:e.$t("portsetting.set.proxy.whitelist.ip"),label:e.$t("portsetting.proxy.whitelist.ip")},{default:a(()=>[o(r,{modelValue:t.value.proxy_white_list,"onUpdate:modelValue":l[1]||(l[1]=s=>t.value.proxy_white_list=s),list:t.value.login_white_list},null,8,["modelValue","list"])]),_:1},8,["tooltip","label"]),o(i,{tooltip:e.$t("portsetting.set.global.proxy.account"),label:e.$t("portsetting.global.proxy.account")},{default:a(()=>[o(w,{modelValue:t.value.proxy_users,"onUpdate:modelValue":l[2]||(l[2]=s=>t.value.proxy_users=s)},null,8,["modelValue"])]),_:1},8,["tooltip","label"]),I("div",F,[o(_,{type:"primary",style:{width:"80px"},onClick:m},{default:a(()=>[N(P(e.$t("portsetting.save")),1)]),_:1})])]),_:1},8,["model"])]),_:1})]),_:1},8,["loading"])}}};export{G as default};
