(function () {

// fomatting for the tooltips
	function padString(s, length, padWith, bSuffix) {
		if (null === s || (typeof(s) == "undefined")) {
			s = "";
		}
		else {
			s = String(s);
		}
		padWith = String(padWith);
		var padLength = padWith.length;
		for (var i = s.length; i < length; i += padLength) {
			if (bSuffix) {
				s += padWidth;
			}
			else {
				s = padWith + s;
			}
		}
		return s;
	}

	function padNumber(s, length) {
		return padString(s, length, '0');
	}

	var exports = this,
		defaults, InlineChangeEditor;

	defaults = {
	// ice node attribute names:
		changeIdAttribute: 'data-cid',
		userIdAttribute: 'data-userid',
		userNameAttribute: 'data-username',
		timeAttribute: 'data-time',
		changeDataAttribute: 'data-changedata', // dfl, arbitrary data to associate with the node, e.g. version

		// Prepended to `changeType.alias` for classname uniqueness, if needed
		attrValuePrefix: '',

		// Block element tagname, which wrap text and other inline nodes in `this.element`
		blockEl: 'p',

		// All permitted block element tagnames
		blockEls: ['p', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],

		// Unique style prefix, prepended to a digit, incremented for each encountered user, and stored
		// in ice node class attributes - cts1, cts2, cts3, ...
		stylePrefix: 'cts',
		currentUser: {
			id: null,
			name: null
		},

		// Default change types are insert and delete. Plugins or outside apps should extend this
		// if they want to manage new change types. The changeType name is used as a primary
		// reference for ice nodes; the `alias`, is dropped in the class attribute and is the
		// primary method of identifying ice nodes; and `tag` is used for construction only.
		// Invoking `this.getCleanContent()` will remove all delete type nodes and remove the tags
		// for the other types, leaving the html content in place.
		changeTypes: {
			insertType: {
				tag: 'span',
				alias: 'ins',
				action: 'Inserted'
		},
		deleteType: {
			tag: 'span',
			alias: 'del',
			action: 'Deleted'
		}
	},

	// If `true`, setup event listeners on `this.element` and handle events - good option for a basic
	// setup without a text editor. Otherwise, when set to `false`, events need to be manually passed
	// to `handleEvent`, which is good for a text editor with an event callback handler, like tinymce.
	handleEvents: false,

	// Sets this.element with the contentEditable element
	contentEditable: undefined,//dfl, start with a neutral value

	// Switch for toggling track changes on/off - when `false` events will be ignored.
	isTracking: true,

	// NOT IMPLEMENTED - Selector for elements that will not get track changes
	noTrack: '.ice-no-track',

	// Selector for elements to avoid - move range before or after - similar handling to deletes
	avoid: '.ice-avoid',

	// Switch for whether paragraph breaks should be removed when the user is deleting over a
	// paragraph break while changes are tracked.
	mergeBlocks: true,

	titleTemplate : null, // dfl, no title by default

	isVisible : true, // dfl, state of change tracking visibility

	changeData : null //dfl, a string you can associate with the current change set, e.g. version


	};

	InlineChangeEditor = function (options) {

	// Data structure for modelling changes in the element according to the following model:
	//	[changeid] => {`type`, `time`, `userid`, `username`}
	this._changes = {};
	this._refreshInterval = null; // dfl

	options || (options = {});
	if (!options.element) {
		throw Error("`options.element` must be defined for ice construction.");
	}

	ice.dom.extend(true, this, defaults, options);

	this.pluginsManager = new ice.IcePluginManager(this);
	if (options.plugins) this.pluginsManager.usePlugins('ice-init', options.plugins);
	};

	InlineChangeEditor.prototype = {
	// Tracks all of the styles for users according to the following model:
	//	[userId] => styleId; where style is "this.stylePrefix" + "this.uniqueStyleIndex"
	_userStyles: {},
	_styles: {},

	// Incremented for each new user and appended to they style prefix, and dropped in the
	// ice node class attribute.
	_uniqueStyleIndex: 0,

	_browserType: null,

	// One change may create multiple ice nodes, so this keeps track of the current batch id.
	_batchChangeid: null,

	// Incremented for each new change, dropped in the changeIdAttribute.
	_uniqueIDIndex: 1,

	// Temporary bookmark tags for deletes, when delete placeholding is active.
	_delBookmark: 'tempdel',
	isPlaceHoldingDeletes: false,

	/**
	 * Turns on change tracking - sets up events, if needed, and initializes the environment,
	 * range, and editor.
	 */
	startTracking: function () {
		// dfl:set contenteditable only if it has been explicitly set
		if (typeof(this.contentEditable) == "boolean") {
			this.element.setAttribute('contentEditable', this.contentEditable);
		}

		// If we are handling events setup the delegate to handle various events on `this.element`.
		if (this.handleEvents) {
			var self = this;
			ice.dom.bind(self.element, 'keyup.ice keydown.ice keypress.ice mousedown.ice mouseup.ice', function (e) {
				return self.handleEvent(e);
			});
		}

		this.initializeEnvironment();
		this.initializeEditor();
		this.initializeRange();
		this._setInterval(); //dfl

		this.pluginsManager.fireEnabled(this.element);
		return this;
	},

	/**
	 * Removes contenteditability and stops event handling.
	 * Changed by dfl to have the option of not setting contentEditable
	 */
	stopTracking: function (onlyICE) {

		this._isTracking = false;
		try { // dfl added try/catch for ie
			// If we are handling events setup the delegate to handle various events on `this.element`.
			if (this.element) {
				ice.dom.unbind(this.element, 'keyup.ice keydown.ice keypress.ice mousedown.ice mouseup.ice');
			}

			// dfl:reset contenteditable unless requested not to do so
			if (! onlyICE && (typeof(this.contentEditable) != "undefined")) {
				this.element.setAttribute('contentEditable', !this.contentEditable);
			}
		}
		catch (e){}
		try { // dfl added try/catch for ie8
			this.pluginsManager.fireDisabled(this.element);
		}
		catch(e){}
		this._setInterval();
		return this;
	},

	/**
	 * Initializes the `env` object with pointers to key objects of the page.
	 */
	initializeEnvironment: function () {
		this.env || (this.env = {});
		this.env.element = this.element;
		this.env.document = this.element.ownerDocument;
		this.env.window = this.env.document.defaultView || this.env.document.parentWindow || window;
		this.env.frame = this.env.window.frameElement;
		this.env.selection = this.selection = new ice.Selection(this.env);
		// Hack for using custom tags in IE 8/7
		this.env.document.createElement(this.changeTypes.insertType.tag);
		this.env.document.createElement(this.changeTypes.deleteType.tag);
	},

	/**
	 * Initializes the internal range object and sets focus to the editing element.
	 */
	initializeRange: function () {
		var range = this.selection.createRange();
		range.setStart(ice.dom.find(this.element, this.blockEls.join(', '))[0], 0);
		range.collapse(true);
		this.selection.addRange(range);
		if (this.env.frame) this.env.frame.contentWindow.focus();
		else this.element.focus();
	},

	/**
	 * Initializes the content in the editor - cleans non-block nodes found between blocks and
	 * initializes the editor with any tracking tags found in the editing element.
	 */
	initializeEditor: function () {
		// Clean the element html body - add an empty block if there is no body, or remove any
		// content between elements.
		var self = this,
		body = this.env.document.createElement('div');
		if (this.element.childNodes.length) {
		body.innerHTML = this.element.innerHTML;
		ice.dom.removeWhitespace(body);
		if (body.innerHTML === '') body.appendChild(ice.dom.create('<' + this.blockEl + ' ><br/></' + this.blockEl + '>'));
		} else {
		body.appendChild(ice.dom.create('<' + this.blockEl + ' ><br/></' + this.blockEl + '>'));
		}
		this.element.innerHTML = body.innerHTML;
		this._loadFromDom(); // refactored by dfl
		this._setInterval(); // dfl

	},

	/**
	 * Turn on change tracking and event handling.
	 */
	enableChangeTracking: function () {
		this.isTracking = true;
		this.pluginsManager.fireEnabled(this.element);
	},

	/**
	 * Turn off change tracking and event handling.
	 */
	disableChangeTracking: function () {
		this.isTracking = false;
		this.pluginsManager.fireDisabled(this.element);
	},

	/**
	 * Set the user to be tracked. A user object has the following properties:
	 * {`id`, `name`}
	 */
	setCurrentUser: function (user) {
		this.currentUser = user;
		this._updateUserData(user); // dfl, update data dependant on the user details
	},

	/**
	 * If tracking is on, handles event e when it is one of the following types:
	 * mouseup, mousedown, keypress, keydown, and keyup. Each event type is
	 * propagated to all of the plugins. Prevents default handling if the event
	 * was fully handled.
	 */
	handleEvent: function (e) {
		if (!this.isTracking) return;
		if (e.type == 'mouseup') {
		var self = this;
		setTimeout(function () {
			self.mouseUp(e);
		}, 200);
		} else if (e.type == 'mousedown') {
		return this.mouseDown(e);
		} else if (e.type == 'keypress') {
		var needsToBubble = this.keyPress(e);
		if (!needsToBubble) e.preventDefault();
		return needsToBubble;
		} else if (e.type == 'keydown') {
		var needsToBubble = this.keyDown(e);
		if (!needsToBubble) e.preventDefault();
		return needsToBubble;
		} else if (e.type == 'keyup') {
		this.pluginsManager.fireCaretUpdated();
		}
	},

	/**
	 * Returns a tracking tag for the given `changeType`, with the optional `childNode` appended.
	 */
	createIceNode: function (changeType, childNode) {
		var node = this.env.document.createElement(this.changeTypes[changeType].tag);
		ice.dom.addClass(node, this._getIceNodeClass(changeType));

		node.appendChild(childNode ? childNode : this.env.document.createTextNode(''));
		this.addChange(this.changeTypes[changeType].alias, [node]);

		this.pluginsManager.fireNodeCreated(node, {
		'action': this.changeTypes[changeType].action
		});
		return node;
	},

	/**
	 * Inserts the given string/node into the given range with tracking tags, collapsing (deleting)
	 * the range first if needed. If range is undefined, then the range from the Selection object
	 * is used. If the range is in a parent delete node, then the range is positioned after the delete.
	 */
	insert: function (node, range) {
		// If the node is not defined, then we need to insert an
		// invisible space and force propagation to the browser.
		var isPropagating = !node;
		node || (node = '\uFEFF');

		if (range) this.selection.addRange(range);
		else range = this.getCurrentRange();

		if (typeof node === "string") {
		node = document.createTextNode(node);
		}

		// If we have any nodes selected, then we want to delete them before inserting the new text.
		if (!range.collapsed) {
		this.deleteContents();
		// Update the range
		range = this.getCurrentRange();
		if (range.startContainer === range.endContainer && this.element === range.startContainer) {
			// The whole editable element is selected. Need to remove everything and init its contents.
			ice.dom.empty(this.element);
			var firstSelectable = range.getLastSelectableChild(this.element);
			range.setStartAfter(firstSelectable);
			range.collapse(true);
		}
		}

		// If we are in a non-tracking/void element, move the range to the end/outside.
		this._moveRangeToValidTrackingPos(range);

		var changeid = this.startBatchChange();
		// Send a dummy node to be inserted, if node is undefined
		this._insertNode(node, range, isPropagating);
		this.pluginsManager.fireNodeInserted(node, range);
		this.endBatchChange(changeid);
		return isPropagating;
	},

	/**
	 * This command will drop placeholders in place of delete tags in the element
	 * body and store references in the `_deletes` array to the original delete nodes.
	 *
	 * A placeholder tag is of the following structure:
	 *	 <tempdel data-allocation="[NUM]" />
	 * Where [NUM] is the referenced allocation in the `_deletes` array where the
	 * original delete node is stored.
	 */
	placeholdDeletes: function () {
		var self = this;
		if (this.isPlaceholdingDeletes) {
		this.revertDeletePlaceholders();
		}
		this.isPlaceholdingDeletes = true;
		this._deletes = [];
		var deleteSelector = '.' + this._getIceNodeClass('deleteType');
		ice.dom.each(ice.dom.find(this.element, deleteSelector), function (i, el) {
		self._deletes.push(ice.dom.cloneNode(el));
		ice.dom.replaceWith(el, '<' + self._delBookmark + ' data-allocation="' + (self._deletes.length - 1) + '"/>');
		});
		return true;
	},

	/**
	 * Replaces all delete placeholders in the element body with the referenced
	 * delete nodes in the `_deletes` array.
	 *
	 * A placeholder tag is of the following structure:
	 *	 <tempdel data-allocation="[NUM]" />
	 * Where [NUM] is the referenced allocation in the `_deletes` array where the
	 * original delete node is stored.
	 */
	revertDeletePlaceholders: function () {
		var self = this;
		if (!this.isPlaceholdingDeletes) {
		return false;
		}
		ice.dom.each(this._deletes, function (i, el) {
		ice.dom.find(self.element, self._delBookmark + '[data-allocation=' + i + ']').replaceWith(el);
		});
		this.isPlaceholdingDeletes = false;
		return true;
	},

	/**
	 * Deletes the contents in the given range or the range from the Selection object. If the range
	 * is not collapsed, then a selection delete is handled; otherwise, it deletes one character
	 * to the left or right if the right parameter is false or true, respectively.
	 *
	 * @return true if deletion was handled.
	 */
	deleteContents: function (right, range) {
		var prevent = true;
		if (range) {
		this.selection.addRange(range);
		} else {
		range = this.getCurrentRange();
		}
		var changeid = this.startBatchChange(this.changeTypes['deleteType'].alias);
		if (range.collapsed === false) {
		this._deleteSelection(range);
		} else {
		if (right) prevent = this._deleteRight(range);
		else prevent = this._deleteLeft(range);
		}
		this.selection.addRange(range);
		this.endBatchChange(changeid);
		return prevent;
	},

	/**
	 * Returns the changes - a hash of objects with the following properties:
	 * [changeid] => {`type`, `time`, `userid`, `username`}
	 */
	getChanges: function () {
		return this._changes;
	},

	/**
	 * Returns an array with the user ids who made the changes
	 */
	getChangeUserids: function () {
		var result = [];
		var keys = Object.keys(this._changes);

		for (var key in keys)
		result.push(this._changes[keys[key]].userid);

		return result.sort().filter(function (el, i, a) {
		if (i == a.indexOf(el)) return 1;
		return 0;
		});
	},

	/**
	 * Returns the html contents for the tracked element.
	 */
	getElementContent: function () {
		return this.element.innerHTML;
	},

	/**
	 * Returns the html contents, without tracking tags, for `this.element` or
	 * the optional `body` param which can be of either type string or node.
	 * Delete tags, and their html content, are completely removed; all other
	 * change type tags are removed, leaving the html content in place. After
	 * cleaning, the optional `callback` is executed, which should further
	 * modify and return the element body.
	 *
	 * prepare gets run before the body is cleaned by ice.
	 */
	getCleanContent: function (body, callback, prepare) {
		var classList = '';
		var self = this;
		ice.dom.each(this.changeTypes, function (type, i) {
		if (type != 'deleteType') {
			if (i > 0) classList += ',';
			classList += '.' + self._getIceNodeClass(type);
		}
		});
		if (body) {
		if (typeof body === 'string') body = ice.dom.create('<div>' + body + '</div>');
		else body = ice.dom.cloneNode(body, false)[0];
		} else {
		body = ice.dom.cloneNode(this.element, false)[0];
		}
		body = prepare ? prepare.call(this, body) : body;
		var changes = ice.dom.find(body, classList);
		ice.dom.each(changes, function (el, i) {
		ice.dom.replaceWith(this, ice.dom.contents(this));
		});
		var deletes = ice.dom.find(body, '.' + this._getIceNodeClass('deleteType'));
		ice.dom.remove(deletes);

		body = callback ? callback.call(this, body) : body;

		return body.innerHTML;
	},

	/**
	 * Accepts all changes in the element body - removes delete nodes, and removes outer
	 * insert tags keeping the inner content in place.
	 * dfl:added support for filtering
	 */
	acceptAll: function (options) {
		if (options) {
			return this._acceptRejectSome(options, true);
		}
		else {
			this.element.innerHTML = this.getCleanContent();
			this._changes = {}; // dfl, reset the changes table
			this._triggerChange(); // notify the world that our change count has changed
		}
	},

	/**
	 * Rejects all changes in the element body - removes insert nodes, and removes outer
	 * delete tags keeping the inner content in place.*
	 * dfl:added support for filtering
	 */
	rejectAll: function (options) {
		if (options) {
			return this._acceptRejectSome(options, false);
		}
		else {
			var insSel = '.' + this._getIceNodeClass('insertType');
			var delSel = '.' + this._getIceNodeClass('deleteType');

			ice.dom.remove(ice.dom.find(this.element, insSel));
			ice.dom.each(ice.dom.find(this.element, delSel), function (i, el) {
				ice.dom.replaceWith(el, ice.dom.contents(el));
			});
			this._changes = {}; // dfl, reset the changes table
			this._triggerChange(); // notify the world that our change count has changed
		}
	},

	/**
	 * Accepts the change at the given, or first tracking parent node of, `node`.	If
	 * `node` is undefined then the startContainer of the current collapsed range will be used.
	 * In the case of insert, inner content will be used to replace the containing tag; and in
	 * the case of delete, the node will be removed.
	 */
	acceptChange: function (node) {
		this.acceptRejectChange(node, true);
	},

	/**
	 * Rejects the change at the given, or first tracking parent node of, `node`.	If
	 * `node` is undefined then the startContainer of the current collapsed range will be used.
	 * In the case of delete, inner content will be used to replace the containing tag; and in
	 * the case of insert, the node will be removed.
	 */
	rejectChange: function (node) {
		this.acceptRejectChange(node, false);
	},

	/**
	 * Handles accepting or rejecting tracking changes
	 */
	acceptRejectChange: function (node, isAccept) {
		var delSel, insSel, selector, removeSel, replaceSel, trackNode, changes, dom = ice.dom;

		if (!node) {
			var range = this.getCurrentRange();
			if (!range.collapsed) return;
			else node = range.startContainer;
		}

		delSel = removeSel = '.' + this._getIceNodeClass('deleteType');
		insSel = replaceSel = '.' + this._getIceNodeClass('insertType');
		selector = delSel + ',' + insSel;
		trackNode = dom.getNode(node, selector);
		var changeId = dom.attr(trackNode, this.changeIdAttribute); //dfl
			// Some changes are done in batches so there may be other tracking
			// nodes with the same `changeIdAttribute` batch number.
		changes = dom.find(this.element, '[' + this.changeIdAttribute + '=' + changeId + ']');

		if (!isAccept) {
			removeSel = insSel;
			replaceSel = delSel;
		}

		if (ice.dom.is(trackNode, replaceSel)) {
				dom.each(changes, function (i, node) {
				dom.replaceWith(node, ice.dom.contents(node));
			});
		} else if (dom.is(trackNode, removeSel)) {
			dom.remove(changes);
		}
		else { // dfl: this is not an ICE node
			return;
		}
		/* begin dfl: remove change if no more nodes with this changeid, trigger change event */
		if (changes.length <= 1) {
			delete this._changes[changeId];
		}
		this._triggerChange();
		/* end dfl */
	},

	/**
	 * Returns true if the given `node`, or the current collapsed range is in a tracking
	 * node; otherwise, false.
	 */
	isInsideChange: function (node) {
		try {
			return !! this.currentChangeNode(node); // refactored by dfl
		}
		catch (e) {
			return false;
		}
	},

	/**
	 * Add a new change tracking typeName with the given tag and alias.
	 */
	addChangeType: function (typeName, tag, alias, action) {
		var changeType = {
		tag: tag,
		alias: alias
		};

		if (action) changeType.action = action;

		this.changeTypes[typeName] = changeType;
	},

	/**
	 * Returns this `node` or the first parent tracking node with the given `changeType`.
	 */
	getIceNode: function (node, changeType) {
		var selector = '.' + this._getIceNodeClass(changeType);
		return ice.dom.getNode(node, selector);
	},

	/**
	 * Sets the given `range` to the first position, to the right, where it is outside of
	 * void elements.
	 */
	_moveRangeToValidTrackingPos: function (range) {
		var onEdge = false;
		var voidEl = this._getVoidElement(range.endContainer);
		while (voidEl) {
		// Move end of range to position it inside of any potential adjacent containers
		// E.G.:	test|<em>text</em>	->	test<em>|text</em>
		try {
			range.moveEnd(ice.dom.CHARACTER_UNIT, 1);
			range.moveEnd(ice.dom.CHARACTER_UNIT, -1);
		} catch (e) {
			// Moving outside of the element and nothing is left on the page
			onEdge = true;
		}
		if (onEdge || ice.dom.onBlockBoundary(range.endContainer, range.startContainer, this.blockEls)) {
			range.setStartAfter(voidEl);
			range.collapse(true);
			break;
		}
		voidEl = this._getVoidElement(range.endContainer);
		if (voidEl) {
			range.setEnd(range.endContainer, 0);
			range.moveEnd(ice.dom.CHARACTER_UNIT, ice.dom.getNodeCharacterLength(range.endContainer));
			range.collapse();
		} else {
			range.setStart(range.endContainer, 0);
			range.collapse(true);
		}
		}
	},

	/**
	 * Returns the given `node` or the first parent node that matches against the list of no track elements.
	 */
	_getNoTrackElement: function (node) {
		var noTrackSelector = this._getNoTrackSelector();
		var parent = ice.dom.is(node, noTrackSelector) ? node : (ice.dom.parents(node, noTrackSelector)[0] || null);
		return parent;
	},

	/**
	 * Returns a selector for not tracking changes
	 */
	_getNoTrackSelector: function () {
		return this.noTrack;
	},

	/**
	 * Returns the given `node` or the first parent node that matches against the list of void elements.
	 * dfl: added try/catch
	 */
	_getVoidElement: function (node) {
		try {
			var voidSelector = this._getVoidElSelector();
			return ice.dom.is(node, voidSelector) ? node : (ice.dom.parents(node, voidSelector)[0] || null);
		}
		catch(e) {
			return null;
		}
	},

	/**
	 * Returns a combined selector for delete and void elements.
	 */
	_getVoidElSelector: function () {
		return '.' + this._getIceNodeClass('deleteType') + ',' + this.avoid;
	},

	/**
	 * Returns true if node has a user id attribute that matches the current user id.
	 */
	_currentUserIceNode: function (node) {
		return ice.dom.attr(node, this.userIdAttribute) == this.currentUser.id;
	},

	/**
	 * With the given alias, searches the changeTypes objects and returns the
	 * associated key for the alias.
	 */
	_getChangeTypeFromAlias: function (alias) {
		var type, ctnType = null;
		for (type in this.changeTypes) {
			if (this.changeTypes.hasOwnProperty(type)) {
				if (this.changeTypes[type].alias == alias) {
					ctnType = type;
				}
			}
		}

		return ctnType;
	},

	_getIceNodeClass: function (changeType) {
		return this.attrValuePrefix + this.changeTypes[changeType].alias;
	},

	getUserStyle: function (userid) {
		var styleIndex = null;
		if (this._userStyles[userid]) styleIndex = this._userStyles[userid];
		else styleIndex = this.setUserStyle(userid, this.getNewStyleId());
		return styleIndex;
	},

	setUserStyle: function (userid, styleIndex) {
		var style = this.stylePrefix + '-' + styleIndex;
		if (!this._styles[styleIndex]) this._styles[styleIndex] = true;
		return this._userStyles[userid] = style;
	},

	getNewStyleId: function () {
		var id = ++this._uniqueStyleIndex;
		if (this._styles[id]) {
		// Dupe.. create another..
		return this.getNewStyleId();
		} else {
		this._styles[id] = true;
		return id;
		}
	},

	addChange: function (ctnType, ctNodes) {
		var changeid = this._batchChangeid || this.getNewChangeId();
		if (!this._changes[changeid]) {
			// Create the change object.
			this._changes[changeid] = {
				type: this._getChangeTypeFromAlias(ctnType),
				time: (new Date()).getTime(),
				userid: String(this.currentUser.id),// dfl: must stringify for consistency - when we read the props from dom attrs they are strings
				username: this.currentUser.name,
				data : this.changeData || ""
			};
			this._triggerChange(); //dfl
		}
		var self = this;
		ice.dom.foreach(ctNodes, function (i) {
			self.addNodeToChange(changeid, ctNodes[i]);
		});

		return changeid;
	},

	/**
	 * Adds tracking attributes from the change with changeid to the ctNode.
	 * @param changeid Id of an existing change.
	 * @param ctNode The element to add for the change.
	 */
	addNodeToChange: function (changeid, ctNode) {
		if (this._batchChangeid !== null) changeid = this._batchChangeid;

		var change = this.getChange(changeid);

		if (!ctNode.getAttribute(this.changeIdAttribute)) ctNode.setAttribute(this.changeIdAttribute, changeid);
// modified by dfl, handle missing userid, try to set username according to userid
		var userId = ctNode.getAttribute(this.userIdAttribute);
		if (! userId) {
			ctNode.setAttribute(this.userIdAttribute, userId = change.userid);
		}
		if (userId == change.userid) {
			ctNode.setAttribute(this.userNameAttribute, change.username);
		}

// dfl add change data
		var changeData = ctNode.getAttribute(this.changeDataAttribute);
		if (null == changeData) {
			ctNode.setAttribute(this.changeDataAttribute, this.changeData || "");
		}

		if (!ctNode.getAttribute(this.timeAttribute)) ctNode.setAttribute(this.timeAttribute, change.time);

		if (!ice.dom.hasClass(ctNode, this._getIceNodeClass(change.type))) ice.dom.addClass(ctNode, this._getIceNodeClass(change.type));

		var style = this.getUserStyle(change.userid);
		if (!ice.dom.hasClass(ctNode, style)) ice.dom.addClass(ctNode, style);
		/* Added by dfl */
		this._setNodeTitle(ctNode, change);
	},

	getChange: function (changeid) {
		var change = null;
		if (this._changes[changeid]) {
		change = this._changes[changeid];
		}
		return change;
	},

	getNewChangeId: function () {
		var id = ++this._uniqueIDIndex;
		if (this._changes[id]) {
		// Dupe.. create another..
		id = this.getNewChangeId();
		}
		return id;
	},

	startBatchChange: function () {
		this._batchChangeid = this.getNewChangeId();
		return this._batchChangeid;
	},

	endBatchChange: function (changeid) {
		if (changeid !== this._batchChangeid) return;
		this._batchChangeid = null;
	},

	getCurrentRange: function () {
		try {
			return this.selection.getRangeAt(0);
		}
		catch (e) {
			return null;
		}
	},

	_insertNode: function (node, range, insertingDummy) {
		var origNode = node;
		if (!ice.dom.isBlockElement(range.startContainer) && !ice.dom.canContainTextElement(ice.dom.getBlockParent(range.startContainer, this.element)) && range.startContainer.previousSibling) {
		range.setStart(range.startContainer.previousSibling, 0);

		}
		var startContainer = range.startContainer;
		var parentBlock = ice.dom.isBlockElement(range.startContainer) && range.startContainer || ice.dom.getBlockParent(range.startContainer, this.element) || null;
		if (parentBlock === this.element) {
		var firstPar = document.createElement(this.blockEl);
		parentBlock.appendChild(firstPar);
		range.setStart(firstPar, 0);
		range.collapse();
		return this._insertNode(node, range, insertingDummy);
		}
		if (ice.dom.hasNoTextOrStubContent(parentBlock)) {
		ice.dom.empty(parentBlock);
		ice.dom.append(parentBlock, '<br>');
		range.setStart(parentBlock, 0);
		}

		var ctNode = this.getIceNode(range.startContainer, 'insertType');
		var inCurrentUserInsert = this._currentUserIceNode(ctNode);

		// Do nothing, let this bubble-up to insertion handler.
		if (insertingDummy && inCurrentUserInsert) return;
		// If we aren't in an insert node which belongs to the current user, then create a new ins node
		else if (!inCurrentUserInsert) node = this.createIceNode('insertType', node);

		range.insertNode(node);
		range.setEnd(node, 1);

		if (insertingDummy) {
		// Create a selection of the dummy character we inserted
		// which will be removed after it bubbles up to the final handler.
		range.setStart(node, 0);
		} else {
		range.collapse();
		}

		this.selection.addRange(range);
	},

	_handleVoidEl: function(el, range) {
		// If `el` is or is in a void element, but not a delete
		// then collapse the `range` and return `true`.
		var voidEl = this._getVoidElement(el);
		if (voidEl && !this.getIceNode(voidEl, 'deleteType')) {
		range.collapse(true);
		return true;
		}
		return false;
	},

	_deleteSelection: function (range) {

		// Bookmark the range and get elements between.
		var bookmark = new ice.Bookmark(this.env, range),
		elements = ice.dom.getElementsBetween(bookmark.start, bookmark.end),
		b1 = ice.dom.parents(range.startContainer, this.blockEls.join(', '))[0],
		b2 = ice.dom.parents(range.endContainer, this.blockEls.join(', '))[0],
		betweenBlocks = new Array();

		for (var i = 0; i < elements.length; i++) {
		var elem = elements[i];
		if (ice.dom.isBlockElement(elem)) {
			betweenBlocks.push(elem);
			if (!ice.dom.canContainTextElement(elem)) {
			// Ignore containers that are not supposed to contain text. Check children instead.
			for (var k = 0; k < elem.childNodes.length; k++) {
				elements.push(elem.childNodes[k]);
			}
			continue;
			}
		}
		// Ignore empty space nodes
		if (elem.nodeType === ice.dom.TEXT_NODE && ice.dom.getNodeTextContent(elem).length === 0) continue;

		if (!this._getVoidElement(elem)) {
			// If the element is not a text or stub node, go deeper and check the children.
			if (elem.nodeType !== ice.dom.TEXT_NODE) {
			// Browsers like to insert breaks into empty paragraphs - remove them
			if (ice.dom.BREAK_ELEMENT == ice.dom.getTagName(elem)) {
				continue;
			}

			if (ice.dom.isStubElement(elem)) {
				this._addNodeTracking(elem, false, true);
				continue;
			}
			if (ice.dom.hasNoTextOrStubContent(elem)) {
				ice.dom.remove(elem);
			}

			for (j = 0; j < elem.childNodes.length; j++) {
				var child = elem.childNodes[j];
				elements.push(child);
			}
			continue;
			}
			var parentBlock = ice.dom.getBlockParent(elem);
			this._addNodeTracking(elem, false, true, true);
			if (ice.dom.hasNoTextOrStubContent(parentBlock)) {
			ice.dom.remove(parentBlock);
			}
		}
		}

		if (this.mergeBlocks && b1 !== b2) {
		while (betweenBlocks.length)
			ice.dom.mergeContainers(betweenBlocks.shift(), b1);
		ice.dom.removeBRFromChild(b2);
		ice.dom.removeBRFromChild(b1);
		ice.dom.mergeContainers(b2, b1);
		}

		bookmark.selectBookmark();
		range.collapse(false);
	},

	// Delete
	_deleteRight: function (range) {

		var parentBlock = ice.dom.isBlockElement(range.startContainer) && range.startContainer || ice.dom.getBlockParent(range.startContainer, this.element) || null,
		isEmptyBlock = parentBlock ? (ice.dom.hasNoTextOrStubContent(parentBlock)) : false,
		nextBlock = parentBlock && ice.dom.getNextContentNode(parentBlock, this.element),
		nextBlockIsEmpty = nextBlock ? (ice.dom.hasNoTextOrStubContent(nextBlock)) : false,
		initialContainer = range.endContainer,
		initialOffset = range.endOffset,
		commonAncestor = range.commonAncestorContainer,
		nextContainer, returnValue;


		// If the current block is empty then let the browser handle the delete/event.
		if (isEmptyBlock) return false;

		// Some bugs in Firefox and Webkit make the caret disappear out of text nodes, so we try to put them back in.
		if (commonAncestor.nodeType !== ice.dom.TEXT_NODE) {

		// If placed at the beginning of a container that cannot contain text, such as an ul element, place the caret at the beginning of the first item.
		if (initialOffset === 0 && ice.dom.isBlockElement(commonAncestor) && (!ice.dom.canContainTextElement(commonAncestor))) {
			var firstItem = commonAncestor.firstElementChild;
			if (firstItem) {
			range.setStart(firstItem, 0);
			range.collapse();
			return this._deleteRight(range);
			}
		}

		if (commonAncestor.childNodes.length > initialOffset) {
			var tempTextContainer = document.createTextNode(' ');
			commonAncestor.insertBefore(tempTextContainer, commonAncestor.childNodes[initialOffset]);
			range.setStart(tempTextContainer, 1);
			range.collapse(true);
			returnValue = this._deleteRight(range);
			ice.dom.remove(tempTextContainer);
			return returnValue;
		} else {
			nextContainer = ice.dom.getNextContentNode(commonAncestor, this.element);
			range.setEnd(nextContainer, 0);
			range.collapse();
			return this._deleteRight(range);
		}
		}

		// Move range to position the cursor on the inside of any adjacent container that it is going
		// to potentially delete into or after a stub element.	E.G.:	test|<em>text</em>	->	test<em>|text</em> or
		// text1 |<img> text2 -> text1 <img>| text2

		// Merge blocks: If mergeBlocks is enabled, merge the previous and current block.
		range.moveEnd(ice.dom.CHARACTER_UNIT, 1);
		range.moveEnd(ice.dom.CHARACTER_UNIT, -1);

		// Handle cases of the caret is at the end of a container or placed directly in a block element
		if (initialOffset === initialContainer.data.length && (!ice.dom.hasNoTextOrStubContent(initialContainer))) {
		nextContainer = ice.dom.getNextNode(initialContainer, this.element);

		// If the next container is outside of ICE then do nothing.
		if (!nextContainer) {
			range.selectNodeContents(initialContainer);
			range.collapse();
			return false;
		}

		// If the next container is <br> element find the next node
		if (ice.dom.BREAK_ELEMENT == ice.dom.getTagName(nextContainer)) {
			nextContainer = ice.dom.getNextNode(nextContainer, this.element);
		}

		// If the next container is a text node, look at the parent node instead.
		if (nextContainer.nodeType === ice.dom.TEXT_NODE) {
			nextContainer = nextContainer.parentNode;
		}

		// If the next container is non-editable, enclose it with a delete ice node and add an empty text node after it to position the caret.
		if (!nextContainer.isContentEditable) {
			returnValue = this._addNodeTracking(nextContainer, false, false);
			var emptySpaceNode = document.createTextNode('');
			nextContainer.parentNode.insertBefore(emptySpaceNode, nextContainer.nextSibling);
			range.selectNode(emptySpaceNode);
			range.collapse(true);
			return returnValue;
		}

		if (this._handleVoidEl(nextContainer, range)) return true;

		// If the caret was placed directly before a stub element, enclose the element with a delete ice node.
		if (ice.dom.isChildOf(nextContainer, parentBlock) && ice.dom.isStubElement(nextContainer)) {
			return this._addNodeTracking(nextContainer, range, false);
		}

		}

		if (this._handleVoidEl(nextContainer, range)) return true;

		// If we are deleting into a no tracking containiner, then remove the content
		if (this._getNoTrackElement(range.endContainer.parentElement)) {
		range.deleteContents();
		return false;
		}

		if (ice.dom.isOnBlockBoundary(range.startContainer, range.endContainer, this.element)) {
		if (this.mergeBlocks && ice.dom.is(ice.dom.getBlockParent(nextContainer, this.element), this.blockEl)) {
			// Since the range is moved by character, it may have passed through empty blocks.
			// <p>text {RANGE.START}</p><p></p><p>{RANGE.END} text</p>
			if (nextBlock !== ice.dom.getBlockParent(range.endContainer, this.element)) {
			range.setEnd(nextBlock, 0);
			}
			// The browsers like to auto-insert breaks into empty paragraphs - remove them.
			var elements = ice.dom.getElementsBetween(range.startContainer, range.endContainer);
			for (var i = 0; i < elements.length; i++) {
			ice.dom.remove(elements[i]);
			}
			var startContainer = range.startContainer;
			var endContainer = range.endContainer;
			ice.dom.remove(ice.dom.find(startContainer, 'br'));
			ice.dom.remove(ice.dom.find(endContainer, 'br'));
			return ice.dom.mergeBlockWithSibling(range, ice.dom.getBlockParent(range.endContainer, this.element) || parentBlock);
		} else {
			// If the next block is empty, remove the next block.
			if (nextBlockIsEmpty) {
			ice.dom.remove(nextBlock);
			range.collapse(true);
			return true;
			}

			// Place the caret at the start of the next block.
			range.setStart(nextBlock, 0);
			range.collapse(true);
			return true;
		}
		}

		var entireTextNode = range.endContainer;
		var deletedCharacter = entireTextNode.splitText(range.endOffset);
		var remainingTextNode = deletedCharacter.splitText(1);

		return this._addNodeTracking(deletedCharacter, range, false);

	},

	// Backspace
	_deleteLeft: function (range) {

		var parentBlock = ice.dom.isBlockElement(range.startContainer) && range.startContainer || ice.dom.getBlockParent(range.startContainer, this.element) || null,
		isEmptyBlock = parentBlock ? ice.dom.hasNoTextOrStubContent(parentBlock) : false,
		prevBlock = parentBlock && ice.dom.getPrevContentNode(parentBlock, this.element), // || ice.dom.getBlockParent(parentBlock, this.element) || null,
		prevBlockIsEmpty = prevBlock ? ice.dom.hasNoTextOrStubContent(prevBlock) : false,
		initialContainer = range.startContainer,
		initialOffset = range.startOffset,
		commonAncestor = range.commonAncestorContainer,
		lastSelectable, prevContainer;

		// If the current block is empty, then let the browser handle the key/event.
		if (isEmptyBlock) return false;

		// Handle cases of the caret is at the start of a container or outside a text node
		if (initialOffset === 0 || commonAncestor.nodeType !== ice.dom.TEXT_NODE) {
		// If placed at the end of a container that cannot contain text, such as an ul element, place the caret at the end of the last item.
		if (ice.dom.isBlockElement(commonAncestor) && (!ice.dom.canContainTextElement(commonAncestor))) {
			if (initialOffset === 0) {
			var firstItem = commonAncestor.firstElementChild;
			if (firstItem) {
				range.setStart(firstItem, 0);
				range.collapse();
				return this._deleteLeft(range);
			}

			} else {
			var lastItem = commonAncestor.lastElementChild;
			if (lastItem) {

				lastSelectable = range.getLastSelectableChild(lastItem);
				if (lastSelectable) {
				range.setStart(lastSelectable, lastSelectable.data.length);
				range.collapse();
				return this._deleteLeft(range);
				}
			}
			}
		}

		if (initialOffset === 0) {
			prevContainer = ice.dom.getPrevContentNode(initialContainer, this.element);
		} else {
			prevContainer = commonAncestor.childNodes[initialOffset - 1];
		}

		// If the previous container is outside of ICE then do nothing.
		if (!prevContainer) {
			return false;
		}

		// Firefox finds an ice node wrapped around an image instead of the image itself sometimes, so we make sure to look at the image instead.
		if (ice.dom.is(prevContainer,	'.' + this._getIceNodeClass('insertType') + ', .' + this._getIceNodeClass('deleteType')) && prevContainer.childNodes.length > 0 && prevContainer.lastChild) {
			prevContainer = prevContainer.lastChild;
		}

		// If the previous container is a text node, look at the parent node instead.
		if (prevContainer.nodeType === ice.dom.TEXT_NODE) {
			prevContainer = prevContainer.parentNode;
		}

		// If the previous container is non-editable, enclose it with a delete ice node and add an empty text node before it to position the caret.
		if (!prevContainer.isContentEditable) {
			var returnValue = this._addNodeTracking(prevContainer, false, true);
			var emptySpaceNode = document.createTextNode('');
			prevContainer.parentNode.insertBefore(emptySpaceNode, prevContainer);
			range.selectNode(emptySpaceNode);
			range.collapse(true);
			return returnValue;
		}

		if (this._handleVoidEl(prevContainer, range)) return true;

		// If the caret was placed directly after a stub element, enclose the element with a delete ice node.
		if (ice.dom.isStubElement(prevContainer) && ice.dom.isChildOf(prevContainer, parentBlock) || !prevContainer.isContentEditable) {
			 return this._addNodeTracking(prevContainer, range, true);
		}

		// If the previous container is a stub element between blocks
		// then just delete and leave the range/cursor in place.
		if (ice.dom.isStubElement(prevContainer)) {
			ice.dom.remove(prevContainer);
			range.collapse(true);
			return false;
		}

		if (prevContainer !== parentBlock && !ice.dom.isChildOf(prevContainer, parentBlock)) {

			if (!ice.dom.canContainTextElement(prevContainer)) {
			prevContainer = prevContainer.lastElementChild;
			}
			// Before putting the caret into the last selectable child, lets see if the last element is a stub element. If it is, we need to put the caret there manually.
			if (prevContainer.lastChild && prevContainer.lastChild.nodeType !== ice.dom.TEXT_NODE && ice.dom.isStubElement(prevContainer.lastChild) && prevContainer.lastChild.tagName !== 'BR') {
			range.setStartAfter(prevContainer.lastChild);
			range.collapse(true);
			return true;
			}
			// Find the last selectable part of the prevContainer. If it exists, put the caret there.
			lastSelectable = range.getLastSelectableChild(prevContainer);

			if (lastSelectable && !ice.dom.isOnBlockBoundary(range.startContainer, lastSelectable, this.element)) {
			range.selectNodeContents(lastSelectable);
			range.collapse();
			return true;
			}
		}
		}

		// Firefox: If an image is at the start of the paragraph and the user has just deleted the image using backspace, an empty text node is created in the delete node before
		// the image, but the caret is placed with the image. We move the caret to the empty text node and execute deleteFromLeft again.
		if (initialOffset === 1 && !ice.dom.isBlockElement(commonAncestor) && range.startContainer.childNodes.length > 1 && range.startContainer.childNodes[0].nodeType === ice.dom.TEXT_NODE && range.startContainer.childNodes[0].data.length === 0) {
		range.setStart(range.startContainer, 0);
		return this._deleteLeft(range);
		}

		// Move range to position the cursor on the inside of any adjacent container that it is going
		// to potentially delete into or before a stub element.	E.G.: <em>text</em>| test	->	<em>text|</em> test or
		// text1 <img>| text2 -> text1 |<img> text2
		range.moveStart(ice.dom.CHARACTER_UNIT, -1);
		range.moveStart(ice.dom.CHARACTER_UNIT, 1);

		// If we are deleting into a no tracking containiner, then remove the content
		if (this._getNoTrackElement(range.startContainer.parentElement)) {
		range.deleteContents();
		return false;
		}

		// Handles cases in which the caret is at the start of the block.
		if (ice.dom.isOnBlockBoundary(range.startContainer, range.endContainer, this.element)) {

		// If the previous block is empty, remove the previous block.
		if (prevBlockIsEmpty) {
			ice.dom.remove(prevBlock);
			range.collapse();
			return true;
		}

		// Merge blocks: If mergeBlocks is enabled, merge the previous and current block.
		if (this.mergeBlocks && ice.dom.is(ice.dom.getBlockParent(prevContainer, this.element), this.blockEl)) {
			// Since the range is moved by character, it may have passed through empty blocks.
			// <p>text {RANGE.START}</p><p></p><p>{RANGE.END} text</p>
			if (prevBlock !== ice.dom.getBlockParent(range.startContainer, this.element)) {
			range.setStart(prevBlock, prevBlock.childNodes.length);
			}
			// The browsers like to auto-insert breaks into empty paragraphs - remove them.
			var elements = ice.dom.getElementsBetween(range.startContainer, range.endContainer)
			for (var i = 0; i < elements.length; i++) {
			ice.dom.remove(elements[i]);
			}
			var startContainer = range.startContainer;
			var endContainer = range.endContainer;
			ice.dom.remove(ice.dom.find(startContainer, 'br'));
			ice.dom.remove(ice.dom.find(endContainer, 'br'));
			return ice.dom.mergeBlockWithSibling(range, ice.dom.getBlockParent(range.endContainer, this.element) || parentBlock);
		}

		// If the previous Block ends with a stub element, set the caret behind it.
		if (prevBlock && prevBlock.lastChild && ice.dom.isStubElement(prevBlock.lastChild)) {
			range.setStartAfter(prevBlock.lastChild);
			range.collapse(true);
			return true;
		}

		// Place the caret at the end of the previous block.
		lastSelectable = range.getLastSelectableChild(prevBlock);
		if (lastSelectable) {
			range.setStart(lastSelectable, lastSelectable.data.length);
			range.collapse(true);
		} else if (prevBlock) {
			range.setStart(prevBlock, prevBlock.childNodes.length);
			range.collapse(true);
		}

		return true;
		}

		var entireTextNode = range.startContainer;
		var deletedCharacter = entireTextNode.splitText(range.startOffset - 1);
		var remainingTextNode = deletedCharacter.splitText(1);

		return this._addNodeTracking(deletedCharacter, range, true);

	},

	// Marks text and other nodes for deletion
	_addNodeTracking: function (contentNode, range, moveLeft) {

		var contentAddNode = this.getIceNode(contentNode, 'insertType');

		if (contentAddNode && this._currentUserIceNode(contentAddNode)) {
		if (range && moveLeft) {
			range.selectNode(contentNode);
		}
		contentNode.parentNode.removeChild(contentNode);
		var cleanNode = ice.dom.cloneNode(contentAddNode);
		ice.dom.remove(ice.dom.find(cleanNode, '.iceBookmark'));
		// Remove a potential empty tracking container
		if (contentAddNode !== null && (ice.dom.hasNoTextOrStubContent(cleanNode[0]))) {
			var newstart = this.env.document.createTextNode('');
			ice.dom.insertBefore(contentAddNode, newstart);
			if (range) {
			range.setStart(newstart, 0);
			range.collapse(true);
			}
			ice.dom.replaceWith(contentAddNode, ice.dom.contents(contentAddNode));
		}

		return true;

		} else if (range && this.getIceNode(contentNode, 'deleteType')) {
		// It if the contentNode a text node, unite it with text nodes before and after it.
		contentNode.normalize();

		var found = false;
		if (moveLeft) {
			// Move to the left until there is valid sibling.
			var previousSibling = ice.dom.getPrevContentNode(contentNode, this.element);
			while (!found) {
			ctNode = this.getIceNode(previousSibling, 'deleteType');
			if (!ctNode) {
				found = true;
			} else {
				previousSibling = ice.dom.getPrevContentNode(previousSibling, this.element);
			}
			}
			if (previousSibling) {
			var lastSelectable = range.getLastSelectableChild(previousSibling);
			if (lastSelectable) {
				previousSibling = lastSelectable;
			}
			range.setStart(previousSibling, ice.dom.getNodeCharacterLength(previousSibling));
			range.collapse(true);
			}
			return true;
		} else {
			// Move the range to the right until there is valid sibling.

			var nextSibling = ice.dom.getNextContentNode(contentNode, this.element);
			while (!found) {
			ctNode = this.getIceNode(nextSibling, 'deleteType');
			if (!ctNode) {
				found = true;
			} else {
				nextSibling = ice.dom.getNextContentNode(nextSibling, this.element);
			}
			}

			if (nextSibling) {
			range.selectNodeContents(nextSibling);
			range.collapse(true);
			}
			return true;
		}

		}
		// Webkit likes to insert empty text nodes next to elements. We remove them here.
		if (contentNode.previousSibling && contentNode.previousSibling.nodeType === ice.dom.TEXT_NODE && contentNode.previousSibling.length === 0) {
		contentNode.parentNode.removeChild(contentNode.previousSibling);
		}
		if (contentNode.nextSibling && contentNode.nextSibling.nodeType === ice.dom.TEXT_NODE && contentNode.nextSibling.length === 0) {
		contentNode.parentNode.removeChild(contentNode.nextSibling);
		}
		var prevDelNode = this.getIceNode(contentNode.previousSibling, 'deleteType');
		var nextDelNode = this.getIceNode(contentNode.nextSibling, 'deleteType');
		var ctNode;

		if (prevDelNode && this._currentUserIceNode(prevDelNode)) {
		ctNode = prevDelNode;
		ctNode.appendChild(contentNode);
		if (nextDelNode && this._currentUserIceNode(nextDelNode)) {
			var nextDelContents = ice.dom.extractContent(nextDelNode);
			ice.dom.append(ctNode, nextDelContents);
			nextDelNode.parentNode.removeChild(nextDelNode);
		}
		} else if (nextDelNode && this._currentUserIceNode(nextDelNode)) {
		ctNode = nextDelNode;
		ctNode.insertBefore(contentNode, ctNode.firstChild);
		} else {
		ctNode = this.createIceNode('deleteType');
		contentNode.parentNode.insertBefore(ctNode, contentNode);
		ctNode.appendChild(contentNode);
		}

		if (range) {
		if (ice.dom.isStubElement(contentNode)) {
			range.selectNode(contentNode);
		} else {
			range.selectNodeContents(contentNode);
		}
		if (moveLeft) {
			range.collapse(true);
		} else {
			range.collapse();
		}
		contentNode.normalize();
		}
		return true;

	},


	/**
	 * Handles arrow, delete key events, and others.
	 *
	 * @param {event} e The event object.
	 * return {void|boolean} Returns false if default event needs to be blocked.
	 */
	_handleAncillaryKey: function (e) {
		var key = e.keyCode;
		var preventDefault = true;
		var shiftKey = e.shiftKey;

		switch (key) {
		case ice.dom.DOM_VK_DELETE:
			preventDefault = this.deleteContents();
			this.pluginsManager.fireKeyPressed(e);
			break;

		case 46:
			// Key 46 is the DELETE key.
			preventDefault = this.deleteContents(true);
			this.pluginsManager.fireKeyPressed(e);
			break;

		case ice.dom.DOM_VK_DOWN:
		case ice.dom.DOM_VK_UP:
		case ice.dom.DOM_VK_LEFT:
		case ice.dom.DOM_VK_RIGHT:
			this.pluginsManager.fireCaretPositioned();
			preventDefault = false;
			break;

		default:
			// Ignore key.
			preventDefault = false;
			break;
		} //end switch

		if (preventDefault === true) {
		ice.dom.preventDefault(e);
		return false;
		}
		return true;

	},

	keyDown: function (e) {
		if (!this.pluginsManager.fireKeyDown(e)) {
		ice.dom.preventDefault(e);
		return false;
		}

		var preventDefault = false;

		if (this._handleSpecialKey(e) === false) {
		if (ice.dom.isBrowser('msie') !== true) {
			this._preventKeyPress = true;
		}

		return false;
		} else if ((e.ctrlKey === true || e.metaKey === true) && (ice.dom.isBrowser('msie') === true || ice.dom.isBrowser('chrome') === true)) {
		// IE does not fire keyPress event if ctrl is also pressed.
		// E.g. CTRL + B (Bold) will not fire keyPress so this.plugins
		// needs to be notified here for IE.
		if (!this.pluginsManager.fireKeyPressed(e)) {
			return false;
		}
		}

		switch (e.keyCode) {
		case 27:
			// ESC
			break;
		default:
			// If not Firefox then check if event is special arrow key etc.
			// Firefox will handle this in keyPress event.
			if (/Firefox/.test(navigator.userAgent) !== true) {
			preventDefault = !(this._handleAncillaryKey(e));
			}
			break;
		}

		if (preventDefault) {
		ice.dom.preventDefault(e);
		return false;
		}

		return true;
	},

	keyPress: function (e) {
		if (this._preventKeyPress === true) {
		this._preventKeyPress = false;
		return;
		}
		var c = null;
		if (e.which == null) {
		// IE.
		c = String.fromCharCode(e.keyCode);
		} else if (e.which > 0) {
		c = String.fromCharCode(e.which);
		}

		if (!this.pluginsManager.fireKeyPress(e)) { return false; }
		if (e.ctrlKey || e.metaKey) {
			return true;
		}

	// Inside a br - most likely in a placeholder of a new block - delete before handling.
	var range = this.getCurrentRange();
	var br = range && ice.dom.parents(range.startContainer, 'br')[0] || null;
	if (br) {
		range.moveToNextEl(br);
		br.parentNode.removeChild(br);
	}

		// Ice will ignore the keyPress event if CMD or CTRL key is also pressed
		if (c !== null && e.ctrlKey !== true && e.metaKey !== true) {
		switch (e.keyCode) {
			case ice.dom.DOM_VK_DELETE:
			// Handle delete key for Firefox.
			return this._handleAncillaryKey(e);
			case ice.dom.DOM_VK_ENTER:
			return this._handleEnter();
			default:
			// If we are in a deletion, move the range to the end/outside.
			this._moveRangeToValidTrackingPos(range, range.startContainer);
			return this.insert(c);
		}
		}

		return this._handleAncillaryKey(e);
	},

	_handleEnter: function () {
		var range = this.getCurrentRange();
		if (range && !range.collapsed) this.deleteContents();
		return true;
	},

	_handleSpecialKey: function (e) {
		var keyCode = e.which;
		if (keyCode === null) {
		// IE.
		keyCode = e.keyCode;
		}

		var preventDefault = false;
		switch (keyCode) {
		case 65:
			// Check for CTRL/CMD + A (select all).
			if (e.ctrlKey === true || e.metaKey === true) {
			preventDefault = true;
			var range = this.getCurrentRange();

			if (ice.dom.isBrowser('msie') === true) {
				var selStart = this.env.document.createTextNode('');
				var selEnd = this.env.document.createTextNode('');

				if (this.element.firstChild) {
				ice.dom.insertBefore(this.element.firstChild, selStart);
				} else {
				this.element.appendChild(selStart);
				}

				this.element.appendChild(selEnd);

				range.setStart(selStart, 0);
				range.setEnd(selEnd, 0);
			} else {
				range.setStart(range.getFirstSelectableChild(this.element), 0);
				var lastSelectable = range.getLastSelectableChild(this.element);
				range.setEnd(lastSelectable, lastSelectable.length);
			} //end if

			this.selection.addRange(range);
			} //end if
			break;

		default:
			// Not a special key.
			break;
		} //end switch

		if (preventDefault === true) {
		ice.dom.preventDefault(e);
		return false;
		}

		return true;
	},

	mouseUp: function (e, target) {
		if (!this.pluginsManager.fireClicked(e)) return false;
		this.pluginsManager.fireSelectionChanged(this.getCurrentRange());
		return true;
	},

	mouseDown: function (e, target) {
		if (!this.pluginsManager.fireMouseDown(e)) {
			return false;
		}
		this.pluginsManager.fireCaretUpdated();
		return true;
	},

	/* Added by dfl */

	getContentElement : function() {
		return this.element;
	},

	getIceNodes : function() {
		var classList = [];
		var self = this;
		ice.dom.each(this.changeTypes,
			function (type, i) {
				classList.push('.' + self._getIceNodeClass(type));
			});
		classList = classList.join(',');
		return jQuery(this.element).find(classList);
	},

	/**
	 * Returns the first ice node in the hierarchy of the given node, or the current collapsed range.
	 * null if not in a track changes hierarchy
	 */
	currentChangeNode: function (node) {
		var selector = '.' + this._getIceNodeClass('insertType') + ', .' + this._getIceNodeClass('deleteType');
		if (!node) {
			var range = this.getCurrentRange();
			if (!range || !range.collapsed) {
				return false;
			}
			else {
				node = range.startContainer;
			}
		}
		return ice.dom.getNode(node, selector);
	},

	setShowChanges : function(bShow) {
		bShow = !! bShow;
		this._isVisible = bShow;
		var $body = jQuery(this.element);
		$body.toggleClass("ICE-Tracking", bShow);
		this._showTitles(bShow);
		this._setInterval();
	},

	reload : function() {
		this._loadFromDom();
	},

	hasChanges : function() {
		for (var key in this._changes) {
			var change = this._changes[key];
			if (change && change.type) {
				return true;
			}
		}
		return false;
	},

	countChanges : function(options) {
		var changes = this._filterChanges(options);
		return changes.count;
	},

	setChangeData : function(data) {
		if (null == data || (typeof data == "undefined")) {
			data = "";
		}
		this.changeData = String(data);
	},

	_triggerChange : function() {
		jQuery(this).trigger("change");
	},

	_setNodeTitle : function(node, change) {
		if (! change || ! this.titleTemplate) {
			return null;
		}
		var title = this.titleTemplate;
		var time = change ? change.time : parseInt(node.getAttribute(this.timeAttribute) || 0);
		time = new Date(time);
		var userName = (change ? change.username : (node.getAttribute(this.userNameAttribute) || "")) || "(Unknown)";
		title = title.replace(/%t/g, this._relativeDateFormat(time));
		title = title.replace(/%u/g, userName);
		title = title.replace(/%dd/g, padNumber(time.getDate(), 2));
		title = title.replace(/%d/g, time.getDate());
		title = title.replace(/%mm/g, padNumber(time.getMonth() + 1, 2));
		title = title.replace(/%m/g, time.getMonth() + 1);
		title = title.replace(/%yy/g, padNumber(time.getYear() - 100, 2));
		title = title.replace(/%y/g, time.getFullYear());
		title = title.replace(/%nn/g, padNumber(time.getMinutes(), 2));
		title = title.replace(/%n/g, time.getMinutes());
		title = title.replace(/%hh/g, padNumber(time.getHours(), 2));
		title = title.replace(/%h/g, time.getHours());
		node.setAttribute("title", title);

		return title;
	},

	_acceptRejectSome : function(options, isAccept) {
		var f = (function(index, node) {
			this.acceptRejectChange(node, isAccept);
		}).bind(this);
		var changes = this._filterChanges(options);
		for (var id in changes.changes) {
			var nodes = ice.dom.find(this.element, '[' + this.changeIdAttribute + '=' + id + ']');
			nodes.each(f);
		}
		if (changes.count) {
			this._triggerChange();
		}
	},

	/**
	 * Filters the current change set based on options
	 * @param options may contain one of:
	 * exclude: an array of user ids to exclude, include: an array of user ids to include
	 * and
	 * filter: a filter function of the form function({userid, time, data}):boolean
	 *	 @return an object with two members: count, changes (map of id:changeObject)
	 */
	_filterChanges : function(options) {
		var count = 0, changes = {};
		var filter = options && options.filter;
		var exclude = options && options.exclude ? jQuery.map(options.exclude, function(e) { return String(e); }) : null;
		var include = options && options.include ? jQuery.map(options.include, function(e) { return String(e); }) : null;
		for (var key in this._changes) {
			var change = this._changes[key];
			if (change && change.type) {
				var skip = (filter && ! filter({userid: change.userid, time: change.time, data:change.data})) ||
					(exclude && exclude.indexOf(change.userid) >= 0) ||
					(include && include.indexOf(change.userid) < 0);
				if (! skip) {
					++count;
					changes[key] = change;
				}
			}
		}

		return { count : count, changes : changes };
	},

	_loadFromDom : function() {
		this._changes = {};
		this._userStyles = {};
		var myUserId = this.currentUser && this.currentUser.id;
		var myUserName = (this.currentUser && this.currentUser.name) || "";
		var now = (new Date()).getTime();
		// Grab class for each changeType
		var changeTypeClasses = [];
		for (var changeType in this.changeTypes) {
			changeTypeClasses.push(this._getIceNodeClass(changeType));
		}

		var nodes = this.getIceNodes();
		function f(i, el) {
			var styleIndex = 0;
			var ctnType = '';
			var classList = el.className.split(' ');
			//TODO optimize this - create a map of regexp
			for (var i = 0; i < classList.length; i++) {
				var styleReg = new RegExp(this.stylePrefix + '-(\\d+)').exec(classList[i]);
				if (styleReg) styleIndex = styleReg[1];
				var ctnReg = new RegExp('(' + changeTypeClasses.join('|') + ')').exec(classList[i]);
				if (ctnReg) ctnType = this._getChangeTypeFromAlias(ctnReg[1]);
			}
			var userid = ice.dom.attr(el, this.userIdAttribute);
			var userName;
			if (myUserId && (userid == myUserId)) {
				userName = myUserName;
				el.setAttribute(this.userNameAttribute, myUserName)
			}
			else {
				userName = el.getAttribute(this.userNameAttribute);
			}
			this.setUserStyle(userid, Number(styleIndex));
			var changeid = parseInt(ice.dom.attr(el, this.changeIdAttribute) || "");
			if (isNaN(changeid)) {
				changeid = this.getNewChangeId();
				el.setAttribute(this.changeIdAttribute, changeid);
			}
			var timeStamp = parseInt(el.getAttribute(this.timeAttribute) || "");
			if (isNaN(timeStamp)) {
				timeStamp = now;
			}
			var changeData = ice.dom.attr(el, this.changeDataAttribute) || "";
			var change = {
				type: ctnType,
				userid: String(userid),// dfl: must stringify for consistency - when we read the props from dom attrs they are strings
				username: userName,
				time: timeStamp,
				data : changeData
			};
			this._changes[changeid] = change;
			this._setNodeTitle(el, change);
		}
		nodes.each(f.bind(this));
		this._triggerChange();
	},

	_updateUserData : function(user) {
		if (user) {
			for (var key in this._changes) {
				var change = this._changes[key];
				if (change.userid == user.id) {
					change.username = user.name;
				}
			}
		}
		var nodes = this.getIceNodes();
		nodes.each((function(i,node) {
			var match = (! user) || (user.id == node.getAttribute(this.userIdAttribute));
			if (user && match) {
				node.setAttribute(this.userNameAttribute, user.name);
			}
			if (match && this._isVisible) {
				var change = this._changes[node.getAttribute(this.changeIdAttribute)];
				if (change) {
					this._setNodeTitle(node, change);
				}
			}
		}).bind(this))
	},

	_showTitles : function(bShow) {
		var nodes = this.getIceNodes();
		if (bShow) {
			jQuery(nodes).each((function(i, node) {
				var changeId = node.getAttribute(this.changeIdAttribute);
				var change = changeId && this._changes[changeId];
				if (change) {
					this._setNodeTitle(node, change)
				}
			}).bind(this));
		}
		else {
			jQuery(nodes).removeAttr("title");
		}
	},

	_setInterval : function() {
		if (this.isTracking && this.isVisible) {
			if (! this._refreshInterval) {
				this._refreshInterval = setInterval((function() {
					this._updateUserData(null);
				}).bind(this), 60000);
			}
		}
		else {
			if (this._refreshInterval) {
				clearInterval(this._refreshInterval);
				this._refreshInterval = null;
			}
		}
	},

	_relativeDateFormat : function(date, now) {
		if (!date) {
			return "";
		}
		now = now || new Date();
		var today = now.getDate();
		var month = now.getMonth();
		var year = now.getFullYear();

		var t = typeof(date);
		if (t == "string" || t == "number") {
			date = new Date(date);
		}

		var format = "";
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		if (today == date.getDate() && month == date.getMonth() && year == date.getFullYear()) {
			var minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
			if (minutes < 1) {
				return "now";
			}
			else if (minutes < 2) {
				return "1 minute ago";
			}
			else if (minutes < 60) {
				return (minutes + " minutes ago");
			}
			else {
				var hours = date.getHours();
				var minutes = date.getMinutes();
				return "on " + padNumber(hours, 2) + ":" + padNumber(minutes, 2, "0");
			}
		} else if (year == date.getFullYear()) {
			return "on " + months[date.getMonth()] + " " + date.getDate();
		} else {
			return "on " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		}
	}



	};

	exports.ice = this.ice || {};
	exports.ice.InlineChangeEditor = InlineChangeEditor;

}).call(this);
