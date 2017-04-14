<?php if (!defined('PmWiki')) exit();
/*  Copyright 2005-2014 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.
*/

# $InputAttrs are the attributes we allow in output tags
SDV($InputAttrs, array('name', 'value', 'id', 'class', 'rows', 'cols', 
  'size', 'maxlength', 'action', 'method', 'accesskey', 'tabindex', 'multiple',
  'checked', 'disabled', 'readonly', 'enctype', 'src', 'alt',
  'required', 'placeholder', 'autocomplete'
  ));

# Set up formatting for text, submit, hidden, radio, etc. types
foreach(array('text', 'submit', 'hidden', 'password', 'radio', 'checkbox',
              'reset', 'file', 'image') as $t) 
  SDV($InputTags[$t][':html'], "<input type='$t' \$InputFormArgs />");
SDV($InputTags['text']['class'], 'inputbox');
SDV($InputTags['password']['class'], 'inputbox');
SDV($InputTags['submit']['class'], 'inputbutton');
SDV($InputTags['reset']['class'], 'inputbutton');
SDV($InputTags['radio'][':checked'], 'checked');
SDV($InputTags['checkbox'][':checked'], 'checked');

# (:input form:)
SDVA($InputTags['form'], array(
  ':args' => array('action', 'method'),
  ':html' => "<form \$InputFormArgs>",
  'method' => 'post'));

# (:input end:)
SDV($InputTags['end'][':html'], '</form>');

# (:input textarea:)
SDVA($InputTags['textarea'], array(
  ':content' => array('value'),
  ':attr' => array_diff($InputAttrs, array('value')),
  ':html' => "<textarea \$InputFormArgs>\$InputFormContent</textarea>"));

# (:input image:)
SDV($InputTags['image'][':args'], array('name', 'src', 'alt'));

# (:input select:)
SDVA($InputTags['select-option'], array(
  ':args' => array('name', 'value', 'label'),
  ':content' => array('label', 'value', 'name'),
  ':attr' => array('value', 'selected'),
  ':checked' => 'selected',
  ':html' => "<option \$InputFormArgs>\$InputFormContent</option>"));
SDVA($InputTags['select'], array(
  'class' => 'inputbox',
  ':html' => "<select \$InputSelectArgs>\$InputSelectOptions</select>"));

# (:input defaults?:)
SDVA($InputTags['default'], array(':fn' => 'InputDefault'));
SDVA($InputTags['defaults'], array(':fn' => 'InputDefault'));

##  (:input ...:) directives
Markup_e('input', 'directives',
  '/\\(:input\\s+(\\w+)(.*?):\\)/i',
  "InputMarkup(\$pagename, \$m[1], \$m[2])");

##  (:input select:) has its own markup processing
Markup_e('input-select', '<input',
  '/\\(:input\\s+select\\s.*?:\\)(?:\\s*\\(:input\\s+select\\s.*?:\\))*/i',
  "InputSelect(\$pagename, 'select', \$m[0])");

##  The 'input+sp' rule combines multiple (:input select ... :)
##  into a single markup line (to avoid split line effects)
Markup('input+sp', '<split', 
  '/(\\(:input\\s+select\\s(?>.*?:\\)))\\s+(?=\\(:input\\s)/', '$1');

