/**
Copyright 2013 LoopIndex, This file is part of the Track Changes plugin for CKEditor.

The track changes plugin is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License, version 2, as published by the Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with this program as the file lgpl.txt. If not, see http://www.gnu.org/licenses/lgpl.html.

Written by (David *)Frenkiel - https://github.com/imdfl
**/
var LITE = {
	Events : {
		INIT : "lite:init",
		ACCEPT : "lite:accept",
		REJECT : "lite:reject",
		SHOW_HIDE : "lite:showHide",
		TRACKING : "lite:tracking"
	},

	Commands : {
		TOGGLE_TRACKING : "lite.ToggleTracking",
		TOGGLE_SHOW : "lite.ToggleShow",
		ACCEPT_ALL : "lite.AcceptAll",
		REJECT_ALL : "lite.RejectAll",
		ACCEPT_ONE : "lite.AcceptOne",
		REJECT_ONE : "lite.RejectOne"
	}
}
