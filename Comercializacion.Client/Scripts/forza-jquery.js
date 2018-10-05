// Fuente: Forza.Web/Scripts/forza-jquery.js
// Siempre modificar el archivo desde su fuente y mantener retrocompatibilidad.
// Dependencias: jQuery
// Versión de retrocompatibilidad: 1.0
// Este archivo debe copiarse manualmente al cdn en la ruta
// /js/forza/forza-jquery.x.x.js y /js/forza/forza-jquery.x.x.min.js
// donde x.x es la versión de retrocompatibilidad.

(function ($) {
   // Estos objetos simulan el comportamiento de YAHOO. Facilitan la migración de código viejo. También hay métodos de Ext como getWidth.
   var Dom = {
      _get: function (el) {
         var type = typeof el;

         if (type === "string") {
            return $.makeArray($("#" + el));
         } else if ($.isArray(el)) {
            return $.map(el, function (x) {
               return Dom.get(x);
            });
         } else if (!el) return [];

         return [el];
      },

      get: function (el) {
         var type = typeof el;

         if (type === "string") {
            var els = $("#" + el);
            return els.length == 0 ? null : els[0];
         } else if ($.isArray(el)) {
            return $.map(el, function (x) {
               return Dom.get(x);
            });
         } else if (!el) return null;

         return el;
      },

      addClass: function (el, className) {
         var els = Dom._get(el);

         $.each(els, function (i, x) {
            $(x).addClass(className);
         });
      },

      removeClass: function (el, className) {
         var els = Dom._get(el);

         $.each(els, function (i, x) {
            $(x).removeClass(className);
         });
      },

      setStyle: function (el, property, val) {
         var els = Dom._get(el);

         $.each(els, function (i, x) {
            $(x).css(property, val);
         });
      },

      getX: function (el) {
         var els = Dom._get(el);
         var type = typeof el;

         if (type === "string") {
            return els.length == 0 ? null : $(els[0]).offset().left;
         } else if ($.isArray(el)) {
            return $.map(els, function (i, x) {
               return $(x).offset().left;
            })
         } else if (!el) return null;

         return $(el).offset().left;
      },

      getY: function (el) {
         var els = Dom._get(el);
         var type = typeof el;

         if (type === "string") {
            return els.length == 0 ? null : $(els[0]).offset().top;
         } else if ($.isArray(el)) {
            return $.map(els, function (i, x) {
               return $(x).offset().top;
            })
         } else if (!el) return null;

         return $(el).offset().top;
      },

      getWidth: function (el) {
         return $(el).outerWidth();
      },

      getHeight: function (el) {
         return $(el).outerHeight();
      },

      moveTo: function (el, x, y) {
         $(el).css("left", x);
         $(el).css("top", y);
      }
   };

   var Selector = {
      query: function (selector, root, firstOnly) {
         var els = $(selector, root);
         if (firstOnly) return els.length == 0 ? null : els[0];
         return $.makeArray(els);
      }
   };

   var Event = {
      _listeners: [],

      _on: function (el, sType, fn, obj, overrideContext) {
         var els = Dom._get(el);

         $.each(els, function (i, x) {
            var xfn = function (e) {
               return fn.call(overrideContext ? overrideContext : x, e.originalEvent, obj);
            };

            Event._listeners.push({ el: x, type: sType, fn: fn, xfn: xfn });
            $(x).bind(sType, xfn);
         });
      },

      on: function (el, sType, fn, obj, overrideContext) {
         Event._on(el, sType, fn, obj, overrideContext);
      },

      addListener: function (el, sType, fn, obj, overrideContext) {
         Event._on(el, sType, fn, obj, overrideContext);
      },

      removeListener: function (el, sType, fn) {
         var els = Dom._get(el);

         $.each(els, function (i, x) {
            for (var i = 0; i < Event._listeners.length; ++i) {
               var li = Event._listeners[i];

               if (li.el == x && li.type == sType && li.fn == fn) {
                  $(x).unbind(sType, li.xfn);
                  Forza.Util.arrayRemove(Event._listeners, li);
                  break;
               }
            }
         });
      },

      getCharCode: function (ev) {
         var code = ev.keyCode || ev.charCode || 0;

         if ($.browser.webkit && (code in webkitKeymap)) {
            code = webkitKeymap[code];
         }

         return code;
      },

      preventDefault: function (ev) {
         if (ev.preventDefault) {
            ev.preventDefault();
         } else {
            ev.returnValue = false;
         }
      },

      stopPropagation: function (ev) {
         if (ev.stopPropagation) {
            ev.stopPropagation();
         } else {
            ev.cancelBubble = true;
         }
      },

      stopEvent: function (ev) {
         this.stopPropagation(ev);
         this.preventDefault(ev);
      }
   };

   var webkitKeymap = {
      63232: 38, // up
      63233: 40, // down
      63234: 37, // left
      63235: 39, // right
      63276: 33, // page up
      63277: 34, // page down
      25: 9      // SHIFT-TAB (Safari provides a different key code in
      // this case, even though the shiftKey modifier is set)
   }

   // Inicia la librería.
   if (!$)
      return;
   if (!window.Forza)
      Forza = {};

   if (!Forza.Util)
      Forza.Util = {};

   String.prototype.contains = function (s) {
      return this.indexOf(s) >= 0;
   }

   String.prototype.isUri = function (e) {
      return /^[a-zA-Z0-9\-]+$/.test(this);
   }

   String.prototype.isEmail = function (e) {
      return /^(([a-zA-Z0-9]+_+)|([a-zA-Z0-9]+\-+)|([a-zA-Z0-9]+\.+)|([a-zA-Z0-9]+\++))*[a-zA-Z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/.test(this);
   }

   Forza.Util.arrayCopy = function (array) {
      var copy = [];

      for (var i = 0; i < array.length; ++i) {
         copy.push(array[i]);
      }

      return copy;
   }

   Forza.Util.arrayRemove = function (array, item) {
      for (var i = 0; i < array.length; ++i) {
         if (array[i] === item) {
            array.splice(i, 1);
            return true;
         }
      }

      return false;
   }

   var reliableHiddenOffset;

   Forza.Util.reliableHiddenOffset = function () {
      if (reliableHiddenOffset === undefined) {
         //TEST
         var body = document.getElementsByTagName("body")[0];

         if (body === undefined) {
            reliableHiddenOffset = true;
         } else {
            var container = document.createElement("div");
            container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
            body.insertBefore(container, body.firstChild);

            // Construct the test element
            var div = document.createElement("div");
            container.appendChild(div);
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            // (only IE 8 fails this test)
            div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
            var tds = div.getElementsByTagName("td");
            var isSupported = (tds[0].offsetHeight === 0);

            tds[0].style.display = "";
            tds[1].style.display = "none";

            // Check if empty table cells still have offsetWidth/Height
            // (IE <= 8 fail this test)
            reliableHiddenOffset = isSupported && (tds[0].offsetHeight === 0);
            body.removeChild(container);
            div = container = null;
            //ENDTEST
         }
      }

      return reliableHiddenOffset;
   };

   Forza.Util.arrayContains = function (array, obj, index) {
      var i = array.length;
      while (i--) if (array[i] === obj) return index ? i : true;
      return index ? -1 : false;
   }

   Forza.Util.arrayIndexOf = function (array, obj) {
      return Forza.Util.arrayContains(array, obj, true);
   }

   Forza.Util.arrayFirstOrDefault = function (array, predicate) {
      for (var i = 0; i < array.length; ++i) if (predicate(array[i])) return array[i];
      return null;
   }

   Forza.Util.Switch = function (value) {
      this._value = value;
   }

   Forza.Util.Switch.prototype = {
      get: function () { return this._value; },
      set: function (value) {
         if (value !== this._value) {
            this._value = value;
            if (this.onChange) this.onChange();
         }
      }
   };

   if (!Forza.UI)
      Forza.UI = {};

   function escapeString(str) {
      var t = new Array();
      for (var i = 0; i < str.length; i++) {
         t.push(escapeChars(str.substring(i, i + 1)));
      }
      return t.join('');
   };

   function escapeChars(t) {
      if (t.charCodeAt(0) < 224) { return t; }
      t = t.toLowerCase();
      var n = t.charCodeAt(0);
      if (n >= 224 && n < 231) { return "a"; }
      if (n === 231) { return "c"; }
      if (n >= 232 && n < 235) { return "e"; }
      if (n >= 236 && n < 239) { return "i"; }
      if (n === 241) { return "n"; }
      if (n >= 242 && n < 246) { return "o"; }
      if (n >= 249 && n < 252) { return "u"; }
      if (n === 253) { return "y"; }
      return t;
   };

   Forza.configure = function (ns, config, override) {
      if (typeof config === "string")
         config = $.extend({}, ns.cfgs[config]);

      $.each(ns.cfg, function (key, value) {
         if (typeof config[key] === "undefined") {
            config[key] = value;
         }
      });

      if (typeof override !== "undefined") {
         $.each(override, function (key, value) {
            config[key] = value;
         });
      }

      return config;
   };

   Forza.UI.autocomplete = function (config, override) {
      var config = Forza.configure(Forza.UI.autocomplete, config, override);
      var els = $(config.selector);

      els.each(function (i, el) {
         var hidden = $(config.hidden);
         var last = "";
         var source = config.source;
         var filter = config.filter;
         var minLength = config.minLength;

         if (filter && Forza.UI.autocomplete.filters[filter] && $.isArray(source)) {
            var array = source;

            source = function (request, response) {
               response(Forza.UI.autocomplete.filters[filter](array, escapeString($.trim(request.term))));
            };
         }

         var ac = $(el).autocomplete({
            source: source,
            minLength: minLength,
            delay: config.delay,
            select: function (event, ui) {
               hidden.val(ui.item.id);
               last = ui.item.value;
               if (config.select)
                  config.select.call(this, event, ui);
            },
            open: function (event, ui) {
               var autocomplete = $(this).data("autocomplete");
               var menu = autocomplete.menu;
               menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
            }
         }).data("autocomplete");

         if (config.renderItem) {
            ac._renderItem = function (ul, item) {
               return $("<li></li>")
                  .data("item.autocomplete", item)
                  .append("<a>" + config.renderItem(item) + "</a>")
                  .appendTo(ul);
            };
         }

         if (config.openOnClick) {
            $(el).click(function () {
               $(el).autocomplete("search");
            });
         }

         $(el).blur(function () {
            if ($(this).val() != last)
               hidden.val("");
         });
      });
   };

   Forza.UI.autocomplete.cfg = {
      selector: ".forza-ui-autocomplete",
      // Opcional. Selector de los inputs a los que se les va a aplicar el autocomplete.
      source: null,
      // Obligatorio. Puede ser una url para pedir datos por ajax, un arreglo de JS o una function(request, response).
      hidden: null,
      // Opcional. Selector de un hidden donde se quiera guardar la propiedad id del item seleccionado.
      filter: null,
      // Opcional. Filtro para fuente de datos local ("begins" o "words").
      minLength: 3,
      // Opcional. Longitud mínima del valor del usuario para hacer una búsqueda en la lista.
      openOnClick: false,
      // Opcional. Despliega la lista al darle click al input.
      select: null,
      // Opcional: Callback del evento select.
      renderItem: null,
      // Opcional: Función para pintar el html de un li. Recibe el objeto de datos y debe regresar el html.
      delay: 200
      // Opcional: Retraso entre la última tecleada del usuario y el filtrado de la lista.
   };

   Forza.UI.autocomplete.cfgs = {
      // Hace funcionar al autocomplete como un combobox.
      combo: {
         filter: "words",
         minLength: 0,
         openOnClick: true
      }
   };

   Forza.UI.autocomplete.filters = {
      begins: function (array, term) {
         var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");

         return $.grep(array, function (value) {
            return matcher.test(escapeString($.trim(value.keywords || value.label || value.value || value)));
         });
      },

      words: function (array, term) {
         if (term == "") {
            return array;
         }

         var words = term.split(' ');
         var globalMatcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");

         return $.grep(array, function (value) {
            var s = escapeString($.trim(value.keywords || value.label || value.value || value));
            var keywords = s.split(' ');
            var matches = 0;

            for (var j = 0; j < words.length; ++j) {
               var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(words[j]), "i");

               for (var i = 0; i < keywords.length; ++i)
                  if (globalMatcher.test(s) && matcher.test(keywords[i]))
                     ++matches;
            }

            return matches >= words.length;
         });
      }
   };

   Forza.UI.SelectMultiple = function (config) {
      if (!config) return;
      if (!config.id) return;
      if (!config.filterDelay) config.filterDelay = 300;
      if (!config.maxItems) config.maxItems = 50;
      var filterCont = Dom.get(config.id);
      var chks = Selector.query(".chks", filterCont, true);
      var selAll = Selector.query(".app_slctAllChks", filterCont, true);
      var selNone = Selector.query(".app_unSlctAllChks", filterCont, true);
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

         filtering.onChange = function () {
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
                  group.style.display = "none"
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
            $(".app_noneElements", filterCont).css("display", "none");
            checksSelectedCont++;
            maxItemsDiv.style.display = "none";
         } else {
            var panel = Selector.query(".removers", filterCont, true);
            if (window.getComputedStyle(panel, null).getPropertyValue("display") != 'none')
               $("a[idx='" + idx + "']", filterCont).click();
         }

         if (groups.lenght != undefined) {
            var gchk = Selector.query(".chkgroup", self.parentNode.parentNode, true);
            if (!gchk == false) {
               if (self.checked) {
                  if (Selector.query("input[class=chk]:checked", self.parentNode.parentNode).length == Selector.query(".chk", self.parentNode.parentNode).length)
                     gchk.checked = true;
               } else {
                  gchk.checked = false;
               }
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

      this.listener = function (e) {
         var self = this;
         setTimeout(function (e) {
            Dom.removeClass(self.parentNode, "rmver-show");
            var idx = self.getAttribute("idx");
            indexedChks[idx].checked = false;
            if (config.onUnselect && config.passIdx && !firstRun)
               config.onUnselect(idx);
            else if (config.onUnselect && !firstRun)
               config.onUnselect();

            var count = Selector.query(".rmver-show", filterCont);
            if (count.length == 0) {
               $(".app_noneElements", filterCont).css("display", "");
            }
         }, 0);

      };

      Event.on(rmvers, "click", this.listener);
      firstRun = false;

      Event.on(selAll, "click", function (e) {
         $(checkboxes).each(function () {
            var parent = $(this).parent();
            if (!$(parent).hasClass("chk-filter")) {
               $(this).click();
            }
         });
      });

      Event.on(selNone, "click", function (e) {
         $(rmvers).click();
         $(groups).attr("checked", "");
      });

      if (groups !== null) {

         Event.on(groups, "click", function (e) {
            var self = this;
            var chkse = Selector.query(".chk", self.parentNode);

            for (var j = 0; j < chkse.length; j++) {
               var label = $("label[for='" + chkse[j].id + "']").text().toLowerCase();
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

         var expanders = Selector.query(".app_expandtree", filterCont);
         Event.on(expanders, "click", function (e) {
            var self = this;
            var options = Selector.query(".chk-option", $(self).parent());
            for (var j = 0; j < options.length; j++) {
               if ($(options[j]).hasClass("chk-hdn")) {
                  Dom.removeClass(options[j], "chk-hdn");
                  self.innerHTML = "-";
               } else {
                  Dom.addClass(options[j], "chk-hdn");
                  self.innerHTML = "+";
               }
            }
         });
      }
   };

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

   var createOverlayIsOpening = [];
   var currentOverlayLink = new Array();

   Forza.UI.createOverlay = function (config) {
      if (config == null || config.opener == null || config.overlay == null) return;
      var opener = Dom.get(config.opener);
      if (opener == null) return;
      var overlay = Dom.get(config.overlay);
      if (overlay == null) return;
      var doc = document;
      var closeEvent = config.closeEvent;
      if (closeEvent == null)
         var event = "mousedown";
      else
         var event = closeEvent;

      function openListener() {
         if (config.onOpen != null) {
            config.onOpen();
         }

         var curr = currentOverlayLink[overlay.id];

         if (curr && curr.opener != opener) {
            Event.removeListener(curr.opener, event, curr.closeListener);
            Event.on(curr.opener, event, curr.openListener);
         }

         if (!curr || curr.opener != opener) {
            currentOverlayLink[overlay.id] = { opener: opener, openListener: openListener, closeListener: closeListener };
         }

         createOverlayIsOpening[overlay.id] = true;
         Event.removeListener(opener, event, openListener);
         Dom.setStyle(overlay, "display", "");

         if (config.moveLeft !== undefined && config.moveDown !== undefined) {
            var posX = Dom.getX(opener) - config.moveLeft;
            if (!config.alignLeft)
               posX += Dom.getWidth(opener);
            var posY = Dom.getY(opener) + config.moveDown;
            Dom.moveTo(overlay, posX, posY);
         }

         setTimeout(function () {
            Event.on(doc, event, closeListener);
            createOverlayIsOpening[overlay.id] = false;
         }, 0);
      }

      function closeListener() {
         if (config.onClose != null) {
            config.onClose();
         }
         if (!createOverlayIsOpening[overlay.id]) {
            Event.removeListener(doc, event, closeListener);
            Dom.setStyle(overlay, "display", "none");
            currentOverlayLink[overlay.id] = null;

            setTimeout(function () {
               Event.on(opener, event, openListener);
            }, 0);
         }
      }

      Event.on(overlay, event, function (e) {
         Event.stopPropagation(e);
      });

      Event.on(opener, event, openListener);

      if (config.closer != null) {
         var closer = Dom.get(config.closer);
         if (closer != null) Event.on(closer, event, closeListener);
      }
   }

   Forza.UI.createOverlays = function (selector) {
      var openers = Selector.query(selector);

      for (var i = 0; i < openers.length; ++i) {
         var opener = openers[i];
         var tfor = opener.getAttribute("tfor");
         var overlay = Selector.query(tfor)[0];
         var closer = Selector.query(".closer", overlay)[0];
         Forza.UI.createOverlay({ opener: opener, overlay: overlay, closer: closer });
      }
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
   Forza.UI.unbindEvent = function (selector, event, func) {
      var $selector = $(selector);
      $selector.unbind(event, func);
   };

   Forza.UI.bindEvent = function (selector, event, func) {
      var $selector = $(selector);
      $selector.bind(event, func);
   };

   Forza.UI.unbindAfterFunction = function (obj, event, func) {
      var $selector = $(obj);
      var callback = function () { func.apply(this, arguments); Forza.UI.unbindEvent(this, event, callback); };
      $selector.bind(event, callback);
   };

   Forza.UI.unbindBeforeFunction = function (obj, event, func) {
      var $selector = $(obj);
      var callback = function () { Forza.UI.unbindEvent(this, event, callback); func.apply(this, arguments); };
      $selector.bind(event, callback);
   };

   Forza.UI.oneTimeSubmit = function (selector) {
      Forza.UI.bindEvent(selector, "submit", function () {
         var tthis = this;

         setTimeout(function () {
            Forza.UI.bindEvent(tthis, "submit", function (event) {
               event.preventDefault();
            });
         }, 0);
      });
   };

   Forza.UI.getDialog = function (opener, divId, url, dialogTitle) {
      var id = "#" + divId;
      var x = $(opener).position().left + $(opener).outerWidth();
      var y = $(opener).position().top - $(document).scrollTop();
      $(id).load(url, function (response, status, xhr) {
         if (status == "error") {
            var msg = "Sorry but there was an error: ";
            $(id).html(msg + xhr.status + " " + xhr.statusText);
         }
      }).dialog(
         {
            closeOnEscape: true,
            minWidth: 400,
            minHeight: 200,
            width: 'auto',
            height: 'auto',
            position: [x, y],
            title: dialogTitle
         });
   };

   // Busca en un objeto de jQuery un dato en el atributo class asociado a un key.
   // El dato debe estar como una clase en el atributo class con el siguiente formato: ap-data_{key}-{value}.
   // tthis: Puede ser nulo, en cuyo caso se regresará undefined.
   // key: No debe ser nulo ni vacío.
   Forza.UI.getDataValue = function (tthis, key) {
      if (tthis == null) return;
      var classValue = $(tthis).attr("class");
      if (!classValue) return;
      var allClasses = classValue.split(" ");
      if (allClasses.length == 0 || (allClasses.length == 1 && !allClasses[0])) return;

      for (var i = 0; i < allClasses.length; ++i) {
         var pair = allClasses[i];
         if (pair.indexOf("ap-data_" + key + "-") !== 0) continue;
         var value = pair.replace("ap-data_" + key + "-", "");
         value = value.replace(/{e}/g, ' ');
         return value;
      }
   };
   Forza.UI.isHidden = function (elem) {
      if (elem == undefined) {
         return true;
      }
      var width = elem.offsetWidth,
			height = elem.offsetHeight;

      return (width === 0 && height === 0) || (!Forza.Util.reliableHiddenOffset() && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
   };
   Forza.UI.isVisible = function (elem) {
      return !Forza.UI.isHidden(elem);
   };

   // Inicializa un conjunto de overlays con toggler y que se cierran al dar click en la ventana o en un closer definido.
   // config: Objeto de configuración.
   //    context: Elemento de HTML o selector de los contextos a los que se les iniciará un overlay.
   //    toggledSelector: Selector de los elementos dentro de los contextos que serán overlays.
   //    togglerSelector: Selector de los elementos dentro de los contextos que serán los togglers.
   //    closerSelector: Opcional. Selector de los elementos dentro de los contextos que serán los closers.
   //    onClosing(): Opcional. Listener que se dispara justo antes de cerrar. Si regresa false se cancela la cerrada.
   //    onClose(data): Opcional. Listener que se dispara justo después de cerrar.
   //       data
   //          context: Objeto jQuery con el elemento de contexto específico de este overlay.
   //          item: Objeto Html al que se le dio click
   //    onCloserClicking(data): Opcional. Listener que se dispara justo después de haber dado click a un closer. Si regresa false se cancela la cerrada.
   //       this: El this de la llamada será el elemento del dom del closer.
   //       data
   //          context: Objeto jQuery con el elemento de contexto específico de este overlay.
   //          eventArgs: Arreglo de argumentos del evento 'click' de jQuery del closer.
   //    onOpen(data): Opcional. Listener que se dispara justo después de abrir.
   //       data
   //          context: Objeto jQuery con el elemento de contexto específico de este overlay.
   Forza.UI.initOverlays = function (config) {
      $(config.context).each(function () {
         var ctx = $(this);
         var toggled = $(config.toggledSelector, ctx);
         var open = Forza.UI.isVisible(toggled[0]);

         function close() {
            if ($.isFunction(config.onClosing) && config.onClosing() === false) return;
            toggled.hide();
            $("body").unbind("click", onClick);
            open = false;
            if ($.isFunction(config.onClose)) config.onClose({ context: ctx });
         }

         function onClick(e) {
            if (dontClose) {
               dontClose = false;
               return;
            }

            close();
         }

         var dontClose = false;

         toggled.click(function () {
            if (open) dontClose = true;
         });

         toggled.delegate(config.closerSelector, 'click', function () {
            if ($.isFunction(config.onCloserClicking)) {
               var callResult = config.onCloserClicking.call(this, {
                  context: ctx,
                  eventArgs: arguments
               });

               if (callResult === false) return;
            }

            dontClose = false;
            close();
         });

         function endOpen(item) {
            open = true;
            if ($.isFunction(config.onOpen)) config.onOpen({ context: ctx, item: item });

            setTimeout(function () {
               $("body").click(onClick);
            }, 0);
         }

         $(ctx).delegate(config.togglerSelector, 'click', function (event) {
            event.preventDefault();
            if (!Forza.UI.isVisible(toggled[0])) {
               toggled.show();
               endOpen(this);
            }
         });

         if (open) {
            endOpen();
         }
      });
   };

   // Inicializa un conjunto de calendario de meses.
   // config: Objeto de configuración.
   //    contextSelector: Selector del conjunto de contextos a los que se les inicializará un calendario de meses. Los contextos deben tener en su interior los siguientes elementos HTML:
   //       .ap_calYear_UI
   //          Hidden que representa en qué año se encuentra la UI.
   //          Como valor inicial debe tener el año en el que se quiere que la UI del calendario se encuentre al iniciar.
   //       .ap_calIsSet
   //          Hidden que representa si el calendario tiene una fecha seleccionada.
   //          De tener el valor "true" (case insensitive), indica que el calendario se debe iniciar con una fecha seleccionada.
   //       .ap_calYear
   //          Hidden que representa el año seleccionado.
   //          Debe tener un valor de año válido si .ap_calIsSet es "true".
   //       .ap_calMonth
   //          Hidden que representa el mes seleccionado.
   //          Debe tener un número de mes válido (1 al 12) si .ap_calIsSet es "true".
   //       .ap_calSelDisplay
   //          Contenedor que será usado como display para el valor seleccionado del calendario.
   //          Mostrará un texto neutral cuando no se ha seleccionado o mes y año si ya se seleccionó.
   //    todayYear: Año del día de hoy.
   //    todayMonth: Mes del día de hoy (Número del 1 al 12).
   //    onSelecting(evData): Listener que se dispara justo antes de seleccionar una fecha en el calendario.
   //       evData
   //          selectedYear: Año seleccionado.
   //          selectedMonth: Mes seleccionado.
   //          selectedDate: Fecha seleccionado (Objeto tipo Date).
   //          selectedTime: Tiempo seleccionado (Ticks de JS obtenidos con Date.getTime(). Sirven para comparar una fecha con otra.).
   //    monthNames: Diccionario con los nombres de los meses asociados a su número del 1 al 12.
   //    onSelect(evData): Listener que se dispara justo después de seleccionar una fecha en el calendario.
   //       evData: Datos del evento del mismo tipo que los de onSelecting.
   //    resetText: Texto neutral que será mostrado en .ap_calSelDisplay cuando no se ha seleccionado mes.
   // Este objeto tendrá en su interior un arreglo llamado months, con un elemento por cada calendario inicializado.
   // Cada elemento tendrá las siguientes funciones:
   //    getSelectedIsSet(): Regresa si el calendario tiene mes seleccionado.
   //    getSelectedYear(): Regresa el año seleccionado.
   //    getSelectedMonth(): Regresa el mes seleccionado (Número del 1 al 12).
   //    getSelectedDate(): Regresa el mes seleccionado en forma de fecha de JS.
   //    getSelectedTime(): Regresa el mes seleccionado en forma de ticks obtenidos a partir de la función Date.getTime().
   //    reset(): Deja al calendario sin un mes seleccionado.
   //    resetUi(): Refresca la UI.
   //    setUiYear(): Cambia programáticamente el año en el cuál la UI del calendario está situada.
   //    addAuxiliarMonth(Date month): Añade un mes auxiliar al calendario.
   //       Un mes auxiliar es un mes que aparecerá en la UI del calendario como seleccionado, sin ser el mes seleccionado del mismo.
   //       Después de agregar un mes auxiliar hay que mandar a llamar manualmente la función resetUi() para que aparezca seleccionado.
   //    removeAuxiliarMonth(Date month): Quita un mes auxiliar del calendario.
   //       Un mes auxiliar es un mes que aparecerá en la UI del calendario como seleccionado, sin ser el mes seleccionado del mismo.
   //       Después de quitar un mes auxiliar hay que mandar a llamar manualmente la función resetUi() para que desaparezca.
   Forza.UI.SearchboxMonths = function (config) {
      var contextSelector = config.contextSelector;

      function getUiYear(ctx) {
         var year = parseInt($(".ap_calYear_UI", ctx).val());
         return year;
      }

      function getSelectedMonth(ctx) {
         var month = parseInt($(".ap_calMonth", ctx).val());
         return month;
      }

      function setSelectedMonth(ctx, value) {
         $(".ap_calMonth", ctx).val(value);
      }

      function getSelectedYear(ctx) {
         var year = parseInt($(".ap_calYear", ctx).val());
         return year;
      }

      function setSelectedYear(ctx, value) {
         $(".ap_calYear", ctx).val(value);
      }

      function getSelectedIsSet(ctx) {
         var isSet = $(".ap_calIsSet", ctx).val().toLowerCase() == "true";
         return isSet;
      }

      function setSelectedIsSet(ctx, value) {
         $(".ap_calIsSet", ctx).val(value);
      }

      function getSelectedDate(ctx) {
         var year = getSelectedYear(ctx);
         var month = getSelectedMonth(ctx);
         var date = new Date(year, month - 1, 1);
         return date;
      }

      function getSelectedTime(ctx) {
         var date = getSelectedDate(ctx);
         return date.getTime();
      }

      function getTodayDate() {
         var year = config.todayYear;
         var month = config.todayMonth;
         var date = new Date(year, month - 1, 1);
         return date;
      }

      function getSelectorMonthData(tthis) {
         var month = parseInt(Forza.UI.getDataValue(tthis, "m"));
         return month;
      }

      function setDisplay(ctx, value) {
         $(".ap_calSelDisplay", ctx).html(value);
      }

      function resetUi(ctx) {
         var year = getUiYear(ctx);
         setUiYear(ctx, year);
      }

      function getEventData(ctx) {
         var data = {
            selectedYear: getSelectedYear(ctx),
            selectedMonth: getSelectedMonth(ctx),
            selectedDate: getSelectedDate(ctx),
            selectedTime: getSelectedTime(ctx)
         };

         return data;
      }

      function startSelect(ctx) {
         if ($.isFunction(config.onSelecting)) {
            var evData = getEventData(ctx);
            config.onSelecting(evData);
         }
      }

      function endSelect(ctx, year, month) {
         setDisplay(ctx, config.monthNames[month] + " " + year);

         if ($.isFunction(config.onSelect)) {
            var data = getEventData(ctx);
            config.onSelect(data);
         }
      }

      function reset(ctx) {
         $(".ap_calSel", ctx).removeClass("selected");
         setSelectedIsSet(ctx, false);
         setDisplay(ctx, config.resetText);
      }

      var months = [];
      this.months = months;
      var ctxEls = [];

      $(contextSelector).each(function () {
         ctxEls.push(this);
         var ctx = $(this);

         months.push({
            getSelectedYear: function () { return getSelectedYear(ctx); },
            getSelectedMonth: function () { return getSelectedMonth(ctx); },
            getSelectedDate: function () { return getSelectedDate(ctx); },
            getSelectedTime: function () { return getSelectedTime(ctx); },
            getSelectedIsSet: function () { return getSelectedIsSet(ctx); },
            reset: function () { return reset(ctx); },
            resetUi: function () { return resetUi(ctx); },
            setUiYear: function (year) { setUiYear(ctx, year); },
            _auxiliarMonths: [],
            addAuxiliarMonth: function (month) {
               this._auxiliarMonths.push(month);
            },
            removeAuxiliarMonth: function (month) {
               var newAuxiliarMonths = [];

               for (var i = 0; i < this._auxiliarMonths.length; ++i) {
                  if (this._auxiliarMonths[i].getTime() != month.getTime()) {
                     newAuxiliarMonths.push(this._auxiliarMonths[i]);
                  }
               }

               this._auxiliarMonths = newAuxiliarMonths;
            }
         });
      });

      Forza.UI.initOverlays({
         context: contextSelector,
         togglerSelector: ".ap_calToggler",
         toggledSelector: ".ap_calToggled",
         closerSelector: ".ap_calSel",
         onCloserClicking: function (data) {
            var tthis = $(this);
            if (!tthis.hasClass("ap_calSelActive")) return false;
            var month = getSelectorMonthData(tthis);
            var ctx = data.context;
            startSelect(ctx);
            var year = getUiYear(ctx);
            setSelectedIsSet(ctx, true);
            setSelectedMonth(ctx, month);
            setSelectedYear(ctx, year);
            endSelect(ctx, year, month);
            resetUi(ctx);
         },
         onOpen: function (data) {
            var ctx = data.context;
            var togglers = $(".ap_calToggler", ctx);
            var title = togglers.attr("title");

            if (title) {
               togglers.attr("title", "");
               togglers.attr("data-htitle", title);
            }
         },
         onClose: function (data) {
            var ctx = data.context;
            var togglers = $(".ap_calToggler", ctx);
            var title = togglers.attr("data-htitle");

            if (title) {
               togglers.attr("data-htitle", "");
               togglers.attr("title", title);
            }
         }
      });

      function setUiYear(ctx, year) {
         $(".ap_calYear_UI", ctx).val(year);
         var display = $(".ap_calYearDisplay", ctx);
         display.html(year);
         var selectedMonth = getSelectedDate(ctx);
         $(".ap_calSel", ctx).removeClass("previous ap_calSelActive today selected");

         for (var i = 0; i < 12; ++i) {
            var month = new Date(year, i, 1);
            var classes = [];
            var todayMonth = getTodayDate();
            var previous = month.getTime() < todayMonth.getTime();
            classes.push(previous ? "previous" : "ap_calSelActive");
            if (month.getTime() == todayMonth.getTime()) classes.push("today");
            var auxSelected = false;
            var index = $.inArray(ctx[0], ctxEls);
            var monthObj = months[index];
            var auxiliarMonths = monthObj._auxiliarMonths;

            for (var j = 0; j < auxiliarMonths.length; ++j) {
               if (auxiliarMonths[j].getTime() == month.getTime()) {
                  auxSelected = true;
                  break;
               }
            }

            var isSet = getSelectedIsSet(ctx);
            if (auxSelected || (isSet && month.getTime() == selectedMonth.getTime())) classes.push("selected");
            classes = classes.join(" ");
            $(".ap-data_m-" + (i + 1), ctx).addClass(classes);
         }
      }

      $(contextSelector).each(function () {
         var ctx = $(this);

         $(".ap_calNext", ctx).click(function () {
            var year = getUiYear(ctx);
            ++year;
            setUiYear(ctx, year);
         });

         $(".ap_calPrev", ctx).click(function () {
            var year = getUiYear(ctx);
            --year;
            setUiYear(ctx, year);
         });

         var isSet = getSelectedIsSet(ctx);

         if (isSet) {
            startSelect(ctx);
            var year = getSelectedYear(ctx);
            var month = getSelectedMonth(ctx);
            endSelect(ctx, year, month);
         }
      });
   };

   // Inicializa togglers. Elementos que se muestran y ocultan por un click en otro.
   // config: Objeto de configuración.
   //    context: Elemento de HTML o selector de los contextos a los que se les iniciarán los togglers.
   //    togglerSelector: Selector de los elementos dentro de los contextos que serán los togglers.
   //    togglerIndicatorSelector: Default = 'ap_point'. Selector de los elmentos indicadores de abierto/cerrado
   //    openerDefaultClass: Default = 'pointD'. Clase default para el indicador de abierto/cerrado
   //    openerAltClass: Default = 'pointR'. Clase alterna para el indicador de abierto/cerrado
   Forza.UI.initTogglers = function (config) {

      if (config == undefined)
         return;

      var togglerIndicatorSelector = '.ap_point';
      var openerDefaultClass = 'pointD';
      var openerAltClass = 'pointR';

      if (config.togglerIndicatorSelector != undefined) togglerIndicatorSelector = config.togglerIndicatorSelector;
      if (config.openerDefaultClass != undefined) openerDefaultClass = config.openerDefaultClass;
      if (config.openerAltClass != undefined) openerAltClass = config.openerAltClass;

      if (config.context == undefined) {
         $(config.togglerSelector).click(function () {
            var tthis = $(this);
            toggleGroup(tthis, config == undefined ? undefined : config.forceShow);
         });
      }
      else {
         $(config.context).each(function () {
            var ctx = $(this);
            $(config.togglerSelector, ctx).click(function () {
               var tthis = $(this);
               toggleGroup(tthis, config == undefined ? undefined : config.forceShow);
            });
         });
      }


      function toggleGroup(tthis, forceShow) {
         if (forceShow)
            return;

         var toggled = ".ap_" + Forza.UI.escapeJquerySelectors(Forza.UI.getDataValue(tthis, "toggled"));
         $(toggled).toggle();

         var point = $(togglerIndicatorSelector, tthis.parent());
         toggleIconPoint(point);
      };

      function toggleIconPoint(point) {
         point.toggleClass(openerDefaultClass);
         point.toggleClass(openerAltClass);
      };
   };

   // Escapa los caracteres especiales de un texto para usarse en un selector.
   Forza.UI.escapeJquerySelectors = function (str) {
      if (str)
         return str.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
      else
         return str;
   };

   // Muestra una imagen de loading y opaca un contenido mientras este se refresca.
   // config: Objeto de configuración.
   //    coverSelector: Selector del elemento que cubre al contenido y lo hacer verse opaco.
   //       require que dentro del elemento cover venga una imagen de un spinner
   //    contentSelector: Selector del elemento que va ser reemplazado.
   Forza.UI.showLoading = function (config) {
      var converLoading = $(config.coverSelector);
      var content = $(config.contentSelector);
      converLoading.width(content.width());
      converLoading.height(content.height());
      converLoading.css({ opacity: 0.5 });
      var img = $("img", converLoading);
      var contentWidth = content.width();
      var leftMargin = contentWidth / 2 - 75 / 2;
      img.css("margin-left", leftMargin);
      img.css("margin-top", "100px");
      converLoading.show();
   };


})(window.jQuery);