SDV($InputFocusFmt, 
  "<script language='javascript' type='text/javascript'><!--
   document.getElementById('\$InputFocusId').focus();//--></script>");

##  InputToHTML performs standard processing on (:input ...:) arguments,
##  and returns the formatted HTML string.
function InputToHTML($pagename, $type, $args, &$opt) {
  global $InputTags, $InputAttrs, $InputValues, $FmtV, $KeepToken,
    $InputFocusLevel, $InputFocusId, $InputFocusFmt, $HTMLFooterFmt;
  if (!@$InputTags[$type]) return "(:input $type $args:)";
  ##  get input arguments
  if (!is_array($args)) $args = ParseArgs($args, '(?>([\\w-]+)[:=])');
  ##  convert any positional arguments to named arguments
  $posnames = @$InputTags[$type][':args'];
  if (!$posnames) $posnames = array('name', 'value');
  while (count($posnames) > 0 && count(@$args['']) > 0) {
    $n = array_shift($posnames);
    if (!isset($args[$n])) $args[$n] = array_shift($args['']);
  }
  ##  merge defaults for input type with arguments
  $opt = array_merge($InputTags[$type], $args);
  ## www.w3.org/TR/html4/types
  if(isset($opt['id'])) $opt['id'] = preg_replace('/[^-A-Za-z0-9:_.]+/', '_', $opt['id']);
  ##  convert any remaining positional args to flags
  foreach ((array)@$opt[''] as $a) 
    { $a = strtolower($a); if (!isset($opt[$a])) $opt[$a] = $a; }
  if (isset($opt['name'])) {
    $opt['name'] = preg_replace('/^\\$:/', 'ptv_', @$opt['name']);
    $opt['name'] = preg_replace('/[^-A-Za-z0-9:_.\\[\\]]+/', '_', $opt['name']);
    $name = $opt['name'];
    ##  set control values from $InputValues array
    ##  radio, checkbox, select, etc. require a flag of some sort,
    ##  others just set 'value'
    if (isset($InputValues[$name])) {
      $checked = @$opt[':checked'];
      if ($checked) {
        $opt[$checked] = in_array(@$opt['value'], (array)$InputValues[$name])
                         ? $checked : false;
      } else if (!isset($opt['value'])) $opt['value'] = $InputValues[$name];
    }
  }
  ##  build $InputFormContent
  $FmtV['$InputFormContent'] = '';
  foreach((array)@$opt[':content'] as $a)
    if (isset($opt[$a])) { $FmtV['$InputFormContent'] = $opt[$a]; break; }
  ##  hash and store any "secure" values
  if (@$opt['secure'] == '#') $opt['secure'] = rand();
  if (@$opt['secure'] > '') {
    $md5 = md5($opt['secure'] . $opt['value']);
    @session_start(); 
    $_SESSION['forms'][$md5] = $opt['value'];
    $opt['value'] = $md5;
  }
  ##  handle focus=# option
  $focus = @$opt['focus'];
  if (isset($focus)
      && (!isset($InputFocusLevel) || $focus < $InputFocusLevel)) {
    if (!isset($opt['id'])) $opt['id'] = "wikifocus$focus";
    $InputFocusLevel = $focus;
    $InputFocusId = $opt['id'];
    $HTMLFooterFmt['inputfocus'] = $InputFocusFmt;
  }
  ##  build $InputFormArgs from $opt
  $attrlist = (isset($opt[':attr'])) ? $opt[':attr'] : $InputAttrs;
  $attr = array();
  foreach ($attrlist as $a) {
    if (!isset($opt[$a]) || $opt[$a]===false) continue;
    if(strpos($opt[$a], $KeepToken)!== false) # multiline textarea/hidden fields
      $opt[$a] = Keep(str_replace("'", '&#39;', MarkupRestore($opt[$a]) ));
    $attr[] = "$a='".str_replace("'", '&#39;', $opt[$a])."'";
  }
  $FmtV['$InputFormArgs'] = implode(' ', $attr);
  return FmtPageName($opt[':html'], $pagename);
}


##  InputMarkup handles the (:input ...:) directive.  It either
##  calls any function given by the :fn element of the corresponding
##  tag, or else just returns the result of InputToHTML().
function InputMarkup($pagename, $type, $args) {
  global $InputTags;
  $fn = @$InputTags[$type][':fn'];
  if ($fn) return $fn($pagename, $type, $args);
  return Keep(InputToHTML($pagename, $type, $args, $opt));
}


##  (:input default:) directive.
function InputDefault($pagename, $type, $args) {
  global $InputValues, $PageTextVarPatterns, $PCache;
  $args = ParseArgs($args);
  $args[''] = (array)@$args[''];
  $name = (isset($args['name'])) ? $args['name'] : array_shift($args['']);
  $name = preg_replace('/^\\$:/', 'ptv_', $name);
  $value = (isset($args['value'])) ? $args['value'] : array_shift($args['']);
  if (!isset($InputValues[$name])) $InputValues[$name] = $value;
  if (@$args['request']) {
    $req = array_merge($_GET, $_POST);
    foreach($req as $k => $v) 
      if (!isset($InputValues[$k])) 
        $InputValues[$k] = PHSC(stripmagic($v), ENT_NOQUOTES);
  }
  $sources = @$args['source'];
  if ($sources) {
    foreach(explode(',', $sources) as $source) {
      $source = MakePageName($pagename, $source);
      if (!PageExists($source)) continue;
      $page = RetrieveAuthPage($source, 'read', false, READPAGE_CURRENT);
      if (! $page || ! isset($page['text'])) continue;
      foreach((array)$PageTextVarPatterns as $pat)
        if (preg_match_all($pat, IsEnabled($PCache[$source]['=preview'], $page['text']), 
          $match, PREG_SET_ORDER))
          foreach($match as $m)
#           if (!isset($InputValues['ptv_'.$m[2]])) PITS:01337
              $InputValues['ptv_'.$m[2]] = 
                PHSC(Qualify($source, $m[3]), ENT_NOQUOTES);
      break;
    }
  }
  return '';
}


##  (:input select ...:) is special, because we need to process a bunch of
##  them as a single unit.
function InputSelect($pagename, $type, $markup) {
  global $InputTags, $InputAttrs, $FmtV;
  preg_match_all('/\\(:input\\s+\\S+\\s+(.*?):\\)/', $markup, $match);
  $selectopt = (array)$InputTags[$type];
  $opt = $selectopt;
  $optionshtml = '';
  $optiontype = isset($InputTags["$type-option"]) 
                ? "$type-option" : "select-option";
  foreach($match[1] as $args) {
    $optionshtml .= InputToHTML($pagename, $optiontype, $args, $oo);
    $opt = array_merge($opt, $oo);
  }
  $attrlist = array_diff($InputAttrs, array('value'));
  $attr = array();
  foreach($attrlist as $a) {
    if (!isset($opt[$a]) || $opt[$a]===false) continue;
    $attr[] = "$a='".str_replace("'", '&#39;', $opt[$a])."'";
  }
  $FmtV['$InputSelectArgs'] = implode(' ', $attr);
  $FmtV['$InputSelectOptions'] = $optionshtml;
  return Keep(FmtPageName($selectopt[':html'], $pagename));
}


function InputActionForm($pagename, $type, $args) {
  global $InputAttrs;
  $args = ParseArgs($args);
  if (@$args['pagename']) $pagename = $args['pagename'];
  $opt = NULL;
  $html = InputToHTML($pagename, $type, $args, $opt);
  foreach(preg_grep('/^[\\w$]/', array_keys($args)) as $k) {
    if (is_array($args[$k]) || in_array($k, $InputAttrs)) continue;
    if ($k == 'n' || $k == 'pagename') continue;
    $html .= "<input type='hidden' name='$k' value='{$args[$k]}' />";
  }
  return Keep($html);
}


## RequestArgs is used to extract values from controls (typically
## in $_GET and $_POST).
function RequestArgs($req = NULL) {
  if (is_null($req)) $req = array_merge($_GET, $_POST);
  foreach ($req as $k => $v) $req[$k] = stripmagic($req[$k]);
  return $req;
}


## Form-based authorization prompts (for use with PmWikiAuth)
SDVA($InputTags['auth_form'], array(
  ':html' => "<form \$InputFormArgs>\$PostVars",
  'action' => str_replace("'", '%37', stripmagic($_SERVER['REQUEST_URI'])),
  'method' => 'post',
  'name' => 'authform'));
SDV($AuthPromptFmt, array(&$PageStartFmt, 'page:$SiteGroup.AuthForm',
  "<script language='javascript' type='text/javascript'><!--
    try { document.authform.authid.focus(); }
    catch(e) { document.authform.authpw.focus(); } //--></script>",
  &$PageEndFmt));

## PITS:01188, these should exist in "browse" mode
## NOTE: also defined in prefs.php
XLSDV('en', array(
  'ak_save' => 's',
  'ak_saveedit' => 'u',
  'ak_preview' => 'p',
  'ak_textedit' => ',',
  'e_rows' => '23',
  'e_cols' => '60'));

## The section below handles specialized EditForm pages.
## We don't bother to load it if we're not editing.

if ($action != 'edit') return;

SDV($PageEditForm, '$SiteGroup.EditForm');
SDV($PageEditFmt, '$EditForm');
if (@$_REQUEST['editform']) {
  $PageEditForm=$_REQUEST['editform'];
  $PageEditFmt='$EditForm';
}
$Conditions['e_preview'] = '(boolean)$_REQUEST["preview"]';

# (:e_preview:) displays the preview of formatted text.
Markup_e('e_preview', 'directives',
  '/^\\(:e_preview:\\)/',
  "isset(\$GLOBALS['FmtV']['\$PreviewText']) ? Keep(\$GLOBALS['FmtV']['\$PreviewText']): ''");

# If we didn't load guiedit.php, then set (:e_guibuttons:) to
# simply be empty.
Markup('e_guibuttons', 'directives', '/\\(:e_guibuttons:\\)/', '');

# Prevent (:e_preview:) and (:e_guibuttons:) from 
# participating in text rendering step.
SDV($SaveAttrPatterns['/\\(:e_(preview|guibuttons):\\)/'], ' ');

SDVA($InputTags['e_form'], array(
  ':html' => "<form action='{\$PageUrl}?action=edit' method='post'
    \$InputFormArgs><input type='hidden' name='action' value='edit' 
    /><input type='hidden' name='n' value='{\$FullName}' 
    /><input type='hidden' name='basetime' value='\$EditBaseTime' 
    />"));
SDVA($InputTags['e_textarea'], array(
  ':html' => "<textarea \$InputFormArgs 
    onkeydown='if (event.keyCode==27) event.returnValue=false;' 
    >\$EditText</textarea>",
  'name' => 'text', 'id' => 'text', 'accesskey' => XL('ak_textedit'),
  'rows' => XL('e_rows'), 'cols' => XL('e_cols')));
SDVA($InputTags['e_author'], array(
  ':html' => "<input type='text' \$InputFormArgs />",
  'name' => 'author', 'value' => $Author));
SDVA($InputTags['e_changesummary'], array(
  ':html' => "<input type='text' \$InputFormArgs />",
  'name' => 'csum', 'size' => '60', 'maxlength' => '100',
  'value' => PHSC(stripmagic(@$_POST['csum']), ENT_QUOTES)));
SDVA($InputTags['e_minorcheckbox'], array(
  ':html' => "<input type='checkbox' \$InputFormArgs />",
  'name' => 'diffclass', 'value' => 'minor'));
if (@$_POST['diffclass']=='minor') 
  SDV($InputTags['e_minorcheckbox']['checked'], 'checked');
SDVA($InputTags['e_savebutton'], array(
  ':html' => "<input type='submit' \$InputFormArgs />",
  'name' => 'post', 'value' => ' '.XL('Save').' ', 
  'accesskey' => XL('ak_save')));
SDVA($InputTags['e_saveeditbutton'], array(
  ':html' => "<input type='submit' \$InputFormArgs />",
  'name' => 'postedit', 'value' => ' '.XL('Save and edit').' ',
  'accesskey' => XL('ak_saveedit')));
SDVA($InputTags['e_savedraftbutton'], array(':html' => ''));
SDVA($InputTags['e_previewbutton'], array(
  ':html' => "<input type='submit' \$InputFormArgs />",
  'name' => 'preview', 'value' => ' '.XL('Preview').' ', 
  'accesskey' => XL('ak_preview')));
SDVA($InputTags['e_cancelbutton'], array(
  ':html' => "<input type='submit' \$InputFormArgs />",
  'name' => 'cancel', 'value' => ' '.XL('Cancel').' ' ));
SDVA($InputTags['e_resetbutton'], array(
  ':html' => "<input type='reset' \$InputFormArgs />",
  'value' => ' '.XL('Reset').' '));

