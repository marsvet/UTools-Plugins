(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{337:function(e,t,o){var content=o(890);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(47).default)("3e10ef9e",content,!0,{sourceMap:!1})},889:function(e,t,o){"use strict";var n=o(337);o.n(n).a},890:function(e,t,o){(t=o(46)(!1)).push([e.i,".response-image[data-v-25c54d52]{max-width:100%}",""]),e.exports=t},926:function(e,t,o){"use strict";o.r(t);o(48),o(271),o(49);var n={props:{response:{}},data:function(){return{imageSource:"",doneButton:'<i class="material-icons">done</i>',downloadButton:'<i class="material-icons">save_alt</i>'}},computed:{responseType:function(){return(this.response.headers["content-type"]||"").split(";")[0].toLowerCase()}},watch:{response:{immediate:!0,handler:function(e){var t=this;this.imageSource="";var o=this.response.body,n=new Uint8Array(o),r=new Blob([n.buffer]),d=new FileReader;d.onload=function(e){t.imageSource=e.target.result},d.readAsDataURL(r)}}},mounted:function(){var e=this;this.imageSource="";var t=this.response.body,o=new Uint8Array(t),n=new Blob([o.buffer]),r=new FileReader;r.onload=function(t){e.imageSource=t.target.result},r.readAsDataURL(n)},methods:{downloadResponse:function(){var e=this,t=this.response.body,o=new Blob([t],{type:this.responseType}),a=document.createElement("a"),n=URL.createObjectURL(o);a.href=n,a.download="response on ".concat(Date()).replace(/\./g,"[dot]"),document.body.appendChild(a),a.click(),this.$refs.downloadResponse.innerHTML=this.doneButton,this.$toast.success(this.$t("download_started"),{icon:"done"}),setTimeout((function(){document.body.removeChild(a),window.URL.revokeObjectURL(n),e.$refs.downloadResponse.innerHTML=e.downloadButton}),1e3)}}},r=(o(889),o(42)),component=Object(r.a)(n,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ul",[o("li",[o("div",{staticClass:"flex-wrap"},[o("label",{attrs:{for:"body"}},[e._v(e._s(e.$t("response")))]),e._v(" "),o("div",[e.response.body?o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.$t("download_file"),expression:"$t('download_file')"}],ref:"downloadResponse",staticClass:"icon",on:{click:e.downloadResponse}},[o("i",{staticClass:"material-icons"},[e._v("save_alt")])]):e._e()])]),e._v(" "),o("div",{attrs:{id:"response-details-wrapper"}},[o("img",{staticClass:"response-image",attrs:{src:e.imageSource}})])])])}),[],!1,null,"25c54d52",null);t.default=component.exports}}]);