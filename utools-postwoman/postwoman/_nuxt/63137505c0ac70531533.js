(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{939:function(t,o,n){"use strict";n.r(o);var e=n(249),c=n.n(e),r=n(238),l={data:function(){return{fb:r.a}},methods:{logout:function(){r.a.currentUser=null;var t=this;c.a.auth().signOut().catch((function(o){t.$toast.show(o.message||o,{icon:"error"})})),t.$toast.info(this.$t("logged_out"),{icon:"vpn_key"})}}},h=n(42),component=Object(h.a)(l,(function(){var t=this.$createElement,o=this._self._c||t;return o("div",[o("button",{directives:[{name:"close-popover",rawName:"v-close-popover"}],staticClass:"icon",on:{click:this.logout}},[o("i",{staticClass:"material-icons"},[this._v("exit_to_app")]),this._v(" "),o("span",[this._v(this._s(this.$t("logout")))])])])}),[],!1,null,null,null);o.default=component.exports}}]);