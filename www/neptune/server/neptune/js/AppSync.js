AppSync={diaSync:null,diaSyncIcon1:null,diaSyncIcon2:null,diaSyncIcon3:null,diaSyncCount1:null,diaSyncCount2:null,diaSyncCount3:null,diaSyncCount4:null,serverUrl:null,db:null,updateArray:new Array,updateRunning:!1,tablesToSync:[],syncInfo:null,syncResult:null,lastSyncDate:0,firstSync:!1,cbEndSync:null,sqlSplit:100,runParallell:!0,noDialog:!1,updPackage:0,recPackage:0,numPackage:1,applid:"",checkTable:function(e,n){AppDB.transaction(function(t){t.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = ?',[e],function(t,a){var c=a.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g,"$1").split(","),s=[];for(i in c)"string"==typeof c[i]&&s.push(c[i].split(" ")[1]);$.each(n,function(n,t){if(-1===s.indexOf(t)){var a="ALTER TABLE "+e+" ADD "+t+" VARCHAR;";try{AppDB.transaction(function(n){n.executeSql(a,[]),console.log("Table: "+e+", added field: "+t)})}catch(e){console.log("Error: Unable to alter table "+e+".")}}})})})},initSync:function(e,n,t,a,c,s){var i=this,l=0;for(this.applid=s,this.db=n,this.serverUrl=a,this.tablesToSync=e,this.syncInfo=t,l=0;l<i.tablesToSync.length;l++)void 0===i.tablesToSync[l].idName&&(i.tablesToSync[l].idName="id");i.db.transaction(function(e){i._executeSql("CREATE TABLE IF NOT EXISTS SYNCINFO (key VARCHAR PRIMARY KEY,last_sync TIMESTAMP);",[],e)}),i._selectSql("SELECT last_sync FROM SYNCINFO WHERE key = ?",[i.applid],null,function(e){0===e.length||0==e[0]?(i._executeSql("INSERT OR REPLACE INTO SYNCINFO (key,last_sync) VALUES (?,?)",[i.applid,0]),i.firstSync=!0,i.lastSyncDate=0,i.syncInfo.lastSyncDate=i.lastSyncDate,c(!0)):(i.lastSyncDate=e[0].last_sync,0===i.lastSyncDate&&(i.firstSync=!0),i.syncInfo.lastSyncDate=i.lastSyncDate,c(!1))})},syncNow:function(e,n,t){var a=this;if(null===this.db)throw"You should call the initSync before (db is null)";a.syncResult={syncOK:!1,codeStr:"noSync",message:"No Sync yet",nbSent:0,nbUpdated:0},a.updPackage=0,a.recPackage=0,a.numPackage=t||1,a.createDialog(),a.cbEndSync=function(){e(a.syncResult.message,100,a.syncResult.codeStr),n(a.syncResult)};var c={info:a.syncInfo,data:{}};a._sendDataToServer(c)},createDialog:function(){this.diaSync=new sap.m.Dialog({contentHeight:"260px",contentWidth:"400px",title:"Syncronization"});var e=new sap.m.Table({fixedLayout:!1});this.diaSync.addContent(e);var n=new sap.m.Column({width:"40px"});e.addColumn(n);var t=new sap.m.Column;e.addColumn(t);var a=new sap.m.Column({hAlign:"End",width:"50px"});e.addColumn(a);var c=new sap.m.ColumnListItem;e.addItem(c),this.diaSyncIcon1=new sap.ui.core.Icon({size:"20px"}),c.addCell(this.diaSyncIcon1);var s=new sap.m.Text({text:"Select"});c.addCell(s),this.diaSyncCount1=new sap.m.BusyIndicator,c.addCell(this.diaSyncCount1);var i=new sap.m.ColumnListItem;e.addItem(i),this.diaSyncIcon2=new sap.ui.core.Icon({size:"20px"}),i.addCell(this.diaSyncIcon2);var l=new sap.m.Text({text:"Receive"});i.addCell(l),this.diaSyncCount2=new sap.m.Text,i.addCell(this.diaSyncCount2);var o=new sap.m.ColumnListItem;e.addItem(o),this.diaSyncIcon3=new sap.ui.core.Icon({size:"20px"}),o.addCell(this.diaSyncIcon3);var r=new sap.m.Text({text:"Update"});o.addCell(r),this.diaSyncCount3=new sap.m.Text,o.addCell(this.diaSyncCount3);var u=new sap.m.ColumnListItem;e.addItem(u),this.diaSyncIcon4=new sap.ui.core.Icon({src:"sap-icon://number-sign",size:"20px"}),u.addCell(this.diaSyncIcon4);var d=new sap.m.Text({text:"Records"});u.addCell(d),this.diaSyncCount4=new sap.m.Text,u.addCell(this.diaSyncCount4),this.diaSyncCount2.setText(this.recPackage+"/"+this.numPackage),this.diaSyncCount3.setText(this.updPackage+"/"+this.numPackage),this.diaSyncCount4.setText("0"),this.diaSyncIcon1.setSrc("sap-icon://process"),this.diaSyncIcon2.setSrc("sap-icon://process"),this.diaSyncIcon3.setSrc("sap-icon://process"),this.diaSyncIcon1.setColor("#f39c12"),this.diaSyncIcon2.setColor("#f39c12"),this.diaSyncIcon3.setColor("#f39c12"),this.diaSync.rerender(),this.noDialog||this.diaSync.open()},log:function(e){},error:function(e){console.error(e)},resetSyncDate:function(){this.syncInfo.lastSyncDate=0,this.firstSync=!0,this._executeSql('UPDATE SYNCINFO SET last_sync = "0" WHERE key=?',[this.applid])},_sendDataToServer:function(e){var n=this;jQuery.ajax({url:n.serverUrl+"&key=BUILD&ajax_value="+n.numPackage,type:"POST",data:JSON.stringify(e),dataType:"json",success:function(t){if(n.diaSyncCount4.setText(t.rows),n.diaSyncIcon1.setColor("#007833"),n.diaSyncIcon1.setSrc("sap-icon://accept"),AppSyncBeforeUpdate(n),1!==n.numPackage)if(n.runParallell)for(i=0;i<n.numPackage;i++)n._getPackageFromServer(e,i);else n._getPackageFromServer(e,0);else n._updatePutInQueue(t)},error:function(e){n.diaSync.close(),e.result="ERROR",e.message=e.statusText,n.cbEndSync(n.syncResult)}})},_getPackageFromServer:function(e,n){var t=this;jQuery.ajax({url:t.serverUrl+"&key=GET&key_id="+n,type:"POST",data:JSON.stringify(e),dataType:"json",success:function(n){t.recPackage++,t.diaSyncCount2.setText(t.recPackage+"/"+t.numPackage),t.diaSyncCount1.setVisible(!1),t._updatePutInQueue(n),t.recPackage===t.numPackage?(t.diaSyncIcon2.setColor("#007833"),t.diaSyncIcon2.setSrc("sap-icon://accept")):t.runParallell||t._getPackageFromServer(e,t.recPackage)},error:function(e){t.diaSync.close(),e.result="ERROR",e.message=e.statusText,t.cbEndSync(t.syncResult)}})},_updatePutInQueue:function(e){this.updateArray.push(e),this._updateStartQueue()},_updateStartQueue:function(){this.updateRunning||(this._updateLocalDb(this.updateArray[0]),this.updateArray.splice(0,1))},_updateLocalDb:function(e){var n=this;if(!(n.updPackage>n.numPackage))return e&&"ERROR"!==e.result?void(void 0!==e.data&&0!==e.data.length?n.db.transaction(function(t){n.updateRunning=!0;n.tablesToSync.length;n.tablesToSync.forEach(function(a){void 0===e.data[a.tableName]&&(e.data[a.tableName]=[]);var c=e.data[a.tableName].slice(1,e.data[a.tableName][0]+1),s=0,i="",l=!1;e.data[a.tableName]=e.data[a.tableName].slice(parseInt(e.data[a.tableName][0])+1,e.data[a.tableName].length);var o="INSERT OR REPLACE INTO "+a.tableName+" (",r="",u=0;o+=n._arrayToString(c,","),i=o+=") SELECT ",$.each(e.data[a.tableName],function(e,a){u===c.length&&(r="",u=0,l=!0,++s===AppSync.sqlSplit?(n._executeSql(i,null,t),i=o,s=0):i+=" UNION SELECT "),u++,i+=r+'"'+a+'"',r=","}),(l||e.data[a.tableName].length===c.length)&&n._executeSql(i,null,t)}),n.updPackage++,n._finishSync(e.syncDate,t),n.diaSyncCount3.setText(n.updPackage+"/"+n.numPackage),n.updateRunning=!1,e="",0!==n.updateArray.length&&setTimeout(function(){n._updateStartQueue()},100),n.updPackage===n.numPackage&&(AppSyncAfterUpdate(n),n.diaSyncIcon3.setColor("#007833"),n.diaSyncIcon3.setSrc("sap-icon://accept"),n.syncResult.syncOK=!0,n.cbEndSync(n.syncResult),setTimeout(function(){n.diaSync.close()},100))}):n.db.transaction(function(t){n._finishSync(e.syncDate,t)})):(n.syncResult.syncOK=!1,n.syncResult.codeStr="syncKoServer",n.syncResult.message=e?e.message:"No answer from the server",void n.cbEndSync(n.syncResult))},_finishSync:function(e,n){this.firstSync=!1,this.lastSyncDate=e,this.syncInfo.lastSyncDate=this.lastSyncDate,this._executeSql('UPDATE SYNCINFO SET last_sync = "'+this.lastSyncDate+'" WHERE key=?',[this.applid],n)},_selectSql:function(e,n,t,a){var c=this;c._executeSql(e,n,t,function(e,n){a(c._transformRs(n))},c._errorHandler)},_transformRs:function(e){var n=[];if(void 0===e.rows)return n;for(var t=0;t<e.rows.length;++t)n.push(e.rows.item(t));return n},_executeSql:function(e,n,t,a){var c=this;c.log("_executeSql: "+e+" with param "+n),a||(a=c._defaultCallBack),t?c._executeSqlBridge(t,e,n,a,c._errorHandler):c.db.transaction(function(t){c._executeSqlBridge(t,e,n,a,c._errorHandler)})},_executeSqlBridge:function(e,n,t,a,c){if(void 0!==this.db.dbPath){var s=[n].concat(t);e.executeSql(s,function(n){n.rows.item=function(e){return this[e]},a(e,n)},c)}else e.executeSql(n,t,a,c)},_defaultCallBack:function(e,n){},_errorHandler:function(e,n){AppSync.error("Error : "+n.message+" (Code "+n.code+") Transaction.sql = "+e.sql)},_arrayToString:function(e,n){for(var t="",a=0;a<e.length;a++)t+=e[a],a<e.length-1&&(t+=n);return t}};