doInclude ([
	include ("features/base_handler/index.js")
])

/**
 * Save/Load graph from Incidence matrix.
 *
 */
function ShowIncidenceMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
ShowIncidenceMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowIncidenceMatrix.prototype.firstObject = null;
// Path
ShowIncidenceMatrix.prototype.pathObjects = null;

ShowIncidenceMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
	let edgeNames = this.app.graph.edges.map(function(edge) { return edge.GetUpText(); });
	let edgeEnumSelect = $("#incidenceEdgeEnumeration");
	let edgeNamesDialog = $("#incidenceEdgeNamesDialog");
	let edgeNamesList = $("#incidenceEdgeNamesList");
	let currentColumns = [];
	let currentColumnWidths = [];
	let matrixIsValid = false;
	let edgeEnumValue = this.app.currentEnumEdgesType || "";
	if (edgeEnumValue === "Custom")
	{
		edgeEnumValue = "";
	}
	let selectedEdgeEnumValue = edgeEnumValue;
	edgeEnumSelect.find("option:not(:first)").remove();
	this.app.GetEnumVerticesList().forEach(function(item) {
		if (item.value !== "Custom")
		{
			edgeEnumSelect.append($("<option>", { value: item.value, text: item.text }));
		}
	});
	edgeEnumSelect.val(edgeEnumValue);
	$("#IncidenceMatrixField").off("keyup change input");

	dialogButtons[g_save] = function() {
				let matrix = ta.val();
				let rows = {};
				let columns = {};
				let validIncidenceMatrix = handler.app.TestIncidenceMatrix(matrix, rows, columns);

				handler.app.PushToStack("IncidenceMatrixChanged");
				handler.app.SetIncidenceMatrixSmart(matrix);
				if (validIncidenceMatrix)
				{
						handler.app.SetEnumEdgesType(selectedEdgeEnumValue);
					handler.app.graph.edges.forEach(function(edge, edgeIndex) {
						edge.SetUpText(edgeNames[edgeIndex] || "");
					});
					handler.app.redrawGraph();
				}
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	let ta = $("#IncidenceMatrixField");
	let topWrap = $("#incidenceMatrix_top_text");
	let sideWrap = $("#incidenceMatrix_side_text");
	let incidenceMatrix = this.app.GetIncidenceMatrix();

	ta.on("scroll", function() {
		topWrap.scrollLeft(ta.scrollLeft());
		sideWrap.scrollTop(ta.scrollTop());
	});

	$( "#IncidenceMatrixField" ).val(incidenceMatrix.trimEnd());	
	ta.focus()[0].setSelectionRange(0, 0);

	$( "#BadIncidenceMatrixFormatMessage" ).hide();
				
	/* Make side and top text */
	let sideText = "";
	for (let i = 0; i < this.app.graph.vertices.length; i++)
	{
		/* Each vertex name max 3 symbols */
		sideText += this.app.graph.vertices[i].mainText.toString().slice(0, 3) + "\n";		
	}
	$("#incidenceMatrix_side_text_text").html(sideText + "\n");

	let topText = $("#incidenceMatrix_top_text_text");
	let renderEdgeNames = function(columns) {
		topText.empty();
		let columnCount = columns.length > 0 ? columns[0].length : 0;
		for (let edgeIndex = 0; edgeIndex < columnCount; edgeIndex++)
		{
			let edgeName = (edgeNames[edgeIndex] || "").slice(0, 2);
			let columnWidth = Math.max(1, edgeName.length, currentColumnWidths[edgeIndex] || 0);
			for (let rowIndex = 0; rowIndex < columns.length; rowIndex++)
			{
				columnWidth = Math.max(columnWidth, String(columns[rowIndex][edgeIndex]).trim().length);
			}
			topText.append(document.createTextNode(edgeName.slice(0, columnWidth).padStart(columnWidth, " ")));
			if (edgeIndex < columnCount - 1)
			{
				topText.append(document.createTextNode("  "));
			}
		}
	};
	let getMatrixColumnWidths = function(matrix, columnCount) {
		let widths = Array(columnCount).fill(1);
		let rows = matrix.split(/\r?\n/).filter(function(row) { return row.trim().length > 0; });
		rows.forEach(function(row) {
			let cells = row.split(",");
			if (cells.length !== columnCount)
			{
				return;
			}
			cells.forEach(function(cell, columnIndex) {
				let cellWidth = cell.length;
				if (columnIndex > 0 && cell.startsWith(" "))
				{
					cellWidth--;
				}
				widths[columnIndex] = Math.max(widths[columnIndex], cellWidth);
			});
		});
		return widths;
	};
	let getEdgeEnumType = function(value) {
		return handler.app.enumVerticesTextList.find(function(enumType) {
			return enumType.GetValue() === value && value !== "Custom";
		});
	};
	let applyEdgeEnumeration = function(value) {
		if (!matrixIsValid)
		{
			return;
		}
		selectedEdgeEnumValue = value;
		let enumType = getEdgeEnumType(value);
		for (let edgeIndex = 0; edgeIndex < edgeNames.length; edgeIndex++)
		{
			edgeNames[edgeIndex] = enumType ? enumType.GetVertexText(edgeIndex).toString() : "";
		}
		renderEdgeNames(currentColumns);
	};

	edgeEnumSelect.off("change").on("change", function() {
		applyEdgeEnumeration($(this).val());
	});

	$("#editIncidenceEdgeNames").off("click").on("click", function() {
		if (!matrixIsValid)
		{
			return;
		}
		edgeNamesList.val(edgeNames.join("\n"));
		edgeNamesDialog.dialog("open");
	});

	edgeNamesDialog.dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		width: "auto",
		title: $("#EdgeLabel").text().trim(),
		buttons: {
			[g_save]: function() {
				let editedNames = edgeNamesList.val().split(/\r?\n/);
				edgeNames = Array.from({ length: edgeNames.length }, function(_, index) {
					return editedNames[index] || "";
				});
				renderEdgeNames(currentColumns);
				$(this).dialog("close");
			},
			[g_cancel]: function() {
				$(this).dialog("close");
			}
		},
		dialogClass: 'EdgeDialog'
	});

	let updateMatrixState = function() {
		let rows = {};
		let columns = {};
		let isValid = handler.app.TestIncidenceMatrix(ta.val(), rows, columns);
		if (isValid)
		{
			let columnCount = columns.cols.length > 0 ? columns.cols[0].length : 0;
			currentColumns = columns.cols;
			currentColumnWidths = getMatrixColumnWidths(ta.val(), columnCount);
			let enumType = getEdgeEnumType(selectedEdgeEnumValue);
			if (columnCount < edgeNames.length)
			{
				edgeNames.length = columnCount;
			}
			else
			{
				for (let edgeIndex = edgeNames.length; edgeIndex < columnCount; edgeIndex++)
				{
					edgeNames.push(enumType ? enumType.GetVertexText(edgeIndex).toString() : "");
				}
			}
			matrixIsValid = true;
			edgeEnumSelect.prop("disabled", false);
			$("#editIncidenceEdgeNames").prop("disabled", false);
			$("#BadIncidenceMatrixFormatMessage").hide();
			renderEdgeNames(columns.cols);
		}
		else
		{
			matrixIsValid = false;
			edgeEnumSelect.prop("disabled", true);
			$("#editIncidenceEdgeNames").prop("disabled", true);
			$("#BadIncidenceMatrixFormatMessage").show();
		}
	};

	ta.on("input", updateMatrixState);
	updateMatrixState();

	$( "#incidenceMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_incidenceMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog',
		open: function(event, ui) {
			/* Set width for side text */
			topWrap.width(ta.width());
			$("#BadIncidenceMatrixFormatMessage").width(ta.width());
		}
	});
}
