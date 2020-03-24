/* eslint-disable guard-for-in */
/* eslint-disable block-scoped-var */
/* eslint-disable no-eq-null */
/* eslint-disable one-var */
/* eslint-disable vars-on-top */
/*global window, define, ns */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @example
 * <div class="ui-calendar"></div>
 *
 * @since 1.2
 * @class ns.widget.core.Calendar
 * @extends ns.widget.BaseWidget
 * @author Dohyung Lim <delight.lim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				engine = ns.engine,
				events = ns.event,
				weeks = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
				fullNameMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				today = new Date(),
				todayYear = today.getFullYear(),
				todayMonth = today.getMonth() + 1,

				Calendar = function () {
					this.options = utilsObject.merge({}, defaultOptions);
				},

				defaultOptions = {
					pastSelection: false
				},

				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Calendar.prototype = prototype;

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @return {HTMLElement} Returns built element
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._init = function (element) {
				var self = this;

				if (!element.getAttribute("value")) {
					element.setAttribute("value", self.options.value);
				}

				self._buildCalendar();

				return element;
			};

			/**
			* Draw a calendar on the table
			* @method _buildCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._buildCalendar = function () {
				var firstDate = new Date(todayYear, todayMonth - 1, 0),
					lastDate = new Date(todayYear, todayMonth, 0),
					day = firstDate.getDay(),
					prevLastDate = lastDate.getDate(),
					week = Math.ceil(prevLastDate / 7) + 1,
					leftDays = 7,
					setDays = 1,
					nextMonthDate = 1,
					cell = null,
					calendar = document.getElementById("calendar"),
					marginRow = calendar.insertRow();

				marginRow.style.height = "7px";

				for (var i = 1; i < week + 1; i++) {
					var row = calendar.insertRow();

					while (day != 0) { // prev disabled days.
						day = day - 1;
						leftDays = leftDays - 1;
						cell = row.insertCell();
						cell.innerHTML = prevLastDate - day;
						cell.style.opacity = "10%";
					}
					while (leftDays != 0) {
						if (setDays > prevLastDate) { // next disabled days.
							cell = row.insertCell();
							cell.innerHTML = nextMonthDate;
							cell.style.opacity = "40%";
							leftDays = leftDays - 1;
							nextMonthDate = nextMonthDate + 1;
						} else { // current enabled days.
							cell = row.insertCell();
							cell.innerHTML = setDays;
							cell.style.opacity = "100%";
							setDays = setDays + 1;
							leftDays = leftDays - 1;
						}
					}
					leftDays = 7;
				}

				document.getElementById("yearMonth").innerHTML = fullNameMonth[todayMonth - 1] + " " + todayYear;
			}

			/**
			* Moving to another month erases the existing calendar
			* @method _deleteCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._deleteCalendar = function () {
				var calendar = document.getElementById("calendar");

				while (calendar.rows.length > 2) {
					calendar.deleteRow(2);
				}
			}

			/**
			* Click the arrow on the calendar to move to another month
			* @method _onClick
			* @param {Event} event
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._onClick = function (event) {
				if (event.srcElement.className === "calendar_arrow_right") {
					todayMonth = todayMonth + 1;
					if (todayMonth === 13) {
						todayMonth = 1;
						todayYear = todayYear + 1;
					}
					prototype._deleteCalendar();
					today = new Date(todayYear, todayMonth - 1);
					prototype._buildCalendar();
				} else if (event.srcElement.className === "calendar_arrow_left") {
					todayMonth = todayMonth - 1;
					if (todayMonth === 0) {
						todayMonth = 12;
						todayYear = todayYear - 1;
					}
					prototype._deleteCalendar();
					today = new Date(todayYear, todayMonth - 1);
					prototype._buildCalendar();
				} else {
					event.preventDefault();
				}
			};

			prototype._unBindEvents = function (element) {
				var self = this;

				events.off(element, "vclick", self, false);
			}

			prototype._bindEvents = function (element) {
				var self = this;

				events.on(element, "vclick", self, false);
			};

			prototype.handleEvent = function (event) {
				var self = this;

				if (event.type === "vclick") {
					self._onClick(event);
				} else {
					event.preventDefault();
				}
			};

			prototype._refresh = function () {
				var self = this;

				self._setValue(self.options.value);
			}

			prototype._setValue = function (value) {
				var self = this,
					options = self.options;

				options.pastSelection = value;

				self._refreshValue();
			}

			prototype._build = function (element) {
				var controllerElement = document.createElement("div"),
					leftArrowElement = document.createElement("div"),
					rightArrowElement = document.createElement("div"),
					viewChangeElement = document.createElement("div"),
					viewTableElement = document.createElement("table"),
					spaceElement = document.createElement("tr"),
					oneWeekElement = document.createElement("tr"),
					monElement = document.createElement("td"),
					tueElement = document.createElement("td"),
					wedElement = document.createElement("td"),
					thuElement = document.createElement("td"),
					friElement = document.createElement("td"),
					satElement = document.createElement("td"),
					sunElement = document.createElement("td");

				// Controller
				controllerElement.classList.add("controller");
				leftArrowElement.classList.add("calendar_arrow_left");
				rightArrowElement.classList.add("calendar_arrow_right");
				viewChangeElement.classList.add("calendar_switch");

				leftArrowElement.id = "preventMonth_Button";
				rightArrowElement.id = "nextMonth_Button";
				viewChangeElement.id = "yearMonth";

				controllerElement.appendChild(leftArrowElement);
				controllerElement.appendChild(rightArrowElement);
				controllerElement.appendChild(viewChangeElement);

				// View Container
				viewTableElement.classList.add("calendarView");
				spaceElement.classList.add("top-space");
				oneWeekElement.classList.add("oneWeek");

				viewTableElement.id = "calendar";

				monElement.innerHTML = weeks[0];
				oneWeekElement.appendChild(monElement);
				tueElement.innerHTML = weeks[1];
				oneWeekElement.appendChild(tueElement);
				wedElement.innerHTML = weeks[2];
				oneWeekElement.appendChild(wedElement);
				thuElement.innerHTML = weeks[3];
				oneWeekElement.appendChild(thuElement);
				friElement.innerHTML = weeks[4];
				oneWeekElement.appendChild(friElement);
				satElement.innerHTML = weeks[5];
				oneWeekElement.appendChild(satElement);
				sunElement.innerHTML = weeks[6];
				sunElement.id = "sunday";
				oneWeekElement.appendChild(sunElement);

				viewTableElement.appendChild(spaceElement);
				viewTableElement.appendChild(oneWeekElement);

				// append Elements
				element.appendChild(controllerElement);
				element.appendChild(viewTableElement);

				return element;
			};

			prototype._destroy = function () {
				var self = this;

				self.options = null;
				unBindEvents(self.element);
			};

			ns.widget.mobile.Calendar = Calendar;
			engine.defineWidget(
				"Calendar",
				".ui-calendar",
				[],
				Calendar,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Calendar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
