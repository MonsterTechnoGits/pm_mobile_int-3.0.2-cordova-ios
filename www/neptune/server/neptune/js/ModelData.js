var ModelData={FindFirst:function(t,e,n,r,a){var o=ModelData.Find(t,e,n,r);return 0<o.length?("function"==typeof a&&a(o[0]),o[0]):("function"==typeof a&&a({}),{})},LookupValue:function(t,e,n,r,a,o){var i=ModelData.Find(t,e,n,a,o);return 0<i.length?i[0][r]:null},FindDB:function(t,e,n,r,o){if("undefined"!=typeof AppDB){var i=this.getModel(t),l=[],a=r;"string"==typeof r&&((a=[])[0]=r),AppDB.transaction(function(t){t.executeSql("SELECT * FROM "+e+" WHERE "+n,a,function(t,e){for(var n=0;n<e.rows.length;n++){var r=e.rows.item(n);for(var a in r)"false"===r[a]&&(r[a]=!1),"true"===r[a]&&(r[a]=!0);l.push(r)}i.setData(l),"function"==typeof o&&o()},null)},function(t){"0"!==t.code&&o()})}else"function"==typeof o&&o()},_Compare:function(t,e,n){var r=!1;switch(n){case"Contains":r=-1!=t.indexOf(e);break;case"NE":r=t!=e;break;case"GT":r=e<t;break;case"GE":r=e<=t;break;case"LT":r=t<e;break;case"LE":r=t<=e;break;case"BT":$.isArray(e)&&2==e.length&&(r=t>=e[0]&&t<=e[1]);break;case"StartsWith":r=e.toString().length<=t.toString().length&&e.toString()==t.toString().substr(0,e.toString().length);break;case"EndsWith":r=e.toString().length<=t.toString().length&&e.toString()==t.toString().substr(t.toString().length-e.toString().length,e.toString().length);break;default:r=t==e}return r},_CompareObjWithArray:function(r,t,a,o){var i=!0;return t.forEach(function(t,e,n){i=i&&ModelData._Compare(r[t],a[e],o[e])}),i},_CompareObjWithObj:function(r,t,a,o){var i=!0;return t.forEach(function(t,e,n){i=i&&ModelData._Compare(r[t],a[t],o[e])}),i},Find:function(t,e,n,r,a){var o=this.getModel(t).oData,i=[];if(!$.isArray(o)||0===o.length)return i;if($.isArray(e)||(e=void 0===e?[]:[e]),$.isArray(n)||(n=void 0===n?[]:[n]),void 0===r&&(r="EQ"),!$.isArray(r)){var l=r;r=[],e.forEach(function(t,e,n){r.push(l)})}return e.length!=n.length||e.length!=r.length||(i=0===e.length?o:o.filter(function(t){return ModelData._CompareObjWithArray(t,e,n,r)}),"function"==typeof a&&a(i),o=null),i},Delete:function(t,e,n,r){var a=this.getModel(t),o=a.oData;if($.isArray(o)&&0!==o.length){if($.isArray(e)||(e=void 0===e?[]:[e]),$.isArray(n)||(n=void 0===n?[]:[n]),void 0===r&&(r="EQ"),!$.isArray(r)){var i=r;r=[],e.forEach(function(t,e,n){r.push(i)})}if(e.length==n.length&&e.length==r.length){if(0===e.length)o=[];else for(var l=o.length;l--;)ModelData._CompareObjWithArray(o[l],e,n,r)&&o.splice(l,1);a.setData(o)}}},UpdateField:function(t,e,n,r,a,o){var i=this.getModel(t),l=i.oData;if(void 0!==r){if($.isArray(e)||(e=void 0===e?[]:[e]),$.isArray(n)||(n=void 0===n?[]:[n]),$.isArray(r)||(r=void 0===r?[]:[r]),$.isArray(a)||(a=void 0===a?[]:[a]),void 0===o&&(o="EQ"),!$.isArray(o)){var h=o;o=[],e.forEach(function(t,e,n){o.push(h)})}if(e.length==n.length&&e.length==o.length&&r.length==a.length){for(var f=l.length;f--;)ModelData._CompareObjWithArray(l[f],e,n,o)&&r.forEach(function(t,e,n){l[f][t]=a[e]});i.setData(l)}}},Add:function(t,e){var n=this.getModel(t),r=[];void 0!==n.oData&&n.oData.length&&(r=n.oData),r.push(e),n.setData(r),r=n=null},AddArray:function(t,e){var n=this.getModel(t),r=[];void 0!==n.oData&&n.oData.length&&(r=n.oData),$.each(e,function(t,e){r.push(e)}),n.setData(r)},Update:function(t,e,n,r,a){var o=this.getModel(t),i=o.oData,l=!1;if(void 0===i&&(i=[]),$.isArray(e)||(e=void 0===e?[]:[e]),$.isArray(n)||(n=void 0===n?[]:[n]),void 0===a&&(a="EQ"),!$.isArray(a)){var h=a;a=[],e.forEach(function(t,e,n){a.push(h)})}if(e.length==n.length&&e.length==a.length){if(0<e.length)for(var f=i.length;f--;)ModelData._CompareObjWithArray(i[f],e,n,a)&&(i[f]=r,l=!0);l?o.setData(i):ModelData.Add(t,r)}},UpdateArray:function(t,n,e,r){var a=this.getModel(t),o=a.oData,i=!1;if(void 0===o.length&&(o=[]),$.isArray(n)||(n=void 0===n?[]:[n]),void 0===r&&(r="EQ"),!$.isArray(r)){var l=r;r=[],n.forEach(function(t,e,n){r.push(l)})}n.length==r.length&&($.each(e,function(t,e){if(i=!1,0<n.length)for(t=0;t<o.length;t++)ModelData._CompareObjWithObj(o[t],n,e,r)&&(o[t]=e,i=!0);!1===i&&o.push(e)}),a.setData(o))},getModel:function(t){var e=t.getModel();if(void 0===e)for(var n in t.oModels)e=t.getModel(n);return e},genID:function(){var n=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=(n+16*Math.random())%16|0;return n=Math.floor(n/16),("x"==t?e:7&e|8).toString(16)})},ConvertFlatToNested:function(t,e,n){for(var r,a,o,i=[],l={},h=0,f=t.length;h<f;h++)a=(r=t[h])[e],o=r[n]||0,l[a]=l[a]||[],r.children=l[a],0!==o?(l[o]=l[o]||[],l[o].push(r)):i.push(r);return{children:i}},ConvertNestedToFlat:function(t){var n=[],r=function(t){$.each(t,function(t,e){e.children&&(r(e.children),delete e.children),n.push(e)})};return r(JSON.parse(JSON.stringify(t.children))),n}};