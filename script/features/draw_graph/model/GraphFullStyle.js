/**
 * Graph full style.
 */

function GraphFullStyle(redrawCallback)
{
    this.edgeCommonStyle         = new CommonEdgeStyle();
    this.isEdgeCommonStyleCustom = false;
    this.edgeSelectedStyles      = FullArrayCopy(DefaultSelectedEdgeStyles);
    this.isEdgeSelectedStylesCustom = false;

    this.vertexCommonStyle          = new CommonVertexStyle();
    this.isVertexCommonStyleCustom  = false;
    this.vertexSelectedVertexStyles = FullArrayCopy(DefaultSelectedGraphStyles);
    this.isVertexSelectedVertexStylesCustom  = false;

    this.backgroundCommonStyle = new CommonBackgroundStyle();
    this.isBackgroundCommonStyleCustom  = false;

    this.defaultVertexSize = null;
    this.defaultEdgeWidth = null;
    this.redrawCallback = redrawCallback;
}

GraphFullStyle.prototype.Save = function()
{
    var res = "";
    
    var needEnd    = false;
    var checkValue = [];
    
    checkValue.push({field: "edgeCommonStyle",
                     value: this.edgeCommonStyle,
                     check: this.isEdgeCommonStyleCustom});
    
    checkValue.push({field: "edgeSelectedStyles",
                     value: this.edgeSelectedStyles,
                     check: this.isEdgeSelectedStylesCustom});
    
    checkValue.push({field: "vertexCommonStyle",
                     value: this.vertexCommonStyle,
                     check: this.isVertexCommonStyleCustom});
    
    checkValue.push({field: "vertexSelectedVertexStyles",
                     value: this.vertexSelectedVertexStyles,
                     check: this.isVertexSelectedVertexStylesCustom});
    
    checkValue.push({field: "backgroundCommonStyle",
                     value: this.backgroundCommonStyle,
                     check: this.isBackgroundCommonStyleCustom});

    checkValue.push({field: "defaultVertexSize",
                      value: this.defaultVertexSize,
                      check: this.defaultVertexSize != null}); 

    checkValue.push({field: "defaultEdgeWidth",
                      value: this.defaultEdgeWidth,
                      check: this.defaultEdgeWidth != null});
    
    checkValue.forEach(function(entry) {
            if (!entry.check)
                return;
                
            if (needEnd)
                res = res + ",";

            let valueJson = "";
            if (typeof entry.value.saveToJson === "function") {
                valueJson = entry.value.saveToJson();
            } else {
                valueJson = JSON.stringify(entry.value);
            }
                
                
            res = res + "\"" + entry.field + "\"" + ":" + valueJson;
            needEnd = true;
        });
    
    res = res + "";
    
    return gEncodeToHTML(res);
}

GraphFullStyle.prototype.Load = function(json)
{
    var checkValue = [];
    
    checkValue.push({field: "edgeCommonStyle",
                     value: this.edgeCommonStyle,
                     check: "isEdgeCommonStyleCustom",
                     deep: false});
    
    checkValue.push({field: "edgeSelectedStyles",
                     value: this.edgeSelectedStyles,
                     check: "isEdgeSelectedStylesCustom",
                     deep: true});
    
    checkValue.push({field: "vertexCommonStyle",
                     value: this.vertexCommonStyle,
                     check: "isVertexCommonStyleCustom",
                     deep: false});
    
    checkValue.push({field: "vertexSelectedVertexStyles",
                     value: this.vertexSelectedVertexStyles,
                     check: "isVertexSelectedVertexStylesCustom",
                     deep: true});

    checkValue.push({field: "defaultVertexSize",
                    value: "defaultVertexSize",
                    check: null,
                    deep: false});

    checkValue.push({field: "defaultEdgeWidth",
                    value: "defaultEdgeWidth",
                    check: null,
                    deep: false});
    
    checkValue.push({field: "backgroundCommonStyle",
                     value: this.backgroundCommonStyle,
                     check: "isBackgroundCommonStyleCustom",
                     deep: false});
    
    var decoderStr = gDecodeFromHTML(json);
    var parsedSave = JSON.parse(decoderStr);
    
    var app = this;
    
    checkValue.forEach(function(entry) {
            if (parsedSave.hasOwnProperty(entry.field))
            {
                if (typeof parsedSave[entry.field] === 'number')
                {
                    app[entry.value] = parseInt(parsedSave[entry.field]);
                }
                else
                {
                    if (typeof entry.value.loadFromJson === "function") {
                        entry.value.loadFromJson(parsedSave[entry.field], function () {
                                setTimeout( 
                                    function() 
                                    { 
                                        if (app.redrawCallback != null)
                                        {
                                            app.redrawCallback();
                                        } 
                                    }, 1000);
                            });
                        if (entry.check != null)
                            app[entry.check] = true;
                        return;
                    }

                    if (!entry.deep)
                        entry.value.Clear();

                    //console.log(parsedSave[entry.field]);
                    for(var k in parsedSave[entry.field])
                    {
                        if (!entry.deep)
                        {
                            if (entry.value.ShouldLoad(k))
                            {
                                entry.value[k] = parsedSave[entry.field][k];
                            }
                        }
                        else
                        {
                            // Check is number or not
                            if (k % 1 != 0)
                            {
                                continue;
                            }

                            // Old saves contains more styles. Just skip it.
                            if (entry.value[k] == undefined)
                            {
                                continue;
                            }

                            entry.value[k].Clear();
                            for(var deepK in parsedSave[entry.field][k])
                            {
                                if (k < entry.value.length && entry.value[k].ShouldLoad(deepK))
                                    entry.value[k][deepK] = parsedSave[entry.field][k][deepK];
                            }
                        }
                    }
                }
                
                if (entry.check != null)
                    app[entry.check] = true;
            }
        });
}
