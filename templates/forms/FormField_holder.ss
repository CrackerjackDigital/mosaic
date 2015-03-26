<% if isDisabled %>
<dl class="field $extraClass $Name">
	<dt><% if $RightTitle %>$RightTitle<% else %>$Title<% end_if %></dt>
	<dd>$Value</dd>
</dl>
<% end_if %>
<div id="$Name" class="field $extraClass">
	<label class="title" for="$ID">$Title</label>
	$Field
</div>
<% if $Message %><span class="message $MessageType">$Message</span><% end_if %>
<% if $Description %><span class="description">$Description</span><% end_if %>
