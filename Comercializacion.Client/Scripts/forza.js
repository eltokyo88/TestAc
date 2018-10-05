// Fuente: Forza.Web/Scripts/forza.js
// Siempre modificar el archivo desde su fuente y mantener retrocompatibilidad.

function Forza() {}

(function () {
   var Dom;
   var Event;
   var Selector;

   if (window.YAHOO) {
      Dom = YAHOO.util.Dom;
      Event = YAHOO.util.Event;
      Selector = YAHOO.util.Selector;
   }

   Forza.namespace = function (name) {
      var parts = name.split('.');
      var current = Forza;

      for (var i in parts) {
         if (window.YAHOO && !YAHOO.lang.hasOwnProperty(parts, i)) {
            continue;
         }

         if (!current[parts[i]]) {
            current[parts[i]] = function() { };
         }

         current = current[parts[i]];
      }
   }

   Forza.namespace("Util");

   Forza.Util.each = function (array, func) {
      if (!array || !array.length) return;
      for (var i = 0; i < array.length; ++i) func(array[i], i);
   }

   // Deprecated: forza-jquery.js
   Forza.Util.Switch = function (value) {
      this._value = value;
   }

   // Deprecated: forza-jquery.js
   Forza.Util.Switch.prototype = {
      get: function () { return this._value; },
      set: function (value) {
         if (value !== this._value) {
            this._value = value;
            if (this.onChange) this.onChange();
         }
      }
   };

   Forza.Util.startAjaxRequest = function startAjaxRequest(url, params, method, processResult, handleFailure) {
      var AjaxObject = {
         handleSuccess: function (o) {
            this.processResult(o);
         },

         handleFailure: handleFailure,

         processResult: processResult,

         startRequest: function () {
            YAHOO.util.Connect.asyncRequest(method, url, callback, Forza.Util.createParamString(params));
         }
      };

      var callback =
		{
		   success: AjaxObject.handleSuccess,
		   failure: AjaxObject.handleFailure,
		   scope: AjaxObject
		};

      AjaxObject.startRequest();
   }

   Forza.Util.startAjaxPolling = function startAjaxRequest(url, params, method, processResult, handleFailure, ms) {
      function poll() {
         Forza.Util.startAjaxRequest(url, params, method, function (o) {
            processResult(o);
            setTimeout(poll, ms);
         }, handleFailure);
      }

      poll();
   }

   // Deprecated: forza-jquery.js
   String.prototype.contains = function (s) {
      return this.indexOf(s) >= 0;
   }

   // Deprecated: forza-jquery.js
   String.prototype.isUri = function (e) {
      return /^[a-zA-Z0-9\-]+$/.test(this);
   }

   // Deprecated: forza-jquery.js
   String.prototype.isEmail = function (e) {
      return /^(([a-zA-Z0-9]+_+)|([a-zA-Z0-9]+\-+)|([a-zA-Z0-9]+\.+)|([a-zA-Z0-9]+\++))*[a-zA-Z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/.test(this);
   }

   // Deprecated: forza-jquery.js
   Forza.Util.arrayCopy = function (array) {
      var copy = [];

      for (var i = 0; i < array.length; ++i) {
         copy.push(array[i]);
      }

      return copy;
   }

   // Deprecated: forza-jquery.js
   Forza.Util.arrayRemove = function (array, item) {
      for (var i = 0; i < array.length; ++i) {
         if (array[i] === item) {
            array.splice(i, 1);
            return true;
         }
      }

      return false;
   }

   // Deprecated: forza-jquery.js
   Forza.Util.arrayContains = function (array, obj, index) {
      var i = array.length;
      while (i--) if (array[i] === obj) return index ? i : true;
      return index ? -1 : false;
   }

   // Deprecated: forza-jquery.js
   Forza.Util.arrayIndexOf = function (array, obj) {
      return Forza.Util.arrayContains(array, obj, true);
   }

   // Deprecated: forza-jquery.js
   Forza.Util.arrayFirstOrDefault = function (array, predicate) {
      for (var i = 0; i < array.length; ++i) if (predicate(array[i])) return array[i];
      return null;
   }

   Forza.Util.Langs = ["English", "Spanish", "Portuguese"];

   Forza.Util.getDefaultLang = function (lang) {
      if (!Forza.Util.arrayContains(Forza.Util.Langs, lang)) return Forza.Util.Langs[0];
      else return lang;
   }

   Forza.Util.DayOfWeekNames = {
      English: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      Spanish: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      Portuguese: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
   };

   Forza.Util.DayOfWeekShortenings = {
      English: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      Spanish: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      Portuguese: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
   };

   Forza.Util.MonthNames = {
      English: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      Spanish: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      Portuguese: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
   }

   Forza.Util.MonthShortenings = {
      English: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'],
      Spanish: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      Portuguese: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
   }

   Forza.Util.Dictionary = {
      "and": ["y"],
      "or": ["o"]
   }

   Forza.Util.Dictionary.getWord = function (word, lang) {
      if (typeof (Forza.Util.Dictionary[word]) === "undefined") return word;
      lang = Forza.Util.getDefaultLang(lang);
      var i = Forza.Util.arrayIndexOf(Forza.Util.Langs, lang);
      if (i == 0) return word;
      return Forza.Util.Dictionary[word][i - 1];
   }

   Forza.Util.andize = function (strings, conf) {
      if (!conf) conf = {};
      if (!conf.and) conf.and = "and"
      if (strings.length == 0) return "";
      if (strings.length == 1) return strings[0];
      var s = strings[0];
      for (var i = 1; i < strings.length - 1; ++i) s += ", " + strings[i];
      s += " " + Forza.Util.Dictionary.getWord(conf.and, conf.lang) + " " + strings[strings.length - 1];
      return s;
   }

   Forza.Util.getNextDow = function (dow) {
      if (++dow == 7) return 0;
      return dow;
   }

   Forza.Util.getPrevDow = function (dow) {
      if (--dow == -1) return 6;
      return dow;
   }

   Forza.Util.dowIntervalToString = function (interval, conf) {
      if (!conf) conf = {};
      conf.lang = Forza.Util.getDefaultLang(conf.lang);
      if (!conf.separator) conf.separator = "-";
      var names = conf.shortenings ? Forza.Util.DayOfWeekShortenings : Forza.Util.DayOfWeekNames;
      if (interval[0] == interval[1]) return names[conf.lang][interval[0]];
      return names[conf.lang][interval[0]] + conf.separator + names[conf.lang][interval[1]];
   }

   Forza.Util.getDowIntervals = function (dows) {
      var count = 0;
      var i;
      var j;

      for (i = 0; i < 7; ++i)
         if (dows[i]) {
            ++count;
            j = i;
         }

      if (count == 0) return [];
      if (count == 1) return [[j, j]];
      if (count == 7) return [[0, 6]];
      var list = [];
      for (i = 0; i < 7; ++i) if (!dows[i]) break;
      i = Forza.Util.getNextDow(i);

      while (1)
         if (dows[i]) break;
         else i = Forza.Util.getNextDow(i);

      var start = i;

      do {
         j = Forza.Util.getNextDow(i);

         while (1)
            if (!dows[j]) break;
            else j = Forza.Util.getNextDow(j);

         list.push([i, Forza.Util.getPrevDow(j)]);
         i = Forza.Util.getNextDow(j);

         while (1)
            if (dows[i]) break;
            else i = Forza.Util.getNextDow(i);
      } while (i != start);

      return list;
   }

   Forza.Util.dowsToIntervalsString = function (dows, conf) {
      var intervals = Forza.Util.getDowIntervals(dows);
      var sIntervals = [];
      for (var i = 0; i < intervals.length; ++i) sIntervals.push(Forza.Util.dowIntervalToString(intervals[i], conf));
      return Forza.Util.andize(sIntervals, conf);
   }

   Forza.Util.createParamString = function (params) {
      var paramsString = "";

      for (var i in params) {
         if (YAHOO.lang.hasOwnProperty(params, i)) {
            paramsString += i + '=' + params[i] + '&';
         }
      }

      return paramsString.substr(0, paramsString.length - 1);
   }

   Forza.Util.addOption = function (select, value, text, selectNew) {
      select[select.length] = new Option(text, value);
      if (selectNew) {
         select.value = value;
      }
   }

   Date.prototype.toDateString = function (separator, language) {
      var shortenings = Forza.Util.MonthShortenings[language || "English"];
      var y = "";
      var m = shortenings[this.getMonth()];
      separator = separator || '-';
      y += this.getYear();
      y = y.substr(y.length - 2);
      return this.getDate() + separator + m + separator + y;
   }

   Date.prototype.toLongDateString = function (separator, language) {
      var m = Forza.Util.MonthNames[language || "English"][this.getMonth()];
      separator = separator || '-';
      return this.getDate() + separator + m + separator + this.getFullYear();
   }

   Date.prototype.toDDMMYYYYString = function () {
      return isNaN(this) ? 'NaN' : [this.getDate() > 9 ? this.getDate() : '0' + this.getDate(), this.getMonth() > 8 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1), this.getFullYear()].join('/')
   }
     
   Date.prototype.toMMDDYYYYString = function () {
      return isNaN(this) ? 'NaN' : [ this.getMonth() > 8 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(), this.getFullYear()].join('/')
   }

   Date.prototype.isValid = function () {
      return this != "Invalid Date" && !isNaN(this);
   }

   Date.fromDDMMYYYYString = function (s) {
      return (/^(\d\d?)\D(\d\d?)\D(\d{4})$/).test(s) ? new Date(RegExp.$3, RegExp.$2 - 1, RegExp.$1) : new Date(s);
   }

   Date.fromShortFormat = function (s) {
      var date;
       
       if(s && s!="") {
          var d = s.split('/');
          var dYear = parseInt(d[2]);
          var dMonth= parseInt(d[1]);
          var dDay = parseInt(d[0]);
          
          if(dDay<32) {
              s = dYear.toString() + "/" + dMonth.toString() + "/" + dDay.toString();
          }else {
              s = dDay.toString() + "/" + dMonth.toString() + "/" + dYear.toString();
          }
      }
      if ((/^(\d+)-(\d+)-(\d+)$/).test(s) || (/^(\d+)\/(\d+)\/(\d+)$/).test(s)) {
         var year = Math.floor(parseFloat(RegExp.$1));
         if (year < 100) year += 2000;
         date = new Date(year, RegExp.$2 - 1, RegExp.$3)
      } else {
         date = new Date(s);
      }

      return date;
   }

   Date.fromString = function (s) {
      date = Date.fromShortFormat(s);
      if (date.isValid()) return date;
      var date = Date.fromDDMMYYYYString(s);
      if (date.isValid()) return date;
      return date;
   }

   Forza.namespace("UI");

   Forza.UI.Counter = function (text, counter, maxlen) {
      this.text = Dom.get(text);
      this.counter = Dom.get(counter);
      this.maxlen = maxlen;
      var self = this;
      this.update();

      function listener(e) {
         setTimeout(function (e) {
            self.update();
         }, 0);
      }

      Event.on(this.text, "keyup", listener);
      Event.on(this.text, "paste", listener);
   }

   Forza.UI.Counter.prototype = {
      update: function () {
         var len = this.text.value.length;
         this.counter.innerHTML = len + "/" + this.maxlen;

         if (len > this.maxlen) {
            Dom.addClass(this.counter, "exceed");
         } else {
            Dom.removeClass(this.counter, "exceed");
         }
      }
   };

   Forza.UI.NotificationControl = function (config) {
      if (!config.id || !config.url || !config.updatingField || !config.minutesField) return;
      if (!config.params) config.params = {};
      if (!config.defaultMinutes) config.defaultMinutes = 5;
      if (!config.pollingMs) config.pollingMs = 5 * 1000;

      function setNotification() {
         if (updating.get()) {
            notification.innerHTML = config.messageBuilder ?
                config.messageBuilder(minutes.get()) :
                "<strong>This site is scheduled for maintenance and will restart in " + minutes.get() + " minutes. Please save your work and log out.</strong>";
         } else notification.innerHTML = "";
      }

      var notification = YAHOO.util.Dom.get(config.id);
      var updating = new Forza.Util.Switch(false);
      updating.onChange = setNotification;
      var minutes = new Forza.Util.Switch(config.defaultMinutes);
      minutes.onChange = setNotification;

      Forza.Util.startAjaxPolling(config.url, config.params, "POST", function (o) {
         var response = YAHOO.lang.JSON.parse(o.responseText);
         if (!response.success) return;
         updating.set(response.data[config.updatingField]);
         minutes.set(response.data[config.minutesField]);
      }, function (o) { }, config.pollingMs);
   }

   // Deprecated: Prefiérase el uso del SelectMultiple en forza-jquery.js
   Forza.UI.SelectMultiple = function (config) {
      if (!config) return;
      if (!config.id) return;
      if (!config.filterDelay) config.filterDelay = 300;
      if (!config.maxItems) config.maxItems = 50;
      var filterCont = Dom.get(config.id);
      var chks = Selector.query(".chks", filterCont, true);
      var selAll = Selector.query(".app_slctAllChks", filterCont, true);
      var selNone = Selector.query(".app_unSlctAllChks", filterCont, true);
      var noneElements = Selector.query(".app_noneElements", filterCont, true);
      var groups = Selector.query(".chkgroup", filterCont);
      var chkLabels = Selector.query(".chk-label", chks);
      var maxItemsDiv = Selector.query(".toomany_selected", filterCont, true);
      var to;
      var firstRun = true;
      var textFilter = Selector.query(".text-filter", filterCont, true);
      var divs = {};
      var checksSelectedCont = 0;
      for (var i = 0; i < chkLabels.length; ++i) divs[chkLabels[i].getAttribute("idx")] = chkLabels[i].parentNode;

      if (textFilter) {
         if (!config.emptyText) config.emptyText = "Filter the list here.";

         function setEmptyText() {
            Dom.addClass(textFilter, "empty-text");
            textFilter.value = config.emptyText;
         }

         var filtering = new Forza.Util.Switch(false);

         filtering.onChange = function() {
            if (filtering.get()) {
               textFilter.value = "";
               Dom.removeClass(textFilter, "empty-text");
            } else setEmptyText();
         };

         setEmptyText();

         function checkGroupElements() {
            for (var i = 0; i < groups.length; i++) {
               var group = groups[i].parentNode;
               var elementsHideCont = Selector.query(".chk-filter", group);
               var elementsCont = Selector.query(".chk-option", group);
               if (elementsHideCont.length == elementsCont.length) {
                  group.style.display = "none";
               } else {
                  group.style.display = "";
               }
            }
         }

         function listener(e) {
            if (to) clearTimeout(to);
            var f = Forza.UI.escapeString(textFilter.value.toLowerCase());
            to = setTimeout(function (e) {
               for (var i = 0; i < chkLabels.length; ++i) {
                  var div = divs[chkLabels[i].getAttribute("idx")];
                  if (Forza.UI.escapeString(chkLabels[i].innerHTML.toLowerCase()).contains(f)) Dom.removeClass(div, "chk-filter");
                  else Dom.addClass(div, "chk-filter");
               }
               if (groups !== null)
                  checkGroupElements();
            }, config.filterDelay);
         }

         Event.on(textFilter, "keydown", function (e) { if (Event.getCharCode(e) == "13") Event.preventDefault(e); });
         Event.on(textFilter, "keyup", listener);
         Event.on(textFilter, "paste", listener);
         Event.on(textFilter, "focus", function (e) {
            filtering.set(true);
            if (groups !== null) {
               for (var j = 0; j < expanders.length; j++)
                  expandTree(expanders[j]);
            }
         });
         Event.on(textFilter, "blur", function (e) { if (textFilter.value == "") filtering.set(false); });
      }

      var checkboxes = Selector.query(".chk", chks);
      var checkboxesChecked = Selector.query(".chk:checked", chks);
      var indexedChks = {};
      for (var i = 0; i < checkboxes.length; ++i) indexedChks[checkboxes[i].getAttribute("idx")] = checkboxes[i];
      var removers = Selector.query(".removers", filterCont, true);
      var rmvers = Selector.query(".rmver a", removers);

      if (config.saveIndexer) {
         var indexedRmvers = {};
         for (var i = 0; i < rmvers.length; ++i) indexedRmvers[rmvers[i].getAttribute("idx")] = rmvers[i];
         this.indexedRemovers = indexedRmvers;
      }
      var rmversCont = {};
      for (var i = 0; i < rmvers.length; ++i) rmversCont[rmvers[i].getAttribute("idx")] = rmvers[i].parentNode;

      function select(self) {
         var idx = self.getAttribute("idx");
         if (self.checked) {
            Dom.addClass(rmversCont[idx], "rmver-show");
            if (config.onSelect && config.passIdx && !firstRun)
               config.onSelect(idx);
            else if (config.onSelect && !firstRun)
               config.onSelect();
            Dom.setStyle(noneElements, "display", "none");
            checksSelectedCont++;
            maxItemsDiv.style.display = "none";
         } else {
            var panel = Selector.query(".removers", filterCont, true);
            if (window.getComputedStyle(panel, null).getPropertyValue("display") != 'none')
               unselect(Selector.query("a[idx='" + idx + "']", filterCont, true));
         }

         if (groups !== null) {
            var gchk = Selector.query(".chkgroup", self.parentNode.parentNode, true);
            if (!gchk == false) {
               if (self.checked) {
                  if (Selector.query("input[class=chk]:checked", self.parentNode.parentNode).length == Selector.query(".chk", self.parentNode.parentNode).length)
                     gchk.checked = true;
               } else
                  gchk.checked = false;
            }
         }
      }

      for (var i = 0; i < checkboxesChecked.length; ++i) select(checkboxesChecked[i]);

      Event.on(checkboxes, "click", function (e) {
         var self = this;
         if (checksSelectedCont >= config.maxItems && self.checked) {
            maxItemsDiv.style.display = "";
            setTimeout(function (e) {
               maxItemsDiv.style.display = "none";
            }, 1000);
            e.preventDefault();
         } else {
            if (checksSelectedCont >= config.maxItems && !self.checked) {
               checksSelectedCont--;
               maxItemsDiv.style.display = "none";
            } else if (checksSelectedCont < config.maxItems && !self.checked)
               checksSelectedCont--;
         }

         setTimeout(function (e) {
            select(self);
         }, 0);
      });


      function unselect(self) {
         Dom.removeClass(self.parentNode, "rmver-show");
         var idx = self.getAttribute("idx");
         indexedChks[idx].checked = false;
         if (config.onUnselect && config.passIdx && !firstRun)
            config.onUnselect(idx);
         else if (config.onUnselect && !firstRun) {
            if (config.filter)
               config.onUnselect(self);
            else
               config.onUnselect();
         }
         var count = Selector.query(".rmver-show", filterCont);
         if (count.length == 0) {
            Dom.setStyle(noneElements, "display", "");
         }
      }

      Event.on(rmvers, "click", function (e) {
         var self = this;
         setTimeout(function (e) {
            unselect(self);
         }, 0);
      });

      firstRun = false;

      Event.on(selAll, "click", function (e) {
         var length = checkboxes.length;
         if (checkboxes.length > config.maxItems)
            length = config.maxItems;
         for (var i = 0; i < length; i++) {
            if (!checkboxes[i].checked && !Dom.hasClass(checkboxes[i].parentNode, "chk-filter"))
               checkboxes[i].click();
         }

         return false;
      });

      Event.on(selNone, "click", function (e) {
         for (var h = 0; h < rmvers.length; h++) {
            unselect(rmvers[h]);
         }
         for (var j = 0; j < groups.length; j++) {
            groups[j].checked = false;
         }
         Dom.setStyle(noneElements, "display", "");
         checksSelectedCont = 0;
         return false;
      });

      if (groups !== null) {

         Event.on(groups, "click", function (e) {
            var self = this;
            var chkse = Selector.query(".chk", self.parentNode);

            for (var j = 0; j < chkse.length; j++) {
               var label = $("label[for='" + chkse[j].id +"']").text().toLowerCase();
               if (Dom.hasClass(textFilter, "empty-text")) {
                  if (self.checked && !chkse[j].checked)
                     chkse[j].click();
                  else if (!self.checked && chkse[j].checked)
                     chkse[j].click();
               }
               else if (label.indexOf(textFilter.value.toLowerCase()) != -1) {
                  if (self.checked && !chkse[j].checked)
                     chkse[j].click();
                  else if (!self.checked && chkse[j].checked)
                     chkse[j].click();
               }
            }
         });

         function expandTree(self) {
            var options = Selector.query(".chk-option", self.parentNode);
            for (var j = 0; j < options.length; j++) {
               if (Dom.hasClass(options[j], "chk-hdn")) {
                  Dom.removeClass(options[j], "chk-hdn");
                  Dom.removeClass(self, "app_expandtree");
                  Dom.addClass(self, "app_collapsetree");
               } else {
                  Dom.addClass(options[j], "chk-hdn");
                  Dom.removeClass(self, "app_collapsetree");
                  Dom.addClass(self, "app_expandtree");
               }
            }
         }

         var expanders = Selector.query(".app_expandtree", filterCont);

         Event.on(expanders, "click", function (e) {
            var self = this;
            expandTree(self);
         });
      }

   }

   if (window.YAHOO && YAHOO.widget && YAHOO.widget.Overlay) {
      Forza.UI.Overlay = function (toggler, config) {
         var _toggler = Dom.get(toggler);

         Forza.UI.Overlay.superclass.constructor.call(this, "overlay" + Forza.UI.Overlay.instances, {
            context: [_toggler, "tl", "bl", ["beforeShow", "windowResize"]],
            visible: false,
            width: config.width || "200px",
            appendtodocumentbody: true
         });

         Forza.UI.Overlay.instances++;
         this.setBody(config.body);
         this.render(document.body);
         var self = this;
         Event.on(this.element, "mousedown", Event.stopPropagation);

         function listener(e) {
            self.hide();
         }

         function keyListener(e) {
            if (Event.getCharCode(e) == 27) { // Escape
               listener(e);
            }
         }

         this.hideEvent.subscribe(function (t, a, o) {
            Event.removeListener(document, "mousedown", listener);
            Event.removeListener(document, "keydown", keyListener);
         });

         this.showEvent.subscribe(function (t, a, o) {
            setTimeout(function (e) {
               Event.on(document, "mousedown", listener);
               Event.on(document, "keydown", keyListener);
            }, 0);
         });

         Event.on(_toggler, "mousedown", function (e) {
            if (!self.cfg.getProperty("visible")) {
               self.show();
            }
         });
      }

      YAHOO.extend(Forza.UI.Overlay, YAHOO.widget.Overlay);
      Forza.UI.Overlay.instances = 0;
   }

   Forza.UI.SimpleOverlay = function (config) {
      if (config == null || config.opener == null || config.overlay == null) return;
      var opener = Dom.get(config.opener);
      if (opener == null) return;
      var overlay = Dom.get(config.overlay);
      if (overlay == null) return;
      var doc = document;
      var event = "mousedown";
      var keyEvent = "keydown";
      var open = false;

      function keyListener(e) {
         if (Event.getCharCode(e) == 27) {
            closeListener(e);
         }
      }

      function openListener(e) {
         if (open) return;
         if (config.onopen && config.onopen(e) === false) return false;
         Event.removeListener(opener, event, openListener);
         Dom.setStyle(overlay, "visibility", "visible");

         setTimeout(function (e) {
            Event.on(doc, event, closeListener);
            Event.on(doc, keyEvent, keyListener);
            if (config.afteropen) config.afteropen();
         }, 0);

         open = true;
      }

      function closeListener(e) {
         if (!open) return;
         if (config.onclose && config.onclose(e) === false) return false;
         Event.removeListener(doc, event, closeListener);
         Event.removeListener(doc, keyEvent, keyListener);
         Dom.setStyle(overlay, "visibility", "hidden");

         setTimeout(function (e) {
            Event.on(opener, event, openListener);
            if (config.afterclose) config.afterclose();
         }, 0);

         open = false;
      }

      Event.on(overlay, event, Event.stopPropagation);
      Event.on(opener, event, openListener);

      if (config.closer != null) {
         var closer = Dom.get(config.closer);
         if (closer != null) Event.on(closer, event, closeListener);
      }

      this.closeListener = closeListener;
      this.openListener = openListener;
   }

   Forza.UI.SimpleOverlay.prototype = {
      close: function () {
         this.closeListener();
      },

      open: function () {
         this.openListener();
      }
   }

   // Deprecated: Prefiérase el uso de BulkSelector de forza-jquery.js
   Forza.UI.BulkSelector = function (config) {
      this.ids = config.els;
      var selector = null;
      if (config.selector) selector = Dom.get(config.selector);
      var bulkSel = this;

      Event.on(this.ids, "click", function (e) {
         if (selector && !this.checked) selector.checked = false;
         if (this.checked) ++bulkSel.counter;
         else --bulkSel.counter;

         setTimeout(function (e) {
            if (config.afterclick) config.afterclick();
         }, 0);
      });

      if (selector) {
         Event.on(selector, "click", function (e) {
            var checked = this.checked;

            setTimeout(function (e) {
               bulkSel.select(checked);
            });
         });
      }

      if (config.selAll) {
         Event.on(config.selAll, "click", function (e) { bulkSel.select(true) });
      }

      if (config.selNone) {
         Event.on(config.selNone, "click", function (e) { bulkSel.select(false) });
      }

      this.counter = 0;
      for (var i = 0; i < this.ids.length; ++i) if (this.ids[i].checked) ++this.counter;
   }

   // Deprecated: forza-jquery.js
   Forza.UI.BulkSelector.prototype = {
      select: function (checked) {
         var i = 0;
         var self = this;

         function _select() {
            setTimeout(function (e) {
               var j = 0;

               for (; i < self.ids.length; ++i) {
                  if (j > 300) {
                     _select();
                     break;
                  }

                  if (self.ids[i].checked != checked) {
                     self.ids[i].click();
                     ++j;
                  }
               }
            }, 0);
         }

         _select();
      }
   }

   Forza.UI.StandardSelector = function (config) {
      var rows = config.rows;
      var self = this;
      var afterselect = config.afterselect;
      var afterunselect = config.afterunselect;
      this.idxAtt = config.idxAtt;

      function condAfterSelect(conf) {
         if (afterselect) afterselect(conf);
      }

      function condAfterUnselect(conf) {
         if (afterunselect) afterunselect(conf);
      }

      this.selectedRows = [];
      this.cursoredRow = null;
      var dragSelection = false;

      Event.on(document, "mouseup", function (e) {
         Event.removeListener(document, "selectstart", selectStartHandler);
         dragSelection = false;
      });

      function selectRange(tr, lastCursored) {
         var bounds = [tr];
         if (lastCursored == null) bounds.push(tr);
         else bounds.push(lastCursored);
         var select = false;

         for (var i = 0; i < rows.length; ++i) {
            var row = rows[i];

            if (!select && Forza.Util.arrayContains(bounds, row)) {
               select = true;
               Forza.Util.arrayRemove(bounds, row);
            }

            if (select && self.rowSelect(row)) {
               condAfterSelect({ row: row });
            }

            if (select && Forza.Util.arrayContains(bounds, row)) {
               break;
            }
         }

         self.cursoredRow = lastCursored;
      }

      function unselect(ctrl, row) {
         if (!ctrl) {
            var copy = Forza.Util.arrayCopy(self.selectedRows);

            for (var i = 0; i < copy.length; ++i) {
               var selectedRow = copy[i];

               if (selectedRow != row) {
                  if (self.rowUnselect(selectedRow)) {
                     condAfterUnselect({ row: selectedRow });
                  }
               }
            }
         }
      }

      function selectStartHandler(e) { return false; }

      function trMousedownListener(e) {
         if (e.ctrlKey || e.shiftKey || config.supressAlt || e.altKey) {
            Event.on(document, "selectstart", selectStartHandler);
            Event.preventDefault(e);
         }

         if (e.altKey || config.supressAlt) {
            dragSelection = true;
         }

         var lastCursored = self.cursoredRow;
         unselect(e.ctrlKey, this);

         if (e.shiftKey) {
            selectRange(this, lastCursored);
         } else {
            if (self.rowSelect(this)) {
               condAfterSelect({ row: this });
            } else {
               if (e.ctrlKey) {
                  self.rowUnselect(this);
                  condAfterUnselect({ row: this });
               }
            }
         }
      }

      Event.on(rows, "mousedown", trMousedownListener);

      Event.on(rows, "mouseover", function (e) {
         if (!dragSelection) return;
         var lastCursored = self.cursoredRow;
         unselect(e.ctrlKey, this);
         selectRange(this, lastCursored);
      });

      if (this.idxAtt) {
         this.selectedRowsIdx = [];

         this.isRowSelected = function (tr) {
            return this.selectedRowsIdx[parseInt(tr.getAttribute(this.idxAtt))];
         }
      } else {
         this.isRowSelected = function (tr) {
            return Forza.Util.arrayContains(this.selectedRows, tr);
         }
      }
   }

   Forza.UI.StandardSelector.prototype = {
      rowSelect: function (tr) {
         this.cursoredRow = tr;
         if (this.isRowSelected(tr)) return false;
         Dom.addClass(tr, Forza.UI.StandardSelector.className);
         this.selectedRows.push(tr);
         if (this.idxAtt) this.selectedRowsIdx[tr.getAttribute(this.idxAtt)] = tr;
         return true;
      },

      rowUnselect: function (tr) {
         this.cursoredRow = tr;
         if (!this.isRowSelected(tr)) return false;
         Dom.removeClass(tr, Forza.UI.StandardSelector.className);
         Forza.Util.arrayRemove(this.selectedRows, tr);
         if (this.idxAtt) delete this.selectedRowsIdx[tr.getAttribute(this.idxAtt)];
         return true;
      }
   }

   Forza.UI.StandardSelector.className = "selected";

   Forza.UI.DateField = function (id, config) {
      var el = Dom.get(id);
      var togglerEl = Selector.query('*[class~="date-toggler"]', el, true);
      this.textEl = Selector.query('input[type="text"][class~="date-text"]', el, true);
      var span = Selector.query('span[class~="date-display"]', el, true);

      if (span) {
         this.display = span;
      }

      var renderEl;

      if (config) {
         var nextEl = config.nextEl;

         if (typeof (nextEl) != "undefined") {
            this.nextEl = Dom.get(nextEl);
            Event.on(this.textEl, "keydown", this.onKeyDown, this, true);
         }

         renderEl = config.renderEl;
      }

      var overlay = new YAHOO.widget.Overlay("dateFieldOverlay" + Forza.UI.DateField.instances, {
         context: [this.textEl, "tl", "bl", ["beforeShow", "windowResize"]],
         visible: false,
         width: "173px",
         appendtodocumentbody: true
      });

      var calendarId = "dateFieldCal" + Forza.UI.DateField.instances;
      overlay.setBody('<div id="' + calendarId + '"></div>');
      overlay.render(renderEl || document.body);
      Event.on(overlay.element, "mousedown", Event.stopPropagation);
      var calendarEl = Dom.get(calendarId);
      this.calendar = new YAHOO.widget.Calendar(calendarEl, { navigator: true });
      this.calendar.render();
      var self = this;
      this.textFocused = false;
      this.trySetDate();
      this.dontHide = false;

      Event.on(togglerEl, "mousedown", function (e) {
         if (overlay.cfg.getProperty("visible")) {
            self.hideCalendar();
         } else {
            self.showCalendar();
         }
      });

      this.calendar.selectEvent.subscribe(function (t, a, o) {
         var date = self.calendar.getSelectedDates()[0];
         self.textEl.value = date.toDDMMYYYYString();
         self.unsetEmpty();

         if (self.display) {
            self.display.innerHTML = date.toLongDateString();
         }

         if (!self.dontHide) {
            self.hideCalendar();
         }
      });

      Event.on(this.textEl, "focus", function (e) {
         this.select();
         self.textFocused = true;
         self.unsetEmpty();
      });

      Event.on(this.textEl, "blur", function (e) {
         self.textFocused = false;

         setTimeout(function (e) {
            self.trySetDate();
         }, 0);
      });

      this.togglerEl = togglerEl;
      this.overlay = overlay;
      this.el = el;
      if (config && config.hiders) this.hiders = config.hiders;
      Forza.UI.DateField.instances++;
   }

   Forza.UI.DateField.emptyText = "dd/mm/yyyy";

   Forza.UI.DateField.prototype = {
      onKeyDown: function (e) {
         var charCode = Event.getCharCode(e);
         var self = this;

         if (charCode == 9) {
            Event.preventDefault(e);
            self.nextEl.focus();
         }
      },

      trySetDate: function () {
         var date = Date.fromString(this.textEl.value);

         if (date == "Invalid Date" || isNaN(date)) {
            this.setEmpty();
         } else {
            var dates = this.setDate(date);

            if (dates.length == 0) {
               this.setEmpty();
            } else {
               this.unsetEmpty();
            }
         }
      },

      setDate: function (date) {
         if (this.display) {
            this.display.innerHTML = date.toLongDateString();
         }

         this.calendar.deselect(this.calendar.getSelectedDates()[0]);
         this.dontHide = true;
         var dates = this.calendar.select(date);
         this.dontHide = false;
         this.calendar.cfg.setProperty("pagedate", date);
         this.calendar.render();
         return dates;
      },

      setEmpty: function () {
         if (this.display) {
            this.display.innerHTML = "";
         }

         if (this.textFocused) {
            this.textEl.value = "";
         } else {
            Dom.addClass(this.textEl, "no-date");
            this.textEl.value = Forza.UI.DateField.emptyText;
         }
      },

      unsetEmpty: function () {
         if (this.textEl.value == Forza.UI.DateField.emptyText) {
            this.textEl.value = "";
         }

         Dom.removeClass(this.textEl, "no-date");
      },

      onDocKeyDown: function (e) {
         if (Event.getCharCode(e) == 27) { // Escape
            this.hideCalendar();
         }
      },

      showCalendar: function () {
         this.overlay.cfg.setProperty("visible", true);
         var self = this;

         // Si no fuera por el setTimeout(f, 0) el calendario se esconder�a inmediatamente.
         setTimeout(function (e) {
            Event.on(document, "mousedown", self.hideCalendar, self, true);
            if (self.hiders) Event.on(self.hiders, "mousedown", self.hideCalendar, self, true);
            Event.on(document, "keydown", self.onDocKeyDown, self, true);
         }, 0);
      },

      hideCalendar: function () {
         this.overlay.cfg.setProperty("visible", false);
         Event.removeListener(document, "mousedown", this.hideCalendar);
         if (this.hiders) Event.removeListener(this.hiders, "mousedown", this.hideCalendar);
         Event.removeListener(document, "keydown", this.onDocKeyDown);
      }
   }

   Forza.UI.DateField.instances = 0;

   Forza.UI.SeasonField = function (id, config) {
      var el = Dom.get(id);
      var togglerEl = [];
      this.textEl = [];
      togglerEl[0] = Selector.query('*[class~="date-toggler-start"]', el, true);
      this.textEl[0] = Selector.query('input[type="text"][class~="date-text-start"]', el, true);
      togglerEl[1] = Selector.query('*[class~="date-toggler-end"]', el, true);
      this.textEl[1] = Selector.query('input[type="text"][class~="date-text-end"]', el, true);
      this.emptyString = [];
      this.display = [];
      var span1 = Selector.query('span[class~="date-display-start"]', el, true);

      if (span1) {
         this.display[0] = span1;
      }

      var span2 = Selector.query('span[class~="date-display-end"]', el, true);

      if (span2) {
         this.display[1] = span2;
      }

      var renderEl;

      if (config) {
         renderEl = config.renderEl;
         if (config.idLang != 1 || typeof (config.idLang) == "undefined") {
            this.emptyString[0] = Forza.UI.SeasonField.emptyTextEs;
         } else {
            this.emptyString[0] = Forza.UI.SeasonField.emptyTextEn;
         }

        if (typeof (config.endEmptyString) != "undefined") {
            this.emptyString[1] = config.endEmptyString;
         } else {
            if (config.idLang != 1 || typeof(config.idLang)== "undefined") {
               this.emptyString[1] = Forza.UI.SeasonField.emptyTextEs;
            } else {
               this.emptyString[1] = Forza.UI.SeasonField.emptyTextEn;
            }
         }            

         var nextEl = config.nextEl;

         if (typeof (nextEl) != "undefined") {
            this.nextEl = Dom.get(nextEl);
            Event.on(this.textEl[1], "keydown", this.onKeyDown, this, true);
         }
      } else {
         this.emptyString[0] = Forza.UI.SeasonField.emptyText;
         this.emptyString[1] = Forza.UI.SeasonField.emptyText;
      }

      if (!config) config = {};
      if (!config.specCfg) config.specCfg = {};
      config.specCfg.navigator = true;
      var overlay = [];
      if (!config.overlayWidth) config.overlayWidth = 173;
      var overlayWidth = config.overlayWidth + "px";

      overlay[0] = new YAHOO.widget.Overlay("sSeasonFieldOverlay" + Forza.UI.SeasonField.instances, {
         context: [this.textEl[0], "tl", "bl", ["beforeShow", "windowResize"]],
         visible: false,
         width: overlayWidth,
         appendtodocumentbody: true
      });

      overlay[1] = new YAHOO.widget.Overlay("eSeasonFieldOverlay" + Forza.UI.SeasonField.instances, {
         context: [this.textEl[1], "tl", "bl", ["beforeShow", "windowResize"]],
         visible: false,
         width: overlayWidth,
         appendtodocumentbody: true
      });

      var sCalendarId = "sSeasonFieldCal" + Forza.UI.SeasonField.instances;
      var eCalendarId = "eSeasonFieldCal" + Forza.UI.SeasonField.instances;
      overlay[0].setBody('<div id="' + sCalendarId + '"></div>');
      var sCloseId;

      if (config.closeLink) {
         sCloseId = "sSeasonFieldClose" + Forza.UI.SeasonField.instances;
         var title = "";
         if (config.titleStart) title = "<strong>" + config.titleStart + "</strong>";
         overlay[0].setHeader('<div>' + title + '<a href="#" onclick="return false;" id="' + sCloseId + '">' + config.closeLink + '</a></div>');
      }

      overlay[1].setBody('<div id="' + eCalendarId + '"></div>');
      var eCloseId;

      if (config.closeLink) {
         eCloseId = "eSeasonFieldClose" + Forza.UI.SeasonField.instances;
         var title = "";
         if (config.titleEnd) title = "<strong>" + config.titleEnd + "</strong>";
         overlay[1].setHeader('<div>' + title + '<a href="#" onclick="return false;" id="' + eCloseId + '">' + config.closeLink + '</a></div>');
      }

      overlay[0].render(renderEl || document.body);
      overlay[1].render(renderEl || document.body);
      Event.on([overlay[0].element, overlay[1].element], "mousedown", Event.stopPropagation);
      var sCalendarEl = Dom.get(sCalendarId);
      var eCalendarEl = Dom.get(eCalendarId);
      var self = this;
      if (config.closeLink) {
         this.closeLink = [];
         this.closeLink[0] = Dom.get(sCloseId);
         this.closeLink[1] = Dom.get(eCloseId);
         Event.on(this.closeLink[0], "click", function () { self.trySetDate(0); self.hideCalendar(0); });
         Event.on(this.closeLink[1], "click", function () { self.trySetDate(1); self.hideCalendar(1); });
      }
      this.calendar = [];
      this.calendar[0] = config.group ? new YAHOO.widget.CalendarGroup(sCalendarEl, config.specCfg) : new YAHOO.widget.Calendar(sCalendarEl, config.specCfg);
      this.calendar[1] = config.group ? new YAHOO.widget.CalendarGroup(eCalendarEl, config.specCfg) : new YAHOO.widget.Calendar(eCalendarEl, config.specCfg);
      this.dates = [];
      this.dontRender = true;
      this.textFocused = [false, false];
      if (config.onSelectStart) this.onSelect(0, config.onSelectStart);
      if (config.onSelectEnd) this.onSelect(1, config.onSelectEnd);
      this.trySetDate(0);
      this.trySetDate(1);
      this.dontRender = false;
      self.calendar[0].render();
      self.calendar[1].render();
      this.dontHide = false;

      function onTogglerMousedown(e) {
         if (overlay[this].cfg.getProperty("visible")) {
            self.hideCalendar(this);
         } else {
            self.showCalendar(this);
         }
      }

      Event.on(togglerEl[0], "mousedown", onTogglerMousedown, 0, true);
      Event.on(togglerEl[1], "mousedown", onTogglerMousedown, 1, true);

      if (config.textboxToggle) {
         Event.on(this.textEl[0], "mousedown", function (e) {
            if (overlay[1].cfg.getProperty("visible")) self.hideCalendar(1);
            if (!overlay[0].cfg.getProperty("visible")) self.showCalendar(0);
            Event.stopPropagation(e);
         });

         Event.on(this.textEl[1], "mousedown", function (e) {
            if (overlay[0].cfg.getProperty("visible")) self.hideCalendar(0);
            if (!overlay[1].cfg.getProperty("visible")) self.showCalendar(1);
            Event.stopPropagation(e);
         });
      }

      this.userSelect = true;

      function onSelect(t, a, o) {
         if (self.userSelect) {
            var i = this;
            self.userSelect = false;
            if (!self.dontHide) {
               self.hideCalendar(i);
            }
            var idLang = window.idLanguage;
            var date = new Date(a[0][0][0], a[0][0][1] - 1, a[0][0][2]);
            if (idLang != 1 || typeof (idLang) == "undefined") {
               self.textEl[i].value = date.toDDMMYYYYString();
            } else {
               self.textEl[i].value = date.toMMDDYYYYString();
            }
            self.unsetEmpty(i);

            setTimeout(function (e) {
               self.setDate(i, date);
               self.userSelect = true;
            }, 0);
         }
      }

      this.calendar[0].selectEvent.subscribe(onSelect, 0, true);
      this.calendar[1].selectEvent.subscribe(onSelect, 1, true);

      function textElFocus(e) {
         self.textFocused[this.i] = true;
         this.el.select();
         self.unsetEmpty(this.i);
      }

      Event.on(this.textEl[0], "focus", textElFocus, { el: this.textEl[0], i: 0 }, true);
      Event.on(this.textEl[1], "focus", textElFocus, { el: this.textEl[1], i: 1 }, true);

      function textElBlur(e) {
         var i = this;
         self.textFocused[i] = false;

         setTimeout(function (e) {
            if (!overlay[i].cfg.getProperty("visible")) self.trySetDate(i);
         }, 0);
      }

      Event.on(this.textEl[0], "blur", textElBlur, 0, true);
      Event.on(this.textEl[1], "blur", textElBlur, 1, true);
      this.togglerEl = togglerEl;
      this.overlay = overlay;
      this.el = el;
      Forza.UI.SeasonField.instances++;
   }

   Forza.UI.SeasonField.emptyText = "dd/mm/yyyy";
   Forza.UI.SeasonField.emptyTextEs = "dd/mm/yyyy";
   Forza.UI.SeasonField.emptyTextEn = "mm/dd/yyyy";	 

   Forza.UI.SeasonField.prototype = {
      onKeyDown: function (e) {
         var charCode = Event.getCharCode(e);
         var self = this;

         if (charCode == 9) {
            Event.preventDefault(e);
            self.nextEl.focus();
         }
      },

      trySetDate: function (i) {
         var date = Date.fromString(this.textEl[i].value);

         if (date == "Invalid Date" || isNaN(date)) {
            this.setEmpty(i);
         } else {
            var dates = this.setDate(i, date);

            if (dates.length == 0) {
               this.setEmpty(i);
            } else {
               this.unsetEmpty(i);
            }
         }
      },

      setDate: function (i, date) {
         if (i == 0) {
            this.calendar[1].cfg.setProperty("mindate", date);
            this.calendar[1].cfg.setProperty("pagedate", date);

            if (typeof (this.dates[1]) != "undefined" && date > this.dates[1]) {
               this.setEmpty(1);
               delete this.dates[1];
            }
         }

         if (this.display[i]) {
            this.display[i].innerHTML = date.toLongDateString();
         }

         this.dates[i] = date;
         this.dontHide = true;
         this.calendar[i].deselectAll();
         var dates = this.calendar[i].select(date);
         var selDates = [];
         if (typeof (this.dates[0]) != "undefined") selDates.push(this.dates[0]);
         if (typeof (this.dates[1]) != "undefined") selDates.push(this.dates[1]);
         this.calendar[0].deselectAll();
         this.calendar[0].select(selDates);
         this.calendar[1].deselectAll();
         this.calendar[1].select(selDates);
         this.dontHide = false;
         this.calendar[i].cfg.setProperty("pagedate", date);

         if (!this.dontRender) {
            this.calendar[0].render();
            this.calendar[1].render();
         }

         return dates;
      },

      setEmpty: function (i) {
         if (this.display[i]) {
            this.display[i].innerHTML = "";
         }

         if (this.textFocused[i]) {
            this.textEl[i].value = "";
         } else {
            Dom.addClass(this.textEl[i], "no-date");
            this.textEl[i].value = this.emptyString[i];
         }
      },

      unsetEmpty: function (i) {
         if (this.textEl[i].value == this.emptyString[i]) {
            this.textEl[i].value = "";
         }

         Dom.removeClass(this.textEl[i], "no-date");
      },

      onDocMousedown: function (e) {
         this.self.hideCalendar(this.i)
      },

      onDocKeydown: function (e) {
         if (Event.getCharCode(e) == 27) { // Escape
            this.self.hideCalendar(this.i);
         }
      },

      showCalendar: function (i) {
         this.overlay[i].cfg.setProperty("visible", true);
         var self = this;

         // Si no fuera por el setTimeout(f, 0) el calendario se esconder�a inmediatamente.
         setTimeout(function (e) {
            var scope = { self: self, i: i };
            Event.on(document, "mousedown", self.onDocMousedown, scope, true);
            Event.on(document, "keydown", self.onDocKeydown, scope, true);
         }, 0);
      },

      hideCalendar: function (i) {
         this.overlay[i].cfg.setProperty("visible", false);
         Event.removeListener(document, "mousedown", this.onDocMousedown);
         Event.removeListener(document, "keydown", this.onDocKeydown);
      },

      onSelect: function (i, f) {
         var self = this;
         this.calendar[i].selectEvent.subscribe(function (t, a, o) {
            f({ date: new Date(a[0][0][0], a[0][0][1] - 1, a[0][0][2]) });
         }, i, true);
      }

   }

   Forza.UI.SeasonField.instances = 0;

   Forza.UI.KeyBinder = function (config) {
      this.listeners = [];
      this.overlays = [];
      var self = this;

      for (var i in config) {
         if (YAHOO.lang.hasOwnProperty(config, i)) {
            (function () {
               var el = Dom.get(config[i][0]);

               if (!el) {
                  return;
               }

               var charCode = config[i][1].charCodeAt(0);
               var action = config[i][2];
               var listener;

               if (typeof (action) == "function") {
                  listener = function (t, a, o) {
                     Event.stopEvent(a[1]);

                     setTimeout(function (e) {
                        self.disable();

                        setTimeout(function (e) {
                           action(t, a, o);
                        }, 0);
                     }, 0);
                  }
               }

               if (typeof (action) == "undefined" || action == "click") {
                  if (el.tagName == "A") {
                     listener = function (t, a, o) {
                        Event.stopEvent(a[1]);
                        window.location = el.getAttribute("href");

                        setTimeout(function (e) {
                           self.disable();
                        }, 0);
                     }
                  } else {
                     listener = function (t, a, o) {
                        Event.stopEvent(a[1]);
                        el.click();

                        setTimeout(function (e) {
                           self.disable();
                        }, 0);
                     }
                  }
               }

               if (action == "focus") {
                  listener = function (t, a, o) {
                     Event.stopEvent(a[1]);

                     setTimeout(function (e) {
                        el.focus();
                        self.disable();
                     }, 0);
                  }
               }

               self.listeners.push(new YAHOO.util.KeyListener(document, { keys: charCode }, listener));

               var overlay = new YAHOO.widget.Overlay("keyBindOver" + Forza.UI.KeyBinder.instances + "_" + i, {
                  context: [el, "bl", "bl", ["beforeShow", "windowResize"]],
                  visible: false,
                  width: "17px",
                  appendtodocumentbody: true
               });

               overlay.setBody(config[i][1]);
               Dom.addClass(overlay.element, "shortcut");
               Dom.setStyle(overlay.element, "opacity", 0.8);
               overlay.render(document.body);
               self.overlays.push(overlay);
            })();
         }
      }

      this.enabled = false;

      var kl = new YAHOO.util.KeyListener(document, { ctrl: true, keys: 188 }, function (e) {
         Event.stopEvent(e);

         if (self.enabled) {
            self.disable();
         } else {
            self.enable();
         }
      });

      kl.enable();
      Forza.UI.KeyBinder.instances++;
   }

   Forza.UI.KeyBinder.prototype = {
      onDocKeydown: function (e) {
         if (Event.getCharCode(e) == 27) {
            this.disable();
         }
      },

      onDocMousedown: function (e) {
         this.disable();
      },

      enable: function () {
         var self = this;

         for (var i in this.listeners) {
            if (YAHOO.lang.hasOwnProperty(this.listeners, i)) {
               (function () {
                  var j = i;

                  setTimeout(function (e) {
                     self.overlays[j].show();
                  }, 0);
               })();
            }
         }

         setTimeout(function (e) {
            for (var i in self.listeners) {
               if (YAHOO.lang.hasOwnProperty(self.listeners, i)) {
                  self.listeners[i].enable();
               }
            }

            Event.on(document, "keydown", self.onDocKeydown, self, true);
            Event.on(document, "mousedown", self.onDocMousedown, self, true);
            self.enabled = true;
         }, 0);
      },

      disable: function () {
         var self = this;

         for (var i in this.listeners) {
            if (YAHOO.lang.hasOwnProperty(this.listeners, i)) {
               (function () {
                  var j = i;

                  setTimeout(function (e) {
                     self.overlays[j].hide();
                  }, 0);
               })();
            }
         }

         setTimeout(function (e) {
            for (var i in self.listeners) {
               if (YAHOO.lang.hasOwnProperty(self.listeners, i)) {
                  self.listeners[i].disable();
               }
            }

            Event.removeListener(document, "keydown", self.onDocKeydown);
            Event.removeListener(document, "mousedown", self.onDocMousedown);
            self.enabled = false;
         }, 0);
      }
   };

   Forza.UI.KeyBinder.instances = 0;

   Forza.UI.ToggleField = function (el, config) {
      var container = Dom.get(el);
      this.span = Selector.query('span[class~="toggle-span"]', container, true);
      this.div = Selector.query('div[class~="toggle-div"]', container, true);
      var cancel = Selector.query('a[class~="toggle-cl"]', container, true);
      this.val = Selector.query('input[class~="toggle-fd"]', container, true);
      this.value = this.val.value;
      this.legend = Selector.query('span[class~="toggle-ld"]', container, true);
      this.error = Selector.query('span[class~="field-validation-error"]', container, true);
      if (config) {
         this.displaySpan = config.displaySpan;
         this.displayDiv = config.displayDiv
      } else {
         this.displaySpan = 'block';
         this.displayDiv = 'block';
      }
      Event.on(this.span, 'click', this.toggle, this, true);
      Event.on(cancel, 'click', this.toggle, this, true);
   };

   Forza.UI.ToggleField.prototype = {
      toggle: function (e) {
         if (Dom.getStyle(this.span, 'display') == 'none') {
            this.val.value = this.value;
            if (this.error != null)
               this.error.innerHTML = '';
            Dom.setStyle(this.div, 'display', 'none');
            Dom.setStyle(this.span, 'display', this.displaySpan);
         }
         else {
            Dom.setStyle(this.span, 'display', 'none');
            Dom.setStyle(this.div, 'display', this.displayDiv);
            this.val.select();
         }
      },
      refresh: function (e, newValue) {
         this.value = newValue;
         this.span.innerHTML = this.value + this.legend.innerHTML;
         this.val.value = this.value;
      }
   };

   Forza.UI.GenericToggleField = function (el, config) {
      this.container = Dom.get(el);
      this.span = Selector.query('*[class~="toggle-span"]', this.container, true);
      this.div = Selector.query('div[class~="toggle-div"]', this.container, true);
      this.cancel = Selector.query('a[class~="toggle-cl"]', this.container, true);
      this.error = Selector.query('span[class~="field-validation-error"]', this.container, true);
      this.save = Selector.query('button[class="toggle-sv"]', this.container, true);

      if (config) {
         this.displaySpan = config.displaySpan;
         this.displayDiv = config.displayDiv;
      } else {
         this.displaySpan = 'block';
         this.displayDiv = 'block';
      }

      Event.on(this.span, 'click', this.showEditable, this, true);
      Event.on(this.cancel, 'click', this.hideEditable, this, true);
   };

   Forza.UI.GenericToggleField.prototype = {
      showEditable: function (e) {
         Dom.setStyle(this.span, 'display', 'none');
         Dom.setStyle(this.div, 'display', this.displayDiv);
      },

      hideEditable: function (e) {
         if (this.error != null)
            this.error.innerHTML = '';
         Dom.setStyle(this.div, 'display', 'none');
         Dom.setStyle(this.span, 'display', this.displaySpan);
      },
      
      refresh: function (e, newValue) {
         this.value = newValue;
         this.span.innerHTML = this.value;
         this.hideEditable();
      }
   };

   Forza.UI.DoubleCarousel = function (cfg) {
      if (!cfg) cfg = {};
      if (!cfg.container) return;
      var prevSel = cfg.prevSel || "prevSel";
      var prevNotSel = cfg.prevNotSel || "prevNotSel";
      var nextSel = cfg.nextSel || "nextSel";
      var nextNotSel = cfg.nextNotSel || "nextNotSel";
      var prev = Dom.get(cfg.prev);
      var next = Dom.get(cfg.next);
      var carCfg = { carouselEl: "UL", numVisible: 1, navigation: { prev: cfg.prev, next: cfg.next} };
      var carousel = new YAHOO.widget.Carousel(cfg.container, carCfg);
      carousel.addListener("beforeSelectedItemChange", function () { return false; });

      carousel.addListener("beforeScroll", function (args) {
         return args.dir != "forward" || this.getAttributeConfig("currentPage").value < this.getAttributeConfig("numItems").value - 2;
      });

      var prevSelected = new Forza.Util.Switch(false);
      prevSelected.onChange = function () {
         if (prevSelected.get()) {
            Dom.removeClass(prev, prevNotSel);
            Dom.addClass(prev, prevSel);
         } else {
            Dom.removeClass(prev, prevSel);
            Dom.addClass(prev, prevNotSel);
         }
      };

      var nextSelected = new Forza.Util.Switch(true);
      nextSelected.onChange = function () {
         if (nextSelected.get()) {
            Dom.removeClass(next, nextNotSel);
            Dom.addClass(next, nextSel);
         } else {
            Dom.removeClass(next, nextSel);
            Dom.addClass(next, nextNotSel);
         }
      };

      carousel.addListener("afterScroll", function (args) {
         var page = this.getAttributeConfig("currentPage").value;
         if (page > 0) prevSelected.set(true);
         else prevSelected.set(false);
         if (this.getAttributeConfig("currentPage").value < this.getAttributeConfig("numItems").value - 2) nextSelected.set(true);
         else nextSelected.set(false);
      });

      if (!cfg.selectedItem) cfg.selectedItem = 0;
      var maxIndex = carousel.getAttributeConfig("numItems").value - 2;
      if (cfg.selectedItem > maxIndex) cfg.selectedItem = maxIndex;
      if (cfg.selectedItem < 0) cfg.selectedItem = 0;
      carousel.scrollTo(cfg.selectedItem);
      carousel.set("animation", { speed: cfg.animationSpeed || 0.3 });
      carousel.render();
      carousel.show();
      this.carousel = carousel;
   }

   Forza.UI.SlideShow = function (cfg) {
      if (!cfg) return;
      if (!cfg.list) return;
      var container = $("#" + cfg.container);
      var results = {};
      var checkConfig = false;
      var hash = cfg.hash;

      function setReconfigTimeout() {
         checkConfig = false;

         setTimeout(function (e) {
            checkConfig = true;
         }, cfg.checkConfig * 1000);
      }

      if (cfg.checkConfig && cfg.checkConfigUrl && cfg.checkConfig > 0)
         setReconfigTimeout();

      function loadBuffer(buffer, url) {
         buffer.load(url, function (response, status, xhr) {
            if (status == "success") {
               results[url] = response;
            } else if (results[url]) buffer.html(results[url]);
         });
      }

      var lastNode = null;

      function makeList(list) {
         for (var i = 0; i < list.length; ++i) {
            var el = list[i];

            if (el.list) {
               var times = el.times || 1;
               for (var j = 0; j < times; ++j) makeList(el.list);
            } else if (el.url) {
               var dur = el.duration || 1000;
               var buffer = $('<div class="forza-slideshow-slide forza-slideshow-container" idx="' + el.url + '" dur="' + dur + '"></div>');
               container.append(buffer);
               loadBuffer(buffer, el.url);
               lastNode = buffer[0];
            } else if (el.img) {
               var dur = el.duration || 1000;
               var pictureId = '';
               if (el.pictureId)
                  pictureId = el.pictureId;
               var img = $('<img class="forza-slideshow-slide forza-slideshow-img" src="' + el.img + '" dur="' + dur + '"  pictureId="' + pictureId + '" />');
               container.append(img);
               lastNode = img[0];
            }
         }
      }

      makeList(cfg.list);
      if (!cfg.cycle) cfg.cycle = {};
      cfg.cycle.timeout = 0;
      cfg.cycle.fx = 'fade';//efecto;
      cfg.cycle.speed= 1800;//delay

      cfg.cycle.after = function (currSlideElement, nextSlideElement, options, forwardFlag) {
         var url = currSlideElement.getAttribute("idx");
         var dur = nextSlideElement.getAttribute("dur") || 1000;

         if (checkConfig && nextSlideElement == lastNode) {
            setTimeout(function () {
               $.ajax({
                  url: cfg.checkConfigUrl,
                  dataType: "json",
                  success: function (data) {
                     if (!data.success) {
                        setReconfigTimeout();
                        container.cycle("next");
                        return;
                     }

                     if (hash && data.hash && hash == data.hash) {
                        setReconfigTimeout();
                        container.cycle("next");
                        return;
                     }

                     hash = data.hash;
                     container.cycle("destroy");
                     container.empty();
                     lastNode = null;
                     makeList(data.list);
                     container.cycle(cfg.cycle);
                     setReconfigTimeout();
                  },
                  complete: function (o, status) {
                     if (status != "success") {
                        setReconfigTimeout();
                        container.cycle("next");
                     }
                  }
               });
            }, dur);
         } else {
            setTimeout(function () { container.cycle("next"); }, dur);
         }

         var pictureId = nextSlideElement.getAttribute("pictureId");
         if (pictureId != undefined && (pictureId != null) && (pictureId != '')) {
            if (cfg.onDisplayPicture) {
               cfg.onDisplayPicture(pictureId, dur);
            }
         }

         if (url) {
            var buffer = $(currSlideElement);
            loadBuffer(buffer, url);

            if (cfg.onDisplayPage) {
               cfg.onDisplayPage(url, dur);
            }
         }
      };

      container.cycle(cfg.cycle);
   }

   Forza.UI.SelectTable = function (cfg) {
      var results = YAHOO.util.Dom.get(cfg.id);
      if (!results) return;
      var selCellCss = cfg.selCellCss || "selCell";
      var selCells = Selector.query("." + selCellCss, results);
      if (!cfg.name) return;
      var ids = document.getElementsByName(cfg.name);

      Event.on(selCells, "mousedown", function (e) {
         Event.stopPropagation(e);
      });

      function getCheckbox(row) { return Selector.query('input[type="checkbox"]', row, true); }

      function handleSelect(conf) {
         var chk = getCheckbox(conf.row);
         if (!chk) return;
         return chk.click();
      }

      var rowCss = cfg.rowCss || "row";
      var rows = Selector.query("." + rowCss, results);
      var idxAtt = cfg.idxAtt || "idx";

      var stdSel = new Forza.UI.StandardSelector({
         rows: rows,
         afterselect: handleSelect,
         afterunselect: handleSelect,
         idxAtt: idxAtt,
         supressAlt: cfg.supressAlt
      });

      var i = 0;

      function selectAll() {
         var j = 0;

         for (; i < rows.length; ++i) {
            if (j > 300) {
               setTimeout(function (e) { selectAll() }, 0);
               break;
            }

            var chk = getCheckbox(rows[i]);

            if (chk && chk.checked) {
               stdSel.rowSelect(rows[i]);
            }

            ++j;
         }
      }

      selectAll();

      Event.on(ids, "click", function (e) {
         var tr = Dom.getAncestorByTagName(this, "tr");

         if (this.checked) {
            stdSel.rowSelect(tr);
         } else {
            stdSel.rowUnselect(tr);
         }
      });

      var selAll = cfg.selAll || "selAll";
      var selNone = cfg.selNone || "selNone";
      new Forza.UI.BulkSelector({ selAll: selAll, selNone: selNone, els: ids });
   }

   Forza.UI.Toggler = function (selector, listener) {
      var togglers = Selector.query(selector);
      var selected = null;
      var self = this;

      for (var i = 0; i < togglers.length; ++i) {
         (function () {
            var toggler = togglers[i];
            var tfor = Selector.query(toggler.getAttribute("tfor"));

            Event.on(toggler, "click", function (e) {
               if (this.checked) {
                  if (selected != tfor) {
                     Dom.setStyle(selected, "display", "none");
                     Dom.setStyle(tfor, "display", "");
                     selected = tfor;
                     if (listener) listener.call(self, { action: "showing", showing: true, hiding: false, toggler: this, toggled: tfor });
                  }
               } else {
                  Dom.setStyle(tfor, "display", "none");
                  selected = null;
                  if (listener) listener.call(self, { action: "hiding", showing: false, hiding: true, toggler: this, toggled: tfor });
               }
            });

            if (toggler.checked) {
               selected = tfor;
               Dom.setStyle(tfor, "display", "");
               if (listener) listener.call(self, { action: "showing", showing: true, hiding: false, toggler: toggler, toggled: tfor });
            }
         })();
      }

      this.togglers = togglers;
   }

   Forza.UI.CascadeSelect = function (selector) {
      var els = Selector.query(selector);

      Forza.Util.each(els, function (el) {
         Event.on(el, "change", function (e) {
            var tfor = el.getAttribute("tfor");
            var childs = Selector.query(tfor);
            var self = this;

            Forza.Util.each(childs, function (child) {
               (function () {
                  var xurl = child.getAttribute("xurl");
                  if (!xurl) return;
                  var ch = child;

                  Forza.Util.startAjaxRequest(xurl, { query: self.value }, "POST", function (o) {
                     var results = JSON.parse(o.responseText);
                     ch.options.length = 0;

                     Forza.Util.each(results, function (result) {
                        ch.options[ch.options.length] = new Option(result.text, result.value);
                     });
                  }, function (o) { });
               })();
            });
         });
      });
   }


   Forza.UI.escapeChar = function (c) {
      if (c === null || c === undefined || c.charCodeAt(0) < 224) return c;
      var cc = c.toLowerCase().charCodeAt(0);
      if (cc >= 224 && cc < 231) return 'a';
      if (cc === 231) return 'c';
      if (cc >= 232 && cc < 235) return 'e';
      if (cc >= 236 && cc < 239) return 'i';
      if (cc === 241) return 'n';
      if (cc >= 242 && cc < 246) return 'o';
      if (cc >= 249 && cc < 252) return 'u';
      if (cc === 253) return 'y';
      return c;
   };

   Forza.UI.escapeString = function (s) {
      var a = new Array();
      for (var i = 0; i < s.length; i++) {
         a.push(Forza.UI.escapeChar(s.substring(i, i + 1)));
      }
      return a.join('');
   };

   if (window.Ext) {
      // Deprecated: forza-jquery.js
      var createOverlayIsOpening = [];
      var currentOverlayLink = new Array();

      // Deprecated: forza-jquery.js
      Forza.UI.createOverlay = function (config) {
         if (config == null || config.opener == null || config.overlay == null) return;
         var opener = Ext.get(config.opener);
         if (opener == null) return;
         var overlay = Ext.get(config.overlay);
         if (overlay == null) return;
         var doc = Ext.get(document);
         var closeEvent = config.closeEvent;
         if (closeEvent == null)
            var event = "mousedown";
         else
            var event = closeEvent;

         function openListener() {
            if (config.onOpen != null) {
               config.onOpen();
            }

            var curr = currentOverlayLink[overlay.dom.id];
            if (curr && curr.opener != opener) {
               curr.opener.removeListener(event, curr.closeListener);
               curr.opener.on(event, curr.openListener);
            }

            if (!curr || curr.opener != opener) {
               currentOverlayLink[overlay.dom.id] = { opener: opener, openListener: openListener, closeListener: closeListener };
            }

            createOverlayIsOpening[overlay.dom.id] = true;
            opener.removeListener(event, openListener);
            overlay.setStyle("display", "");
            if (config.moveLeft !== undefined && config.moveDown !== undefined) {
               var posX = opener.getX() - config.moveLeft;
               if (!config.alignLeft)
                  posX += opener.getWidth();
               var posY = opener.getY() + config.moveDown;
               overlay.moveTo(posX, posY);
            }

            setTimeout(function () {
               doc.on(event, closeListener);
               createOverlayIsOpening[overlay.dom.id] = false;
            }, 0);
         }

         function closeListener() {
            if (config.onClose != null) {
               config.onClose();
            }
            if (!createOverlayIsOpening[overlay.dom.id]) {
               doc.removeListener(event, closeListener);
               overlay.setStyle("display", "none");
               currentOverlayLink[overlay.dom.id] = null;

               setTimeout(function () {
                  opener.on(event, openListener);
               }, 0);
            }
         }

         overlay.on(event, function (e) {
            Ext.lib.Event.stopPropagation(e);
         });

         opener.on(event, openListener);

         if (config.closer != null) {
            var closer = Ext.fly(config.closer);
            if (closer != null) closer.on(event, closeListener);
         }
      }

      // Deprecated: forza-jquery.js
      Forza.UI.createOverlays = function (selector) {
         var openers = Ext.query(selector);

         for (var i = 0; i < openers.length; ++i) {
            var opener = openers[i];
            var tfor = opener.getAttribute("tfor");
            var overlay = Ext.query(tfor)[0];
            var closer = Ext.query(".closer", overlay)[0];
            Forza.UI.createOverlay({ opener: opener, overlay: overlay, closer: closer });
         }
      }

      Forza.UI.popUp = function (url, name, options) {
         if (options === null || options === undefined)
            options = 'resizable=1,scrollbars=1,toolbar=0,status=1';
         var ContextWindow = window.open(url, name, options);
         ContextWindow.focus();
         return false;
      };

      Forza.UI.openWindowPT = function (sUrl, sName, iT, iL, iW, iH) {
         var win;
         win = window.open(sUrl, sName, 'top=' + iT + ',left=' + iL + ',width=' + iW + ',height=' + iH + ',buttons=no,scrollbars=yes,location=no,menubar=no, resizable=yes,status=yes,directories=no,toolbar=no');
      };

   }
})();
