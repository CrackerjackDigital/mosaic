<% require javascript(gallery/javascript/GalleryUploadField.js) %>
<% require css(gallery/css/GalleryUploadField.css) %>

<% if isDisabled || isReadonly %>

	<% if isSaveable %>
	<% else %>
		<div class="ss-uploadfield-item">
			<em><% _t('FileIFrameField.ATTACHONCESAVED2', 'Files can be attached once you have saved the record for the first time.') %></em>
		</div>
	<% end_if %>

<% else %>

	<div class="ss-uploadfield-addfile" <% if not $displayInput %>style="display: none;"<% end_if %>>
		<div class="ss-uploadfield-item-preview ss-uploadfield-dropzone ui-corner-all">
			<div>
				<% _t('PostableWidget.DROPFILES', 'Drop') %>
			</div>
		</div>
		<div class="ss-uploadfield-item-info">
<!--
			<label class="ss-uploadfield-item-name">
				<% if $multiple %>
					<% _t('PostableWidget.ATTACHFILES', 'Attach files') %>
				<% else %>
					<% _t('PostableWidget.ATTACHFILE', 'Attach a file') %>
				<% end_if %>
			</label>
-->
			<label class="ss-uploadfield-fromcomputer ss-ui-button ui-corner-all" title="<% _t('PostableWidget.FROMCOMPUTERINFO', 'Upload from your computer') %>" data-icon="drive-upload">
				<div>
						<% _t('PostableWidget.FROMCOMPUTER', 'Upload...') %>
				</div>
				<input id="$id" name="{$Name}[Uploads][]" class="$extraClass ss-uploadfield-fromcomputer-fileinput" data-config="$configString" type="file"<% if $multiple %> multiple="multiple"<% end_if %> />
			</label>
<!--
			<button class="ss-uploadfield-fromfiles ss-ui-button ui-corner-all" data-icon="network-cloud"><% _t('PostableWidget.FROMFILES', 'From files') %></button>
-->
			<% if not $autoUpload %>
				<button class="ss-uploadfield-startall ss-ui-button ui-corner-all" title="<% _t('PostableWidget.STARTALLINFO', 'Start all uploads') %>" data-icon="navigation"><% _t('PostableWidget.STARTALL', 'Start all') %></button>
			<% end_if %>
		</div>
	</div>

<% end_if %>


<ul class="ss-uploadfield-files galleryfield-files files">
	<% if $CustomisedItems %>
		<% loop $CustomisedItems %>
			<li class="ss-uploadfield-item template-download" data-fileid="$ID">

				<div class="ss-uploadfield-item-preview preview">
					<img alt="$hasRelation" src="$UploadFieldThumbnailURL" />
				</div>

				<div class="ss-uploadfield-item-info">
					<input type='hidden' value='$ID' name='{$Top.Name}[Files][]' />
					<label class="ss-uploadfield-item-name">
						<b>{$Title}.{$Extension}</b>
						<span>$Size</span>
						<div class="clear"><!-- --></div>
					</label>

					<div class="ss-uploadfield-item-actions">
						<% if Top.isDisabled || Top.isReadonly %>
						<% else %>
							$UploadFieldFileButtons
						<% end_if %>
					</div>
				</div>

				<div class="ss-uploadfield-item-editform includeParent">
					<iframe frameborder="0" data-src="$UploadFieldEditLink" src="about:blank"></iframe>
				</div>

			</li>
		<% end_loop %>
	<% end_if %>
</ul>

